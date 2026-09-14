/* granny.conversation.v1 frontend transport. Same-origin, tab-memory only. */
(function(root) {
"use strict";
const VERSION = "granny.conversation.v1";
const ACTIVE =
    new Set([ "interpreting", "resolving", "creating", "verifying" ]);
const TYPES = new Set([
  "progress", "chat", "clarification", "preview", "result", "error",
  "cancellation"
]);
const STATES = new Set([
  "idle", "interpreting", "resolving", "creating", "verifying", "clarifying",
  "preview", "completed", "failed", "unknown", "stopped"
]);
function create(options = {}) {
  const fetcher = options.fetch || root.fetch?.bind(root),
        later = options.setTimeout || root.setTimeout?.bind(root),
        cancelLater = options.clearTimeout || root.clearTimeout?.bind(root),
        notify = options.onChange || (() => {}), pollMs = options.pollMs ?? 250,
        uuid = options.uuid || (() => root.crypto.randomUUID());
  if (typeof fetcher !== "function" || typeof later !== "function" ||
      typeof cancelLater !== "function")
    throw new Error("runtime_transport_unavailable");
  let sessionId = null, cursor = 0, epoch = 0, generation = 0, timer = null,
      polling = false, controller = null, previewRevision = 0,
      previewAcceptedRevision = -1;
  let quarantined = false;
  const eventIds = new Set();
  let data = {
    connection : "disconnected",
    snapshot : null,
    current : null,
    events : [],
    pending : false,
    stopping : false,
    error : null,
    canConfirm : false
  };
  const view = () => Object.freeze({...data, events : data.events.slice()});
  function emit() {
    data.canConfirm = canConfirm();
    notify(view());
  }
  function canConfirm() {
    const c = data.current;
    return data.connection === "connected" && !quarantined && !data.pending &&
           !data.stopping && previewAcceptedRevision === previewRevision &&
           c?.type === "preview" && c.state === "preview" &&
           data.snapshot?.state === "preview" &&
           typeof c.data?.actionId === "string" &&
           typeof c.data?.confirmationToken === "string";
  }
  function stopTimer() {
    if (timer !== null) {
      cancelLater(timer);
      timer = null;
    }
  }
  function abort() {
    if (controller) {
      controller.abort();
      controller = null;
    }
    polling = false;
  }
  function sameOrigin(path) {
    return path.startsWith("/api/runtime/")
               ? path
               : (() => { throw new Error("invalid_runtime_route"); })();
  }
  function eventValid(e) {
    if (!e || e.version !== VERSION || e.sessionId !== sessionId ||
        !Number.isInteger(e.seq) || e.seq < 1 || !Number.isInteger(e.epoch) ||
        !TYPES.has(e.type) || !STATES.has(e.state) ||
        typeof e.eventId !== "string" || !e.data || typeof e.data !== "object")
      return false;
    if (e.type === "progress")
      return ACTIVE.has(e.state) && e.data.phase === e.state;
    if (e.type === "chat")
      return e.state === "idle" && typeof e.data.text === "string" &&
             [ "stub-model", "live-model" ].includes(e.data.source) &&
             e.data.verified === false;
    if (e.type === "clarification")
      return e.state === "clarifying" &&
             [ "recipient", "channel", "body" ].includes(e.data.field) &&
             typeof e.data.prompt === "string" &&
             Array.isArray(e.data.choices) &&
             e.data.choices.every(c => c && typeof c.id === "string" &&
                                       typeof c.label === "string") &&
             (e.data.field !== "body" || e.data.choices.length === 0);
    if (e.type === "preview")
      return e.state === "preview" && e.data.actionId === e.actionId &&
             typeof e.data.confirmationToken === "string" &&
             typeof e.data.expiresAt === "string" &&
             e.data.effect === "create_demo_draft" &&
             typeof e.data.effectLabel === "string" &&
             typeof e.data.body === "string" && e.data.body.length > 0 &&
             e.data.body.length <= 2000 && e.data.recipient &&
             typeof e.data.recipient.id === "string" && e.data.channel &&
             typeof e.data.recipient.label === "string" &&
             typeof e.data.recipient.detail === "string" &&
             typeof e.data.channel.id === "string" &&
             typeof e.data.channel.label === "string" && e.data.provenance &&
             e.data.provenance.turnId === e.turnId &&
             [ "user-span", "user-edit" ].includes(e.data.provenance.source) &&
             Number.isInteger(e.data.provenance.start) &&
             e.data.provenance.start >= 0 &&
             Number.isInteger(e.data.provenance.end) &&
             e.data.provenance.end > e.data.provenance.start &&
             (e.data.provenance.source !== "user-edit" ||
              e.data.provenance.end === e.data.body.length);
    if (e.type === "result")
      return e.state === "completed" &&
             e.data.effect === "demo_draft_created" &&
             e.data.verified === true && e.data.sent === false &&
             typeof e.data.body === "string" && e.data.body.length > 0 &&
             e.data.body.length <= 2000 && typeof e.data.draftId === "string" &&
             typeof e.data.recipientId === "string" &&
             typeof e.data.channelId === "string" &&
             e.data.message === "Draft created in the demo. Not sent.";
    if (e.type === "error")
      return ((e.state === "failed" && e.data.effect === "none") ||
              (e.state === "unknown" && e.data.effect === "unknown")) &&
             typeof e.data.code === "string" && e.data.retryable === false;
    return e.type === "cancellation" &&
           ((e.state === "stopped" && e.data.effect === "none") ||
            (e.state === "unknown" && e.data.effect === "unknown"));
  }
  function snapshotValid(s) {
    return !!s && s.version === VERSION && typeof s.sessionId === "string" &&
           s.mode === 'demo' && Number.isInteger(s.epoch) &&
           s.epoch >= 0 && Number.isInteger(s.cursor) && s.cursor >= 0 &&
           STATES.has(s.state) && Array.isArray(s.events) &&
           s.events.every(e => e && Number.isInteger(e.seq) && e.seq > 0 && e.seq <= s.cursor) &&
           (s.cursor > 0 || (s.state === 'idle' && s.epoch === 0 && s.events.length === 0));
  }
  function ingest(snapshot, expectedSession, requestGeneration) {
    if (requestGeneration !== generation)
      return false;
    if (!snapshotValid(snapshot) || snapshot.sessionId !== expectedSession ||
        snapshot.sessionId !== sessionId) {
      data.connection = "uncertain";
      data.error = "invalid_snapshot";
      data.pending = false;
      previewRevision++;
      emit();
      schedule();
      return false;
    }
    if (snapshot.epoch < epoch ||
        (snapshot.epoch === epoch && snapshot.cursor < cursor))
      return false;
    if (quarantined && snapshot.state !== "unknown")
      return false;
    const incoming =
        snapshot.events.filter(eventValid).sort((a, b) => a.seq - b.seq);
    let gap = false, newPreview = null;
    for (const event of incoming) {
      if (event.seq <= cursor)
        continue;
      if (event.seq !== cursor + 1) {
        gap = true;
        break;
      }
      if (eventIds.has(event.eventId)) {
        gap = true;
        break;
      }
      eventIds.add(event.eventId);
      cursor = event.seq;
      if (event.epoch < Math.max(epoch, snapshot.epoch))
        continue;
      data.events.push(event);
      if (event.type === "preview")
        newPreview = event;
      epoch = Math.max(epoch, event.epoch);
    }
    const tail = data.events.find(e => e.seq === snapshot.cursor);
    if (gap || snapshot.cursor > cursor ||
        (snapshot.cursor > 0 && (!tail || tail.epoch !== snapshot.epoch ||
                                 tail.state !== snapshot.state))) {
      data.connection = "uncertain";
      data.error = "event_gap";
      data.pending = false;
      data.canConfirm = false;
      emit();
      schedule(true);
      return false;
    }
    epoch = Math.max(epoch, snapshot.epoch);
    data.snapshot = {...snapshot, events : undefined};
    data.current = tail || null;
    if (newPreview && data.current === newPreview) {
      previewRevision++;
      previewAcceptedRevision = previewRevision;
    }
    if (snapshot.state === "unknown")
      quarantined = true;
    data.connection = "connected";
    data.error = quarantined ? "effect_unknown" : null;
    data.pending = ACTIVE.has(snapshot.state);
    data.stopping =
        data.stopping && !["stopped", "unknown"].includes(snapshot.state);
    emit();
    schedule();
    return true;
  }
  async function jsonRequest(path, init, requestGeneration) {
    const local = new AbortController();
    controller = local;
    let timeout = later(() => local.abort(), 8000);
    try {
      const response = await fetcher(sameOrigin(path), {
        ...init,
        signal : local.signal,
        headers :
            {"content-type" : "application/json", ...(init?.headers || {})}
      });
      let body = null;
      try {
        body = await response.json();
      } catch {
        throw new Error("invalid_json");
      }
      if (!response.ok) {
        const error = new Error(body?.error?.code || `http_${response.status}`);
        error.code = body?.error?.code || `http_${response.status}`;
        throw error;
      }
      return body;
    } finally {
      cancelLater(timeout);
      if (controller === local)
        controller = null;
    }
  }
  function transportError(error, requestGeneration) {
    if (requestGeneration !== generation)
      return;
    data.connection = "uncertain";
    data.error =
        error?.code || (error?.name === "AbortError"
                            ? "transport_timeout"
                            : String(error?.message || "transport_error"));
    data.pending = false;
    data.stopping = false;
    previewRevision++;
    emit();
    schedule();
  }
  function applicationError(error, g) {
    if (g !== generation)
      return false;
    data.error = error.code;
    data.pending = false;
    data.stopping = false;
    previewRevision++;
    if (!sessionId)
      data.connection = "disconnected";
    else if (error.code === "effect_unknown") {
      data.connection = "uncertain";
      quarantined = true;
    }
    emit();
    if (data.connection === "uncertain")
      schedule();
    return false;
  }
  function schedule(immediate = false) {
    stopTimer();
    if (!sessionId)
      return;
    if (data.pending || data.connection === "uncertain")
      timer = later(() => {
        timer = null;
        recover();
      }, immediate ? 0 : pollMs);
  }
  async function connect() {
    if (data.connection !== "disconnected")
      return false;
    const g = ++generation;
    data.connection = "connecting";
    data.error = null;
    emit();
    try {
      const snapshot = await jsonRequest("/api/runtime/session", {
        method : "POST",
        body : JSON.stringify({
          version : VERSION,
          requestId : uuid(),
          mode : "demo",
          consent : true
        })
      },
                                         g);
      if (g !== generation) {
        if (snapshotValid(snapshot) && data.connection === "disconnected") {
          try {
            await jsonRequest("/api/runtime/command", {
              method : "POST",
              body : JSON.stringify({
                version : VERSION,
                sessionId : snapshot.sessionId,
                requestId : uuid(),
                kind : "cancel",
                payload : {}
              })
            },
                              generation);
          } catch {
          }
        }
        return false;
      }
      if (!snapshotValid(snapshot))
        throw new Error("invalid_snapshot");
      sessionId = snapshot.sessionId;
      cursor = 0;
      epoch = 0;
      return ingest(snapshot, sessionId, g);
    } catch (error) {
      if (error.code)
        return applicationError(error, g);
      transportError(error, g);
      return false;
    }
  }
  function forbidden(kind) {
    return (data.snapshot?.state === "unknown" ||
            data.error === "effect_unknown") &&
           !['cancel'].includes(kind);
  }
  async function command(kind, payload = {}) {
    if (!sessionId ||
        (data.connection !== "connected" &&
         !(kind === "cancel" && data.connection === "uncertain")) ||
        (data.stopping && kind !== "cancel") || forbidden(kind))
      return false;
    if (!["turn", "clarify", "revise", "confirm", "cancel"].includes(kind))
      return false;
    if (kind === "confirm") {
      const c = data.current;
      if (!canConfirm() || payload.actionId !== c.data.actionId ||
          payload.confirmationToken !== c.data.confirmationToken)
        return false;
      previewRevision++;
      data.pending = true;
      emit();
    }
    const g = ++generation;
    stopTimer();
    abort();
    data.pending = true;
    if (kind === "cancel")
      data.stopping = true;
    emit();
    try {
      const snapshot = await jsonRequest("/api/runtime/command", {
        method : "POST",
        body : JSON.stringify(
            {version : VERSION, sessionId, requestId : uuid(), kind, payload})
      },
                                         g);
      return ingest(snapshot, sessionId, g);
    } catch (error) {
      if (error.code)
        return applicationError(error, g);
      transportError(error, g);
      return false;
    }
  }
  async function cancel() {
    if (data.connection === "connecting" && !sessionId) {
      generation++;
      stopTimer();
      abort();
      data.connection = "disconnected";
      data.pending = false;
      data.stopping = false;
      data.error = null;
      emit();
      return true;
    }
    if (!sessionId)
      return false;
    previewRevision++;
    data.stopping = true;
    data.pending = false;
    emit();
    return command("cancel", {});
  }
  async function recover() {
    if (!sessionId || polling)
      return false;
    const g = generation;
    polling = true;
    try {
      const snapshot =
          await jsonRequest(`/api/runtime/events?sessionId=${
                                encodeURIComponent(sessionId)}&after=${cursor}`,
                            {method : "GET", headers : {}}, g);
      return ingest(snapshot, sessionId, g);
    } catch (error) {
      transportError(error, g);
      return false;
    } finally {
      polling = false;
    }
  }
  function invalidatePreview() {
    previewRevision++;
    emit();
    return true;
  }
  function disconnect() {
    generation++;
    stopTimer();
    abort();
    sessionId = null;
    cursor = 0;
    epoch = 0;
    eventIds.clear();
    quarantined = false;
    data = {
      connection : "disconnected",
      snapshot : null,
      current : null,
      events : [],
      pending : false,
      stopping : false,
      error : null,
      canConfirm : false
    };
    emit();
    return true;
  }
  return {
    connect,
    command,
    cancel,
    recover,
    disconnect,
    invalidatePreview,
    get view() { return view(); }
  };
}
const api = {
  create,
  VERSION
};
root.GrannyRuntime = api;
if (typeof module !== "undefined")
  module.exports = api;
})(globalThis);
