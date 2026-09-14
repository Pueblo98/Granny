// Synthetic browser checks: provider is replaced by a stub; no paid calls.
import assert from 'node:assert/strict';
import { browser } from './browser-driver.mjs';
let calls=0, pendingResolve;
const b=await browser({cloud:{config:()=>({available:true,model:'synthetic-provider'}),chat:async(messages)=>{
  calls++;
  if(messages.at(-1).content==='Slow') return new Promise(resolve=>{pendingResolve=resolve;});
  return {reply:'Review this fictional task.',proposal:{kind:'message',request:'Tell David Brother I will call later via Example Messages'},usage:{total_tokens:12},elapsedMs:25};
}}});
try {
  await b.navigate('/?review=1');
  await b.waitFor("!!document.querySelector('#ai-mode')");
  assert.equal(calls,0);
  await b.click('#menu-button'); await b.click('#ai-mode');
  await b.waitFor("document.querySelector('#confirm-dialog').open");
  assert.equal(calls,0); assert.match(await b.evaluate("document.querySelector('#confirm-text').textContent"),/OpenRouter/);
  await b.click('#confirm-dialog button[value="confirm"]');
  await b.waitFor("document.querySelector('#cloud-status').textContent.startsWith('AI mode')");
  await b.fill('#request','Please help with a fictional message'); await b.click('#composer button[type="submit"]');
  await b.waitFor("!!document.querySelector('#cloud-apply')"); assert.equal(calls,1);
  assert.equal(await b.evaluate("!!document.querySelector('#current-task')"),false);
  await b.click('#cloud-apply');
  await b.waitFor("document.querySelector('#current-task')?.dataset.stage === 'preview'");
  assert.match(await b.evaluate("document.querySelector('#current-task').textContent"),/unsent/);
  await b.click('[data-action="approve"]');
  await b.waitFor("document.querySelector('#current-task')?.dataset.stage === 'completed'");
  assert.equal(calls,1,'local confirmation causes no model call');
  await b.fill('#request','Slow'); await b.click('#composer button[type="submit"]');
  await b.waitFor("!document.querySelector('#stop-button').hidden");
  await b.click('#stop-button');
  pendingResolve({reply:'Late reply must not appear',proposal:null,usage:{},elapsedMs:10});
  await new Promise(resolve=>setTimeout(resolve,100));
  assert(!(await b.evaluate('document.body.innerText')).includes('Late reply must not appear'));
  assert.equal(await b.evaluate("!!document.querySelector('#cloud-apply')"),false);
  await b.click('#menu-button'); await b.click('#ai-mode');
  assert.match(await b.evaluate("document.querySelector('#cloud-status').textContent"),/Scripted mode/);
  await b.viewport(800); const screenshot=await b.screenshot('cloud-conversation');
  assert.equal(b.errors.length,0,JSON.stringify(b.errors));
  assert(b.network.every(url=>url.startsWith(b.base)||url==='about:blank'));
  console.log(JSON.stringify({result:'PASS',checks:'consent, zero auto-egress, proposal review, local draft confirmation, Stop/late response, mode off, no browser errors/external requests',screenshot}));
} finally { await b.close(); }
