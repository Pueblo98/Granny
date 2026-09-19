// Integrated browser simulation checks. No native Android or human evidence.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { browser } from './browser-driver.mjs';
const b = await browser();
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const text = () => b.evaluate("document.querySelector('#thread').innerText");
const stage = () => b.evaluate("document.querySelector('#current-task')?.dataset.stage");
const button = (label, within = 'body') => b.evaluate(`(() => {
  const el = [...document.querySelectorAll(${JSON.stringify(within)} + ' button')].find(x => x.textContent.trim() === ${JSON.stringify(label)});
  if (!el || el.disabled) throw Error('Missing button: ' + ${JSON.stringify(label)});
  el.focus(); el.click();
})()`);
const select = (selector, value) => b.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); e.value = ${JSON.stringify(value)}; e.dispatchEvent(new Event('change',{bubbles:true})); })()`);
const request = async value => { await b.fill('#request', value); await b.click('#composer button[type=submit]'); };
const choice = value => b.click('[data-choice="' + value + '"]');
const waitStage = value => b.waitFor("document.querySelector('#current-task')?.dataset.stage === " + JSON.stringify(value));
const finish = () => waitStage('completed');
const menu = async name => { await b.click('#menu-button'); await b.click('[data-menu="' + name + '"]'); };
const key = async (key, code = key, modifiers = 0) => {
  const windowsVirtualKeyCode = {Tab:9, Enter:13, Escape:27, ' ':32}[key];
  await b.cdp('Input.dispatchKeyEvent', {type:'keyDown', key, code, modifiers, windowsVirtualKeyCode, ...(key==='Enter' ? {text:'\r',unmodifiedText:'\r'} : {})});
  await b.cdp('Input.dispatchKeyEvent', {type:'keyUp', key, code, modifiers, windowsVirtualKeyCode});
};
const fresh = async (review = false) => { await b.navigate(review ? '/?review=1' : '/'); if (review) await select('#review-delay', '0'); };
const message = async (body = 'I’ll call after dinner.') => {
  await request('Tell David ' + body); await choice('david-family'); await choice('Example Messages');
};
const geometry = async label => {
  const result = await b.evaluate(`({
    width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
    small:[...document.querySelectorAll('#app-shell button')].filter(e=>e.getClientRects().length && e.getBoundingClientRect().height < 55.5).map(e=>e.textContent),
    empty:[...document.querySelectorAll('#app-shell button')].filter(e=>e.getClientRects().length && !e.textContent.trim()).length,
    primary:[...document.querySelectorAll('#app-shell .primary,#stop-button')].filter(e=>e.getClientRects().length && e.getBoundingClientRect().height < 63.5).map(e=>e.textContent)
  })`);
  check(result.scrollWidth <= result.width + 1, label + ' horizontal overflow: ' + JSON.stringify(result));
  check(!result.small.length && !result.primary.length, label + ' undersized targets: ' + JSON.stringify(result));
  check(!result.empty, label + ' unlabeled buttons');
};
try {
  await b.viewport(840, 1100); await fresh();
  check(await b.evaluate("!document.querySelector('#review-panel')"), 'review tools absent from participant DOM');
  check(await b.evaluate("![...document.querySelectorAll('[tabindex]')].some(e=>e.tabIndex>0)"), 'natural keyboard order');
  check(await b.evaluate("document.querySelector('#welcome h1').textContent==='What would you like to do?' && document.querySelector('#request').placeholder==='Ask me anything…'"), 'selected Home invitation and composer copy');
  check(await b.evaluate("document.querySelector('#stop-dock').hidden && document.querySelector('#stop-button').hidden"), 'idle Home has no Stop');
  check(await b.evaluate("document.querySelectorAll('#room-list .room-entry').length===6 && document.querySelector('#continuation') && document.querySelector('#see-all-rooms')"), 'one continuation and explicit six-room row');
  await geometry('portrait home'); await b.screenshot('home-portrait');
  await request('Tell David I’ll call after dinner.');
  check(await stage() === 'clarify-person', 'direct intent, no category selection');
  await request('Brother'); check(await stage() === 'clarify-channel', 'typed person reply keeps task');
  await request('Example Mail'); check(await stage() === 'preview', 'typed channel reply reaches preview');
  check((await text()).includes('I’ll call after dinner.'), 'exact body retained');
  await button('Change');
  await b.fill('[aria-label="Message"]', '<script>window.injection=1</script> Dinner at 7?');
  await select('[aria-label="Recipient"]', 'david-garden');
  await button('Save changes');
  check((await text()).includes('Gardening group'), 'recipient change alters resolved person');
  check((await text()).includes('<script>window.injection=1</script>'), 'message preserved as literal text');
  check(await b.evaluate("!window.injection&&!document.querySelector('#thread script')"), 'user content never HTML');
  await b.screenshot('message-preview');
  await b.click('[data-action=approve]'); check(await b.evaluate("!document.querySelector('#stop-button').hidden"), 'Stop appears during automatic work');
  await finish();
  check((await text()).includes('not sent') || (await text()).includes('not been sent'), 'unsent handoff truthful');
  check(await b.evaluate("!document.querySelector('#current-task [data-action=approve]')"), 'no approval on completed task');

  await request('Show me the photos Sophie sent yesterday.'); await finish();
  check(await b.evaluate("document.querySelectorAll('#current-task .photo-item').length===2"), 'actual filtered inline collection');
  check(/Sophie/.test(await text()) && /2026-09-13|13 September/.test(await text()) && /Example/.test(await text()), 'photo provenance visible');
  await b.screenshot('photos-portrait');
  const beforePhoto = await b.evaluate('scrollY');
  await b.evaluate("document.querySelector('.photo-item').focus(); document.querySelector('.photo-item').click()");
  check(await b.evaluate("!!document.querySelector('dialog[open] img')"), 'image opens');
  await button('Next', 'dialog[open]'); await button('Previous', 'dialog[open]');
  await button('Close', 'dialog[open]');
  await b.waitFor("!document.querySelector('dialog[open]') && document.activeElement.classList.contains('photo-item')");
  check(await b.evaluate("document.activeElement.classList.contains('photo-item')"), 'photo focus restored');
  check(Math.abs(await b.evaluate('scrollY') - beforePhoto) < 3, 'photo return retains scroll');

  await request('What am I looking at?'); check(await stage() === 'clarify-screen', 'screen context explicitly supplied');
  await choice('display-settings'); await finish();
  await button('Explain more simply');
  check(await b.evaluate("document.querySelector('#current-task').dataset.kind==='explain'"), 'simpler is contextual');
  check(/Text size/.test(await text()) && /Display size/.test(await text()), 'visible plain explanation distinguishes the two settings');
  await b.screenshot('screen-explanation');

  await request('Play some Nina Simone.'); check(await stage() === 'clarify-media', 'ambiguous music resolved inline');
  await choice('sinnerman'); await finish();
  check((await text()).includes('Nina Simone'), 'actual performer metadata');
  await button('Pause'); check((await text()).includes('paused'), 'pause changes state');
  await menu('text'); await button('Return to conversation');
  check((await text()).includes('paused'), 'playback survives settings');
  await button('Resume'); await b.screenshot('media-player');
  await request('pause'); await request('pause');
  check((await text()).toLowerCase().includes('paused'), 'repeated typed pause is idempotent');

  await request('Make this easier to read.'); await choice('granny');
  check(await stage() === 'size-preview', 'readability offers preview before applying');
  const original = await b.evaluate("parseFloat(getComputedStyle(document.body).fontSize)");
  await button('Apply this size'); check(await stage() === 'completed', 'explicit local size apply');
  check(await b.evaluate("parseFloat(getComputedStyle(document.body).fontSize)") > original, 'actual text scales');
  await button('Restore previous size');
  check(await b.evaluate("parseFloat(getComputedStyle(document.body).fontSize)") === original, 'restore exact previous size');

  await fresh(true); await message('Retain this draft.');
  await b.evaluate("window.oldApproval=document.querySelector('[data-action=approve]')");
  await b.click('#review-expire'); check(await stage() === 'expired', 'review expiry works');
  check((await text()).includes('Retain this draft.'), 'expiry retains exact draft');
  await button('Review again'); await button('Change');
  await b.fill('[aria-label="Message"]', 'Changed exact body.'); await button('Save changes');
  await b.evaluate('window.oldApproval.click()');
  check(!['planning','acting','waiting','verifying','completed'].includes(await stage()), 'historical button cannot approve current version');
  if (await stage() === 'expired') await button('Review again');
  await select('#review-delay', '1500'); await b.click('[data-action=approve]'); await b.click('#stop-button');
  await b.evaluate('new Promise(resolve=>setTimeout(resolve,1700))');
  check(await stage() === 'stopped', 'Stop prevents pending completion');

  await fresh(true); await select('#review-fault', 'unknown'); await message(); await b.click('[data-action=approve]');
  await waitStage('unknown');
  check(await b.evaluate("!document.querySelector('#current-task [data-action=approve]')"), 'unknown no resend button');
  await button('I understand');
  check(await stage() !== 'unknown', 'unknown acknowledgement has real exit');
  await select('#review-fault','');
  await message(); await b.click('[data-action=approve]'); await finish();
  check((await text()).includes('not sent'), 'None clears prior injected outcome');

  for (const failure of ['partial','paywall','unavailable']) {
    await fresh(true); await select('#review-fault',failure); await request('Play Sinnerman'); await waitStage('failed');
    check(!await b.evaluate("[...document.querySelectorAll('#current-task button')].some(e=>e.textContent==='Resume')"), failure+' cannot offer unverified playback');
    check(!(await text()).includes('is paused in this simulation'),failure+' is not mislabeled paused');
  }
  for (const failure of ['offline','permission','auth']) {
    await fresh(true); await select('#review-fault',failure); await request('Show me the photos Sophie sent yesterday'); await waitStage('failed');
    check(!await b.evaluate("document.querySelector('#current-task .photo-item')"),failure+' cannot expose successful photos');
  }
  await fresh(true); await select('#review-screen','signin'); await b.click('#composer button[type=submit]'); await waitStage('failed');
  check((await text()).includes('protected'),'review screen selection supplies actual protected fixture');
  check(!await b.evaluate("document.querySelector('input[type=password]')"),'protected context never requests credentials');
  await select('#review-screen','unknown'); await b.click('#composer button[type=submit]'); await waitStage('failed');
  check((await text()).includes('can’t identify'),'unknown screen does not fabricate explanation');
  await fresh(true); await select('#review-fault','noPhotos'); await request('Show me the photos Sophie sent yesterday'); await waitStage('no-matches');
  await select('#review-fault','uncertainDate'); await request('yesterday'); await finish();
  check((await text()).includes('possible matches'),'uncertain source date stays explicit');
  await fresh(true); await request('Find photos from Sophie Book club on 12 September'); await waitStage('preview');
  check(/Book club/.test(await text()) && /Example Messages/.test(await text()) && /mark it read/.test(await text()),'mark-read exact person/source/consequence preview');
  await b.click('[data-action=approve]'); await finish();
  check((await text()).includes('may now be marked read'),'mark-read result reports side effect');
  await fresh(true); await message(); await select('#review-delay','1500'); await b.click('[data-action=approve]');
  await b.click('#talk'); await b.click('#talk-stop'); await waitStage('stopped');
  await b.evaluate('new Promise(resolve=>setTimeout(resolve,1700))'); check(await stage()==='stopped','Talk Stop cancels pending progression');
  await fresh(true); await select('#review-delay','1500'); await request('Show me the photos Sophie sent yesterday'); await menu('new');
  check(await b.evaluate("!!document.querySelector('#confirm-dialog[open]')"),'all-task unfinished protection');
  await b.click('#confirm-dialog button[value=confirm]'); await b.waitFor("!document.querySelector('#current-task')");
  await b.evaluate('new Promise(resolve=>setTimeout(resolve,1700))'); check(!await stage(),'new conversation prevents stale lookup callback');
  await b.fill('#request','Keep this input'); await menu('new'); await key('Escape');
  await b.waitFor("!document.querySelector('#confirm-dialog[open]')");
  check(await b.evaluate("document.querySelector('#request').value==='Keep this input'"),'Escape cannot replay prior dialog consent');
  await fresh(true); await message(); await b.click('[data-action=approve]'); await finish();

  await menu('preferences');
  await b.fill('#alias-label','Garden friend'); await select('#alias-person','david-garden'); await b.click('#alias-save');
  check((await text()).includes('Garden friend'), 'explicit alias saves locally');
  const editAlias = await b.evaluate("[...document.querySelectorAll('[id^=alias-edit-]')].find(e=>e.textContent.includes('Garden friend'))?.id");
  await b.click('#'+editAlias); await select('#alias-person','david-family'); await b.click('#alias-save');
  await button('Return to conversation'); await request('Tell Garden friend See you soon via Example Mail'); await waitStage('preview');
  check(/Brother/.test(await text()) && /See you soon/.test(await text()),'alias correction changes actual recipient routing');
  await button('Cancel','#current-task'); await menu('preferences');
  const aliasButton = await b.evaluate("[...document.querySelectorAll('[id^=alias-delete-]')].find(e=>e.textContent.includes('Garden friend'))?.id");
  check(!!aliasButton, 'new alias can be deleted'); await b.click('#' + aliasButton); await b.click('#confirm-dialog button[value=confirm]');
  await b.waitFor("!document.getElementById(" + JSON.stringify(aliasButton) + ")");
  check(await b.evaluate("!document.querySelector('[data-panel=preferences]').innerText.includes('Garden friend')"), 'alias deletion removes saved mapping without rewriting earlier conversation');
  await button('Return to conversation'); await menu('history');
  check(await b.evaluate("!!document.querySelector('[data-panel=history]')"), 'history discoverable');
  await button('Clear recent activity'); await b.click('#confirm-dialog button[value=confirm]');
  await b.waitFor("!document.querySelector('#confirm-dialog[open]') && ![...document.querySelectorAll('[data-panel=history] button')].some(e=>e.textContent==='Clear recent activity')");
  check((await text()).includes('no completed activity') || (await text()).includes('No recent'), 'history deletion takes effect');
  await button('Return to conversation');

  for (const [width,height] of [[1200,800],[600,960],[360,720],[360,480]]) {
    await b.viewport(width,height); await geometry(width+'x'+height);
    await b.screenshot('layout-'+width+'x'+height);
  }
  await b.viewport(840,900); await menu('text'); await button('150%'); await button('Apply this size');
  await button('Return to conversation'); await select('#review-scale','2');
  check(await b.evaluate("parseFloat(getComputedStyle(document.body).fontSize)===60"), 'combined 300% text genuinely applies');
  for (const [width,height] of [[840,900],[360,720],[600,520],[360,480]]) {
    await b.viewport(width,height); await geometry('300% '+width); await b.screenshot('large-text-'+width);
    for (const selector of ['#request','#talk','#composer button[type=submit]']) {
      const reachable = await b.evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}); e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); const y=Math.max(0,Math.min(innerHeight-1,(r.top+r.bottom)/2)); return r.left>=0 && r.right<=innerWidth && e.contains(document.elementFromPoint((r.left+r.right)/2,y)); })()`);
      check(reachable,'300% '+width+'x'+height+' composer control reachable: '+selector);
    }
  }
  await message('Keep Stop visible.'); await select('#review-delay','1500'); await b.click('[data-action=approve]');
  for (const [width,height] of [[360,480],[840,900]]) {
    await b.viewport(width,height);
    for (const where of ['0','document.documentElement.scrollHeight']) {
      const visible = await b.evaluate(`(() => { scrollTo(0,${where}); const e=document.querySelector('#stop-button'),r=e.getBoundingClientRect(); return r.top>=0 && r.bottom<=innerHeight && e.contains(document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2)); })()`);
      check(visible,'300% Stop immediately reachable '+width+' at '+where);
    }
  }
  await b.click('#stop-button');
  await select('#review-scale','1'); await b.viewport(840,1100);
  await b.screenshot('harbour-blue-active-task');

  await fresh();
  await b.click('#talk'); check(await b.evaluate("!!document.querySelector('#talk-dialog[open]')"), 'simulated Talk opens');
  const decline = await b.evaluate("[...document.querySelectorAll('#talk-dialog button')].find(x=>/touch|type|decline/i.test(x.textContent))?.textContent.trim()");
  check(!!decline,'no-microphone path offered'); await button(decline,'#talk-dialog');
  await b.fill('#request','Unfinished words');
  await menu('new');
  check(await b.evaluate("!!document.querySelector('#confirm-dialog[open]')"), 'new conversation guards unfinished composer');
  await b.click('#confirm-dialog button[value=cancel]');
  await b.waitFor("!document.querySelector('#confirm-dialog[open]')");
  check(await b.evaluate("document.querySelector('#request').value==='Unfinished words'"), 'cancel preserves unfinished input');
  await fresh();
  await b.fill('#request','Tell David I will call.');
  await b.evaluate("document.querySelector('#request').focus()");
  await key('Tab'); check(await b.evaluate("document.activeElement.id==='talk'"), 'keyboard reaches Talk after input');
  await key('Tab'); check(await b.evaluate("document.activeElement.matches('#composer button[type=submit]')"), 'keyboard reaches typed submission');
  await key('Enter'); await waitStage('clarify-person');
  await b.evaluate("document.querySelector('[data-choice=david-family]').focus()"); await key('Enter'); await waitStage('clarify-channel');
  await b.evaluate("document.querySelector('[data-choice]').focus()"); await key('Enter'); await waitStage('preview');
  check(await stage()==='preview','keyboard-only activation reaches exact preview');
  await b.click('#talk'); await key('Escape');
  await b.waitFor("!document.querySelector('#talk-dialog[open]') && document.activeElement.id==='talk'");
  check(await b.evaluate("document.activeElement.id==='talk'"),'Escape returns dialog focus');
  await menu('privacy'); await button('Reset everything'); await b.click('#confirm-dialog button[value=confirm]');
  await b.waitFor("!document.querySelector('#current-task') && document.querySelector('#request').value===''");
  check(await b.evaluate("parseFloat(getComputedStyle(document.body).fontSize)===20"),'privacy reset restores local baseline');
  await fresh(true); await select('#review-delay','1500'); await request('Show me the photos Sophie sent yesterday'); await menu('new');
  check(await b.evaluate("!document.querySelector('#confirm-stop').hidden"),'active interruption dialog keeps Stop available');
  await b.click('#confirm-stop'); await waitStage('stopped'); await b.waitFor("!document.querySelector('#confirm-dialog[open]')");
  await fresh(); await request('constructor'); await waitStage('clarify-intent');
  await request('Play Sinnerman'); await finish();
  check(!await b.evaluate("document.querySelector('#confirm-dialog[open]')"),'unknown input accepts a supported correction without replacement friction');
  await fresh(true); await select('#review-delay','650'); await message(); await b.click('[data-action=approve]');
  await b.fill('#request','Keep these unfinished words while you work.');
  await b.evaluate("scrollTo(0,0); document.querySelector('#request').focus({preventScroll:true}); document.querySelector('#request').setSelectionRange(5,10)");
  const readingPosition=await b.evaluate('scrollY');
  await finish();
  check(await b.evaluate("document.activeElement.id==='request' && document.querySelector('#request').value==='Keep these unfinished words while you work.'"),'progress preserves composer focus and unfinished words');
  check(await b.evaluate("document.querySelector('#request').selectionStart===5 && document.querySelector('#request').selectionEnd===10"),'progress retains composer selection');
  check(Math.abs(await b.evaluate('scrollY')-readingPosition)<3,'progress does not scroll a reader away from the top');
  await fresh(true); await message('Original exact words.'); await button('Change');
  await b.fill('[aria-label=Message]','Uncommitted edit stays here.');
  await menu('text'); await button('115%','[data-panel=text]'); await button('Apply this size','[data-panel=text]'); await button('Return to conversation','[data-panel=text]');
  check(await b.evaluate("document.querySelector('[aria-label=Message]').value==='Uncommitted edit stays here.'"),'text settings retain unsaved draft editor');
  await button('Cancel editing');
  check((await text()).includes('Original exact words.') && !(await text()).includes('Uncommitted edit stays here.'),'cancel editing restores original exact draft');
  check(await stage()==='expired','cancel editing does not restore old approval authority');
  await b.viewport(840,1100); await fresh(true); await message();
  check(await b.evaluate("getComputedStyle(document.body).backgroundColor==='rgb(251, 246, 238)'"), 'Harbour Blue Linen canvas stays active in conversation');
  await b.evaluate("document.querySelector('#current-task').scrollIntoView({block:'start'})");
  await b.screenshot('harbour-blue-message');
  await fresh(true); await request('Show me the photos Sophie sent yesterday'); await finish();
  await b.evaluate('scrollTo(0,0)'); await b.screenshot('walkthrough-photos-harbour-blue');
  check(await b.evaluate("localStorage.length===0 && sessionStorage.length===0"), 'no persistent web storage');
  check(await b.evaluate("(async()=>!(await indexedDB.databases()).length)()"), 'no IndexedDB');
  check(await b.evaluate("(async()=>!(await navigator.serviceWorker.getRegistrations()).length)()"), 'no service worker');
  check(await b.evaluate("(async()=>!(await caches.keys()).length)()"), 'no CacheStorage');
  check(!b.errors.length, 'no runtime exceptions: '+JSON.stringify(b.errors));
  check(b.network.every(url=>url.startsWith(b.base+'/')||url==='about:blank'), 'no external runtime requests');
  const result = {checks, errors:b.errors, network:[...new Set(b.network)], screenshots:b.output, browser:(await b.cdp('Browser.getVersion')).product};
  await writeFile(join(b.output,'results.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
} catch (error) {
  await b.screenshot('failure'); console.error('Browser artifacts: '+b.output); throw error;
} finally {await b.close();}
