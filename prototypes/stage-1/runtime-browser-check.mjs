// Frontend transport-fixture evidence only. This is NOT the MCP integration
// test: responses below are deliberately supplied by the test, not a backend.
import assert from 'node:assert/strict';
import {browser} from './browser-driver.mjs';

const b = await browser();
let checks = 0;
const check = (value, label) => { assert(value, label); checks++; };
const text = () => b.evaluate('document.body.innerText');
const button = label => b.evaluate(`(() => {
  const el = [...document.querySelectorAll('button')].find(b => b.textContent === ${JSON.stringify(label)});
  if (!el || el.disabled) throw Error('Button unavailable: ' + ${JSON.stringify(label)});
  el.click();
})()`);
const menu = async name => { await b.click('#menu-button'); await b.click('[data-menu="' + name + '"]'); };
const command = async value => { await b.fill('#request', value); await b.click('#composer button[type=submit]'); };
const emit = (type, state, data, epoch = 1) => b.evaluate(`window.__wire.emit(${JSON.stringify({type, state, data, epoch})})`);
const waitState = state => b.waitFor(`document.querySelector('#current-task')?.dataset.stage === ${JSON.stringify(state)}`);
const preview = (body = 'Call after dinner.', actionId = '00000000-0000-4000-8000-000000000003') => ({
  actionId, recipient: {id: 'david-family', label: 'David', detail: 'Brother'},
  channel: {id: 'demo-messages', label: 'Demo Messages'}, body,
  effect: 'create_demo_draft', effectLabel: 'Create an unsent draft in the local demo',
  confirmationToken: '00000000-0000-4000-8000-000000000004',
  expiresAt: new Date(Date.now() + 60000).toISOString(),
  provenance: {turnId: '00000000-0000-4000-8000-000000000002', source: 'user-edit', start: 0, end: body.length}
});
const wire = async () => b.evaluate(`(() => {
  const version = 'granny.conversation.v1';
  const sessionId = '00000000-0000-4000-8000-000000000001';
  const turnId = '00000000-0000-4000-8000-000000000002';
  const w = window.__wire = {requests: [], fail: false,
    snapshot: {version, sessionId, mode:'demo', epoch:0, cursor:0, state:'idle', events:[]}};
  w.emit = ({type,state,data,epoch}) => {
    const seq = w.snapshot.cursor + 1;
    const event = {version, sessionId, turnId, requestId: crypto.randomUUID(),
      actionId: data.actionId || null, eventId: crypto.randomUUID(), seq, epoch, type, state, data};
    w.snapshot = {...w.snapshot, epoch, cursor:seq, state, events:[...w.snapshot.events,event]};
  };
  window.fetch = async (url, options = {}) => {
    const body = options.body ? JSON.parse(options.body) : null;
    w.requests.push({url, body});
    if (w.fail) throw new TypeError('fixture connection unavailable');
    if (url.endsWith('/config')) return {ok:true, status:200, json: async () => ({version, available:true, liveAvailable:w.liveAvailable === true, model:'stub',limits:{}})};
    if (url.endsWith('/session') && body?.mode) w.snapshot.mode = body.mode;
    if (body?.kind === 'cancel') w.emit({type:'cancellation', state:w.snapshot.state === 'unknown' ? 'unknown' : 'stopped',
      data:{effect:w.snapshot.state === 'unknown' ? 'unknown' : 'none'}, epoch:w.snapshot.epoch+1});
    if (w.reject && body?.kind === w.reject.kind) {
      const code = w.reject.code; w.reject = null;
      return {ok:false,status:409,json:async()=>({version,error:{code}})};
    }
    return {ok:true, status:body?.kind ? 202 : 201, json: async () => structuredClone(w.snapshot)};
  };
})()`);

try {
  await b.viewport(840, 1000);
  await b.navigate();
  check(!b.network.some(url => url.includes('/api/')), 'scripted default performs no runtime request');
  await wire();
  await menu('settings'); await b.click('#settings-about'); await b.click('#about-connection');
  check((await text()).includes('fictional details only'), 'connection has explicit fictional-data disclosure');
  await button('Use offline test replies');
  await waitState('idle');
  check(await b.evaluate('window.__wire.requests.some(r => r.body?.mode === "demo" && r.body.consent === true)'), 'explicit demo session consent, no live mode');
  await emit('clarification', 'clarifying', {field:'recipient',prompt:'Which David?',choices:[{id:'david-family',label:'David',detail:'Brother'}]});
  await command('Tell David Call after dinner.');
  await waitState('clarifying');
  check((await text()).includes('David — Brother'), 'only runtime clarification choices rendered');
  const first = preview();
  await emit('preview', 'preview', first);
  await button('David — Brother');
  await waitState('preview');
  check((await text()).includes(first.body) && (await text()).includes('Demo Messages'), 'exact runtime preview visible');
  await button('Change message');
  await b.fill('[aria-label="Message"]', '<b>Keep these exact words</b>');
  // A navigation request during a live preview must first use the same
  // interruption confirmation; selecting Settings cannot hide active Stop.
  await b.click('#menu-button'); await b.waitFor('!!document.querySelector("#confirm-dialog[open]")');
  await b.click('#confirm-dialog button[value=confirm]'); await b.waitFor('document.querySelector("#menu").open');
  await b.click('[data-menu="text"]');
  await b.click('#pref-scale-15'); await b.click('#apply-preferences'); await button('Return to conversation');
  check(await b.evaluate('document.querySelector("[aria-label=Message]").value === "<b>Keep these exact words</b>"'), 'connected editor survives settings');
  await emit('preview', 'preview', preview('<b>Keep these exact words</b>', '00000000-0000-4000-8000-000000000005'), 2);
  await button('Review changes');
  await b.waitFor('!!document.querySelector("[data-action=runtime-confirm]")');
  check(await b.evaluate('!document.querySelector("blockquote b")'), 'runtime body rendered as text, never HTML');
  check(await b.evaluate('window.__wire.requests.some(r => r.body?.kind === "revise" && r.body.payload.body === "<b>Keep these exact words</b>")'), 'revision sends actual edit');
  await emit('progress', 'creating', {phase:'creating'}, 2);
  await button('Create this unsent demo draft');
  await waitState('creating');
  check(await b.evaluate('window.__wire.requests.filter(r => r.body?.kind === "confirm").length === 1'), 'exact confirmation dispatched once');
  check(await b.evaluate('!document.querySelector("#stop-button").hidden'), 'Stop is reachable during backend creation');
  await b.fill('#request', 'Do not lose this unfinished input');
  await b.evaluate('document.querySelector("#request").focus({preventScroll:true}); document.querySelector("#request").setSelectionRange(3,8); window.scrollTo(0,0)');
  await new Promise(resolve => setTimeout(resolve, 2200));
  check(await b.evaluate('document.querySelector("#current-task").dataset.stage === "creating"'), 'no scripted timer manufactures backend completion');
  await emit('progress', 'verifying', {phase:'verifying'}, 2);
  await waitState('verifying');
  const progressFocus = await b.evaluate('({active:document.activeElement.id,selection:document.querySelector("#request").selectionStart,scroll:window.scrollY})');
  check(progressFocus.active === 'request' && progressFocus.selection === 3 && progressFocus.scroll === 0, 'runtime progress preserves focus selection and scroll: ' + JSON.stringify(progressFocus));
  await b.screenshot('connected-verifying-tablet');
  await emit('result', 'completed', {draftId:'00000000-0000-4000-8000-000000000007',recipientId:first.recipient.id,channelId:first.channel.id,
    body:'<b>Keep these exact words</b>', effect:'demo_draft_created',verified:true,sent:false,message:'Draft created in the demo. Not sent.'}, 2);
  await waitState('completed');
  check((await text()).includes('created and checked. It has not been sent.'), 'only verified backend result claims completion');
  check((await text()).includes('Your unsent demo draft'), 'completed card uses result wording, not a new preparation prompt');
  check(await b.evaluate('document.querySelector("#request").value === "Do not lose this unfinished input"'), 'completion preserves unfinished composer');
  await b.viewport(360, 480);
  await emit('progress', 'interpreting', {phase:'interpreting'}, 3);
  await command('Tell David Another fictional message.');
  await waitState('interpreting');
  check(await b.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'connected large text narrow viewport has no page overflow');
  check(await b.evaluate('[...document.querySelectorAll("#stop-button,#stop-fallback")].some(e=>{const r=e.getBoundingClientRect();return e.getClientRects().length && r.top>=0 && r.bottom<=innerHeight && e.contains(document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2));})'), 'Stop remains visible and hittable at narrow constrained height');
  await b.screenshot('connected-narrow-stop');
  await b.click('#stop-button');
  await waitState('stopped');
  check((await text()).includes('No draft was created by this request.'), 'backend cancellation acknowledgment produces stopped result');
  await b.viewport(840, 1000);
  await emit('preview','preview',preview('Uncertain draft'),5);
  await command('Tell David Uncertain draft');
  await waitState('preview');
  await b.evaluate('window.__wire.fail = true');
  await button('Create this unsent demo draft');
  await b.waitFor('document.body.innerText.includes("connection was interrupted")');
  check(!await b.evaluate('!!document.querySelector("[data-action=runtime-confirm]")'), 'transport loss disables confirmation');
  await b.evaluate('window.__wire.fail = false');
  await emit('error','unknown',{code:'demo_write_uncertain',effect:'unknown',retryable:false},5);
  await button('Check connection');
  await waitState('unknown');
  const confirms = await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "confirm").length');
  await command('Tell David Try again');
  check(await b.evaluate('document.querySelector("#request").value === "Tell David Try again"'), 'unknown prevents new consequential task and retains input');
  check(confirms === await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "confirm").length'), 'recovery never resends confirmation');
  await menu('settings'); await b.click('#settings-about'); await b.click('#about-connection');
  await menu('privacy');
  await b.click('#privacy-delete');
  await b.click('#confirm-dialog button[value=confirm]');
  await b.waitFor('!document.querySelector("#current-task")');
  check(await b.evaluate('!document.querySelector("#mode-notice").hidden && document.querySelector("#mode-notice").textContent.includes("unknown")'), 'reset retains unknown-outcome warning');
  await menu('settings'); await b.click('#settings-about'); await b.click('#about-connection');
  check(!await b.evaluate('[...document.querySelectorAll("button")].some(b=>b.textContent === "Use offline test replies")'), 'reset cannot create a new connected session after unknown');
  await b.navigate(); await wire(); await menu('settings'); await b.click('#settings-about'); await b.click('#about-connection'); await button('Use offline test replies'); await waitState('idle');
  await emit('preview', 'preview', preview('Keep the expired words.'));
  await command('Tell David Keep the expired words.'); await waitState('preview');
  await b.evaluate('window.__wire.reject = {kind:"confirm",code:"confirmation_stale"}');
  await button('Create this unsent demo draft');
  await b.waitFor('!!document.querySelector("[data-action=runtime-renew]")');
  check((await text()).includes('Keep the expired words.'), 'expired server approval leaves draft readable');
  await emit('preview','preview',preview('Keep the expired words.','00000000-0000-4000-8000-000000000009'),2);
  await button('Review again');
  await b.waitFor('!!document.querySelector("[data-action=runtime-confirm]")');
  check(await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "confirm").length === 1 && window.__wire.requests.some(r=>r.body?.kind === "revise")'), 'renewal revises, never retries consequential confirmation');
  await b.click('#stop-button'); await waitState('stopped');
  check(!await b.evaluate('!!document.querySelector("#review-panel")'), 'reviewer controls absent from connected participant view');
  check(await b.evaluate('localStorage.length === 0 && sessionStorage.length === 0'), 'connected client adds no browser persistence');
  await b.navigate(); await wire(); await menu('settings'); await b.click('#settings-about'); await b.click('#about-connection');
  await b.waitFor('document.body.innerText.includes("The live model is unavailable")');
  check((await text()).includes('Offline test mode is not AI'), 'offline fallback is clearly distinguished from live AI');
  check(await b.evaluate('window.__wire.requests.every(r=>!r.body?.mode)'), 'automatic availability check creates no session');
  await b.evaluate('window.__wire.liveAvailable = true');
  await button('Check live AI again');
  await b.waitFor('[...document.querySelectorAll("button")].some(b=>b.textContent === "Use live AI chat")');
  check(await b.evaluate('[...document.querySelectorAll("button")].find(b=>b.textContent === "Use live AI chat").classList.contains("primary")'), 'live AI is the primary connection action');
  await button('Use live AI chat');
  check((await text()).includes('will go to OpenRouter/Qwen'), 'live mode has separate provider-egress disclosure');
  check(await b.evaluate('window.__wire.requests.every(r=>!r.body?.mode)'), 'opening consent creates no live session');
  await b.evaluate("new Promise(resolve => { const dialog = document.querySelector('#confirm-dialog'); dialog.addEventListener('close', resolve, {once:true}); dialog.querySelector('button[value=cancel]').click(); })");
  check(await b.evaluate('window.__wire.requests.every(r=>!r.body?.mode)'), 'declining consent has no session side effect');
  await button('Use live AI chat');
  await b.click('#confirm-dialog button[value=confirm]'); await waitState('idle');
  check(await b.evaluate('window.__wire.requests.some(r=>r.body?.mode === "live" && r.body.consent === true)'), 'affirmative consent binds a live session');
  check((await text()).includes('go to OpenRouter'), 'persistent mode label identifies live egress');
  check(await b.evaluate('window.__wire.requests.every(r=>r.body?.kind !== "turn")'), 'live connection makes no model turn automatically');
  await menu('help'); await b.click('#help-ask'); await b.waitFor('document.activeElement.id === "request"');
  check(await b.evaluate('document.activeElement.id === "request" && document.querySelector("#mode-notice").textContent.includes("Live model")'), 'Help Ask Granny returns to the shared live composer');
  await command('Hello from Help');
  check(await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "turn").at(-1).body.payload.text === "Hello from Help"'), 'Help conversation entry routes through the live runtime');
  await menu('search'); await b.fill('#support-query', 'a question not in saved fixtures');
  await b.waitFor('!!document.querySelector("#search-ask")'); await b.click('#search-ask');
  check(await b.evaluate('document.querySelector("#request").value === "a question not in saved fixtures"'), 'Search Ask Granny hands its words to the shared composer');
  await b.click('#composer button[type=submit]');
  check(await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "turn").at(-1).body.payload.text === "a question not in saved fixtures"'), 'Search conversation entry routes through the live runtime');
  await command('Hello from Home');
  const homeContext = await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "turn").at(-1).body.payload.context');
  check(homeContext.place.kind === 'home' && homeContext.sources.length === 0, 'Home sends no Room references');
  await menu('settings'); await b.click('#settings-conversation'); await b.click('#conversation-new');
  await b.click('#confirm-dialog button[value=confirm]'); await waitState('idle');
  check(await b.evaluate(`(() => {
    const sessions=window.__wire.requests.filter(r=>r.body?.mode);
    return sessions.length === 2 && sessions.at(-1).body.mode === 'live' &&
      document.querySelector('#mode-notice').textContent.includes('Live model');
  })()`), 'New conversation starts a fresh session without dropping live mode');
  const roomIds = ['kitchen','fitness','trips','garden','reading','projects'];
  for (const id of roomIds) {
    await b.click('#rooms-button'); await b.click('#library-room-' + id);
    await b.waitFor(`document.querySelector('#room-surface')?.dataset.roomId === ${JSON.stringify(id)}`);
    await command(id === 'kitchen' ? 'What is in the vegetable soup?' : 'What can I find in this room?');
    const context = await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "turn").at(-1).body.payload.context');
    check(context.place.kind === 'room' && context.place.roomId === id,
      'connected assistant sends current place for ' + id);
    check(context.sources.length <= 3 && context.sources.every(source =>
      source.roomName === context.place.roomName && source.provenance === 'fictional-local-fixture'),
      'connected assistant bounds current-Room sources for ' + id);
    check(!JSON.stringify(context).includes('Passport details'), 'private source absent for ' + id);
  }
  await b.click('#rooms-button'); await b.click('#library-room-kitchen');
  await b.click('#all-collections'); await b.click('#collection-recipes');
  await b.click('[data-item-id="vegetable-soup"]'); await b.click('#ask-room-item');
  await b.waitFor('document.querySelector("#request").value.trim().length > 0 && !!document.querySelector("#room-source-cue")');
  await b.click('#composer button[type=submit]');
  const itemContext = await b.evaluate('window.__wire.requests.filter(r=>r.body?.kind === "turn").at(-1).body.payload.context');
  check(itemContext.place.roomId === 'kitchen' && itemContext.sources.some(source=>source.itemId === 'vegetable-soup'), 'item-level Ask Granny routes through live runtime with its bounded Room source');
  await emit('chat','idle',{text:'The Vegetable soup card includes carrots.',source:'live-model',verified:false,
    place:{kind:'room',roomId:'kitchen',roomName:'Kitchen',purpose:'Recipes, lists and cooking plans'},
    sources:[{itemId:'vegetable-soup',title:'Vegetable soup',roomName:'Kitchen',collectionLabel:'Recipes'}]},1);
  await command('Please use the vegetable soup card.');
  await b.waitFor('document.querySelector("#current-task")?.textContent.includes("The Vegetable soup card includes carrots.")');
  check(await b.evaluate(`(() => {
    const paragraphs = [...document.querySelectorAll('#current-task p:not(.notice)')];
    return paragraphs.length === 1 && paragraphs[0].textContent === 'The Vegetable soup card includes carrots.' &&
      !document.querySelector('#current-task').textContent.includes('What would you like help with?');
  })()`), 'chat card renders one model response without a duplicate generic prompt');
  await b.waitFor('document.body.innerText.includes("Used fictional Room source: Vegetable soup")');
  check(await b.evaluate('document.querySelector("#room-surface")?.dataset.roomState === "conversation"'), 'live answer renders inside the current Room');
  check((await text()).includes('Assistant text, not a verified action result.'), 'Room model answer remains explicitly non-action text');
  await b.evaluate('document.querySelector("#current-task").scrollIntoView({block:"center"})');
  await b.screenshot('connected-room-answer');
  check(b.errors.length === 0, 'no browser exceptions');
  check(b.network.every(url => url.startsWith(b.base) || url === 'about:blank'), 'no external runtime requests');
  console.log(JSON.stringify({checks, evidence:'frontend wire fixtures, not real MCP', screenshots:b.output, errors:b.errors},null,2));
} finally { await b.close(); }
