// End-to-end browser evidence against an explicitly supplied, already running
// loopback runtime. Creates fictional local drafts; never starts/stops a server.
import assert from 'node:assert/strict';
import {browser} from './browser-driver.mjs';
const baseURL = process.argv[2] || 'http://127.0.0.1:4180';
const b = await browser({baseURL});
let checks = 0;
const check = (value, label) => { assert(value, label); checks++; };
const button = label => b.evaluate(`(() => {
  const el=[...document.querySelectorAll('button')].find(b=>b.textContent===${JSON.stringify(label)});
  if(!el || el.disabled) throw Error('Missing button: '+${JSON.stringify(label)});
  el.click();
})()`);
const request = async text => { await b.fill('#request', text); await b.click('#composer button[type=submit]'); };
const stage = state => b.waitFor(`document.querySelector('#current-task')?.dataset.stage===${JSON.stringify(state)}`, 15000);
try {
  await b.viewport(840, 1050);
  await b.navigate();
  check(await b.evaluate('!!window.GrannyRuntime'), 'served frontend contains agreed client');
  check(!b.network.some(url => url.includes('/api/')), 'no runtime request before explicit consent');
  await b.click('#menu-button'); await b.click('[data-menu=settings]'); await b.click('#settings-about'); await b.click('#about-connection');
  await button('Connect to local demo'); await stage('idle');
  await request('Tell David "Original, punctuation!"'); await stage('clarifying');
  check(await b.evaluate('document.body.innerText.includes("Gardening group") && document.body.innerText.includes("Brother")'), 'backend differentiates fictional people');
  await b.click('[data-choice=david-garden]');
  await b.waitFor('!!document.querySelector("[data-choice=example-mail]")');
  await b.click('[data-choice=example-mail]'); await stage('preview');
  check(await b.evaluate('document.body.innerText.includes("Example Mail") && document.querySelector("blockquote").textContent === "Original, punctuation!"'), 'exact chosen channel and body rendered');
  await button('Change message');
  const body = '  Exact\nnew punctuation?!  🌱  ';
  await b.fill('[aria-label=Message]', body); await button('Review changes');
  await b.waitFor('!!document.querySelector("[data-action=runtime-confirm]")');
  check(await b.evaluate('document.querySelector("blockquote").textContent === '+JSON.stringify(body)), 'actual revised whitespace and emoji preserved');
  await b.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)');
  await b.screenshot('real-mcp-exact-preview');
  await button('Create this unsent demo draft'); await stage('completed');
  check(await b.evaluate('document.body.innerText.includes("created and checked. It has not been sent.")'), 'real runtime verified local draft, explicitly not sent');
  check(!await b.evaluate('!!document.querySelector("[data-action=runtime-confirm]")'), 'consumed confirmation not available');
  await b.screenshot('real-mcp-verified-draft');
  await request('Hello'); await stage('idle');
  check(await b.evaluate('document.body.innerText.includes("Assistant text, not a verified action result.")'), 'model chat never represented as execution authority');
  await request('Tell David Brother "Stop this preparation." via Example Messages');
  await b.waitFor('!document.querySelector("#stop-button").hidden');
  await b.click('#stop-button'); await stage('stopped');
  check(await b.evaluate('document.body.innerText.includes("No draft was created by this request.")'), 'real cancellation acknowledgment rendered');
  await b.viewport(1180, 820);
  await request('Tell David Brother "A landscape preview." via Example Messages'); await stage('preview');
  check(await b.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'landscape layout fits');
  await b.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)');
  await b.screenshot('real-mcp-landscape-preview');
  await b.click('#stop-button'); await stage('stopped');
  check(b.errors.length===0, 'no browser exceptions');
  check(b.network.every(url=>url.startsWith(baseURL+'/') || url==='about:blank'), 'no external browser requests');
  check(await b.evaluate('localStorage.length===0 && sessionStorage.length===0'), 'no browser persistence');
  console.log(JSON.stringify({checks,baseURL,evidence:'real browser → same-origin runtime → local MCP demo store; no sends',screenshots:b.output,errors:b.errors},null,2));
} finally { await b.close(); }
