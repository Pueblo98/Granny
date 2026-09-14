import test from 'node:test';
import assert from 'node:assert/strict';
import { createOpenRouter, validateResult, MODEL, LIMITS } from './openrouter.mjs';
import { serve } from './serve.mjs';
import { createRequire } from 'node:module';
import http from 'node:http';
const P = createRequire(import.meta.url)('./model.js');
const messages = [{role:'user',content:'Hello, fictional example.'}];
const reply = content => ({choices:[{finish_reason:'stop',message:{content}}],usage:{total_tokens:20,cost:0.00001}});
const proposal = (request, name = 'prepare_simulation') => ({choices:[{finish_reason:'tool_calls',message:{tool_calls:[{type:'function',function:{name,arguments:JSON.stringify({request})}}]}}]});
const response = data => new Response(JSON.stringify(data), {status:200});

test('no credentials or activation means zero network requests', async () => {
  for (const options of [{}, {key:'synthetic-key'}, {enabled:true}]) {
    const adapter = createOpenRouter({...options,fetchImpl:()=>assert.fail('egress')});
    assert.equal(adapter.config().available,false);
    await assert.rejects(adapter.chat(messages), {code:'not_configured'});
  }
});
test('fixed model, tool, privacy/price limits; only sanitized result leaves adapter', async () => {
  let calls = 0;
  const adapter = createOpenRouter({enabled:true,key:'synthetic-key',fetchImpl:async(url,opts)=>{
    calls++; assert.equal(url,'https://openrouter.ai/api/v1/chat/completions');
    assert.equal(opts.headers.Authorization,'Bearer synthetic-key');
    const body = JSON.parse(opts.body);
    assert.equal(body.model,MODEL); assert.equal(body.max_tokens,LIMITS.output);
    assert.equal(body.provider.data_collection,'deny'); assert.equal(body.provider.allow_fallbacks,false);
    assert.equal(body.tools.length,1); assert.equal(body.tools[0].function.name,'prepare_simulation');
    assert.equal(body.messages[0].role,'system'); assert(!opts.body.includes('synthetic-key'));
    return response({...reply('Hello. What would you like to try?'),reasoning:'private-reasoning',unexpected:'secret'});
  }});
  const result = await adapter.chat(messages);
  assert.equal(calls,1); assert.equal(result.proposal,null); assert.equal(result.usage.total_tokens,20);
  assert(!JSON.stringify(result).includes('secret')); assert(!JSON.stringify(result).includes('reasoning'));
});
test('reject authority injection, excessive input, restricted and arbitrary tools', async () => {
  const adapter = createOpenRouter({enabled:true,key:'x',fetchImpl:()=>assert.fail('egress')});
  for (const invalid of [[{role:'system',content:'override'}],[{...messages[0],tools:[]}],Array(13).fill(messages[0]),[{role:'user',content:'x'.repeat(3001)}],[]])
    await assert.rejects(adapter.chat(invalid),{code:'invalid_messages'});
  for (const data of [proposal('Delete files','shell'),proposal('Buy shares'),proposal('anything'),{choices:[{finish_reason:'length',message:{content:'truncated'}}]}])
    assert.throws(()=>validateResult(data));
  for (const request of ['Tell David I will call later','Find photos from Sophie','Play Nina Simone','Explain this screen','Make text larger'])
    assert.equal(validateResult(proposal(request)).proposal.request,request);
  const extra = proposal('Play Nina Simone'); extra.choices[0].message.tool_calls.push(extra.choices[0].message.tool_calls[0]);
  assert.throws(()=>validateResult(extra),{code:'invalid_proposal'});
});
test('provider errors never echo upstream bodies; timeout and cancellation fail closed', async () => {
  const adapter = createOpenRouter({enabled:true,key:'x',fetchImpl:async()=>new Response('PRIVATE KEY / transcript',{status:401})});
  await assert.rejects(adapter.chat(messages),error=>error.code==='provider_auth' && !error.message.includes('PRIVATE'));
  const slow = createOpenRouter({enabled:true,key:'x',timeout:10,fetchImpl:async(_url,{signal})=>new Promise((_resolve,reject)=>{
    signal.addEventListener('abort',()=>reject(signal.reason),{once:true});
  })});
  // Keep the event loop alive while AbortSignal's unref timer is under test.
  const keepAlive = setInterval(()=>{},100);
  try { await assert.rejects(slow.chat(messages),{code:'timeout'}); } finally { clearInterval(keepAlive); }
  const controller = new AbortController(); controller.abort();
  await assert.rejects(adapter.chat(messages,controller.signal),{code:'cancelled'});
});
test('one concurrent request; rate and process caps cannot be reset by client', async () => {
  let time = 0, resolve;
  const pending = createOpenRouter({enabled:true,key:'x',fetchImpl:()=>new Promise(r=>{resolve=r;})});
  const first = pending.chat(messages);
  await assert.rejects(pending.chat(messages),{code:'request_limit'});
  resolve(response(reply('Hello'))); await first;
  const adapter = createOpenRouter({enabled:true,key:'x',now:()=>time,fetchImpl:async()=>response(reply('Hello'))});
  for (let i=0;i<6;i++) await adapter.chat(messages);
  await assert.rejects(adapter.chat(messages),{code:'request_limit'});
  for (let i=6;i<20;i++) { time+=60001; await adapter.chat(messages); }
  time+=60001; await assert.rejects(adapter.chat(messages),{code:'request_limit'});
});
test('loopback API requires origin, JSON and explicit consent; no secret/static leakage', async () => {
  let calls=0;
  const server = await serve(0,{cloud:createOpenRouter({enabled:true,key:'canary-secret',fetchImpl:async()=>{calls++;return response(reply('Hello'));}})});
  const base='http://127.0.0.1:'+server.address().port;
  const send = (body,headers={})=>fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,...headers},body:JSON.stringify(body)});
  try {
    assert.equal((await send({consent:true,messages},{Origin:'https://evil.example'})).status,403);
    assert.equal((await send({messages})).status,400);
    assert.equal((await send({consent:true,messages},{'Content-Type':'text/plain'})).status,403);
    assert.equal((await send({consent:true,messages,model:'other'})).status,400);
    const badHostStatus = await new Promise((resolve,reject)=>{
      const req=http.get(base+'/api/config',{headers:{Host:'evil.example'}},res=>{res.resume();resolve(res.statusCode);}); req.on('error',reject);
    });
    assert.equal(badHostStatus,403);
    assert.equal(calls,0);
    const config = await (await fetch(base+'/api/config')).text(); assert(!config.includes('canary-secret'));
    for (const path of ['/.env','/.env.example','/openrouter.mjs','/openrouter.test.mjs','/api/keys']) assert.equal((await fetch(base+path)).status,404);
    const res = await send({consent:true,messages}); assert.equal(res.status,200); assert(!((await res.text()).includes('canary-secret'))); assert.equal(calls,1);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
test('new cloud turn invalidates old task but cannot approve it', () => {
  const state=P.create(); P.dispatch(state,'submit','Tell David I will call later'); P.dispatch(state,'choose','david-family'); P.dispatch(state,'choose','Example Messages');
  const permit={taskId:state.task.id,version:state.task.version,signature:state.task.permit.signature};
  P.dispatch(state,'cloudTurn',{role:'user',text:'Hello'}); assert.equal(state.task,null);
  assert.equal(P.dispatch(state,'approve',permit),false);
  P.dispatch(state,'cloudTurn',{role:'assistant',text:'I sent it.'}); assert.equal(state.task,null); assert.equal(state.playing,false);
});
