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
  assert.equal(s.task.stage, "failed");
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

test("typed correction edits exact body but yes remains a new unsupported request", () => {
  const s = preview(), id = s.task.id;
  assert.equal(P.isFollowup(s, "Actually, make it tomorrow."), true);
  P.dispatch(s, "submit", "Actually, make it tomorrow.");
  assert.equal(s.task.id, id);
  assert.equal(s.task.slots.body, "tomorrow.");
  assert.equal(P.isFollowup(s, "yes"), false);
});

test("full differentiator and optional channel resolve directly", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Write a message to David Brother: Tea at 4 via Example Mail");
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
  assert.equal(P.dispatch(s, "edit", {recipient : {id : "david-family", name : "Mallory"}}), true);
  assert.equal(s.task.slots.recipient.name, "David");
  assert.ok(s.task.version > version);
  assert.equal(P.dispatch(s, "edit", {recipient : {id : "not-a-fixture", name : "David"}}), false);
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

test("hypothetical send mode is denied in Wave 1", () => {
  const s = preview();
  assert.equal(P.dispatch(s, "reviewer", {sendMode : true}), false);
  assert.equal(s.reviewer.sendMode, false);
  assert.match(P.signature(s.task), /open-unsent-draft/);
});
