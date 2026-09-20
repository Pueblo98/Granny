// Browser contract for the local support destinations.  It exercises only
// fictional, tab-local fixtures; it never grants access or calls an external app.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {browser} from './browser-driver.mjs';

const b = await browser();
let checks = 0;
const failures = [];
const check = (value, label) => { checks++; if (!value) failures.push(label); };
const click = selector => b.click(selector);
const text = () => b.evaluate('document.body.innerText');
const menu = async () => { await click('#menu-button'); await b.waitFor('document.querySelector("#menu").open'); };
const menuItem = async name => { await menu(); await click('[data-menu="' + name + '"]'); };
const button = (label, within = 'body') => b.evaluate(`(() => {
  const target = [...document.querySelectorAll(${JSON.stringify(within)} + ' button')]
    .find(item => item.textContent.trim() === ${JSON.stringify(label)});
  if (!target || target.disabled) throw Error('Missing enabled button: ' + ${JSON.stringify(label)});
  target.focus(); target.click();
})()`);
const key = async (key, shiftKey = false) => {
  const code = {Escape: 27, Tab: 9}[key];
  await b.cdp('Input.dispatchKeyEvent', {type: 'keyDown', key, code: key, windowsVirtualKeyCode: code, shiftKey});
  await b.cdp('Input.dispatchKeyEvent', {type: 'keyUp', key, code: key, windowsVirtualKeyCode: code, shiftKey});
};
const heading = value => b.waitFor('document.querySelector("#support-heading")?.textContent === ' + JSON.stringify(value));
const visible = selector => b.evaluate(`(() => {
  const e = document.querySelector(${JSON.stringify(selector)});
  if (!e || e.hidden || !e.getClientRects().length) return false;
  const r = e.getBoundingClientRect(), x = Math.max(0, Math.min(innerWidth - 1, (r.left + r.right) / 2));
  const y = Math.max(0, Math.min(innerHeight - 1, (r.top + r.bottom) / 2));
  return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && e.contains(document.elementFromPoint(x, y));
})()`);
const reach = async (selector, label) => {
  await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'})`);
  await b.waitFor(`(() => { const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })()`);
  check(await visible(selector), label);
};
const geometry = async (label, selector) => {
  const result = await b.evaluate(`(() => ({width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
    clipped:[...document.querySelectorAll('#support-content button, #support-content input')]
      .filter(e=>!e.hidden && e.getClientRects().length).map(e=>({id:e.id,r:e.getBoundingClientRect()}))
      .filter(x=>x.r.left < 0 || x.r.right > innerWidth)}))()`);
  check(result.scrollWidth <= result.width + 1, label + ' has no page-level horizontal overflow');
  check(!result.clipped.length, label + ' has no horizontally clipped controls: ' + JSON.stringify(result.clipped));
  await reach(selector, label + ' has a reachable escape or primary control');
};

try {
  await b.viewport(840, 900);
  await b.navigate('/');

  // The Menu is a real modal, not merely a visually overlaid action list.
  await menu();
  check(await b.evaluate(`(() => { const m=document.querySelector('#menu'); return m.open && m.getAttribute('aria-labelledby')==='menu-heading' && document.activeElement.id==='menu-heading' && document.querySelector('#menu-button').getAttribute('aria-expanded')==='true'; })()`), 'Menu opens as labelled modal and moves focus to its heading');
  await b.evaluate('document.querySelector("#menu button:last-child").focus()');
  await key('Tab');
  check(await b.evaluate('document.querySelector("#menu").contains(document.activeElement)'), 'Menu Tab remains contained within the modal');
  await key('Escape');
  await b.waitFor('!document.querySelector("#menu").open');
  check(await b.evaluate('document.activeElement.id === "menu-button" && document.querySelector("#menu-button").getAttribute("aria-expanded") === "false"'), 'Menu Escape returns focus to its invoking control');

  // A destination opened from a Room must preserve the room as its origin.
  await click('#open-kitchen');
  await b.waitFor('document.querySelector("#room-surface")?.dataset.roomId === "kitchen"');
  await menuItem('settings'); await heading('Settings');
  await click('#support-back');
  await b.waitFor('document.querySelector("#room-surface")?.dataset.roomId === "kitchen"');
  check(await b.evaluate('document.querySelector("#support-content").hidden && !document.querySelector("#room-content").hidden'), 'Settings Back restores Kitchen rather than Home');
  await menu();
  await b.evaluate('history.back()');
  await b.waitFor('!document.querySelector("#menu").open');
  check(await b.evaluate('document.activeElement.id === "menu-button" && document.querySelector("#room-surface")?.dataset.roomId === "kitchen"'), 'Browser Back closes Menu and restores the Room origin');

  // Accessibility previews before application, restores a staged preview, and
  // explicitly confines all changes to Granny.
  await menuItem('text'); await heading('Accessibility');
  await click('#pref-scale-13');
  check(await b.evaluate('document.querySelector("#pref-scale-13").getAttribute("aria-pressed") === "true" && document.querySelector("#support-content").innerText.includes("Current: Normal")'), 'Accessibility stages Large while retaining the applied Normal value');
  await click('#apply-preferences');
  check((await text()).includes('Choices applied to Granny only.') && await b.evaluate('document.querySelector("#support-content").innerText.includes("Current: Large")'), 'Accessibility applies the explicit preview only to Granny');
  await click('#pref-scale-15'); await click('#restore-preferences');
  check(await b.evaluate('document.querySelector("#pref-scale-13").getAttribute("aria-pressed") === "true" && document.querySelector("#support-content").innerText.includes("Preview restored to your last applied choices.")'), 'Restore abandons an un-applied accessibility preview');

  // Help is non-destructive: an unfinished typed request remains exact.
  await click('#support-back');
  await b.waitFor('document.querySelector("#room-surface")?.dataset.roomId === "kitchen"');
  await b.fill('#request', 'Keep this exact unfinished request.');
  await menuItem('help'); await heading('What can I ask?');
  check((await text()).includes('You can always type. Talk is optional.'), 'Help states the typed/Talk choice without requesting access');
  await click('#help-ask');
  await b.waitFor('document.querySelector("#request").getClientRects().length');
  await b.waitFor('document.activeElement.id === "request"');
  check(await b.evaluate('document.querySelector("#request").value === "Keep this exact unfinished request." && document.activeElement.id === "request"'), 'Help returns to the retained draft and typing focus');

  // New conversation scope is explicit and cancellation cannot clear data.
  await menuItem('new');
  await b.waitFor('document.querySelector("#confirm-dialog").open');
  check((await text()).includes('Rooms and saved items') && (await text()).includes('Accessibility preferences') && (await text()).includes('Minimal task history') && (await text()).includes('Nothing is deleted from another app.'), 'New conversation names retained scope and external boundary');
  await click('#confirm-dialog [value=cancel]');
  await b.waitFor('!document.querySelector("#confirm-dialog").open');
  check(await b.evaluate('document.querySelector("#request").value === "Keep this exact unfinished request."'), 'Cancelling new conversation preserves unfinished input');
  const roomCountBeforeNew = await b.evaluate('document.querySelectorAll("#room-list .room-entry").length');
  await menuItem('new'); await b.waitFor('document.querySelector("#confirm-dialog").open');
  await click('#confirm-dialog [value=confirm]');
  await b.waitFor('document.querySelector("#request").value === ""');
  check(await b.evaluate('document.querySelector("#request").value === ""'), 'Confirming new conversation clears the composer without changing its retained scope');
  check(await b.evaluate(`parseFloat(getComputedStyle(document.body).fontSize) > 22 &&
    document.querySelectorAll('#room-list .room-entry').length === ${roomCountBeforeNew}`), 'New conversation preserves applied accessibility preferences and room count');
  await click('#menu-button');
  const menuAfterNew = await b.evaluate('document.querySelector("#menu").open');
  check(menuAfterNew, 'New conversation leaves Menu available for its preserved Today history');
  if (menuAfterNew) {
    await click('[data-menu=history]'); await heading('Today');
    check(await b.evaluate('document.querySelectorAll("[id^=history-]").length === 3'), 'New conversation preserves minimal Today history');
    await click('#support-back');
  } else await b.navigate('/');

  // Search returns only four known local soup matches, and makes no external
  // search when it has none.
  await menuItem('search'); await heading('Search Granny');
  await b.fill('#support-query', 'soup');
  await b.waitFor('document.querySelectorAll("[id^=search-result-]").length === 4');
  check(await b.evaluate(`(() => { const r=[...document.querySelectorAll('[id^=search-result-]')]; return r.length===4 && document.querySelector('#support-content').innerText.includes('local matches') && document.body.innerText.includes('Search does not look inside external apps.'); })()`), 'Soup search exposes exactly four admitted local results with its no-external boundary');
  await click('#search-result-vegetable-soup');
  await b.waitFor('!document.querySelector("#search-origin-return").hidden && !!document.querySelector("#room-content").getClientRects().length');
  check(await b.evaluate('document.querySelector("#room-content h1")?.textContent === "Vegetable soup"'), 'Search opens the existing owning Room item rather than a duplicate support preview');
  await click('#search-origin-return'); await heading('Search Granny');
  await b.waitFor('document.activeElement.id === "search-result-vegetable-soup"');
  check(await b.evaluate('document.querySelector("#support-query").value === "soup" && document.activeElement.id === "search-result-vegetable-soup"'), 'Search return restores the exact query, result focus, and origin place');
  await b.fill('#support-query', 'not-a-fixture');
  await b.waitFor('document.querySelector("#support-results h2")?.textContent === "No saved matches"');
  check((await text()).includes('It does not search an external app automatically.'), 'No-result search stays local and does not imply an external lookup');
  await b.fill('#support-query', 'train tickets');
  await b.waitFor('document.querySelector("#support-results h2")?.textContent === "No saved matches"');
  await click('#search-ask'); await b.waitFor('document.querySelector("#request").getClientRects().length');
  await b.waitFor('document.activeElement.id === "request"');
  check(await b.evaluate('document.querySelector("#request").value === "train tickets" && !document.querySelector("#current-task")'), 'Ask Granny from Train tickets drafts locally and starts no execution');

  // Today keeps summaries content-minimal; canceling Clear keeps all records.
  await menuItem('history'); await heading('Today');
  check(await b.evaluate('document.querySelectorAll("[id^=history-]").length === 3 && !document.querySelector("#support-content").innerText.includes("I’ll call")'), 'Today contains three minimal summaries and no message body');
  check(await b.evaluate('!!document.querySelector("#conversation-sample-soup-substitution") && !!document.querySelector("#conversation-sample-garden-basil")'), 'Today exposes separately addressable fictional conversation fixtures');
  await click('#conversation-sample-soup-substitution'); await heading('Soup without tomatoes');
  check(await b.evaluate('document.querySelector(".support-transcript")?.innerText.includes("Can I make the vegetable soup without tomatoes?") && document.querySelector(".support-source-receipt")?.innerText.includes("Vegetable soup · Kitchen · Recipes")'), 'opening the soup row shows its own transcript and answer-bound source receipt');
  await click('#support-back'); await heading('Today');
  await click('#conversation-sample-garden-basil'); await heading('Basil plant help');
  check(await b.evaluate('document.querySelector(".support-transcript")?.innerText.includes("Why are the leaves on my basil drooping?") && !document.querySelector(".support-transcript")?.innerText.includes("without tomatoes")'), 'opening a different row shows a distinct transcript instead of returning to the prior chat');
  await click('#support-back'); await heading('Today');
  await click('#history-today-draft-opened'); await heading('Draft opened'); await click('#support-back'); await heading('Today');
  await click('#clear-history'); await b.waitFor('document.querySelector("#confirm-dialog").open'); await click('#confirm-dialog [value=cancel]');
  await b.waitFor('!document.querySelector("#confirm-dialog").open');
  check(await b.evaluate('document.querySelectorAll("[id^=history-]").length === 3'), 'Cancelling Clear history preserves every Today summary');
  await click('#clear-history'); await b.waitFor('document.querySelector("#confirm-dialog").open'); await click('#confirm-dialog [value=confirm]');
  await b.waitFor('document.querySelectorAll("[id^=history-]").length === 0');
  check(await b.evaluate('document.querySelectorAll("[id^=history-]").length === 0 && document.querySelectorAll("[id^=conversation-sample-]").length === 0 && document.querySelector("#support-content").innerText.includes("History cleared.")'), 'Confirming Clear history removes prior conversations and leaves an explicit empty Today state');
  await b.navigate('/?supportFixture=history-error'); await menuItem('history'); await heading('Today');
  check(await b.evaluate('document.querySelector("#support-content").innerText.includes("Task history could not be read. No entries have been invented.") && !!document.querySelector("#history-retry")'), 'History error fixture does not invent entries and provides bounded retry');

  // Privacy reset is confirmation-gated: cancel changes nothing; confirmation
  // returns to the baseline local fixture without claiming external deletion.
  await click('#support-back'); await menuItem('privacy'); await heading('Privacy and data');
  await click('#privacy-delete'); await b.waitFor('document.querySelector("#confirm-dialog").open');
  check((await text()).includes('Connected runtime drafts and provider-held data are not deleted.'), 'Privacy reset names the external-data boundary');
  await click('#confirm-dialog [value=cancel]'); await b.waitFor('!document.querySelector("#confirm-dialog").open');
  check(await b.evaluate('document.querySelector("#support-heading")?.textContent === "Privacy and data"'), 'Cancelling privacy reset preserves the privacy destination');
  await click('#privacy-delete'); await b.waitFor('document.querySelector("#confirm-dialog").open'); await click('#confirm-dialog [value=confirm]');
  await b.waitFor('document.querySelector("#support-content").hidden && document.querySelector("#request").value === "" && parseFloat(getComputedStyle(document.body).fontSize) === 22');
  check(await b.evaluate('document.querySelector("#support-content").hidden && document.querySelector("#request").value === "" && parseFloat(getComputedStyle(document.body).fontSize) === 22'), 'Confirming privacy reset clears the local fixture and restores baseline scale');

  // Three onboarding steps disclose their limits. Reviewing an access scope
  // cannot grant it; skip returns to a usable composition without storage.
  await b.navigate('/?onboarding=1'); await heading('A simpler place to ask for help');
  check((await text()).includes('Step 1 of 3') && (await text()).includes('requires no account'), 'Onboarding step 1 states fictional/account-free setup');
  await click('#setup-start'); await heading('Make Granny comfortable to use'); await click('#setup-scale-15');
  await click('#setup-next'); await heading('Choose what Granny can use');
  check((await text()).includes('Step 3 of 3') && (await text()).includes('Android owns permission decisions') && await b.evaluate(`(() =>
    [['setup-mic','Not enabled'],['setup-screen','Not enabled'],['setup-cloud','Off']].every(([id, state]) => document.querySelector('#' + id)?.innerText.includes(state)))()`), 'Onboarding step 3 separates Android authority and leaves every access scope disabled');
  await click('#setup-mic'); await b.waitFor('document.querySelector("#confirm-dialog").open');
  check((await text()).includes('no audio is captured, kept or sent') && (await text()).includes('Review grants nothing'), 'Microphone disclosure is candid and non-authorizing');
  await click('#confirm-dialog [value=confirm]'); await b.waitFor('document.querySelector("#support-heading")?.textContent === "Choose what Granny can use"');
  await b.waitFor('document.querySelector("#support-content").innerText.includes("Microphone remains not enabled.")');
  check((await text()).includes('Microphone remains not enabled.'), 'Continuing without access leaves microphone disabled');
  await click('#setup-complete'); await b.waitFor('document.querySelector("#request").getClientRects().length');
  await b.waitFor('document.activeElement.id === "request"');
  check(await b.evaluate('document.body.dataset.support === "" && document.activeElement.id === "request" && parseFloat(getComputedStyle(document.body).fontSize) === 33'), 'Non-consent onboarding completion retains applied step-2 preferences and returns to typing');
  await b.navigate('/?onboarding=1'); await heading('A simpler place to ask for help');
  await click('#setup-skip'); await b.waitFor('document.querySelector("#request").getClientRects().length');
  await b.waitFor('document.activeElement.id === "request"');
  check(await b.evaluate('document.body.dataset.support === "" && document.activeElement.id === "request"'), 'Onboarding Skip-for-now also returns to ordinary typed conversation');

  // Back retains a staged setup choice, while the explicit step-2 Skip
  // abandons it and leaves the default scale applied.
  await b.navigate('/?onboarding=1'); await click('#setup-start'); await heading('Make Granny comfortable to use');
  await click('#setup-scale-15'); await click('#setup-back'); await heading('A simpler place to ask for help');
  await click('#setup-start'); await heading('Make Granny comfortable to use');
  check(await b.evaluate('document.querySelector("#setup-scale-15").getAttribute("aria-pressed") === "true"'), 'Onboarding Back retains its staged accessibility choice');
  await click('#setup-skip'); await b.waitFor('document.querySelector("#request").getClientRects().length');
  check(await b.evaluate('parseFloat(getComputedStyle(document.body).fontSize) === 22'), 'Skipping onboarding at step 2 leaves default scale applied');

  // A manual external return is an unknown send outcome. It does not expose a
  // retry, and Done dismisses the evidence rather than converting it to success.
  await b.fill('#request', 'Tell David Brother: I’ll call after dinner via Example Messages');
  await click('#composer button[type=submit]');
  await b.waitFor('document.querySelector("#current-task")?.dataset.stage === "preview"');
  check(await b.evaluate('document.querySelector("#current-task").innerText.includes("David") && document.querySelector("#current-task").innerText.includes("Brother") && document.querySelector("#current-task").innerText.includes("Example Messages")'), 'Exact David/Brother/Example Messages preview is shown before preparing a draft');
  await click('[data-action=approve]');
  await b.waitFor('document.querySelector("#current-task")?.dataset.surface === "prepared"');
  await click('#surface-return');
  await b.waitFor('document.querySelector("#current-task")?.dataset.surface === "external-return"');
  check(await b.evaluate(`(() => { const t=document.querySelector('#current-task'); return t.innerText.includes('Send status unknown') &&
    t.innerText.includes('Granny will not retry automatically') && !!document.querySelector('#surface-review') &&
    ![...t.querySelectorAll('button')].some(b=>/retry|approve|send/i.test(b.textContent)); })()`), 'External return stays Unknown with review but no retry or resend control');
  await click('#surface-review');
  check(await b.evaluate('document.querySelector("#current-task")?.dataset.surface === "external-return" && !document.querySelector("[data-action=approve]")'), 'Reviewing external return does not repeat an action');
  await click('#surface-done'); await b.waitFor('!document.querySelector("#current-task")');
  check(await b.evaluate('!document.querySelector("#current-task")'), 'External-return Done dismisses the unknown evidence');

  // Support destinations remain usable under narrow, short and 300% combined
  // text conditions; each is tested with a real escape/primary target.
  await b.navigate('/?review=1');
  await b.evaluate(`(() => { const e=document.querySelector('#review-scale'); e.value='2'; e.dispatchEvent(new Event('change',{bubbles:true})); })()`);
  await menuItem('text'); await heading('Accessibility'); await click('#pref-scale-15'); await click('#apply-preferences');
  check(await b.evaluate('parseFloat(getComputedStyle(document.body).fontSize) === 66'), 'Applied 150% accessibility with 200% review scale produces a real 300% text size');
  await geometry('300% Accessibility baseline', '#pref-scale-15'); await click('#support-back');
  for (const [width, height] of [[360, 480], [840, 320]]) {
    await b.viewport(width, height);
    await menuItem('text'); await heading('Accessibility'); await geometry('300% Accessibility '+width+'x'+height, '#pref-scale-15');
    await click('#support-back');
    await menuItem('history'); await heading('Today'); await geometry('300% Today '+width+'x'+height, '#support-back');
    await click('#support-back');
    await menuItem('search'); await heading('Search Granny'); await geometry('300% Search '+width+'x'+height, '#search-menu');
    await click('#search-menu'); await b.waitFor('document.querySelector("#menu").open'); await click('[data-menu=return]');
  }

  check(await b.evaluate('localStorage.length === 0 && sessionStorage.length === 0'), 'support surfaces add no web storage');
  check(await b.evaluate('(async () => !(await indexedDB.databases()).length)()'), 'support surfaces add no IndexedDB');
  check(await b.evaluate('(async () => !(await navigator.serviceWorker.getRegistrations()).length)()'), 'support surfaces add no service worker');
  check(await b.evaluate('(async () => !(await caches.keys()).length)()'), 'support surfaces add no CacheStorage');
  check(!b.errors.length, 'support surfaces cause no browser exceptions: ' + JSON.stringify(b.errors));
  check(b.network.every(url => url.startsWith(b.base + '/') || url === 'about:blank'), 'support surfaces make no external requests');
  const result = {checks, failures, errors: b.errors, network: [...new Set(b.network)], screenshots: b.output};
  await writeFile(join(b.output, 'support-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  assert.equal(failures.length, 0, failures.join('\n'));
} catch (error) {
  await b.screenshot('support-failure');
  console.error('Browser artifacts: ' + b.output);
  throw error;
} finally {
  await b.close();
}
