/* Narrow same-origin conversation/evidence API. No arbitrary database queries. */
(function(root){
  'use strict';
  const VERSION='granny.conversation.v1';
  function create({fetcher=(...args)=>root.fetch(...args),uuid=()=>root.crypto.randomUUID(),onChange=()=>{}}={}){
    let available=false,error=null,conversations=[],activeId=null;
    const details=new Map();
    const snapshot=()=>({available,error,activeId,conversations:structuredClone(conversations)});
    const notify=()=>onChange(snapshot());
    async function request(path,init={}){
      if(!path.startsWith('/api/conversations')&&!path.startsWith('/api/messages/'))throw new Error('invalid_conversation_route');
      const response=await fetcher(path,{...init,headers:{...(init.body?{'content-type':'application/json'}:{}),...(init.headers||{})}});
      let body;try{body=await response.json();}catch{throw new Error('invalid_json');}
      if(!response.ok){const next=new Error(body?.error?.code||`http_${response.status}`);next.code=body?.error?.code;throw next;}
      if(body.version!==VERSION)throw new Error('invalid_version');return body;
    }
    async function refresh(){
      try{const body=await request('/api/conversations?limit=20');conversations=body.conversations||[];activeId=conversations.find(entry=>entry.active&&!entry.fixture)?.id||null;available=true;error=null;notify();return snapshot();}
      catch(cause){available=false;error=cause.code||cause.message||'conversation_store_unavailable';notify();return snapshot();}
    }
    async function getConversation(id){
      if(!id)return null;
      try{const body=await request('/api/conversations/'+encodeURIComponent(id));details.set(id,body.conversation);available=true;error=null;notify();return structuredClone(body.conversation);}
      catch(cause){error=cause.code||cause.message;notify();return null;}
    }
    async function createConversation(mode='offline_test',place={kind:'home'}){
      const body=await request('/api/conversations',{method:'POST',body:JSON.stringify({version:VERSION,requestId:uuid(),mode,place})});
      activeId=body.conversation.id;details.set(activeId,{...body.conversation,messages:[]});await refresh();return structuredClone(body.conversation);
    }
    async function preference(conversationId,sourceId,value,effectiveAfterMessageId=null){
      const body=await request(`/api/conversations/${encodeURIComponent(conversationId)}/source-preferences`,{method:'POST',body:JSON.stringify({version:VERSION,requestId:uuid(),sourceId,preference:value,effectiveAfterMessageId})});return body.preference;
    }
    async function clearHistory(){
      if(!activeId)return false;await request('/api/conversations/clear-history',{method:'POST',body:JSON.stringify({version:VERSION,requestId:uuid(),activeConversationId:activeId})});
      for(const [id,value] of details)if(!value.active&&!value.fixture)details.delete(id);await refresh();return true;
    }
    async function reset(){
      const body=await request('/api/conversations/reset',{method:'POST',body:JSON.stringify({version:VERSION,requestId:uuid()})});details.clear();activeId=body.conversation.id;await refresh();return body.conversation;
    }
    return {refresh,getConversation,createConversation,selectSourceForNextReply:(conversationId,sourceId,boundary)=>preference(conversationId,sourceId,'selected_next',boundary),excludeSourceFromFutureReplies:(conversationId,sourceId,boundary)=>preference(conversationId,sourceId,'excluded_future',boundary),clearHistory,reset,
      conversation:id=>details.has(id)?structuredClone(details.get(id)):null,
      get state(){return snapshot();},get activeId(){return activeId;},VERSION};
  }
  const api={create,VERSION};root.GrannyConversationData=api;if(typeof module!=='undefined')module.exports=api;
}(typeof window!=='undefined'?window:globalThis));
