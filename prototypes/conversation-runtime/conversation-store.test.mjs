import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {DatabaseSync} from 'node:sqlite';
import {openConversationStore} from './conversation-store.mjs';

const source=(itemId,roomName='Kitchen')=>({itemId,title:itemId==='vegetable-soup'?'Vegetable soup':itemId==='tomato-pasta'?'Tomato pasta':itemId==='passport-details'?'Passport details':'Weekend packing list',summary:'Incoming text is not authoritative.',content:'Incoming content is replaced by the canonical revision.',roomName,collectionLabel:roomName==='Kitchen'?'Recipes':'Packing Lists',provenance:'fictional-local-fixture'});
const room=(sources=[])=>({place:{kind:'room',roomId:'kitchen',roomName:'Kitchen',purpose:'Recipes, lists and cooking plans'},sources});
function setup(){const store=openConversationStore({databasePath:':memory:'}),conversation=store.createConversation({requestId:randomUUID(),mode:'offline_test'});store.bindRuntimeSession(conversation.id,randomUUID(),'offline_test');return {store,conversation};}
function begin(store,conversation,text,context=room([]),requestId=randomUUID(),runtimeSessionId=randomUUID()){
  return store.beginTurn({conversationId:conversation.id,runtimeSessionId,requestId,text,context,mode:'offline_test',model:'stub-model'});
}
function answer(store,run,text,usedSourceIds,eventId=randomUUID()){return store.completeAssistantMessage({providerRunId:run.providerRunId,eventId,text,usedSourceIds});}

test('citations are fetched by exact assistant message ID and omit unused candidates',()=>{
  const {store,conversation}=setup();try{
    const run=begin(store,conversation,'Use the soup details',room([source('vegetable-soup'),source('tomato-pasta'),source('oat-pancakes')]));
    assert.deepEqual(run.context.sources.map(value=>value.itemId),['vegetable-soup','tomato-pasta','oat-pancakes']);
    const response=answer(store,run,'Answer from A',['vegetable-soup']);
    assert.deepEqual(store.fetchMessageCitations(response.messageId).map(value=>value.sourceId),['vegetable-soup']);
    const transcript=store.getConversation(conversation.id),assistant=transcript.messages.find(value=>value.id===response.messageId);
    assert.deepEqual(assistant.citations.map(value=>value.sourceId),['vegetable-soup']);
  }finally{store.close();}
});

test('later answers have independent evidence and earlier citations do not mutate',()=>{
  const {store,conversation}=setup();try{
    const first=answer(store,begin(store,conversation,'First',room([source('vegetable-soup')])), 'First answer',['vegetable-soup']);
    const second=answer(store,begin(store,conversation,'Second',room([source('tomato-pasta')])), 'Second answer',['tomato-pasta']);
    assert.deepEqual(store.fetchMessageCitations(first.messageId).map(value=>value.sourceId),['vegetable-soup']);
    assert.deepEqual(store.fetchMessageCitations(second.messageId).map(value=>value.sourceId),['tomato-pasta']);
  }finally{store.close();}
});

test('the same source used by two answers creates two message-owned links',()=>{
  const {store,conversation}=setup();try{
    const a=answer(store,begin(store,conversation,'One',room([source('vegetable-soup')])), 'One',['vegetable-soup']);
    const b=answer(store,begin(store,conversation,'Two',room([source('vegetable-soup')])), 'Two',['vegetable-soup']);
    assert.equal(store.fetchMessageCitations(a.messageId).length,1);assert.equal(store.fetchMessageCitations(b.messageId).length,1);assert.notEqual(a.messageId,b.messageId);
  }finally{store.close();}
});

test('future exclusion blocks selection without rewriting earlier evidence',()=>{
  const {store,conversation}=setup();try{
    const first=answer(store,begin(store,conversation,'One',room([source('vegetable-soup')])), 'One',['vegetable-soup']);
    store.setSourcePreference({conversationId:conversation.id,sourceId:'vegetable-soup',preference:'excluded_future',requestId:randomUUID()});
    const next=begin(store,conversation,'Two',room([source('vegetable-soup')]));assert.deepEqual(next.context.sources,[]);
    assert.throws(()=>answer(store,next,'Invalid',['vegetable-soup']),/invalid_evidence_use/);
    assert.equal(store.fetchMessageCitations(first.messageId)[0].sourceId,'vegetable-soup');
  }finally{store.close();}
});

test('selected-next preference is not historical evidence before an answer uses it',()=>{
  const {store,conversation}=setup();try{
    store.setSourcePreference({conversationId:conversation.id,sourceId:'vegetable-soup',preference:'selected_next',requestId:randomUUID()});
    const run=begin(store,conversation,'Maybe use it',room([source('vegetable-soup')]));
    assert.equal(store.getConversation(conversation.id).messages.filter(value=>value.role==='assistant').length,0);
    const response=answer(store,run,'No source needed',[]);assert.deepEqual(store.fetchMessageCitations(response.messageId),[]);
  }finally{store.close();}
});

test('historical citation keeps the exact revision after a source changes',()=>{
  const {store,conversation}=setup();try{
    const response=answer(store,begin(store,conversation,'Soup',room([source('vegetable-soup')])), 'Soup',['vegetable-soup']);
    const before=store.fetchMessageCitations(response.messageId)[0];store.reviseFixtureSource('vegetable-soup',{title:'Vegetable soup updated',excerpt:'New excerpt',content:'New content'});
    const after=store.fetchMessageCitations(response.messageId)[0];assert.equal(after.revisionId,before.revisionId);assert.equal(after.title,'Vegetable soup');assert.notEqual(after.content,'New content');
  }finally{store.close();}
});

test('deleted current source leaves a truthful bounded historical receipt',()=>{
  const {store,conversation}=setup();try{
    const response=answer(store,begin(store,conversation,'Soup',room([source('vegetable-soup')])), 'Soup',['vegetable-soup']);
    store.reviseFixtureSource('vegetable-soup',{title:'Unavailable source',excerpt:'',content:'',availability:'deleted'});
    const citation=store.fetchMessageCitations(response.messageId)[0];assert.equal(citation.availability,'deleted');assert.equal(citation.revisionAvailability,'available');assert.equal(citation.title,'Vegetable soup');assert.equal(citation.content,'');assert.match(citation.excerpt,/no longer available/);
  }finally{store.close();}
});

test('private and cross-scope sources are rejected before provider context selection',()=>{
  const {store,conversation}=setup();try{
    const run=begin(store,conversation,'Private?',room([source('passport-details'),source('weekend-packing','Trips')]));assert.deepEqual(run.context.sources,[]);
    const response=answer(store,run,'No private source used',[]);assert.deepEqual(store.fetchMessageCitations(response.messageId),[]);
  }finally{store.close();}
});

test('similar messages remain isolated by conversation ID',()=>{
  const store=openConversationStore({databasePath:':memory:'});try{
    const first=store.createConversation({requestId:randomUUID(),mode:'offline_test'});const firstRun=begin(store,first,'Same words');answer(store,firstRun,'First',[]);
    const second=store.createConversation({requestId:randomUUID(),mode:'offline_test'});const secondRun=begin(store,second,'Same words');answer(store,secondRun,'Second',[]);
    assert.deepEqual(store.getConversation(first.id).messages.map(value=>value.content),['Same words','First']);assert.deepEqual(store.getConversation(second.id).messages.map(value=>value.content),['Same words','Second']);
  }finally{store.close();}
});

test('new conversation archives rather than destroys the prior transcript',()=>{
  const {store,conversation}=setup();try{answer(store,begin(store,conversation,'Keep me'),'Saved',[]);const fresh=store.createConversation({requestId:randomUUID(),mode:'offline_test'});assert.notEqual(fresh.id,conversation.id);assert.equal(store.getConversation(conversation.id).state,'archived');assert.equal(store.getConversation(conversation.id).messages.length,2);}finally{store.close();}
});

test('fictional samples have fixed distinct IDs and are never active live conversations',()=>{
  const {store,conversation}=setup();try{const samples=store.listConversations().filter(value=>value.fixture);assert.equal(samples.length,2);assert.ok(samples.every(value=>value.mode==='fictional_sample'&&!value.active&&value.id!==conversation.id));assert.notEqual(samples[0].id,samples[1].id);}finally{store.close();}
});

test('clear history removes archived live transcripts but keeps active and samples',()=>{
  const store=openConversationStore({databasePath:':memory:'});try{const old=store.createConversation({requestId:randomUUID(),mode:'offline_test'});answer(store,begin(store,old,'Old'),'Old answer',[]);const active=store.createConversation({requestId:randomUUID(),mode:'offline_test'});store.clearConversationHistory(active.id);assert.throws(()=>store.getConversation(old.id),/conversation_unavailable/);assert.equal(store.getConversation(active.id).active,true);assert.equal(store.listConversations().filter(value=>value.fixture).length,2);}finally{store.close();}
});

test('file database survives close and reopen with message evidence intact',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'granny-store-test-')),path=join(directory,'store.sqlite3');let conversationId,messageId;
  try{let store=openConversationStore({databasePath:path});const conversation=store.createConversation({requestId:randomUUID(),mode:'offline_test'});conversationId=conversation.id;messageId=answer(store,begin(store,conversation,'Persist',room([source('vegetable-soup')])), 'Persisted',['vegetable-soup']).messageId;store.close();store=openConversationStore({databasePath:path});assert.equal(store.getConversation(conversationId).messages.at(-1).content,'Persisted');assert.equal(store.fetchMessageCitations(messageId)[0].sourceId,'vegetable-soup');store.close();}finally{await rm(directory,{recursive:true,force:true});}
});

test('replayed runtime writes do not duplicate messages or citations',()=>{
  const {store,conversation}=setup();try{const requestId=randomUUID(),eventId=randomUUID(),sessionId=randomUUID(),first=begin(store,conversation,'Replay',room([source('vegetable-soup')]),requestId,sessionId),again=begin(store,conversation,'Replay',room([source('vegetable-soup')]),requestId,sessionId);assert.equal(first.providerRunId,again.providerRunId);const response=answer(store,first,'Once',['vegetable-soup'],eventId),replay=answer(store,again,'Once',['vegetable-soup'],eventId);assert.equal(response.messageId,replay.messageId);assert.equal(store.getConversation(conversation.id).messages.length,2);assert.equal(replay.citations.length,1);}finally{store.close();}
});

test('a provider run cannot attach another conversation source decision',()=>{
  const store=openConversationStore({databasePath:':memory:'});try{const a=store.createConversation({requestId:randomUUID(),mode:'offline_test'}),runA=begin(store,a,'A',room([source('vegetable-soup')]));const b=store.createConversation({requestId:randomUUID(),mode:'offline_test'}),runB=begin(store,b,'B',room([source('tomato-pasta')]));assert.throws(()=>answer(store,runA,'Wrong',['tomato-pasta']),/invalid_evidence_use/);const right=answer(store,runB,'Right',['tomato-pasta']);assert.equal(store.getConversation(b.id).messages.find(value=>value.id===right.messageId).inReplyToMessageId,runB.userMessageId);}finally{store.close();}
});

test('failed stopped and unknown turns remain distinct',()=>{
  const {store,conversation}=setup();try{for(const state of ['failed','stopped','unknown']){const run=begin(store,conversation,state);store.finishProviderRun(run.providerRunId,state,'bounded-code');assert.equal(store.getConversation(conversation.id).messages.find(value=>value.id===run.userMessageId).state,state);}}finally{store.close();}
});

test('newer unsupported schema fails closed instead of resetting',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'granny-newer-schema-')),path=join(directory,'store.sqlite3');try{const db=new DatabaseSync(path);db.exec('PRAGMA user_version=99');db.close();assert.throws(()=>openConversationStore({databasePath:path}),/unsupported_schema/);}finally{await rm(directory,{recursive:true,force:true});}
});

test('bounded errors do not expose stored text',()=>{
  const {store,conversation}=setup();try{const privateText='SYNTHETIC-PRIVATE-CANARY';assert.throws(()=>store.setSourcePreference({conversationId:conversation.id,sourceId:privateText,preference:'selected_next',requestId:randomUUID()}),error=>error.code==='source_unavailable'&&!error.message.includes(privateText));}finally{store.close();}
});
