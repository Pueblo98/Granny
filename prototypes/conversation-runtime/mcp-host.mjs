import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { fileURLToPath } from 'node:url';
import { tools, people, parse, SafeError } from './schema.mjs';
export function validateToolOutput(name,result){
  if(!Object.hasOwn(tools,name))throw new SafeError('tool_denied');
  if(result.isError || (result.content?.length ?? 0)>0)throw new SafeError('mcp_malformed');
  const output=parse(tools[name].output,result.structuredContent);
  if(name==='demo_contacts_resolve' && output.people.some(p=>!people.some(known=>JSON.stringify(known)===JSON.stringify(p))))throw new SafeError('mcp_malformed');
  return output;
}
export async function connectDemo(options={}) {
  if(Object.keys(options).some(k=>k!=='timeout'))throw new SafeError('server_denied');
  const {timeout=5000}=options;
  const transport=new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('./mcp-server.mjs',import.meta.url))],env:{PATH:process.env.PATH || '/usr/bin'},stderr:'pipe'});
  // Never forward untrusted child stderr to logs or browser.
  transport.stderr?.on('data',()=>{});
  let protocol;
  const start=transport.start.bind(transport);
  transport.start=async()=>{const receive=transport.onmessage;transport.onmessage=(m)=>{if(m.result?.protocolVersion)protocol=m.result.protocolVersion;receive?.(m);};return start();};
  const client=new Client({name:'granny-demo-host',version:'1.0.0'},{versionNegotiation:{mode:'legacy'}});
  try {
    await client.connect(transport,{timeout});
    if(protocol!=='2025-11-25')throw new Error('protocol_version');
    const listing=await client.listTools({}, {timeout});
    if(JSON.stringify(listing.tools.map(t=>t.name).sort())!==JSON.stringify(Object.keys(tools).sort()) || listing.nextCursor)throw new Error('tool_list');
    if(client.getServerVersion()?.name!=='granny-demo-capabilities'||client.getServerVersion()?.version!=='1.0.0')throw new Error('server_identity');
  } catch {await client.close();throw new SafeError('mcp_unavailable',503);}
  let closed=false;
  return {
    server:client.getServerVersion(),
    protocol,
    async call(name,input,signal){
      if(closed || !Object.hasOwn(tools,name))throw new SafeError('tool_denied');
      const schema=tools[name];const clean=parse(schema.input,input);
      if(signal?.aborted)throw new SafeError('cancelled');
      try {
        const result=await client.callTool({name,arguments:clean},{timeout,signal});
        return validateToolOutput(name,result);
      } catch {throw new SafeError(signal?.aborted?'cancelled':'mcp_failure',502);}
    },
    async close(){closed=true;await client.close();}
  };
}
