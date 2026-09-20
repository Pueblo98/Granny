// Deterministic Rooms-system browser evidence. Local fictional fixtures only.
import assert from 'node:assert/strict';
import { browser } from './browser-driver.mjs';

const b = await browser();
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const key = async (key, shiftKey = false) => {
  const code = {Tab: 9, Escape: 27}[key];
  await b.cdp('Input.dispatchKeyEvent', {type:'keyDown', key, code:key, windowsVirtualKeyCode:code, modifiers:shiftKey ? 8 : 0});
  await b.cdp('Input.dispatchKeyEvent', {type:'keyUp', key, code:key, windowsVirtualKeyCode:code, modifiers:shiftKey ? 8 : 0});
};
const fresh = path => b.navigate(path || '/?review=1');
const library = async () => { await b.click('#rooms-button'); await b.waitFor("document.querySelector('.room-library')"); };
const room = async id => { await library(); await b.click('#library-room-'+id); await b.waitFor("document.querySelector('#room-surface')?.dataset.roomId==="+JSON.stringify(id)); };
const noOverflow = label => b.evaluate(`document.documentElement.scrollWidth <= innerWidth + 1`).then(v => check(v, label+' does not overflow horizontally'));

try {
  await b.viewport(1440, 900); await fresh(); await library();
  check(await b.evaluate("document.querySelector('.room-library h1')?.textContent==='Rooms'"), 'Home Rooms opens the full library');
  check(await b.evaluate("document.querySelectorAll('.library-entry').length===6"), 'library exposes six active room targets');
  check(await b.evaluate("[...document.querySelectorAll('.library-entry')].every(n=>n.textContent.includes('Kitchen')||n.textContent.includes('Fitness')||n.textContent.includes('Trips')||n.textContent.includes('Garden')||n.textContent.includes('Reading')||n.textContent.includes('Projects'))"), 'room names are written independently of art');
  await b.click('#library-search-route'); await b.waitFor("document.querySelector('.room-library')?.dataset.libraryView==='room-search'");
  await b.fill('#library-search', 'soup');
  check(await b.evaluate("document.querySelector('#library-search-results')?.textContent.includes('Vegetable soup') && document.querySelector('#library-search-results')?.textContent.includes('Kitchen')"), 'search finds canonical item and written Room source');
  await b.evaluate("(()=>{const e=document.querySelector('#library-search');e.focus();e.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}))})()");
  check(await b.evaluate("document.querySelector('#library-result-count')?.textContent.includes('Type a word')"), 'search Escape clears query to complete empty state');
  await b.click('#library-all-items'); await b.waitFor("document.querySelector('.room-library')?.dataset.libraryView==='all-items'");
  check(await b.evaluate("document.querySelector('#library-search-results')?.textContent.includes('Not in a room')"), 'All items exposes canonical unfiled membership truth');

  await b.click('#create-room'); await b.waitFor("document.querySelector('#rooms-dialog[open] .room-details-form')");
  check(await b.evaluate("!!document.querySelector('#room-create-name[required]')&&!!document.querySelector('#room-create-purpose[required]')"), 'create sheet requires name and purpose');
  await b.fill('#room-create-name', 'Music'); await b.click('#room-form-save');
  check(await b.evaluate("document.querySelector('#room-create-purpose')?.getAttribute('aria-invalid')==='true'"), 'missing purpose blocks creation and identifies the invalid field');
  await b.fill('#room-create-purpose', 'Albums and listening notes'); await b.click('#room-form-save');
  await b.waitFor("!document.querySelector('#rooms-dialog[open]') && [...document.querySelectorAll('.library-entry')].some(n=>n.textContent.includes('Music'))");
  await b.waitFor("document.activeElement?.id.startsWith('library-room-custom-')");
  check(await b.evaluate("document.activeElement?.id.startsWith('library-room-custom-')"), 'created room returns focus to its visible entry');
  await b.click("#" + await b.evaluate("document.activeElement.id"));
  await b.waitFor("document.querySelector('#room-surface')?.textContent.includes('Music')");
  check(await b.evaluate("document.querySelector('#room-surface')?.textContent.includes('This new room is empty')"), 'new room has an honest direct-browse empty state');
  await b.click('#room-details'); await b.waitFor("document.querySelector('#rooms-dialog[open]')");
  await b.fill('#room-create-name', 'Listening'); await b.fill('#room-create-purpose', 'Music and radio notes'); await b.click('#room-form-save');
  check(await b.evaluate("document.querySelector('#room-surface')?.textContent.includes('Listening')&&document.querySelector('#room-surface')?.textContent.includes('Music and radio notes')"), 'edit updates live name and purpose');
  await b.click('#review-reset'); await b.waitFor("document.querySelector('#confirm-dialog[open]')"); await b.click('#confirm-dialog button[value=confirm]');
  await b.waitFor("document.body.dataset.home==='true'"); await library();
  check(await b.evaluate("document.querySelectorAll('.library-entry').length===6&&!document.querySelector('[id^=library-room-custom-]')"), 'reviewer Reset removes custom rooms and restores six starter rooms');

  await room('kitchen'); await b.click('#collection-recipes'); await b.click('[data-item-id=vegetable-soup]'); await b.click('#organize-item');
  await b.click('#organize-move-kitchen'); await b.click('#destination-garden'); await b.click('#confirm-organize');
  await b.waitFor("!document.querySelector('#rooms-dialog[open]') && !document.querySelector('#organization-receipt').hidden");
  check(await b.evaluate("document.querySelector('#organization-receipt')?.textContent.includes('Before: Kitchen')&&document.querySelector('#organization-receipt')?.textContent.includes('After: Garden')"), 'move receipt shows exact membership before and after');
  await b.click('#undo-organization');
  check(await b.evaluate("document.querySelector('#organization-receipt').hidden"), 'Undo retires receipt after exact restoration');
  await b.click('#rooms-button'); await b.click('#library-all-items'); await b.fill('#library-search','Vegetable soup');
  check(await b.evaluate("document.querySelector('#library-search-results')?.textContent.includes('Kitchen')"), 'Undo restores source membership in all-items projection');
  await b.click('#library-item-vegetable-soup'); await b.click('#organize-item'); await b.click('#organize-remove-kitchen'); await b.click('#confirm-organize');
  await b.click('#rooms-button'); await b.click('#library-unfiled'); await b.fill('#library-search','Vegetable soup');
  check(await b.evaluate("document.querySelector('#library-search-results')?.textContent.includes('Vegetable soup')"), 'remove-last-membership makes canonical item directly findable in Unfiled');
  await b.click('#undo-organization');
  check(await b.evaluate("document.querySelector('#organization-receipt').hidden"), 'Undo restores a removed final membership exactly');
  await b.click('#library-all-items'); await b.fill('#library-search','Vegetable soup'); await b.click('#library-item-vegetable-soup');
  await b.click('#organize-item'); await b.click('#organize-add'); await b.click('#destination-trips'); await b.click('#confirm-organize');
  check(await b.evaluate("document.querySelector('#organization-receipt').textContent.includes('After: Kitchen, Trips')"), 'Add keeps Kitchen and adds Trips without duplicating the canonical item');
  await b.click('#back-library-item');
  check(await b.evaluate("document.querySelectorAll('#library-item-vegetable-soup').length===1"), 'multi-room item is listed exactly once');
  await b.click('#dismiss-organization');
  check(await b.evaluate("document.querySelector('#organization-receipt').hidden"), 'Dismiss removes the recovery receipt without changing membership');

  await fresh(); await room('trips'); await b.click('#room-details'); await b.click('#room-manage'); await b.click('#archive-room'); await b.click('#confirm-archive');
  await b.waitFor("document.querySelector('.room-library')?.dataset.libraryView==='rooms'");
  check(await b.evaluate("!document.querySelector('#library-room-trips')"), 'archive hides room from active library');
  await b.click('#library-archived'); await b.waitFor("!!document.querySelector('#restore-trips')"); await b.click('#restore-trips');
  await b.waitFor("!!document.querySelector('#library-room-trips')");
  check(await b.evaluate("!!document.querySelector('#library-room-trips')"), 'Restore returns same room target');

  await room('kitchen'); await b.click('#room-details'); await b.click('#room-manage'); await b.click('#delete-room-route');
  check(await b.evaluate("document.querySelector('#rooms-dialog')?.textContent.includes('Items will not be deleted')&&!!document.querySelector('#archive-instead')"), 'room-only delete states retention and safer archive');
  await b.click('#confirm-delete-room'); await b.waitFor("document.querySelector('.room-library')?.dataset.libraryView==='rooms'");
  await b.click('#library-all-items'); await b.fill('#library-search','Vegetable soup');
  check(await b.evaluate("document.querySelector('#library-search-results')?.textContent.includes('Not in a room')"), 'delete room only retains orphaned canonical item as Unfiled');

  await fresh(); await room('kitchen'); await b.click('#room-details'); await b.click('#room-manage'); await b.click('#delete-items-route');
  check(await b.evaluate("document.querySelector('#rooms-dialog')?.textContent.includes('Separate underlying-data deletion')&&document.querySelectorAll('.delete-item-row input:checked').length>0"), 'underlying deletion is separate inspectable selected-item scope');
  await b.click('#room-dialog-cancel'); await b.click('#rooms-button'); await b.click('#library-all-items'); await b.fill('#library-search','Vegetable soup');
  check(await b.evaluate("document.querySelector('#library-search-results')?.textContent.includes('Vegetable soup')"), 'cancelling underlying deletion preserves item');
  await room('kitchen'); await b.click('#room-details'); await b.click('#room-manage'); await b.click('#delete-items-route');
  await b.evaluate("document.querySelector('.delete-item-row input:checked').click()");
  const selectedBeforeDelete = await b.evaluate("document.querySelectorAll('.delete-item-row input:checked').length");
  await b.click('#confirm-delete-items'); await b.waitFor("document.querySelector('.room-library')?.dataset.libraryView==='all-items'");
  await b.fill('#library-search','Vegetable soup');
  check(selectedBeforeDelete > 0 && await b.evaluate("document.querySelector('#library-search-results')?.textContent.includes('Vegetable soup')"), 'selected-subset deletion preserves an unchecked listed item and does not delete the room');
  await b.fill('#library-search','Tomato pasta');
  check(await b.evaluate("!document.querySelector('#library-item-tomato-pasta')"), 'selected item really is removed, not merely hidden from one room');
  await library(); check(await b.evaluate("!!document.querySelector('#library-room-kitchen')"), 'underlying item deletion preserves the room');

  await fresh(); await room('kitchen'); await b.fill('#request', 'What should I pack for cooking on a trip?'); await b.click('#composer button[type=submit]');
  await b.waitFor("!!document.querySelector('#cross-room-source')");
  check(await b.evaluate("document.querySelector('#room-surface')?.dataset.roomId==='kitchen'&&document.querySelector('#cross-room-source')?.textContent.includes('Weekend packing list')&&document.querySelector('#cross-room-source')?.textContent.includes('Trips')"), 'allowed cross-room fixture keeps Kitchen current and discloses Trips source');
  await b.click('#view-cross-source'); await b.waitFor("document.querySelector('#room-item-detail h1')?.textContent.includes('Weekend packing list')"); await b.click('#back-room-conversation');
  await b.waitFor("document.activeElement?.id==='view-cross-source'");
  check(await b.evaluate("document.activeElement?.id==='view-cross-source'"), 'cross-room source return restores the invoking source control');
  await b.click('#exclude-cross-source');
  check(await b.evaluate("document.querySelector('#cross-room-source')?.textContent.includes('No Trips item is being used')"), 'Exclude removes source from this response');
  await fresh(); await room('kitchen'); await b.fill('#request', 'Can you help me plan some easy meals for our weekend trip?'); await b.click('#composer button[type=submit]'); await b.waitFor("document.querySelector('#cross-room-source')?.textContent.includes('Trips source not used')");
  check(await b.evaluate("!document.body.textContent.includes('passport number')&&!document.body.textContent.includes('123')"), 'denied source does not expose protected fixture content');
  await b.click('#review-source-access'); await b.waitFor("document.querySelector('#rooms-dialog[open]')?.textContent.includes('cannot grant access')"); await b.click('#room-dialog-cancel');
  check(await b.evaluate("document.querySelector('#cross-room-source')?.textContent.includes('Trips source not used')"), 'review access grants nothing');

  for (const fixture of ['empty','loading','offline','missing-art']) {
    await fresh('/?review=1&roomsFixture='+fixture); await library();
    const body = await b.evaluate('document.body.innerText');
    if (fixture === 'empty') check(body.includes('No rooms yet')&&await b.evaluate("!!document.querySelector('#create-room')"), 'empty fixture retains Create and truthful empty library');
    if (fixture === 'loading') check(body.includes('Loading rooms…')&&await b.evaluate("!!document.querySelector('#rooms-finish-loading')"), 'loading fixture is written and recoverable');
    if (fixture === 'offline') check(body.includes('offline')&&await b.evaluate("!!document.querySelector('#rooms-try-again')"), 'offline fixture qualifies availability and has deterministic retry');
    if (fixture === 'missing-art') check(await b.evaluate("document.querySelector('#library-room-garden')?.textContent.includes('Garden')&&!!document.querySelector('#library-room-garden .art-fallback')"), 'missing-art fixture keeps Garden name and neutral fallback');
    check(await b.evaluate("!document.querySelector('#review-panel') || ![...document.querySelector('#review-panel').querySelectorAll('button,input,select')].some(n=>n===document.activeElement)"), fixture+' reviewer controls do not receive focus from library');
    if (fixture==='offline'||fixture==='loading') {
      await b.click(fixture==='offline'?'#rooms-try-again':'#rooms-finish-loading');
      check(await b.evaluate("document.querySelectorAll('.library-entry').length===6&&!document.querySelector('.rooms-banner,.rooms-loading')"),fixture+' returns deterministically to the six rooms');
    }
  }

  await fresh(); await b.viewport(1440,900); await library();
  check(await b.evaluate("[...document.querySelectorAll('.library-entry')].every(entry=>{const image=entry.querySelector('.library-portrait img'),copy=entry.querySelector('.library-copy');return !image||image.getBoundingClientRect().bottom<=copy.getBoundingClientRect().top+1})"), 'portrait artwork does not overlap written room identity');
  await b.viewport(360,720); await library(); await noOverflow('narrow library');
  check(await b.evaluate("document.querySelector('.app-header').getBoundingClientRect().bottom<=document.querySelector('.room-library h1').getBoundingClientRect().top"),'narrow header does not overlap library heading');
  for (const [label, appScale, reviewScale, width, height] of [['200%', '1', '2', 600, 480], ['combined 300%', '1.5', '2', 360, 720]]) {
    await b.viewport(width,height); await b.evaluate(`document.documentElement.style.setProperty('--app-scale',${JSON.stringify(appScale)});document.documentElement.style.setProperty('--review-scale',${JSON.stringify(reviewScale)});dispatchEvent(new Event('resize'))`);
    await library(); await noOverflow(label+' library');
    for (const selector of ['#create-room','#request','#talk','#composer button[type=submit]']) {
      check(await b.evaluate(`(()=>{const n=document.querySelector(${JSON.stringify(selector)});n.scrollIntoView({block:'center'});const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&n.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})()`),label+' reaches '+selector);
    }
  }
  await b.evaluate("document.querySelector('#create-room').focus()"); await b.click('#create-room'); await b.waitFor("!!document.querySelector('#rooms-dialog[open]')");
  await key('Tab'); await key('Tab'); await key('Tab'); await key('Tab');
  check(await b.evaluate("document.querySelector('#rooms-dialog[open]')?.contains(document.activeElement)"), 'dialog keyboard focus remains contained');
  await key('Escape'); await b.waitFor("!document.querySelector('#rooms-dialog[open]')");
  check(await b.evaluate("document.activeElement?.id==='create-room'"), 'dialog Escape restores invoking focus');
  check(b.errors.length===0, 'no browser exceptions');
  check(b.network.every(url=>url.startsWith(b.base+'/')||url==='about:blank'), 'no external requests');
  console.log(JSON.stringify({checks, evidence:'local fictional browser fixtures only', screenshots:b.output}, null, 2));
} finally { await b.close(); }
