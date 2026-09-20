import assert from "node:assert/strict";
import {createRequire} from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
require("./fixtures.js");
require("./intent.js");
const P = require("./model.js");

const guard = s => ({epoch: s.epoch, taskId: s.task.id,
  version: s.task.version, stage: s.task.stage});
const outcome = (s, action, extra = {}) => P.dispatch(s, "outcome", {
  taskId: s.task.id, version: s.task.version, action, ...extra
});
function advanceToEnd(s) {
  for (let i = 0; i < 4; i++) assert.equal(P.dispatch(s, "advance", null, guard(s)), true);
}
function bookPhotos() {
  const s = P.create();
  P.dispatch(s, "aliasDelete", "sophie");
  P.dispatch(s, "submit", "Show photos of Sophie Book club from yesterday");
  assert.equal(s.task.stage, "preview");
  assert.match(P.signature(s.task), /open-source-mark-read/);
  assert.equal(P.dispatch(s, "approve", {taskId: s.task.id, version: s.task.version,
    signature: P.signature(s.task)}), true);
  advanceToEnd(s);
  return s;
}

test("outcome actions require the exact current message version", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Tell David hello");
  P.dispatch(s, "choose", "david-family");
  P.dispatch(s, "choose", "Example Messages");
  const version = s.task.version;
  P.dispatch(s, "edit", {body: "A changed exact body."});
  assert.equal(outcome(s, "guidance", {version}), false);
  assert.equal(s.task.slots.body, "A changed exact body.");
});

test("Book club photos retain the bound mark-read preview and have bounded indexes", () => {
  const s = bookPhotos();
  assert.equal(s.task.result.photos.length, 3);
  assert.equal(s.task.result.index, 0);
  assert.equal(outcome(s, "photo", {index: 2}), true);
  assert.equal(s.task.result.index, 2);
  assert.equal(outcome(s, "photo", {index: -1}), false);
  assert.equal(outcome(s, "photo", {index: 3}), false);
  assert.equal(s.task.result.index, 2);
});

test("photo date recovery retains person and invalidates the old outcome version", () => {
  const s = bookPhotos(), person = s.task.slots.person, old = s.task.version;
  assert.equal(outcome(s, "date"), true);
  assert.equal(s.task.stage, "clarify-date");
  assert.equal(s.task.slots.person, person);
  assert.ok(s.task.version > old);
  assert.equal(P.dispatch(s, "outcome", {taskId: s.task.id, version: old,
    action: "photo", index: 0}), false);
});

test("photo person recovery retains the selected date", () => {
  const s = bookPhotos(), date = s.task.slots.date;
  assert.equal(outcome(s, "person"), true);
  assert.equal(s.task.stage, "clarify-person");
  assert.equal(s.task.slots.date, date);
  assert.equal(s.task.choices.length, 2);
});

test("no-photo outcome remains explicit and offers only bounded recovery", () => {
  const s = P.create();
  P.dispatch(s, "reviewer", {fault: "noPhotos"});
  P.dispatch(s, "submit", "Show photos of Sophie from yesterday");
  advanceToEnd(s);
  assert.equal(s.task.stage, "no-matches");
  assert.deepEqual(s.task.result.photos, []);
  assert.match(s.task.text, /conversation, but no photos for that date/i);
  assert.equal(outcome(s, "date"), true);
  assert.equal(s.task.stage, "clarify-date");
});

test("screen outcome cycles only among the supplied three read-only fields", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Explain screen display-settings");
  advanceToEnd(s);
  assert.deepEqual(s.task.result.screen.fields.map(x => x.label),
    ["Screen zoom", "Text size", "Dark theme"]);
  assert.equal(outcome(s, "guidance"), true);
  assert.equal(s.task.result.view, "guidance");
  assert.equal(outcome(s, "option"), true);
  assert.equal(s.task.result.view, "explanation");
  assert.equal(s.task.result.option, 2);
  assert.equal(outcome(s, "explanation"), true);
  assert.equal(s.task.result.view, "explanation");
});

test("unavailable media outcome changes only its view and preserves prior player", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Play Quiet Harbour"); advanceToEnd(s);
  const prior = s.player;
  P.dispatch(s, "reviewer", {fault: "unavailable"});
  P.dispatch(s, "submit", "Play Sinnerman"); advanceToEnd(s);
  assert.equal(s.task.stage, "failed");
  assert.equal(s.task.outcome, "unavailable");
  assert.equal(s.player, prior);
  const before = {dispatched: s.task.dispatched, playing: s.playing};
  assert.equal(outcome(s, "sources"), true);
  assert.equal(s.task.result.view, "source-choice");
  assert.equal(outcome(s, "source-back"), true);
  assert.equal(s.task.result.view, "");
  assert.equal(outcome(s, "manual"), true);
  assert.equal(s.task.result.view, "manual");
  assert.deepEqual({dispatched: s.task.dispatched, playing: s.playing}, before);
});

test("preview cancellation restores the committed reading scale without applying", () => {
  const s = P.create();
  s.scale = s.previousScale = s.previewScale = 1.15;
  P.dispatch(s, "submit", "Make Granny text larger");
  assert.equal(s.task.stage, "size-preview");
  P.dispatch(s, "setScale", 1.3);
  assert.equal(s.previewScale, 1.3);
  assert.equal(P.dispatch(s, "stop"), true);
  assert.equal(s.scale, 1.15);
  assert.equal(s.previewScale, 1.15);
});

test("reading applies then restores the exact previous 115 percent value", () => {
  const s = P.create();
  s.scale = s.previousScale = s.previewScale = 1.15;
  P.dispatch(s, "submit", "Make Granny text larger");
  P.dispatch(s, "setScale", 1.3);
  P.dispatch(s, "applyScale");
  assert.equal(s.scale, 1.3);
  assert.equal(s.task.result.previousScale, 1.15);
  P.dispatch(s, "restoreScale");
  assert.equal(s.scale, 1.15);
  assert.equal(s.task.result.restored, true);
});

test("a Stop invalidates a pending photo callback and stale outcome action", () => {
  const s = P.create();
  P.dispatch(s, "submit", "Show photos of Sophie from yesterday");
  const pending = guard(s), old = {taskId: s.task.id, version: s.task.version};
  P.dispatch(s, "stop");
  assert.equal(P.dispatch(s, "advance", null, pending), false);
  assert.equal(P.dispatch(s, "outcome", {...old, action: "photo", index: 0}), false);
  assert.equal(s.task.stage, "stopped");
});

test("outcome restore binds the stored prior size even after a Menu preference change", () => {
  const s = P.create();
  s.scale = s.previousScale = s.previewScale = 1.15;
  P.dispatch(s, "submit", "Make Granny text larger");
  P.dispatch(s, "applyScale");
  const bound = {taskId: s.task.id, version: s.task.version};
  P.dispatch(s, "setScale", 1.5);
  P.dispatch(s, "applyScale");
  assert.equal(s.previousScale, 1.3);
  assert.equal(P.dispatch(s, "restoreScale", bound), true);
  assert.equal(s.scale, 1.15);
  assert.equal(P.dispatch(s, "restoreScale", bound), false);
});
