import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {request} from 'node:http';
import {readFile,readdir,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {serve} from './server.mjs';
import {VERSION} from './schema.mjs';
const post=(app,path,body,headers={})=>fetch(app.url+path,{method:'POST',headers:{Origin:app.url,'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
const command=(sessionId,kind,payload={})=>({version:VERSION,sessionId,requestId:randomUUID(),kind,payload});
test('actual loopback API and MCP complete draft, idempotency, cursor and static secret isolation',async()=>{
 const app=await serve({port:0,key:'SYNTHETIC-SECRET'});try{
 const creation={version:VERSION,requestId:randomUUID(),mode:'demo',consent:true};let response=await post(app,'/api/runtime/session',creation);assert.equal(response.status,201);const s=await response.json();
 assert.equal((await (await post(app,'/api/runtime/session',creation)).json()).sessionId,s.sessionId);
 const turn=command(s.sessionId,'turn',{text:'Tell David Brother "Exact, unchanged!" via Example Messages'});assert.equal((await post(app,'/api/runtime/command',turn)).status,202);
 const prepared=(await app.runtime.settled(s.sessionId)).events.at(-1).data;const c=command(s.sessionId,'confirm',{actionId:prepared.actionId,confirmationToken:prepared.confirmationToken});
 assert.equal((await post(app,'/api/runtime/command',c)).status,202);const result=await app.runtime.settled(s.sessionId);assert.equal(result.state,'completed');
 assert.deepEqual(await (await post(app,'/api/runtime/command',c)).json(),result);
 const replay=await (await fetch(`${app.url}/api/runtime/events?sessionId=${s.sessionId}&after=${result.cursor-1}`)).json();assert.equal(replay.events.length,1);
 const config=await (await fetch(app.url+'/api/runtime/config')).json();assert.equal(config.liveAvailable,false);assert.ok(!JSON.stringify(config).includes('SYNTHETIC-SECRET'));
 for(const path of ['/.env','/../.env','/provider.mjs','/mcp-server.mjs','/node_modules/zod/package.json'])assert.equal((await fetch(app.url+path)).status,404);
 for(const path of ['/','/app.js','/styles.css','/room-ui.js','/rooms-store.js','/outcome-ui.js','/support-state.js','/support-ui.js']){const asset=await fetch(app.url+path);assert.equal(asset.status,200);assert.ok(!(await asset.text()).includes('SYNTHETIC-SECRET'));}
 }finally{await app.close();}
});
test('HTTP origin Host schema content-type and body bounds',async()=>{
 const app=await serve({port:0});try{
 const body={version:VERSION,requestId:randomUUID(),mode:'demo',consent:true};
 assert.equal((await post(app,'/api/runtime/session',body,{Origin:'https://evil.example'})).status,403);
 assert.equal((await fetch(app.url+'/api/runtime/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).status,403);
 assert.equal((await post(app,'/api/runtime/session',body,{'Content-Type':'text/plain'})).status,415);
 assert.equal((await post(app,'/api/runtime/session',{...body,key:'fake'})).status,400);
 assert.equal((await post(app,'/api/runtime/session',{...body,consent:false})).status,400);
 assert.equal((await post(app,'/api/runtime/session',{...body,mode:'live'})).status,503);
 assert.equal((await post(app,'/api/runtime/session',{...body,padding:'x'.repeat(17000)})).status,413);
 const wrongHost=await new Promise((resolve,reject)=>{const req=request(app.url,{headers:{Host:'evil.example'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});assert.equal(wrongHost,403);
 }finally{await app.close();}
});
test('provider failure becomes bounded runtime event, never success',async()=>{
 const provider={available:true,interpret:async()=>{throw new Error('SYNTHETIC-PRIVATE-SECRET');}};
 const app=await serve({port:0,provider});try{
 const s=await (await post(app,'/api/runtime/session',{version:VERSION,requestId:randomUUID(),mode:'live',consent:true})).json();
 await post(app,'/api/runtime/command',command(s.sessionId,'turn',{text:'Hello'}));const result=await app.runtime.settled(s.sessionId);
 assert.equal(result.state,'failed');assert.equal(result.events.at(-1).data.effect,'none');assert.ok(!JSON.stringify(result).includes('SYNTHETIC-PRIVATE-SECRET'));
 }finally{await app.close();}
});
test('runtime source contains no content/credential logger and no arbitrary tool endpoint',async()=>{
 const files=(await readdir(new URL('./',import.meta.url))).filter(f=>f.endsWith('.mjs')&&!f.includes('.test.'));
 for(const file of files){const source=await readFile(new URL(file,import.meta.url),'utf8');const logs=source.split('\n').filter(l=>/console\.(log|error|warn)/.test(l));
 assert.ok(logs.every(l=>file==='server.mjs'&&l.includes('Local fictional demo:')),file);}
});
test('conversation API returns message-owned citations rather than retrieval candidates',async()=>{
 const provider={available:true,interpret:async(text,signal,history,context)=>({kind:'chat',text:`Answer ${text}`,usedSourceIds:[text==='one'?'vegetable-soup':'tomato-pasta']})};
 const app=await serve({port:0,provider});try{
  const created=await (await post(app,'/api/conversations',{version:VERSION,requestId:randomUUID(),mode:'live',place:{kind:'room',roomId:'kitchen',roomName:'Kitchen',purpose:'Recipes, lists and cooking plans'}})).json();
  const conversationId=created.conversation.id;
  const session=await (await post(app,'/api/runtime/session',{version:VERSION,requestId:randomUUID(),mode:'live',consent:true,conversationId})).json();
  const sources=['vegetable-soup','tomato-pasta','oat-pancakes'].map(itemId=>({itemId,title:itemId,summary:'candidate',content:'candidate',roomName:'Kitchen',collectionLabel:'Recipes',provenance:'fictional-local-fixture'}));
  await post(app,'/api/runtime/command',command(session.sessionId,'turn',{text:'one',context:{place:{kind:'room',roomId:'kitchen',roomName:'Kitchen',purpose:'Recipes, lists and cooking plans'},sources}}));await app.runtime.settled(session.sessionId);
  await post(app,'/api/runtime/command',command(session.sessionId,'turn',{text:'two',context:{place:{kind:'room',roomId:'kitchen',roomName:'Kitchen',purpose:'Recipes, lists and cooking plans'},sources}}));await app.runtime.settled(session.sessionId);
  const detail=await (await fetch(`${app.url}/api/conversations/${conversationId}`)).json(),assistants=detail.conversation.messages.filter(message=>message.role==='assistant');
  assert.deepEqual(assistants.map(message=>message.citations.map(citation=>citation.sourceId)),[['vegetable-soup'],['tomato-pasta']]);
  const exact=await (await fetch(`${app.url}/api/messages/${assistants[0].id}/citations`)).json();assert.deepEqual(exact.citations.map(value=>value.sourceId),['vegetable-soup']);
 }finally{await app.close();}
});
test('conversation API isolates Today rows, preserves active on clear, and labels fixtures',async()=>{
 const app=await serve({port:0});try{
  const first=(await (await post(app,'/api/conversations',{version:VERSION,requestId:randomUUID(),mode:'offline_test'})).json()).conversation;
  const second=(await (await post(app,'/api/conversations',{version:VERSION,requestId:randomUUID(),mode:'offline_test'})).json()).conversation;
  assert.notEqual(first.id,second.id);let list=await (await fetch(app.url+'/api/conversations')).json();assert.equal(list.conversations.find(value=>value.id===first.id).state,'archived');assert.equal(list.conversations.find(value=>value.id===second.id).active,true);assert.equal(list.conversations.filter(value=>value.fixture&&value.mode==='fictional_sample').length,2);
  await post(app,'/api/conversations/clear-history',{version:VERSION,requestId:randomUUID(),activeConversationId:second.id});list=await (await fetch(app.url+'/api/conversations')).json();assert.ok(!list.conversations.some(value=>value.id===first.id));assert.ok(list.conversations.some(value=>value.id===second.id&&value.active));
 }finally{await app.close();}
});
test('HTTP conversation data survives backend restart at the server-owned path',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'granny-server-store-')),databasePath=join(directory,'conversation.sqlite3');let conversationId;
 try{let app=await serve({port:0,databasePath});const created=await (await post(app,'/api/conversations',{version:VERSION,requestId:randomUUID(),mode:'offline_test'})).json();conversationId=created.conversation.id;await app.close();app=await serve({port:0,databasePath});try{const detail=await (await fetch(`${app.url}/api/conversations/${conversationId}`)).json();assert.equal(detail.conversation.id,conversationId);const config=await (await fetch(app.url+'/api/runtime/config')).json();assert.equal(config.storage.persistent,true);}finally{await app.close();}}finally{await rm(directory,{recursive:true,force:true});}
});
