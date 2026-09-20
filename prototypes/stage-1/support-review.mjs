// Reproducible visual review for the thirteen navigation/support references.
// Uses only the local browser prototype and its deterministic fictional data.
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {browser} from './browser-driver.mjs';

const b = await browser();
const captures = {}, exactChecks = [];
const viewports = [
  ['wide', 1440, 900, false],
  ['narrow', 360, 640, false],
  ['review-200', 840, 600, true]
];

const pause = () => b.evaluate(
  'new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
const select = (selector, value) => b.evaluate(`(() => {
  const element = document.querySelector(${JSON.stringify(selector)});
  if (!element) throw Error('Missing select: ' + ${JSON.stringify(selector)});
  element.value = ${JSON.stringify(value)};
  element.dispatchEvent(new Event('change', {bubbles:true}));
})()`);
const has = text => b.evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`);
const check = async (frame, description, value) => {
  const passed = await value;
  exactChecks.push({frame, description, passed: !!passed});
  if (!passed) throw Error(frame + ': ' + description);
};
const menu = async () => {
  await b.click('#menu-button');
  await b.waitFor('document.querySelector("#menu").open');
};
const menuItem = async item => {
  await menu();
  await b.click('[data-menu="' + item + '"]');
};
const heading = value => b.waitFor(
  'document.querySelector("#support-heading")?.textContent === ' + JSON.stringify(value));

// Keep review artifacts manageable when a narrow or 200% destination grows.
const fullPage = async name => {
  await pause();
  await b.evaluate('document.activeElement?.blur(); window.scrollTo(0, 0)');
  const {cssContentSize} = await b.cdp('Page.getLayoutMetrics');
  const height = Math.min(Math.ceil(cssContentSize.height), 2600);
  const {data} = await b.cdp('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: {x: 0, y: 0, width: Math.ceil(cssContentSize.width), height, scale: 1}
  });
  const path = join(b.output, name + '-full.png');
  await writeFile(path, Buffer.from(data, 'base64'));
  return path;
};
const capture = async (frame, temporary = false) => {
  await pause();
  await b.evaluate('document.activeElement?.blur(); window.scrollTo(0, 0)');
  const key = frame + '-' + current.name;
  captures[key] = {viewport: await b.screenshot(key)};
  if (temporary) captures[key].fullPage = await fullPage(key);
};
let current;
const fresh = async ({review = false, onboarding = false} = {}) => {
  const query = new URLSearchParams();
  const reviewer = review || current?.reviewScale;
  if (reviewer) query.set('review', '1');
  if (onboarding) query.set('onboarding', '1');
  await b.navigate('/' + (query.size ? '?' + query : ''));
  if (reviewer) {
    await select('#review-delay', '0');
    if (current?.reviewScale) await select('#review-scale', '2');
  }
};

async function captureMenu() {
  await fresh(); await menu();
  await check('01-menu', 'modal Menu has its required grouped destinations',
    b.evaluate(`(() => { const t=document.querySelector('#menu').innerText;
      return document.querySelector('#menu').open && ['Today','Search','Rooms','Settings',
        'Accessibility','Privacy and data','What can I ask?','Start a new conversation']
        .every(value => t.includes(value)); })()`));
  await capture('01-menu');
}
async function captureToday() {
  await fresh(); await menuItem('history'); await heading('Today');
  await check('02-today-minimal-history', 'three exact fictional minimal-history rows render',
    b.evaluate(`(() => ['Draft opened','Photos from Sophie','Text size changed']
      .every(value => document.querySelector('#support-content').innerText.includes(value)) &&
      document.querySelectorAll('[id^="history-"]').length === 3)()`));
  await capture('02-today-minimal-history', true);
}
async function captureSettings() {
  await fresh(); await menuItem('settings'); await heading('Settings');
  await check('03-settings-overview', 'five exact Settings categories render',
    b.evaluate(`(() => ['Accessibility','Talk and voice','Privacy and data','Conversation','About Granny']
      .every(value => document.querySelector('#support-content').innerText.includes(value)))()`));
  await capture('03-settings-overview', true);
}
async function capturePrivacy() {
  await fresh(); await menuItem('privacy'); await heading('Privacy and data');
  await check('04-privacy-and-data', 'privacy scope names cloud, Android permissions, history and local data',
    b.evaluate(`(() => ['Cloud processing','Android permissions','Task history','Local Granny data',
      'Helpers do not have access in this version.'].every(value =>
        document.querySelector('#support-content').innerText.includes(value)))()`));
  await capture('04-privacy-and-data', true);
}
async function captureAccessibility() {
  await fresh(); await menuItem('text'); await heading('Accessibility');
  await check('05-accessibility-preferences', 'preference screen exposes written selected states and Apply',
    b.evaluate(`(() => ['Text size','Speech speed','Reduced motion','Captions','Apply changes',
      'Restore previous choices'].every(value => document.querySelector('#support-content').innerText.includes(value)) &&
      document.querySelectorAll('[aria-pressed="true"]').length >= 4)()`));
  await capture('05-accessibility-preferences', true);
}
async function captureHelp() {
  await fresh(); await menuItem('help'); await heading('What can I ask?');
  await check('06-help-what-can-i-ask', 'help keeps typed use and uncertainty guidance explicit',
    b.evaluate(`(() => ['Ask in your own words. You do not need to choose a feature first.',
      'What Granny will tell you','You can always type. Talk is optional.']
      .every(value => document.querySelector('#support-content').innerText.includes(value)))()`));
  await capture('06-help-what-can-i-ask', true);
}
async function captureNewConversation() {
  await fresh(); await b.fill('#request','A fictional unfinished request.'); await menuItem('new');
  await b.waitFor('document.querySelector("#confirm-dialog").open');
  await check('07-new-conversation', 'confirmation names retained scope and external-data boundary',
    b.evaluate(`(() => ['Start a new conversation?','Rooms and saved items','Accessibility preferences',
      'Minimal task history','Nothing is deleted from another app.']
      .every(value => document.querySelector('#confirm-dialog').innerText.includes(value)))()`));
  await capture('07-new-conversation');
}
async function captureExternalReturn() {
  await fresh({review:true});
  await b.fill('#request', 'Tell David I’ll call after dinner.');
  await b.click('#composer button[type=submit]');
  await b.waitFor('document.querySelector("#current-task")?.dataset.stage === "clarify-person"');
  await b.click('[data-focus-key="choice-david-family"]');
  await b.waitFor('document.querySelector("#current-task")?.dataset.stage === "preview"');
  await check('08-return-from-external-app', 'combined direct clarification explicitly selects Brother and Example Messages',
    b.evaluate('document.querySelector("#current-task").innerText.includes("David") && document.querySelector("#current-task").innerText.includes("Brother") && document.querySelector("#current-task").innerText.includes("Example Messages")'));
  await b.click('[data-focus-key="approval"]');
  await b.waitFor('document.querySelector("#current-task")?.dataset.stage === "completed"');
  await b.click('#surface-return');
  await b.waitFor('document.querySelector("[data-surface=external-return]")');
  await check('08-return-from-external-app', 'return exposes the explicit Send status unknown recovery state',
    has('Send status unknown'));
  await capture('08-return-from-external-app', true);
}
async function captureSearch(query, frame, expected) {
  await fresh(); await menuItem('search'); await heading('Search Granny');
  await b.fill('#support-query', query);
  await b.waitFor(expected);
  await check(frame, 'search retains the explicit no-external-app boundary', has('Search does not look inside external apps.'));
  await capture(frame, true);
}
async function captureOnboarding(frame, step) {
  await fresh({onboarding:true}); await heading('A simpler place to ask for help');
  if (step >= 2) { await b.click('#setup-start'); await heading('Make Granny comfortable to use'); }
  if (step >= 3) { await b.click('#setup-next'); await heading('Choose what Granny can use'); }
  const required = step === 1 ? ['Step 1 of 3','Skip for now','requires no account']
    : step === 2 ? ['Step 2 of 3','Text size','How Granny explains','Speech speed']
    : ['Step 3 of 3','Continue without these','Android owns permission decisions'];
  await check(frame, 'onboarding step has exact written progress and controls',
    b.evaluate(`(() => ${JSON.stringify(required)}.every(value =>
      document.querySelector('#support-content').innerText.includes(value)))()`));
  await capture(frame, true);
}

try {
  for (current of viewports) {
    const [name, width, height, reviewScale] = current;
    current = {name, width, height, reviewScale};
    await b.viewport(width, height);
    // `review=1` exposes the existing reviewer text-scale control only for the
    // requested 840px capture; the other two captures remain participant UI.
    if (reviewScale) {
      await fresh({review:true});
      await select('#review-scale', '2');
    }
    await captureMenu();
    await captureToday();
    await captureSettings();
    await capturePrivacy();
    await captureAccessibility();
    await captureHelp();
    await captureNewConversation();
    await captureExternalReturn();
    await captureSearch('soup', '09-global-search-results',
      'document.querySelectorAll("[id^=search-result-]").length === 4');
    await captureSearch('train tickets', '10-global-search-no-results',
      'document.querySelector("#support-results h2")?.textContent === "No saved matches"');
    await captureOnboarding('11-onboarding-welcome', 1);
    await captureOnboarding('12-onboarding-preferences', 2);
    await captureOnboarding('13-onboarding-optional-access', 3);
  }
  if (b.errors.length) throw Error('Browser exceptions: ' + JSON.stringify(b.errors));
  const result = {screenshots: b.output, captures, exactChecks, errors: b.errors,
    network: [...new Set(b.network)]};
  await writeFile(join(b.output, 'support-review-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Browser artifacts: ' + b.output);
  throw error;
} finally {
  await b.close();
}
