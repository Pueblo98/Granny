/* Controlled direct browsing. Canonical items and memberships live in the store. */
(() => {
  'use strict';
  const el = (tag, cls, text) => { const n = document.createElement(tag); n.className = cls || ''; if (text !== undefined) n.textContent = text; return n; };
  const action = (id, text, fn, cls = 'text-button') => {
    const b = el('button', cls, text); b.type = 'button'; b.id = id; b.addEventListener('click', fn); return b;
  };
  function portrait(room, missing) {
    const slot = el('span', 'art-slot library-portrait');
    const fallback = () => { slot.replaceChildren(el('span', 'art-fallback', room.custom ? 'Plain room' : 'Artwork unavailable')); };
    if (!room.portrait || missing) fallback();
    else {
      const image = el('img'); image.alt = ''; image.src = room.portrait;
      image.addEventListener('error', fallback, {once: true}); slot.append(image);
    }
    return slot;
  }
  function render(host, o) {
    const {store, route, query, go} = o;
    const names = {rooms: 'Rooms', 'room-search': 'Search all rooms', 'all-items': 'All items', unfiled: 'Unfiled', 'archived-rooms': 'Archived rooms'};
    const section = el('section', 'room-library rooms-system'); section.dataset.libraryView = route;
    const h = el('h1', '', names[route]); h.tabIndex = -1; section.append(h);
    section.append(el('p', 'room-intro', route === 'rooms' ? 'Choose a room, search everything, or browse without a room.' :
      route === 'archived-rooms' ? 'Archived rooms are hidden from Home, but their items stay available.' :
      route === 'room-search' ? 'Find an item without choosing a room first.' : 'Everything stays available even when it is not in a room.'));
    const nav = el('nav', 'room-actions library-navigation'); nav.setAttribute('aria-label', 'Room library navigation');
    for (const [id, label, destination] of [['library-search-route','Search all rooms','room-search'], ['library-all-items','All items','all-items'], ['library-unfiled','Unfiled','unfiled']]) {
      const b = action(id, label, () => go(destination));
      if (route === destination) b.setAttribute('aria-current', 'page'); nav.append(b);
    }
    nav.append(action('create-room','Create a room',o.onCreate));
    if (route === 'rooms') nav.append(action('library-archived','Archived rooms',()=>go('archived-rooms')));
    else nav.append(action('library-back-to-rooms','Back to Rooms',()=>go('rooms')));
    nav.append(action('library-home','Back to Home',o.onHome)); section.append(nav);
    if (store.availability === 'offline') {
      const banner = el('section', 'rooms-banner');
      banner.append(el('h2','','You’re offline — simulated'), el('p','','You can browse and search the fictional items already in this tab. No server search, new content or cross-room updates are available. Nothing is saved across a restart.'),
        action('rooms-try-again','Try again',o.retry), action('browse-saved','Browse local items',()=>go('all-items'))); section.append(banner);
    }
    if (route === 'rooms' || route === 'archived-rooms') {
      if (route === 'rooms' && store.availability === 'loading') {
        const loading = el('section', 'rooms-loading'); loading.setAttribute('aria-busy','true');
        loading.append(el('h2','','Loading rooms…'),el('p','','Simulated loading. Your conversation and All items are still available.'));
        const inert = el('div','room-library-list'); inert.setAttribute('aria-hidden','true');
        for (let i=0;i<3;i++) inert.append(el('div','room-loading-placeholder'));
        loading.append(inert); section.append(loading,action('rooms-finish-loading','Show local rooms',o.retry));
      } else {
        const rooms = route === 'rooms' ? store.activeRooms : store.rooms.filter(r=>r.archived);
        const list = el('div','room-library-list');
        rooms.forEach(room => {
          const entry = action('library-room-'+room.id,'',()=>o.onOpenRoom(room.id),'library-entry');
          entry.dataset.roomId = room.id;
          entry.append(portrait(room, store.availability === 'missing-art' && room.id === 'garden'));
          const copy = el('span','library-copy'); copy.append(el('strong','',room.name),el('span','',room.purpose)); entry.append(copy);
          if (room.archived) {
            const row = el('article','archived-room');
            // Archived identity is not an entry until explicitly restored.
            const identity = el('div','archived-identity'); identity.append(...entry.childNodes);
            row.append(identity,el('p','','Archived'),action('restore-'+room.id,'Restore '+room.name,()=>o.restore(room.id)));
            list.append(row);
          } else list.append(entry);
        });
        if (!rooms.length) list.append(el('h2','',route === 'rooms'?'No rooms yet':'No archived rooms'),
          el('p','','You can still ask Granny anything or browse All items. Creating a room is optional.'));
        section.append(list);
      }
    } else {
      const label = el('label','',route === 'room-search'?'Search all rooms':route === 'unfiled'?'Search Unfiled':'Search all items'); label.htmlFor='library-search';
      const field = el('div','library-search-field'), input = el('input'); input.id='library-search'; input.type='search'; input.value=query;
      input.placeholder='Find a fictional item';
      const clear = action('library-clear','Clear',()=>{input.value='';o.onQuery('');filter();input.focus();});
      field.append(input,clear); section.append(label,field);
      const status = el('p','library-result-count'); status.id='library-result-count'; status.setAttribute('role','status');
      const results = el('div','library-item-results'); results.id='library-search-results'; section.append(status,results);
      function filter() {
        results.replaceChildren(); const q=input.value.trim().toLocaleLowerCase();
        if (route==='room-search'&&!q) {status.textContent='Type a word to search these fictional local items.';return;}
        const items = store.items().filter(i=>i.sensitivity!=='private' && (route!=='unfiled'||!store.memberships(i.id).length))
          .filter(i=>[i.title,i.type,i.summary,...store.roomNames(i.id)].join(' ').toLocaleLowerCase().includes(q));
        status.textContent=items.length+' result'+(items.length===1?'':'s');
        if(!items.length)results.append(el('p','',q?'No matching items. Try another word or Clear.':route==='unfiled'?'Nothing is unfiled. Items without a room will appear here.':'No available items in this fixture. You can still ask Granny anything.'));
        items.forEach(item=>{
          const row=action('library-item-'+item.id,'',()=>o.onOpenItem(item.id),'library-item-result'); row.dataset.itemId=item.id;
          const sources=store.roomNames(item.id);
          row.append(el('strong','',item.title),el('span','',(item.type||'Fictional item')+' · '+(sources.join(', ')||'Not in a room')));results.append(row);
        });
      }
      input.addEventListener('input',()=>{o.onQuery(input.value);filter();});
      input.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();clear.click();}});filter();
    }
    host.append(section);
  }
  window.GrannyRoomLibrary={render};
})();
