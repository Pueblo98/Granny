/* One fixture-driven room system. No room state enters the model or backend. */
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
    const starter = window.GrannyRoomFixtures.rooms;
    let rooms = [...starter], route = '', serial = 0, wizard = null;
    const states = new Map();
    const current = () => rooms.find(room => route === 'room:' + room.id);
    const stateFor = room => {
      if (!states.has(room.id)) states.set(room.id, {view: 'overview', collection: '', item: '', query: '',
        source: null, excluded: new Set(), turns: [], itemReturn: null, fromSource: false, expanded: false});
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
    const featured = room => (room.featuredCollections || room.collections.slice(0, 4).map(c => c.id))
      .map(id => room.collections.find(c => c.id === id)).filter(Boolean);
    function identity(room, compact) {
      const h = el('header', 'room-identity' + (compact ? ' compact-identity' : ''));
      if (room.mark) h.append(art(room.mark, 'room-mark'));
      const copy = el('div');
      if (compact) copy.append(action('room-overview', room.name, () => change(room, 'overview'), 'room-name text-button'));
      else copy.append(heading('h1', room.name));
      copy.append(el('p', 'room-purpose', room.purpose || 'An optional space for related material.'));
      h.append(copy); return h;
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
      const s = stateFor(room); s.collection = id; s.item = ''; s.query = ''; s.fromSource = false;
      change(room, 'collection', '#collection-content h1');
    }
    function openItem(room, collectionId, itemId, origin = 'collection') {
      const s = stateFor(room); s.itemReturn = {origin, scroll: window.scrollY, itemId};
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
      if (!room.collections.length) browse.append(el('p', '', 'You chose to begin without collections. You can still ask Granny anything below.'));
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
        const matches = collection.items.filter(i => (i.title + ' ' + i.summary + ' ' + i.body).toLowerCase().includes(s.query.toLowerCase()));
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
      const item = collection?.items.find(i => i.id === s.item); if (!item) return;
      const detail = el('article', 'room-item-detail'); detail.id = 'room-item-detail';
      if (s.fromSource) detail.append(action('back-room-conversation', 'Back to conversation', () => change(room, 'conversation', '#view-room-source')));
      detail.append(action('back-collection', 'Back to ' + collection.label, () => {
        s.fromSource = false; s.view = 'collection'; render(); focus('[data-item-id="' + item.id + '"]');
        requestAnimationFrame(() => window.scrollTo(0, s.itemReturn?.origin === 'collection' ? s.itemReturn.scroll : 0));
      }), heading('h1', item.title), el('p', 'item-source-line', room.name + ' · ' + collection.label + ' · Fictional example'));
      const paper = el('div', 'item-paper'), sections = el('div', 'item-sections');
      (item.sections || [{heading: 'About this example', lines: [item.body]}]).forEach(section => {
        const block = el('section'); block.append(el('h2', '', section.heading));
        (section.lines || []).forEach(line => block.append(el('p', '', line))); sections.append(block);
      });
      paper.append(sections);
      const actions = el('div', 'room-actions item-actions');
      actions.append(action('show-item-details', s.expanded ? 'Hide additional details' : item.actionLabel || 'Show details', () => {
        s.expanded = !s.expanded; render(); focus('#show-item-details');
      }, 'primary'), action('ask-room-item', 'Ask Granny about this', () => {
        s.source = {collectionId: collection.id, itemId: item.id}; s.excluded.delete(item.id);
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
      const s = stateFor(room), region = el('section', 'room-conversation'); region.setAttribute('aria-label', 'Conversation in ' + room.name);
      region.append(action('browse-current-room', 'Browse ' + room.name, () => change(room, 'overview')));
      if (!s.turns.length) region.append(heading('h1', 'Ask Granny in ' + room.name),
        el('p', '', 'Review the fictional question below, or write your own. Choose Send when ready.'));
      s.turns.forEach((turn, index) => {
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
      region.append(el('p', 'room-followup', 'You can keep asking here, or browse ' + room.name + ' directly.')); surface.append(region);
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
      wizard?.destroy?.(); wizard = null; host.replaceChildren();
      if (route === 'rooms') window.GrannyRoomLibrary.render(host, {
        rooms, onHome: options.home, onCreate: () => options.open('create-room'), announce: options.announce,
        onOpenRoom: id => options.open('room:' + id),
        onOpenItem: (roomId, collectionId, itemId) => {
          options.open('room:' + roomId); openItem(current(), collectionId, itemId, 'library');
        }
      });
      else if (route === 'create-room') wizard = window.GrannyRoomCreate.mount(host, {
        rooms: starter, announce: options.announce, onCancel: () => options.open('rooms', 'create-room'),
        onCreate: draft => {
          const room = {...draft, id: 'custom-' + (++serial), custom: true}; rooms.push(room);
          options.changed(); options.open('room:' + room.id); options.announce(room.name + ' created for this tab only.');
        }
      });
      else if (current()) renderRoom(current());
    }
    function releaseSource() { if (current()) stateFor(current()).source = null; }
    return {
      get rooms() { return rooms; }, get current() { return current(); },
      enter(next) { releaseSource(); route = next; if (current()) stateFor(current()).view = 'overview'; render(); },
      show(next) { if (route !== next) { releaseSource(); route = next; render(); } },
      globalConversation() { if (current()) change(current(), 'assistant'); },
      reply(question) {
        const room = current(); if (!room) return false;
        const s = stateFor(room), collection = room.collections.find(c => c.id === s.source?.collectionId);
        const item = collection?.items.find(i => i.id === s.source?.itemId && !s.excluded.has(i.id));
        const normalize = text => text.trim().toLowerCase().replace(/[.!?]+$/, '');
        const exact = item && normalize(question) === normalize(item.question || '');
        const answer = item ? (exact && item.answer ? item.answer : 'The fictional ' + item.title + ' example is open as your reference. ' + item.summary + ' This prototype can show its details, but does not generate new advice or change it.') :
          'You are in ' + room.name + '. The same Granny assistant is here. No item is being used as a source for this reply. Browse a collection directly, or ask an ordinary scripted request. This is a local fictional response, not a model answer.';
        s.turns.push({question, answer, source: item ? item.title + ' · ' + room.name + ' · ' + collection.label : null});
        s.view = 'conversation'; render(); focus('.room-reply:last-of-type', true); options.announce(answer); return true;
      },
      reset() { rooms = [...starter]; states.clear(); route = ''; serial = 0; },
      clearConversation() { for (const s of states.values()) { s.turns = []; s.source = null; } route = ''; }
    };
  }
  window.GrannyRoomUI = {create};
})();
