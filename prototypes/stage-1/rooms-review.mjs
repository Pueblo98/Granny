// Reproducible local screenshot review; no provider, storage or user profile.
import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {browser} from './browser-driver.mjs';
const b = await browser();
const settle = async () => {
  await b.waitFor("[...document.images].every(image => image.complete)");
  await b.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
};
const shot = async (name, full = false) => {
  await settle();
  await b.evaluate('document.activeElement?.blur();scrollTo(0,0)');
  if (!full) return b.screenshot(name);
  const {cssContentSize} = await b.cdp('Page.getLayoutMetrics');
  const {data} = await b.cdp('Page.captureScreenshot', {format: 'png', captureBeyondViewport: true,
    clip: {x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1}});
  await writeFile(join(b.output, name + '.png'), Buffer.from(data, 'base64'));
};
const room = async id => {
  await b.navigate('/'); await b.click('#rooms-button'); await b.click('#library-room-' + id); await settle();
};
try {
  await b.viewport(1440, 900); await b.navigate('/'); await shot('home-six-rooms');
  await b.click('#rooms-button'); await shot('rooms-library', true);
  for (const id of ['kitchen','fitness','trips','garden','reading','projects']) {
    await room(id); await shot(id + '-overview');
  }
  await room('kitchen'); await b.click('#collection-recipes'); await shot('kitchen-recipes');
  await b.click('[data-item-id="vegetable-soup"]'); await shot('vegetable-soup-detail');
  await b.click('#ask-room-item'); await b.click('#composer button[type=submit]'); await shot('kitchen-conversation');
  await room('fitness'); await b.click('#collection-routines'); await shot('fitness-routines');
  await b.click('.room-item'); await shot('fitness-item-detail');
  await room('garden'); await b.click('#all-collections'); await b.click('#collection-photos'); await shot('garden-empty');
  await b.click('#rooms-button'); await b.click('#create-room'); await shot('create-room');
  await b.viewport(360, 780); await room('kitchen'); await shot('kitchen-narrow', true);
  await b.viewport(840, 900); await room('kitchen');
  await b.evaluate("document.documentElement.style.setProperty('--review-scale','2');dispatchEvent(new Event('resize'))");
  await b.click('#collection-recipes'); await b.click('[data-item-id="vegetable-soup"]'); await shot('soup-200-text', true);
  await b.viewport(1440,900); await room('reading');
  await b.evaluate("document.body.dataset.roomArt='hidden'"); await shot('reading-art-disabled');
  if (b.errors.length) throw Error(JSON.stringify(b.errors));
  console.log(JSON.stringify({screenshots:b.output, browser:(await b.cdp('Browser.getVersion')).product},null,2));
} finally { await b.close(); }
