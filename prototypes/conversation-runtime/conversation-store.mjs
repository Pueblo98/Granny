import {createHash, randomUUID} from 'node:crypto';
import {mkdirSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {createRequire} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import {fileURLToPath} from 'node:url';
import {SafeError} from './schema.mjs';

const SCHEMA_VERSION=1, FIXTURE_VERSION=1;
const require=createRequire(import.meta.url);
const fixtures=require('../stage-1/room-fixtures.js');
const migration=readFileSync(new URL('./migrations/001-conversation-evidence.sql',import.meta.url),'utf8');
const SAMPLE_IDS=Object.freeze({
  kitchen:'00000000-0000-4000-8000-000000000101',
  trip:'00000000-0000-4000-8000-000000000102'
});
const iso=value=>new Date(value).toISOString();
const digest=value=>createHash('sha256').update(value).digest('hex');
const clone=value=>structuredClone(value);
const bounded=(value,max)=>String(value??'').slice(0,max);
const databaseError=error=>{
  if(error instanceof SafeError)return error;
  const wrapped=new SafeError('database_unavailable',503);wrapped.cause=error;return wrapped;
};
export function defaultDatabasePath(){return join(tmpdir(),'granny-conversation-runtime','conversations-v1.sqlite3');}

function itemContent(item){
  const sections=(item.sections||[]).flatMap(section=>[section.heading,...(section.lines||[])]).filter(Boolean);
  return bounded(sections.join('\n')||item.body||item.summary||'',4000);
}
function fixtureRows(){
  const rooms=[],collections=[],sources=new Map(),memberships=[];
  for(const room of fixtures.rooms){
    rooms.push({id:room.id,name:room.name,purpose:room.purpose});
    for(const collection of room.collections){
      const collectionId=`${room.id}:${collection.id}`;
      collections.push({id:collectionId,roomId:room.id,localId:collection.id,label:collection.label});
      for(const item of collection.items){
        if(!sources.has(item.id))sources.set(item.id,item);
        memberships.push({sourceId:item.id,roomId:room.id,collectionId});
      }
    }
  }
  for(const entry of fixtures.systemItems||[]){
    if(!sources.has(entry.item.id))sources.set(entry.item.id,entry.item);
    if(entry.roomId)memberships.push({sourceId:entry.item.id,roomId:entry.roomId,collectionId:`${entry.roomId}:${entry.collectionId}`});
  }
  return {rooms,collections,sources:[...sources.values()],memberships};
}

export function openConversationStore({databasePath=defaultDatabasePath(),now=Date.now,id=randomUUID}={}){
  let db;
  try{
    if(databasePath!==':memory:')mkdirSync(dirname(databasePath),{recursive:true,mode:0o700});
    db=new DatabaseSync(databasePath,{timeout:5000});
    db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL;');
    const current=Number(db.prepare('PRAGMA user_version').get().user_version);
    if(current>SCHEMA_VERSION)throw new SafeError('unsupported_schema',503);
    if(current<1){db.exec('BEGIN IMMEDIATE');try{db.exec(migration);db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}}
  }catch(error){try{db?.close();}catch{}throw databaseError(error);}

  const time=()=>iso(now());
  const transaction=fn=>{db.exec('BEGIN IMMEDIATE');try{const value=fn();db.exec('COMMIT');return value;}catch(error){db.exec('ROLLBACK');throw error;}};
  const conversation=idValue=>db.prepare('SELECT * FROM conversations WHERE id = ? AND state != ?').get(idValue,'deleted');
  const assertConversation=idValue=>{const row=conversation(idValue);if(!row)throw new SafeError('conversation_unavailable',404);return row;};
  const nextOrdinal=conversationId=>Number(db.prepare('SELECT COALESCE(MAX(ordinal), 0) + 1 AS value FROM messages WHERE conversation_id = ?').get(conversationId).value);
  const currentRevision=sourceId=>db.prepare(`SELECT r.*,s.availability AS current_source_availability,s.sensitivity
    FROM canonical_sources s JOIN source_revisions r ON r.id=s.current_revision_id WHERE s.id=?`).get(sourceId);

  function seedFixtures(){
    db.exec('CREATE TABLE IF NOT EXISTS fixture_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT');
    const seeded=Number(db.prepare("SELECT value FROM fixture_metadata WHERE key='fixture_version'").get()?.value||0);
    if(seeded>FIXTURE_VERSION)throw new SafeError('unsupported_fixture_schema',503);
    if(seeded===FIXTURE_VERSION)return;
    const stamp=iso(now()),rows=fixtureRows();
    transaction(()=>{
      const putRoom=db.prepare('INSERT INTO rooms(id,name,purpose,fixture) VALUES(?,?,?,1) ON CONFLICT(id) DO UPDATE SET name=excluded.name,purpose=excluded.purpose');
      const putCollection=db.prepare('INSERT INTO collections(id,room_id,local_id,label) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET label=excluded.label');
      const putSource=db.prepare(`INSERT INTO canonical_sources(id,source_type,provenance,sensitivity,current_revision_id,availability,created_at,updated_at)
        VALUES(?,?,?,?,NULL,'available',?,?) ON CONFLICT(id) DO UPDATE SET source_type=excluded.source_type,provenance=excluded.provenance,sensitivity=excluded.sensitivity,updated_at=excluded.updated_at`);
      const putRevision=db.prepare(`INSERT INTO source_revisions(id,source_id,revision_number,title,excerpt,content,provenance,integrity_sha256,created_at,availability)
        VALUES(?,?,?,?,?,?,?,?,?,'available') ON CONFLICT(source_id,revision_number) DO NOTHING`);
      const setRevision=db.prepare('UPDATE canonical_sources SET current_revision_id=?,availability=? WHERE id=?');
      const putMembership=db.prepare('INSERT INTO source_memberships(source_id,room_id,collection_id,active) VALUES(?,?,?,1) ON CONFLICT(source_id,room_id,collection_id) DO UPDATE SET active=1');
      for(const room of rows.rooms)putRoom.run(room.id,room.name,room.purpose);
      for(const collection of rows.collections)putCollection.run(collection.id,collection.roomId,collection.localId,collection.label);
      for(const source of rows.sources){
        const revision=Number.isInteger(source.revision)?source.revision:1,revisionId=`${source.id}:r${revision}`;
        const content=itemContent(source),excerpt=bounded(source.summary||content,500),sensitivity=source.sensitivity==='private'?'private':'normal';
        putSource.run(source.id,bounded(source.type||'fictional item',80),'fictional-local-fixture',sensitivity,stamp,stamp);
        putRevision.run(revisionId,source.id,revision,bounded(source.title||source.id,120),excerpt,content,'fictional-local-fixture',digest(JSON.stringify({title:source.title,excerpt,content,revision})),stamp);
        setRevision.run(revisionId,'available',source.id);
      }
      for(const membership of rows.memberships)putMembership.run(membership.sourceId,membership.roomId,membership.collectionId);
      seedSampleConversation(SAMPLE_IDS.kitchen,'Vegetable soup question','Kitchen',[['user','Can I make this without tomatoes?'],['assistant','Yes. Leave them out and add a little more vegetable stock.']],'vegetable-soup',stamp);
      seedSampleConversation(SAMPLE_IDS.trip,'Weekend packing','Trips',[['user','What is still on this list?'],['assistant','The fictional list includes a reusable water bottle, small bag and portable blender.']],'weekend-packing',stamp);
      db.prepare("INSERT INTO fixture_metadata(key,value) VALUES('fixture_version',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(String(FIXTURE_VERSION));
    });
  }
  function seedSampleConversation(conversationId,title,roomName,turns,sourceId,stamp){
    db.prepare(`INSERT INTO conversations(id,created_at,updated_at,title,state,mode,current_place_kind,current_room_id,current_room_name,fixture)
      VALUES(?,?,?,?,'archived','fictional_sample','room',?,?,1) ON CONFLICT(id) DO NOTHING`).run(conversationId,stamp,stamp,title,roomName.toLowerCase(),roomName);
    let ordinal=0,userId;
    for(const [role,content] of turns){
      const messageId=`${conversationId}:m${++ordinal}`;
      db.prepare(`INSERT INTO messages(id,conversation_id,ordinal,role,content,created_at,state,content_kind,in_reply_to_message_id)
        VALUES(?,?,?,?,?,?,'completed',?,?) ON CONFLICT(id) DO NOTHING`).run(messageId,conversationId,ordinal,role,content,stamp,role==='user'?'user_text':'assistant_text',role==='assistant'?userId:null);
      if(role==='user')userId=messageId;
      else{
        const revision=currentRevision(sourceId);
        if(revision){
          const runId=`${conversationId}:retrieval`,requestId=`${conversationId}:request`;
          db.prepare(`INSERT INTO retrieval_runs(id,conversation_id,user_message_id,request_id,room_id,selector_version,policy_version,status,created_at)
            VALUES(?,?,?,?,?,'fixture-v1','prototype-policy-v1','completed',?) ON CONFLICT(id) DO NOTHING`).run(runId,conversationId,userId,requestId,roomName.toLowerCase(),stamp);
          db.prepare(`INSERT INTO retrieval_decisions(retrieval_run_id,source_id,source_revision_id,decision,reason_code,score,selection_order)
            VALUES(?,?,?,'selected','fictional-sample',1000,1) ON CONFLICT(retrieval_run_id,source_id) DO NOTHING`).run(runId,sourceId,revision.id);
          db.prepare(`INSERT INTO message_evidence(assistant_message_id,source_revision_id,retrieval_run_id,citation_order)
            VALUES(?,?,?,1) ON CONFLICT(assistant_message_id,source_revision_id) DO NOTHING`).run(messageId,revision.id,runId);
        }
      }
    }
  }

  try{seedFixtures();}catch(error){try{db.close();}catch{}throw databaseError(error);}

  function createConversation({requestId,idempotencyKey=requestId,mode='offline_test',place={kind:'home'}}={}){
    if(!idempotencyKey)throw new SafeError('invalid_schema');
    const prior=db.prepare('SELECT * FROM conversations WHERE idempotency_key=?').get(idempotencyKey);
    if(prior)return publicConversation(prior);
    const conversationId=id(),stamp=time(),room=place?.kind==='room'?place:null;
    return transaction(()=>{
      db.prepare("UPDATE conversations SET state='archived',updated_at=? WHERE state='active' AND fixture=0").run(stamp);
      db.prepare(`INSERT INTO conversations(id,idempotency_key,created_at,updated_at,title,state,mode,current_place_kind,current_room_id,current_room_name,fixture)
        VALUES(?,?,?,?,?,'active',?,?,?,?,0)`).run(conversationId,idempotencyKey,stamp,stamp,'New conversation',mode,room?'room':'home',room?.roomId||null,room?.roomName||null);
      const expired=db.prepare("SELECT id FROM conversations WHERE fixture=0 AND state='archived' ORDER BY updated_at DESC,id DESC LIMIT -1 OFFSET 19").all();
      for(const row of expired)db.prepare('DELETE FROM conversations WHERE id=?').run(row.id);
      return publicConversation(assertConversation(conversationId));
    });
  }
  function ensureActiveConversation(mode='offline_test'){
    const active=db.prepare("SELECT * FROM conversations WHERE state='active' AND fixture=0").get();
    return active?publicConversation(active):createConversation({requestId:`startup:${id()}`,mode});
  }
  function publicConversation(row){return {id:row.id,title:row.title,state:row.state,mode:row.mode,fixture:Boolean(row.fixture),active:row.state==='active',createdAt:row.created_at,updatedAt:row.updated_at,place:row.current_room_name||'Home',currentPlace:row.current_place_kind==='room'?{kind:'room',roomId:row.current_room_id,roomName:row.current_room_name}:{kind:'home'}};}
  function listConversations({limit=20}={}){
    const safe=Math.max(1,Math.min(20,Number(limit)||20));
    return db.prepare(`SELECT * FROM conversations WHERE state!='deleted' ORDER BY fixture ASC, CASE state WHEN 'active' THEN 0 ELSE 1 END, updated_at DESC, id LIMIT ?`).all(safe).map(publicConversation);
  }
  function citationsForMessage(messageId){
    return db.prepare(`SELECT me.citation_order,me.chunk_reference,r.id AS revision_id,r.source_id,r.revision_number,r.title,r.excerpt,r.content,r.provenance,r.integrity_sha256,r.availability AS revision_availability,s.availability AS source_availability,rm.name AS room_name,c.label AS collection_label
      FROM message_evidence me JOIN source_revisions r ON r.id=me.source_revision_id JOIN canonical_sources s ON s.id=r.source_id
      LEFT JOIN source_memberships sm ON sm.source_id=s.id AND sm.active=1 LEFT JOIN rooms rm ON rm.id=sm.room_id LEFT JOIN collections c ON c.id=sm.collection_id
      WHERE me.assistant_message_id=? ORDER BY me.citation_order,rm.id LIMIT 10`).all(messageId).reduce((result,row)=>{
        if(result.some(item=>item.revisionId===row.revision_id))return result;
        const available=row.source_availability==='available';
        result.push({order:row.citation_order,sourceId:row.source_id,itemId:row.source_id,revisionId:row.revision_id,revision:row.revision_number,title:row.title,excerpt:available?row.excerpt:'Historical source receipt retained; content is no longer available.',content:available?row.content:'',roomName:row.room_name,collectionLabel:row.collection_label,provenance:row.provenance,integrity:row.integrity_sha256,availability:row.source_availability,revisionAvailability:row.revision_availability,chunkReference:row.chunk_reference});return result;
      },[]);
  }
  function getConversation(conversationId,{messageLimit=200}={}){
    const meta=publicConversation(assertConversation(conversationId)),safe=Math.max(1,Math.min(200,Number(messageLimit)||200));
    const rows=db.prepare('SELECT * FROM messages WHERE conversation_id=? ORDER BY ordinal LIMIT ?').all(conversationId,safe);
    return {...meta,messages:rows.map(row=>({id:row.id,ordinal:row.ordinal,role:row.role,content:row.content,text:row.content,createdAt:row.created_at,state:row.state,contentKind:row.content_kind,providerEventId:row.provider_event_id,inReplyToMessageId:row.in_reply_to_message_id,citations:row.role==='assistant'?citationsForMessage(row.id):[]}))};
  }
  function bindRuntimeSession(conversationId,runtimeSessionId,mode){
    const row=assertConversation(conversationId);if(row.fixture||row.state!=='active')throw new SafeError('conversation_read_only',409);
    db.prepare('UPDATE conversations SET runtime_session_id=?,mode=?,updated_at=? WHERE id=?').run(runtimeSessionId,mode,time(),conversationId);
  }
  function beginTurn({conversationId,runtimeSessionId,requestId,text,context,mode,model}){
    assertConversation(conversationId);const key=`turn:${runtimeSessionId}:${requestId}`;
    const prior=db.prepare('SELECT * FROM provider_runs WHERE idempotency_key=?').get(key);
    if(prior){const run=db.prepare('SELECT * FROM retrieval_runs WHERE id=?').get(prior.retrieval_run_id);return {userMessageId:prior.user_message_id,retrievalRunId:run.id,providerRunId:prior.id,context:contextForRun(run.id),replayed:true};}
    if(db.prepare('SELECT id FROM provider_runs WHERE request_id=?').get(requestId))throw new SafeError('request_conflict',409);
    if(Number(db.prepare('SELECT COUNT(*) AS value FROM messages WHERE conversation_id=?').get(conversationId).value)>=198)throw new SafeError('conversation_message_limit',429);
    const stamp=time(),userMessageId=id(),retrievalRunId=id(),providerRunId=id(),place=context?.place?.kind==='room'?context.place:{kind:'home'},sourceInputs=Array.isArray(context?.sources)?context.sources:[];
    return transaction(()=>{
      const ordinal=nextOrdinal(conversationId),payloadHash=digest(JSON.stringify({conversationId,text,place,sourceInputs}));
      db.prepare(`INSERT INTO messages(id,conversation_id,ordinal,role,content,created_at,provider_event_id,idempotency_key,payload_hash,state,content_kind)
        VALUES(?,?,?,?,?,?,?,?,?,'pending','user_text')`).run(userMessageId,conversationId,ordinal,'user',text,stamp,requestId,key,payloadHash);
      db.prepare(`INSERT INTO retrieval_runs(id,conversation_id,user_message_id,request_id,room_id,selector_version,policy_version,status,created_at)
        VALUES(?,?,?,?,?,'room-selector-v1','prototype-policy-v1','selected',?)`).run(retrievalRunId,conversationId,userMessageId,requestId,place.kind==='room'?place.roomId:null,stamp);
      const excluded=db.prepare("SELECT source_id FROM conversation_source_preferences WHERE conversation_id=? AND preference='excluded_future'").all(conversationId).map(row=>row.source_id);
      let order=0;
      for(const input of sourceInputs.slice(0,3)){
        const source=db.prepare('SELECT * FROM canonical_sources WHERE id=?').get(input.itemId),membership=source&&place.kind==='room'?db.prepare('SELECT * FROM source_memberships WHERE source_id=? AND room_id=? AND active=1').get(source.id,place.roomId):null;
        let decision='selected',reason='bounded-client-candidate',revision=source&&currentRevision(source.id);
        if(!source)decision='unknown',reason='unknown-source';
        else if(source.sensitivity!=='normal')decision='private',reason='sensitivity-denied';
        else if(source.availability!=='available'||!revision||revision.availability!=='available')decision='unavailable',reason='source-unavailable';
        else if(place.kind!=='room'||!membership)decision='cross_scope',reason='room-scope-denied';
        else if(excluded.includes(source.id))decision='excluded',reason='future-use-excluded';
        const preference=source&&db.prepare("SELECT preference FROM conversation_source_preferences WHERE conversation_id=? AND source_id=?").get(conversationId,source.id)?.preference;
        if(decision==='selected'&&preference==='selected_next')reason='selected-next';
        db.prepare(`INSERT INTO retrieval_decisions(retrieval_run_id,source_id,source_revision_id,decision,reason_code,score,selection_order)
          VALUES(?,?,?,?,?,?,?)`).run(retrievalRunId,source?.id||null,decision==='selected'?revision.id:null,decision,reason,null,decision==='selected'?++order:null);
      }
      db.prepare(`INSERT INTO provider_runs(id,conversation_id,user_message_id,retrieval_run_id,runtime_session_id,request_id,model,mode,status,idempotency_key,started_at)
        VALUES(?,?,?,?,?,?,?,?,? ,?,?)`).run(providerRunId,conversationId,userMessageId,retrievalRunId,runtimeSessionId,requestId,model,mode,'pending',key,stamp);
      db.prepare(`UPDATE conversations SET updated_at=?,title=CASE WHEN title='New conversation' THEN ? ELSE title END,current_place_kind=?,current_room_id=?,current_room_name=? WHERE id=?`).run(stamp,bounded(text.trim(),54),place.kind,place.roomId||null,place.roomName||null,conversationId);
      return {userMessageId,retrievalRunId,providerRunId,context:contextForRun(retrievalRunId),replayed:false};
    });
  }
  function contextForRun(retrievalRunId){
    const run=db.prepare('SELECT * FROM retrieval_runs WHERE id=?').get(retrievalRunId);if(!run)throw new SafeError('retrieval_unavailable',404);
    if(!run.room_id)return {place:{kind:'home'},sources:[]};
    const room=db.prepare('SELECT * FROM rooms WHERE id=?').get(run.room_id);if(!room)throw new SafeError('retrieval_scope_unavailable',409);
    const selected=db.prepare(`SELECT d.reason_code,r.*,c.label AS collection_label FROM retrieval_decisions d JOIN source_revisions r ON r.id=d.source_revision_id
      JOIN source_memberships sm ON sm.source_id=d.source_id AND sm.room_id=? AND sm.active=1 JOIN collections c ON c.id=sm.collection_id
      WHERE d.retrieval_run_id=? AND d.decision='selected' ORDER BY d.selection_order LIMIT 3`).all(run.room_id,retrievalRunId);
    return {place:{kind:'room',roomId:room.id,roomName:room.name,purpose:room.purpose},sources:selected.map(row=>({itemId:row.source_id,title:row.title,summary:row.excerpt,content:row.content,roomName:room.name,collectionLabel:row.collection_label,provenance:'fictional-local-fixture'}))};
  }
  function completeAssistantMessage({providerRunId,eventId,text,usedSourceIds=[]}){
    const run=db.prepare('SELECT * FROM provider_runs WHERE id=?').get(providerRunId);if(!run)throw new SafeError('provider_run_unavailable',404);
    if(run.assistant_message_id)return {messageId:run.assistant_message_id,citations:citationsForMessage(run.assistant_message_id)};
    const unique=[...new Set(usedSourceIds)].slice(0,3),stamp=time(),messageId=id();
    return transaction(()=>{
      const selected=db.prepare("SELECT source_id,source_revision_id FROM retrieval_decisions WHERE retrieval_run_id=? AND decision='selected'").all(run.retrieval_run_id);
      if(unique.some(sourceId=>!selected.some(row=>row.source_id===sourceId)))throw new SafeError('invalid_evidence_use',409);
      db.prepare(`INSERT INTO messages(id,conversation_id,ordinal,role,content,created_at,provider_event_id,idempotency_key,payload_hash,state,content_kind,in_reply_to_message_id)
        VALUES(?,?,?,?,?,?,?,?,?,'completed','assistant_text',?)`).run(messageId,run.conversation_id,nextOrdinal(run.conversation_id),'assistant',text,stamp,eventId,`assistant:${providerRunId}`,digest(text),run.user_message_id);
      unique.forEach((sourceId,index)=>{const revision=selected.find(row=>row.source_id===sourceId).source_revision_id;db.prepare('INSERT INTO message_evidence(assistant_message_id,source_revision_id,retrieval_run_id,citation_order) VALUES(?,?,?,?)').run(messageId,revision,run.retrieval_run_id,index+1);});
      db.prepare("UPDATE messages SET state='completed' WHERE id=?").run(run.user_message_id);
      db.prepare("UPDATE retrieval_runs SET status='completed' WHERE id=?").run(run.retrieval_run_id);
      db.prepare("UPDATE provider_runs SET status='completed',provider_event_id=?,completed_at=?,assistant_message_id=? WHERE id=?").run(eventId,stamp,messageId,providerRunId);
      for(const sourceId of unique)db.prepare("UPDATE conversation_source_preferences SET consumed_at_message_id=? WHERE conversation_id=? AND source_id=? AND preference='selected_next'").run(messageId,run.conversation_id,sourceId);
      db.prepare("DELETE FROM conversation_source_preferences WHERE conversation_id=? AND preference='selected_next' AND consumed_at_message_id IS NOT NULL").run(run.conversation_id);
      db.prepare('UPDATE conversations SET updated_at=? WHERE id=?').run(stamp,run.conversation_id);
      return {messageId,citations:citationsForMessage(messageId)};
    });
  }
  function finishProviderRun(providerRunId,status,errorCode){
    if(!['failed','stopped','unknown'].includes(status))throw new SafeError('invalid_schema');
    const run=db.prepare('SELECT * FROM provider_runs WHERE id=?').get(providerRunId);if(!run)return false;
    transaction(()=>{
      db.prepare('UPDATE provider_runs SET status=?,error_code=?,completed_at=? WHERE id=? AND status=?').run(status,bounded(errorCode,80)||null,time(),providerRunId,'pending');
      db.prepare('UPDATE retrieval_runs SET status=? WHERE id=?').run(status,run.retrieval_run_id);
      db.prepare('UPDATE messages SET state=? WHERE id=?').run(status,run.user_message_id);
    });return true;
  }
  function completeProviderRunWithoutMessage(providerRunId){
    const run=db.prepare('SELECT * FROM provider_runs WHERE id=?').get(providerRunId);if(!run)return false;
    transaction(()=>{db.prepare("UPDATE provider_runs SET status='completed',completed_at=? WHERE id=? AND status='pending'").run(time(),providerRunId);db.prepare("UPDATE retrieval_runs SET status='completed' WHERE id=?").run(run.retrieval_run_id);db.prepare("UPDATE messages SET state='completed' WHERE id=?").run(run.user_message_id);});return true;
  }
  function appendActionResult({conversationId,userMessageId,eventId,text,state='completed',requestId}){
    const existing=db.prepare('SELECT id FROM messages WHERE provider_event_id=?').get(eventId);if(existing)return existing.id;
    const messageId=id(),stamp=time();transaction(()=>{db.prepare(`INSERT INTO messages(id,conversation_id,ordinal,role,content,created_at,provider_event_id,idempotency_key,payload_hash,state,content_kind,in_reply_to_message_id)
      VALUES(?,?,?,?,?,?,?,?,?,?,'verified_action_result',?)`).run(messageId,conversationId,nextOrdinal(conversationId),'assistant',text,stamp,eventId,`action-result:${requestId}`,digest(text),state,userMessageId||null);db.prepare('UPDATE conversations SET updated_at=? WHERE id=?').run(stamp,conversationId);});return messageId;
  }
  function setSourcePreference({conversationId,sourceId,preference,requestId,effectiveAfterMessageId=null}){
    assertConversation(conversationId);const source=db.prepare('SELECT id FROM canonical_sources WHERE id=?').get(sourceId);if(!source)throw new SafeError('source_unavailable',404);
    if(!['selected_next','excluded_future'].includes(preference))throw new SafeError('invalid_schema');
    const prior=db.prepare('SELECT * FROM conversation_source_preferences WHERE idempotency_key=?').get(requestId);if(prior)return {conversationId:prior.conversation_id,sourceId:prior.source_id,preference:prior.preference};
    db.prepare(`INSERT INTO conversation_source_preferences(conversation_id,source_id,preference,effective_at,effective_after_message_id,idempotency_key)
      VALUES(?,?,?,?,?,?) ON CONFLICT(conversation_id,source_id) DO UPDATE SET preference=excluded.preference,effective_at=excluded.effective_at,effective_after_message_id=excluded.effective_after_message_id,consumed_at_message_id=NULL,idempotency_key=excluded.idempotency_key`).run(conversationId,sourceId,preference,time(),effectiveAfterMessageId,requestId);
    return {conversationId,sourceId,preference};
  }
  function clearConversationHistory(activeConversationId){
    assertConversation(activeConversationId);return transaction(()=>{
      const ids=db.prepare("SELECT id FROM conversations WHERE fixture=0 AND state='archived'").all().map(row=>row.id);
      for(const conversationId of ids)db.prepare('DELETE FROM conversations WHERE id=?').run(conversationId);
      db.prepare('DELETE FROM action_history WHERE conversation_id IS NULL OR conversation_id != ?').run(activeConversationId);
      return {deletedConversations:ids.length,activeConversationId};
    });
  }
  function deleteConversation(conversationId){const row=assertConversation(conversationId);if(row.fixture)throw new SafeError('conversation_read_only',409);db.prepare("UPDATE conversations SET state='deleted',runtime_session_id=NULL,updated_at=? WHERE id=?").run(time(),conversationId);return true;}
  function resetAll(){
    return transaction(()=>{
      db.prepare('DELETE FROM conversations WHERE fixture=0').run();db.prepare('DELETE FROM action_history').run();
    }),ensureActiveConversation('offline_test');
  }
  function recordAction({conversationId,actionType,outcome,evidenceGrade,code,runtimeSessionId,requestId}){
    if(!['completed','stopped','failed','unknown'].includes(outcome))throw new SafeError('invalid_schema');
    const existing=requestId&&db.prepare('SELECT id FROM action_history WHERE request_id=?').get(requestId);if(existing)return existing.id;
    const actionId=id();db.prepare(`INSERT INTO action_history(id,conversation_id,action_type,occurred_at,outcome,evidence_grade,code,runtime_session_id,request_id)
      VALUES(?,?,?,?,?,?,?,?,?)`).run(actionId,conversationId||null,bounded(actionType,80),time(),outcome,evidenceGrade,bounded(code,80),runtimeSessionId||null,requestId||null);
    for(const row of db.prepare('SELECT id FROM action_history ORDER BY occurred_at DESC,id DESC LIMIT -1 OFFSET 100').all())db.prepare('DELETE FROM action_history WHERE id=?').run(row.id);return actionId;
  }
  function reviseFixtureSource(sourceId,{title,excerpt,content,availability='available'}){
    const source=db.prepare('SELECT * FROM canonical_sources WHERE id=?').get(sourceId);if(!source)throw new SafeError('source_unavailable',404);
    const current=currentRevision(sourceId),revision=current.revision_number+1,revisionId=`${sourceId}:r${revision}`,stamp=time();
    transaction(()=>{db.prepare(`INSERT INTO source_revisions(id,source_id,revision_number,title,excerpt,content,provenance,integrity_sha256,created_at,availability)
      VALUES(?,?,?,?,?,?,?,?,?,?)`).run(revisionId,sourceId,revision,bounded(title,120),bounded(excerpt,500),bounded(content,4000),source.provenance,digest(JSON.stringify({title,excerpt,content,revision})),stamp,availability);
      db.prepare('UPDATE canonical_sources SET current_revision_id=?,availability=?,updated_at=? WHERE id=?').run(revisionId,availability,stamp,sourceId);});return revisionId;
  }
  return {schemaVersion:SCHEMA_VERSION,databasePath,createConversation,ensureActiveConversation,listConversations,getConversation,fetchMessageCitations:citationsForMessage,bindRuntimeSession,beginTurn,completeAssistantMessage,completeProviderRunWithoutMessage,appendActionResult,finishProviderRun,setSourcePreference,clearConversationHistory,deleteConversation,resetAll,recordAction,reviseFixtureSource,close(){db.close();}};
}

if(process.argv[1]===fileURLToPath(import.meta.url))throw new Error('Use server.mjs; the data store is not a command-line query interface.');
