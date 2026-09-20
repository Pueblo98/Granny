// Browser checks for the ten registered inline fictional outcome states.
// This is browser evidence only: no Android, provider, or device claim.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {browser} from './browser-driver.mjs';

const b = await browser();
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; };
const select = (selector, value) => b.evaluate(`(() => {
  const e = document.querySelector(${JSON.stringify(selector)});
  if (!e) throw Error('Missing select: ' + ${JSON.stringify(selector)});
  e.value = ${JSON.stringify(value)};
  e.dispatchEvent(new Event('change', {bubbles:true}));
})()`);
// The CDP driver's click deliberately does not focus first. A person using a
// mouse or keyboard does, and rerender focus restoration must be tested from
// that actual invoker rather than an arbitrary prior element.
const press = async selector => {
  await b.evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}); if (!e || e.disabled) throw Error('Missing or disabled: ' + ${JSON.stringify(selector)}); e.focus(); })()`);
  await b.click(selector);
};
const request = async value => {
  await b.fill('#request', value);
  await press('#composer button[type=submit]');
};
const stage = () => b.evaluate("document.querySelector('#current-task')?.dataset.stage || ''");
const waitStage = value => b.waitFor("document.querySelector('#current-task')?.dataset.stage === " + JSON.stringify(value));
const module = () => b.evaluate(`(() => {
  const all = [...document.querySelectorAll('[data-outcome-module]')];
  return {count:all.length, kind:all[0]?.dataset.outcomeModule || '', state:all[0]?.dataset.outcomeState || ''};
})()`);
const waitModule = async (kind, state) => b.waitFor(`(() => {
  const all = [...document.querySelectorAll('[data-outcome-module]')];
  return all.length === 1 && all[0].dataset.outcomeModule === ${JSON.stringify(kind)} &&
    all[0].dataset.outcomeState === ${JSON.stringify(state)};
})()`);
const oneModule = async (kind, state, label) => {
  await waitModule(kind, state);
  check(JSON.stringify(await module()) === JSON.stringify({count:1, kind, state}), label + ' is exactly one inline outcome module');
  check(await b.evaluate(`!!document.querySelector('#conversation') && !document.querySelector('#welcome').hidden ||
    !!document.querySelector('#room-content:not([hidden])')`), label + ' remains in the existing conversation/place shell');
};
const done = async () => {
  await press('#surface-done');
  await b.waitFor("!document.querySelector('[data-outcome-module]')");
  await b.waitFor("document.activeElement.id === 'request'");
};
const reach = async (selector, label) => {
  await b.evaluate(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'center'})`);
  await b.waitFor(`(() => { const e=document.querySelector(${JSON.stringify(selector)}),r=e?.getBoundingClientRect(); return !!r && r.top>=0 && r.bottom<=innerHeight && r.left>=0 && r.right<=innerWidth; })()`);
  check(await b.evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect(); return e.contains(document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2)); })()`), label + ' is reachable');
};
const geometry = async label => {
  const result = await b.evaluate(`(() => ({
    innerWidth, scrollWidth:document.documentElement.scrollWidth,
    controls:[...document.querySelectorAll('[data-outcome-module] button')].filter(e => e.getClientRects().length).map(e => ({text:e.textContent.trim(),height:e.getBoundingClientRect().height}))
  }))()`);
  check(result.scrollWidth <= result.innerWidth + 1, label + ' has no horizontal page overflow: ' + JSON.stringify(result));
  check(result.controls.every(x => x.text), label + ' gives every outcome control a written name');
};
const fresh = async review => {
  await b.navigate(review ? '/?review=1' : '/');
  if (review) await select('#review-delay', '0');
};
const approve = async () => {
  await press('[data-action=approve]');
};
const key = async key => {
  const code = {Tab:9, Enter:13, Escape:27}[key];
  await b.cdp('Input.dispatchKeyEvent', {type:'keyDown', key, code:key,
    windowsVirtualKeyCode:code, ...(key === 'Enter' ? {text:'\r', unmodifiedText:'\r'} : {})});
  await b.cdp('Input.dispatchKeyEvent', {type:'keyUp', key, code:key, windowsVirtualKeyCode:code});
};
const roomCollection = () => b.evaluate(`(() => {
  const room=document.querySelector('#room-surface[data-room-id=kitchen]'), title=document.querySelector('#collection-content h1');
  return room?.dataset.roomState === 'collection' && title?.textContent === 'Recipes';
})()`);
const noComposerOverlap = () => b.evaluate(`(() => {
  const m=document.querySelector('[data-outcome-module], #current-task'), c=document.querySelector('#composer');
  if (!m || !c || !m.getClientRects().length || !c.getClientRects().length) return true;
  const a=m.getBoundingClientRect(), b=c.getBoundingClientRect();
  return a.bottom <= b.top || b.bottom <= a.top || a.right <= b.left || b.right <= a.left;
})()`);

try {
  await b.viewport(840, 900);

  // 01 Photos found: the explicitly named Book club fixture remains a
  // consequence preview before its fictional mark-read route is approved.
  await fresh(false);
  await request('Show photos of Sophie Book club from yesterday');
  await waitStage('preview');
  check(await b.evaluate(`(() => { const t=document.querySelector('#current-task'); return t.innerText.includes('Book club') && t.innerText.includes('Example Messages') && /mark.*read/i.test(t.innerText) && !!t.querySelector('[data-action=approve]'); })()`), 'Book club photo route retains exact person, source, effect, and approval');
  await approve(); await waitStage('completed');
  await oneModule('photos', 'found', 'photos found');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=photos]'); return m.innerText.includes('Photos from Sophie') && m.innerText.includes('Sophie · Book club') && m.innerText.includes('Yesterday · 13 September 2026') && m.innerText.includes('Example Messages') && m.innerText.includes('Photo 1 of 3') && m.querySelector('#photo-previous')?.getAttribute('aria-disabled') === 'true' && m.querySelector('#photo-next')?.getAttribute('aria-disabled') === 'false'; })()`), 'found module exposes provenance, position, and truthful first bounds');
  await b.evaluate(`(() => {
    window.__photoOutcomeAnnouncements=[];
    new MutationObserver(() => { const text=document.querySelector('#announcement')?.textContent.trim(); if (text) window.__photoOutcomeAnnouncements.push(text); })
      .observe(document.querySelector('#announcement'), {childList:true, characterData:true, subtree:true});
  })()`);
  await press('#photo-next'); await waitModule('photos', 'found');
  await b.waitFor("window.__photoOutcomeAnnouncements?.length === 1");
  check(await b.evaluate("document.querySelector('#photo-position').textContent === 'Photo 2 of 3' && document.activeElement.id === 'photo-next'"), 'Next moves deterministically and retains real invoker focus');
  check(await b.evaluate("window.__photoOutcomeAnnouncements.length === 1 && /^Photo 2 of 3\\./.test(window.__photoOutcomeAnnouncements[0])"), 'one meaningful live announcement follows one photo browse action');
  await key('Tab');
  check(await b.evaluate("document.activeElement.id === 'outcome-full-size'"), 'keyboard Tab reaches the focused photo viewer control');
  check(await b.evaluate(`(() => { const e=document.activeElement, s=getComputedStyle(e); return s.outlineStyle !== 'none' || s.boxShadow !== 'none'; })()`), 'focused outcome control has a visible focus treatment');
  await key('Enter');
  await b.waitFor("document.querySelector('dialog[open]')");
  await key('Escape');
  await b.waitFor("!document.querySelector('dialog[open]') && document.activeElement.id === 'outcome-full-size'");
  check(await b.evaluate("document.querySelector('#photo-position').textContent === 'Photo 2 of 3'"), 'keyboard Escape closes the focused viewer and restores its invoker');
  await press('#outcome-full-size');
  await b.waitFor("document.querySelector('dialog[open]')?.querySelector('button')?.textContent === 'Back'");
  check(await b.evaluate("document.querySelectorAll('dialog[open] button').length===1 && document.querySelector('dialog[open]').innerText.includes('Full-size fictional photo')"), 'full-size viewer offers only the written Back route');
  await press('dialog[open] button');
  await b.waitFor("!document.querySelector('dialog[open]') && document.activeElement.id === 'outcome-full-size'");
  check(await b.evaluate("document.querySelector('#photo-position').textContent === 'Photo 2 of 3'"), 'viewer Back returns to the same photo position');
  await b.evaluate(`(() => {
    const img=document.querySelector('[data-outcome-module=photos] .outcome-image img');
    img.dispatchEvent(new Event('error'));
  })()`);
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=photos]'); return m.querySelector('.art-fallback:not([hidden])')?.textContent.includes('Illustration unavailable') && m.querySelector('img[hidden]') && !!m.querySelector('#photo-next') && !!m.querySelector('#outcome-full-size'); })()`), 'actual image error preserves descriptive fallback and outcome controls');
  await press('#photo-next');
  check(await b.evaluate("document.querySelector('#photo-position').textContent === 'Photo 3 of 3' && document.querySelector('#photo-next').getAttribute('aria-disabled') === 'true'"), 'last photo disables Next without wrapping');
  await done();

  // The explicit Book club request must not rewrite the ordinary Sophie alias
  // fixture: it remains the two-photo Daughter result.
  await request('Show me the photos Sophie sent yesterday'); await waitStage('completed');
  await oneModule('photos', 'found', 'default Sophie photos');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=photos]'); return m.innerText.includes('Sophie · Daughter') && m.innerText.includes('Example Photos') && m.querySelector('#photo-position')?.textContent === 'Photo 1 of 2'; })()`), 'default Sophie alias preserves its separate two-photo Daughter fixture');
  await done();

  // 02 Photos no result: a reviewer fixture is explicit, and recovery never
  // silently repeats the search.
  await fresh(true); await select('#review-fault', 'noPhotos');
  await request('Show me the photos Sophie sent yesterday'); await waitStage('no-matches');
  await oneModule('photos', 'no-result', 'photos no-result');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=photos]'); return m.innerText.includes('No photos found') && m.innerText.includes('conversation was available') && !!m.querySelector('#photo-change-date') && !!m.querySelector('#photo-change-person') && ![...m.querySelectorAll('button')].some(x => /retry/i.test(x.textContent)); })()`), 'no-result names the searched conversation and bounded recovery without retry');
  await press('#photo-change-date'); await waitStage('clarify-date');
  check(await b.evaluate("document.querySelector('#current-task').dataset.stage === 'clarify-date' && !document.querySelector('[data-outcome-module]')"), 'Change date returns to a bounded date clarification rather than silently searching');
  // New deterministic no-result instance checks the other recovery direction.
  await fresh(true); await select('#review-fault', 'noPhotos');
  await request('Show me the photos Sophie sent yesterday'); await waitStage('no-matches');
  await press('#photo-change-person'); await waitStage('clarify-person');
  check(await b.evaluate("document.querySelector('#current-task').innerText.includes('Which Sophie')"), 'Choose another Sophie retains a bounded person clarification');

  // 03/04 Screen explanation and read-only guidance remain one supplied-screen
  // module, with explicit back paths rather than a settings destination.
  await fresh(false); await request('What am I looking at?'); await waitStage('clarify-screen');
  await press('[data-choice=display-settings]'); await waitStage('completed');
  await oneModule('explain', 'explanation', 'screen explanation');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=explain]'); return m.innerText.includes('Supplied fictional screen · captured for this request') && m.innerText.includes('Read only') && ['Screen zoom','Text size','Dark theme'].every(x=>m.innerText.includes(x)) && !!m.querySelector('#screen-guidance') && !!m.querySelector('#screen-option') && !!m.querySelector('#screen-reading') && !!m.querySelector('#screen-takeover'); })()`), 'screen explanation gives real-text source, read-only state, fields, and exits');
  await press('#screen-guidance'); await oneModule('explain', 'guidance', 'screen guidance');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=explain]'); return m.querySelector('.guidance-target .guidance-number')?.textContent === '1' && m.innerText.includes('Granny is only showing where it is. Nothing has changed.') && !!m.querySelector('#screen-explanation'); })()`), 'guidance identifies the target in text and says that nothing changed');
  await press('#screen-explanation'); await oneModule('explain', 'explanation', 'return from guidance');
  await press('#screen-option');
  check(await b.evaluate("document.querySelector('[data-outcome-module=explain]').innerText.includes('Dark theme')"), 'another-option uses a deterministic supplied row');
  await press('#screen-reading'); await oneModule('explain', 'reading', 'back to reading');
  check(await b.evaluate("document.querySelector('[data-outcome-module=explain]').innerText.includes('No other app was opened')"), 'Back to reading remains a fictional local return');
  await done();
  await request('Explain screen display-settings'); await waitStage('completed'); await oneModule('explain', 'explanation', 'fresh screen explanation');
  await press('#screen-takeover');
  await b.waitFor("!document.querySelector('[data-outcome-module]') && document.activeElement.id === 'request'");
  check(await b.evaluate("!document.querySelector('#current-task')"), 'Take over ends read-only guidance without changing a setting');

  // 05/06 Exact message preview and prepared result use the shared preview
  // contract, not an outcome module with a second approval mechanism.
  await fresh(false); await request('Tell David I’ll call after dinner.'); await waitStage('clarify-person'); await press('[data-choice=david-family]'); await waitStage('preview');
  await oneModule('message', 'preview', 'exact message preview');
  check(await b.evaluate(`(() => { const t=document.querySelector('#current-task'); return t.innerText.includes('Check the draft') && t.innerText.includes('Nothing has been opened or sent yet.') && t.innerText.includes('David') && t.innerText.includes('Brother') && t.innerText.includes('Example Messages') && t.innerText.includes('I’ll call after dinner.') && !!t.querySelector('[data-action=approve]'); })()`), 'exact draft preview remains the single specific approval surface');
  await approve(); await waitStage('completed');
  await oneModule('message', 'prepared', 'prepared message result');
  check(await b.evaluate(`(() => { const t=document.querySelector('#current-task'); return t.dataset.surface === 'prepared' && t.innerText.includes('Prepared — not sent') && t.innerText.includes('What Granny verified') && t.innerText.includes('What Granny did not do') && t.innerText.includes('Next step') && !!t.querySelector('#surface-done'); })()`), 'prepared result is explicit and distinct from sent');
  await press('#surface-done'); await b.waitFor("!document.querySelector('#current-task') && document.activeElement.id === 'request'");

  // 07 Media playing/paused. Rendering never starts a new playback event.
  await fresh(false); await request('Play Sinnerman'); await waitStage('completed');
  await oneModule('media', 'playing', 'media playing');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=media]'); return m.innerText.includes('Sinnerman') && m.innerText.includes('Nina Simone') && m.innerText.includes('Example Music') && m.innerText.includes('Playing') && m.innerText.includes('0:42 / 10:22') && !!m.querySelector('#media-playback'); })()`), 'playing module discloses exact track, source, state and deterministic time');
  await press('#media-playback'); await oneModule('media', 'paused', 'media paused');
  check(await b.evaluate("document.querySelector('#media-playback').textContent === 'Resume' && document.querySelector('[data-outcome-module=media]').innerText.includes('Paused')"), 'Pause changes the written state and fixed control position');
  await press('#media-playback'); await oneModule('media', 'playing', 'media resumed'); await done();

  // 08 Service unavailable has recovery choices only; none retries/selects a
  // provider or converts the old failure into playing.
  await fresh(true); await select('#review-fault', 'unavailable');
  await request('Play Sinnerman'); await waitStage('failed');
  await oneModule('media', 'unavailable', 'media unavailable');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=media]'); return m.innerText.includes('Music not started') && m.innerText.includes('Requested source') && m.innerText.includes('Example Music') && m.innerText.includes('Service unavailable') && !!m.querySelector('#media-sources') && !!m.querySelector('#media-manual') && ![...m.querySelectorAll('button')].some(x=>/pause|resume|retry/i.test(x.textContent)); })()`), 'unavailable preserves request/source and omits playback or retry');
  await press('#media-sources'); await oneModule('media', 'source-choice', 'media source choice');
  check(await b.evaluate("document.querySelector('[data-outcome-module=media]').innerText.includes('No other source is available in this local fixture. Nothing was selected or retried.') && !document.querySelector('#media-playback')"), 'source choice does not silently select a provider or retry');
  await press('#media-source-back'); await waitModule('media', 'unavailable');
  await press('#media-manual'); await oneModule('media', 'manual', 'media manual route');
  check(await b.evaluate("document.querySelector('[data-outcome-module=media]').innerText.includes('No app was opened')"), 'Open apps is candid fictional manual handoff');
  await done();

  // 09/10 Reading preview is isolated until Apply, then restores the exact
  // prior value.  The direct request targets Granny's local text only.
  await fresh(false); await request('Make Granny text larger'); await waitStage('size-preview');
  await oneModule('readability', 'preview', 'reading preview');
  const beforeScale = await b.evaluate('parseFloat(getComputedStyle(document.body).fontSize)');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=readability]'); return m.querySelector('h3')?.textContent === 'Current — Standard' && [...m.querySelectorAll('h3')].some(x => x.textContent === 'Preview — Larger still') && m.innerText.includes('Your next appointment is on Tuesday at 10:30.') && !!m.querySelector('#reading-apply') && !!m.querySelector('#reading-cancel') && !!m.querySelector('#reading-default') && !m.querySelector('input[type=range]'); })()`), 'reading preview uses canonical current/proposed labels and explicit controls, not a slider');
  await press('[data-outcome-module=readability] .size-chooser button:first-child');
  check(await b.evaluate("document.querySelector('[data-outcome-module=readability] output').textContent === 'Larger · 115%' && parseFloat(getComputedStyle(document.body).fontSize) === " + beforeScale), 'Smaller moves within the closed proposal set without applying');
  await press('[data-outcome-module=readability] .size-chooser button:last-child');
  check(await b.evaluate("document.querySelector('[data-outcome-module=readability] output').textContent === 'Larger still · 130%'"), 'Larger restores the next canonical proposal value');
  await press('#reading-default');
  check(await b.evaluate('parseFloat(getComputedStyle(document.body).fontSize) === ' + beforeScale), 'Restore default changes preview only before Apply');
  await press('#reading-cancel'); await b.waitFor("!document.querySelector('[data-outcome-module]') && document.activeElement.id === 'request'");
  check(await b.evaluate('parseFloat(getComputedStyle(document.body).fontSize) === ' + beforeScale), 'Cancel leaves the committed Granny scale unchanged');
  await request('Make Granny text larger'); await waitStage('size-preview');
  await press('#reading-apply'); await waitStage('completed'); await oneModule('readability', 'applied', 'reading applied');
  check(await b.evaluate(`(() => { const m=document.querySelector('[data-outcome-module=readability]'); return m.innerText.includes('Larger text applied') && m.innerText.includes('Previous size') && m.innerText.includes('Current size') && m.innerText.includes('Other apps and tablet settings were not changed.') && !!m.querySelector('#reading-restore'); })()`), 'applied result names local scope, old/current values, and restore');
  await press('#reading-restore');
  check(await b.evaluate(`(() => document.querySelector('[data-outcome-module=readability]').innerText.includes('Previous text size restored') && parseFloat(getComputedStyle(document.body).fontSize) === ${beforeScale})()`), 'Restore previous size returns the exact original value');
  await done();

  // A selected Kitchen collection is the underlying place throughout all four
  // outcome families. Done must restore that exact room state, composer focus,
  // and reading position rather than route to Home or a generic result page.
  await fresh(false); await press('#open-kitchen');
  await b.waitFor("document.querySelector('#room-surface[data-room-id=kitchen]')");
  await press('#collection-recipes'); await b.waitFor("document.querySelector('#room-surface')?.dataset.roomState === 'collection'");
  await b.evaluate("window.scrollTo(0,120); document.querySelector('#request').focus({preventScroll:true})");
  let kitchenOrigin = 0;
  // The normal `press()` helper focuses Send, which legitimately scrolls it
  // into view before `rememberSurface` records the origin.  For this bounded
  // restoration oracle, keep the composer focused without scrolling and record
  // that exact state immediately before the form's native click handler.
  const requestFromKitchen = async value => {
    await b.fill('#request', value);
    await b.evaluate("document.querySelector('#request').focus({preventScroll:true})");
    kitchenOrigin = await b.evaluate('scrollY');
    await b.click('#composer button[type=submit]');
  };
  const assertKitchenReturn = async family => {
    await b.waitFor("document.activeElement.id === 'request'");
    // `restoreOrigin` restores focus and scroll in one animation frame; wait
    // through the browser paint boundary before observing the final position.
    await b.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    check(await roomCollection(), family + ' Done preserves Kitchen Recipes as the underlying selected collection');
    const restoredScroll = await b.evaluate('scrollY');
    check(Math.abs(restoredScroll - kitchenOrigin) < 3, family + ' Done restores Kitchen scroll position: origin=' + kitchenOrigin + ', restored=' + restoredScroll);
  };
  await requestFromKitchen('Show photos of Sophie Book club from yesterday'); await waitStage('preview'); await approve(); await waitStage('completed'); await oneModule('photos', 'found', 'Kitchen photos'); await done(); await assertKitchenReturn('photos');
  await requestFromKitchen('Explain screen display-settings'); await waitStage('completed'); await oneModule('explain', 'explanation', 'Kitchen screen explanation'); await press('#screen-reading'); await oneModule('explain', 'reading', 'Kitchen screen reading return'); await done(); await assertKitchenReturn('screen explanation');
  await requestFromKitchen('Play Sinnerman'); await waitStage('completed'); await oneModule('media', 'playing', 'Kitchen media'); await done(); await assertKitchenReturn('media');
  await requestFromKitchen('Make Granny text larger'); await waitStage('size-preview'); await oneModule('readability', 'preview', 'Kitchen reading preview'); await press('#reading-cancel'); await b.waitFor("!document.querySelector('[data-outcome-module]')"); await assertKitchenReturn('reading preview Cancel');

  // A detached prior outcome control carries an old task/version and must be
  // inert once another outcome is current.
  await fresh(false); await request('Show photos of Sophie Book club from yesterday'); await waitStage('preview'); await approve(); await waitStage('completed');
  await b.evaluate("window.__oldPhotoNext=document.querySelector('#photo-next')"); await done();
  await request('Show me the photos Sophie sent yesterday'); await waitStage('completed'); await oneModule('photos', 'found', 'new default photo outcome');
  await b.evaluate('window.__oldPhotoNext.click()');
  check(await b.evaluate("document.querySelector('#photo-position').textContent === 'Photo 1 of 2'"), 'detached old photo control cannot mutate the new task outcome');
  await done();

  // Delayed lookup results are fenced in the browser as well as model tests:
  // replacing or Stopping the task cannot let its stale callback install photos.
  await fresh(true); await select('#review-delay', '1500');
  await request('Show photos of Sophie Book club from yesterday'); await waitStage('preview'); await approve();
  await b.waitFor("['planning','acting','waiting','verifying'].includes(document.querySelector('#current-task')?.dataset.stage)");
  await b.fill('#request', 'Play Sinnerman'); await press('#composer button[type=submit]');
  await b.waitFor("document.querySelector('#confirm-dialog[open]')"); await press('#confirm-dialog [value=confirm]');
  await b.waitFor("document.querySelector('#current-task')?.dataset.kind === 'media'");
  await b.evaluate('new Promise(resolve => setTimeout(resolve, 1700))');
  check(await b.evaluate("document.querySelector('#current-task')?.dataset.kind === 'media' && !document.querySelector('[data-outcome-module=photos]')"), 'approved replacement blocks a delayed old photo outcome');
  await fresh(true); await select('#review-delay', '1500');
  await request('Show photos of Sophie Book club from yesterday'); await waitStage('preview'); await approve();
  await b.waitFor("['planning','acting','waiting','verifying'].includes(document.querySelector('#current-task')?.dataset.stage)");
  await press('#stop-button'); await b.waitFor("document.querySelector('#current-task')?.dataset.stage === 'stopped'");
  await b.evaluate('new Promise(resolve => setTimeout(resolve, 1700))');
  check(await b.evaluate("document.querySelector('#current-task')?.dataset.stage === 'stopped' && !document.querySelector('[data-outcome-module=photos]')"), 'Stop blocks a delayed photo callback from installing an outcome');

  // Responsive regression: narrow, short and combined 300% (Granny 150% plus
  // reviewer 200%) retain an exit and avoid horizontal overflow.
  await fresh(true); await select('#review-scale', '2');
  await request('Make Granny text largest'); await waitStage('size-preview');
  await press('#reading-apply'); await waitStage('completed');
  for (const [width, height, label] of [[360, 480, 'narrow 300%'], [840, 320, 'short 300%']]) {
    await b.viewport(width, height); await geometry(label); await reach('#surface-done', label + ' Done');
  }
  await done();

  // Dense outcome variants retain a visible safe exit and non-overlapping
  // composer at narrow and keyboard-short 200% layouts.
  for (const [width, height, label] of [[360, 480, 'narrow 200%'], [840, 320, 'short 200%']]) {
    await b.viewport(width, height); await fresh(true); await select('#review-scale', '2');
    await request('Explain screen display-settings'); await waitStage('completed'); await press('#screen-guidance'); await oneModule('explain', 'guidance', label + ' screen guidance');
    await geometry(label + ' screen guidance'); await reach('#screen-explanation', label + ' screen Back');
    check(await noComposerOverlap(), label + ' screen guidance does not overlap the composer');
    await fresh(true); await select('#review-scale', '2'); await request('Tell David I’ll call after dinner.'); await press('[data-choice=david-family]'); await waitStage('preview'); await oneModule('message', 'preview', label + ' message preview');
    await geometry(label + ' message preview'); await reach('[data-action=approve]', label + ' specific approval');
    check(await noComposerOverlap(), label + ' message preview does not overlap the composer');
    await fresh(true); await select('#review-scale', '2'); await request('Make Granny text larger'); await waitStage('size-preview'); await oneModule('readability', 'preview', label + ' reading preview');
    await geometry(label + ' reading preview'); await reach('#reading-cancel', label + ' reading Cancel');
    check(await noComposerOverlap(), label + ' reading preview does not overlap the composer');
  }

  // The module family adds no persistence, external egress, executable markup,
  // or reviewer controls to participant mode.
  await fresh(false);
  check(await b.evaluate('!document.querySelector("#review-panel") && localStorage.length===0 && sessionStorage.length===0'), 'participant outcome mode has no reviewer UI or web storage');
  check(await b.evaluate('(async () => !(await indexedDB.databases()).length)()'), 'outcome modules add no IndexedDB');
  check(await b.evaluate('(async () => !(await navigator.serviceWorker.getRegistrations()).length)()'), 'outcome modules add no service worker');
  check(!b.errors.length, 'no browser exceptions: ' + JSON.stringify(b.errors));
  check(b.network.every(url => url.startsWith(b.base + '/') || url === 'about:blank'), 'outcome modules make no external requests');
  const result = {checks, screenshots:b.output, errors:b.errors, network:[...new Set(b.network)]};
  await writeFile(join(b.output, 'outcomes-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  await b.screenshot('outcomes-failure');
  console.error('Browser artifacts: ' + b.output);
  throw error;
} finally {
  await b.close();
}
