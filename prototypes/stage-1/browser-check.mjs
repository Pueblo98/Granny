// Browser-only design checks using installed Chromium and Node's built-in CDP transport.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { serve } from "./serve.mjs";
const output = await mkdtemp(join(tmpdir(),"granny-browser-review-"));
const server = await serve(0), base = "http://127.0.0.1:" + server.address().port;
const chrome = spawn(process.env.GRANNY_CHROMIUM || "/usr/bin/chromium", [
  "--headless", "--disable-gpu", "--no-first-run", "--disable-background-networking",
  "--remote-debugging-port=0", "--user-data-dir="+join(output,"profile"), "about:blank"
], {stdio:["ignore","ignore","pipe"]});
let socket, checks=0, session, seq=0;
const pending=new Map(), errors=[], network=[];
function check(value,message) { assert.ok(value,message); checks++; }
try {
  const wsURL = await new Promise((resolve,reject)=>{
    let log=""; const timeout=setTimeout(()=>reject(new Error("Chromium startup timed out: "+log.slice(-600))),20000);
    chrome.once("error",reject);
    chrome.stderr.on("data",b=>{log+=b;const m=log.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m){clearTimeout(timeout);resolve(m[1]);}});
    chrome.once("exit",code=>{clearTimeout(timeout);reject(new Error("Chromium exited "+code));});
  });
  socket=new WebSocket(wsURL);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  socket.onmessage=e=>{
    const m=JSON.parse(e.data);
    if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);}
    if(m.method==="Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.text);
    if(m.method==="Network.requestWillBeSent") network.push(m.params.request.url);
  };
  const cdp=(method,params={},sessionId=session)=>new Promise((resolve,reject)=>{
    const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(new Error(method+" timed out"));},12000);
    pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const target=await cdp("Target.createTarget",{url:"about:blank"});
  session=(await cdp("Target.attachToTarget",{targetId:target.targetId,flatten:true})).sessionId;
  await cdp("Runtime.enable");await cdp("Page.enable");await cdp("Network.enable");
  const evaluate=async expression=>{
    const r=await cdp("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  const viewport=async(width,height=1000)=>cdp("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:false});
  await viewport(1200);await cdp("Page.navigate",{url:base});
  for(let i=0;i<60;i++){if(await evaluate("!!document.querySelector('#screen-title')"))break;await new Promise(r=>setTimeout(r,50));}
  const click=async selector=>evaluate("(()=>{const b=document.querySelector("+JSON.stringify(selector)+");if(!b||b.disabled)throw Error('Missing or disabled control: '+"+JSON.stringify(selector)+");b.click();return true;})()");
  const action=(event,value)=>click('[data-event="'+event+'"]'+(value===undefined?"":'[data-value="'+value+'"]'));
  const title=()=>evaluate("document.querySelector('h1').textContent");
  const text=()=>evaluate("document.querySelector('#screen').innerText");
  const reset=()=>click("#reset");
  const finish=()=>click("#finish-sample");
  const screen=()=>evaluate("document.querySelector('#trace').textContent");
  const screenshot=async(name)=>{
    const metrics=await cdp("Page.getLayoutMetrics");
    const r=await cdp("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:metrics.cssContentSize.width,height:Math.min(metrics.cssContentSize.height,6000),scale:1}});
    await writeFile(join(output,name+".png"),Buffer.from(r.data,"base64"));
  };
  const layout=async(label)=>{
    const v=await evaluate("({w:innerWidth,sw:document.documentElement.scrollWidth,small:[...document.querySelectorAll('#tablet button')].filter(b=>!b.hidden&&b.getBoundingClientRect().height<55).map(b=>b.textContent),blank:[...document.querySelectorAll('#tablet button')].filter(b=>!b.textContent.trim()).length})");
    check(v.sw<=v.w+1,label+": no horizontal page overflow "+JSON.stringify(v));
    check(v.small.length===0,label+": targets >=56 CSS pixels "+JSON.stringify(v.small));
    check(v.blank===0,label+": controls have text labels");
  };
  check((await title()).includes("What would"),"Home rendered");
  await layout("Home 1200");await screenshot("home-1200");
  check((await evaluate("document.querySelectorAll('.task-card').length"))===5,"five Home shortcuts");
  await action("route","entry");
  await evaluate("document.querySelector('#editor').value='<script>alert(1)</script> I’ll call tomorrow.'");
  await action("heard");await action("useRequest");await action("person","david-garden");await action("channel","Example Mail");
  check((await text()).includes("Gardening group"),"chosen person visible");
  check((await text()).includes("I’ll call tomorrow."),"edited words retained");
  check((await evaluate("document.querySelectorAll('#screen script').length"))===0,"input rendered as text, not markup");
  check(await evaluate("document.activeElement.id==='screen-title'"),"confirmation focuses heading, not commit");
  await click("#expire");check((await screen()).endsWith("expired"),"expired preview");
  check((await text()).includes("I’ll call tomorrow."),"expiry preserves draft");
  await action("renew");await action("confirm");await finish();
  check((await title()).includes("Not sent"),"handoff outcome explicitly not sent");
  await reset();
  await action("route","listening");await action("edit");check((await screen()).endsWith("request"),"voice touch alternative");
  await evaluate("document.querySelector('#editor').value='Find some fictional photos'");await action("request");
  check((await screen()).endsWith("intent"),"generic request preserves explicit task selection");
  await action("route","photoPerson");check((await screen()).endsWith("photoPerson"),"generic request reaches photos");
  await reset();await click("#send-review");
  await action("route","entry");await action("heard");await action("useRequest");await action("person","david-family");await action("channel","Example Messages");await action("confirm");
  check(await evaluate("document.querySelector('#history').disabled"),"navigation cannot hide active task");
  await click("#global-stop");check((await screen()).endsWith("unknown"),"Stop after send is unknown");
  check(!await evaluate("!!document.querySelector('[data-event=confirm]')"),"unknown offers no resend");
  await action("dismissUnknown");check((await screen()).endsWith("home"),"unknown can be dismissed safely");
  await reset();await action("route","photoPerson");await action("photoPerson","sophie-book");await action("photoDate","12 September");await action("photoLook");await finish();
  check((await text()).includes("Book club"),"photo person retained");check((await text()).includes("12 September"),"photo date retained");
  await action("photoOpen",1);check((await title()).includes("seaside"),"photo detail works");
  await reset();await action("route","screen");await action("explain");await finish();await action("backArticle");await finish();
  check((await title()).includes("article"),"screen explanation returns to sample article");
  await reset();await action("route","music");await action("music","Evening Quartet");await finish();await action("playback");
  check((await title()).includes("paused"),"music pause state");
  await reset();await action("route","sizeScope");await action("size");await action("previewScale",1.5);
  check(await evaluate("getComputedStyle(document.documentElement).getPropertyValue('--app-scale').trim()==='1'"),"preview does not apply");
  await action("applyScale");await action("home");
  check(await evaluate("getComputedStyle(document.documentElement).getPropertyValue('--app-scale').trim()==='1.5'"),"size applied across routes");
  await evaluate("document.querySelector('#review-scale').value='2';document.querySelector('#review-scale').dispatchEvent(new Event('change'))");
  for(const width of [360,600,840]){await viewport(width);await layout("Home "+width+" at combined 300%");}
  await screenshot("home-840-300percent");
  await action("route","entry");await action("heard");await action("useRequest");await action("person","david-family");await action("channel","Example Messages");
  for(const width of [360,600,840]){await viewport(width);await layout("Confirmation "+width+" at combined 300%");}
  await screenshot("confirmation-840-300percent");
  await reset();await viewport(360);await action("route","entry");await action("heard");await action("useRequest");await action("person","david-family");await action("channel","Example Messages");await layout("Confirmation 360");await screenshot("confirmation-360");
  // Keyboard activation is deliberate on the focused control; Escape cancels pending preview.
  await cdp("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27});
  await cdp("Input.dispatchKeyEvent",{type:"keyUp",key:"Escape",code:"Escape",windowsVirtualKeyCode:27});
  check((await screen()).endsWith("home"),"Escape leaves confirmation without sending");
  await reset();await click("#settings");await action("route","setup");await action("setupNext");await action("setupNext");await action("skipMic");await action("setupNext");await action("screenChoice",false);
  check((await screen()).endsWith("home"),"setup works without permissions");
  await click("#settings");await action("route","memory");await action("aliasEdit");
  await evaluate("document.querySelector('#editor').value='Sophie means book club'");await action("aliasSave");
  check((await text()).includes("Sophie means book club"),"alias correction");await action("deleteAlias");await action("clearAlias");
  check((await title()).includes("remember"),"alias deletion returns to memory");check((await text()).includes("No remembered"),"alias removed");
  check(await evaluate("localStorage.length===0&&sessionStorage.length===0"),"no browser storage");
  check(errors.length===0,"no runtime exceptions: "+errors.join("; "));
  check(network.every(url=>url.startsWith(base)||url==="about:blank"),"no third-party app requests");
  check((await fetch(base+"/.git/config")).status===404,"server does not expose repository files");
  check((await fetch(base+"/model.js",{method:"POST"})).status===404,"server rejects writes");
  const result={checks,errors,network:[...new Set(network)],screenshots:output,browser:(await cdp("Browser.getVersion",{},undefined)).product};
  await writeFile(join(output,"results.json"),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
} finally {
  if(socket)socket.close();
  chrome.kill("SIGTERM");server.close();
}
