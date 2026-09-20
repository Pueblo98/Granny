/* One fixture-driven room system. Connected mode may export only a bounded,
 * non-private current-Room context object; credentials stay in the backend. */
(() => {
  'use strict';
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const action = (id, text, fn, cls = 'text-button') => {
    const b = el('button', cls, text); b.type = 'button'; b.id = id;
    b.addEventListener('click', fn); return b;
  };
  const art = (src, cls) => {
    const frame = el('span', 'art-slot ' + cls), image = el('img');
    image.alt = ''; image.src = src; frame.setAttribute('aria-hidden', 'true');
    // Retain slot geometry on failure, so decoration cannot move controls.
    image.addEventListener('error', () => image.remove(), {once: true});
    frame.append(image); return frame;
  };
  const heading = (tag, text) => { const h = el(tag, '', text); h.tabIndex = -1; return h; };
  function create(host, options) {
    const store = window.GrannyRoomsStore.create(window.GrannyRoomFixtures);
    const modal = window.GrannyRoomDialog.create();
    let route = '', listReturn = null;
    const queries = {};
    const states = new Map();
    function fitAtmosphere() {
      const art = host.querySelector('.room-atmosphere');
      if (!art || !art.getClientRects().length) return;
      const bounds = art.getBoundingClientRect();
      const symbols = host.querySelector('.overview-symbols');
      const reading = host.querySelector('.room-conversation');
      // Fade boundaries follow real content, independently of image scale.
      if (symbols) art.style.setProperty('--room-browse-start',
        Math.max(0, symbols.getBoundingClientRect().top - bounds.top) + 'px');
      if (reading) art.style.setProperty('--room-reading-end',
        Math.max(0, reading.getBoundingClientRect().right - bounds.left) + 'px');
    }
    new ResizeObserver(fitAtmosphere).observe(host);
    const current = () => store.activeRooms.find(room => route === 'room:' + room.id);
    const stateFor = room => {
      if (!states.has(room.id)) states.set(room.id, {view: 'overview', collection: '', item: '', query: '',
        source: null, excluded: new Set(), turns: [], itemReturn: null, fromSource: false, expanded: false, crossSource: null, inspectSource: null});
      return states.get(room.id);
    };
    function focus(selector, top = false) {
      const target = host.querySelector(selector);
      requestAnimationFrame(() => {
        // A quick next navigation can replace the view before this frame.
        // Never focus an unrelated matching heading in the new view.
        if (!target?.isConnected) return;
        target.focus({preventScroll: true});
        if (top) window.scrollTo(0, 0);
      });
    }
    function change(room, view, selector = 'h1') {
      stateFor(room).view = view; render(); focus(selector, true);
    }
    const safeItem = id => store.items().find(i => i.id === id && i.sensitivity !== 'private');
    const roomName = id => store.rooms.find(r => r.id === id)?.name || 'Removed room';
    function refresh() { render(); options.changed(); options.refresh?.(); }
    function closeChange(message, target) {
      refresh(); modal.close(); options.announce(message);
      if (target) focus(target);
    }
    function editRoom(id, invoker) {
      const room = id ? store.room(id) : null;
      modal.show(room ? 'Room details' : 'Create a room', body => window.GrannyRoomCreate.mount(body, {
        room, cancel: () => modal.close(), manage: room ? () => manageRoom(id) : null,
        save: values => {
          const updated = room ? store.updateRoom(id, values) : store.createRoom(values);
          if (room) closeChange(updated.name + ' updated. Nothing was moved or deleted.', '#room-details');
          else {
            modal.close(false); options.changed();
            options.open('rooms', 'library-room-' + updated.id);
            options.announce(updated.name + ' created for this tab only.');
          }
        }
      }), true, invoker);
    }
    function manageRoom(id) {
      const room = store.room(id);
      modal.show('Manage ' + room.name, body => body.append(
        el('p','','Archive hides this room without deleting anything. Deleting the room and deleting its items are separate choices.'),
        action('archive-room','Archive room',()=>archiveRoom(id)),
        action('delete-room-route','Delete room only…',()=>deleteRoom(id)),
        action('delete-items-route','Delete underlying items…',()=>deleteItems(id)),
        action('room-dialog-cancel','Cancel',()=>modal.close())));
    }
    function archiveRoom(id) {
      const room = store.room(id);
      modal.show('Archive ' + room.name + '?', body => body.append(
        el('p','',room.name + ' will be hidden from Home and the Rooms library. Its items stay in All items. Restore returns the same room and organization.'),
        el('p','','Nothing will be deleted.'),
        action('confirm-archive','Archive room',()=>{
          store.archive(id); states.delete(id); modal.close(false); options.changed(); options.open('rooms'); options.announce(room.name+' archived. Items remain in All items.');
        },'primary'), action('room-dialog-cancel','Cancel',()=>modal.close())));
    }
    function deleteRoom(id) {
      const room = store.room(id), members = store.items().filter(i=>store.memberships(i.id).some(m=>m.roomId===id));
      const shared = members.filter(i=>store.memberships(i.id).some(m=>m.roomId!==id)).length;
      modal.show('Delete ' + room.name + ' room?', body => body.append(
        el('p','',room.name + ' and its organization will be removed. Items will not be deleted; they stay in All items.'),
        el('p','',members.length+' fictional references: '+shared+' also in other rooms; '+(members.length-shared)+' will become Unfiled. No external originals or active tasks are deleted.'),
        action('confirm-delete-room','Delete room only',()=>{
          store.deleteRoom(id); states.delete(id); modal.close(false); options.changed(); options.open('rooms'); options.announce(room.name+' removed. All items were kept.');
        },'danger'), action('archive-instead','Archive instead',()=>archiveRoom(id)),
        action('room-dialog-cancel','Cancel',()=>modal.close()),
        action('delete-items-route','Delete underlying items…',()=>deleteItems(id),'room-management-route text-button')));
    }
    function deleteItems(id) {
      const room = store.room(id);
      const items = store.items().filter(i=>i.sensitivity!=='private'&&store.memberships(i.id).some(m=>m.roomId===id));
      const selected = new Set(items.map(i=>i.id));
      modal.show('Delete '+room.name+' items?', body => {
        body.append(el('p','eyebrow','Separate underlying-data deletion'),el('p','','Select the exact fictional items to remove from Granny, not just their room membership.'));
        const list=el('fieldset','delete-item-list'); list.append(el('legend','','Items to delete'));
        const commit=action('confirm-delete-items','',()=>{
          store.deleteItems([...selected]); states.clear(); modal.close(false); options.changed(); options.open('all-items');
          options.announce(selected.size+' fictional items deleted from this tab. No external original was changed.');
        },'danger');
        const update=()=>{commit.textContent='Delete '+selected.size+' item'+(selected.size===1?'':'s');commit.disabled=!selected.size;};
        items.forEach(item=>{
          const label=el('label','delete-item-row'), input=el('input');input.type='checkbox';input.checked=true;input.value=item.id;
          input.addEventListener('change',()=>{input.checked?selected.add(item.id):selected.delete(item.id);update();});
          const copy=el('span');copy.append(el('strong','',item.title),el('span','',(item.type||'Item')+' · '+(item.provenance||'Local fictional fixture')));
          label.append(input,copy);list.append(label);
        });
        body.append(list,el('p','','Only the listed in-memory items are included. Originals in external apps or files are not included. No external originals exist in this fixture.'),
          el('p','','This cannot be undone in this prototype. Reload or Reset fixture restores the fictional starting data.'),commit,action('room-dialog-cancel','Cancel',()=>modal.close()));update();
      });
    }
    function organize(itemId, sourceRoomId, invoker) {
      const item=safeItem(itemId);if(!item)return;
      const memberships=store.memberships(itemId), names=store.roomNames(itemId);
      modal.show('Organize '+item.title,body=>{
        body.append(el('p','','Currently in '+(names.join(', ')||'no room')+'. Organizing does not delete the item.'));
        const choice = (id, title, consequence, run) => {
          const row=action(id,'',run,'organization-choice');
          row.append(el('strong','',title),el('span','',consequence));body.append(row);
        };
        choice('organize-add','Add to another room','Keep every current room membership and add one more.',()=>destination('add',sourceRoomId));
        const sources=[...new Set(memberships.map(m=>m.roomId))];
        sources.forEach(id=>{
          choice('organize-move-'+id,'Move from '+roomName(id)+' to another room','Choose a destination first. Only the '+roomName(id)+' membership is removed; other rooms stay unchanged.',()=>destination('move',id));
          choice('organize-remove-'+id,'Remove from '+roomName(id),'Remove only this membership. Keep the item in All items; if no room remains, it becomes Unfiled.',()=>review('remove',id));
        });
        body.append(action('room-dialog-cancel','Cancel',()=>modal.close()));
      },true,invoker);
      function destination(operation, source) {
        modal.show(operation==='add'?'Add to another room':'Move to another room',body=>{
          body.append(el('p','',operation==='add'?'Keep all current room memberships. Choose a destination to review.':'Add the destination and remove only the chosen source room. The item itself stays in All items.'));
          const targets=store.activeRooms.filter(r=>!memberships.some(m=>m.roomId===r.id));
          targets.forEach(r=>body.append(action('destination-'+r.id,r.name+' — '+r.purpose,()=>review(operation,source,r.id),'room-destination')));
          if(!targets.length)body.append(el('p','','No other active rooms are available. Create or restore a room first.'));
          body.append(action('organize-back','Back',()=>organize(itemId,source)),action('room-dialog-cancel','Cancel',()=>modal.close()));
        },true);
      }
      function review(operation, source, destinationId) {
        const label=operation==='add'?'Add to '+roomName(destinationId):operation==='move'?'Move to '+roomName(destinationId):'Remove from '+roomName(source);
        modal.show(label+'?',body=>{
          body.append(el('p','',item.title),el('p','',operation==='add'?'It stays in '+(names.join(', ')||'All items')+' and also appears in '+roomName(destinationId)+'.':
            operation==='move'?'Remove its membership in '+roomName(source)+' and add it to '+roomName(destinationId)+'. Other memberships remain.':
              'Remove only its '+roomName(source)+' membership. The item stays in All items and becomes Unfiled if no room remains.'),
            el('p','','You can undo this organization change.'),
            action('confirm-organize',label,()=>{
              store.organize({itemId,operation,sourceRoomId:source,destinationRoomId:destinationId});
              refresh();modal.close();options.announce(item.title+'. Before: '+membershipNames(store.receipt.before)+'. After: '+membershipNames(store.receipt.after)+'. Undo is available above the composer.');
            },'primary'),action('organize-back','Back',()=>organize(itemId,source)),action('room-dialog-cancel','Cancel',()=>modal.close()));
        });
      }
    }
    const membershipNames = entries => [...new Set(entries.map(m=>roomName(m.roomId)))].join(', ')||'Not in a room';
    function receiptView() {
      const host=document.getElementById('organization-receipt'), receipt=store.receipt;
      host.replaceChildren();host.hidden=!receipt;if(!receipt)return;
      const region=el('section','organization-receipt rooms-system');region.setAttribute('aria-label','Organization receipt');
      region.append(el('h2','',receipt.itemTitle+' — organization changed'),el('p','','Before: '+membershipNames(receipt.before)),el('p','','After: '+membershipNames(receipt.after)));
      const controls=el('div','room-actions');controls.append(action('undo-organization','Undo',()=>{
        const ok=store.undo(receipt.id);refresh();options.announce(ok?'Previous room memberships restored.':'This receipt is no longer current. Nothing changed.');options.compose(null);
      },'primary'),action('dismiss-organization','Dismiss',()=>{store.dismissReceipt();receiptView();options.compose(null);}));
      region.append(controls);host.append(region);
    }
    const featured = room => (room.featuredCollections || room.collections.slice(0, 4).map(c => c.id))
      .map(id => room.collections.find(c => c.id === id)).filter(Boolean);
    function identity(room, compact) {
      const h = el('header', 'room-identity' + (compact ? ' compact-identity' : ''));
      if (room.mark) h.append(art(room.mark, 'room-mark'));
      const copy = el('div');
      if (compact) copy.append(action('room-overview', room.name, () => change(room, 'overview'), 'room-name text-button'));
      else copy.append(heading('h1', room.name));
      copy.append(el('p', 'room-purpose', room.purpose || 'An optional space for related material.'));
      h.append(copy, action('room-details', 'Room details', event => editRoom(room.id, event.currentTarget))); return h;
    }
    function symbol(room, collection) {
      const selected = stateFor(room).collection === collection.id;
      const b = action('collection-' + collection.id, '', () => openCollection(room, collection.id), 'collection-symbol');
      b.setAttribute('aria-pressed', String(selected));
      if (collection.symbol) b.append(art(collection.symbol, 'collection-art'));
      b.append(el('span', '', collection.label));
      if (selected) b.append(el('small', 'selected-label', 'Selected'));
      return b;
    }
    function openCollection(room, id) {
      const s = stateFor(room); s.collection = id; s.item = ''; s.query = ''; s.fromSource = false; s.inspectSource = null;
      change(room, 'collection', '#collection-content h1');
    }
    function openItem(room, collectionId, itemId, origin = 'collection') {
      const s = stateFor(room); s.inspectSource = null; s.itemReturn = {origin, scroll: window.scrollY, itemId};
      s.collection = collectionId; s.item = itemId; s.expanded = false; s.fromSource = origin === 'conversation';
      change(room, 'detail', '#room-item-detail h1');
    }
    function overview(room, surface) {
      surface.append(el('p', 'room-scope', room.name + ' brings related things closer. You can still ask Granny anything.'));
      const content = el('div', 'room-overview-content'), continuation = room.continuation;
      const collection = room.collections.find(c => c.id === continuation?.collectionId);
      const item = collection?.items.find(i => i.id === continuation.itemId);
      if (item) {
        const panel = el('section', 'room-continuation');
        panel.append(el('p', 'eyebrow', 'Continue · fictional example'), el('h2', '', item.title),
          action('room-continue', continuation.actionLabel || 'Open item', () => openItem(room, collection.id, item.id, 'overview'), 'primary'));
        content.append(panel);
      }
      const browse = el('section', 'room-browse'); browse.append(el('h2', '', 'Browse ' + room.name));
      const symbols = el('div', 'collection-symbols overview-symbols');
      featured(room).forEach(c => symbols.append(symbol(room, c))); browse.append(symbols);
      if (!room.collections.length) browse.append(el('p', '', 'This new room is empty. Add an item from All items, or ask Granny anything below.'));
      else browse.append(action('all-collections', 'All ' + room.name + ' collections', () => change(room, 'collections')));
      content.append(browse); surface.append(content);
    }
    function allCollections(room, surface) {
      surface.append(action('back-room-overview', 'Back to ' + room.name, () => change(room, 'overview', '#all-collections')),
        heading('h1', 'All ' + room.name + ' collections'));
      const symbols = el('nav', 'collection-symbols all-symbols'); symbols.setAttribute('aria-label', room.name + ' collections');
      room.collections.forEach(c => symbols.append(symbol(room, c))); surface.append(symbols);
    }
    function collectionView(room, surface) {
      const s = stateFor(room), collection = room.collections.find(c => c.id === s.collection); if (!collection) return;
      const content = el('section', 'collection-content'); content.id = 'collection-content';
      const header = el('div', 'collection-header'), title = el('div', 'collection-title');
      if (collection.symbol) title.append(art(collection.symbol, 'collection-heading-art'));
      const titleCopy = el('div'); titleCopy.append(heading('h1', collection.label), el('p', '', 'Selected collection'));
      title.append(titleCopy); header.append(title);
      const switcher = el('nav', 'collection-switcher'); switcher.setAttribute('aria-label', 'Switch collection');
      const choices = featured(room); if (!choices.some(c => c.id === collection.id)) choices.unshift(collection);
      choices.forEach(c => {
        const b = action('switch-' + c.id, c.label, () => openCollection(room, c.id));
        b.setAttribute('aria-pressed', String(c.id === collection.id));
        if (c.id === collection.id) b.append(el('small', '', 'Selected')); switcher.append(b);
      });
      switcher.append(action('all-collections', 'All collections', () => change(room, 'collections', '#collection-' + collection.id)));
      header.append(switcher); content.append(header);
      const paper = el('div', 'collection-paper');
      const label = el('label', 'room-search-label', 'Search ' + collection.label); label.htmlFor = 'room-search';
      const search = el('input'); search.id = 'room-search'; search.type = 'search'; search.value = s.query;
      search.placeholder = room.id === 'kitchen' && collection.id === 'recipes' ? 'Type a recipe or ingredient' : 'Find a fictional item';
      const results = el('div', 'room-items'), status = el('p', 'sr-only'); status.setAttribute('role', 'status');
      paper.append(label, search, status, results); content.append(paper); surface.append(content);
      function filter() {
        results.replaceChildren();
        const matches = collection.items.filter(i => i.sensitivity !== 'private' && (i.title + ' ' + i.summary + ' ' + i.body).toLowerCase().includes(s.query.toLowerCase()));
        status.textContent = matches.length + ' fictional items';
        if (!matches.length) {
          const empty = el('div', 'room-empty'); empty.dataset.emptyState = room.id;
          if (!s.query && room.empty) empty.append(art(room.empty, 'room-empty-art'));
          empty.append(el('h2', '', s.query ? 'No matching examples' : 'Nothing in ' + collection.label + ' yet'),
            el('p', '', s.query ? 'Try a different word or clear the search.' : 'This fictional collection is empty. Choose another collection or ask Granny below.'));
          results.append(empty);
        }
        matches.forEach(item => {
          const b = action('', '', () => openItem(room, collection.id, item.id), 'room-item'); b.dataset.itemId = item.id;
          b.append(el('strong', '', item.title), el('span', '', item.summary)); results.append(b);
        });
      }
      search.addEventListener('input', () => { s.query = search.value; filter(); }); filter();
    }
    function itemView(room, surface) {
      const s = stateFor(room), collection = room.collections.find(c => c.id === s.collection);
      const item = safeItem(s.inspectSource || s.item); if (!item) {
        surface.append(el('p','','This item is no longer available.'),action('back-room-overview','Back to '+room.name,()=>change(room,'overview')));return;
      }
      const detail = el('article', 'room-item-detail'); detail.id = 'room-item-detail';
      if (s.fromSource || s.inspectSource) detail.append(action('back-room-conversation', 'Back to conversation', () => {
        s.inspectSource=null;change(room, 'conversation', s.crossSource?'#view-cross-source':'#view-room-source');
        requestAnimationFrame(()=>window.scrollTo(0,s.sourceScroll||0));
      }));
      if (!s.inspectSource) detail.append(action('back-collection', 'Back to ' + (collection?.label||room.name), () => {
        s.fromSource = false; s.view = 'collection'; render(); focus('[data-item-id="' + item.id + '"]');
        requestAnimationFrame(() => window.scrollTo(0, s.itemReturn?.origin === 'collection' ? s.itemReturn.scroll : 0));
      }));
      detail.append(heading('h1', item.title), el('p', 'item-source-line', (store.roomNames(item.id).join(', ')||'Not in a room') + ' · ' + (s.inspectSource?'Source item':collection?.label||'Item') + ' · Fictional example'));
      const paper = el('div', 'item-paper'), sections = el('div', 'item-sections');
      (item.sections || [{heading: 'About this example', lines: [item.body]}]).forEach(section => {
        const block = el('section'); block.append(el('h2', '', section.heading));
        (section.lines || []).forEach(line => block.append(el('p', '', line))); sections.append(block);
      });
      paper.append(sections);
      const actions = el('div', 'room-actions item-actions');
      actions.append(action('organize-item','Organize item',event=>organize(item.id,room.id,event.currentTarget)), action('show-item-details', s.expanded ? 'Hide additional details' : item.actionLabel || 'Show details', () => {
        s.expanded = !s.expanded; render(); focus('#show-item-details');
      }, 'primary'), action('ask-room-item', 'Ask Granny about this', () => {
        if(s.inspectSource){s.inspectSource=null;change(room,'conversation','#view-cross-source');return;}
        s.source = {collectionId: collection?.id, itemId: item.id}; s.excluded.delete(item.id);
        s.turns = []; s.view = 'conversation'; render();
        options.compose(item.question || 'What is in the ' + item.title + ' example?');
        options.announce(item.title + ' is selected as a source. Review your question and choose Send.');
      }));
      paper.append(actions);
      if (s.expanded) {
        const more = el('section', 'item-more'); more.append(el('h2', '', 'Fictional example details'));
        (item.details || [item.body]).forEach(line => more.append(el('p', '', line))); paper.append(more);
      }
      detail.append(paper); surface.append(detail);
    }
    function conversationView(room, surface) {
      const s = stateFor(room), connected = options.assistantActive?.() === true,
        region = el('section', 'room-conversation'); region.setAttribute('aria-label', 'Conversation in ' + room.name);
      region.append(action('browse-current-room', 'Browse ' + room.name, () => change(room, 'overview')));
      if (connected) options.renderAssistant?.(region);
      else if (!s.turns.length) region.append(heading('h1', 'Ask Granny in ' + room.name),
        el('p', '', 'Review the fictional question below, or write your own. Choose Send when ready.'));
      if (!connected) s.turns.forEach((turn, index) => {
        const reply = el('article', 'room-reply'); reply.tabIndex = -1;
        reply.append(el('p', 'eyebrow', 'You asked'), el('p', 'room-question', turn.question),
          el('p', 'eyebrow', 'Granny · scripted fictional response'), el('p', 'room-answer', turn.answer));
        if (turn.source && !s.source) reply.append(el('p', 'notice', 'Earlier answer used ' + turn.source + '. That source is now excluded from new replies.'));
        if (index !== s.turns.length - 1) reply.classList.add('earlier-room-turn'); region.append(reply);
      });
      if (s.source) {
        const collection = room.collections.find(c => c.id === s.source.collectionId);
        const item = collection?.items.find(i => i.id === s.source.itemId);
        if (item) {
          const cue = el('aside', 'room-source-cue'); cue.id = 'room-source-cue';
          const copy = el('div'); copy.append(el('p', '', 'Using ' + item.title + ' · ' + room.name + ' · ' + collection.label),
            el('p', 'notice', item.sourceExplanation || 'This fictional item is the reference for the scripted answer. No other room or personal history was consulted.'));
          const controls = el('div', 'room-source-actions');
          controls.append(action('view-room-source', 'View source', () => openItem(room, collection.id, item.id, 'conversation')),
            action('stop-room-source', 'Stop using this source', () => {
              s.excluded.add(item.id); s.source = null; render();
              options.announce('Source excluded from new replies. Earlier answers remain labelled as history.'); options.compose(null);
            }));
          cue.append(copy, controls); region.append(cue);
        }
      }
      if (s.crossSource) {
        const source=s.crossSource, cue=el('aside','room-source-cue rooms-system');cue.id='cross-room-source';
        if(source.allowed) {
          const item=safeItem(source.itemId);
          if(item)cue.append(el('h2','','Also used from '+roomName(source.roomId)),el('p','',item.title),el('p','',source.reason),
            action('view-cross-source','View source',()=>{s.sourceScroll=scrollY;s.inspectSource=item.id;change(room,'detail','#room-item-detail h1');}),
            action('exclude-cross-source','Exclude this source',()=>{
              s.excluded.add(item.id);s.crossSource={allowed:false,reason:'excluded',itemId:item.id};
              s.turns.at(-1).answer='Source excluded. This fictional response now uses no Trips material. You can continue with Kitchen only.';
              render();focus('#restore-cross-source');options.announce('Trips source excluded from this response. Room memberships and permissions did not change.');
            }));
          else cue.append(el('p','','This source is no longer available. No source content is being used.'));
        } else if(source.reason==='private') {
          const deniedRoom=roomName(source.roomId);
          cue.append(el('h2','',deniedRoom+' source not used'),el('p','','Granny did not use “Passport details” from '+deniedRoom+' because that source is private.'),
            action('continue-without-source','Continue without it',()=>{s.crossSource=null;render();options.compose(null);options.announce('Continuing without the private source.');}),
            action('review-source-access','Review access',()=>modal.show('Review access',body=>body.append(
              el('p','','Local policy simulation. A private source is excluded before this fictional response. Room membership is not permission. This prototype cannot grant access or change real permissions.'),
              action('room-dialog-cancel','Done',()=>modal.close())))));
        } else {
          cue.append(el('h2','','Trips source excluded'),el('p','','No Trips item is being used for this response.'),action('restore-cross-source','Use this source again',()=>{
            s.excluded.delete(source.itemId);applyCross(room,'allowed');render();focus('#exclude-cross-source');options.announce('Fictional Trips source restored for this response.');
          }));
        }
        region.append(cue);
      }
      region.append(el('p', 'room-followup', 'You can keep asking here, or browse ' + room.name + ' directly.')); surface.append(region);
    }

    function assistantContext(question) {
      const room = current();
      if (!room) return {place: {kind: 'home'}, sources: []};
      const s = stateFor(room), selectedId = s.source?.itemId;
      const words = [...new Set(String(question).toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])];
      const candidates = [];
      room.collections.forEach(collection => collection.items.forEach(item => {
        if (item.sensitivity === 'private' || s.excluded.has(item.id)) return;
        const sections = (item.sections || []).flatMap(section => [section.heading, ...(section.lines || [])]);
        const content = sections.filter(Boolean).join('\n') || item.body || item.summary || '';
        if (!content.trim()) return;
        const title = String(item.title || ''), summary = String(item.summary || '');
        const haystack = (title + ' ' + summary + ' ' + content).toLocaleLowerCase();
        const score = item.id === selectedId ? 1000 : words.reduce((total, word) =>
          total + (title.toLocaleLowerCase().includes(word) ? 4 : 0) +
          (summary.toLocaleLowerCase().includes(word) ? 2 : 0) + (haystack.includes(word) ? 1 : 0), 0);
        if (score > 0) candidates.push({score, item, collection, content});
      }));
      candidates.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
      return {
        place: {kind: 'room', roomId: room.id, roomName: room.name, purpose: String(room.purpose || '').slice(0, 240)},
        sources: candidates.slice(0, 3).map(({item, collection, content}) => ({
          itemId: String(item.id).slice(0, 64), title: String(item.title).slice(0, 120),
          summary: String(item.summary || '').slice(0, 400), content: content.slice(0, 1200),
          roomName: String(room.name).slice(0, 80), collectionLabel: String(collection.label).slice(0, 80),
          provenance: 'fictional-local-fixture'
        }))
      };
    }
    function renderRoom(room) {
      const s = stateFor(room), shell = el('section', 'room-surface');
      shell.id = 'room-surface'; shell.dataset.roomId = room.id; shell.dataset.roomState = s.view;
      if (room.accent) shell.dataset.accent = room.accent;
      const atmosphere = el('div', 'room-atmosphere');
      if (room.backdrop && s.view === 'overview') atmosphere.append(art(room.backdrop, 'room-backdrop'));
      if (room.portrait && ['conversation', 'assistant'].includes(s.view))
        atmosphere.append(art(room.portrait, 'room-chat-portrait'));
      shell.append(atmosphere, identity(room, s.view !== 'overview'));
      if (s.view === 'overview') overview(room, shell);
      else if (s.view === 'collections') allCollections(room, shell);
      else if (s.view === 'collection') collectionView(room, shell);
      else if (s.view === 'detail') itemView(room, shell);
      else if (s.view === 'conversation') conversationView(room, shell);
      host.append(shell);
    }
    function render() {
      host.replaceChildren();
      if (['rooms','room-search','all-items','unfiled','archived-rooms'].includes(route)) window.GrannyRoomLibrary.render(host, {
        store, route, query: queries[route]||'', onQuery:value=>{queries[route]=value;}, go:options.open,
        onHome: options.home, onCreate: event => editRoom(null, event.currentTarget), announce: options.announce,
        retry:()=>{store.setAvailability('normal');refresh();focus('h1');options.announce('Local fixture available. No network request was made.');},
        restore:id=>{const room=store.restore(id);refresh();options.open('rooms','library-room-'+id);options.announce(room.name+' restored.');},
        onOpenRoom: id => options.open('room:' + id),
        onOpenItem: itemId => {
          listReturn={route,scroll:scrollY,focusId:'library-item-'+itemId};options.open('item:'+itemId);
        }
      });
      else if(route.startsWith('item:')) renderLibraryItem(route.slice(5));
      else if (current()) renderRoom(current());
      receiptView();
      requestAnimationFrame(fitAtmosphere);
    }
    function renderLibraryItem(id) {
      const item=safeItem(id), surface=el('section','room-library rooms-system');
      surface.append(action('back-library-item','Back to '+({rooms:'Rooms','all-items':'All items',unfiled:'Unfiled','room-search':'search results'}[listReturn?.route]||'All items'),()=>{
        const origin=listReturn;options.open(origin?.route||'all-items',origin?.focusId);
        requestAnimationFrame(()=>window.scrollTo(0,origin?.scroll||0));
      }));
      if(!item) {surface.append(heading('h1','Item no longer available'));host.append(surface);return;}
      surface.append(heading('h1',item.title),el('p','item-source-line',(store.roomNames(id).join(', ')||'Not in a room')+' · '+item.type+' · Fictional example'));
      const paper=el('article','item-paper'); paper.id='library-item-detail';
      (item.sections||[{heading:'About this example',lines:[item.summary,item.body]}]).forEach(section=>{
        const block=el('section');block.append(el('h2','',section.heading));section.lines.filter(Boolean).forEach(line=>block.append(el('p','',line)));paper.append(block);
      });
      paper.append(el('p','notice',item.provenance||'Local fictional fixture'),action('organize-item','Organize item',event=>organize(id,store.memberships(id)[0]?.roomId,event.currentTarget)));
      surface.append(paper);host.append(surface);
    }
    function applyCross(room,kind) {
      const s=stateFor(room),fixture=window.GrannyRoomFixtures.sourceFixtures[kind];
      s.source=null;s.inspectSource=null;
      const source=store.resolveSource(room.id,fixture.itemId,[...s.excluded]);
      s.crossSource=source?{...source,itemId:source.allowed?fixture.itemId:undefined,reason:source.allowed?fixture.reason:source.reason}:null;
      if(source?.reason==='excluded')s.crossSource.itemId=fixture.itemId;
      s.turns=[{question:fixture.question,answer:source?.allowed||source?.reason==='private'?fixture.answer:'No Trips source is being used in this fictional response.'}];
      s.view='conversation';
    }
    function releaseSource() { if (current()) {stateFor(current()).source = null;stateFor(current()).crossSource=null;} }
    return {
      get rooms() { return store.activeRooms; }, get current() { return current(); },
      get hasConversation() { return [...states.values()].some(s=>s.turns.length); },
      get assistantVisible() { const room=current();return !!(room&&options.assistantActive?.()&&stateFor(room).view==='conversation'); },
      get availability() { return store.availability; },
      get supportItems() { return store.items().filter(i => i.sensitivity !== 'private').map(i => ({...i, rooms: store.roomNames(i.id)})); },
      get continuation() { const kitchen=store.activeRooms.find(r=>r.id==='kitchen');return kitchen&&safeItem('vegetable-soup')&&store.memberships('vegetable-soup').some(m=>m.roomId==='kitchen')?kitchen:null; },
      setAvailability(value) { store.setAvailability(value);states.clear();refresh(); },
      enter(next) { releaseSource(); route = next; if (current()) stateFor(current()).view = 'overview'; render(); },
      show(next) { if (route !== next) { releaseSource(); route = next; render(); } else if (options.assistantActive?.()) render(); },
      showAssistant() { const room=current();if(!room)return false;stateFor(room).view='conversation';render();return true; },
      assistantContext,
      reply(question) {
        const room = current(); if (!room) return false;
        const s = stateFor(room), collection = room.collections.find(c => c.id === s.source?.collectionId);
        const item = collection?.items.find(i => i.id === s.source?.itemId && !s.excluded.has(i.id));
        const normalize = text => text.trim().toLowerCase().replace(/[.!?]+$/, '');
        const cross=Object.entries(window.GrannyRoomFixtures.sourceFixtures).find(([,f])=>normalize(f.question)===normalize(question));
        if(room.id==='kitchen'&&cross&&store.availability!=='offline') {
          applyCross(room,cross[0]);render();focus('.room-reply:last-of-type',true);options.announce('Fictional response with a written source boundary.');return true;
        }
        s.crossSource=null;
        const exact = item && normalize(question) === normalize(item.question || '');
        const answer = item ? (exact && item.answer ? item.answer : 'The fictional ' + item.title + ' example is open as your reference. ' + item.summary + ' This prototype can show its details, but does not generate new advice or change it.') :
          'You are in ' + room.name + '. The same Granny assistant is here. No item is being used as a source for this reply. Browse a collection directly, or ask an ordinary scripted request. This is a local fictional response, not a model answer.';
        s.turns.push({question, answer, source: item ? item.title + ' · ' + room.name + ' · ' + collection.label : null});
        s.view = 'conversation'; render(); focus('.room-reply:last-of-type', true); options.announce(answer); return true;
      },
      reset() { store.reset(); states.clear(); route = ''; modal.close(false); receiptView(); },
      clearConversation() { for (const s of states.values()) { s.turns = []; s.source = null; s.crossSource = null; } route = ''; }
    };
  }
  window.GrannyRoomUI = {create};
})();
