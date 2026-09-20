// Separately bounded live evidence: exactly one synthetic Room turn, no draft write.
import {randomUUID} from 'node:crypto';
import {connectDemo} from './mcp-host.mjs';
import {createRuntime} from './runtime.mjs';
import {createProvider} from './provider.mjs';
import {VERSION} from './schema.mjs';
if(process.argv[2]!=='--live')throw new Error('Requires explicit --live; never run in CI.');
const mcp=await connectDemo();
const runtime=createRuntime({mcp,provider:createProvider({enabled:true,key:process.env.OPENROUTER_API_KEY??''})});
try{
 const s=runtime.create({version:VERSION,requestId:randomUUID(),mode:'live',consent:true});const start=performance.now();
 const context={place:{kind:'room',roomId:'kitchen',roomName:'Kitchen',purpose:'Recipes, lists and cooking plans'},sources:[{itemId:'vegetable-soup',title:'Vegetable soup',summary:'A simple fictional recipe card.',content:'Ingredients: carrots, onion and vegetable stock.',roomName:'Kitchen',collectionLabel:'Recipes',provenance:'fictional-local-fixture'}]};
 runtime.command({version:VERSION,sessionId:s.sessionId,requestId:randomUUID(),kind:'turn',payload:{text:'According to the supplied Room reference, what ingredients are listed?',context}});
 const result=await runtime.settled(s.sessionId),event=result.events.at(-1);
 const exact=event.type==='chat'&&event.data.sources?.some(source=>source.itemId==='vegetable-soup')&&/carrot/i.test(event.data.text)&&/stock/i.test(event.data.text);
 process.stdout.write(JSON.stringify({case:'one-synthetic-qwen-room-answer',state:result.state,event:event.type,roomSourceBound:event.data.sources?.some(source=>source.itemId==='vegetable-soup')??false,answerGrounded:exact,code:event.data.code??null,elapsedMs:Math.round(performance.now()-start),providerCalls:1,draftWrites:0})+'\n');
 runtime.command({version:VERSION,sessionId:s.sessionId,requestId:randomUUID(),kind:'cancel',payload:{}});
 if(!exact)process.exitCode=1;
}finally{runtime.close();await mcp.close();}
