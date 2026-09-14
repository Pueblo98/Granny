// Fixed synthetic capability server. stdio is protocol-only; never log tool input.
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { tools, people, parse } from './schema.mjs';
const store = await mkdtemp(join(tmpdir(),'granny-demo-drafts-'));
const records = new Map();
const cleanup = async()=>{await rm(store,{recursive:true,force:true});};
process.once('SIGTERM',async()=>{await cleanup();process.exit(0);});
process.once('SIGINT',async()=>{await cleanup();process.exit(0);});
process.stdin.once('end',async()=>{await cleanup();});
serveStdio(()=>{
  const server = new McpServer({name:'granny-demo-capabilities',version:'1.0.0'});
  const handlers = {
    demo_contacts_resolve:async({query})=>({people:people.filter(p=>`${p.label} ${p.detail}`.toLowerCase().includes(query.toLowerCase()))}),
    demo_draft_create:async(input)=>{
      // Reserve synchronously before filesystem await. An action is never written twice.
      if(records.has(input.actionId)) throw new Error('action_replayed');
      if(records.size>=64) throw new Error('store_limit');
      const draftId=randomUUID(); records.set(input.actionId,draftId);
      await writeFile(join(store,draftId+'.json'),JSON.stringify({...input,draftId,sent:false}),{flag:'wx',mode:0o600});
      return {draftId};
    },
    demo_draft_read:async({draftId})=>{
      try {return {draft:JSON.parse(await readFile(join(store,draftId+'.json'),'utf8'))};}
      catch(e){if(e.code==='ENOENT')return {draft:null};throw e;}
    }
  };
  for(const [name,schema] of Object.entries(tools)) server.registerTool(name,{
    description:'Bounded fictional local demo operation; no external messaging.',
    inputSchema:schema.input,outputSchema:schema.output
  },async(input)=>{
    try {const value=parse(schema.output,await handlers[name](parse(schema.input,input)));return {content:[],structuredContent:value};}
    catch {return {isError:true,content:[{type:'text',text:'demo_operation_failed'}]};}
  });
  return server;
});
