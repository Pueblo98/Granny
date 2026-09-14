/* T-102 design simulation only. No device, provider or persistence adapters. */
(function (root) {
  "use strict";
  const PEOPLE = [
    { id: "david-family", name: "David", detail: "Brother" },
    { id: "david-garden", name: "David", detail: "Gardening group" }
  ];
  const SOPHIES = [
    { id: "sophie-family", name: "Sophie", detail: "Daughter" },
    { id: "sophie-book", name: "Sophie", detail: "Book club" }
  ];
  const ACTIVE = ["planning", "acting", "waiting", "verifying"];
  const META = {
    home: ["J-007", "SCR-003", "idle"], listening: ["J-003", "SCR-004", "listening"],
    request: ["J-007", "SCR-004", "heard"], intent: ["J-007", "SCR-006", "needs clarification"],
    entry: ["J-003", "SCR-004", "heard"], heard: ["J-003", "SCR-004", "heard"],
    person: ["J-003", "SCR-006", "needs clarification"], channel: ["J-003", "SCR-006", "needs clarification"],
    preview: ["J-003", "SCR-007", "ready to confirm"], expired: ["J-003", "SCR-007", "ready to confirm"],
    planning: ["J-002", "SCR-005", "planning"], acting: ["J-002", "SCR-005", "acting"],
    waiting: ["J-002", "SCR-005", "waiting on app/network/user"], verifying: ["J-002", "SCR-005", "verifying"],
    result: ["J-002", "SCR-008", "completed"], unknown: ["J-003", "SCR-008", "partially completed"],
    stopped: ["J-002", "SCR-008", "interrupted"], cancelled: ["J-003", "SCR-008", "cancelled"],
    manual: ["J-002", "SCR-008", "interrupted"], failed: ["J-002", "SCR-008", "failed safely"],
    photoPerson: ["J-001", "SCR-006", "needs clarification"], photoDate: ["J-001", "SCR-006", "needs clarification"],
    photoConsent: ["J-001", "SCR-007", "ready to confirm"], photos: ["J-001", "SCR-008", "completed"],
    photoDetail: ["J-001", "SCR-008", "completed"], noPhotos: ["J-001", "SCR-008", "recovering"],
    screen: ["J-002", "SCR-002", "idle"], explanation: ["J-002", "SCR-008", "completed"],
    options: ["J-002", "SCR-008", "completed"], lostContext: ["J-002", "SCR-008", "recovering"],
    music: ["J-005", "SCR-006", "needs clarification"], player: ["J-005", "SCR-008", "completed"],
    mediaPartial: ["J-005", "SCR-008", "partially completed"], sizeScope: ["J-006", "SCR-006", "needs clarification"],
    size: ["J-006", "SCR-011", "idle"], sizeResult: ["J-006", "SCR-008", "completed"],
    setup: ["J-007", "SCR-001", "idle"], preferences: ["J-007", "SCR-011", "idle"],
    micConsent: ["J-007", "SCR-002", "idle"], micOS: ["J-007", "SCR-002", "waiting on app/network/user"],
    micDenied: ["J-007", "SCR-014", "permission lost"], cloudConsent: ["J-007", "SCR-002", "idle"],
    screenConsent: ["J-007", "SCR-002", "idle"], settings: ["J-007", "SCR-011", "idle"],
    history: ["J-007", "SCR-009", "idle"], privacy: ["J-007", "SCR-012", "idle"],
    deleteHistory: ["J-007", "SCR-007", "ready to confirm"], memory: ["J-007", "SCR-010", "idle"],
    aliasEdit: ["J-007", "SCR-010", "idle"], deleteAlias: ["J-007", "SCR-007", "ready to confirm"],
    help: ["J-007", "SCR-015", "idle"], diagnostics: ["J-007", "SCR-015", "idle"],
    offline: ["J-002", "SCR-014", "offline/degraded"], permission: ["J-002", "SCR-014", "permission lost"],
    auth: ["J-002", "SCR-014", "authentication required"], restricted: ["J-002", "SCR-014", "unsupported/restricted"],
    unsupported: ["J-003", "SCR-014", "unsupported/restricted"]
  };
  function create() {
    return { screen: "home", revision: 0, job: "", draft: "I’ll call after dinner.",
      recipient: null, channel: "", permission: false, mic: false, cloud: false,
      sendMode: false, permit: null, clock: 0, started: 0, dispatched: false,
      stopped: false, outcome: "", history: [], scale: 1, previousScale: 1, previewScale: 1.3,
      photoPerson: SOPHIES[0], photoDate: "13 September", photoIndex: 0,
      song: "Quiet Harbour", performer: "The Lantern Trio", playing: false,
      alias: "Sophie means my daughter", requestText: "", note: "", error: "" };
  }
  function signature(s) { return JSON.stringify([s.draft, s.recipient && s.recipient.id, s.channel, s.sendMode]); }
  function prepare(s) {
    s.permit = { signature: signature(s), expires: s.clock + 60 };
    s.dispatched = false; s.stopped = false; s.screen = "preview";
  }
  function start(s, job) {
    s.job = job; s.started = s.clock; s.dispatched = false; s.stopped = false;
    s.permit = null; s.outcome = ""; s.screen = "planning";
  }
  function stop(s, manual) {
    s.permit = null; s.stopped = true;
    s.screen = s.dispatched ? "unknown" : manual ? "manual" : "stopped";
  }
  function record(s, outcome) {
    s.outcome = outcome;
    s.history.unshift({ job: s.job, outcome: outcome });
    s.history = s.history.slice(0, 20);
  }
  function dispatch(s, event, value, revision) {
    if (revision !== undefined && revision !== s.revision) return false;
    const before = s.screen;
    s.error = "";
    if (event === "reset") { Object.assign(s, create()); s.revision++; return true; }
    if (event === "tick") {
      if (!Number.isFinite(value) || value < 0) return false;
      s.clock += value;
      if (s.screen === "preview" && s.permit && s.clock >= s.permit.expires) { s.permit = null; s.screen = "expired"; }
      if (ACTIVE.includes(s.screen) && s.clock - s.started >= 60) stop(s, false);
    } else if (event === "stop" || event === "takeover") {
      stop(s, event === "takeover");
    } else if (event === "home" || event === "escape") {
      if (ACTIVE.includes(s.screen) || s.screen === "listening" || s.dispatched && s.screen === "unknown") stop(s, false);
      else { s.permit = null; s.screen = "home"; s.job = ""; }
    } else if (event === "dismissUnknown" && s.screen === "unknown") {
      record(s, "unknown"); s.dispatched = false; s.screen = "home"; s.job = "";
    } else if (event === "manualUnknown" && s.screen === "unknown") {
      record(s, "unknown"); s.dispatched = false; s.screen = "manual";
    } else if (event === "cancel") {
      if (s.dispatched) stop(s, false);
      else { s.permit = null; s.screen = "cancelled"; }
    } else if (event === "fault" && (ACTIVE.includes(s.screen) || ["preview", "expired", "screen"].includes(s.screen))) {
      const faults = ["offline", "permission", "auth", "restricted", "failed", "partial", "noPhotos", "lostContext"];
      if (!faults.includes(value)) return false;
      if (value === "noPhotos" && s.job !== "photos" || value === "lostContext" && !["explain","return"].includes(s.job)) return false;
      s.permit = null;
      if (s.dispatched) s.screen = "unknown";
      else if (value === "partial") s.screen = s.job === "music" ? "mediaPartial" : "failed";
      else s.screen = value;
    } else if (event === "reviewSend" && !ACTIVE.includes(s.screen) && s.screen !== "unknown") {
      s.sendMode = !!value; s.permit = null;
      if (before === "preview") s.screen = "expired";
    } else if (event === "openPlayer" && s.screen === "home" && s.playing) { s.job = "music"; s.screen = "player";
    } else if (event === "route" && !ACTIVE.includes(s.screen) && !s.dispatched && s.screen !== "listening") {
      if (!["home", "request", "entry", "listening", "photoPerson", "screen", "music", "sizeScope", "settings", "setup", "history", "privacy", "memory", "help", "diagnostics"].includes(value)) return false;
      s.permit = null; s.dispatched = false; s.stopped = false; s.screen = value;
      if (["entry", "listening"].includes(value)) { s.job = "message"; s.recipient = null; s.channel = ""; }
      if (value === "photoPerson") s.job = "photos";
      if (value === "music") s.job = "music";
      if (value === "screen") s.job = "explain";
    } else if (event === "request" && ["request", "listening"].includes(s.screen)) {
      const text = String(value || "").trim();
      if (!text) s.error = "Write a request first, or choose a task on Home.";
      else { s.requestText = text.slice(0, 2000); s.permit = null; s.screen = "intent"; }
    } else if (event === "editRequest" && s.screen === "intent") s.screen = "request";
    else if (event === "heard" && ["entry", "listening"].includes(s.screen)) {
      const text = String(value || "").trim();
      if (!text) { s.error = "Write a message first, or cancel."; }
      else { s.draft = text.slice(0, 2000); s.permit = null; s.screen = "heard"; }
    } else if (event === "useRequest" && s.screen === "heard") s.screen = "person";
    else if (event === "edit" && ["heard", "preview", "expired", "person", "channel", "listening"].includes(s.screen)) {
      s.permit = null; s.screen = before === "listening" ? "request" : "entry";
    } else if (event === "person" && s.screen === "person") {
      const p = PEOPLE.find(p => p.id === value); if (!p) return false;
      s.recipient = p; s.channel = ""; s.permit = null; s.screen = "channel";
    } else if (event === "channel" && s.screen === "channel") {
      if (!["Example Messages", "Example Mail"].includes(value)) return false;
      s.channel = value; prepare(s);
    } else if (event === "renew" && s.screen === "expired") prepare(s);
    else if (event === "confirm" && s.screen === "preview") {
      if (!s.permit || s.permit.signature !== signature(s) || s.clock >= s.permit.expires || !s.recipient || !s.channel) {
        s.permit = null; s.screen = "expired";
      } else {
        s.permit = null; s.started = s.clock; s.stopped = false;
        s.dispatched = s.sendMode; s.screen = "acting"; s.job = "message";
      }
    } else if (event === "advance" && ACTIVE.includes(s.screen) && !s.stopped) {
      if (s.screen === "planning") s.screen = "acting";
      else if (s.screen === "acting") s.screen = "waiting";
      else if (s.screen === "waiting") s.screen = "verifying";
      else {
        const job = s.job;
        if (job === "message") { record(s, s.sendMode ? "sent" : "draft opened, not sent"); s.screen = "result"; }
        else if (job === "photos") { record(s, "matching photos found"); s.screen = "photos"; }
        else if (job === "music") { s.playing = true; record(s, "playing"); s.screen = "player"; }
        else if (job === "explain") { s.screen = "explanation"; record(s, "sample screen explained"); }
        else { record(s, "article restored"); s.screen = "result"; }
        s.dispatched = false;
      }
    } else if (event === "photoPerson" && s.screen === "photoPerson") {
      const p = SOPHIES.find(p => p.id === value); if (!p) return false;
      s.photoPerson = p; s.screen = "photoDate";
    } else if (event === "photoDate" && s.screen === "photoDate") {
      if (!["13 September", "12 September"].includes(value)) return false;
      s.photoDate = value; s.screen = "photoConsent";
    } else if (event === "photoLook" && s.screen === "photoConsent") start(s, "photos");
    else if (event === "photoOpen" && s.screen === "photos") {
      if (![0, 1].includes(value)) return false; s.photoIndex = value; s.screen = "photoDetail";
    } else if (event === "photoBack" && s.screen === "photoDetail") s.screen = "photos";
    else if (event === "photoAgain" && ["photos", "noPhotos"].includes(s.screen)) s.screen = "photoPerson";
    else if (event === "explain" && s.screen === "screen") start(s, "explain");
    else if (event === "options" && s.screen === "explanation") s.screen = "options";
    else if (event === "backArticle" && ["explanation", "options"].includes(s.screen)) start(s, "return");
    else if (event === "music" && s.screen === "music") {
      if (!["The Lantern Trio", "Evening Quartet"].includes(value)) return false;
      s.performer = value; start(s, "music");
    } else if (event === "playback" && s.screen === "player") { s.playing = !s.playing; record(s, s.playing ? "playing" : "paused"); }
    else if (event === "size" && ["sizeScope", "settings", "preferences"].includes(s.screen)) { s.previewScale = s.scale; s.screen = "size"; }
    else if (event === "previewScale" && s.screen === "size") {
      if (![1, 1.15, 1.3, 1.5].includes(value)) return false; s.previewScale = value;
    } else if (event === "applyScale" && s.screen === "size") {
      s.previousScale = s.scale; s.scale = s.previewScale; s.screen = "sizeResult";
    } else if (event === "restoreScale" && ["size", "sizeResult"].includes(s.screen)) {
      const old = s.scale; s.scale = s.previousScale; s.previousScale = old; s.screen = "sizeResult";
    } else if (event === "setupNext") {
      const next = { setup: "preferences", preferences: "micConsent", micConsent: "micOS", micDenied: "cloudConsent", cloudConsent: "screenConsent" };
      if (!next[s.screen]) return false; s.screen = next[s.screen];
    } else if (event === "skipMic" && s.screen === "micConsent") { s.mic = false; s.screen = "cloudConsent"; }
    else if (event === "mic" && s.screen === "micOS") { s.mic = !!value; s.screen = value ? "cloudConsent" : "micDenied"; }
    else if (event === "screenChoice" && s.screen === "screenConsent") { s.permission = !!value; s.screen = "home"; }
    else if (event === "deleteHistory" && s.screen === "privacy") s.screen = "deleteHistory";
    else if (event === "clearHistory" && s.screen === "deleteHistory") { s.history = []; s.screen = "history"; }
    else if (event === "aliasEdit" && s.screen === "memory") s.screen = "aliasEdit";
    else if (event === "aliasSave" && s.screen === "aliasEdit") {
      const text = String(value || "").trim();
      if (!text) s.error = "Write an alias or cancel.";
      else { s.alias = text.slice(0, 120); s.screen = "memory"; }
    } else if (event === "deleteAlias" && s.screen === "memory" && s.alias) s.screen = "deleteAlias";
    else if (event === "clearAlias" && s.screen === "deleteAlias") { s.alias = ""; s.screen = "memory"; }
    else return false;
    s.revision++;
    return true;
  }
  function meta(s) {
    const m = [...META[s.screen]];
    if (ACTIVE.includes(s.screen) || ["result", "stopped", "manual", "failed", "offline", "permission", "auth", "restricted"].includes(s.screen)) {
      m[0] = { message: "J-003", photos: "J-001", music: "J-005", explain: "J-002", return: "J-002" }[s.job] || m[0];
    }
    if (s.screen === "result" && s.outcome.includes("not sent")) m[2] = "partially completed";
    return m;
  }
  const api = { create, dispatch, meta, META, ACTIVE, PEOPLE, SOPHIES };
  root.GrannyPrototype = api;
  if (typeof module !== "undefined") module.exports = api;
})(globalThis);
