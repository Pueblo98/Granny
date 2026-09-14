/* T-102 design simulation only. No device, provider, network or persistence
 * adapters. */
(function(root) {
"use strict";
const F = root.GrannyFixtures || require("./fixtures.js"),
      I = root.GrannyIntent || require("./intent.js"),
      ACTIVE = [ "planning", "acting", "waiting", "verifying" ],
      scales = [ 1, 1.15, 1.3, 1.5 ];
function create() {
  return {
    epoch : 1,
    clock : 0,
    nextId : 1,
    turns : [],
    task : null,
    history : [],
    scale : 1,
    previousScale : 1,
    previewScale : 1,
    aliases : [ {id : "sophie", label : "Sophie", personId : "sophie-family"} ],
    settings : {voice : false},
    reviewer : {
      fault : "",
      sendMode : false,
      screen : "article",
      territory : "neutral",
      delay : 650
    },
    playing : false
  };
}
function signature(t) {
  const p = t && t.slots && t.slots.recipient;
  return t ? JSON.stringify([
    t.id, t.version, t.kind, p && p.id, t.slots.channel, t.slots.body, t.effect
  ])
           : "";
}
function choices(name) {
  return F.people.filter(p => p.name.toLowerCase() === name.toLowerCase())
      .map(p => ({value : p.id, label : `${p.name} — ${p.detail}`}));
}
function invalidate(s, t) {
  s.epoch++;
  t.version++;
  t.permit = null;
  t.dispatched = false;
}
function askPerson(t, c) {
  t.stage = "clarify-person";
  t.prompt =
      c.length
          ? `Which ${t.requestedName} do you mean?`
          : `I can’t safely match “${
                t.requestedName}”. Choose a known person or edit your request.`;
  t.text = t.prompt;
  t.choices = c;
}
function askChannel(t) {
  t.stage = "clarify-channel";
  t.prompt = "Which example app should I use?";
  t.text = t.prompt;
  t.choices = F.channels.map(x => ({value : x, label : x}));
}
function prepare(s, t) {
  if (!t.slots.recipient)
    return askPerson(
        t,
        F.people.map(p => ({value : p.id, label : `${p.name} — ${p.detail}`})));
  if (!t.slots.channel)
    return askChannel(t);
  if (!t.slots.body) {
    t.stage = "clarify-body";
    t.prompt = "What should the message say?";
    t.text = t.prompt;
    t.choices = [];
    return;
  }
  t.version++;
  t.stage = "preview";
  t.prompt = "Check the exact draft before I open it.";
  t.text = `Draft for ${t.slots.recipient.name} (${
      t.slots.recipient.detail}) in ${t.slots.channel}. It will open unsent.`;
  t.choices = [];
  t.outcome = "";
  t.result = null;
  t.dispatched = false;
  t.permit = {signature : signature(t), expires : s.clock + 60000};
}
function replace(s, p) {
  if (s.task) {
    s.epoch++;
    if (s.task.text)
      s.turns.push({
        id : `turn-${s.task.id}-assistant`,
        role : "assistant",
        text : s.task.text
      });
  }
  const t = {
    id : s.nextId++,
    version : 1,
    kind : p.kind === "message" ? "message" : "unsupported",
    stage : "failed",
    request : p.request,
    requestedName : p.recipient || "",
    text : "",
    prompt : "",
    choices : [],
    slots : p.kind === "message"
                ? {recipient : null, channel : p.channel || "", body : p.body}
                : {},
    effect : "open-unsent-draft",
    permit : null,
    outcome : "",
    result : null,
    dispatched : false
  };
  s.task = t;
  s.turns.push({id : `turn-${t.id}-user`, role : "user", text : p.request});
  if (t.kind !== "message") {
    t.text =
        "I’m not sure how to help with that yet. Nothing was opened or sent.";
    return;
  }
  const c = choices(p.recipient);
  const detailed = p.detail && c.find(x => {
    const person = F.people.find(y => y.id === x.value);
    return person && person.detail.toLowerCase() === p.detail.toLowerCase();
  });
  if (detailed)
    t.slots.recipient = F.people.find(x => x.id === detailed.value);
  else if (c.length === 1)
    t.slots.recipient = F.people.find(x => x.id === c[0].value);
  if (t.slots.recipient)
    prepare(s, t);
  else
    askPerson(
        t, c.length
               ? c
               : F.people.map(
                     x => ({value : x.id, label : `${x.name} — ${x.detail}`})));
}
function guarded(s, g) {
  const t = s.task;
  return !!t && !!g && g.epoch === s.epoch && g.taskId === t.id &&
         g.version === t.version && g.stage === t.stage;
}
function record(s, t, o) {
  s.history.unshift({job : t.kind, outcome : o});
  s.history = s.history.slice(0, 20);
}
function isFollowup(s, text) {
  const t = s && s.task, x = String(text == null ? "" : text).trim();
  if (!t || t.kind !== "message" || !x)
    return false;
  if (t.stage === "clarify-person")
    return t.choices.some(c => c.value.toLowerCase() === x.toLowerCase() ||
                               c.label.toLowerCase().includes(x.toLowerCase()));
  if (t.stage === "clarify-channel")
    return F.channels.some(c => c.toLowerCase() === x.toLowerCase());
  if (t.stage === "clarify-body")
    return true;
  return [ "preview", "expired" ].includes(t.stage) &&
         /^(?:actually,?\s*)?(?:change (?:the )?message to|make it)\s+.+/i.test(
             x);
}
function applyFollowup(s, t, x) {
  const f = I.followup(x);
  if (t.stage === "clarify-person") {
    const c = t.choices.find(
        y => y.value.toLowerCase() === f.value.toLowerCase() ||
             y.label.toLowerCase().includes(f.value.toLowerCase()));
    return c ? dispatch(s, "choose", c.value) : false;
  }
  if (t.stage === "clarify-channel") {
    const c = F.channels.find(y => y.toLowerCase() === f.value.toLowerCase());
    return c ? dispatch(s, "choose", c) : false;
  }
  if (t.stage === "clarify-body" || f.type === "body")
    return dispatch(s, "edit", {body : f.value});
  return false;
}
function dispatch(s, e, v, g) {
  if (!s || typeof e !== "string")
    return false;
  const t = s.task;
  if (e === "reset") {
    const epoch = s.epoch + 1, nextId = s.nextId;
    Object.assign(s, create(), {epoch, nextId});
    return true;
  }
  if (e === "tick") {
    if (!Number.isFinite(v) || v < 0)
      return false;
    s.clock += v;
    if (t && t.stage === "preview" && t.permit && s.clock >= t.permit.expires) {
      t.permit = null;
      t.stage = "expired";
      t.text =
          "This approval expired. Your exact draft is still here to review.";
    }
    return true;
  }
  if (e === "submit") {
    const x = String(v == null ? "" : v);
    if (!x.trim())
      return false;
    if (isFollowup(s, x))
      return applyFollowup(s, t, x);
    replace(s, I.parse(x));
    return true;
  }
  if (e === "choose" && t && t.kind === "message") {
    if (t.stage === "clarify-person") {
      const p = F.people.find(x => x.id === v);
      if (!p || !t.choices.some(c => c.value === v))
        return false;
      invalidate(s, t);
      t.slots.recipient = p;
      t.slots.channel ? prepare(s, t) : askChannel(t);
      return true;
    }
    if (t.stage === "clarify-channel") {
      if (!F.channels.includes(v))
        return false;
      invalidate(s, t);
      t.slots.channel = v;
      prepare(s, t);
      return true;
    }
    return false;
  }
  if (e === "edit" && t && t.kind === "message" && v && typeof v === "object") {
    if (!["clarify-person", "clarify-channel", "clarify-body", "preview",
          "expired"]
             .includes(t.stage))
      return false;
    let recipient = t.slots.recipient;
    if (Object.hasOwn(v, "recipient")) {
      const id = typeof v.recipient === "string"
                     ? v.recipient
                     : v.recipient && v.recipient.id;
      recipient = F.people.find(p => p.id === id) || null;
      if (!recipient)
        return false;
    }
    invalidate(s, t);
    t.slots.recipient = recipient;
    if (Object.hasOwn(v, "channel"))
      t.slots.channel = F.channels.includes(v.channel) ? v.channel : "";
    if (Object.hasOwn(v, "body"))
      t.slots.body = String(v.body);
    prepare(s, t);
    return true;
  }
  if (e === "approve" && t && t.stage === "preview") {
    if (!v || v.taskId !== t.id || v.version !== t.version ||
        v.signature !== signature(t) || !t.permit ||
        t.permit.signature !== signature(t) || s.clock >= t.permit.expires) {
      t.permit = null;
      t.stage = "expired";
      t.text = "That approval is no longer current. Review this draft again.";
      return false;
    }
    t.permit = null;
    t.stage = "planning";
    t.text = "Preparing the fictional draft handoff…";
    return true;
  }
  if (e === "renew" && t && t.stage === "expired") {
    prepare(s, t);
    return true;
  }
  if (e === "advance" && t && ACTIVE.includes(t.stage)) {
    if (!guarded(s, g))
      return false;
    if (t.stage === "planning") {
      t.stage = "acting";
      t.text = "Opening the fictional draft…";
    } else if (t.stage === "acting") {
      t.dispatched = !!s.reviewer.sendMode;
      t.stage = "waiting";
      t.text = "Waiting for the example app…";
    } else if (t.stage === "waiting") {
      t.stage = "verifying";
      t.text = "Checking what happened…";
    } else if (s.reviewer.fault === "unknown" ||
               (t.dispatched && s.reviewer.fault)) {
      t.stage = "unknown";
      t.outcome = "unknown";
      t.text =
          "I can’t verify whether the external effect happened. I won’t try again automatically.";
      record(s, t, "unknown");
    } else {
      t.stage = "completed";
      t.outcome = "draft opened, not sent";
      t.result = {
        effect : "open-unsent-draft",
        recipient : t.slots.recipient,
        channel : t.slots.channel,
        body : t.slots.body,
        sent : false
      };
      t.dispatched = false;
      t.text = "The fictional draft opened. It was not sent.";
      record(s, t, t.outcome);
    }
    return true;
  }
  if (e === "stop" && t &&
      !["completed", "unknown", "stopped", "failed"].includes(t.stage)) {
    s.epoch++;
    t.permit = null;
    if (t.dispatched || [ "waiting", "verifying" ].includes(t.stage)) {
      t.stage = "unknown";
      t.outcome = "unknown";
      t.text =
          "Stopped. I can’t verify whether an external effect happened, so I won’t retry.";
    } else {
      t.stage = "stopped";
      t.outcome = "stopped";
      t.text = "Stopped. Nothing was sent.";
    }
    record(s, t, t.outcome);
    return true;
  }
  if (e === "expire" && t && t.stage === "preview") {
    t.permit = null;
    t.stage = "expired";
    t.text = "This approval expired. Your exact draft is still here to review.";
    return true;
  }
  if (e === "fault" && t) {
    if (!["unknown", "failed", "offline", "permission", "auth", "restricted"]
             .includes(v))
      return false;
    s.reviewer.fault = v;
    if ([ "preview", "expired", ...ACTIVE ].includes(t.stage)) {
      s.epoch++;
      t.permit = null;
      if (t.dispatched) {
        t.stage = "unknown";
        t.outcome = "unknown";
        t.text = "I can’t verify whether the effect happened. I won’t retry.";
      } else {
        t.stage = "failed";
        t.outcome = v;
        t.text = `The fictional handoff could not continue (${
            v}). Nothing was sent.`;
      }
      record(s, t, t.outcome);
    }
    return true;
  }
  if (e === "setScale") {
    if (!scales.includes(v))
      return false;
    s.previewScale = v;
    return true;
  }
  if (e === "applyScale") {
    s.previousScale = s.scale;
    s.scale = s.previewScale;
    return true;
  }
  if (e === "restoreScale") {
    const old = s.scale;
    s.scale = s.previousScale;
    s.previousScale = old;
    s.previewScale = s.scale;
    return true;
  }
  if (e === "playback") {
    s.playing = !s.playing;
    return true;
  }
  if (e === "clearHistory") {
    s.history = [];
    return true;
  }
  if (e === "reviewer" && v && typeof v === "object") {
    if (v.sendMode === true)
      return false;
    for (const k of ["fault", "screen", "sendMode", "territory", "delay"])
      if (Object.hasOwn(v, k))
        s.reviewer[k] = v[k];
    return true;
  }
  if (e === "aliasSave" && v && v.label && v.personId) {
    const a = v.id && s.aliases.find(x => x.id === v.id);
    if (a)
      Object.assign(a,
                    {label : String(v.label), personId : String(v.personId)});
    else
      s.aliases.push({
        id : v.id || `alias-${s.nextId++}`,
        label : String(v.label),
        personId : String(v.personId)
      });
    return true;
  }
  if (e === "aliasDelete") {
    const n = s.aliases.length;
    s.aliases = s.aliases.filter(a => a.id !== v);
    return n !== s.aliases.length;
  }
  return false;
}
const api = {
  create,
  dispatch,
  signature,
  isFollowup,
  ACTIVE
};
root.GrannyPrototype = api;
if (typeof module !== "undefined")
  module.exports = api;
})(globalThis);
