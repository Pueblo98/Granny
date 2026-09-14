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
  return t ? JSON.stringify([ t.id, t.version, t.kind, t.slots, t.effect ])
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
function prepare(s, t, forceLocal) {
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
  if (forceLocal)
    t.effect = "open-unsent-draft";
  t.version++;
  t.stage = "preview";
  t.prompt = "Check the exact draft before I open it.";
  t.text = `Draft for ${t.slots.recipient.name} (${
      t.slots.recipient.detail}) in ${t.slots.channel}. It will ${
      t.effect === "send-message" ? "be sent only after this exact approval"
                                  : "open unsent"}.`;
  t.choices = [];
  t.outcome = "";
  t.result = null;
  t.dispatched = false;
  t.permit = {signature : signature(t), expires : s.clock + 60000};
}
function baseTask(s, p) {
  return {
    id : s.nextId++,
    version : 1,
    kind : p.kind,
    stage : "failed",
    request : p.request,
    text : "",
    prompt : "",
    choices : [],
    slots : {},
    effect : "local-fixture",
    permit : null,
    outcome : "",
    result : null,
    dispatched : false
  };
}
function peopleFor(s, name) {
  const explicit =
      String(name || "")
          .match(
              /^(Sophie|David)(?:\s+(Daughter|Book club|Brother|Gardening group))$/i);
  if (explicit)
    return F.people.filter(
        p => p.name.toLowerCase() === explicit[1].toLowerCase() &&
             p.detail.toLowerCase() === explicit[2].toLowerCase());
  const alias = s.aliases.find(a => a.label.toLowerCase() ===
                                    String(name || "").toLowerCase());
  if (alias) {
    const person = F.people.find(p => p.id === alias.personId);
    return person ? [ person ] : [];
  }
  return F.people.filter(p => p.name.toLowerCase() ===
                              String(name || "").toLowerCase());
}
function startWork(t, text) {
  t.stage = "planning";
  t.text = text;
  t.choices = [];
}
function startPhotos(s, t) {
  if (t.slots.markRead) {
    t.version++;
    t.stage = "preview";
    t.prompt =
        "Opening this fictional message source may mark it read. Continue?";
    t.text = `Review exact effect: open ${t.slots.person.name} (${
        t.slots.person.detail}) in Example Messages for ${
        t.slots.date}, which may mark that source read.`;
    t.choices = [];
    t.permit = {signature : signature(t), expires : s.clock + 60000};
  } else
    startWork(t, "Looking only in the fictional photo fixtures…");
}
function createWorkflow(s, p) {
  const t = baseTask(s, p);
  s.task = t;
  s.turns.push({id : `turn-${t.id}-user`, role : "user", text : p.request});
  if (p.kind === "photos") {
    t.slots = {person : null, date : p.date || "", markRead : !!p.markRead};
    t.effect = t.slots.markRead ? "open-source-mark-read" : "view-local-photos";
    const matches = peopleFor(s, p.person);
    if (matches.length === 1)
      t.slots.person = matches[0];
    if (!t.slots.person) {
      t.stage = "clarify-person";
      t.prompt = p.person ? `Which ${p.person} do you mean?`
                          : "Whose photos should I look for?";
      t.text = t.prompt;
      t.choices =
          (matches.length ? matches : F.people.filter(x => x.name === "Sophie"))
              .map(x => ({value : x.id, label : `${x.name} — ${x.detail}`}));
    } else if (!t.slots.date) {
      t.stage = "clarify-date";
      t.prompt = "Which date should I use?";
      t.text = t.prompt;
      t.choices = [
        {value : "2026-09-13", label : "Yesterday — 13 September"},
        {value : "2026-09-12", label : "12 September"}
      ];
    } else
      startPhotos(s, t);
    return;
  }
  if (p.kind === "explain") {
    t.slots = {screen : null};
    const screen =
        F.screens.find(x => x.id === p.screen.toLowerCase() ||
                            x.title.toLowerCase() === p.screen.toLowerCase());
    if (screen)
      t.slots.screen = screen;
    if (!screen) {
      t.stage = "clarify-screen";
      t.prompt = "Which supplied fictional screen should I explain?";
      t.text = t.prompt;
      t.choices = F.screens.map(x => ({value : x.id, label : x.title}));
    } else
      startWork(t, "Reading the selected fictional screen…");
    return;
  }
  if (p.kind === "media") {
    t.slots = {track : null, query : p.query};
    const matches = F.tracks.filter(
        x => `${x.title} ${x.performer}`.toLowerCase().includes(
                 p.query.toLowerCase()) ||
             p.query.toLowerCase().includes(x.performer.toLowerCase()));
    if (matches.length !== 1) {
      t.stage = "clarify-media";
      t.prompt = matches.length
                     ? "Which fictional track should I play?"
                     : "I couldn’t match that in the fictional music list.";
      t.text = t.prompt;
      t.choices = matches.map(
          x => ({value : x.id, label : `${x.title} — ${x.performer}`}));
    } else {
      t.slots.track = matches[0];
      startWork(t, "Opening the fictional player…");
    }
    return;
  }
  if (p.kind === "readability") {
    const map = {normal : 1, smaller : 1, larger : 1.3, largest : 1.5};
    t.slots = {
      scope : p.scope === "granny"     ? "granny"
              : p.scope === "external" ? "external"
                                       : "",
      scale : map[p.size]
    };
    if (!t.slots.scope) {
      t.stage = "clarify-scope";
      t.prompt = "Make text larger in Granny or get guidance for another app?";
      t.text = t.prompt;
      t.choices = [
        {value : "granny", label : "In Granny"},
        {value : "external", label : "Another app"}
      ];
    } else if (t.slots.scope === "external") {
      t.stage = "completed";
      t.outcome = "external guidance only";
      t.text =
          "I can guide you to that app’s text settings, but I did not change them.";
      t.result = {
        scope : "external",
        scale : null,
        previousScale : s.scale,
        externalOnly : true
      };
      record(s, t, t.outcome);
    } else
      startWork(t, "Preparing the Granny text-size change…");
    return;
  }
  t.kind = "unsupported";
  t.stage = "clarify-intent";
  t.prompt =
      "I’m not sure what you want. Would you like to message someone, find photos, explain a supplied screen, play music, or change Granny text size?";
  t.text = t.prompt;
  t.choices = [
    {value : "message", label : "Message someone"},
    {value : "photos", label : "Find photos"},
    {value : "explain", label : "Explain a screen"},
    {value : "media", label : "Play music"},
    {value : "readability", label : "Change text size"}
  ];
}
function replace(s, p) {
  if (s.task) {
    s.epoch++;
    if (ACTIVE.includes(s.task.stage)) {
      s.task.stage = s.task.dispatched ? "unknown" : "stopped";
      s.task.outcome = s.task.stage;
      s.task.text =
          s.task.dispatched
              ? "A new request stopped this task after dispatch; its effect is unknown and will not be retried."
              : "A new request stopped this task before dispatch.";
      record(s, s.task, s.task.outcome);
    }
    if (s.task.text)
      s.turns.push({
        id : `turn-${s.task.id}-assistant`,
        role : "assistant",
        text : s.task.text
      });
  }
  if (p.kind !== "message") {
    createWorkflow(s, p);
    return;
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
    effect : s.reviewer.sendMode ? "send-message" : "open-unsent-draft",
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
  if (!t || !x || t.stage === "unknown")
    return false;
  const matchingChoices =
      t.choices.filter(c => c.value.toLowerCase() === x.toLowerCase() ||
                            c.label.toLowerCase() === x.toLowerCase() ||
                            c.label.toLowerCase()
                                .split(/\s+—\s+|\s+/)
                                .includes(x.toLowerCase()));
  if ([
        "clarify-date", "clarify-screen", "clarify-media", "clarify-scope"
      ].includes(t.stage))
    return matchingChoices.length === 1;
  if (t.kind === "explain" && t.stage === "completed")
    return /^(?:explain )?more simply$|^(?:go |take me )?back$|^return$/i.test(
        x);
  if (t.kind === "media" && t.stage === "completed")
    return /^(?:pause|resume|play)$/i.test(x);
  if (t.kind === "message" && t.stage === "completed")
    return /^(?:actually,?\s*)?(?:change (?:the )?message to|make it)\s+.+/i
        .test(x);
  if (t.stage === "clarify-person")
    return t.choices
               .filter(c => c.value.toLowerCase() === x.toLowerCase() ||
                            c.label.toLowerCase()
                                .split(/\s+—\s+/)
                                .includes(x.toLowerCase()))
               .length === 1;
  if (t.kind !== "message")
    return false;
  if (t.stage === "clarify-channel")
    return F.channels.some(c => c.toLowerCase() === x.toLowerCase());
  if (t.stage === "clarify-body")
    return true;
  return [ "preview", "expired" ].includes(t.stage) &&
         /^(?:actually,?\s*)?(?:change (?:the )?message to|make it)\s+.+/i.test(
             x);
}
function applyFollowup(s, t, x) {
  if ([
        "clarify-date", "clarify-screen", "clarify-media", "clarify-scope"
      ].includes(t.stage)) {
    const found =
        t.choices.filter(y => y.value.toLowerCase() === x.toLowerCase() ||
                              y.label.toLowerCase() === x.toLowerCase() ||
                              y.label.toLowerCase()
                                  .split(/\s+—\s+|\s+/)
                                  .includes(x.toLowerCase()));
    return found.length === 1 ? dispatch(s, "choose", found[0].value) : false;
  }
  if (t.kind === "explain" && t.stage === "completed") {
    if (/simply/i.test(x)) {
      t.result.simple = true;
      t.result.explanation =
          "This fictional screen shows an article. Nothing was changed.";
      t.text = t.result.explanation;
      return true;
    }
    if (t.result.screen.previousTarget) {
      t.text = `Returned to ${t.result.screen.title}.`;
      t.result.next = "returned";
      return true;
    }
    return false;
  }
  if (t.kind === "media" && t.stage === "completed")
    return dispatch(s, "playback");
  if (t.kind === "message" && t.stage === "completed") {
    const f = I.followup(x);
    invalidate(s, t);
    t.slots.body = f.value;
    t.result = null;
    t.outcome = "";
    prepare(s, t, true);
    return true;
  }
  const f = I.followup(x);
  if (t.stage === "clarify-person") {
    const found =
        t.choices.filter(y => y.value.toLowerCase() === f.value.toLowerCase() ||
                              y.label.toLowerCase()
                                  .split(/\s+—\s+/)
                                  .includes(f.value.toLowerCase()));
    const c = found.length === 1 ? found[0] : null;
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
  if (e === "choose" && t && t.kind !== "message") {
    const option = t.choices.find(c => c.value === v);
    if (!option)
      return false;
    invalidate(s, t);
    if (t.kind === "photos" && t.stage === "clarify-person") {
      t.slots.person = F.people.find(p => p.id === v);
      if (!t.slots.date) {
        t.stage = "clarify-date";
        t.prompt = "Which date should I use?";
        t.text = t.prompt;
        t.choices = [
          {value : "2026-09-13", label : "Yesterday — 13 September"},
          {value : "2026-09-12", label : "12 September"}
        ];
      } else
        startPhotos(s, t);
      return true;
    }
    if (t.kind === "photos" && t.stage === "clarify-date") {
      t.slots.date = v;
      startPhotos(s, t);
      return true;
    }
    if (t.kind === "explain" && t.stage === "clarify-screen") {
      t.slots.screen = F.screens.find(x => x.id === v);
      startWork(t, "Reading the selected fictional screen…");
      return true;
    }
    if (t.kind === "media" && t.stage === "clarify-media") {
      t.slots.track = F.tracks.find(x => x.id === v);
      startWork(t, "Opening the fictional player…");
      return true;
    }
    if (t.kind === "readability" && t.stage === "clarify-scope") {
      t.slots.scope = v;
      if (v === "external") {
        t.stage = "completed";
        t.outcome = "external guidance only";
        t.text =
            "I can guide you to that app’s text settings, but I did not change them.";
        t.result = {
          scope : "external",
          scale : null,
          previousScale : s.scale,
          externalOnly : true
        };
        record(s, t, t.outcome);
      } else
        startWork(t, "Preparing the Granny text-size change…");
      return true;
    }
    if (t.kind === "unsupported" && t.stage === "clarify-intent") {
      t.text = "Please write the details of that request. Nothing has run yet.";
      return true;
    }
    return false;
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
    if (t.kind === "message")
      prepare(s, t);
    else if (t.kind === "photos")
      startPhotos(s, t);
    else
      return false;
    return true;
  }
  if (e === "advance" && t && ACTIVE.includes(t.stage)) {
    if (!guarded(s, g))
      return false;
    if (t.stage === "planning") {
      t.stage = "acting";
      t.text = "Opening the fictional draft…";
    } else if (t.stage === "acting") {
      t.dispatched = t.effect === "send-message";
      t.stage = "waiting";
      t.text = "Waiting for the example app…";
    } else if (t.stage === "waiting") {
      t.stage = "verifying";
      t.text = "Checking what happened…";
    } else if (s.reviewer.fault) {
      if (t.dispatched || s.reviewer.fault === "unknown") {
        t.stage = "unknown";
        t.outcome = "unknown";
        t.text =
            "I can’t verify whether the external effect happened. I won’t try again automatically.";
      } else {
        t.stage = "failed";
        t.outcome = s.reviewer.fault;
        t.text = `The fictional task could not continue (${
            s.reviewer.fault}). No external effect was dispatched.`;
      }
      record(s, t, t.outcome);
    } else if (t.kind === "photos") {
      const date = t.slots.date.toLowerCase() === "yesterday" ? "2026-09-13"
                                                              : t.slots.date;
      const found = F.photos.filter(p => p.detail === t.slots.person.detail &&
                                         p.date === date);
      t.stage = found.length ? "completed" : "no-matches";
      t.outcome = found.length ? "matching fictional photos found"
                               : "no matching fictional photos";
      t.result = {
        photos : found,
        uncertainDate : !/^2026-\d\d-\d\d$/.test(date)
      };
      t.text =
          found.length
              ? `Found ${found.length} fictional photo${
                    found.length === 1 ? "" : "s"}.`
              : "I found no matching fictional photos. Try another person or date.";
      record(s, t, t.outcome);
    } else if (t.kind === "explain") {
      const screen = t.slots.screen;
      if (screen.protected) {
        t.stage = "failed";
        t.outcome = "protected";
        t.text =
            "This fictional screen is protected. I can’t inspect or explain private sign-in details.";
        t.result = {screen, explanation : t.text, simple : false, next : null};
      } else if (screen.unknown) {
        t.stage = "failed";
        t.outcome = "unknown screen";
        t.text =
            "I can’t identify this supplied screen safely, so I won’t pretend to explain it.";
        t.result = {screen, explanation : t.text, simple : false, next : null};
      } else {
        t.stage = "completed";
        t.outcome = "fictional screen explained";
        t.text =
            "This fictional article describes a garden. The Share button would open sharing choices; I did not press it.";
        t.result = {
          screen,
          explanation : t.text,
          simple : false,
          next : screen.previousTarget ? "return" : null
        };
      }
      record(s, t, t.outcome);
    } else if (t.kind === "media") {
      t.stage = "completed";
      s.playing = true;
      t.outcome = "playing fictional track";
      t.result = {track : t.slots.track, playing : true};
      t.text = `Playing ${t.slots.track.title} by ${
          t.slots.track.performer} in the silent simulation.`;
      record(s, t, t.outcome);
    } else if (t.kind === "readability") {
      const prior = s.scale;
      s.previousScale = prior;
      s.scale = t.slots.scale;
      s.previewScale = s.scale;
      t.stage = "completed";
      t.outcome = "Granny text size changed";
      t.result = {
        scope : "granny",
        scale : s.scale,
        previousScale : prior,
        externalOnly : false
      };
      t.text = "Granny text size changed. You can restore the previous size.";
      record(s, t, t.outcome);
    } else {
      t.stage = "completed";
      t.outcome = t.effect === "send-message" ? "fictional message sent"
                                              : "draft opened, not sent";
      t.result = {
        effect : t.effect,
        recipient : t.slots.recipient,
        channel : t.slots.channel,
        body : t.slots.body,
        sent : t.effect === "send-message"
      };
      t.dispatched = false;
      t.text = t.effect === "send-message"
                   ? "The fictional message was sent and verified."
                   : "The fictional draft opened. It was not sent.";
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
    if (t && t.kind === "readability" && t.result) {
      t.result.scale = s.scale;
      t.text = "Restored the previous Granny text size.";
    }
    return true;
  }
  if (e === "playback") {
    s.playing = !s.playing;
    if (t && t.kind === "media" && t.result) {
      t.result.playing = s.playing;
      t.text = s.playing
                   ? `Resumed ${t.result.track.title} in the silent simulation.`
                   : `Paused ${t.result.track.title}.`;
    }
    return true;
  }
  if (e === "voice") {
    s.settings.voice = !!v;
    return true;
  }
  if (e === "clearHistory") {
    s.history = [];
    return true;
  }
  if (e === "clearSession") {
    const kept = {
      epoch : s.epoch + 1,
      nextId : s.nextId,
      scale : s.scale,
      previousScale : s.previousScale,
      previewScale : s.previewScale,
      aliases : s.aliases.map(a => ({...a})),
      settings : {...s.settings}
    };
    Object.assign(s, create(), kept);
    return true;
  }
  if ((e === "acknowledge" || e === "manual") && t && t.stage === "unknown") {
    s.turns.push(
        {id : `turn-${t.id}-assistant`, role : "assistant", text : t.text});
    t.stage = "completed";
    t.outcome = e === "manual" ? "unknown — user continuing manually"
                               : "unknown acknowledged";
    t.text =
        e === "manual"
            ? "Continue manually only after checking the example app. I will not retry."
            : "Unknown result acknowledged. I will not retry.";
    record(s, t, t.outcome);
    return true;
  }
  if (e === "reviewer" && v && typeof v === "object") {
    if (Object.hasOwn(v, "sendMode") && t && t.kind === "message" &&
        [ "preview", "expired" ].includes(t.stage)) {
      s.reviewer.sendMode = !!v.sendMode;
      invalidate(s, t);
      t.effect = s.reviewer.sendMode ? "send-message" : "open-unsent-draft";
      prepare(s, t);
      return true;
    }
    for (const k of ["fault", "screen", "sendMode", "territory", "delay"])
      if (Object.hasOwn(v, k))
        s.reviewer[k] = v[k];
    return true;
  }
  if (e === "aliasSave" && v && v.label && v.personId) {
    if (!F.people.some(p => p.id === v.personId))
      return false;
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
