import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {VERSION,sessionSchema,commandSchema,proposalSchema,people,channels,parse,SafeError} from './schema.mjs';
import {createStub} from './provider.mjs';
const id=()=>randomUUID();
const reject=(code,status=409)=>{throw new SafeError(code,status);};
export function createRuntime({mcp,provider,stub=createStub(),now=()=>performance.now(),wall=Date.now,previewTTL=60000,sessionTTL=1800000}={}){
  const sessions=new Map(),creations=new Map();
  function get(sessionId){const s=sessions.get(sessionId);if(!s)reject('session_unavailable',404);if(now()>=s.expires){invalidate(s);reject('session_expired',404);}return s;}
  function snapshot(s,after=0){if(!Number.isSafeInteger(after)||after<0||after>s.events.length)reject('invalid_cursor',400);return structuredClone({version:VERSION,sessionId:s.id,mode:s.mode,epoch:s.epoch,cursor:s.events.length,state:s.state,events:s.events.slice(after)});}
  function emit(s,type,state,data,requestId){
    s.state=state;s.events.push({version:VERSION,sessionId:s.id,turnId:s.turnId,requestId,actionId:s.preview?.actionId??null,eventId:id(),seq:s.events.length+1,epoch:s.epoch,type,state,data});
  }
  function invalidate(s){s.epoch++;s.controller?.abort();s.controller=new AbortController();s.preview=null;s.clarification=null;}
  function active(s,epoch){return s.epoch===epoch&&!s.controller.signal.aborted&&now()<s.expires;}
  async function call(s,name,input,epoch){
    if(!active(s,epoch))reject('cancelled');
    if(++s.operations>8)reject('operation_limit',429);
    const result=await mcp.call(name,input,s.controller.signal);
    if(!active(s,epoch))reject('cancelled');
    return result;
  }
  function work(s,requestId,fn){const epoch=s.epoch;
    // Defer admission so a synchronous Stop invalidates queued work first.
    s.pending=new Promise(resolve=>setImmediate(resolve)).then(async()=>{
      if(!active(s,epoch))return;
      try{await fn(epoch);}catch(e){if(!active(s,epoch))return;const unknown=s.dispatched;
        s.quarantine ||= unknown;emit(s,'error',unknown?'unknown':'failed',{code:e instanceof SafeError?e.code:'runtime_failure',effect:unknown?'unknown':'none',retryable:false},requestId);
      }
    });
  }
  function clarify(s,field,choices,requestId){s.clarification={field,choices};emit(s,'clarification','clarifying',{
    field,prompt:field==='recipient'?'Which fictional person do you mean?':field==='channel'?'Which demo channel should the draft use?':'Please type the request again with the exact message in quotation marks.',choices
  },requestId);}
  function preview(s,requestId){const actionId=id();s.clarification=null;
    s.preview={actionId,recipientId:s.slots.recipientId,channelId:s.slots.channelId,body:s.slots.body,confirmationToken:id(),deadline:now()+previewTTL,epoch:s.epoch,consumed:false};
    emit(s,'preview','preview',{actionId,recipient:people.find(p=>p.id===s.slots.recipientId),channel:channels.find(c=>c.id===s.slots.channelId),body:s.slots.body,effect:'create_demo_draft',effectLabel:'Create an unsent draft in the local demo',confirmationToken:s.preview.confirmationToken,expiresAt:new Date(wall()+previewTTL).toISOString(),provenance:s.slots.provenance},requestId);
  }
  function finishPreparation(s,requestId){
    if(!s.slots.recipientId){clarify(s,'recipient',s.candidates,requestId);return;}
    if(!s.slots.channelId){clarify(s,'channel',channels.map(c=>({...c,detail:'Fictional channel'})),requestId);return;}
    preview(s,requestId);
  }
  async function interpret(s,text,context,requestId,epoch){
    const safeContext=context??{place:{kind:'home'},sources:[]};
    const boundedHistory=s.history.slice(),contextLength=JSON.stringify(safeContext).length;
    while(boundedHistory.length&&boundedHistory.reduce((n,m)=>n+m.content.length,text.length+contextLength)>12000)boundedHistory.shift();
    const proposal=parse(proposalSchema,await (s.mode==='live'?provider:stub).interpret(text,s.controller.signal,boundedHistory,safeContext));
    if(!active(s,epoch))return;
    s.history.push({role:'user',content:text});
    if(proposal.kind==='chat')s.history.push({role:'assistant',content:proposal.text});
    while(s.history.length>10||s.history.reduce((n,m)=>n+m.content.length,0)>10000)s.history.shift();
    if(proposal.kind==='chat'){emit(s,'chat','idle',{text:proposal.text,source:s.mode==='live'?'live-model':'stub-model',verified:false,
      place:safeContext.place,sources:safeContext.sources.map(({itemId,title,roomName,collectionLabel})=>({itemId,title,roomName,collectionLabel}))},requestId);return;}
    const {bodyStart:start,bodyEnd:end}=proposal;
    // Explicit user delimiters are independent evidence of the intended body span.
    // A model cannot trim punctuation/whitespace inside a quoted or marked exact body.
    let explicitSpan;
    const marker=/\b(?:the )?exact message(?: text)? is: ?/i.exec(text);
    if(marker)explicitSpan={start:marker.index+marker[0].length,end:text.length};
    else if(proposal.recipientQuery){
      const recipientEnd=text.indexOf(proposal.recipientQuery)+proposal.recipientQuery.length;
      const quoted=/^\s+(?:saying\s+)?[“"]([\s\S]*)[”"](?: via (?:Example Messages|Example Mail))?$/.exec(text.slice(recipientEnd));
      if(quoted){const opening=text.slice(recipientEnd).search(/[“"]/);explicitSpan={start:recipientEnd+opening+1,end:recipientEnd+opening+1+quoted[1].length};}
    }
    if(explicitSpan&&(start!==explicitSpan.start||end!==explicitSpan.end)){clarify(s,'body',[],requestId);return;}
    if(end<=start||end>text.length||!text.slice(start,end).trim()) {clarify(s,'body',[],requestId);return;}
    // Reject invalid UTF-16 boundaries; preserve bytes without normalization.
    const splitsSurrogate=i=>i>0&&i<text.length&&/[\uD800-\uDBFF]/.test(text[i-1])&&/[\uDC00-\uDFFF]/.test(text[i]);
    if(splitsSurrogate(start)||splitsSurrogate(end)){clarify(s,'body',[],requestId);return;}
    s.slots={body:text.slice(start,end),provenance:{turnId:s.turnId,source:'user-span',start,end}};
    const query=proposal.recipientQuery;
    if(!query||!text.includes(query)){clarify(s,'recipient',[],requestId);return;}
    emit(s,'progress','resolving',{phase:'resolving'},requestId);
    const result=await call(s,'demo_contacts_resolve',{query},epoch);
    // Independent identity allowlist and query match, even if a replaced port is hostile.
    if(!Array.isArray(result.people)||result.people.some(p=>!people.some(known=>isDeepStrictEqual(p,known))||!`${p.label} ${p.detail}`.toLowerCase().includes(query.toLowerCase())))reject('mcp_malformed');
    s.candidates=result.people;
    if(result.people.length===1)s.slots.recipientId=result.people[0].id;
    const channel=channels.find(c=>c.label===proposal.channelQuery&&text.includes(proposal.channelQuery));
    s.slots.channelId=channel?.id;
    finishPreparation(s,requestId);
  }
  return {
    create(input){const value=parse(sessionSchema,input);const previous=creations.get(value.requestId);
      if(previous){if(!isDeepStrictEqual(previous.input,value))reject('request_conflict');return snapshot(get(previous.sessionId));}
      if(sessions.size>=8)reject('session_limit',429);
      if(value.mode==='live'&&!provider?.available)reject('provider_unavailable',503);
      const s={id:id(),mode:value.mode,history:[],epoch:0,state:'idle',events:[],requests:new Map(),turnId:null,preview:null,controller:new AbortController(),operations:0,dispatched:false,quarantine:false,expires:now()+sessionTTL};
      sessions.set(s.id,s);creations.set(value.requestId,{input:value,sessionId:s.id});return snapshot(s);
    },
    events(sessionId,after){return snapshot(get(sessionId),after);},
    async settled(sessionId){await get(sessionId).pending;return snapshot(get(sessionId));},
    command(input){const c=parse(commandSchema,input),s=get(c.sessionId),prior=s.requests.get(c.requestId);
      if(prior){if(!isDeepStrictEqual(prior,c))reject('request_conflict');return snapshot(s);}
      // Stop remains available even after resource exhaustion.
      if(c.kind!=='cancel'&&(s.requests.size>=64||s.events.length>=480))reject('session_budget',429);
      if(c.kind==='cancel'){
        if(s.state==='stopped'||(s.state==='unknown'&&s.events.at(-1)?.type==='cancellation')){
          if(s.requests.size<70)s.requests.set(c.requestId,c);return snapshot(s);
        }
        const uncertain=s.dispatched||s.quarantine;invalidate(s);s.quarantine ||= uncertain;
        emit(s,'cancellation',uncertain?'unknown':'stopped',{effect:uncertain?'unknown':'none'},c.requestId);
        if(s.requests.size<70)s.requests.set(c.requestId,c);return snapshot(s);
      }
      if(s.quarantine || (s.dispatched&&s.state!=='completed'))reject('effect_unknown');
      const p=c.payload;
      if(c.kind==='turn'){
        invalidate(s);s.turnId=id();s.operations=0;s.dispatched=false;s.slots=null;s.candidates=[];
        emit(s,'progress','interpreting',{phase:'interpreting'},c.requestId);
        work(s,c.requestId,epoch=>interpret(s,p.text,p.context,c.requestId,epoch));
      }else if(c.kind==='clarify'){
        if(s.state!=='clarifying'||p.turnId!==s.turnId||!s.clarification?.choices.some(v=>v.id===p.choiceId))reject('clarification_stale');
        const field=s.clarification.field;s.slots[field==='recipient'?'recipientId':'channelId']=p.choiceId;finishPreparation(s,c.requestId);
      }else if(c.kind==='revise'){
        if(s.state!=='preview'||s.preview?.actionId!==p.actionId)reject('confirmation_stale');
        invalidate(s);s.slots={...p,provenance:{turnId:s.turnId,source:'user-edit',start:0,end:p.body.length}};preview(s,c.requestId);
      }else if(c.kind==='confirm'){
        const prepared=s.preview;
        if(s.state!=='preview'||!prepared||prepared.actionId!==p.actionId||prepared.confirmationToken!==p.confirmationToken||prepared.consumed||prepared.epoch!==s.epoch||now()>=prepared.deadline)reject('confirmation_stale');
        prepared.consumed=true;emit(s,'progress','creating',{phase:'creating'},c.requestId);
        work(s,c.requestId,async(epoch)=>{
          if(now()>=prepared.deadline)reject('confirmation_stale');
          const input={actionId:prepared.actionId,recipientId:prepared.recipientId,channelId:prepared.channelId,body:prepared.body};
          if(!active(s,epoch))return;
          s.dispatched=true;
          const created=await call(s,'demo_draft_create',input,epoch);
          emit(s,'progress','verifying',{phase:'verifying'},c.requestId);
          const observed=await call(s,'demo_draft_read',{draftId:created.draftId},epoch);
          const expected={...input,draftId:created.draftId,sent:false};
          if(!isDeepStrictEqual(observed.draft,expected))reject('verification_unknown');
          s.dispatched=false;
          emit(s,'result','completed',{draftId:created.draftId,recipientId:prepared.recipientId,channelId:prepared.channelId,body:prepared.body,effect:'demo_draft_created',verified:true,sent:false,message:'Draft created in the demo. Not sent.'},c.requestId);
        });
      }
      s.requests.set(c.requestId,c);return snapshot(s);
    },
    close(){for(const s of sessions.values())invalidate(s);sessions.clear();creations.clear();}
  };
}
