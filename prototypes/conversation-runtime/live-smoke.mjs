// Separately bounded live evidence: exactly one synthetic interpretation, no draft write.
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
 runtime.command({version:VERSION,sessionId:s.sessionId,requestId:randomUUID(),kind:'turn',payload:{text:'Prepare an unsent message to David Brother via Example Messages. The exact message is: I will call after dinner.'}});
 const result=await runtime.settled(s.sessionId),event=result.events.at(-1);
 const exact=event.type==='preview'&&event.data.body==='I will call after dinner.'&&event.data.recipient.id==='david-family'&&event.data.channel.id==='example-messages';
 process.stdout.write(JSON.stringify({case:'one-synthetic-qwen-draft-proposal',state:result.state,event:event.type,exact,code:event.data.code??null,elapsedMs:Math.round(performance.now()-start),providerCalls:1,draftWrites:0})+'\n');
 runtime.command({version:VERSION,sessionId:s.sessionId,requestId:randomUUID(),kind:'cancel',payload:{}});
 if(!exact)process.exitCode=1;
}finally{runtime.close();await mcp.close();}
