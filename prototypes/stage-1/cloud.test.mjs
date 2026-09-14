import assert from "node:assert/strict";
import {createRequire} from "node:module";
import test from "node:test";

const R = createRequire(import.meta.url)("./cloud.js"), V = R.VERSION;
const response = (body, ok = true, status = 200) =>
    ({ok, status, json : async () => body});
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return {promise, resolve, reject};
};
function harness() {
  const queue = [], calls = [], timers = [];
  const fetch = async (url, init) => {
    calls.push({url, init});
    if (!queue.length)
      throw new Error("unexpected_fetch");
    const item = queue.shift();
    return item?.then
               ? item
               : response(item.body, item.ok ?? true, item.status ?? 200);
  };
  let id = 0;
  const runtime = R.create({
    fetch,
    setTimeout : (fn, ms) => {
      timers.push({fn, ms});
      return timers.length;
    },
    clearTimeout : () => {},
    uuid : () => `request-${++id}`
  });
  return {runtime, queue, calls, timers};
}
const snap = (state = "idle", events = [], extra = {}) => ({
  version : V,
  sessionId : "session-1",
  mode : "demo",
  epoch : extra.epoch ?? 0,
  cursor : extra.cursor ?? (events.at(-1)?.seq || 0),
  state,
  events
});
const event = (seq, type, state, data, extra = {}) => ({
  version : V,
  sessionId : "session-1",
  turnId : extra.turnId ?? "turn-1",
  requestId : extra.requestId ?? "request-server",
  actionId : extra.actionId ?? null,
  eventId : `event-${seq}`,
  seq,
  epoch : extra.epoch ?? 1,
  type,
  state,
  data
});
const preview = (seq = 1) => event(seq, "preview", "preview", {
  actionId : "action-1",
  recipient : {id : "p1", label : "David", detail : "Brother"},
  channel : {id : "c1", label : "Example Messages"},
  body : "Exact body",
  effect : "create_demo_draft",
  effectLabel : "Create an unsent draft in the local demo",
  confirmationToken : "token-1",
  expiresAt : "2026-09-15T12:00:00Z",
  provenance : {turnId : "turn-1", source : "user-span", start : 11, end : 21}
},
                                   {actionId : "action-1"});
async function connected(h) {
  h.queue.push({body : snap()});
  assert.equal(await h.runtime.connect(), true);
}

test("no request occurs before explicit connect and session schema is exact",
     async () => {
       const h = harness();
       assert.equal(h.calls.length, 0);
       assert.equal(await h.runtime.command("turn", {text : "x"}), false);
       h.queue.push({body : snap()});
       await h.runtime.connect();
       assert.equal(h.calls[0].url, "/api/runtime/session");
       assert.deepEqual(JSON.parse(h.calls[0].init.body), {
         version : V,
         requestId : "request-1",
         mode : "demo",
         consent : true
       });
     });
test("confirmation stale stays readable until a fresh revised preview",
     async () => {
       const h = harness();
       await connected(h);
       h.queue.push({body : snap("preview", [ preview() ], {epoch : 1})});
       await h.runtime.command("turn", {text : "x"});
       h.queue.push({
         body : {version : V, error : {code : "confirmation_stale"}},
         ok : false,
         status : 409
       });
       assert.equal(await h.runtime.command(
                        "confirm",
                        {actionId : "action-1", confirmationToken : "token-1"}),
                    false);
       assert.equal(h.runtime.view.connection, "connected");
       assert.equal(h.runtime.view.current.data.body, "Exact body");
       assert.equal(h.runtime.view.canConfirm, false);
       const fresh = {
         ...preview(2),
         epoch : 2,
         actionId : "action-2",
         eventId : "event-2",
         data : {
           ...preview(2).data,
           actionId : "action-2",
           confirmationToken : "token-2",
           body : "Edited",
           provenance :
               {turnId : "turn-1", source : "user-edit", start : 0, end : 6}
         }
       };
       h.queue.push({
         body : snap("preview", [ preview(), fresh ], {epoch : 2, cursor : 2})
       });
       await h.runtime.command("revise", {
         actionId : "action-1",
         recipientId : "p1",
         channelId : "c1",
         body : "Edited"
       });
       assert.equal(h.runtime.view.current.data.actionId, "action-2");
       assert.equal(h.runtime.view.canConfirm, true);
       assert.equal(await h.runtime.command(
                        "confirm",
                        {actionId : "action-1", confirmationToken : "token-1"}),
                    false);
     });
test("stale epoch recovery cannot replace newer preview", async () => {
  const h = harness();
  await connected(h);
  h.queue.push({body : snap("preview", [ {...preview(), epoch : 2} ], {epoch : 2})});
  await h.runtime.command("turn", {text : "x"});
  h.queue.push({body : snap("idle", [], {epoch : 1, cursor : 1})});
  assert.equal(await h.runtime.recover(), false);
  assert.equal(h.runtime.view.snapshot.epoch, 2);
  assert.equal(h.runtime.view.current.data.actionId, "action-1");
});
test("duplicate event id at a new sequence forces recovery", async () => {
  const h = harness();
  await connected(h);
  h.queue.push({body : snap("preview", [ preview() ], {epoch : 1})});
  await h.runtime.command("turn", {text : "x"});
  const duplicate = {
    ...event(2, "progress", "creating", {phase : "creating"}, {epoch : 1}),
    eventId : "event-1"
  };
  h.queue.push({
    body : snap("creating", [ preview(), duplicate ], {epoch : 1, cursor : 2})
  });
  assert.equal(
      await h.runtime.command("clarify", {turnId : "turn-1", choiceId : "x"}),
      false);
  assert.equal(h.runtime.view.error, "event_gap");
});
test("current preview alone enables exact confirmation", async () => {
  const h = harness();
  await connected(h);
  h.queue.push({body : snap("preview", [ preview() ], {epoch : 1})});
  await h.runtime.command("turn", {text : "Tell David exact body"});
  assert.equal(h.runtime.view.current.type, "preview");
  assert.equal(h.runtime.view.canConfirm, true);
  const before = h.calls.length;
  assert.equal(
      await h.runtime.command(
          "confirm", {actionId : "wrong", confirmationToken : "token-1"}),
      false);
  assert.equal(h.calls.length, before);
});
test("edit invalidation and old button synchronously no-op", async () => {
  const h = harness();
  await connected(h);
  h.queue.push({body : snap("preview", [ preview() ], {epoch : 1})});
  await h.runtime.command("turn", {text : "x"});
  const stale = {actionId : "action-1", confirmationToken : "token-1"};
  h.runtime.invalidatePreview();
  assert.equal(h.runtime.view.canConfirm, false);
  assert.equal(await h.runtime.command("confirm", stale), false);
});
test("confirm disables before transport and never adds wire revision",
     async () => {
       const h = harness();
       await connected(h);
       h.queue.push({body : snap("preview", [ preview() ], {epoch : 1})});
       await h.runtime.command("turn", {text : "x"});
       const wait = deferred();
       h.queue.push(wait.promise);
       const pending = h.runtime.command(
           "confirm", {actionId : "action-1", confirmationToken : "token-1"});
       assert.equal(h.runtime.view.canConfirm, false);
       assert.equal(h.runtime.view.pending, true);
       const wire = JSON.parse(h.calls.at(-1).init.body);
       assert.deepEqual(wire.payload,
                        {actionId : "action-1", confirmationToken : "token-1"});
       wait.resolve(response(snap(
           "creating",
           [
             preview(), event(2, "progress", "creating", {phase : "creating"},
                              {actionId : "action-1", epoch : 1})
           ],
           {epoch : 1})));
       await pending;
     });
test("gap becomes uncertain and read-only recovery applies contiguous replay",
     async () => {
       const h = harness();
       await connected(h);
       const second =
           event(2, "progress", "creating", {phase : "creating"}, {epoch : 1});
       h.queue.push(
           {body : snap("creating", [ second ], {epoch : 1, cursor : 2})});
       assert.equal(await h.runtime.command("turn", {text : "x"}), false);
       assert.equal(h.runtime.view.connection, "uncertain");
       h.queue.push({
         body : snap("creating",
                     [
                       event(1, "progress", "interpreting",
                             {phase : "interpreting"}, {epoch : 1}),
                       second
                     ],
                     {epoch : 1, cursor : 2})
       });
       assert.equal(await h.runtime.recover(), true);
       assert.equal(h.runtime.view.events.length, 2);
       assert.match(h.calls.at(-1).url, /after=0$/);
     });
test("wrong version or session disables actions", async () => {
  for (const bad of [{version : "other"}, {sessionId : "other"}]) {
    const h = harness();
    await connected(h);
    h.queue.push({body : {...snap(), ...bad}});
    assert.equal(await h.runtime.command("turn", {text : "x"}), false);
    assert.equal(h.runtime.view.connection, "uncertain");
    assert.equal(h.runtime.view.error, "invalid_snapshot");
  }
});
test("late turn completion cannot resurrect after cancellation", async () => {
  const h = harness();
  await connected(h);
  const late = deferred();
  h.queue.push(late.promise);
  const turn = h.runtime.command("turn", {text : "x"});
  h.queue.push({
    body : snap("stopped", [ event(1, "cancellation", "stopped",
                                   {effect : "none"}, {epoch : 2}) ],
                {epoch : 2})
  });
  const stopping = h.runtime.cancel();
  assert.equal(h.runtime.view.stopping, true);
  assert.notEqual(h.runtime.view.snapshot.state, "stopped");
  assert.equal(await stopping, true);
  late.resolve(response(snap("completed", [ event(1, "result", "completed", {
                               draftId : "d",
                               recipientId : "p",
                               channelId : "c",
                               body : "x",
                               effect : "demo_draft_created",
                               verified : true,
                               sent : false,
                               message : "Draft created in the demo. Not sent."
                             },
                                                  {epoch : 1}) ],
                             {epoch : 1})));
  assert.equal(await turn, false);
  assert.equal(h.runtime.view.snapshot.state, "stopped");
});
test("transport loss disables confirmation and recover never resends command",
     async () => {
       const h = harness();
       await connected(h);
       h.queue.push({body : snap("preview", [ preview() ], {epoch : 1})});
       await h.runtime.command("turn", {text : "x"});
       h.queue.push(Promise.reject(new Error("network down")));
       assert.equal(await h.runtime.command("revise", {
         actionId : "action-1",
         recipientId : "p1",
         channelId : "c1",
         body : "new"
       }),
                    false);
       assert.equal(h.runtime.view.connection, "uncertain");
       assert.equal(h.runtime.view.canConfirm, false);
       h.queue.push({body : snap("preview", [], {epoch : 1, cursor : 1})});
       await h.runtime.recover();
       assert.equal(h.calls.at(-1).init.method, "GET");
     });
test("unknown effect forbids turn revise and confirm", async () => {
  const h = harness();
  await connected(h);
  const unknown =
      event(1, "error", "unknown",
            {code : "effect_unknown", effect : "unknown", retryable : false},
            {epoch : 2});
  h.queue.push({body : snap("unknown", [ unknown ], {epoch : 2})});
  await h.runtime.command("turn", {text : "x"});
  const count = h.calls.length;
  for (const [kind, payload] of [[ "turn", {text : "try again"} ],
                                 [ "revise", {} ], [ "confirm", {} ]])
    assert.equal(await h.runtime.command(kind, payload), false);
  assert.equal(h.calls.length, count);
});
test("malformed verified result is never authoritative", async () => {
  const h = harness();
  await connected(h);
  const bad = event(1, "result", "completed", {
    draftId : "d",
    recipientId : "p",
    channelId : "c",
    body : "x",
    effect : "demo_draft_created",
    verified : true,
    sent : true,
    message : "sent"
  },
                    {epoch : 1});
  h.queue.push({body : snap("completed", [ bad ], {epoch : 1, cursor : 1})});
  assert.equal(await h.runtime.command("turn", {text : "x"}), false);
  assert.equal(h.runtime.view.connection, "uncertain");
  assert.notEqual(h.runtime.view.current?.type, "result");
});
test("only one recovery fetch may be in flight", async () => {
  const h = harness();
  await connected(h);
  const wait = deferred();
  h.queue.push(wait.promise);
  const first = h.runtime.recover();
  assert.equal(await h.runtime.recover(), false);
  wait.resolve(response(snap()));
  assert.equal(await first, true);
});
test("disconnect fences late responses and clears tab-memory state",
     async () => {
       const h = harness();
       await connected(h);
       const wait = deferred();
       h.queue.push(wait.promise);
       const turn = h.runtime.command("turn", {text : "x"});
       h.runtime.disconnect();
       wait.resolve(response(snap("preview", [ preview() ], {epoch : 1})));
       assert.equal(await turn, false);
       assert.equal(h.runtime.view.connection, "disconnected");
       assert.equal(h.runtime.view.snapshot, null);
       assert.deepEqual(h.runtime.view.events, []);
     });
