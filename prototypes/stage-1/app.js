/* Conversation UI only. Model and scheduler remain the authority for task state. */
(() => {
  'use strict';
  const P = window.GrannyPrototype;
  if (!P) return;
  const state = P.create();
  const $ = id => document.getElementById(id);
  const thread = $('thread'), composerText = $('request');
  let scheduler, pending = null, dialogReturn = null, menuPanel = '', lastAnnouncement = '', restoreFocus = false;

  function atBottom() { return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100; }
  function scrollIfReadingEnd(wasAtBottom) { if (wasAtBottom) requestAnimationFrame(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' })); }
  function active() { return !!(state.task && (P.ACTIVE || ['planning','acting','waiting','verifying']).includes(state.task.stage)); }
  function announce(text) { $('announcement').textContent = ''; requestAnimationFrame(() => { $('announcement').textContent = text; }); }
  function dispatch(event, value, guard) {
    const wasAtBottom = atBottom();
    if (scheduler && scheduler.elapse) scheduler.elapse();
    const changed = P.dispatch(state, event, value, guard);
    if (changed) { restoreFocus = true; render(); if (scheduler && scheduler.sync) scheduler.sync(); scrollIfReadingEnd(wasAtBottom); }
    return changed;
  }
  function node(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function button(label, fn, cls, focusKey) { const b = node('button', cls || '', label); b.type = 'button'; b.dataset.focusKey = focusKey || label; b.addEventListener('click', fn); return b; }
  function turn(role, text) { const c = node('article', 'turn ' + role); c.append(node('span', 'turn-label', role === 'user' ? 'You' : 'Granny'), node('p', '', text)); return c; }
  function card(title, text) { const c = node('section', 'task-card'); if (title) c.append(node('h2', '', title)); if (text) c.append(node('p', '', text)); return c; }
  function taskText(task) {
    if (task.text) return task.text;
    const labels = { 'clarify-person':'Which David do you mean?', 'clarify-channel':'How should the draft open?', 'clarify-body':'What should the message say?', preview:'Please check these details before I open the draft.', expired:'That approval expired. Your words are still here.', acting:'Opening your fictional draft…', waiting:'Waiting for the fictional app…', verifying:'Checking the fictional result…', completed:'The fictional draft is open. It has not been sent.', unknown:'I can’t confirm what happened. Please check before trying again.', stopped:'Stopped. No more steps will run.', failed:'That did not work in this fictional example.' };
    return labels[task.stage] || 'Let’s take the next step together.';
  }
  function preview(task) {
    const slots = task.slots || {}, recipient = slots.recipient || {};
    const c = card('Check the draft', 'This opens a fictional, unsent draft. It does not send a message.'); c.classList.add('preview');
    const dl = node('dl'); [['To', recipient.name || 'Not chosen'], ['Which person', recipient.detail || 'Not chosen'], ['Open in', slots.channel || 'Not chosen'], ['What happens', 'A fictional unsent draft opens']].forEach(([a,b]) => { dl.append(node('dt','',a), node('dd','',b)); });
    c.append(dl, node('blockquote','',slots.body || 'No message text yet.'));
    return c;
  }
  function editablePreview(task) {
    const c = preview(task), slots = task.slots || {}, recipient = slots.recipient || {}, F = window.GrannyFixtures || { people:[], channels:[] };
    const fields = node('div', 'editable-fields');
    const recipientField = node('label','', 'Recipient'); const r = document.createElement('select'); r.setAttribute('aria-label', 'Recipient'); F.people.forEach(person => { const option = node('option','',person.name + ' — ' + person.detail); option.value = person.id; option.selected = person.id === recipient.id; r.append(option); }); recipientField.append(r);
    const channelField = node('label','', 'Channel'); const ch = document.createElement('select'); ch.setAttribute('aria-label', 'Channel'); F.channels.forEach(channel => { const option = node('option','',channel); option.value = channel; option.selected = channel === slots.channel; ch.append(option); }); channelField.append(ch);
    const bodyField = node('label','', 'Message'); const body = document.createElement('textarea'); body.rows = 3; body.value = slots.body || ''; body.setAttribute('aria-label', 'Message'); bodyField.append(body);
    fields.append(recipientField, channelField, bodyField, button('Save changes', () => {
      dispatch('edit', { recipient:r.value, channel:ch.value, body:body.value });
    }, 'primary'));
    c.append(fields); return c;
  }
  function photoViewer(items, start, source) {
    let index = start;
    const dialog = document.createElement('dialog');
    const draw = () => {
      const item = items[index], wrap = document.createElement('div');
      wrap.append(node('h2', '', item.title || 'Fictional photo'), node('p', 'notice', item.description || 'Fictional illustration.'));
      const image = document.createElement('img'); image.src = item.asset || '/assets/garden.svg'; image.alt = item.alt || item.description || 'Fictional illustration'; wrap.append(image);
      const actions = node('div', 'dialog-actions'); actions.append(button('Previous', () => { index = (index + items.length - 1) % items.length; draw(); }), button('Next', () => { index = (index + 1) % items.length; draw(); }), button('Close', () => dialog.close())); wrap.append(actions); dialog.replaceChildren(wrap);
    };
    draw(); document.body.append(dialog); dialog.addEventListener('close', () => { dialog.remove(); source?.focus(); }); dialog.showModal();
  }
  function resultView(task) {
    const result = task.result || {}, c = node('div', 'result-detail');
    if (task.kind === 'photos' && result.photos) {
      const gallery = node('div', 'photo-gallery'); result.photos.forEach((item, index) => { const b = button(item.title || 'Open fictional photo', () => photoViewer(result.photos, index, b), 'photo-item'); const img = document.createElement('img'); img.src = item.asset || '/assets/garden.svg'; img.alt = item.alt || item.description || 'Fictional illustration'; b.prepend(img); gallery.append(b); }); c.append(gallery); if (result.uncertainDate) c.append(node('p', 'notice', 'The date is uncertain in this fictional example.'));
    } else if (task.kind === 'explain' && result.explanation) {
      c.append(node('p', '', result.explanation)); const a = node('div','inline-actions'); a.append(button('Explain more simply', () => dispatch('submit','simpler'))); if (result.previousTarget) a.append(button('Return to ' + result.previousTarget, () => dispatch('submit','return'), 'primary')); c.append(a);
    } else if (task.kind === 'media' && result.track) {
      const track = typeof result.track === 'string' ? result.track : [result.track.title, result.track.performer].filter(Boolean).join(' — ');
      c.append(node('p', '', track + (result.playing ? ' is playing in this simulation.' : ' is paused in this simulation.'))); c.append(button(result.playing ? 'Pause' : 'Resume', () => dispatch('playback'), 'primary'));
    } else if (task.kind === 'readability' && result.scope) {
      c.append(node('p', '', result.externalOnly ? 'This setting belongs to another app. I can explain where to change it, but I have not changed it.' : 'Granny text is ' + Math.round((result.scale || state.scale) * 100) + '%.'));
      if (!result.externalOnly) c.append(button('Restore previous size', () => dispatch('restoreScale')));
    }
    return c;
  }
  function controls(task, c) {
    const row = node('div', 'inline-actions'), stage = task.stage;
    if (task.choices && task.choices.length) {
      (task.choices || []).forEach(choice => { const b = button(choice.label, () => dispatch('choose', choice.value), 'choice'); b.dataset.choice = choice.value; row.append(b); });
    } else if (stage === 'clarify-body') {
      const edit = document.createElement('textarea'); edit.rows = 3; edit.value = task.slots && task.slots.body || ''; edit.setAttribute('aria-label','Message words');
      const apply = button('Use these words', () => dispatch('edit', { body:edit.value }), 'primary'); apply.dataset.action = 'apply'; row.append(edit, apply);
    } else if (stage === 'preview') {
      const approval = { taskId:task.id, version:task.version, signature:task.permit && task.permit.signature };
      const label = task.kind === 'photos' ? 'Open this conversation and look for photos' : task.kind === 'message' && task.effect === 'send-message' ? 'Send this fictional message' : task.kind === 'message' ? 'Open this draft' : 'Continue';
      const approve = button(label, () => dispatch('approve', approval), 'primary', 'approval'), change = task.kind === 'message' ? button('Change', () => render(true)) : button('Change', () => dispatch('stop')), cancel = button('Cancel', () => dispatch('stop')); approve.dataset.action = 'approve'; change.dataset.action = 'change'; cancel.dataset.action = 'cancel'; row.append(approve, change, cancel);
    } else if (stage === 'expired') { const renew = button('Review again', () => dispatch('renew'), 'primary', 'approval'), cancel = button('Cancel', () => dispatch('stop')); renew.dataset.action = 'approve'; cancel.dataset.action = 'cancel'; row.append(renew, cancel); }
    else if (stage === 'unknown') row.append(button('Check it yourself', () => dispatch('manual'), 'primary'), button('I understand', () => dispatch('acknowledge')));
    c.append(row);
  }
  function render(editing) {
    const focusKey = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.focusKey;
    thread.replaceChildren();
    $('welcome').hidden = !!(state.turns && state.turns.length);
    (state.turns || []).forEach(t => thread.append(turn(t.role, t.text)));
    if (state.task) {
      const task = state.task, c = card('Granny', taskText(task)); c.id = 'current-task'; c.dataset.stage = task.stage; c.dataset.kind = task.kind; c.querySelector('h2').tabIndex = -1;
      if (task.kind === 'message' && ['preview','expired','acting','waiting','verifying','completed','unknown','stopped','failed'].includes(task.stage)) c.append(editing && task.stage === 'preview' ? editablePreview(task) : preview(task));
      if (task.kind !== 'message' && task.stage === 'preview') c.append(card('Check this step', task.kind === 'photos' ? 'This fictional conversation may be marked as read while the selected photos are checked.' : 'Nothing will happen until you choose Continue.'));
      if (task.kind !== 'message' && (task.result || ['completed','no-matches'].includes(task.stage))) c.append(resultView(task));
      controls(task, c); thread.append(c);
      if (editing) c.querySelector('input, textarea')?.focus();
      if (lastAnnouncement !== taskText(task)) { lastAnnouncement = taskText(task); announce(lastAnnouncement); }
    }
    if (menuPanel === 'history') {
      const history = card('Recent activity', (state.history || []).length ? 'This tab remembers only the kind of task and its outcome.' : 'There is no completed activity in this tab yet.');
      history.dataset.panel = 'history';
      (state.history || []).forEach(item => history.append(node('p', 'notice', item.job + ' — ' + item.outcome)));
      if ((state.history || []).length) history.append(button('Clear recent activity', () => ask('Clear recent activity?', 'This removes the short outcome list from this tab. It does not change any other app.', () => dispatch('clearHistory'))));
      history.append(button('Return to conversation', () => { menuPanel = ''; render(); }));
      thread.append(history);
    }
    if (menuPanel === 'text') {
      const settings = card('Text size', 'Choose a comfortable size for this prototype. Other apps are unchanged.');
      settings.dataset.panel = 'text';
      const actions = node('div', 'inline-actions'); [1,1.15,1.3,1.5].forEach(scale => actions.append(button(Math.round(scale * 100) + '%', () => dispatch('setScale', scale), state.previewScale === scale ? 'primary' : ''))); settings.append(actions, button('Apply this size', () => dispatch('applyScale'), 'primary'), button('Restore previous size', () => dispatch('restoreScale')), button('Return to conversation', () => { menuPanel = ''; render(); })); thread.append(settings);
    }
    if (menuPanel === 'help') { const help = card('What you can ask', 'You can ask to find fictional family photos, explain a supplied screen, play a fictional song, make Granny’s text easier to read, or open an unsent fictional message draft.'); help.dataset.panel = 'help'; help.append(button('Return to conversation', () => { menuPanel = ''; render(); })); thread.append(help); }
    if (menuPanel === 'preferences') {
      const preferences = card('Preferences', 'These choices stay only in this tab.');
      preferences.dataset.panel = 'preferences';
      preferences.append(button(state.settings && state.settings.voice ? 'Talk prompts on' : 'Talk prompts off', () => dispatch('voice', !(state.settings && state.settings.voice))));
      const aliases = node('div', 'inline-actions'); aliases.append(node('h2','', 'Names you use'));
      (state.aliases || []).forEach(alias => { const remove = button(alias.label + ' — remove', () => ask('Remove ' + alias.label + '?', 'This removes the name from this tab. It does not change a contact elsewhere.', () => dispatch('aliasDelete', alias.id))); remove.id = 'alias-delete-' + alias.id; aliases.append(remove); });
      const label = document.createElement('input'); label.id = 'alias-label'; label.placeholder = 'Name, for example Sophie'; label.setAttribute('aria-label','New name');
      const person = document.createElement('select'); person.id = 'alias-person'; (window.GrannyFixtures?.people || []).forEach(p => { const option = node('option','',p.name + ' — ' + p.detail); option.value = p.id; person.append(option); }); person.setAttribute('aria-label','Person for this name');
      const save = button('Save name', () => dispatch('aliasSave', { label:label.value, personId:person.value }), 'primary'); save.id = 'alias-save'; aliases.append(label, person, save);
      preferences.append(aliases, button('Return to conversation', () => { menuPanel = ''; render(); }));
      thread.append(preferences);
    }
    $('stop-button').hidden = !active();
    $('menu-button').setAttribute('aria-expanded', String(!$('menu').hidden));
    document.documentElement.style.setProperty('--app-scale', String(state.scale || 1));
    if (focusKey && !editing && restoreFocus) requestAnimationFrame(() => { const target = Array.from(thread.querySelectorAll('[data-focus-key]')).find(n => n.dataset.focusKey === focusKey); (target || thread.querySelector('.task-card h2'))?.focus(); });
    restoreFocus = false;
  }
  function hasWork() { return !!(state.task && state.task.kind === 'message' && !['completed','unknown','stopped','failed'].includes(state.task.stage)); }
  function ask(title, text, fn, source) { pending = fn; dialogReturn = source || document.activeElement; $('confirm-title').textContent = title; $('confirm-text').textContent = text; $('confirm-dialog').showModal(); }
  function contextualReply(text) {
    const task = state.task;
    if (!task) return false;
    // The model owns contextual-language rules, including safe preview corrections.
    if (typeof P.isFollowup === 'function' && P.isFollowup(state, text)) return dispatch('submit', text);
    return false;
  }
  function newRequest(text) {
    if (!text.trim()) return;
    if (contextualReply(text)) { composerText.value = ''; return; }
    const submit = () => { composerText.value = ''; dispatch('submit', text); };
    if (hasWork()) ask('Start a new request?', 'Your unfinished message details will be replaced. The words are not saved anywhere.', submit, composerText); else submit();
  }
  $('composer').addEventListener('submit', event => { event.preventDefault(); newRequest(composerText.value); });
  $('talk').addEventListener('click', () => { dialogReturn = $('talk'); $('talk-dialog').showModal(); });
  $('talk-dialog').addEventListener('close', () => { if ($('talk-dialog').returnValue === 'use') newRequest($('talk-text').value); dialogReturn?.focus(); });
  $('confirm-dialog').addEventListener('close', () => { if ($('confirm-dialog').returnValue === 'confirm' && pending) pending(); pending = null; dialogReturn?.focus(); });
  $('stop-button').addEventListener('click', () => dispatch('stop'));
  $('menu-button').addEventListener('click', () => { $('menu').hidden = !$('menu').hidden; $('menu-button').setAttribute('aria-expanded', String(!$('menu').hidden)); });
  document.querySelectorAll('[data-menu]').forEach(b => b.addEventListener('click', () => {
    const what = b.dataset.menu; $('menu').hidden = true;
    if (what === 'return') { menuPanel = ''; render(); return; }
    if (what === 'new') { const fn = () => dispatch('clearSession'); hasWork() ? ask('Start a new conversation?', 'Your unfinished message details will be replaced. Text size and saved names stay in this tab.', fn, b) : fn(); }
    if (what === 'text' || what === 'history' || what === 'help' || what === 'preferences') { menuPanel = menuPanel === what ? '' : what; render(); }
  }));
  const review = new URLSearchParams(location.search).get('review') === '1';
  if (review) {
    const panel = node('aside', 'review-panel'); panel.id = 'review-panel'; panel.setAttribute('aria-label', 'Reviewer tools');
    panel.innerHTML = '<h2>Review tools</h2><p>Reviewer-only metadata: J-003 / SCR-003–008 / CMP-001–007.</p><label>Sample <select id="review-sample"><option value="Tell David I’ll call after dinner.">Message</option><option value="Find Sophie’s photos">Photos</option><option value="Explain this screen">Explain</option><option value="Play Nina Simone">Media</option><option value="Make text larger">Readability</option></select></label><label>Screen fixture <select id="review-screen"><option value="article">Article</option><option value="settings">Settings</option><option value="protected">Protected screen</option></select></label><label>Delay <select id="review-delay"><option value="0">No delay</option><option value="650" selected>650 ms</option><option value="1500">1.5 seconds</option></select></label><label>Outcome fixture <select id="review-fault"><option value="">None</option><option value="unknown">Unknown / partial outcome</option></select></label><label>Territory <select id="review-territory"><option value="neutral">Neutral</option><option value="open-day">Open Day</option><option value="bright-signal">Bright Signal</option></select></label><label>Review text scale <select id="review-scale"><option value="1">100%</option><option value="2">200%</option></select></label><label><input type="checkbox" id="review-send"> Hypothetical fictional send</label><div><button type="button" id="review-inject">Inject failure now</button><button type="button" id="review-expire">Expire preview</button><button type="button" id="review-clock">Advance test clock</button><button type="button" id="review-reset">Full reset</button></div>';
    document.body.append(panel); $('review-sample').addEventListener('change', e => { composerText.value = e.target.value; }); $('review-screen').addEventListener('change', e => dispatch('reviewer', { screen:e.target.value })); $('review-delay').addEventListener('change', e => dispatch('reviewer', { delay:Number(e.target.value) })); $('review-fault').addEventListener('change', e => dispatch('reviewer', { fault:e.target.value })); $('review-territory').addEventListener('change', e => { document.body.dataset.territory = e.target.value; dispatch('reviewer', { territory:e.target.value }); }); $('review-send').addEventListener('change', e => dispatch('reviewer', { sendMode:e.target.checked })); $('review-scale').addEventListener('change', e => { document.documentElement.style.setProperty('--review-scale', e.target.value); }); $('review-inject').addEventListener('click', () => dispatch('fault', 'failed')); $('review-expire').addEventListener('click', () => dispatch('expire')); $('review-clock').addEventListener('click', () => dispatch('tick', 15000)); $('review-reset').addEventListener('click', () => hasWork() ? ask('Reset everything?', 'This clears the conversation, names, text size, and reviewer setup in this tab.', () => dispatch('reset'), $('review-reset')) : dispatch('reset'));
  }
  if (window.GrannyScheduler) scheduler = window.GrannyScheduler.create({ getState:() => state, dispatch:(event,value,guard) => P.dispatch(state,event,value,guard), onChange:() => { render(); }, setTimeout:(...args) => window.setTimeout(...args), clearTimeout:(...args) => window.clearTimeout(...args), now:() => performance.now() });
  render(); if (scheduler && scheduler.sync) scheduler.sync();
})();
