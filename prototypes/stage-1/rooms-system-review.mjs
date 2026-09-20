// Temporary local screenshot review for the 17 fictional Rooms reference families.
// It writes only to browser-driver's temporary output directory.
import {browser} from './browser-driver.mjs';
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const b = await browser();
const captures = [], failures = [];
const settle = async () => {
  await b.waitFor('[...document.images].every(image => image.complete)');
  await b.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
};
const shot = async name => {
  await settle();
  await b.evaluate('document.activeElement?.blur(); window.scrollTo(0, 0); const review=document.querySelector("#review-panel");if(review)review.hidden=true;');
  if (await b.evaluate('!!document.querySelector("dialog[open]")')) {
    captures.push({name, path: await b.screenshot(name)}); return;
  }
  const {cssContentSize} = await b.cdp('Page.getLayoutMetrics');
  const {data} = await b.cdp('Page.captureScreenshot', {format:'png', captureBeyondViewport:true,
    clip:{x:0,y:0,width:cssContentSize.width,height:cssContentSize.height,scale:1}});
  const path=join(b.output,name+'.png');await writeFile(path,Buffer.from(data,'base64'));
  captures.push({name,path});
};
const reviewPath = fixture => fixture ? '/?review=1&roomsFixture=' + fixture : '/';
const library = async fixture => {
  await b.navigate(reviewPath(fixture));
  await b.click('#rooms-button');
  await b.waitFor('!!document.querySelector(".room-library")');
};
const room = async id => {
  await library();
  await b.click('#library-room-' + id);
  await b.waitFor('document.querySelector("#room-surface")?.dataset.roomId===' + JSON.stringify(id));
};
const manage = async id => {
  await room(id);
  await b.click('#room-details');
  await b.waitFor('document.querySelector("#rooms-dialog[open]")?.textContent.includes("Room details")');
  await b.click('#room-manage');
  await b.waitFor('document.querySelector("#rooms-dialog[open]")?.textContent.includes("Manage")');
};
const sendFixtureQuestion = async kind => {
  const question = await b.evaluate('GrannyRoomFixtures.sourceFixtures[' + JSON.stringify(kind) + '].question');
  await b.fill('#request', question);
  await b.click('#composer button[type=submit]');
  await b.waitFor('!!document.querySelector("#cross-room-source")');
};
const capture = async (name, work) => {
  try {
    await work();
    await shot(name);
  } catch (error) {
    failures.push({name, error: error.message});
  }
};

try {
  await b.viewport(1440, 1000);
  await capture('01-full-rooms-library', async () => library());
  await capture('02-search-all-rooms', async () => {
    await library(); await b.click('#library-search-route'); await b.fill('#library-search', 'soup');
    await b.waitFor('document.querySelectorAll("#library-search-results .library-item-result").length > 0');
  });
  await capture('03-all-items-and-unfiled', async () => {
    await library(); await b.click('#library-all-items');
    await b.waitFor('document.querySelector("[data-library-view=all-items]")');
  });
  await capture('04-create-room', async () => {
    await library(); await b.click('#create-room'); await b.waitFor('!!document.querySelector("#rooms-dialog[open] #room-create-name")');
  });
  await capture('05-rename-and-purpose', async () => {
    await room('kitchen'); await b.click('#room-details');
    await b.waitFor('!!document.querySelector("#rooms-dialog[open] #room-create-purpose")');
  });
  await capture('06-organize-item', async () => {
    await library(); await b.click('#library-all-items'); await b.click('#library-item-vegetable-soup');
    await b.waitFor('!!document.querySelector("#library-item-detail")'); await b.click('#organize-item');
    await b.waitFor('document.querySelector("#rooms-dialog[open]")?.textContent.includes("Organize Vegetable soup")');
  });
  await capture('07-move-item-undo', async () => {
    await library(); await b.click('#library-all-items'); await b.click('#library-item-vegetable-soup');
    await b.click('#organize-item'); await b.click('#organize-move-kitchen'); await b.click('#destination-garden');
    await b.waitFor('!!document.querySelector("#confirm-organize")'); await b.click('#confirm-organize');
    await b.waitFor('!document.querySelector("#rooms-dialog[open]") && !document.querySelector("#organization-receipt").hidden');
  });
  await capture('08-archive-room', async () => {
    await manage('trips'); await b.click('#archive-room');
    await b.waitFor('!!document.querySelector("#confirm-archive")');
  });
  await capture('09-restore-room', async () => {
    await manage('trips'); await b.click('#archive-room'); await b.click('#confirm-archive');
    await b.waitFor('!!document.querySelector("#library-archived")'); await b.click('#library-archived');
    await b.waitFor('!!document.querySelector("#restore-trips")');
  });
  await capture('10-delete-room-only', async () => {
    await manage('kitchen'); await b.click('#delete-room-route');
    await b.waitFor('!!document.querySelector("#confirm-delete-room")');
  });
  await capture('11-delete-underlying-items', async () => {
    await manage('kitchen'); await b.click('#delete-items-route');
    await b.waitFor('!!document.querySelector("#confirm-delete-items")');
  });
  await capture('12-cross-room-source', async () => { await room('kitchen'); await sendFixtureQuestion('allowed'); });
  await capture('13-sensitive-source-denied', async () => { await room('kitchen'); await sendFixtureQuestion('denied'); });
  await capture('14-empty-library', async () => {
    await library('empty'); await b.waitFor('document.body.innerText.includes("No rooms yet")');
  });
  await capture('15-loading', async () => {
    await library('loading'); await b.waitFor('document.body.innerText.includes("Loading rooms")');
  });
  await capture('16-offline', async () => {
    await library('offline'); await b.waitFor('document.body.innerText.includes("offline")');
  });
  await capture('17-missing-artwork', async () => {
    await library('missing-art'); await b.waitFor('!!document.querySelector("#library-room-garden .art-fallback")');
  });

  await capture('18-narrow', async () => { await b.viewport(360, 780); await library(); });
  await capture('19-large-text', async () => {
    await b.viewport(840, 1000); await library();
    await b.evaluate("document.documentElement.style.setProperty('--app-scale','1');document.documentElement.style.setProperty('--review-scale','2');dispatchEvent(new Event('resize'))");
  });
  await capture('20-combined-scale', async () => {
    await b.viewport(600, 1000); await library();
    await b.evaluate("document.documentElement.style.setProperty('--app-scale','1.5');document.documentElement.style.setProperty('--review-scale','2');dispatchEvent(new Event('resize'))");
  });
  await capture('21-short', async () => { await b.viewport(840, 480); await library();await b.click('#create-room'); });
  await capture('22-art-disabled', async () => {
    await b.viewport(1440, 1000); await library();
    await b.evaluate("document.body.dataset.roomArt='hidden'");
  });
  await capture('23-unfiled',async()=>{await library();await b.click('#library-unfiled');});
} finally {
  const report = {output: b.output, captures, failures, browserErrors: b.errors};
  console.log(JSON.stringify(report, null, 2));
  await b.close();
  if (failures.length || b.errors.length) process.exitCode = 1;
}
