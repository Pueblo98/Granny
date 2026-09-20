// End-to-end: real browser UI + HTTP runtime + stdio MCP + actual demo files.
import assert from 'node:assert/strict';
import {browser} from '../stage-1/browser-driver.mjs';
import {serve} from './server.mjs';
const app=await serve({port:0});let b;let checks=0;const evidence=[];
const check=(value,label)=>{assert(value,label);checks++;evidence.push(label);};
try{
 b=await browser({baseURL:app.url});await b.viewport(840,1000);await b.navigate();
 const button=label=>b.evaluate(`(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent===${JSON.stringify(label)});if(!e||e.disabled)throw Error('Button unavailable: '+${JSON.stringify(label)});e.click()})()`);
 const text=()=>b.evaluate('document.body.innerText');
 const state=s=>b.waitFor(`document.querySelector('#current-task')?.dataset.stage===${JSON.stringify(s)}`);
 const input=async value=>{await b.fill('#request',value);await b.click('#composer button[type=submit]');};
 check(!b.network.some(url=>url.includes('/api/runtime/')),'scripted default makes no runtime API call');
 await b.click('#menu-button');await b.click('[data-menu=settings]');await b.click('#settings-about');await b.click('#about-connection');await button('Use offline test replies');await state('idle');
 await input('Hello');await b.waitFor('document.body.innerText.includes("I can prepare an unsent message in this fictional demo.")');check((await text()).includes('What would you like help with?'),'normal chat crosses real HTTP runtime');
 await b.click('#rooms-button');await b.click('#library-room-kitchen');await input('What is in the vegetable soup?');
 await b.waitFor('document.querySelector("#room-surface")?.dataset.roomState === "conversation"');
 await b.waitFor('document.body.innerText.includes("Source used for this answer")');
 const roomText=await text();check(roomText.includes('Source used for this answer')&&roomText.includes('Vegetable soup · Kitchen'),'actual runtime answer exposes its bounded Room source');
 const roomApiRequest=b.network.findLast(url=>url.includes('/api/runtime/events?'));
 const roomSessionId=new URL(roomApiRequest).searchParams.get('sessionId');const roomSnapshot=app.runtime.events(roomSessionId,0),roomChat=roomSnapshot.events.findLast(e=>e.type==='chat');
 check(roomChat.data.place.roomId==='kitchen'&&roomChat.data.sources.length<=3&&roomChat.data.sources.some(source=>source.itemId==='vegetable-soup'),'actual HTTP runtime receives current-Room context');
 await b.click('#room-home');
 const body='Meet at six.  🌱';await input(`Tell David "${body}"`);await state('clarifying');
 check((await text()).includes('David — Brother')&&(await text()).includes('David — Gardening group'),'MCP returns ambiguous fictional identities');
 await button('David — Brother');await b.waitFor('document.body.innerText.includes("Which demo channel")');await b.click('[data-choice=example-messages]');await state('preview');
 check((await text()).includes(body),'original punctuation and emoji preserved in actual preview');
 check(!b.network.some(url=>/confirm/.test(url)),'no automatic confirmation route');
 await button('Change message');const edited='  Exact <b>words</b>?! 🌱  ';await b.fill('[aria-label="Message"]',edited);await button('Review changes');await state('preview');
 await b.waitFor('document.querySelector("blockquote")?.textContent.includes("Exact <b>words</b>?! 🌱")');
 check(await b.evaluate('!document.querySelector("blockquote b")'),'exact body is plain text, not interpreted HTML');
 check((await text()).includes('Exact <b>words</b>?! 🌱'),'edited body returned by backend');
 await button('Create this unsent demo draft');await state('completed');check((await text()).includes('created and checked. It has not been sent.'),'UI shows only verified unsent completion');
 // Read actual captured API state through runtime, then separately read MCP store.
 const apiRequest=b.network.find(url=>url.includes('/api/runtime/events?'));
 const sessionId=new URL(apiRequest).searchParams.get('sessionId');const snapshot=app.runtime.events(sessionId,0);const result=snapshot.events.findLast(e=>e.type==='result');
 check(result.data.body===edited&&result.data.sent===false,'authoritative result binds exact body and unsent effect');
 const stored=await app.mcp.call('demo_draft_read',{draftId:result.data.draftId});check(stored.draft.body===edited&&stored.draft.recipientId==='david-family','separate MCP read observes actual stored draft');
 const confirmEvent=snapshot.events.find(e=>e.state==='creating');check(snapshot.events.filter(e=>e.state==='creating').length===1,'one confirmation admits one creation');
 const replay=await b.evaluate(`fetch('/api/runtime/events?sessionId=${sessionId}&after=0').then(r=>r.json())`);check(replay.events.at(-1).eventId===snapshot.events.at(-1).eventId,'reconnect cursor replays stable event identities');
 await b.screenshot('actual-mcp-draft-completed');
 await input('Tell David Brother "Cancel this draft." via Example Messages');await state('preview');await b.click('#stop-button');await state('stopped');
 check((await text()).includes('No draft was created by this request.'),'Stop at preview gets authoritative no-effect cancellation');
 const stopped=app.runtime.events(sessionId,0);check(stopped.events.filter(e=>e.type==='result').length===1,'cancelled second request creates no second verified result');
 check(await b.evaluate('localStorage.length===0&&sessionStorage.length===0'),'no browser persistence');
 check(b.errors.length===0,'no browser exceptions');check(b.network.every(url=>url.startsWith(app.url)||url==='about:blank'),'browser connects only to actual loopback backend');
 process.stdout.write(JSON.stringify({checks,evidence,protocol:app.mcp.protocol,model:'stub',mcp:'actual-stdio',store:'actual-temporary-files',screenshots:b.output})+'\n');
}finally{await b?.close();await app.close();}
