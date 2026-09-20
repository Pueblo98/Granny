// Browser regression contract for the seven shared conversation surfaces.
// It intentionally targets the accepted surface DOM, rather than the legacy
// dialog/card implementation. It is fixture evidence only: no microphone,
// Android, account or external action is exercised.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {browser} from './browser-driver.mjs';

const b = await browser();
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; };
const text = () => b.evaluate('document.body.innerText');
const state = () => b.evaluate('document.querySelector("#current-task")?.dataset.surface || "idle"');
const waitState = value => b.waitFor(
    'document.querySelector("#current-task")?.dataset.surface === ' +
    JSON.stringify(value));
const button = (label, within = 'body') => b.evaluate(`(() => {
  const target = [...document.querySelectorAll(${JSON.stringify(within)} + ' button')]
    .find(e => e.textContent.trim() === ${JSON.stringify(label)});
  if (!target || target.disabled) throw new Error('Missing enabled button: ' + ${JSON.stringify(label)});
  target.focus(); target.click();
})()`);
const key = async key => {
  const code = {Escape: 27, Enter: 13, Tab: 9}[key];
  const enter = key === 'Enter' ? {text: '\r', unmodifiedText: '\r'} : {};
  await b.cdp('Input.dispatchKeyEvent', {type: 'keyDown', key, code: key, windowsVirtualKeyCode: code, ...enter});
  await b.cdp('Input.dispatchKeyEvent', {type: 'keyUp', key, code: key, windowsVirtualKeyCode: code});
};
const select = (selector, value) => b.evaluate(`(() => {
  const e = document.querySelector(${JSON.stringify(selector)});
  if (!e) throw new Error('Missing select: ' + ${JSON.stringify(selector)});
  e.value = ${JSON.stringify(value)};
  e.dispatchEvent(new Event('change', {bubbles:true}));
})()`);
const fresh = async (review = true) => {
  await b.navigate(review ? '/?review=1' : '/');
  if (review) await select('#review-delay', '0');
};
const submit = async value => {
  await b.fill('#request', value);
  await b.click('#composer button[type=submit]');
};
const snapshot = () => b.evaluate(`(() => ({
  y: scrollY,
  active: document.activeElement?.id || '',
  room: document.querySelector('#room-content h1')?.textContent || '',
  roomHidden: document.querySelector('#room-content')?.hidden,
  welcomeHidden: document.querySelector('#welcome')?.hidden
}))()`);
const visible = selector => b.evaluate(`(() => {
  const e = document.querySelector(${JSON.stringify(selector)});
  if (!e || e.hidden || !e.getClientRects().length) return false;
  const r = e.getBoundingClientRect(), x = Math.max(0, Math.min(innerWidth - 1, (r.left + r.right) / 2));
  const y = Math.max(0, Math.min(innerHeight - 1, (r.top + r.bottom) / 2));
  return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight &&
    e.contains(document.elementFromPoint(x, y));
})()`);
const geometry = async label => {
  const result = await b.evaluate(`(() => ({
    width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    clipped: [...document.querySelectorAll('#speech-surface button, #current-task button, #composer button')]
      .filter(e => !e.hidden && e.getClientRects().length)
      .map(e => ({name:e.textContent.trim(), r:e.getBoundingClientRect()}))
      .filter(x => x.r.left < 0 || x.r.right > innerWidth)
  }))()`);
  check(result.scrollWidth <= result.width + 1, label + ' has no horizontal overflow');
  check(!result.clipped.length, label + ' has no horizontally clipped surface controls: ' + JSON.stringify(result.clipped));
};
const speechContract = expected => b.evaluate(`(() => {
  const surface = document.querySelector('#speech-surface'), composer = document.querySelector('#composer');
  const transcript = document.querySelector('#talk-text');
  return !!surface && composer.contains(surface) && surface.dataset.state === ${JSON.stringify(expected)} &&
    !!document.querySelector('#speech-heading') && !!transcript;
})()`);
const roomStillPresent = name => b.evaluate(`(() => {
  const room = document.querySelector('#room-content');
  return !!room && !room.hidden && room.querySelector('h1')?.textContent === ${JSON.stringify(name)} &&
    document.body.dataset.roomView === 'true';
})()`);
const reach = async (selector, label) => {
  // Task headings receive focus after render. Settle that deliberate two-frame
  // restoration before scrolling a later control into the small viewport.
  await b.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'})`);
  await b.waitFor(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })()`);
  check(await visible(selector), label + ' is reachable by scrolling');
};

try {
  await b.viewport(840, 600);
  await fresh();
  await select('#review-delay', '1500');
  await b.evaluate(`(() => {
    window.__sharedStateMicRequested = false;
    if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => {
      window.__sharedStateMicRequested = true;
      return Promise.reject(new Error('The simulated Talk path must not request a microphone'));
    };
  })()`);
  check(await b.evaluate('!document.querySelector("#welcome").hidden'), 'Home remains the initial place');
  check(await b.evaluate('document.querySelector("#speech-surface").hidden'), 'Home starts with compact composer, not a speech surface');

  // Explicit Talk has a two-part capture/review path, with no submission or
  // action authority during capture.
  await b.evaluate('document.querySelector("#talk").focus()');
  const homeOrigin = await snapshot();
  await b.click('#talk');
  await b.waitFor('!document.querySelector("#speech-surface").hidden');
  check(await speechContract('listening'), 'Talk expands the stable composer into Listening');
  await b.screenshot('shared-listening-home');
  check(await b.evaluate(`(() => {
    const s = document.querySelector('#speech-surface');
    return s.innerText.includes('Listening') && s.innerText.includes('Say what you would like to do.') &&
      s.innerText.includes('Heard so far') && document.querySelector('#talk-text').readOnly && document.querySelector('#talk-text').hidden &&
      !document.querySelector('#heard-copy').hidden && !!document.querySelector('#heard-words') && !!document.querySelector('.provisional-caret') &&
      !!document.querySelector('#speech-done') && !!document.querySelector('#speech-cancel') &&
      !!document.querySelector('#speech-type') && !document.querySelector('#composer button[type=submit]')?.getClientRects().length &&
      !document.querySelector('#stop-button')?.getClientRects().length;
  })()`), 'Listening has required provisional copy/actions and neither Send nor Stop');
  await b.waitFor('document.activeElement.id === "speech-heading" || document.activeElement.id === "talk-text"');
  check(await b.evaluate('document.activeElement.id === "speech-heading" || document.activeElement.id === "talk-text"'), 'Listening moves focus to the changed surface');
  check(await b.evaluate('!document.querySelector("#heard-copy").getAttribute("aria-live") && !document.querySelector("#heard-words").getAttribute("aria-live")'), 'provisional words are a static labelled status, not token-by-token live announcements');
  await key('Escape');
  await b.waitFor('document.querySelector("#speech-surface").hidden');
  await b.waitFor('document.activeElement.id === "talk"');
  check(await b.evaluate('document.activeElement.id === "talk"'), 'Listening Escape returns focus to Talk origin');
  check(Math.abs((await snapshot()).y - homeOrigin.y) < 3, 'Listening Escape restores Home scroll');

  await b.click('#talk'); await b.click('#speech-done');
  await b.waitFor('document.querySelector("#speech-surface")?.dataset.state === "transcript"');
  check(await speechContract('transcript'), 'Done listening changes the same composer surface to transcript review');
  await b.screenshot('shared-transcript-home');
  check(await b.evaluate(`(() => {
    const s = document.querySelector('#speech-surface'), t = document.querySelector('#talk-text');
    return s.innerText.includes('Check what I heard') && s.innerText.includes('Request') &&
      s.innerText.includes('This asks Granny to understand the request. It does not send anything.') &&
      !t.readOnly && !!document.querySelector('#speech-use') && !!document.querySelector('#speech-again') &&
      !!document.querySelector('#speech-cancel');
  })()`), 'Transcript is an editable, non-authorizing review with all exits');
  await b.fill('#talk-text', ''); await b.click('#speech-use');
  check(await speechContract('transcript') && await b.evaluate('document.activeElement.id === "talk-text"'), 'empty transcript cannot enter interpretation and remains editable');
  await b.fill('#talk-text', 'Tell David I’ll call after dinner.');
  await b.click('#speech-again');
  check(await speechContract('listening'), 'Listen again returns to explicit Listening');
  await b.click('#speech-type');
  await b.waitFor('document.querySelector("#speech-surface").hidden');
  await b.waitFor('document.activeElement.id === "request"');
  check(await b.evaluate('document.activeElement.id === "request"'), 'Type instead restores compact typing in place');
  check(await b.evaluate('!window.__sharedStateMicRequested'), 'simulated Talk did not request a microphone');

  await b.click('#talk'); await b.click('#speech-done');
  await b.fill('#talk-text', 'Changed words stay unused.');
  await b.click('#speech-cancel'); await b.waitFor('document.querySelector("#speech-surface").hidden');
  await b.waitFor('document.activeElement.id === "talk"');
  check(await b.evaluate('document.querySelector("#request").value === ""'), 'transcript cancellation discards edited words and restores its Talk origin');

  // The fixture choice is one semantic row: it resolves recipient and its
  // shown destination, while a typed disambiguator retains existing grammar.
  await b.click('#talk'); await b.click('#speech-done'); await b.click('#speech-use');
  await waitState('clarification');
  check(await b.evaluate(`(() => {
    const task = document.querySelector('#current-task'), row = document.querySelector('[data-choice="david-family"]');
    return task.dataset.stage === 'clarify-person' && task.innerText.includes('Which David?') &&
      task.innerText.includes('Choose the person you mean.') && task.innerText.includes('Tell David I’ll call after dinner.') &&
      row?.innerText.includes('David') && row.innerText.includes('Brother') && row.innerText.includes('Example Messages') &&
      !!document.querySelector('[data-choice="david-garden"]') && task.innerText.includes('None of these') &&
      task.innerText.includes('Edit request') && task.innerText.includes('Cancel') && !!document.querySelector('#request') && !!document.querySelector('#talk');
  })()`), 'Clarification keeps request, differentiators, exits, and compact answer composer');
  await b.screenshot('shared-clarification-home');
  await b.click('[data-choice="david-family"]');
  await waitState('preview');
  check((await text()).includes('Example Messages'), 'David Brother row resolves its displayed destination before preview');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.stage === "preview"'), 'surface state is separate from retained model stage');
  check(await b.evaluate(`(() => {
    const task = document.querySelector('#current-task');
    return task.innerText.includes('Check the draft') && task.innerText.includes('Nothing has been opened or sent yet.') &&
      !task.querySelector('[data-action=approve][aria-pressed="true"]');
  })()`), 'Exact preview is non-preselected and discloses no action yet');
  await b.screenshot('shared-preview-home');
  check(await b.evaluate('document.activeElement.id === "speech-heading" || document.activeElement.matches("#current-task h2")'), 'preview places focus at its heading');
  await key('Escape');
  await b.waitFor('document.querySelector("#current-task")?.dataset.surface !== "preview"');
  await b.waitFor('document.activeElement.id === "talk"');
  check(await b.evaluate('document.activeElement.id === "talk"'), 'speech-derived preview Escape returns to its Talk origin');

  await fresh();
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await button('None of these', '#current-task');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.surface === "clarification" && document.querySelector("#current-task").innerText.includes("No person selected")'), 'None of these keeps clarification and offers a typed recovery');
  await button('Edit request', '#current-task');
  await b.waitFor('!document.querySelector("#current-task")');
  check(await b.evaluate('document.querySelector("#request").value === "Tell David I’ll call after dinner." && document.activeElement.id === "request"'), 'Edit request restores the retained request to the compact composer');

  await fresh();
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.click('#talk'); await b.waitFor('!document.querySelector("#speech-surface").hidden');
  check(await b.evaluate('!document.querySelector("#current-task")'), 'speech surface is the only temporary surface while answering clarification');
  await b.click('#speech-done'); await b.click('#speech-use');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.stage === "clarify-channel"'), 'spoken Brother answer remains a clarification answer, not an approval');
  await button('Cancel', '#current-task');

  await fresh();
  await select('#review-delay', '1500');
  await submit('Tell David I’ll call after dinner.');
  await waitState('clarification');
  await submit('Brother');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.stage === "clarify-channel"'), 'typed Brother retains channel clarification grammar');
  await b.click('[data-choice="Example Messages"]'); await waitState('preview');
  check(await b.evaluate(`(() => {
    const t = document.querySelector('#current-task'), facts = [...t.querySelectorAll('dt')].map(e => e.textContent);
    return facts.includes('To') && facts.includes('Which person') && facts.includes('Channel') && facts.includes('What happens') &&
      t.querySelector('blockquote')?.textContent === 'I’ll call after dinner.' &&
      t.innerText.includes('David') && t.innerText.includes('Brother') && t.innerText.includes('Example Messages') &&
      t.innerText.includes('fictional unsent draft opens');
  })()`), 'exact preview shows target, differentiator, destination, verbatim body and unsent consequence');
  await submit('yes');
  await b.waitFor('!!document.querySelector("#confirm-dialog[open]")');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.surface === "preview"'), 'typed yes cannot approve a preview incidentally');
  await button('Keep working', '#confirm-dialog');

  await fresh();
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.click('#menu-button'); await b.click('[data-menu="help"]');
  await button('Return to conversation');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.stage === "clarify-person" && document.querySelector("#current-task").innerText.includes("Tell David I’ll call after dinner.")'), 'clarification can visit a secondary panel and return without gaining authority or changing request');
  await button('Cancel', '#current-task');

  await fresh();
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.click('[data-choice="david-family"]'); await waitState('preview');
  await button('Change it', '#current-task');
  await b.fill('[aria-label="Message"]', 'Editor survives the text settings visit.');
  await b.click('#menu-button'); await b.click('[data-menu="text"]'); await button('Return to conversation');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.stage === "expired" && document.querySelector("[aria-label=Message]").value === "Editor survives the text settings visit."'), 'leaving preview for settings expires approval while preserving the unsaved editor');
  await button('Cancel editing', '#current-task');

  await fresh(); await select('#review-delay', '1500');
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.click('[data-choice="david-family"]'); await waitState('preview');
  await b.evaluate('window.__oldSharedApproval = document.querySelector("[data-action=approve]")');
  await button('Change it', '#current-task');
  await b.fill('[aria-label="Message"]', 'Changed exact draft body.');
  await button('Save changes', '#current-task'); await waitState('preview');
  await b.evaluate('window.__oldSharedApproval.click()');
  check(await b.evaluate(`(() => {
    const t = document.querySelector('#current-task');
    return t?.dataset.surface !== 'active' && t?.innerText.includes('Changed exact draft body.');
  })()`), 'a saved change invalidates a retained prior approval control');
  await button('Cancel', '#current-task');

  await fresh(); await select('#review-delay', '1500');
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await submit('Brother'); await b.click('[data-choice="Example Messages"]'); await waitState('preview');
  await b.click('[data-action=approve]'); await waitState('active');
  check(await b.evaluate(`(() => {
    const task = document.querySelector('#current-task'), stop = document.querySelector('#composer #stop-button');
    return task.dataset.stage === 'planning' || task.dataset.stage === 'acting' || task.dataset.stage === 'waiting' || task.dataset.stage === 'verifying'
      ? task.innerText.includes('Goal') && task.innerText.includes('Latest verified step') && task.innerText.includes('Current step') && !!stop &&
        !document.querySelector('#composer button[type=submit]')?.getClientRects().length
      : false;
  })()`), 'active surface has task status and Stop at Send’s composer location');
  await b.screenshot('shared-active-home');
  await b.evaluate('window.dispatchEvent(new Event("scroll"))');
  check(await b.evaluate(`(() => {
    const main = document.querySelector('#composer #stop-button'), fallback = document.querySelector('#stop-fallback');
    const reachable = e => {
      if (!e || e.hidden || !e.getClientRects().length) return false;
      const r = e.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight && e.contains(document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2));
    };
    return reachable(main) || reachable(fallback);
  })()`), 'an active Stop is immediately reachable in its composer location or fallback dock');
  check(await b.evaluate(`(() => {
    const dock = document.querySelector('#stop-dock'), main = document.querySelector('#composer #stop-button');
    if (dock.hidden) return true;
    const r = main?.getBoundingClientRect();
    return !r || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth;
  })()`), 'stop dock is only a fallback when the main Stop is offscreen');
  await b.click('#rooms-button');
  await b.waitFor('!!document.querySelector("#confirm-dialog[open]")');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.surface === "active"'), 'destination change is guarded while a task is active');
  await b.evaluate(`(() => {
    const buttons = [...document.querySelectorAll('#confirm-dialog button:not([hidden])')];
    buttons.at(-1).focus();
  })()`);
  for (let i = 0; i < 5; i++) {
    await key('Tab');
    check(await b.evaluate('document.querySelector("#confirm-dialog[open]").contains(document.activeElement)'), 'native interruption dialog keeps Tab focus contained (' + (i + 1) + ')');
  }
  await button('Keep working', '#confirm-dialog');
  await b.waitFor('!document.querySelector("#confirm-dialog[open]")');
  const stopSelector = await b.evaluate(`(() => {
    const main = document.querySelector('#composer #stop-button'), r = main.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= innerHeight ? '#composer #stop-button' : '#stop-fallback';
  })()`);
  await b.click(stopSelector);

  // A Room remains the origin beneath all temporary surfaces and gets the
  // same cancellation/scroll restoration behavior as Home.
  await fresh();
  await b.click('#open-kitchen');
  await b.waitFor('!document.querySelector("#room-content").hidden');
  check(await roomStillPresent('Kitchen'), 'Kitchen is a real unchanged underlying place');
  await b.evaluate('window.scrollTo(0, 0); document.querySelector("#talk").focus()');
  const kitchenOrigin = await snapshot();
  await b.click('#talk'); await b.waitFor('!document.querySelector("#speech-surface").hidden');
  check(await roomStillPresent('Kitchen'), 'Listening does not replace Kitchen with a listening route');
  await b.click('#rooms-button');
  await b.waitFor('!!document.querySelector("#confirm-dialog[open]")');
  check(await roomStillPresent('Kitchen') && await b.evaluate('!document.querySelector("#speech-surface").hidden'), 'leaving a Room while listening is guarded before navigation');
  await button('Keep working', '#confirm-dialog');
  await b.waitFor('!document.querySelector("#confirm-dialog[open]")');
  await b.click('#speech-cancel'); await b.waitFor('document.querySelector("#speech-surface").hidden');
  await b.waitFor('document.activeElement.id === "talk"');
  check(await roomStillPresent('Kitchen'), 'Cancelling listening keeps Kitchen identity');
  check(await b.evaluate('document.activeElement.id === "talk"'), 'Kitchen listening cancellation restores Talk origin focus');
  check(Math.abs((await snapshot()).y - kitchenOrigin.y) < 3, 'Kitchen listening cancellation restores scroll');

  // Prepared is an outcome in the same reusable renderer, both globally and
  // in a Room; it must state the unsent boundary before Done dismisses it.
  await fresh();
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.click('[data-choice="david-family"]'); await waitState('preview');
  await b.click('[data-action=approve]'); await waitState('prepared');
  check(await b.evaluate(`(() => {
    const t = document.querySelector('#current-task');
    return t.innerText.includes('Draft opened') && t.innerText.includes('Prepared — not sent') &&
      t.innerText.includes('What Granny verified') && t.innerText.includes('What Granny did not do') &&
      t.innerText.includes('Next step') && !!document.querySelector('#surface-manual') && !!document.querySelector('#surface-done');
  })()`), 'Home prepared outcome distinguishes verified draft preparation from sending');
  await b.screenshot('shared-prepared-home');
  await b.click('#rooms-button'); await b.waitFor('!!document.querySelector("#confirm-dialog[open]")');
  check(await b.evaluate('document.querySelector("#confirm-title").textContent === "Finish reviewing this result?" && [...document.querySelectorAll("#confirm-dialog button")].some(b => b.textContent === "Done and leave")'), 'leaving a prepared result requires an explicit Done-and-leave decision');
  await button('Keep working', '#confirm-dialog'); await b.waitFor('!document.querySelector("#confirm-dialog[open]")');
  check(await state() === 'prepared', 'Keep working leaves prepared evidence in place');
  await b.click('#surface-done'); await b.waitFor('!document.querySelector("#current-task")');

  await fresh(); await b.click('#open-kitchen');
  await b.waitFor('!document.querySelector("#room-content").hidden');
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  check(await roomStillPresent('Kitchen'), 'Kitchen stays visible beneath clarification');
  await b.click('[data-choice="david-family"]'); await waitState('preview');
  check(await roomStillPresent('Kitchen'), 'Kitchen stays visible beneath exact preview');
  await b.click('[data-action=approve]'); await waitState('prepared');
  check(await roomStillPresent('Kitchen'), 'Kitchen stays visible beneath prepared result');
  await b.screenshot('shared-prepared-kitchen');
  await b.click('#surface-done'); await b.waitFor('!document.querySelector("#current-task")');

  await fresh(); await b.click('#open-kitchen');
  await b.waitFor('!document.querySelector("#room-content").hidden');
  await b.click('#room-continue');
  await b.waitFor('document.querySelector("#room-surface")?.dataset.roomState === "detail"');
  const kitchenDetail = await b.evaluate('document.querySelector("#room-item-detail h1").textContent');
  await b.evaluate('window.scrollTo(0, 120); document.querySelector("#request").focus({preventScroll:true})');
  const detailOrigin = await snapshot();
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.click('[data-choice="david-family"]'); await waitState('preview');
  await b.click('[data-action=approve]'); await waitState('prepared');
  await b.click('#surface-done'); await b.waitFor('!document.querySelector("#current-task")');
  await b.waitFor('document.querySelector("#room-surface")?.dataset.roomState === "detail" && document.activeElement.id === "request"');
  await b.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  check(await b.evaluate('document.querySelector("#room-item-detail h1").textContent === ' + JSON.stringify(kitchenDetail)), 'Done restores the original Kitchen item detail rather than replacing the Room subview');
  const restoredDetail = await snapshot();
  check(Math.abs(restoredDetail.y - detailOrigin.y) < 3 && restoredDetail.active === 'request', 'Done restores original Kitchen scroll and composer focus: ' + JSON.stringify({origin: detailOrigin, restored: restoredDetail}));

  // One surface renderer must preserve every available Room identity, rather
  // than only the Kitchen example used for the detailed outcome walkthrough.
  await fresh();
  const rooms = await b.evaluate('[...document.querySelectorAll("#room-list .room-entry")].map(e => e.dataset.roomId)');
  check(rooms.length === 6, 'the shared-state fixture exposes all six room identities');
  for (const room of rooms) {
    await b.click('#room-' + room);
    await b.waitFor('document.body.dataset.roomPriority === ' + JSON.stringify(room));
    const name = await b.evaluate('document.querySelector("#room-content h1").textContent');
    await b.click('#talk'); await b.waitFor('!document.querySelector("#speech-surface").hidden');
    check(await roomStillPresent(name), 'Listening preserves ' + name + ' identity');
    await b.click('#speech-cancel'); await b.waitFor('document.querySelector("#speech-surface").hidden');
    await b.click('#room-home');
    await b.waitFor('!document.querySelector("#room-home").getClientRects().length');
  }

  // Unknown is an alternative outcome: it is candid, has recovery actions,
  // and never exposes a retry/confirmation action.
  await fresh(); await select('#review-fault', 'unknown');
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.click('[data-choice="david-family"]'); await waitState('preview');
  await b.click('[data-action=approve]'); await waitState('unknown');
  check(await b.evaluate(`(() => {
    const t = document.querySelector('#current-task');
    return t.innerText.includes('Unknown outcome') && t.innerText.includes('Known') && t.innerText.includes('Unknown') &&
      t.innerText.includes('Next step') && t.innerText.includes('will not retry this message automatically') &&
      !!document.querySelector('#surface-review') && !!document.querySelector('#surface-manual') && !!document.querySelector('#surface-done') &&
      ![...t.querySelectorAll('button')].some(b => /retry|approve|open this draft/i.test(b.textContent));
  })()`), 'Unknown is persistent, candid and cannot retry automatically');
  await b.screenshot('shared-unknown-home');
  await b.click('#surface-review'); await waitState('unknown');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.stage === "unknown" && !document.querySelector("[data-action=approve]")'), 'Review status preserves Unknown without re-executing');
  await b.click('#surface-manual'); await waitState('unknown');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.stage === "unknown" && !document.querySelector("[data-action=approve]")'), 'Open app yourself preserves Unknown without re-executing');
  await b.click('#rooms-button'); await b.waitFor('!!document.querySelector("#confirm-dialog[open]")');
  check(await b.evaluate('[...document.querySelectorAll("#confirm-dialog button")].some(b => b.textContent === "Done and leave")'), 'leaving Unknown also requires an explicit Done-and-leave decision');
  await button('Keep working', '#confirm-dialog');
  await b.click('#surface-done');
  await b.waitFor('document.querySelector("#current-task")?.dataset.surface !== "unknown"');

  await fresh(); await select('#review-scale', '2');
  for (const [width, height] of [[360, 480], [840, 600], [1440, 900]]) {
    await b.viewport(width, height);
    await b.click('#talk'); await b.waitFor('!document.querySelector("#speech-surface").hidden');
    await geometry('200% listening ' + width + 'x' + height);
    await b.evaluate('document.querySelector("#speech-cancel").scrollIntoView({block:"center"})');
    await b.waitFor(`(() => { const r = document.querySelector('#speech-cancel').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })()`);
    check(await visible('#speech-cancel'), '200% listening cancel reachable ' + width + 'x' + height);
    await b.click('#speech-cancel'); await b.waitFor('document.querySelector("#speech-surface").hidden');
  }
  // Every named surface reflows at the two constrained reference viewports.
  // The action is scrolled into view before hit-testing: a tall surface may
  // scroll, but it may not clip or make its escape inaccessible.
  for (const [width, height] of [[360, 480], [840, 600]]) {
    const size = width + 'x' + height;
    await b.viewport(width, height);
    await fresh(); await select('#review-scale', '2');
    await b.click('#talk'); await b.waitFor('!document.querySelector("#speech-surface").hidden');
    await geometry('200% Listening ' + size); await reach('#speech-cancel', '200% Listening ' + size);
    await b.click('#speech-done'); await b.waitFor('document.querySelector("#speech-surface").dataset.state === "transcript"');
    await geometry('200% Transcript ' + size); await reach('#speech-use', '200% Transcript ' + size);
    await b.click('#speech-cancel');

    await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
    await geometry('200% Clarification ' + size); await reach('[data-choice="david-family"]', '200% Clarification ' + size);
    await button('Cancel', '#current-task'); await b.waitFor('!document.querySelector("#current-task")');

    await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
    await b.click('[data-choice="david-family"]'); await waitState('preview');
    await geometry('200% Preview ' + size); await reach('[data-action="approve"]', '200% Preview ' + size);
    await button('Cancel', '#current-task'); await b.waitFor('!document.querySelector("#current-task")');

    await select('#review-delay', '1500');
    await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
    await b.click('[data-choice="david-family"]'); await waitState('preview');
    await b.click('[data-action=approve]'); await waitState('active');
    await geometry('200% Active ' + size); await reach('#composer #stop-button', '200% Active ' + size);
    await b.click('#composer #stop-button');

    await fresh(); await select('#review-scale', '2');
    await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
    await b.click('[data-choice="david-family"]'); await waitState('preview');
    await b.click('[data-action=approve]'); await waitState('prepared');
    await geometry('200% Prepared ' + size); await reach('#surface-done', '200% Prepared ' + size);
    await b.click('#surface-done'); await b.waitFor('!document.querySelector("#current-task")');

    await fresh(); await select('#review-scale', '2'); await select('#review-fault', 'unknown');
    await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
    await b.click('[data-choice="david-family"]'); await waitState('preview');
    await b.click('[data-action=approve]'); await waitState('unknown');
    await geometry('200% Unknown ' + size); await reach('#surface-done', '200% Unknown ' + size);
    await b.click('#surface-done'); await b.waitFor('document.querySelector("#current-task")?.dataset.surface !== "unknown"');
  }
  await b.viewport(840, 600); await fresh();
  await b.click('#talk'); await b.waitFor('!document.querySelector("#speech-surface").hidden');
  await b.evaluate('document.querySelector("#speech-heading").focus()'); await key('Tab');
  check(await b.evaluate('document.activeElement.id === "speech-done"'), 'keyboard skips the readonly listening transcript to the first listening action');
  await b.evaluate('document.querySelector("#speech-done").focus()'); await key('Tab');
  check(await b.evaluate('document.activeElement.id === "speech-cancel"'), 'keyboard skips hidden speech actions to the listening escape');
  await b.click('#speech-cancel');
  await submit('Tell David I’ll call after dinner.'); await waitState('clarification');
  await b.evaluate('document.querySelector("[data-choice=david-family]").focus()'); await key('Enter'); await waitState('preview');
  await reach('[data-action=approve]', 'keyboard-activated preview approval');
  await button('Cancel', '#current-task');
  await b.cdp('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'reduce'}]});
  check(await b.evaluate(`(() => getComputedStyle(document.documentElement).scrollBehavior === 'auto' &&
    getComputedStyle(document.querySelector('#speech-surface')).animationDuration === '0s')()`), 'reduced-motion preference removes essential scrolling and surface animation');
  await b.viewport(840, 320); await fresh(); await select('#review-scale', '2');
  await b.click('#talk'); await b.waitFor('!document.querySelector("#speech-surface").hidden');
  await geometry('200% keyboard-like 840x320 Listening'); await reach('#speech-cancel', '200% keyboard-like Listening');
  await b.click('#speech-cancel');
  await b.cdp('Emulation.setEmulatedMedia', {features: []});
  await b.navigate('/');
  check(await b.evaluate('!document.querySelector("#review-panel")'), 'participant mode keeps reviewer controls out of the DOM');
  check(await b.evaluate('localStorage.length === 0 && sessionStorage.length === 0'), 'shared states add no web storage');
  check(await b.evaluate('(async () => !(await indexedDB.databases()).length)()'), 'shared states add no IndexedDB');
  check(await b.evaluate('(async () => !(await navigator.serviceWorker.getRegistrations()).length)()'), 'shared states add no service worker');
  check(!b.errors.length, 'no browser exceptions: ' + JSON.stringify(b.errors));
  check(b.network.every(url => url.startsWith(b.base + '/') || url === 'about:blank'), 'no external requests');
  const result = {checks, screenshots: b.output, errors: b.errors, network: [...new Set(b.network)]};
  await writeFile(join(b.output, 'shared-state-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  await b.screenshot('shared-state-failure');
  console.error('Browser artifacts: ' + b.output);
  throw error;
} finally {
  await b.close();
}
