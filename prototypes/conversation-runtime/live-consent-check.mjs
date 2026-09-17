// Actual live-mode UI/API/MCP wiring with a stub provider. Never calls OpenRouter.
import assert from 'node:assert/strict';
import {serve} from './server.mjs';
import {createStub} from './provider.mjs';
import {browser} from '../stage-1/browser-driver.mjs';
let calls=0;const stub=createStub();
const app=await serve({port:0,provider:{available:true,interpret:async(...args)=>{calls++;return stub.interpret(...args);}}});let b;
try{
 b=await browser({baseURL:app.url});await b.navigate();
 const button=label=>b.evaluate(`(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent===${JSON.stringify(label)});if(!e||e.disabled)throw Error('Button unavailable');e.click()})()`);
 await b.click('#menu-button');await b.click('[data-menu=connection]');await button('Check live model availability');
 await b.waitFor('[...document.querySelectorAll("button")].some(e=>e.textContent === "Review live conversation consent")');
 assert.equal(calls,0);await button('Review live conversation consent');assert.equal(calls,0);await b.click('#confirm-dialog button[value=confirm]');
 await b.waitFor('document.querySelector("#current-task")?.dataset.stage === "idle"');assert.equal(calls,0);
 assert.ok(await b.evaluate('document.querySelector("#mode-notice").textContent.includes("fictional text goes to OpenRouter")'));
 await b.fill('#request','Tell David Brother "Exact live-mode fixture!" via Example Messages');await b.click('#composer button[type=submit]');
 await b.waitFor('!!document.querySelector("[data-action=runtime-confirm]")');assert.equal(calls,1);
 assert.equal(await b.evaluate('document.querySelector("blockquote").textContent'),'Exact live-mode fixture!');
 await button('Create this unsent demo draft');await b.waitFor('document.querySelector("#current-task")?.dataset.stage === "completed"');assert.equal(calls,1);
 assert.ok(await b.evaluate('document.body.innerText.includes("created and checked. It has not been sent.")'));
 assert.equal(b.errors.length,0);assert.ok(b.network.every(url=>url.startsWith(app.url)||url==='about:blank'));
 process.stdout.write(JSON.stringify({checks:10,mode:'live',provider:'stub-no-paid-calls',mcp:'actual-stdio',result:'verified-unsent',calls})+'\n');
}finally{await b?.close();await app.close();}
