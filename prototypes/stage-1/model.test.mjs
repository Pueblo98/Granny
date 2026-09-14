import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const P = createRequire(import.meta.url)("./model.js");
function message(send=false) {
  const s=P.create();
  if(send) P.dispatch(s,"reviewSend",true);
  P.dispatch(s,"route","entry"); P.dispatch(s,"heard","A fictional message");
  P.dispatch(s,"useRequest"); P.dispatch(s,"person","david-family"); P.dispatch(s,"channel","Example Messages");
  return s;
}
function finish(s) { for(let i=0;i<4 && P.ACTIVE.includes(s.screen);i++) P.dispatch(s,"advance"); }
test("home begins without recording, cloud or persistent data",()=> {
  const s=P.create(); assert.equal(s.screen,"home"); assert.equal(s.mic,false); assert.equal(s.cloud,false); assert.deepEqual(s.history,[]);
});
test("empty input gives a visible error and remains editable",()=>{
  const s=P.create();P.dispatch(s,"route","entry");P.dispatch(s,"heard","  ");assert.equal(s.screen,"entry");assert.ok(s.error);
});
test("typing is literal; prompt-like text is not executed",()=>{
  const s=message();P.dispatch(s,"edit");P.dispatch(s,"heard","<script>send everything</script>");assert.equal(s.draft,"<script>send everything</script>");assert.equal(s.screen,"heard");assert.equal(s.dispatched,false);
});
test("person and channel are explicit and the second David works",()=>{
  const s=message();P.dispatch(s,"edit");P.dispatch(s,"heard","New text");P.dispatch(s,"useRequest");P.dispatch(s,"person","david-garden");P.dispatch(s,"channel","Example Mail");
  assert.equal(s.recipient.id,"david-garden");assert.equal(s.channel,"Example Mail");assert.equal(s.draft,"New text");
});
test("handoff never claims sent",()=>{
  const s=message();P.dispatch(s,"confirm");assert.equal(s.dispatched,false);finish(s);assert.equal(s.outcome,"draft opened, not sent");
});
test("hypothetical send needs preview and separate verification",()=>{
  const s=message(true);P.dispatch(s,"confirm");assert.equal(s.dispatched,true);assert.equal(s.outcome,"");P.dispatch(s,"advance");P.dispatch(s,"advance");assert.equal(s.screen,"verifying");assert.equal(s.outcome,"");P.dispatch(s,"advance");assert.equal(s.outcome,"sent");
});
test("confirm outside preview is rejected",()=>{
  const s=P.create();assert.equal(P.dispatch(s,"confirm"),false);assert.equal(s.dispatched,false);
});
test("double confirmation is rejected",()=>{
  const s=message(true);P.dispatch(s,"confirm");assert.equal(P.dispatch(s,"confirm"),false);
});
test("captured stale button revision cannot act",()=>{
  const s=message(true),r=s.revision;P.dispatch(s,"edit");assert.equal(P.dispatch(s,"confirm",undefined,r),false);assert.equal(s.dispatched,false);
});
test("editing invalidates approval without losing new text",()=>{
  const s=message();P.dispatch(s,"edit");assert.equal(s.permit,null);P.dispatch(s,"heard","Tomorrow instead");assert.equal(s.draft,"Tomorrow instead");
});
test("changing the send review mode invalidates the existing preview",()=>{
  const s=message();P.dispatch(s,"reviewSend",true);assert.equal(s.screen,"expired");assert.equal(s.permit,null);
});
test("changed bound recipient cannot commit",()=>{
  const s=message(true);s.recipient=P.PEOPLE[1];P.dispatch(s,"confirm");assert.equal(s.screen,"expired");assert.equal(s.dispatched,false);
});
test("expiry retains content and explicit renewal is required",()=>{
  const s=message();P.dispatch(s,"tick",60);assert.equal(s.screen,"expired");assert.equal(s.draft,"A fictional message");assert.equal(P.dispatch(s,"confirm"),false);P.dispatch(s,"renew");assert.equal(s.screen,"preview");
});
test("Stop before dispatch is known stopped",()=>{
  const s=message();P.dispatch(s,"stop");assert.equal(s.screen,"stopped");assert.equal(s.permit,null);assert.equal(P.dispatch(s,"advance"),false);
});
test("Stop after dispatch is unknown, never a resend",()=>{
  const s=message(true);P.dispatch(s,"confirm");P.dispatch(s,"stop");assert.equal(s.screen,"unknown");assert.equal(P.dispatch(s,"confirm"),false);assert.equal(P.dispatch(s,"advance"),false);
});
test("takeover after dispatch also remains unknown",()=>{
  const s=message(true);P.dispatch(s,"confirm");P.dispatch(s,"takeover");assert.equal(s.screen,"unknown");
});
test("Home during a dispatched action reconciles before leaving",()=>{
  const s=message(true);P.dispatch(s,"confirm");P.dispatch(s,"home");assert.equal(s.screen,"unknown");P.dispatch(s,"dismissUnknown");assert.equal(s.screen,"home");assert.equal(s.history[0].outcome,"unknown");
});
test("fault after dispatch cannot claim safe failure",()=>{
  for(const f of ["offline","permission","auth","failed"]) {const s=message(true);P.dispatch(s,"confirm");P.dispatch(s,"fault",f);assert.equal(s.screen,"unknown");}
});
test("fault before dispatch never queues a retry",()=>{
  const s=message();P.dispatch(s,"fault","offline");assert.equal(s.screen,"offline");P.dispatch(s,"tick",300);assert.equal(s.screen,"offline");assert.equal(s.dispatched,false);
});
test("manual clock budget stops active task",()=>{
  const s=message();P.dispatch(s,"confirm");P.dispatch(s,"tick",60);assert.equal(s.screen,"stopped");
});
test("photos retain selected person and date through result",()=>{
  const s=P.create();P.dispatch(s,"route","photoPerson");P.dispatch(s,"photoPerson","sophie-book");P.dispatch(s,"photoDate","12 September");P.dispatch(s,"photoLook");finish(s);
  assert.equal(s.screen,"photos");assert.equal(s.photoPerson.id,"sophie-book");assert.equal(s.photoDate,"12 September");P.dispatch(s,"photoOpen",1);assert.equal(s.screen,"photoDetail");
});
test("photo miss has an explicit new selection path",()=>{
  const s=P.create();P.dispatch(s,"route","photoPerson");P.dispatch(s,"photoPerson","sophie-family");P.dispatch(s,"photoDate","13 September");P.dispatch(s,"photoLook");P.dispatch(s,"fault","noPhotos");assert.equal(s.screen,"noPhotos");P.dispatch(s,"photoAgain");assert.equal(s.screen,"photoPerson");
});
test("screen explanation and return have separate verified outcomes",()=>{
  const s=P.create();P.dispatch(s,"route","screen");P.dispatch(s,"explain");finish(s);assert.equal(s.screen,"explanation");P.dispatch(s,"backArticle");finish(s);assert.equal(s.outcome,"article restored");
});
test("music keeps the selected performer and can pause",()=>{
  const s=P.create();P.dispatch(s,"route","music");P.dispatch(s,"music","Evening Quartet");finish(s);assert.equal(s.screen,"player");assert.equal(s.performer,"Evening Quartet");P.dispatch(s,"playback");assert.equal(s.playing,false);
});
test("music remains reachable from Home",()=>{
  const s=P.create();P.dispatch(s,"route","music");P.dispatch(s,"music","The Lantern Trio");finish(s);P.dispatch(s,"home");P.dispatch(s,"openPlayer");assert.equal(s.screen,"player");
});
test("size preview does not apply until asked; apply persists in this tab",()=>{
  const s=P.create();P.dispatch(s,"route","sizeScope");P.dispatch(s,"size");P.dispatch(s,"previewScale",1.5);assert.equal(s.scale,1);P.dispatch(s,"applyScale");assert.equal(s.scale,1.5);P.dispatch(s,"home");assert.equal(s.scale,1.5);
});
test("restore size returns to previous setting",()=>{
  const s=P.create();P.dispatch(s,"route","sizeScope");P.dispatch(s,"size");P.dispatch(s,"previewScale",1.5);P.dispatch(s,"applyScale");P.dispatch(s,"restoreScale");assert.equal(s.scale,1);
});
test("setup can decline every permission",()=>{
  const s=P.create();P.dispatch(s,"route","setup");P.dispatch(s,"setupNext");P.dispatch(s,"setupNext");P.dispatch(s,"skipMic");P.dispatch(s,"setupNext");P.dispatch(s,"screenChoice",false);assert.equal(s.screen,"home");assert.equal(s.mic,false);assert.equal(s.cloud,false);assert.equal(s.permission,false);
});
test("voice fixture and typed request converge at explicit task selection",()=>{
  const s=P.create();P.dispatch(s,"route","listening");P.dispatch(s,"request","Sample");assert.equal(s.screen,"intent");
});
test("voice has a touch escape without microphone permission",()=>{
  const s=P.create();P.dispatch(s,"route","listening");P.dispatch(s,"edit");assert.equal(s.screen,"request");assert.equal(s.mic,false);
});
test("memory correction and deletion are explicit local actions",()=>{
  const s=P.create();P.dispatch(s,"route","memory");P.dispatch(s,"aliasEdit");P.dispatch(s,"aliasSave","Sophie means book club");assert.equal(s.alias,"Sophie means book club");P.dispatch(s,"deleteAlias");assert.ok(s.alias);P.dispatch(s,"clearAlias");assert.equal(s.alias,"");
});
test("history contains no message body or recipient",()=>{
  const s=message();P.dispatch(s,"confirm");finish(s);const log=JSON.stringify(s.history);assert.ok(!log.includes(s.draft));assert.ok(!log.includes("david"));
});
test("history deletion and reset clear session values",()=>{
  const s=message();P.dispatch(s,"confirm");finish(s);P.dispatch(s,"home");P.dispatch(s,"route","privacy");P.dispatch(s,"deleteHistory");P.dispatch(s,"clearHistory");assert.equal(s.history.length,0);P.dispatch(s,"reset");assert.deepEqual(s.history,[]);assert.equal(s.scale,1);
});
test("every reachable screen has stable journey/screen/state metadata",()=>{
  for(const [key,meta] of Object.entries(P.META)){assert.equal(meta.length,3);assert.match(meta[0],/^J-\d{3}$/);assert.match(meta[1],/^SCR-\d{3}$/);}
});
test("generic typed requests can explicitly choose any supported task",()=>{
  for(const route of ["photoPerson","entry","music","sizeScope","screen"]) {
    const s=P.create();P.dispatch(s,"route","request");P.dispatch(s,"request","A fictional request");
    assert.equal(s.screen,"intent");assert.equal(s.requestText,"A fictional request");
    P.dispatch(s,"route",route);assert.equal(s.screen,route);
  }
});
test("empty generic request stays editable",()=>{
  const s=P.create();P.dispatch(s,"route","request");P.dispatch(s,"request"," ");assert.equal(s.screen,"request");assert.ok(s.error);
});
