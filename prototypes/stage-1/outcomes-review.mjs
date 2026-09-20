// Temporary, local visual review captures for the ten fictional outcome states.
// Outputs live only in browser-driver's temporary directory.
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {browser} from './browser-driver.mjs';

const b = await browser();
const captures = [], failures = [];

async function settle() {
  await b.waitFor('[...document.images].every(image => image.complete)');
  await b.evaluate('new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))');
}
async function shot(name) {
  await settle();
  await b.evaluate('document.activeElement?.blur(); window.scrollTo(0, 0); document.querySelector("#review-panel")?.setAttribute("hidden", "")');
  const {cssContentSize} = await b.cdp('Page.getLayoutMetrics');
  const {data} = await b.cdp('Page.captureScreenshot', {format: 'png', captureBeyondViewport: true,
    clip: {x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1}});
  const path = join(b.output, name + '.png');
  await writeFile(path, Buffer.from(data, 'base64'));
  captures.push({name, path});
}
async function fresh({fault = ''} = {}) {
  await b.navigate('/?review=1');
  await b.viewport(1440, 900);
  await b.evaluate(`(() => {
    const set = (id, value) => { const el = document.querySelector(id); el.value = value;
      el.dispatchEvent(new Event('change', {bubbles: true})); };
    set('#review-delay', '0'); set('#review-fault', ${JSON.stringify(fault)});
  })()`);
}
async function request(text) {
  await b.fill('#request', text);
  await b.click('#composer button[type=submit]');
}
async function waitModule(kind, state) {
  await b.waitFor(`document.querySelector('.outcome-module')?.dataset.outcomeModule === ${JSON.stringify(kind)} && document.querySelector('.outcome-module')?.dataset.outcomeState === ${JSON.stringify(state)}`, 10000);
}
async function approve() {
  await b.waitFor('!!document.querySelector("[data-action=approve]")');
  await b.click('[data-action=approve]');
}
async function messagePreview() {
  await request('Tell David I’ll call after dinner.');
  await b.waitFor('!!document.querySelector("[data-action=approve], [data-choice]")');
  if (await b.evaluate('!!document.querySelector("[data-choice=\\"david-family\\"]")')) {
    await b.click('[data-choice="david-family"]');
  }
  await b.waitFor('!!document.querySelector("[data-action=approve]")');
}
async function bookPhotos() {
  await request('Show photos of Sophie Book club from yesterday');
  await approve(); // The Book club source intentionally keeps its mark-read preview.
  await waitModule('photos', 'found');
}
async function capture(name, work) {
  try { await work(); await shot(name); }
  catch (error) { failures.push({name, error: error.message}); }
}

try {
  await capture('01-photos-found', async () => { await fresh(); await bookPhotos(); });
  await capture('02-photos-no-result', async () => {
    await fresh({fault: 'noPhotos'}); await request('Show photos of Sophie Book club from yesterday'); await approve();
    await waitModule('photos', 'no-result');
  });
  await capture('03-screen-explanation', async () => {
    await fresh(); await request('Explain screen display-settings'); await waitModule('explain', 'explanation');
  });
  await capture('04-screen-guidance', async () => {
    await fresh(); await request('Explain screen display-settings'); await waitModule('explain', 'explanation');
    await b.click('#screen-guidance'); await waitModule('explain', 'guidance');
  });
  await capture('05-message-draft-review', async () => { await fresh(); await messagePreview(); });
  await capture('06-message-prepared-unsent', async () => {
    await fresh(); await messagePreview(); await approve();
    await b.waitFor('document.body.innerText.includes("Prepared — not sent")', 10000);
  });
  await capture('07-media-playing', async () => {
    await fresh(); await request('Play Sinnerman by Nina Simone.'); await waitModule('media', 'playing');
  });
  await capture('08-media-unavailable', async () => {
    await fresh({fault: 'unavailable'}); await request('Play Sinnerman by Nina Simone.'); await waitModule('media', 'unavailable');
  });
  await capture('09-reading-preview', async () => {
    await fresh(); await request('Make Granny’s text larger.'); await waitModule('readability', 'preview');
  });
  await capture('10-reading-applied', async () => {
    await fresh(); await request('Make Granny text larger'); await waitModule('readability', 'preview');
    await b.click('#reading-apply'); await waitModule('readability', 'applied');
  });
  await capture('11-guidance-narrow', async () => {
    await fresh(); await b.viewport(360, 780); await request('Explain screen display-settings');
    await waitModule('explain', 'explanation'); await b.click('#screen-guidance'); await waitModule('explain', 'guidance');
  });
  await capture('12-draft-short-200', async () => {
    await fresh(); await b.viewport(840, 480); await b.evaluate("document.documentElement.style.setProperty('--review-scale','2')");
    await messagePreview();
  });
  await capture('13-reading-preview-300', async () => {
    await fresh(); await b.viewport(600, 900);
    await request('Make Granny text largest'); await waitModule('readability', 'preview');
    await b.click('#reading-apply'); await b.click('#surface-done');
    await b.evaluate("document.querySelector('#review-scale').value='2';document.querySelector('#review-scale').dispatchEvent(new Event('change'))");
    await request('Make Granny text larger'); await waitModule('readability', 'preview');
    await b.waitFor("parseFloat(getComputedStyle(document.body).fontSize)===66");
  });
  await capture('14-kitchen-outcome', async () => {
    await fresh(); await b.click('#open-kitchen'); await b.click('#collection-recipes');
    await request('Play Sinnerman by Nina Simone.'); await waitModule('media', 'playing');
  });
  await capture('15-art-disabled', async () => {
    await fresh(); await bookPhotos();
    await b.evaluate("document.body.dataset.roomArt='off'");
  });
} finally {
  const report = {output: b.output, captures, failures, browserErrors: b.errors};
  console.log(JSON.stringify(report, null, 2));
  await b.close();
  if (failures.length || b.errors.length) process.exitCode = 1;
}
