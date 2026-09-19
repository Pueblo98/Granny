/* Conversation UI only. Model and scheduler remain the authority for task
 * state. */
(() => {
  'use strict';
  const P = window.GrannyPrototype;
  if (!P)
    return;
  const state = P.create();
  const $ = id => document.getElementById(id);
  const thread = $('thread'), composerText = $('request');
  const homeFixtures = window.GrannyFixtures?.home || {
    continuation : {},
    rooms : []
  };
  // Connected execution belongs exclusively to the backend. Scripted task
  // state/timers are never used to advance or verify a connected request.
  let runtime = null, runtimeMode = false, runtimeView = null,
      runtimeEditor = null, runtimePreview = null, runtimeTurns = [],
      runtimeQuarantined = false, runtimeProviderMode = "demo",
      runtimeConfig = null, runtimeConfigPending = false, runtimeConfigError = false;
  let scheduler, pending = null, dialogReturn = null, menuPanel = '',
                 lastAnnouncement = '', restoreFocus = false, editor = null,
                 editingAliasId = null, panelReturn = null, panelScroll = 0,
                 aliasDraft = null, continuationVisible = true,
                 homeView = 'home', homeReturn = null,
                 homeReturnScroll = 0, homeFixture = 'default',
                 roomScrollFrame = 0, homeListReturnRoom = '';
  const focus = element =>
      element?.isConnected && element.focus({preventScroll : true});

  function atBottom() {
    return window.innerHeight + window.scrollY >=
           document.documentElement.scrollHeight - 100;
  }
  function scrollIfReadingEnd(wasAtBottom) {
    if (wasAtBottom && document.activeElement !== composerText)
      requestAnimationFrame(() => window.scrollTo({
        top : document.documentElement.scrollHeight,
        behavior : 'auto'
      }));
  }
  function active() {
    if (runtimeMode)
      return !!(runtimeView?.connection === 'connecting' || runtimeView?.pending || runtimeView?.stopping ||
        ['interpreting', 'resolving', 'creating', 'verifying', 'preview', 'clarifying']
          .includes(runtimeView?.snapshot?.state));
    return !!(state.task && (P.ACTIVE || [
                              'planning', 'acting', 'waiting', 'verifying'
                            ]).includes(state.task.stage));
  }
  function announce(text) {
    $('announcement').textContent = '';
    requestAnimationFrame(() => { $('announcement').textContent = text; });
  }
  function dispatch(event, value, guard) {
    if (runtimeMode && event === 'stop') {
      runtime?.cancel();
      return true;
    }
    const wasAtBottom = atBottom();
    if (scheduler && scheduler.elapse)
      scheduler.elapse();
    const changed = P.dispatch(state, event, value, guard);
    if (changed) {
      restoreFocus = true;
      render();
      if (scheduler && scheduler.sync)
        scheduler.sync();
      scrollIfReadingEnd(wasAtBottom);
    }
    return changed;
  }
  function node(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text !== undefined)
      n.textContent = text;
    return n;
  }
  function button(label, fn, cls, focusKey) {
    const b = node('button', cls || '', label);
    b.type = 'button';
    b.dataset.focusKey = focusKey || label;
    b.addEventListener('click', fn);
    return b;
  }
  function idleHome() {
    return homeView === 'home' && !runtimeMode && !menuPanel && !state.task &&
           !(state.turns && state.turns.length);
  }
  function currentHomeRooms() {
    const rooms = (homeFixtures.rooms || []).map(room => ({...room}));
    if (homeFixture === 'no-rooms')
      return [];
    if (homeFixture === 'one-room')
      return rooms.slice(0, 1);
    if (homeFixture === 'image-failure' && rooms[0])
      rooms[0].asset = '/assets/missing-room-placeholder.svg';
    return rooms;
  }
  function roomButton(room, context = 'home') {
    const b = button('', () => openHomeDestination('room:' + room.id, b),
                     'room-entry', 'room-' + room.id);
    b.id = context === 'home' ? 'room-' + room.id : '';
    b.dataset.roomId = room.id;
    b.setAttribute('aria-label', room.name + ' — ' + room.purpose);
    const image = document.createElement('img');
    image.className = 'room-art';
    image.src = room.asset;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.addEventListener('error', () => {
      image.remove();
      b.classList.add('image-missing');
    }, {once : true});
    b.append(image, node('strong', '', room.name),
             node('span', '', room.purpose));
    return b;
  }
  function renderRooms() {
    const rooms = currentHomeRooms();
    const list = $('room-list');
    list.replaceChildren(...rooms.map(room => roomButton(room)));
    $('empty-rooms').hidden = rooms.length !== 0;
    document.body.dataset.homeFixture = homeFixture;
    $('room-viewport').scrollLeft = 0;
    requestAnimationFrame(updateRoomLayout);
  }
  function visibleRoomNames() {
    const viewport = $('room-viewport');
    const bounds = viewport.getBoundingClientRect();
    const entries = [...viewport.querySelectorAll('.room-entry')];
    let visible = entries.filter(entry => {
      const rect = entry.getBoundingClientRect();
      const center = (rect.left + rect.right) / 2;
      return center >= bounds.left + 8 && center <= bounds.right - 8;
    });
    if (!visible.length && entries.length)
      visible = [entries.reduce((best, entry) =>
        Math.abs((entry.getBoundingClientRect().left +
                  entry.getBoundingClientRect().right) / 2 -
                 (bounds.left + bounds.right) / 2) <
                Math.abs((best.getBoundingClientRect().left +
                          best.getBoundingClientRect().right) / 2 -
                         (bounds.left + bounds.right) / 2)
            ? entry : best, entries[0])];
    return visible.map(entry =>
      currentHomeRooms().find(room => room.id === entry.dataset.roomId)?.name)
        .filter(Boolean);
  }
  function updateRoomPosition() {
    const viewport = $('room-viewport');
    if (!$('home-secondary') || $('home-secondary').hidden)
      return;
    const listMode = document.body.dataset.homeList === 'true';
    const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const overflow = !listMode && max > 2;
    const previous = $('rooms-previous'), next = $('rooms-next');
    $('room-controls').hidden = !overflow;
    $('rooms-position').hidden = !overflow;
    viewport.dataset.overflow = String(overflow);
    previous.disabled = false;
    next.disabled = false;
    if (!overflow) {
      previous.setAttribute('aria-disabled', 'true');
      next.setAttribute('aria-disabled', 'true');
      $('rooms-position').textContent = currentHomeRooms().length > 1
          ? 'All rooms are visible. Previous and Next are not needed.'
          : currentHomeRooms().length === 1
              ? 'The only room is visible. Previous and Next are not needed.'
              : 'There are no rooms to move through.';
      viewport.dataset.range = currentHomeRooms().map(room => room.name).join('–');
      return;
    }
    const atStart = viewport.scrollLeft <= 2;
    const atEnd = viewport.scrollLeft >= max - 2;
    previous.setAttribute('aria-disabled', String(atStart));
    next.setAttribute('aria-disabled', String(atEnd));
    const names = visibleRoomNames();
    const range = names.length > 1
        ? names[0] + ' through ' + names[names.length - 1]
        : names[0] || 'rooms';
    viewport.dataset.range = range;
    $('rooms-position').textContent = atStart
        ? 'Showing ' + range + '. Start of row — Previous unavailable.'
        : atEnd
            ? 'Showing ' + range + '. End of row — Next unavailable.'
            : 'Showing ' + range + '. Previous and Next available.';
  }
  function updateRoomLayout() {
    const reviewScale = Number.parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--review-scale')) || 1;
    const listMode = innerWidth <= 700 || (state.scale || 1) * reviewScale >= 2;
    document.body.dataset.homeList = String(listMode);
    if (listMode)
      $('room-viewport').scrollLeft = 0;
    requestAnimationFrame(updateRoomPosition);
  }
  function moveRooms(direction, control) {
    const viewport = $('room-viewport');
    const entries = [...viewport.querySelectorAll('.room-entry')];
    const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (control.getAttribute('aria-disabled') === 'true' ||
        !entries.length || max <= 2)
      return;
    const current = viewport.scrollLeft;
    const origin = entries[0].offsetLeft;
    const positions = entries.map(entry => entry.offsetLeft - origin);
    const target = direction > 0
        ? positions.find(position => position > current + 4) ?? max
        : [...positions].reverse().find(position => position < current - 4) ?? 0;
    viewport.scrollTo({left : Math.max(0, Math.min(max, target)), behavior : 'auto'});
    requestAnimationFrame(() => requestAnimationFrame(() => {
      updateRoomPosition();
      focus(control);
      const names = visibleRoomNames();
      if (names.length)
        announce('Rooms now showing ' + (names.length > 1
            ? names[0] + ' through ' + names[names.length - 1]
            : names[0]) + '.');
    }));
  }
  function homeDestinationTitle() {
    if (homeView === 'kitchen')
      return 'Kitchen';
    if (homeView === 'rooms')
      return 'All rooms';
    if (homeView.startsWith('room:')) {
      const id = homeView.slice(5);
      return (homeFixtures.rooms || []).find(room => room.id === id)?.name ||
             'Room';
    }
    return '';
  }
  function openHomeDestination(destination, source) {
    homeReturn = {
      id : source?.id || '',
      focusKey : source?.dataset?.focusKey || ''
    };
    homeReturnScroll = scrollY;
    homeListReturnRoom = '';
    homeView = destination;
    render();
    focus(thread.querySelector('.home-placeholder h1'));
  }
  function backToHome() {
    const returned = homeReturn;
    const position = homeReturnScroll;
    homeView = 'home';
    homeReturn = null;
    homeListReturnRoom = '';
    render();
    requestAnimationFrame(() => {
      const target = (returned?.id && $(returned.id)) ||
          (returned?.focusKey && [...document.querySelectorAll('[data-focus-key]')]
            .find(item => item.dataset.focusKey === returned.focusKey)) ||
          composerText;
      focus(target);
      window.scrollTo(0, position);
    });
  }
  function renderHomeDestination() {
    if (homeView === 'home' || homeView === 'introduction')
      return;
    const title = homeDestinationTitle();
    const surface = node('section', 'home-placeholder');
    surface.dataset.homeDestination = homeView;
    const heading = node('h1', '', title);
    heading.tabIndex = -1;
    surface.append(heading);
    if (homeView === 'kitchen') {
      surface.append(node('p', '',
          'This is a fictional placeholder. The Kitchen interior belongs to the next T-119 slice.'),
          node('p', 'notice',
              'No saved soup, room history, personal data or persistent content exists here.'));
    } else if (homeView === 'rooms') {
      surface.append(node('p', '',
          'A simple list is provided as the non-gesture route for this Home checkpoint. The complete Rooms library is not implemented.'));
      const list = node('div', 'room-library-list');
      const rooms = currentHomeRooms();
      rooms.forEach(room => {
        const entry = button(room.name, () => {
          homeListReturnRoom = room.id;
          homeView = 'room:' + room.id;
          render();
          focus(thread.querySelector('.home-placeholder h1'));
        }, '', 'library-room-' + room.id);
        entry.id = 'library-room-' + room.id;
        entry.dataset.roomId = room.id;
        entry.append(node('span', '', room.purpose));
        list.append(entry);
      });
      if (!rooms.length)
        list.append(node('p', 'notice',
                         'No rooms are available in this fictional fixture.'));
      surface.append(list);
    } else {
      const room = (homeFixtures.rooms || [])
          .find(item => homeView === 'room:' + item.id);
      surface.append(node('p', '', room?.purpose || 'Fictional room placeholder.'),
          node('p', 'notice',
              'This Home checkpoint does not implement a room interior, separate assistant or persistent room data.'));
      if (homeListReturnRoom) {
        const roomId = homeListReturnRoom;
        surface.append(button('Back to all rooms', () => {
          homeView = 'rooms';
          render();
          requestAnimationFrame(() => focus($('library-room-' + roomId)));
        }, '', 'back-all-rooms'));
      }
    }
    surface.append(button('Back to Home', backToHome, 'primary', 'back-home'));
    thread.append(surface);
  }
  function turn(role, text) {
    const c = node('article', 'turn ' + role);
    c.append(node('span', 'turn-label', role === 'user' ? 'You' : 'Granny'),
             node('p', '', text));
    return c;
  }
  function card(title, text) {
    const c = node('section', 'task-card');
    if (title)
      c.append(node('h2', '', title));
    if (text)
      c.append(node('p', '', text));
    return c;
  }
  function runtimeCopy() {
    const v = runtimeView;
    if (!v) return 'Connecting to the local demo…';
    if (v.stopping) return 'Stopping. Waiting for the local demo to confirm what happened…';
    if (v.connection === 'uncertain')
      return 'The connection was interrupted. I can’t yet confirm what happened. No action will be retried.';
    if (v.connection === 'connecting') return 'Connecting to the local demo…';
    if (v.connection === 'disconnected') return 'The local demo is not connected. Your words are still here.';
    if (v.snapshot?.state === 'unknown' || v.error === 'effect_unknown')
      return 'I can’t confirm whether the demo draft was created. Do not try creating it again.';
    if (v.error === 'confirmation_stale') return 'This approval has expired or changed. Your draft is still here; review it again.';
    if (v.error) return 'The local demo could not accept that step. Your draft has not been retried.';
    if (v.pending && !['interpreting', 'resolving', 'creating', 'verifying'].includes(v.snapshot?.state))
      return 'Waiting for the local demo…';
    return ({idle: 'What would you like your fictional message to say?',
      interpreting: 'Reading your request…', resolving: 'Looking up the fictional person…',
      clarifying: v.current?.data?.prompt || 'Which fictional person do you mean?',
      preview: 'Check the person, destination and words before creating this draft.',
      creating: 'Creating the unsent draft in the local demo…',
      verifying: 'Checking the saved demo draft…',
      completed: 'The local demo draft was created and checked. It has not been sent.',
      stopped: 'Stopped. No draft was created by this request.',
      failed: 'This request failed safely. No draft creation was verified.',
      unknown: 'I can’t confirm whether the demo draft was created. Do not try creating it again.'
    })[v.snapshot?.state] || 'Waiting for the local demo…';
  }
  function runtimeDraft(data, completed = false) {
    const c = card(completed ? 'Your unsent demo draft' : 'Check the draft', completed
      ? 'These are the details of the checked local demo draft. No message was sent and no Android app was opened.'
      : 'This creates an unsent draft in the local demo. No message is sent and no Android app is opened.');
    c.classList.add('preview');
    const dl = node('dl');
    [['To', data.recipient.label], ['Which person', data.recipient.detail],
     ['Destination', data.channel.label], [completed ? 'Result' : 'What happens', completed ? 'Created an unsent draft in the local demo' : data.effectLabel]]
      .forEach(([label, value]) => dl.append(node('dt', '', label), node('dd', '', value)));
    c.append(dl, node('blockquote', '', data.body));
    return c;
  }
  async function runtimeCommand(kind, payload) {
    if (!runtime || !runtimeMode) return false;
    return runtime.command(kind, payload);
  }
  function runtimeRevise(data, body) {
    runtimeEditor = null;
    return runtimeCommand('revise', {actionId: data.actionId,
      recipientId: data.recipient.id, channelId: data.channel.id, body});
  }
  function renderRuntime() {
    const v = runtimeView, event = v?.current;
    runtimeTurns.forEach(t => thread.append(turn(t.role, t.text)));
    const c = card('Granny', runtimeCopy());
    c.id = 'current-task';
    c.dataset.kind = 'runtime-message';
    c.dataset.stage = v?.snapshot?.state || 'connecting';
    c.querySelector('h2').tabIndex = -1;
    if (event?.type === 'chat') {
      c.append(node('p', '', event.data.text), node('p', 'notice',
        'Assistant text, not a verified action result.'));
    }
    if (runtimePreview) {
      const draft = runtimeDraft(runtimePreview, v?.snapshot?.state === 'completed');
      if (runtimeEditor) {
        const label = node('label', '', 'Message');
        const input = node('textarea');
        input.rows = 3;
        input.maxLength = 2000;
        input.value = runtimeEditor.body;
        input.setAttribute('aria-label', 'Message');
        input.dataset.focusKey = 'runtime-edit-body';
        input.addEventListener('input', () => { runtimeEditor.body = input.value; });
        label.append(input);
        const save = button('Review changes', () => {
          if (!input.value.trim()) { input.focus(); return; }
          runtimeRevise(runtimePreview, input.value);
        }, 'primary');
        save.disabled = v?.pending || v?.connection !== 'connected';
        draft.append(label, save, button('Cancel editing', () => {
          runtimeEditor = null;
          render();
        }));
      }
      c.append(draft);
    }
    const actions = node('div', 'inline-actions');
    const available = v?.connection === 'connected' && !v.pending && !v.stopping;
    if (event?.type === 'clarification' && available) {
      event.data.choices.forEach(choice => {
        const b = button(choice.label + (choice.detail ? ' — ' + choice.detail : ''),
          () => runtimeCommand('clarify', {turnId: event.turnId, choiceId: choice.id}), 'choice');
        b.dataset.choice = choice.id;
        actions.append(b);
      });
      if (!event.data.choices.length)
        actions.append(button('Type your message', () => focus(composerText)));
    }
    if (event?.type === 'preview' && available && !runtimeEditor) {
      const data = event.data;
      const confirm = button(v.canConfirm ? 'Create this unsent demo draft' : 'Review again',
        () => v.canConfirm
          ? runtimeCommand('confirm', {actionId: data.actionId, confirmationToken: data.confirmationToken})
          : runtimeRevise(data, data.body), 'primary', 'runtime-approval');
      confirm.dataset.action = v.canConfirm ? 'runtime-confirm' : 'runtime-renew';
      actions.append(confirm, button('Change message', () => {
        runtimeEditor = {body: data.body};
        runtime.invalidatePreview();
        render();
        focus(thread.querySelector('[aria-label="Message"]'));
      }), button('Change person or destination', () => {
        runtime.invalidatePreview();
        announce('Type a new request with the person or destination you want.');
        focus(composerText);
      }), button('Cancel draft', () => runtime.cancel()));
    }
    if (v?.connection === 'uncertain')
      actions.append(button('Check connection', () => runtime.recover(), 'primary'));
    if (v?.snapshot?.state === 'unknown')
      c.append(node('p', 'notice', 'No retry is offered. This session cannot create another draft. The destination is fictional; no message was sent.'));
    c.append(actions);
    thread.append(c);
    const copy = runtimeCopy();
    if (lastAnnouncement !== copy) { lastAnnouncement = copy; announce(copy); }
  }
  async function discoverLiveRuntime() {
    if (runtimeConfigPending) return;
    runtimeConfigPending = true;
    runtimeConfigError = false;
    render();
    try {
      const response = await fetch('/api/runtime/config', {signal: AbortSignal.timeout(5000)});
      const config = await response.json();
      if (!response.ok || config.version !== window.GrannyRuntime?.VERSION ||
          config.available !== true || typeof config.liveAvailable !== 'boolean')
        throw new Error('runtime_unavailable');
      runtimeConfig = {liveAvailable: config.liveAvailable};
    } catch { runtimeConfig = null; runtimeConfigError = true; }
    finally {
      runtimeConfigPending = false;
      if (menuPanel === 'connection') {
        render();
        announce(runtimeConfig?.liveAvailable ? 'Live synthetic conversation is available. Review the separate consent before connecting.' : 'The live model is unavailable. The local demo remains separate.');
      }
    }
  }
  function connectRuntime(mode = 'demo') {
    if (!['demo', 'live'].includes(mode) || (mode === 'live' && !runtimeConfig?.liveAvailable)) return;
    if (runtimeQuarantined) return;
    if (!window.GrannyRuntime) { announce('The connected client is not available in this build.'); return; }
    dispatch('stop');
    editor = null;
    menuPanel = '';
    runtimeTurns = [];
    runtimePreview = null;
    runtimeEditor = null;
    runtimeMode = true;
    runtimeProviderMode = mode;
    const client = window.GrannyRuntime.create({onChange: view => {
      if (runtime !== client || !runtimeMode) return;
      const wasAtBottom = atBottom();
      runtimeView = view;
      if (!view.pending && view.current?.type === 'preview') runtimePreview = view.current.data;
      if (view.snapshot?.state === 'unknown' || view.error === 'effect_unknown') runtimeQuarantined = true;
      render();
      scrollIfReadingEnd(wasAtBottom);
    }});
    runtime = client;
    runtimeView = client.view;
    client.connect({mode, consent: true});
    render();
    focus(composerText);
  }
  async function leaveRuntime(after) {
    if (runtimeView?.snapshot && !['completed', 'stopped', 'failed', 'idle'].includes(runtimeView.snapshot.state))
      await runtime.cancel();
    if (runtimeView?.snapshot && (runtimeView?.connection === 'uncertain' || runtimeView?.stopping || runtimeView?.pending)) {
      menuPanel = 'connection';
      render();
      return;
    }
    runtime.disconnect();
    runtimeMode = false;
    runtimeView = null;
    runtimeTurns = [];
    runtimePreview = null;
    runtimeEditor = null;
    menuPanel = '';
    render();
    if (after) after();
    focus(composerText);
  }
  function taskText(task) {
    if (task.text)
      return task.text;
    const labels = {
      'clarify-person' : 'Which David do you mean?',
      'clarify-channel' : 'How should the draft open?',
      'clarify-body' : 'What should the message say?',
      preview : 'Please check these details before I open the draft.',
      expired : 'That approval expired. Your words are still here.',
      acting : 'Opening your fictional draft…',
      waiting : 'Waiting for the fictional app…',
      verifying : 'Checking the fictional result…',
      completed : 'The fictional draft is open. It has not been sent.',
      unknown :
          'I can’t confirm what happened. Please check before trying again.',
      stopped : 'Stopped. No more steps will run.',
      failed : 'That did not work in this fictional example.'
    };
    return labels[task.stage] || 'Let’s take the next step together.';
  }
  function preview(task) {
    const slots = task.slots || {}, recipient = slots.recipient || {};
    const sending = task.effect === 'send-message';
    const c = card(
        'Check the draft',
        sending
            ? 'This is a fictional send scenario. It will simulate sending this exact message.'
            : 'This opens a fictional, unsent draft. It does not send a message.');
    c.classList.add('preview');
    const dl = node('dl');
    [[ 'To', recipient.name || 'Not chosen' ],
     [ 'Which person', recipient.detail || 'Not chosen' ],
     [ 'Open in', slots.channel || 'Not chosen' ], [
       'What happens', sending ? 'A fictional message is sent'
                               : 'A fictional unsent draft opens'
     ]].forEach(([ a, b ]) => {
      dl.append(node('dt', '', a), node('dd', '', b));
    });
    c.append(dl, node('blockquote', '', slots.body || 'No message text yet.'));
    return c;
  }
  function editablePreview(task) {
    const c = preview(task), slots = task.slots || {},
          recipient = slots.recipient || {},
          F = window.GrannyFixtures || {people : [], channels : []},
          draft = editor || {};
    const fields = node('div', 'editable-fields');
    const recipientField = node('label', '', 'Recipient');
    const r = document.createElement('select');
    r.setAttribute('aria-label', 'Recipient');
    r.dataset.focusKey = 'edit-recipient';
    F.people.forEach(person => {
      const option = node('option', '', person.name + ' — ' + person.detail);
      option.value = person.id;
      option.selected = person.id === (draft.recipient || recipient.id);
      r.append(option);
    });
    recipientField.append(r);
    const channelField = node('label', '', 'Channel');
    const ch = document.createElement('select');
    ch.setAttribute('aria-label', 'Channel');
    ch.dataset.focusKey = 'edit-channel';
    F.channels.forEach(channel => {
      const option = node('option', '', channel);
      option.value = channel;
      option.selected = channel === (draft.channel ?? slots.channel);
      ch.append(option);
    });
    channelField.append(ch);
    const bodyField = node('label', '', 'Message');
    const body = document.createElement('textarea');
    body.rows = 3;
    body.value = draft.body ?? slots.body ?? '';
    body.setAttribute('aria-label', 'Message');
    body.dataset.focusKey = 'edit-body';
    bodyField.append(body);
    [r, ch, body].forEach(input => input.addEventListener('input', () => {
      if (editor)
        Object.assign(
            editor,
            {recipient : r.value, channel : ch.value, body : body.value});
    }));
    fields.append(
        recipientField, channelField, bodyField, button('Save changes', () => {
          editor = null;
          dispatch(
              'edit',
              {recipient : r.value, channel : ch.value, body : body.value});
        }, 'primary'), button('Cancel editing', () => {
          editor = null;
          render();
          focus(thread.querySelector('[data-action=approve]'));
        }));
    c.append(fields);
    return c;
  }
  function beginEdit(task) {
    editor = {
      taskId : task.id,
      recipient : task.slots.recipient && task.slots.recipient.id,
      channel : task.slots.channel,
      body : task.slots.body
    };
    dispatch('expire');
    focus(thread.querySelector('[aria-label=Message]'));
  }
  function photoViewer(items, start, source) {
    let index = start;
    const dialog = document.createElement('dialog');
    const draw = (restore) => {
      const item = items[index], wrap = document.createElement('div');
      wrap.append(
          node('h2', '', item.title || 'Fictional photo'),
          node('p', 'notice', item.description || 'Fictional illustration.'),
          node('p', 'notice', [
            item.sender, item.detail, item.source, item.date
          ].filter(Boolean).join(' · ')));
      const image = document.createElement('img');
      image.src = item.asset || '/assets/garden.svg';
      image.alt = item.alt || item.description || 'Fictional illustration';
      wrap.append(image);
      const actions = node('div', 'dialog-actions');
      actions.append(button('Previous', () => {
                       index = (index + items.length - 1) % items.length;
                       draw('Previous');
                     }), button('Next', () => {
                       index = (index + 1) % items.length;
                       draw('Next');
                     }), button('Close', () => dialog.close()));
      if (active())
        actions.prepend(button('Stop current request', () => {
          dispatch('stop');
          dialog.close();
        }, 'stop-button'));
      wrap.append(actions);
      dialog.replaceChildren(wrap);
      if (restore)
        focus([...dialog.querySelectorAll('button') ].find(
            b => b.textContent === restore));
    };
    draw();
    dialog.setAttribute('aria-label', 'Fictional photo viewer');
    const position = scrollY;
    document.body.append(dialog);
    dialog.addEventListener('close', () => {
      dialog.remove();
      const replacement =
          [...thread.querySelectorAll('[data-focus-key]') ].find(
              e => e.dataset.focusKey === source?.dataset.focusKey);
      focus(source?.isConnected ? source : replacement || composerText);
      window.scrollTo(0, position);
    });
    dialog.showModal();
  }
  function resultView(task, archived = false) {
    const result = task.result || {}, c = node('div', 'result-detail');
    if (task.kind === 'photos' && result.photos) {
      const gallery = node('div', 'photo-gallery');
      result.photos.forEach((item, index) => {
        const b = button('', () => photoViewer(result.photos, index, b),
                         'photo-item', 'photo-' + task.id + '-' + item.id);
        const img = document.createElement('img');
        img.src = item.asset || '/assets/garden.svg';
        img.alt = item.alt || item.description || 'Fictional illustration';
        b.append(img, node('strong', '', item.title || 'Open fictional photo'),
                 node('span', 'notice', [
                   item.sender, item.detail, item.source, item.date
                 ].filter(Boolean).join(' · ')));
        gallery.append(b);
      });
      c.append(gallery);
      if (result.uncertainDate)
        c.append(node('p', 'notice',
                      'The date is uncertain in this fictional example.'));
    } else if (task.kind === 'explain' && result.explanation) {
      if (result.explanation !== task.text)
        c.append(node('p', '', result.explanation));
      if (result.screen?.fields) {
        const source = node('details', 'screen-source');
        source.append(
            node('summary', '',
                 'Supplied fictional screen: ' + result.screen.title));
        const fields = node('dl');
        result.screen.fields.forEach(
            field => fields.append(
                node('dt', '', field.label),
                node('dd', '', field.value + ' — ' + field.description)));
        source.append(fields);
        c.append(source);
      }
      if (result.next === 'returned')
        c.append(card(
            'A garden for every season',
            'Returned to this fictional article. No other app was opened.'));
      if (archived || task.stage !== 'completed')
        return c;
      const a = node('div', 'inline-actions');
      a.append(button('Explain more simply',
                      () => dispatch('submit', 'Explain more simply')));
      if (result.screen && result.screen.previousTarget &&
          result.next !== 'returned')
        a.append(button('Return to ' + result.screen.previousTarget,
                        () => dispatch('submit', 'return'), 'primary'));
      c.append(a);
    } else if (task.kind === 'media' && result.track) {
      const track = typeof result.track === 'string' ? result.track : [
        result.track.title, result.track.performer
      ].filter(Boolean).join(' — ');
      c.classList.add('player-card');
      const verified =
          !archived && task.stage === 'completed' &&
          state.player?.id === result.track.id &&
          !['unknown', 'partial', 'paywall', 'unavailable'].includes(
              task.outcome);
      c.append(node('p', '', track));
      if (verified) {
        c.append(node('p', 'notice',
                      state.playing
                          ? 'Playing · silent simulation'
                          : 'Playback is paused · silent simulation'));
        c.append(button(state.playing ? 'Pause' : 'Resume',
                        () => dispatch('playback'), 'primary'));
      } else
        c.append(node(
            'p', 'notice',
            archived
                ? 'Earlier music request. Current playback is shown separately below.'
                : 'Playback of this request has not been verified.'));
    } else if (task.kind === 'readability' && result.scope) {
      c.append(node(
          'p', '',
          result.externalOnly
              ? 'This setting belongs to another app. I can explain where to change it, but I have not changed it.'
              : 'Granny text is ' +
                    Math.round((result.scale || state.scale) * 100) + '%.'));
      if (!result.externalOnly && !archived)
        c.append(
            button('Restore previous size', () => dispatch('restoreScale')));
    }
    return c;
  }
  function controls(task, c) {
    const row = node('div', 'inline-actions'), stage = task.stage;
    if (task.choices && task.choices.length) {
      (task.choices || []).forEach(choice => {
        const b = button(choice.label, () => dispatch('choose', choice.value),
                         'choice');
        b.dataset.choice = choice.value;
        row.append(b);
      });
    } else if (stage === 'size-preview') {
      [1, 1.15, 1.3, 1.5].forEach(
          scale => row.append(button(
              Math.round(scale * 100) + '%', () => dispatch('setScale', scale),
              state.previewScale === scale ? 'primary' : '')));
      const apply =
          button('Apply this size', () => dispatch('applyScale'), 'primary');
      apply.dataset.action = 'apply';
      row.append(apply, button('Stop', () => dispatch('stop')));
    } else if (stage === 'clarify-body') {
      const edit = document.createElement('textarea');
      edit.rows = 3;
      edit.value = task.slots && task.slots.body || '';
      edit.setAttribute('aria-label', 'Message words');
      const apply =
          button('Use these words', () => dispatch('edit', {body : edit.value}),
                 'primary');
      apply.dataset.action = 'apply';
      row.append(edit, apply);
    } else if (stage === 'preview') {
      const approval = {
        taskId : task.id,
        version : task.version,
        signature : task.permit && task.permit.signature
      };
      const label = task.kind === 'photos'
                        ? 'Open this conversation and look for photos'
                    : task.kind === 'message' && task.effect === 'send-message'
                        ? 'Send this fictional message'
                    : task.kind === 'message' ? 'Open this draft'
                                              : 'Continue';
      const approve = button(label, () => dispatch('approve', approval),
                             'primary', 'approval'),
            change = task.kind === 'message'
                         ? button('Change', () => beginEdit(task))
                         : button('Change', () => dispatch('stop')),
            cancel = button('Cancel', () => dispatch('stop'));
      approve.dataset.action = 'approve';
      change.dataset.action = 'change';
      cancel.dataset.action = 'cancel';
      row.append(approve, change, cancel);
    } else if (stage === 'expired') {
      const renew = button('Review again', () => dispatch('renew'), 'primary',
                           'approval'),
            cancel = button('Cancel', () => dispatch('stop'));
      renew.dataset.action = 'approve';
      cancel.dataset.action = 'cancel';
      row.append(renew, cancel);
    } else if (stage === 'unknown')
      row.append(
          button('Check it yourself', () => dispatch('manual'), 'primary'),
          button('I understand', () => dispatch('acknowledge')));
    c.append(row);
  }
  function render(editing) {
    const prior = document.activeElement;
    const heldFocus = thread.contains(prior) || $('home-secondary').contains(prior);
    const focusKey = prior?.dataset?.focusKey;
    const focusId = prior?.id;
    const selection = heldFocus && typeof prior.selectionStart === 'number'
                          ? [ prior.selectionStart, prior.selectionEnd ]
                          : null;
    const position = scrollY;
    thread.replaceChildren();
    const emptyHome = idleHome();
    const introductionView = homeView === 'introduction';
    $('welcome').hidden = !emptyHome && !introductionView;
    $('introduction').hidden = !introductionView;
    $('home-secondary').hidden = !emptyHome;
    $('continuation').hidden = !continuationVisible ||
                                 homeFixture === 'continuation-hidden';
    document.body.dataset.home = String(emptyHome);
    $('mode-notice').hidden = !runtimeMode && !runtimeQuarantined;
    $('mode-notice').textContent = runtimeQuarantined
      ? 'An earlier connected draft outcome is unknown. No retry or new connected session is available in this tab. Switching views does not undo a draft.'
      : (runtimeProviderMode === 'live' ? 'Live model · fictional text goes to OpenRouter · unsent demo drafts only' : 'Connected local demo · fictional people · unsent drafts only');
    composerText.placeholder = 'Ask me anything…';
    if (runtimeMode) renderRuntime();
    (!runtimeMode ? state.turns || [] : []).forEach(t => {
      const article = turn(t.role, t.text);
      if (t.result && t.kind !== 'message')
        article.append(resultView(t, true));
      thread.append(article);
    });
    if (!runtimeMode)
      renderHomeDestination();
    if (state.task && !runtimeMode) {
      const task = state.task,
            editingTask = !!(editor && editor.taskId === task.id),
            c = card('Granny', taskText(task));
      c.id = 'current-task';
      c.dataset.stage = task.stage;
      c.dataset.kind = task.kind;
      c.querySelector('h2').tabIndex = -1;
      if (task.kind === 'message' && [
            'preview', 'expired', 'acting', 'waiting', 'verifying', 'completed',
            'unknown', 'stopped', 'failed'
          ].includes(task.stage))
        c.append(editingTask ? editablePreview(task) : preview(task));
      if (task.kind !== 'message' && task.stage === 'preview') {
        const slots = task.slots || {};
        c.append(card('Check this step', task.kind === 'photos' ? [slots.person && slots.person.name, slots.person && slots.person.detail, 'Example Messages', slots.date].filter(Boolean).join(' · ') + '. Opening this fictional source may mark it read while the selected photos are checked.' : 'Nothing will happen until you choose Continue.'));
      }
      if (task.kind === 'readability' && task.stage === 'size-preview') {
        const sample = node(
            'p', 'preview-sample',
            'This is a preview of Granny text. You can still change your mind.');
        sample.style.fontSize = (state.previewScale / state.scale) + 'em';
        c.append(sample);
      }
      if (task.kind !== 'message' &&
          (task.result || [ 'completed', 'no-matches' ].includes(task.stage)))
        c.append(resultView(task));
      if (!editingTask)
        controls(task, c);
      thread.append(c);

      if (lastAnnouncement !== taskText(task)) {
        lastAnnouncement = taskText(task);
        announce(lastAnnouncement);
      }
    }
    if (menuPanel === 'history') {
      const history =
          card('Recent activity',
               (state.history || []).length
                   ? 'Scripted activity: this tab remembers only the kind of task and its outcome.'
                   : 'There is no completed activity in this tab yet.');
      history.dataset.panel = 'history';
      if (runtimeMode) history.append(node('p', 'notice', 'Connected results remain in this temporary conversation, not in the scripted activity list.'));
      (state.history || [])
          .forEach(item => history.append(
                       node('p', 'notice', item.job + ' — ' + item.outcome)));
      if ((state.history || []).length)
        history.append(button(
            'Clear recent activity',
            () => ask(
                'Clear recent activity?',
                'This removes the short outcome list from this tab. It does not change any other app.',
                () => dispatch('clearHistory'))));
      history.append(button('Return to conversation', returnToConversation));
      thread.append(history);
    }
    if (menuPanel === 'text') {
      const settings = card(
          'Text size',
          'Choose a comfortable size for this prototype. Other apps are unchanged.');
      settings.dataset.panel = 'text';
      const sample = node(
          'p', 'preview-sample',
          'This is a preview of your text size. Nothing changes until you apply it.');
      sample.style.fontSize = (state.previewScale / state.scale) + 'em';
      settings.append(sample);
      const actions = node('div', 'inline-actions');
      [1, 1.15, 1.3, 1.5].forEach(
          scale => actions.append(button(
              Math.round(scale * 100) + '%', () => dispatch('setScale', scale),
              state.previewScale === scale ? 'primary' : '')));
      settings.append(
          actions,
          button('Apply this size', () => dispatch('applyScale'), 'primary'),
          button('Restore previous size', () => dispatch('restoreScale')),
          button('Return to conversation', returnToConversation));
      thread.append(settings);
    }
    if (menuPanel === 'help') {
      const help = card(
          'What you can ask',
          'You can ask to find fictional family photos, explain a supplied screen, play a fictional song, make Granny’s text easier to read, or open an unsent fictional message draft.');
      help.dataset.panel = 'help';
      if (runtimeMode) help.append(node('p', 'notice', 'Connected mode currently prepares unsent drafts for fictional contacts only. The other four workflows are in the separate scripted demo.'));
      help.append(button('Return to conversation', returnToConversation));
      thread.append(help);
    }
    if (menuPanel === 'preferences') {
      const preferences =
          card('Preferences', 'These choices stay only in this tab.');
      preferences.dataset.panel = 'preferences';
      if (runtimeMode) preferences.append(node('p', 'notice', 'Saved names and Talk preferences below belong to the scripted demo; they are not shared with the connected runtime. Text size applies to both views.'));
      preferences.append(button(
          state.settings && state.settings.voice ? 'Talk prompts on'
                                                 : 'Talk prompts off',
          () => dispatch('voice', !(state.settings && state.settings.voice))));
      const aliases = node('div', 'inline-actions');
      aliases.append(node('h2', '', 'Names you use'));
      (state.aliases || []).forEach(alias => {
        const edit = button(alias.label + ' — edit', () => {
          editingAliasId = alias.id;
          aliasDraft = {...alias};
          render();
          focus($('alias-label'));
        });
        edit.id = 'alias-edit-' + alias.id;
        const remove = button(
            alias.label + ' — remove',
            () => ask(
                'Remove ' + alias.label + '?',
                'This removes the name from this tab. It does not change a contact elsewhere.',
                () => {
                  if (editingAliasId === alias.id) {
                    editingAliasId = null;
                    aliasDraft = null;
                  }
                  dispatch('aliasDelete', alias.id);
                }));
        remove.id = 'alias-delete-' + alias.id;
        aliases.append(edit, remove);
      });
      const currentAlias =
          aliasDraft ||
          (state.aliases || []).find(alias => alias.id === editingAliasId);
      const label = document.createElement('input');
      label.id = 'alias-label';
      label.placeholder = 'Name, for example Sophie';
      label.value = currentAlias ? currentAlias.label : '';
      label.setAttribute('aria-label', 'New name');
      const person = document.createElement('select');
      person.id = 'alias-person';
      (window.GrannyFixtures?.people || []).forEach(p => {
        const option = node('option', '', p.name + ' — ' + p.detail);
        option.value = p.id;
        option.selected = !!currentAlias && p.id === currentAlias.personId;
        person.append(option);
      });
      person.setAttribute('aria-label', 'Person for this name');
      [label, person].forEach(input => input.addEventListener('input', () => {
        aliasDraft = {label : label.value, personId : person.value};
      }));
      const save = button('Save name', () => {
        const value = {
          id : editingAliasId || undefined,
          label : label.value.trim(),
          personId : person.value
        };
        if (!value.label) {
          label.setCustomValidity('Enter a name first.');
          label.reportValidity();
          return;
        }
        editingAliasId = null;
        aliasDraft = null;
        dispatch('aliasSave', value);
      });
      save.id = 'alias-save';
      aliases.append(label, person, save);
      preferences.append(
          aliases, button('Return to conversation', returnToConversation));
      thread.append(preferences);
    }
    if (menuPanel === 'privacy') {
      const privacy = card(
          'Privacy in this prototype',
          runtimeMode ? (runtimeProviderMode === 'live' ? 'Live synthetic conversation: your new text and bounded conversation history go through the local runtime to OpenRouter/Qwen. Only fictional details are permitted. No microphone, screen, real contacts or Android access occurs. Browser reset does not delete provider-held data.' : 'Connected local demo: fictional requests go to the loopback runtime. Demo drafts are stored by that process, not sent. No microphone or Android access occurs.') : 'Scripted data stays in this tab’s memory. No microphone, account, tracking or background storage is used. Please use fictional details.');
      privacy.dataset.panel = 'privacy';
      privacy.append(node(
          'p', '',
          runtimeMode ? 'Reset clears this browser view, not saved demo drafts or the backend session. The runtime keeps synthetic drafts for its process lifetime; restarting it creates a new demo store. A lost connection is not proof an action stopped.' : 'Recent activity keeps up to 20 task/outcome summaries, without message words or people. Your visible conversation is temporary. Reloading clears the scripted state.'));
      privacy.append(button(
          'Reset everything',
          () => ask(
              'Reset this prototype?',
              'This clears the conversation, activity, entered words, changed names and preferences, and restores the fictional starting examples. Nothing in another app changes.',
              fullReset),
          'danger'));
      privacy.append(button('Return to conversation', returnToConversation));
      thread.append(privacy);
    }
    if (menuPanel === 'connection') {
      const connection = card('Demo connection', runtimeMode
        ? (runtimeProviderMode === 'live' ? 'You are using live synthetic conversation through OpenRouter/Qwen. Draft creation and verification stay in the local demo; no message is sent.' : 'You are using the connected local demo. Its runtime creates and independently reads back a real local demo draft; no message is sent.')
        : 'The default experience is scripted in this tab. You can separately try the local runtime when its loopback server is running.');
      connection.dataset.panel = 'connection';
      connection.append(node('p', '', 'Use fictional details only. Local demo mode uses a stub interpreter and local MCP tools, not a cloud model. It does not access accounts or control Android. The runtime temporarily stores synthetic drafts; browser reset does not delete them.'));
      if (runtimeQuarantined) connection.append(node('p', 'notice', 'A draft outcome in this tab is unknown. Creating another connected session is disabled to avoid a blind retry.'));
      if (runtimeMode) connection.append(button('Return to scripted demo', () => ask(
        'Leave the connected demo?', 'I will request Stop before leaving unfinished work. An unknown draft outcome will remain uncertain; leaving does not undo a draft.', () => leaveRuntime())));
      else if (!runtimeQuarantined) connection.append(button('Connect to local demo', () => {
        if (hasWork()) ask('Switch to the local demo?', 'This stops the unfinished scripted request. Your entered words and text size stay here.', connectRuntime);
        else connectRuntime();
      }, 'primary'));
      if (!runtimeMode && !runtimeQuarantined) {
        const discover = button(runtimeConfigPending ? 'Checking availability…' : 'Check live model availability', discoverLiveRuntime);
        discover.disabled = runtimeConfigPending;
        connection.append(discover);
        if (runtimeConfig?.liveAvailable) connection.append(button('Review live conversation consent', () => ask(
          'Use live synthetic conversation?',
          'Use fictional text only. Your new conversation and up to ten earlier messages will go to OpenRouter/Qwen. Model interpretation is experimental and may fail. Creating a draft still needs its own exact confirmation. No recording, real accounts or sending are enabled. Continue starts a fresh conversation; it makes no model call until you submit text.',
          () => connectRuntime('live'))));
        else if (runtimeConfig || runtimeConfigError) connection.append(node('p', 'notice', 'The live model is unavailable. You can still try the local demo.'));
      }
      connection.append(button('Return to conversation', returnToConversation));
      thread.append(connection);
    }
    if (!runtimeMode && state.player &&
        !(state.task?.kind === 'media' && state.task.stage === 'completed' &&
          state.task.result?.track?.id === state.player.id)) {
      const player = card('Your music',
                          state.player.title + ' — ' + state.player.performer);
      player.classList.add('player-card');
      player.id = 'current-player';
      player.append(node('p', 'notice',
                         state.playing
                             ? 'Playing · silent simulation'
                             : 'Playback is paused · silent simulation'),
                    button(state.playing ? 'Pause' : 'Resume',
                           () => dispatch('playback'), 'primary'));
      thread.append(player);
    }
    thread.querySelectorAll('[data-panel]').forEach(panel => {
      const heading = panel.querySelector('h2');
      heading.tabIndex = -1;
      heading.dataset.focusKey = 'panel-' + panel.dataset.panel;
    });
    $('stop-button').hidden = !active();
    $('stop-dock').hidden = !active();
    $('menu-button').setAttribute('aria-expanded', String(!$('menu').hidden));
    document.documentElement.style.setProperty('--app-scale',
                                               String(state.scale || 1));
    if (heldFocus) {
      const target = (focusId && $(focusId)) || (focusKey && [
                       ...document.querySelectorAll('[data-focus-key]')
                     ].find(n => n.dataset.focusKey === focusKey));
      focus(target || thread.querySelector('#current-task h2') || composerText);
      if (target && selection && typeof target.setSelectionRange === 'function')
        target.setSelectionRange(...selection);
    }
    window.scrollTo(0, position);
    restoreFocus = false;
    if (emptyHome)
      requestAnimationFrame(updateRoomLayout);
  }
  function hasWork() {
    if (runtimeMode) return active() || !!runtimeEditor;
    return !!(
        state.task && state.task.kind !== 'unsupported' &&
        !['completed', 'unknown', 'stopped', 'failed', 'no-matches'].includes(
            state.task.stage));
  }
  function clearLocalView() {
    composerText.value = '';
    editor = null;
    menuPanel = '';
    homeView = 'home';
    homeReturn = null;
    homeListReturnRoom = '';
    editingAliasId = null;
    aliasDraft = null;
    $('menu').hidden = true;
    lastAnnouncement = '';
  }
  function returnToConversation() {
    menuPanel = '';
    homeView = 'home';
    render();
    focus(panelReturn || composerText);
    window.scrollTo(0, panelScroll);
  }
  function fullReset() {
    if (runtimeMode) { leaveRuntime(fullReset); return; }
    clearLocalView();
    continuationVisible = true;
    homeFixture = 'default';
    dispatch('reset');
    document.documentElement.style.setProperty('--review-scale', '1');
    if ($('review-panel')) {
      $('review-delay').value = '650';
      $('review-fault').value = '';
      $('review-screen').value = 'display-settings';
      $('review-home-fixture').value = 'default';
      $('review-scale').value = '1';
      $('review-send').checked = false;
    }
    renderRooms();
    $('introduction').hidden = true;
    focus(composerText);
  }
  function ask(title, text, fn, source) {
    pending = fn;
    dialogReturn = source || document.activeElement;
    $('confirm-title').textContent = title;
    $('confirm-text').textContent = text;
    $('confirm-dialog').returnValue = '';
    $('confirm-stop').hidden = !active();
    $('confirm-dialog').showModal();
  }
  function contextualReply(text) {
    const task = state.task;
    if (!task)
      return false;
    // The model owns contextual-language rules, including safe preview
    // corrections.
    if (typeof P.isFollowup === 'function' && P.isFollowup(state, text))
      return dispatch('submit', text);
    return false;
  }
  function newRequest(text) {
    if (!text.trim()) {
      composerText.setCustomValidity('Type a request before choosing Send.');
      composerText.reportValidity();
      announce('Type a request before choosing Send.');
      return;
    }
    composerText.setCustomValidity('');
    homeView = 'home';
    homeReturn = null;
    if (runtimeMode) {
      if (runtimeQuarantined || runtimeView?.connection !== 'connected' || runtimeView?.stopping) {
        announce('Keep your words here until the connection and draft outcome are known.');
        return;
      }
      const send = async () => {
        if (runtimeView?.snapshot?.state === 'unknown') return;
        if (runtimeTurns.length && runtimeView?.current)
          runtimeTurns.push({role: 'assistant', text: runtimeCopy()});
        const submitted = {role: 'user', text};
        runtimeTurns.push(submitted);
        runtimePreview = null;
        runtimeEditor = null;
        composerText.value = '';
        menuPanel = '';
        const accepted = await runtimeCommand('turn', {text});
        if (!accepted) {
          submitted.text = text + '\nNot accepted or not yet acknowledged by the local demo.';
          if (!composerText.value) composerText.value = text;
          render();
        }
      };
      if (hasWork() && runtimeView?.snapshot?.state !== 'clarifying')
        ask('Replace this request?', 'The local runtime will stop preparation of the earlier request. If a draft may already have been created, it will refuse a new draft until that outcome is known.', send, composerText);
      else send();
      return;
    }
    const navigationRequests = {
      'settings' : 'preferences',
      'preferences' : 'preferences',
      'saved names' : 'preferences',
      'privacy' : 'privacy',
      'help' : 'help',
      'recent activity' : 'history',
      'show my recent activity' : 'history',
      'text size' : 'text'
    };
    const requestedPanel = text.trim().toLowerCase();
    const navigation = Object.hasOwn(navigationRequests, requestedPanel)
                           ? navigationRequests[requestedPanel]
                           : null;
    if (navigation) {
      composerText.value = '';
      panelReturn = composerText;
      panelScroll = scrollY;
      menuPanel = navigation;
      render();
      thread.querySelector('[data-panel="' + navigation + '"] h2')?.focus();
      return;
    }
    if (contextualReply(text)) {
      composerText.value = '';
      return;
    }
    const submit = () => {
      composerText.value = '';
      menuPanel = '';
      editor = null;
      dispatch('submit', text);
    };
    if (hasWork())
      ask('Start a new request?',
          'This stops the unfinished request before starting another. Its temporary details will be replaced.',
          submit, composerText);
    else
      submit();
  }
  $('composer').addEventListener('submit', event => {
    event.preventDefault();
    newRequest(composerText.value);
  });
  composerText.addEventListener('input', () => composerText.setCustomValidity(''));
  $('open-kitchen').addEventListener(
      'click', event => openHomeDestination('kitchen', event.currentTarget));
  $('hide-continuation').addEventListener('click', () => {
    continuationVisible = false;
    $('continuation').hidden = true;
    announce('Kitchen continuation hidden for this session.');
    focus(composerText);
  });
  $('see-all-rooms').addEventListener(
      'click', event => openHomeDestination('rooms', event.currentTarget));
  $('rooms-previous').addEventListener(
      'click', event => moveRooms(-1, event.currentTarget));
  $('rooms-next').addEventListener(
      'click', event => moveRooms(1, event.currentTarget));
  $('room-viewport').addEventListener('scroll', () => {
    cancelAnimationFrame(roomScrollFrame);
    roomScrollFrame = requestAnimationFrame(updateRoomPosition);
  }, {passive : true});
  function openTalk(source) {
    dialogReturn = source;
    $('talk-dialog').returnValue = '';
    $('talk-title').textContent = 'Listening · simulated';
    $('talk-dialog').showModal();
  }
  $('talk').addEventListener('click', () => openTalk($('talk')));
  $('intro-talk').addEventListener('click', () => openTalk($('intro-talk')));
  $('talk-text').addEventListener('input', () => {
    $('talk-title').textContent = 'Your transcript · simulated';
  });
  $('talk-stop').addEventListener('click', () => {
    if (hasWork())
      dispatch('stop');
  });
  $('intro-skip').addEventListener('click', () => {
    homeView = 'home';
    render();
    focus(composerText);
  });
  $('talk-dialog').addEventListener('close', () => {
    const result = $('talk-dialog').returnValue;
    if (result === 'use')
      newRequest($('talk-text').value);
    if (result === 'decline')
      focus(composerText);
    else
      focus(dialogReturn);
  });
  $('confirm-dialog').addEventListener('close', () => {
    const callback = pending, source = dialogReturn;
    pending = null;
    if ($('confirm-dialog').returnValue === 'confirm' && callback)
      callback();
    focus(source?.getClientRects().length ? source : composerText);
  });
  $('confirm-stop').addEventListener('click', () => {
    dispatch('stop');
    $('confirm-dialog').close('cancel');
  });
  $('stop-button').addEventListener('click', () => dispatch('stop'));
  $('menu-button').addEventListener('click', () => {
    if ($('menu').hidden) {
      panelReturn = $('menu-button');
      panelScroll = scrollY;
    }
    $('menu').hidden = !$('menu').hidden;
    $('menu-button').setAttribute('aria-expanded', String(!$('menu').hidden));
  });
  document.querySelectorAll('[data-menu]')
      .forEach(b => b.addEventListener('click', () => {
        const what = b.dataset.menu;
        $('menu').hidden = true;
        if (what === 'return') {
          returnToConversation();
          return;
        }
        if (what === 'introduction') {
          homeView = 'introduction';
          menuPanel = '';
          render();
          focus($('intro-talk'));
          return;
        }
        if (what === 'new') {
          const fn = () => {
            if (runtimeMode) { leaveRuntime(() => { clearLocalView(); dispatch('clearSession'); }); return; }
            clearLocalView();
            dispatch('clearSession');
            focus(composerText);
          };
          hasWork() || composerText.value.trim() || state.turns.length ||
                  state.history.length
              ? ask('Start a new conversation?',
                    'This clears the conversation, unfinished input and recent activity. Text size and saved names stay in this tab.',
                    fn, b)
              : fn();
        }
        if ([ 'text', 'history', 'help', 'preferences', 'privacy', 'connection' ].includes(
                what)) {
          homeView = 'home';
          menuPanel = what;
          render();
          const heading =
              thread.querySelector('[data-panel="' + what + '"] h2');
          if (heading) {
            heading.tabIndex = -1;
            heading.focus();
          }
        }
      }));
  const review = new URLSearchParams(location.search).get('review') === '1';
  if (review) {
    const panel = node('aside', 'review-panel');
    panel.id = 'review-panel';
    panel.setAttribute('aria-label', 'Reviewer tools');
    panel.innerHTML =
        '<h2>Review tools</h2><p>Reviewer-only metadata: J-001/002/003/005/006/007 · five fictional workflows. Fixed date: 14 September 2026. Home, continuation and room fixtures are fictional, in-memory and separate from model context.</p><label>Sample <select id="review-sample"><option value="Tell David I’ll call after dinner.">Message</option><option value="Find photos from Sophie on yesterday">Photos</option><option value="Explain screen display-settings">Explain</option><option value="Play Nina Simone">Media</option><option value="Make Granny text larger">Readability</option></select></label><label>Screen fixture <select id="review-screen"><option value="display-settings">Confusing display settings</option><option value="signin">Protected sign-in</option><option value="unknown">Unknown screen</option></select></label><label>Delay <select id="review-delay"><option value="0">No delay</option><option value="650" selected>650 ms</option><option value="1500">1.5 seconds</option></select></label><label>Outcome fixture <select id="review-fault"><option value="">None</option><option value="unknown">Unknown</option><option value="partial">Partial</option><option value="offline">Offline</option><option value="permission">Permission</option><option value="auth">Authentication</option><option value="paywall">Paywall</option><option value="unavailable">Unavailable</option><option value="noPhotos">No photo matches</option><option value="uncertainDate">Uncertain photo date</option></select></label><label>Home fixture <select id="review-home-fixture"><option value="default">Natural fit / overflow</option><option value="continuation-hidden">Continuation hidden</option><option value="no-rooms">No rooms</option><option value="one-room">One room</option><option value="all-fit">All rooms fit</option><option value="overflow">Forced overflow</option><option value="image-failure">Portrait failure</option></select></label><label>Review text scale <select id="review-scale"><option value="1">100%</option><option value="2">200%</option></select></label><label><input type="checkbox" id="review-send"> Hypothetical fictional send</label><div><button type="button" id="review-inject">Inject selected outcome now</button><button type="button" id="review-expire">Expire preview</button><button type="button" id="review-clock">Advance test clock</button><button type="button" id="review-reset">Full reset</button></div>';
    document.body.append(panel);
    $('review-sample')
        .addEventListener('change',
                          e => { composerText.value = e.target.value; });
    $('review-screen').addEventListener('change', e => {
      dispatch('reviewer', {screen : e.target.value});
      composerText.value = 'Explain screen ' + e.target.value;
    });
    $('review-delay').addEventListener('change', e => dispatch('reviewer', {
                                                   delay :
                                                       Number(e.target.value)
                                                 }));
    $('review-fault').addEventListener('change', e => dispatch('reviewer', {
                                                   fault : e.target.value
                                                 }));
    $('review-home-fixture').addEventListener('change', e => {
      homeFixture = e.target.value;
      continuationVisible = homeFixture !== 'continuation-hidden';
      renderRooms();
      render();
    });
    $('review-send').addEventListener('change', e => dispatch('reviewer', {
                                                  sendMode : e.target.checked
                                                }));
    $('review-scale').addEventListener('change', e => {
      document.documentElement.style.setProperty('--review-scale',
                                                 e.target.value);
      updateRoomLayout();
    });
    $('review-inject')
        .addEventListener(
            'click',
            () => dispatch('fault', $('review-fault').value || 'failed'));
    $('review-expire').addEventListener('click', () => dispatch('expire'));
    $('review-clock').addEventListener('click', () => dispatch('tick', 15000));
    $('review-reset')
        .addEventListener(
            'click',
            () => ask(
                'Reset everything?',
                'This clears the conversation, names, text size, and reviewer setup in this tab.',
                fullReset, $('review-reset')));
  }
  if (window.GrannyScheduler)
    scheduler = window.GrannyScheduler.create({
      getState : () => state,
      dispatch : (event, value, guard) =>
          P.dispatch(state, event, value, guard),
      onChange : () => {
        const readingEnd = atBottom();
        render();
        scrollIfReadingEnd(readingEnd);
      },
      setTimeout : (...args) => window.setTimeout(...args),
      clearTimeout : (...args) => window.clearTimeout(...args),
      now : () => performance.now()
    });
  const fitComposer = () => {
    document.body.dataset.compactComposer =
        String($('composer').offsetHeight > innerHeight * 0.42);
  };
  new ResizeObserver(fitComposer).observe($('composer'));
  new ResizeObserver(updateRoomLayout).observe($('room-viewport'));
  window.addEventListener('resize', () => {
    fitComposer();
    updateRoomLayout();
  });
  renderRooms();
  render();
  fitComposer();
  if (scheduler && scheduler.sync)
    scheduler.sync();
})();
