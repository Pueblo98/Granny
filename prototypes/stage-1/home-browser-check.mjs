// Selected T-119 Home checks. Browser evidence only; not Android or human proof.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {browser} from './browser-driver.mjs';
import roomFixtures from './room-fixtures.js';

const b = await browser();
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const select = (selector, value) => b.evaluate(`(() => {
  const element = document.querySelector(${JSON.stringify(selector)});
  if (!element) throw Error('Missing select: ' + ${JSON.stringify(selector)});
  element.value = ${JSON.stringify(value)};
  element.dispatchEvent(new Event('change', {bubbles:true}));
})()`);
const button = (label, within = 'body') => b.evaluate(`(() => {
  const element = [...document.querySelectorAll(${JSON.stringify(within)} + ' button')]
    .find(item => item.textContent.trim() === ${JSON.stringify(label)});
  if (!element || element.disabled) throw Error('Missing or disabled button: ' + ${JSON.stringify(label)});
  element.focus(); element.click();
})()`);
const key = async key => {
  const code = {Tab:9, Enter:13, Escape:27}[key];
  await b.cdp('Input.dispatchKeyEvent', {
    type:'keyDown', key, code:key, windowsVirtualKeyCode:code,
    ...(key === 'Enter' ? {text:'\r', unmodifiedText:'\r'} : {})
  });
  await b.cdp('Input.dispatchKeyEvent', {
    type:'keyUp', key, code:key, windowsVirtualKeyCode:code
  });
};
const fresh = async (review = false) => {
  await b.navigate(review ? '/?review=1' : '/');
  if (review) await select('#review-delay', '0');
};
const settleRooms = () => b.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
const noHorizontalOverflow = label => b.evaluate(`(() => {
  const result = {width:innerWidth, scrollWidth:document.documentElement.scrollWidth};
  if (result.scrollWidth > result.width + 1) throw Error(${JSON.stringify(label)} + ': ' + JSON.stringify(result));
  return true;
})()`);
const reachable = selector => b.evaluate(`(() => {
  const element = document.querySelector(${JSON.stringify(selector)});
  if (!element || !element.getClientRects().length) return false;
  element.scrollIntoView({block:'center'});
  const rect = element.getBoundingClientRect();
  const x = Math.max(0, Math.min(innerWidth - 1, (rect.left + rect.right) / 2));
  const y = Math.max(0, Math.min(innerHeight - 1, (rect.top + rect.bottom) / 2));
  return rect.left >= 0 && rect.right <= innerWidth && element.contains(document.elementFromPoint(x, y));
})()`);

try {
  await b.cdp('Page.addScriptToEvaluateOnNewDocument', {source:`(() => {
    window.__micCalls = 0; window.__speechCalls = 0;
    if (navigator.mediaDevices) Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
      configurable:true, value:() => { window.__micCalls++; return Promise.reject(Error('blocked by Home check')); }
    });
    const speech = function() { window.__speechCalls++; };
    Object.defineProperty(window, 'SpeechRecognition', {configurable:true, value:speech});
    Object.defineProperty(window, 'webkitSpeechRecognition', {configurable:true, value:speech});
  })()`});
  await b.viewport(1440, 900);
  await fresh();
  await settleRooms();
  const copy = await b.evaluate('document.body.innerText');
  for (const required of [
    'Granny', 'What would you like to do?',
    'Ask in your own words. You can type or talk.', 'Type a request', 'Talk',
    'Send', 'Continue in Kitchen', 'Vegetable soup',
    'Kitchen · Recipes, lists and cooking plans', 'Open Kitchen', 'Hide',
    'Other rooms', 'Fitness', 'Movement and routines', 'Trips',
    'Plans and packing', 'Kitchen',
    'See all rooms'
  ]) check(copy.includes(required), 'idle Home includes: ' + required);
  check(await b.evaluate("document.querySelector('#request').placeholder==='Ask me anything…'"), 'selected composer placeholder');
  check(await b.evaluate("document.querySelector('#stop-dock').hidden && document.querySelector('#stop-button').hidden"), 'idle Stop absent');
  check(await b.evaluate("!document.querySelector('#review-panel') && !document.querySelector('#review-home-fixture')"), 'reviewer controls absent from participant DOM');
  check(await b.evaluate("!document.querySelector('.sandbox-notice') && document.querySelector('#introduction').textContent.includes('does not record your voice') && document.querySelector('[data-menu=privacy]')"), 'redundant Home footer is absent while Menu disclosure remains');
  check(await b.evaluate("document.querySelectorAll('#continuation').length===1 && document.querySelectorAll('#room-list .room-entry').length===6"), 'one continuation and six semantic room targets');
  check(await b.evaluate("[...document.querySelectorAll('#room-list .room-entry')].every(item => item.tagName==='BUTTON' && item.getAttribute('aria-label') && item.querySelector('strong') && item.querySelector('span'))"), 'room name and purpose share one native target');
  check(await b.evaluate("!document.querySelector('#room-controls').hidden && document.querySelector('#room-viewport').dataset.overflow==='true'"), 'expanded six-room row has genuine overflow and written controls');
  check(await noHorizontalOverflow('expanded Home'), 'expanded Home has no page-level horizontal overflow');
  check(await b.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--canvas').trim()==='#fbf6ee' && getComputedStyle(document.documentElement).getPropertyValue('--focus').trim()==='#4930a1'"), 'Harbour Blue canvas and focus tokens');
  check(await b.evaluate("(() => { const composer=document.querySelector('#composer'); const wrap=document.querySelector('.composer-wrap'); const tail=document.querySelector('.composer-tail'); const input=document.querySelector('#request'); const box=wrap.getBoundingClientRect(); const art=tail.getBoundingClientRect(); return getComputedStyle(composer,'::before').content==='none' && getComputedStyle(composer,'::after').content==='none' && getComputedStyle(composer).overflow==='visible' && getComputedStyle(input).resize==='none' && tail.getAttribute('aria-hidden')==='true' && art.bottom<=box.bottom && art.top<composer.getBoundingClientRect().bottom; })()"), 'composer uses an in-layout decorative tail without generated masks, clipping, or a native resize handle');
  await b.evaluate("document.querySelector('#request').focus()");
  check(await b.evaluate("(() => { const composer=document.querySelector('#composer'); const frame=document.querySelector('.composer-focus-frame'); const path=document.querySelector('#composer-focus-path'); const focus=getComputedStyle(frame); const bounds=path.getBBox(); return getComputedStyle(composer).outlineStyle==='none' && focus.opacity==='1' && focus.stroke==='rgb(73, 48, 161)' && path.getAttribute('d') && bounds.height>composer.offsetHeight && getComputedStyle(document.querySelector('.composer-tail')).pointerEvents==='none'; })()"), 'one separated focus contour surrounds the rounded composer and its inert tail');
  await b.evaluate("document.querySelector('#request').blur()");
  await b.screenshot('selected-home-expanded');

  await b.click('#composer button[type=submit]');
  check(await b.evaluate("document.querySelector('#request').validationMessage.includes('Type a request') && !document.querySelector('#current-task')"), 'empty Send is explained and starts no work');
  await b.evaluate("document.querySelector('#request').focus()");
  await b.cdp('Input.insertText', {text:'Tell David I will call after dinner.'});
  await key('Tab');
  check(await b.evaluate("document.activeElement.id==='talk'"), 'keyboard reaches Talk after entry');
  await key('Tab');
  check(await b.evaluate("document.activeElement.matches('#composer button[type=submit]')"), 'keyboard reaches Send after Talk');
  await key('Enter');
  await b.waitFor("document.querySelector('#current-task')?.dataset.stage==='clarify-person'");
  check(await b.evaluate("document.querySelector('#current-task')?.dataset.stage==='clarify-person'"), 'keyboard submission preserves scripted workflow');

  await fresh();
  await b.evaluate("document.querySelector('#hide-continuation').focus()");
  await key('Enter');
  check(await b.evaluate("document.querySelector('#continuation').hidden && document.activeElement.id==='request'"), 'Hide removes continuation and returns focus to composer');
  check(await b.evaluate("localStorage.length===0 && sessionStorage.length===0"), 'continuation Hide adds no persistence');
  await fresh();
  check(await b.evaluate("!document.querySelector('#continuation').hidden"), 'fresh in-memory session restores continuation');

  await fresh();
  await b.evaluate("document.querySelector('#open-kitchen').focus()");
  await b.click('#open-kitchen');
  check(await b.evaluate("document.querySelector('#room-surface h1').textContent==='Kitchen' && document.querySelector('#room-continue')"), 'Kitchen continuation opens overview with fictional soup continuation');
  await b.click('#room-home');
  await b.waitFor("document.activeElement.id==='open-kitchen'");
  check(await b.evaluate("document.activeElement.id==='open-kitchen'"), 'Kitchen return restores source focus');

  await b.evaluate("document.querySelector('#room-fitness').focus()");
  await key('Enter');
  check(await b.evaluate("document.querySelector('#room-surface[data-room-id=fitness] h1').textContent==='Fitness'"), 'room target opens labelled fictional interior');
  await b.evaluate("document.querySelector('#room-home').focus()");
  await key('Enter');
  await b.waitFor("document.activeElement.id==='room-fitness'");
  check(await b.evaluate("document.activeElement.id==='room-fitness'"), 'keyboard room return restores source focus');

  await b.evaluate("document.querySelector('#see-all-rooms').focus()");
  await key('Enter');
  check(await b.evaluate("document.querySelector('.room-library h1').textContent==='Rooms' && document.querySelectorAll('.room-library-list button').length===6"), 'See all rooms exposes vertical non-gesture library');
  await b.waitFor("document.activeElement===document.querySelector('.room-library h1')");
  await b.evaluate("document.querySelector('#library-room-fitness').focus()");
  await key('Enter');
  check(await b.evaluate("document.querySelector('#room-surface[data-room-id=fitness]') && document.querySelector('#rooms-button')"), 'keyboard list entry opens room with library return');
  await b.waitFor("document.activeElement===document.querySelector('#room-surface h1')");
  await b.evaluate("document.querySelector('#rooms-button').focus()");
  await key('Enter');
  await b.waitFor("document.activeElement.id==='library-room-fitness'");
  check(await b.evaluate("document.activeElement.id==='library-room-fitness'"), 'Back to all rooms restores selected list entry');
  await button('Back to Home');
  await b.waitFor("document.activeElement.id==='see-all-rooms'");
  check(await b.evaluate("document.activeElement.id==='see-all-rooms'"), 'Rooms list return restores source focus');

  await b.viewport(840, 900);
  await fresh(true);
  await select('#review-home-fixture', 'overflow');
  await settleRooms();
  check(await b.evaluate("document.querySelector('#room-viewport').dataset.overflow==='true' && !document.querySelector('#room-controls').hidden"), 'forced fixture produces rendered overflow');
  check(await b.evaluate("document.querySelector('#rooms-previous').getAttribute('aria-disabled')==='true' && document.querySelector('#rooms-next').getAttribute('aria-disabled')==='false' && document.querySelector('#rooms-position').textContent.includes('Start of row') && !document.querySelector('#rooms-position').hidden"), 'first overflow position and visible reason are truthful');
  const firstRow = await b.evaluate("({left:document.querySelector('#room-viewport').scrollLeft,range:document.querySelector('#room-viewport').dataset.range})");
  await b.evaluate(`(() => {
    window.__roomAnnouncements=[];
    window.__roomObserver=new MutationObserver(() => {
      const value=document.querySelector('#announcement').textContent.trim();
      if (value) window.__roomAnnouncements.push(value);
    });
    window.__roomObserver.observe(document.querySelector('#announcement'), {childList:true,subtree:true,characterData:true});
    document.querySelector('#rooms-next').focus();
  })()`);
  await key('Enter');
  await b.waitFor("document.querySelector('#rooms-previous').getAttribute('aria-disabled')==='false' && document.querySelector('#rooms-next').getAttribute('aria-disabled')==='false'");
  await b.waitFor("window.__roomAnnouncements.length===1");
  check(await b.evaluate("document.activeElement.id==='rooms-next'"), 'Next retains focus at middle position');
  check(await b.evaluate("window.__roomAnnouncements.length===1 && /Rooms now showing/.test(window.__roomAnnouncements[0])"), 'Next produces one polite range announcement');
  const middleRow = await b.evaluate("({left:document.querySelector('#room-viewport').scrollLeft,range:document.querySelector('#room-viewport').dataset.range})");
  check(middleRow.left > firstRow.left && middleRow.range !== firstRow.range, 'Next changes rendered position and foreground range');
  await b.evaluate('window.__roomAnnouncements=[]');
  await key('Enter');
  await b.waitFor("document.querySelector('#rooms-next').getAttribute('aria-disabled')==='true'");
  await b.waitFor("window.__roomAnnouncements.length===1");
  check(await b.evaluate("document.querySelector('#rooms-previous').getAttribute('aria-disabled')==='false' && document.querySelector('#rooms-next').getAttribute('aria-disabled')==='true' && document.querySelector('#rooms-position').textContent.includes('End of row')"), 'last overflow position is truthful');
  check(await b.evaluate("document.activeElement.id==='rooms-next' && window.__roomAnnouncements.length===1"), 'last movement retains focus and announces once');
  const lastRow = await b.evaluate("({left:document.querySelector('#room-viewport').scrollLeft,range:document.querySelector('#room-viewport').dataset.range})");
  check(lastRow.left > middleRow.left && lastRow.range !== middleRow.range, 'last movement changes rendered position and foreground range');
  await b.evaluate('window.__roomAnnouncements=[]; document.querySelector("#rooms-previous").focus()');
  await key('Enter');
  await b.waitFor("document.querySelector('#rooms-previous').getAttribute('aria-disabled')==='false' && document.querySelector('#rooms-next').getAttribute('aria-disabled')==='false'");
  await b.waitFor("window.__roomAnnouncements.length===1");
  check(await b.evaluate("document.activeElement.id==='rooms-previous' && window.__roomAnnouncements.length===1"), 'Previous retains focus and announces once');
  const returnMiddle = await b.evaluate("({left:document.querySelector('#room-viewport').scrollLeft,range:document.querySelector('#room-viewport').dataset.range})");
  check(returnMiddle.left < lastRow.left && returnMiddle.range === middleRow.range, 'Previous restores middle position and range');
  await b.evaluate('window.__roomAnnouncements=[]');
  await key('Enter');
  await b.waitFor("document.querySelector('#rooms-previous').getAttribute('aria-disabled')==='true'");
  await b.waitFor("window.__roomAnnouncements.length===1");
  check(await b.evaluate("document.activeElement.id==='rooms-previous' && document.querySelector('#rooms-next').getAttribute('aria-disabled')==='false' && window.__roomAnnouncements.length===1"), 'return to first position is truthful and announces once');
  const returnFirst = await b.evaluate("({left:document.querySelector('#room-viewport').scrollLeft,range:document.querySelector('#room-viewport').dataset.range})");
  check(returnFirst.left === firstRow.left && returnFirst.range === firstRow.range, 'Previous restores initial rendered position and range');

  await select('#review-home-fixture', 'all-fit');
  await settleRooms();
  check(await b.evaluate("document.querySelector('#room-viewport').dataset.overflow==='false' && document.querySelector('#room-controls').hidden && document.querySelector('#room-viewport').scrollLeft===0 && document.querySelector('#room-viewport').scrollWidth<=document.querySelector('#room-viewport').clientWidth"), 'all-fit fixture suppresses false movement');
  await select('#review-home-fixture', 'one-room');
  await settleRooms();
  check(await b.evaluate("document.querySelectorAll('#room-list .room-entry').length===1 && document.querySelector('#room-controls').hidden"), 'one-room fixture stays honest');
  await select('#review-home-fixture', 'no-rooms');
  await settleRooms();
  check(await b.evaluate("document.querySelectorAll('#room-list .room-entry').length===0 && !document.querySelector('#empty-rooms').hidden && !!document.querySelector('#see-all-rooms')"), 'no-room fixture keeps written fallback');
  await select('#review-home-fixture', 'image-failure');
  await b.waitFor("document.querySelector('#room-kitchen.image-missing') && getComputedStyle(document.querySelector('#room-kitchen img')).visibility==='hidden'");
  check(await b.evaluate("document.querySelector('#room-kitchen').textContent.includes('Kitchen') && document.querySelector('#room-kitchen').textContent.includes('Recipes, lists and cooking plans')"), 'portrait failure preserves room text and target');
  await select('#review-home-fixture', 'continuation-hidden');
  check(await b.evaluate("document.querySelector('#continuation').hidden"), 'continuation-hidden fixture is reviewable');

  for (const [width, height] of [[360,720], [600,800], [840,900], [1440,900], [600,480]]) {
    await b.viewport(width, height);
    await fresh();
    await settleRooms();
    check(await noHorizontalOverflow(width + 'x' + height), width + 'x' + height + ' has no page overflow');
    check(await b.evaluate(`document.body.dataset.homeList === ${JSON.stringify(String(width <= 700))}`), width + ' uses truthful row/list treatment');
    for (const selector of ['#menu-button', '#request', '#talk', '#composer button[type=submit]', '#open-kitchen', '#hide-continuation', '#room-list .room-entry', '#see-all-rooms'])
      check(await reachable(selector), width + ' core control reachable: ' + selector);
  }

  for (const [width, height] of [[360,720], [600,800], [840,900], [1440,900]]) {
    await b.viewport(width, height);
    await fresh(true);
    await b.click('#menu-button');
    await b.click('[data-menu=text]');
    await b.click('#pref-scale-15');
    await b.click('#apply-preferences');
    await button('Return to conversation');
    await select('#review-scale', '2');
    await settleRooms();
    check(await b.evaluate("parseFloat(getComputedStyle(document.body).fontSize)===66 && document.body.dataset.homeList==='true'"), 'combined 300% uses direct list at ' + width);
    check(await noHorizontalOverflow('300% ' + width), '300% ' + width + ' has no page overflow');
    for (const selector of ['#menu-button', '#request', '#talk', '#composer button[type=submit]', '#open-kitchen', '#room-list .room-entry', '#see-all-rooms'])
      check(await reachable(selector), '300% ' + width + ' core control reachable: ' + selector);
    if (width === 600) await b.screenshot('selected-home-narrow-large-text');
  }

  await b.viewport(840, 900);
  await b.cdp('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await fresh(true);
  await select('#review-home-fixture', 'overflow');
  await settleRooms();
  check(await b.evaluate("getComputedStyle(document.documentElement).scrollBehavior==='auto' && getComputedStyle(document.querySelector('#room-viewport')).animationDuration==='0s'"), 'reduced motion leaves no essential animation');
  await b.cdp('Emulation.setEmulatedMedia', {features:[]});

  await b.viewport(840, 900);
  await fresh();
  check(await b.evaluate("window.__micCalls===0 && window.__speechCalls===0"), 'no microphone or speech capture during initialization');
  await b.click('#talk');
  check(await b.evaluate("window.__micCalls===0 && window.__speechCalls===0 && !document.querySelector('#speech-surface').hidden && document.querySelector('#speech-surface').textContent.includes('no microphone is used')"), 'Talk is simulated without microphone or speech capture');
  await key('Escape');
  check(await b.evaluate("localStorage.length===0 && sessionStorage.length===0 && document.cookie===''"), 'no Web Storage or cookies');
  check(await b.evaluate("(async()=>!(await indexedDB.databases()).length)()"), 'no IndexedDB');
  check(await b.evaluate("(async()=>!(await navigator.serviceWorker.getRegistrations()).length)()"), 'no service worker');
  check(await b.evaluate("(async()=>!(await caches.keys()).length)()"), 'no CacheStorage');
  check(!b.errors.length, 'no runtime exceptions: ' + JSON.stringify(b.errors));
  const requestedPaths = b.network.filter(url => url.startsWith(b.base + '/'))
      .map(url => new URL(url).pathname);
  const allowedPaths = new Set(['/', '/styles.css', '/fixtures.js', '/intent.js',
    '/room-fixtures.js', '/rooms-store.js', '/room-dialog.js', '/room-create.js', '/room-library.js', '/room-ui.js',
    '/model.js', '/scheduler.js', '/cloud.js', '/conversation-data.js', '/outcome-ui.js', '/support-state.js', '/support-ui.js', '/app.js', '/favicon.ico',
    '/assets/room-fitness-placeholder.svg', '/assets/room-trips-placeholder.svg',
    '/assets/room-reading-placeholder.svg', '/assets/missing-room-placeholder.svg']);
  for (const room of roomFixtures.rooms)
    for (const path of [room.mark, room.portrait, room.backdrop, room.decor,
      room.motif, room.empty, ...room.collections.map(c => c.symbol)]) allowedPaths.add(path);
  const apiPaths = requestedPaths.filter(path => path.startsWith('/api/'));
  allowedPaths.add('/api/runtime/config');
  allowedPaths.add('/api/conversations');
  check(apiPaths.every(path => path === '/api/runtime/config' || path === '/api/conversations') && !apiPaths.some(path => path.includes('/session') || path.includes('/command')), 'first chat may check local runtime/history availability but creates no runtime session or command');
  check(requestedPaths.every(path => allowedPaths.has(path)), 'Home requests only allowlisted static fixtures');
  check(b.network.every(url => url === 'about:blank' || url.startsWith(b.base + '/')), 'only loopback runtime requests');

  const result = {
    checks,
    errors:b.errors,
    network:[...new Set(b.network)],
    screenshots:b.output,
    browser:(await b.cdp('Browser.getVersion')).product
  };
  await writeFile(join(b.output, 'home-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  await b.screenshot('home-failure');
  console.error('Home browser artifacts: ' + b.output);
  throw error;
} finally {
  await b.close();
}
