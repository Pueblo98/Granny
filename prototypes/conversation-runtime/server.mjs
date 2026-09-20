import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {VERSION,SafeError,parse,conversationCreateSchema,sourcePreferenceSchema,clearHistorySchema,resetStoreSchema} from './schema.mjs';
import {connectDemo} from './mcp-host.mjs';
import {createProvider,MODEL,LIMITS} from './provider.mjs';
import {createRuntime} from './runtime.mjs';
import {defaultDatabasePath,openConversationStore} from './conversation-store.mjs';
import {prototypeAssets as assets} from '../stage-1/serve.mjs';

const uuidPath='([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})';
const conversationPath=new RegExp(`^/api/conversations/${uuidPath}$`,'i');
const preferencePath=new RegExp(`^/api/conversations/${uuidPath}/source-preferences$`,'i');
const citationPath=new RegExp(`^/api/messages/${uuidPath}/citations$`,'i');

export async function serve({port=4180,live=false,key='',provider:provided,mcp:providedMcp,runtimeOptions={},databasePath=':memory:'}={}){
  const {storeOptions,...safeRuntimeOptions}=runtimeOptions;
  const store=openConversationStore({databasePath,...(storeOptions||{})});
  let mcp;
  try{mcp=providedMcp??await connectDemo();}catch(error){store.close();throw error;}
  const provider=provided??createProvider({enabled:live,key});
  const runtime=createRuntime({mcp,provider,store,providerModel:MODEL,...safeRuntimeOptions});
  const server=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Permissions-Policy','microphone=(), camera=(), geolocation=()');
    const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
    const host=`127.0.0.1:${server.address().port}`,origin=`http://${host}`;
    const readJson=async()=>{
      if(req.headers.origin!==origin)throw new SafeError('origin_denied',403);
      if(req.headers['content-type']!=='application/json')throw new SafeError('invalid_content_type',415);
      let bytes=0;const chunks=[];
      for await(const chunk of req){bytes+=chunk.length;if(bytes>16000)throw new SafeError('body_limit',413);chunks.push(chunk);}
      try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new SafeError('invalid_json');}
    };
    try{
      if(req.headers.host!==host||(req.headers.origin&&req.headers.origin!==origin))throw new SafeError('origin_denied',403);
      const url=new URL(req.url,origin);
      if(req.method==='GET'&&url.pathname==='/api/runtime/config'){
        send(200,{version:VERSION,available:true,liveAvailable:provider.available,model:MODEL,limits:LIMITS,storage:{engine:'sqlite',schemaVersion:store.schemaVersion,persistent:databasePath!==':memory:'}});return;
      }
      if(req.method==='GET'&&url.pathname==='/api/runtime/events'){
        if([...url.searchParams.keys()].some(name=>!['sessionId','after'].includes(name)))throw new SafeError('invalid_schema');
        send(200,runtime.events(url.searchParams.get('sessionId'),Number(url.searchParams.get('after')??0)));return;
      }
      if(req.method==='GET'&&url.pathname==='/api/conversations'){
        if([...url.searchParams.keys()].some(name=>name!=='limit'))throw new SafeError('invalid_schema');
        send(200,{version:VERSION,conversations:store.listConversations({limit:Number(url.searchParams.get('limit')||20)})});return;
      }
      const conversationMatch=conversationPath.exec(url.pathname);
      if(req.method==='GET'&&conversationMatch){send(200,{version:VERSION,conversation:store.getConversation(conversationMatch[1])});return;}
      const citationMatch=citationPath.exec(url.pathname);
      if(req.method==='GET'&&citationMatch){send(200,{version:VERSION,messageId:citationMatch[1],citations:store.fetchMessageCitations(citationMatch[1])});return;}
      if(req.method==='POST'&&url.pathname==='/api/runtime/session'){send(201,runtime.create(await readJson()));return;}
      if(req.method==='POST'&&url.pathname==='/api/runtime/command'){send(202,runtime.command(await readJson()));return;}
      if(req.method==='POST'&&url.pathname==='/api/conversations'){
        const body=parse(conversationCreateSchema,await readJson());
        send(201,{version:VERSION,conversation:store.createConversation({requestId:body.requestId,mode:body.mode,place:body.place||{kind:'home'}})});return;
      }
      const preferenceMatch=preferencePath.exec(url.pathname);
      if(req.method==='POST'&&preferenceMatch){
        const body=parse(sourcePreferenceSchema,await readJson());
        send(200,{version:VERSION,preference:store.setSourcePreference({conversationId:preferenceMatch[1],...body})});return;
      }
      if(req.method==='POST'&&url.pathname==='/api/conversations/clear-history'){
        const body=parse(clearHistorySchema,await readJson());
        send(200,{version:VERSION,result:store.clearConversationHistory(body.activeConversationId)});return;
      }
      if(req.method==='POST'&&url.pathname==='/api/conversations/reset'){
        parse(resetStoreSchema,await readJson());send(200,{version:VERSION,conversation:store.resetAll()});return;
      }
      if(['GET','HEAD'].includes(req.method)&&Object.hasOwn(assets,url.pathname)){
        const [item,mime]=assets[url.pathname],bytes=await readFile(new URL('../stage-1/'+item,import.meta.url));
        res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Content-Security-Policy':"default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:bytes);return;
      }
      throw new SafeError('not_found',404);
    }catch(error){send(error instanceof SafeError?error.status:500,{version:VERSION,error:{code:error instanceof SafeError?error.code:'runtime_failure'}});}
  });
  server.requestTimeout=10000;server.headersTimeout=10000;server.maxConnections=32;
  try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});}catch(error){runtime.close();await mcp.close();store.close();throw error;}
  return {server,runtime,mcp,store,url:`http://127.0.0.1:${server.address().port}`,async close(){runtime.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await mcp.close();store.close();}};
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const options=process.argv.slice(2);if(options.some(value=>value!=='--live'&&!/^\d+$/.test(value)))throw new Error('Use: node server.mjs [port] [--live]');
  const app=await serve({port:Number(options.find(value=>/^\d+$/.test(value))??4180),live:options.includes('--live'),key:process.env.OPENROUTER_API_KEY??'',databasePath:defaultDatabasePath()});
  console.log(`Local fictional demo: ${app.url}; MCP ${app.mcp.protocol}; SQLite schema ${app.store.schemaVersion}. No real sends.`);
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});
}
