/* Conversation UI only. Model and scheduler remain the authority for task state. */
(() => {
  'use strict';
  const P = window.GrannyPrototype;
  if (!P) return;
  const state = P.create();
  const $ = id => document.getElementById(id);
  const thread = $('thread'), composerText = $('request');
  let scheduler, pending = null, dialogReturn = null;

  function atBottom() { return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100; }
  function scrollIfReadingEnd(wasAtBottom) { if (wasAtBottom) requestAnimationFrame(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' })); }
  function active() { return !!(state.task && (P.ACTIVE || ['planning','acting','waiting','verifying']).includes(state.task.stage)); }
  function announce(text) { $('announcement').textContent = ''; requestAnimationFrame(() => { $('announcement').textContent = text; }); }
  function dispatch(event, value, guard) {
    const wasAtBottom = atBottom();
    if (scheduler && scheduler.elapse) scheduler.elapse();
    const changed = P.dispatch(state, event, value, guard);
    if (changed) { render(); if (scheduler && scheduler.sync) scheduler.sync(); scrollIfReadingEnd(wasAtBottom); }
    return changed;
  }
  function node(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function button(label, fn, cls) { const b = node('button', cls || '', label); b.type = 'button'; b.addEventListener('click', fn); return b; }
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
    const c = preview(task), slots = task.slots || {}, recipient = slots.recipient || {};
    const fields = node('div', 'editable-fields');
    const recipientField = node('label','', 'Recipient'); const r = document.createElement('input'); r.value = recipient.name || ''; r.setAttribute('aria-label', 'Recipient'); recipientField.append(r);
    const channelField = node('label','', 'Channel'); const ch = document.createElement('input'); ch.value = slots.channel || ''; ch.setAttribute('aria-label', 'Channel'); channelField.append(ch);
    const bodyField = node('label','', 'Message'); const body = document.createElement('textarea'); body.rows = 3; body.value = slots.body || ''; body.setAttribute('aria-label', 'Message'); bodyField.append(body);
    fields.append(recipientField, channelField, bodyField, button('Save changes', () => {
      const nextRecipient = r.value.trim() === (recipient.name || '') ? recipient : { ...recipient, name:r.value.trim() };
      dispatch('edit', { recipient:nextRecipient, channel:ch.value, body:body.value });
    }, 'primary'));
    c.append(fields); return c;
  }
  function controls(task, c) {
    const row = node('div', 'inline-actions'), stage = task.stage;
    if (stage === 'clarify-person' || stage === 'clarify-channel') {
      (task.choices || []).forEach(choice => row.append(button(choice.label, () => dispatch('choose', choice.value), 'choice')));
    } else if (stage === 'clarify-body') {
      const edit = document.createElement('textarea'); edit.rows = 3; edit.value = task.slots && task.slots.body || ''; edit.setAttribute('aria-label','Message words');
      row.append(edit, button('Use these words', () => dispatch('edit', { body:edit.value }), 'primary'));
    } else if (stage === 'preview') {
      row.append(button('Open this draft', () => dispatch('approve', { taskId:task.id, version:task.version, signature:task.permit && task.permit.signature }), 'primary'), button('Change', () => render(true)), button('Cancel', () => dispatch('stop')));
    } else if (stage === 'expired') row.append(button('Review again', () => dispatch('renew'), 'primary'), button('Cancel', () => dispatch('stop')));
    else if (stage === 'unknown') row.append(button('Check it yourself', () => dispatch('stop'), 'primary'));
    c.append(row);
  }
  function render(editing) {
    const previous = thread.replaceChildren();
    $('welcome').hidden = !!(state.turns && state.turns.length);
    (state.turns || []).forEach(t => thread.append(turn(t.role, t.text)));
    if (state.task) {
      const task = state.task, c = card('Granny', taskText(task));
      if (task.kind === 'message' && ['preview','expired','acting','waiting','verifying','completed','unknown','stopped','failed'].includes(task.stage)) c.append(editing && task.stage === 'preview' ? editablePreview(task) : preview(task));
      controls(task, c); thread.append(c);
      if (editing) c.querySelector('input, textarea')?.focus();
    }
    $('stop-button').hidden = !active();
    $('menu-button').setAttribute('aria-expanded', String(!$('menu').hidden));
    document.documentElement.style.fontSize = (state.scale || 1) * 100 + '%';
  }
  function hasWork() { return !!(state.task && state.task.kind === 'message' && !['completed','unknown','stopped','failed'].includes(state.task.stage)); }
  function ask(title, text, fn, source) { pending = fn; dialogReturn = source || document.activeElement; $('confirm-title').textContent = title; $('confirm-text').textContent = text; $('confirm-dialog').showModal(); }
  function newRequest(text) {
    if (!text.trim()) return;
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
    if (what === 'new') { const fn = () => dispatch('reset'); hasWork() ? ask('Start a new conversation?', 'Your unfinished message details will be replaced. The words are not saved anywhere.', fn, b) : fn(); }
    if (what === 'text') { const scale = state.scale === 1 ? 1.3 : 1; dispatch('setScale', scale); dispatch('applyScale'); announce(scale === 1 ? 'Standard text size.' : 'Larger text size.'); }
    if (what === 'history') announce((state.history || []).length ? 'Recent activity is shown in this conversation.' : 'There is no recent activity in this tab.');
  }));
  const review = new URLSearchParams(location.search).get('review') === '1'; $('review-panel').hidden = !review;
  if (review) {
    $('review-delay').addEventListener('change', e => dispatch('reviewer', { delay:Number(e.target.value) }));
    $('review-fault').addEventListener('change', e => dispatch('fault', e.target.value));
    $('review-expire').addEventListener('click', () => dispatch('expire'));
    $('review-reset').addEventListener('click', () => hasWork() ? ask('Reset this review?', 'Your unfinished message details will be replaced.', () => dispatch('reset'), $('review-reset')) : dispatch('reset'));
  }
  if (window.GrannyScheduler) scheduler = window.GrannyScheduler.create({ getState:() => state, dispatch:(event,value,guard) => P.dispatch(state,event,value,guard), onChange:() => { render(); }, setTimeout:window.setTimeout, clearTimeout:window.clearTimeout, now:Date.now });
  render(); if (scheduler && scheduler.sync) scheduler.sync();
})();
