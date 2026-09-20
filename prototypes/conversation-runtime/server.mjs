import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {VERSION,SafeError} from './schema.mjs';
import {connectDemo} from './mcp-host.mjs';
import {createProvider,MODEL,LIMITS} from './provider.mjs';
import {createRuntime} from './runtime.mjs';
import {prototypeAssets as assets} from '../stage-1/serve.mjs';
export async function serve({port=4180,live=false,key='',provider:provided,mcp:providedMcp,runtimeOptions={}}={}){
  const mcp=providedMcp??await connectDemo();const provider=provided??createProvider({enabled:live,key});const runtime=createRuntime({mcp,provider,...runtimeOptions});
  const server=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Permissions-Policy','microphone=(), camera=(), geolocation=()');
    const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
    try{
      const host=`127.0.0.1:${server.address().port}`,origin=`http://${host}`;
      if(req.headers.host!==host||(req.headers.origin&&req.headers.origin!==origin))throw new SafeError('origin_denied',403);
      const url=new URL(req.url,origin);
      if(req.method==='GET'&&url.pathname==='/api/runtime/config'){send(200,{version:VERSION,available:true,liveAvailable:provider.available,model:MODEL,limits:LIMITS});return;}
      if(req.method==='GET'&&url.pathname==='/api/runtime/events'){
        if([...url.searchParams.keys()].some(k=>!['sessionId','after'].includes(k)))throw new SafeError('invalid_schema');
        send(200,runtime.events(url.searchParams.get('sessionId'),Number(url.searchParams.get('after')??0)));return;}
      if(req.method==='POST'&&['/api/runtime/session','/api/runtime/command'].includes(url.pathname)){
        if(req.headers.origin!==origin)throw new SafeError('origin_denied',403);
        if(req.headers['content-type']!=='application/json')throw new SafeError('invalid_content_type',415);
        let bytes=0,chunks=[];
        for await(const c of req){bytes+=c.length;if(bytes>16000)throw new SafeError('body_limit',413);chunks.push(c);}
        let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new SafeError('invalid_json');}
        send(url.pathname.endsWith('/session')?201:202,url.pathname.endsWith('/session')?runtime.create(body):runtime.command(body));return;
      }
      if(['GET','HEAD'].includes(req.method)&&Object.hasOwn(assets,url.pathname)){
        const [item,mime]=assets[url.pathname];
        const bytes=await readFile(new URL('../stage-1/'+item,import.meta.url));
        res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Content-Security-Policy':"default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:bytes);return;
      }
      throw new SafeError('not_found',404);
    }catch(e){send(e instanceof SafeError?e.status:500,{version:VERSION,error:{code:e instanceof SafeError?e.code:'runtime_failure'}});}
  });
  server.requestTimeout=10000;server.headersTimeout=10000;server.maxConnections=32;
  try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});}catch(e){runtime.close();await mcp.close();throw e;}
  return {server,runtime,mcp,url:`http://127.0.0.1:${server.address().port}`,async close(){runtime.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await mcp.close();}};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const options=process.argv.slice(2);if(options.some(v=>v!=='--live'&&!/^\d+$/.test(v)))throw new Error('Use: node server.mjs [port] [--live]');
  const app=await serve({port:Number(options.find(v=>/^\d+$/.test(v))??4180),live:options.includes('--live'),key:process.env.OPENROUTER_API_KEY??''});
  console.log(`Local fictional demo: ${app.url}; MCP ${app.mcp.protocol}. No real sends.`);
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});
}
