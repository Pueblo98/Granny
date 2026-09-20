import * as z from 'zod';
export const VERSION = 'granny.conversation.v1';
export const uuid = z.uuid();
export const bodyText = z.string().min(1).max(2000).refine(s => !!s.trim());
export const people = Object.freeze([
  {id:'david-family',label:'David',detail:'Brother'},
  {id:'david-garden',label:'David',detail:'Gardening group'},
  {id:'sophie-family',label:'Sophie',detail:'Daughter'},
  {id:'sophie-book',label:'Sophie',detail:'Book club'}
]);
export const channels = Object.freeze([{id:'example-messages',label:'Example Messages'},{id:'example-mail',label:'Example Mail'}]);
export const personId = z.enum(people.map(p=>p.id));
export const channelId = z.enum(channels.map(p=>p.id));
export const person = z.strictObject({id:personId,label:z.string().max(30),detail:z.string().max(40)});
export const draft = z.strictObject({draftId:uuid,actionId:uuid,recipientId:personId,channelId,body:bodyText,sent:z.literal(false)});
export const tools = Object.freeze({
  demo_contacts_resolve: {input:z.strictObject({query:z.string().min(1).max(256)}),output:z.strictObject({people:z.array(person).max(4)})},
  demo_draft_create: {input:z.strictObject({actionId:uuid,recipientId:personId,channelId,body:bodyText}),output:z.strictObject({draftId:uuid})},
  demo_draft_read: {input:z.strictObject({draftId:uuid}),output:z.strictObject({draft:draft.nullable()})}
});
export const sessionSchema = z.strictObject({version:z.literal(VERSION),requestId:uuid,mode:z.enum(['demo','live']),consent:z.literal(true)});
export const roomSourceSchema = z.strictObject({
  itemId:z.string().min(1).max(64),
  title:z.string().min(1).max(120),
  summary:z.string().max(500),
  content:z.string().min(1).max(1600),
  roomName:z.string().min(1).max(80),
  collectionLabel:z.string().min(1).max(80),
  provenance:z.literal('fictional-local-fixture')
});
const homeContext = z.strictObject({
  place:z.strictObject({kind:z.literal('home')}),
  sources:z.array(roomSourceSchema).max(0)
});
const roomContext = z.strictObject({
  place:z.strictObject({
    kind:z.literal('room'),roomId:z.string().min(1).max(64),
    roomName:z.string().min(1).max(80),purpose:z.string().max(240)
  }),
  sources:z.array(roomSourceSchema).max(3)
}).superRefine((value,ctx)=>{
  if(value.sources.some(source=>source.roomName!==value.place.roomName))
    ctx.addIssue({code:'custom',message:'source_room_mismatch'});
  if(value.sources.reduce((n,source)=>n+source.content.length+source.summary.length,0)>4800)
    ctx.addIssue({code:'custom',message:'source_context_too_large'});
});
export const conversationContextSchema = z.union([homeContext,roomContext]);
const common = {version:z.literal(VERSION),sessionId:uuid,requestId:uuid};
export const commandSchema = z.discriminatedUnion('kind',[
  z.strictObject({...common,kind:z.literal('turn'),payload:z.strictObject({text:bodyText,context:conversationContextSchema.optional()})}),
  z.strictObject({...common,kind:z.literal('clarify'),payload:z.strictObject({turnId:uuid,choiceId:z.string().min(1).max(64)})}),
  z.strictObject({...common,kind:z.literal('revise'),payload:z.strictObject({actionId:uuid,recipientId:personId,channelId,body:bodyText})}),
  z.strictObject({...common,kind:z.literal('confirm'),payload:z.strictObject({actionId:uuid,confirmationToken:uuid})}),
  z.strictObject({...common,kind:z.literal('cancel'),payload:z.strictObject({})})
]);
export const proposalSchema = z.discriminatedUnion('kind',[
  z.strictObject({kind:z.literal('chat'),text:z.string().min(1).max(3000)}),
  z.strictObject({kind:z.literal('draft'),recipientQuery:z.string().max(256),channelQuery:z.string().max(80),bodyStart:z.number().int().min(0),bodyEnd:z.number().int().min(0)})
]);
export class SafeError extends Error { constructor(code,status=400){super(code);this.code=code;this.status=status;} }
export function parse(schema,value){const r=schema.safeParse(value);if(!r.success)throw new SafeError('invalid_schema');return r.data;}
