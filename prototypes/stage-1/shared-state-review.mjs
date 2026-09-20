// Reproducible fictional review captures. No backend, microphone or provider.
import {mkdir, copyFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {browser} from './browser-driver.mjs';
const output = resolve('docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1');
await mkdir(output, {recursive: true});
const b = await browser();
const choose = (id, value) => b.evaluate(`(() => {const e=document.getElementById(${JSON.stringify(id)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const shot = async name => {
  await b.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  await copyFile(await b.screenshot(name), join(output, name + '.png'));
};
const frame = async () => b.evaluate(`(() => {
  const speech=document.querySelector('#speech-surface');
  const target=speech.hidden ? document.querySelector('#current-task') : document.querySelector('.composer-wrap');
  if(target) {
    const bottom=document.querySelector('.composer-wrap').getBoundingClientRect().bottom+scrollY;
    const top=target.getBoundingClientRect().top+scrollY;
    scrollTo(0, Math.max(0, Math.min(top, bottom-innerHeight)));
  }
})()`);
try {
  await b.viewport(1440, 1000);
  for (const place of ['home', 'kitchen']) {
    await b.navigate('/?review=1');
    if (place === 'kitchen') await b.click('#open-kitchen');
    await b.click('#talk'); await frame(); await shot(place + '-01-listening');
    await b.click('#speech-done'); await frame(); await shot(place + '-02-transcript');
    await b.click('#speech-use'); await frame(); await shot(place + '-03-clarification');
    await b.click('[data-choice=david-family]'); await frame(); await shot(place + '-04-preview');
    await choose('review-delay', '1500');
    await b.click('[data-action=approve]'); await frame(); await shot(place + '-05-active');
    await b.waitFor('document.querySelector("#current-task")?.dataset.surface === "prepared"', 10000);
    await frame(); await shot(place + '-06-prepared');
    await b.click('#surface-done');
    await choose('review-fault', 'unknown'); await choose('review-delay', '0');
    await b.fill('#request', 'Tell David I’ll call after dinner.'); await b.click('.send-action');
    await b.click('[data-choice=david-family]'); await b.click('[data-action=approve]');
    await b.waitFor('document.querySelector("#current-task")?.dataset.surface === "unknown"');
    await frame(); await shot(place + '-07-unknown');
  }
  await b.navigate('/?review=1'); await b.click('#open-kitchen');
  await b.viewport(360, 480); await choose('review-scale', '2');
  await b.click('#talk'); await b.click('#speech-done'); await frame(); await shot('kitchen-narrow-200');
  await b.evaluate('document.querySelector("#speech-use").scrollIntoView({block:"start"})');
  await shot('kitchen-narrow-200-actions');
  await b.viewport(840, 480); await choose('review-scale', '1');
  await frame(); await shot('kitchen-constrained-height');
  console.log(JSON.stringify({output, errors: b.errors}));
} finally { await b.close(); }
