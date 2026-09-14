import assert from "node:assert/strict";
import {createRequire} from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
require("./fixtures.js");
require("./intent.js");
const P = require("./model.js");
const guard = s => ({
  epoch : s.epoch,
  taskId : s.task.id,
  version : s.task.version,
  stage : s.task.stage
});
function preview(body = "I'll call after dinner") {
  const s = P.create();
  P.dispatch(s, "submit", `Tell David ${body}`);
  P.dispatch(s, "choose", "david-family");
  P.dispatch(s, "choose", "Example Messages");
  return s;
}
function approve(s) {
  return P.dispatch(s, "approve", {
    taskId : s.task.id,
    version : s.task.version,
    signature : P.signature(s.task)
  });
}
function advance(s) { return P.dispatch(s, "advance", null, guard(s)); }
test("request clarifies person and channel and preserves body", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Tell David I'll call after dinner");
  assert.equal(s.task.stage, "clarify-person");
  assert.deepEqual(s.task.choices.map(c => c.value),
                   [ "david-family", "david-garden" ]);
  P.dispatch(s, "choose", "david-garden");
  assert.equal(s.task.stage, "clarify-channel");
  P.dispatch(s, "choose", "Example Mail");
  assert.equal(s.task.stage, "preview");
  assert.equal(s.task.slots.body, "I'll call after dinner");
});
test("body remains verbatim", () => {
  const body = "I’ll call AFTER dinner — okay?";
  assert.equal(preview(body).task.slots.body, body);
});
test("supported message phrasings keep their exact content", () => {
  for (const [request, body] of [
           [ "Please message David: Bring tea!", "Bring tea!" ],
           [ "Tell David that I will arrive at 8.", "I will arrive at 8." ],
           [ "Tell Alex, Keep This Case.", "Keep This Case." ]]) {
    const s = P.create();
    P.dispatch(s, "submit", request);
    assert.equal(s.task.kind, "message");
    assert.equal(s.task.slots.body, body);
  }
});
test("unknown input is not arbitrarily classified", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Arrange the universe however you like");
  assert.equal(s.task.kind, "unsupported");
  assert.equal(s.task.stage, "clarify-intent");
  assert.equal(s.task.dispatched, false);
});
test("incidental yes never approves", () => {
  const s = preview(), id = s.task.id;
  P.dispatch(s, "submit", "yes");
  assert.notEqual(s.task.id, id);
  assert.equal(s.task.kind, "unsupported");
});
test("edit invalidates approval and makes fresh exact preview", () => {
  const s = preview(), version = s.task.version, sig = s.task.permit.signature;
  P.dispatch(s, "edit", {body : "Call me tomorrow instead."});
  assert.equal(s.task.stage, "preview");
  assert.ok(s.task.version > version);
  assert.notEqual(s.task.permit.signature, sig);
  assert.equal(s.task.slots.body, "Call me tomorrow instead.");
});
test("approval binds id version and signature", () => {
  for (const key of ["taskId", "version", "signature"]) {
    const s = preview(), v = {
      taskId : s.task.id,
      version : s.task.version,
      signature : P.signature(s.task)
    };
    v[key] = key === "signature" ? "stale" : v[key] + 1;
    assert.equal(P.dispatch(s, "approve", v), false);
    assert.equal(s.task.stage, "expired");
  }
});
test("expiry retains body and renewal refreshes version", () => {
  const s = preview(), v = s.task.version;
  P.dispatch(s, "tick", 60000);
  assert.equal(s.task.stage, "expired");
  assert.equal(s.task.slots.body, "I'll call after dinner");
  P.dispatch(s, "renew");
  assert.equal(s.task.stage, "preview");
  assert.ok(s.task.version > v);
});
test("exact guards lead to truthful unsent result", () => {
  const s = preview();
  approve(s);
  const stale = guard(s);
  advance(s);
  assert.equal(P.dispatch(s, "advance", null, stale), false);
  advance(s);
  advance(s);
  advance(s);
  assert.equal(s.task.outcome, "draft opened, not sent");
  assert.equal(s.task.result.sent, false);
  assert.equal(s.task.result.body, "I'll call after dinner");
});
test("Stop cancels stale callback before dispatch", () => {
  const s = preview();
  approve(s);
  const stale = guard(s);
  P.dispatch(s, "stop");
  assert.equal(s.task.stage, "stopped");
  assert.equal(P.dispatch(s, "advance", null, stale), false);
});
test("Stop after possible dispatch is unknown without resend", () => {
  const s = preview();
  P.dispatch(s, "reviewer", {sendMode : true});
  approve(s);
  advance(s);
  advance(s);
  P.dispatch(s, "stop");
  assert.equal(s.task.stage, "unknown");
  assert.equal(advance(s), false);
  assert.equal(approve(s), false);
});
test("reset epoch and task IDs are monotonic", () => {
  const s = preview(), epoch = s.epoch, id = s.task.id;
  P.dispatch(s, "reset");
  assert.ok(s.epoch > epoch);
  P.dispatch(s, "submit", "Tell David hello");
  assert.ok(s.task.id > id);
});
test("history is content-free and capped", () => {
  const s = P.create();
  s.history = Array.from({length : 20},
                         (_, i) => ({job : "message", outcome : `old-${i}`}));
  P.dispatch(s, "submit", "Tell David secret body");
  P.dispatch(s, "choose", "david-family");
  P.dispatch(s, "choose", "Example Mail");
  approve(s);
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.history.length, 20);
  assert.deepEqual(Object.keys(s.history[0]), [ "job", "outcome" ]);
  assert.doesNotMatch(JSON.stringify(s.history), /secret body/);
});

test("typed clarification replies stay in the current task", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Tell David I'll call after dinner");
  const id = s.task.id;
  assert.equal(P.isFollowup(s, "Brother"), true);
  P.dispatch(s, "submit", "Brother");
  assert.equal(s.task.id, id);
  assert.equal(s.task.slots.recipient.id, "david-family");
  assert.equal(P.isFollowup(s, "Example Mail"), true);
  P.dispatch(s, "submit", "Example Mail");
  assert.equal(s.task.id, id);
  assert.equal(s.task.stage, "preview");
});

test(
    "typed correction edits exact body but yes remains a new unsupported request",
    () => {
      const s = preview(), id = s.task.id;
      assert.equal(P.isFollowup(s, "Actually, make it tomorrow."), true);
      P.dispatch(s, "submit", "Actually, make it tomorrow.");
      assert.equal(s.task.id, id);
      assert.equal(s.task.slots.body, "tomorrow.");
      assert.equal(P.isFollowup(s, "yes"), false);
    });

test("full differentiator and optional channel resolve directly", () => {
  const s = P.create();
  P.dispatch(s, "submit",
             "Write a message to David Brother: Tea at 4 via Example Mail");
  assert.equal(s.task.stage, "preview");
  assert.equal(s.task.slots.recipient.id, "david-family");
  assert.equal(s.task.slots.channel, "Example Mail");
  assert.equal(s.task.slots.body, "Tea at 4");
});

test("missing body asks instead of inventing content", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Write a message to David Brother");
  assert.equal(s.task.stage, "clarify-channel");
  P.dispatch(s, "submit", "Example Messages");
  assert.equal(s.task.stage, "clarify-body");
  P.dispatch(s, "submit", "Exact supplied body.");
  assert.equal(s.task.slots.body, "Exact supplied body.");
});

test("edit rejects forged recipient objects", () => {
  const s = preview(), version = s.task.version;
  assert.equal(
      P.dispatch(s, "edit",
                 {recipient : {id : "david-family", name : "Mallory"}}),
      true);
  assert.equal(s.task.slots.recipient.name, "David");
  assert.ok(s.task.version > version);
  assert.equal(P.dispatch(s, "edit",
                          {recipient : {id : "not-a-fixture", name : "David"}}),
               false);
});

test("replacement archives prior assistant meaning", () => {
  const s = preview();
  P.dispatch(s, "submit", "Something genuinely new");
  assert.equal(s.turns.at(-2).role, "assistant");
  assert.match(s.turns.at(-2).text, /open unsent/i);
});

test("fault ends work immediately and invalidates callbacks", () => {
  for (const fault of ["offline", "permission", "auth", "failed"]) {
    const s = preview();
    approve(s);
    const stale = guard(s);
    P.dispatch(s, "fault", fault);
    assert.equal(s.task.stage, "failed");
    assert.equal(s.task.outcome, fault);
    assert.equal(P.dispatch(s, "advance", null, stale), false);
  }
});

test("hypothetical send mode refreshes and binds exact effect", () => {
  const s = preview();
  const old = P.signature(s.task);
  assert.equal(P.dispatch(s, "reviewer", {sendMode : true}), true);
  assert.equal(s.reviewer.sendMode, true);
  assert.notEqual(P.signature(s.task), old);
  assert.match(P.signature(s.task), /send-message/);
});

test("photos resolve alias and fixed yesterday with truthful fixtures", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Show photos of Sophie from yesterday");
  assert.equal(s.task.stage, "planning");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.task.result.photos.length, 2);
  assert.equal(s.task.result.uncertainDate, false);
  assert.ok(s.task.result.photos.every(p => p.detail === "Daughter"));
});
test("deleted Sophie alias becomes ambiguous and explicit book club works",
     () => {
       const s = P.create();
       P.dispatch(s, "aliasDelete", "sophie");
       P.dispatch(s, "submit", "Find photos of Sophie from 2026-09-12");
       assert.equal(s.task.stage, "clarify-person");
       assert.equal(P.isFollowup(s, "Sophie"), false);
       assert.equal(P.isFollowup(s, "Book club"), true);
       P.dispatch(s, "submit", "Book club");
       approve(s);
       for (let i = 0; i < 4; i++)
         advance(s);
       assert.equal(s.task.result.photos[0].id, "meal");
     });
test("photo no-match and uncertain-date variants stay truthful", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Find photos of Sophie Daughter from last week");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.task.stage, "no-matches");
  assert.equal(s.task.result.uncertainDate, true);
});
test("mark-read photo route requires exact bound preview", () => {
  const s = P.create();
  P.dispatch(
      s, "submit",
      "Show photos of Sophie Daughter from yesterday and mark source as read");
  assert.equal(s.task.stage, "preview");
  assert.match(P.signature(s.task), /open-source-mark-read/);
  assert.equal(
      P.dispatch(
          s, "approve",
          {taskId : s.task.id, version : s.task.version, signature : "wrong"}),
      false);
});
test("screen explanation requires supplied selection and handles safe states",
     () => {
       for (const [id, stage] of [[ "display-settings", "completed" ],
                                  [ "signin", "failed" ],
                                  [ "unknown", "failed" ]]) {
         const s = P.create();
         P.dispatch(s, "submit", "Explain this screen");
         assert.equal(s.task.stage, "clarify-screen");
         P.dispatch(s, "choose", id);
         for (let i = 0; i < 4; i++)
           advance(s);
         assert.equal(s.task.stage, stage);
         assert.equal(s.task.result.screen.id, id);
       }
     });
test("screen explanation simpler and return are contextual", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Explain screen display-settings");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(P.isFollowup(s, "explain more simply"), true);
  P.dispatch(s, "submit", "explain more simply");
  assert.equal(s.task.result.simple, true);
  P.dispatch(s, "submit", "return");
  assert.equal(s.task.result.next, "returned");
});
test(
    "Nina Simone is ambiguous then silent player pauses and survives another task",
    () => {
      const s = P.create();
      P.dispatch(s, "submit", "Play some Nina Simone");
      assert.equal(s.task.stage, "clarify-media");
      P.dispatch(s, "choose", "sinnerman");
      for (let i = 0; i < 4; i++)
        advance(s);
      assert.equal(s.playing, true);
      P.dispatch(s, "submit", "pause");
      assert.equal(s.playing, false);
      P.dispatch(s, "submit", "Something new");
      assert.equal(s.playing, false);
    });
test("readability changes Granny only and restores; external is guidance",
     () => {
       const s = P.create();
       P.dispatch(s, "submit", "Make text larger");
       assert.equal(s.task.stage, "clarify-scope");
       P.dispatch(s, "choose", "granny");
       assert.equal(s.task.stage, "size-preview");
       assert.equal(s.scale, 1);
       P.dispatch(s, "applyScale");
       assert.equal(s.scale, 1.3);
       P.dispatch(s, "restoreScale");
       assert.equal(s.scale, 1);
       const x = P.create();
       P.dispatch(x, "submit", "Make external text largest");
       assert.equal(x.task.outcome, "external guidance only");
       assert.equal(x.scale, 1);
     });
test("unknown acknowledge and manual never retry", () => {
  for (const event of ["acknowledge", "manual"]) {
    const s = preview();
    P.dispatch(s, "reviewer", {fault : "unknown"});
    approve(s);
    for (let i = 0; i < 4; i++)
      advance(s);
    assert.equal(s.task.stage, "unknown");
    assert.equal(P.isFollowup(s, "try again"), false);
    P.dispatch(s, event);
    assert.equal(s.task.stage, "completed");
    assert.match(s.task.text, /not retry|will not retry/i);
  }
});
test("new request invalidates active callback and archives stopped meaning",
     () => {
       const s = preview();
       approve(s);
       const stale = guard(s);
       P.dispatch(s, "submit", "Play some Nina Simone");
       assert.equal(P.dispatch(s, "advance", null, stale), false);
       assert.match(s.turns.at(-2).text, /stopped/i);
     });
test("aliases validate fixtures and clearSession preserves preferences", () => {
  const s = P.create();
  assert.equal(P.dispatch(s, "aliasSave", {label : "X", personId : "forged"}),
               false);
  P.dispatch(s, "setScale", 1.5);
  P.dispatch(s, "applyScale");
  P.dispatch(s, "voice", true);
  P.dispatch(s, "clearSession");
  assert.equal(s.scale, 1.5);
  assert.equal(s.settings.voice, true);
  assert.equal(s.task, null);
});
test("correction after completed send is a fresh unsent local draft", () => {
  const s = preview();
  P.dispatch(s, "reviewer", {sendMode : true});
  approve(s);
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.task.result.sent, true);
  P.dispatch(s, "submit", "change message to corrected local body");
  assert.equal(s.task.stage, "preview");
  assert.equal(s.task.effect, "open-unsent-draft");
  assert.equal(s.task.slots.body, "corrected local body");
});
test("typed ambiguous first name is not selected by substring", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Tell David hello");
  assert.equal(P.isFollowup(s, "David"), false);
  assert.equal(P.dispatch(s, "submit", "David"), true);
  assert.equal(s.task.kind, "unsupported");
});
test("bound hypothetical send reports only simulated verified send", () => {
  const s = P.create();
  P.dispatch(s, "reviewer", {sendMode : true});
  P.dispatch(s, "submit", "Tell David Brother: exact body via Example Mail");
  assert.match(P.signature(s.task), /send-message/);
  approve(s);
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.task.outcome, "fictional message sent");
  assert.equal(s.task.result.sent, true);
});
test("immediate fault after dispatch is unknown, never no-effect", () => {
  const s = preview();
  P.dispatch(s, "reviewer", {sendMode : true});
  approve(s);
  advance(s);
  advance(s);
  assert.equal(s.task.dispatched, true);
  P.dispatch(s, "fault", "offline");
  assert.equal(s.task.stage, "unknown");
  assert.match(s.task.text, /can’t verify/i);
});
test("reviewer None clears configured outcome", () => {
  const s = preview();
  P.dispatch(s, "reviewer", {fault : "unknown"});
  assert.equal(s.reviewer.fault, "unknown");
  P.dispatch(s, "reviewer", {fault : ""});
  assert.equal(s.reviewer.fault, "");
});
test("full reset clears changed preferences while preserving monotonic ids",
     () => {
       const s = preview(), id = s.task.id;
       P.dispatch(s, "voice", true);
       P.dispatch(s, "setScale", 1.5);
       P.dispatch(s, "applyScale");
       P.dispatch(s, "reset");
       assert.equal(s.settings.voice, false);
       assert.equal(s.scale, 1);
       P.dispatch(s, "submit", "Tell David hello");
       assert.ok(s.task.id > id);
     });
test("required participant sample phrases enter intended workflows", () => {
  const samples = [
    [ "Show me the photos Sophie sent yesterday.", "photos", "planning" ],
    [ "Show me Sophie's photos", "photos", "clarify-date" ],
    [ "What am I looking at?", "explain", "clarify-screen" ],
    [ "Make this easier to read.", "readability", "clarify-scope" ],
    [ "make this bigger", "readability", "clarify-scope" ]
  ];
  for (const [text, kind, stage] of samples) {
    const s = P.create();
    P.dispatch(s, "submit", text);
    assert.equal(s.task.kind, kind, text);
    assert.equal(s.task.stage, stage, text);
  }
});
test("sample grammar accepts natural alternate variations", () => {
  for (const text
           of ["Show me Sophie’s photos.",
               "Look for photos of Sophie from yesterday.",
               "What's on the screen?", "Change Granny text to largest."]) {
    const s = P.create();
    P.dispatch(s, "submit", text);
    assert.notEqual(s.task.kind, "unsupported", text);
  }
});
test("photo metadata matches drawings and uses absolute assets", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Show me the photos Sophie sent yesterday.");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.task.result.photos[0].title, "An afternoon in the garden");
  assert.match(s.task.result.photos[0].description, /table.*flowers/i);
  assert.ok(s.task.result.photos.every(p => p.asset.startsWith("/assets/")));
});
test("readability Stop cancels preview without changing scale", () => {
  const s = P.create();
  P.dispatch(s, "submit", "make this bigger");
  P.dispatch(s, "choose", "granny");
  assert.equal(s.task.stage, "size-preview");
  assert.equal(s.previewScale, 1.3);
  P.dispatch(s, "stop");
  assert.equal(s.scale, 1);
  assert.equal(s.previewScale, 1);
});
test("uncertain date can show plausible photos with uncertainty", () => {
  const s = P.create();
  P.dispatch(s, "reviewer", {fault : "uncertainDate"});
  P.dispatch(s, "submit", "Show me Sophie's photos from last week");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.task.stage, "completed");
  assert.ok(s.task.result.photos.length);
  assert.equal(s.task.result.uncertainDate, true);
});
test("completed photos accept bounded date correction", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Show me the photos Sophie sent yesterday.");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(P.isFollowup(s, "12 September"), true);
  P.dispatch(s, "submit", "12 September");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.task.stage, "no-matches");
});
test("Example Messages photo source naturally discloses mark-read effect",
     () => {
       const s = P.create();
       P.dispatch(s, "aliasDelete", "sophie");
       P.dispatch(s, "submit",
                  "Find photos of Sophie Book club from 2026-09-12");
       assert.equal(s.task.stage, "preview");
       assert.match(P.signature(s.task), /open-source-mark-read/);
     });
test("media partial paywall and unavailable never claim playing", () => {
  for (const fault of ["partial", "paywall", "unavailable"]) {
    const s = P.create();
    P.dispatch(s, "reviewer", {fault});
    P.dispatch(s, "submit", "Play Quiet Harbour");
    for (let i = 0; i < 4; i++)
      advance(s);
    assert.equal(s.task.stage, "failed");
    assert.equal(s.task.result.playing, false);
    assert.equal(s.playing, false);
  }
});
test("player identity and archived result survive a new task", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Play Quiet Harbour");
  for (let i = 0; i < 4; i++)
    advance(s);
  assert.equal(s.player.id, "quiet-harbour");
  P.dispatch(s, "submit", "What am I looking at?");
  assert.equal(s.player.id, "quiet-harbour");
  const archived = s.turns.find(t => t.kind === "media");
  assert.equal(archived.result.track.id, "quiet-harbour");
  assert.equal(archived.permit, undefined);
});
