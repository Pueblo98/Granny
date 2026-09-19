import { createHash } from "node:crypto";

export const FIXTURE_VERSION = "t103-fixture-v1";
export const PRIVATE_CANARY = "SYNTHETIC-PRIVATE-DO-NOT-EXPORT";
export const OBSERVATION_MAX_AGE_MS = 2_000;
export const PERMIT_TTL_MS = 60_000;
export const OPERATION_BUDGET = 12;
export const MACHINE_DEADLINE_MS = 60_000;

export const OPERATION_STATES = Object.freeze([
  "Proposed", "Prepared", "Ready", "Reserved", "Dispatched", "Verifying", "NoEffect", "Unknown",
  "Partial", "Invalidated", "Denied", "CancelledNoDispatch", "Verified", "Failed", "ClosedUnknown",
]);
export const EVENT_KINDS = Object.freeze([
  "Prepared", "PreviewRendered", "ApprovalSubmitted", "CancelRequested", "DispatchReserved", "DispatchBegin",
  "AdapterReturned", "PredicateObserved", "InternalOperation", "HistoryDeleted",
]);

const FINAL_STATES = new Set([
  "Denied",
  "Invalidated",
  "CancelledNoDispatch",
  "Verified",
  "Failed",
  "ClosedUnknown",
]);
const JOURNAL_FIELDS = Object.freeze([
  "operationId",
  "taskId",
  "capabilityId",
  "adapterId",
  "adapterVersion",
  "policyVersion",
  "dispatchCategory",
  "outcomeCategory",
  "coarseTick",
  "generation",
  "verificationGrade",
]);

export class ContractError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = "ContractError";
    this.code = code;
  }
}

function deny(code, message) {
  throw new ContractError(code, message);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, required, optional = [], code = "schema_invalid") {
  if (!isRecord(value)) deny(code);
  const requiredSet = new Set(required);
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) deny("unknown_field", `Unknown field: ${key}`);
  }
  for (const key of requiredSet) {
    if (!Object.hasOwn(value, key)) deny(code, `Missing field: ${key}`);
  }
  return value;
}

function text(value, field) {
  if (typeof value !== "string" || value.length === 0) deny("schema_invalid", field);
  return value;
}

function bool(value, field) {
  if (typeof value !== "boolean") deny("schema_invalid", field);
  return value;
}

function integer(value, field) {
  if (!Number.isSafeInteger(value) || value < 0) deny("schema_invalid", field);
  return value;
}

function copy(value) {
  return structuredClone(value);
}

function deepFreeze(value) {
  if (!isRecord(value) && !Array.isArray(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function digestPrepared(action) {
  const canonical = JSON.stringify([
    "t103-prepared-v1",
    action.capabilityId,
    action.operation,
    action.endpointId ?? null,
    action.accountId,
    action.windowId,
    action.channel ?? null,
    action.body ?? null,
    action.destination ?? null,
    action.expectedEffect,
    action.taskId,
    action.intentRevision,
    action.registryVersion,
    action.adapterId,
    action.adapterVersion,
    action.policyVersion,
    action.contextEpoch,
    action.generation,
  ]);
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export class FakeClock {
  constructor({ nowMs = 0, generation = "boot-1" } = {}) {
    this.nowMs = integer(nowMs, "nowMs");
    this.generation = text(generation, "generation");
  }

  now() {
    return Object.freeze({ nowMs: this.nowMs, generation: this.generation });
  }

  advance(milliseconds) {
    integer(milliseconds, "milliseconds");
    const next = this.nowMs + milliseconds;
    if (!Number.isSafeInteger(next)) deny("clock_overflow");
    this.nowMs = next;
    return this.now();
  }

  regress(milliseconds) {
    integer(milliseconds, "milliseconds");
    this.nowMs = Math.max(0, this.nowMs - milliseconds);
    return this.now();
  }

  restart(generation) {
    this.generation = text(generation, "generation");
    this.nowMs = 0;
    return this.now();
  }
}

export class FakeJournal {
  constructor(rows = []) {
    this.rows = rows.map((row) => copy(row));
  }

  write(row) {
    exactKeys(row, JOURNAL_FIELDS, [], "journal_schema_invalid");
    this.rows.push(copy(row));
  }

  update(operationId, patch) {
    const row = this.rows.find((entry) => entry.operationId === operationId);
    if (!row) deny("journal_missing");
    for (const key of Object.keys(patch)) {
      if (!JOURNAL_FIELDS.includes(key)) deny("journal_schema_invalid");
      row[key] = copy(patch[key]);
    }
  }

  snapshot() {
    return this.rows.map((row) => copy(row));
  }

  clear() {
    this.rows.length = 0;
  }

  static fieldInventory() {
    return [...JOURNAL_FIELDS];
  }
}

export class FakeEffectLedger {
  constructor() {
    this.effects = [];
    this.pending = [];
  }

  record(effect) {
    this.effects.push(deepFreeze(copy(effect)));
  }

  delay(effect) {
    this.pending.push(deepFreeze(copy(effect)));
  }

  flush(operationId) {
    const remaining = [];
    for (const effect of this.pending) {
      if (effect.operationId === operationId) this.record(effect);
      else remaining.push(effect);
    }
    this.pending = remaining;
  }

  observations(operationId) {
    return this.effects
      .filter((effect) => effect.operationId === operationId)
      .map((effect) => copy(effect));
  }

  count(operationId) {
    return this.effects.filter((effect) => effect.operationId === operationId).length;
  }

  hasPending(operationId) {
    return this.pending.some((effect) => effect.operationId === operationId);
  }
}

export class FakeVerifier {
  constructor(ledger) {
    this.ledger = ledger;
    this.overrides = new Map();
  }

  override(operationId, observation) {
    this.overrides.set(operationId, copy(observation));
  }

  observe(operationId, expectedValues) {
    const effects = this.ledger.observations(operationId);
    const values = this.overrides.has(operationId)
      ? [copy(this.overrides.get(operationId))]
      : effects.map(({ operationId: ignored, ...effect }) => effect);
    const matches = values.filter((value) => JSON.stringify(value) === JSON.stringify(expectedValues));
    let grade = this.ledger.hasPending(operationId) ? "pending" : "missing";
    if (matches.length === 1 && values.length === 1) grade = "matched";
    else if (matches.length > 1 || values.length > 1) grade = "conflict";
    else if (values.length === 1) {
      const observed = values[0];
      const observedEntries = Object.entries(observed);
      const subset = observedEntries.length < Object.keys(expectedValues).length
        && observedEntries.every(([key, value]) => JSON.stringify(expectedValues[key]) === JSON.stringify(value));
      grade = subset ? "partial" : "wrong";
    }
    return deepFreeze({
      source: "test-owned-effect-ledger",
      predicateId: expectedValues.kind === "message" ? "message-exact-effect-v1" : "navigation-exact-effect-v1",
      expectedValues: copy(expectedValues),
      observedValues: copy(values),
      grade,
    });
  }
}

export class FakeAdapter {
  constructor(ledger) {
    this.ledger = ledger;
    this.entries = [];
  }

  dispatch(operation, action, behavior = "effect-with-receipt") {
    const supported = new Set([
      "effect-with-receipt",
      "receipt-before-effect",
      "effect-without-receipt",
      "duplicate-receipt",
      "conflicting-receipt",
      "no-effect",
      "delayed-effect",
    ]);
    if (!supported.has(behavior)) deny("adapter_behavior_unknown");
    this.entries.push(operation.operationId);
    const effect = { operationId: operation.operationId, ...copy(action.expectedEffect) };
    const accepted = deepFreeze({ operationId: operation.operationId, status: "accepted", generation: operation.generation });
    if (behavior === "effect-with-receipt") {
      this.ledger.record(effect);
      return [accepted];
    }
    if (behavior === "receipt-before-effect") {
      this.ledger.delay(effect);
      return [accepted];
    }
    if (behavior === "effect-without-receipt") {
      this.ledger.record(effect);
      return [];
    }
    if (behavior === "duplicate-receipt") {
      this.ledger.record(effect);
      return [accepted, copy(accepted)];
    }
    if (behavior === "conflicting-receipt") {
      this.ledger.record(effect);
      return [accepted, deepFreeze({ operationId: operation.operationId, status: "rejected", generation: operation.generation })];
    }
    if (behavior === "delayed-effect") {
      this.ledger.delay(effect);
      return [];
    }
    return [];
  }
}

export class FakePlanner {
  constructor(mode, proposal) {
    this.mode = mode;
    this.proposal = proposal === undefined ? undefined : copy(proposal);
  }

  propose() {
    if (this.mode === "timeout") return deepFreeze({ kind: "failure", code: "provider_timeout" });
    if (this.mode === "malformed") return deepFreeze({ kind: "proposal", value: { tool: "message.send", schemaVersion: 1 } });
    return deepFreeze({ kind: "proposal", value: copy(this.proposal), provider: this.mode });
  }
}

export class AuthorityCore {
  constructor({
    clock = new FakeClock(),
    ledger = new FakeEffectLedger(),
    verifier,
    adapter,
    journal = new FakeJournal(),
    buildMode = "offline-contract",
    registryVersion = "registry-v1",
    policyVersion = "policy-v1",
  } = {}) {
    if (!new Set(["offline-contract", "candidate"]).has(buildMode)) deny("build_mode_unknown");
    if (policyVersion !== "policy-v1") deny("policy_version_unknown");
    this.clock = clock;
    this.ledger = ledger;
    this.verifier = verifier ?? new FakeVerifier(ledger);
    this.adapter = adapter ?? new FakeAdapter(ledger);
    this.journal = journal;
    this.buildMode = buildMode;
    this.registryVersion = registryVersion;
    this.policyVersion = policyVersion;
    this.sequence = 0;
    this.userEpoch = 0;
    this.cancelEpoch = 0;
    this.intentRevision = 1;
    this.contextEpoch = 1;
    this.cancelled = false;
    this.dependencies = { permission: true, visibility: true, authenticated: true };
    this.actions = new Map();
    this.previews = new Map();
    this.permits = new Map();
    this.operations = new Map();
    this.operationsByRequest = new Map();
    this.tasks = new Map();
    this.events = [];
    this.diagnostics = [];
    this.exportSink = [];
    this.lastClock = new Map();
    this.closedGenerations = new Set();
    this.historyDeleted = false;
    this.registry = this.#makeRegistry();
    this.#validateAndQuarantineJournal();
  }

  #makeRegistry() {
    return new Map([
      ["navigation.open", deepFreeze({
        tool: "navigation.open",
        schemaVersion: 1,
        capabilityId: "CAP-01",
        adapterId: "fake-navigation",
        adapterVersion: "adapter-v1",
        policyClass: "POL-01",
        allowedModes: ["offline-contract"],
        declaredEffect: "navigation",
      })],
      ["message.send", deepFreeze({
        tool: "message.send",
        schemaVersion: 1,
        capabilityId: "CAP-09",
        adapterId: "fake-message",
        adapterVersion: "adapter-v1",
        policyClass: "POL-03",
        allowedModes: ["offline-contract"],
        declaredEffect: "message",
      })],
      ["message.send.lab", deepFreeze({
        tool: "message.send.lab",
        schemaVersion: 1,
        capabilityId: "CAP-09-LAB",
        adapterId: "fake-message-lab",
        adapterVersion: "lab-v1",
        policyClass: "POL-03",
        allowedModes: ["offline-contract"],
        declaredEffect: "message",
      })],
    ]);
  }

  #tick() {
    const reading = this.clock.now();
    const prior = this.lastClock.get(reading.generation);
    if (prior !== undefined && reading.nowMs < prior) deny("clock_regression");
    this.lastClock.set(reading.generation, reading.nowMs);
    return reading;
  }

  #id(prefix) {
    this.sequence += 1;
    return `${prefix}-${this.sequence}`;
  }

  #event(kind, details = {}) {
    if (!EVENT_KINDS.includes(kind)) deny("event_kind_unknown");
    const { nowMs, generation } = this.#tick();
    const event = deepFreeze({
      sequence: this.events.length + 1,
      kind,
      generation,
      nowMs,
      userEpoch: this.userEpoch,
      cancelEpoch: this.cancelEpoch,
      intentRevision: this.intentRevision,
      ...copy(details),
    });
    this.events.push(event);
    return event;
  }

  #diagnose(code, operationId = null) {
    this.diagnostics.push(deepFreeze({ code, operationId, generation: this.clock.generation }));
  }

  #task(taskId) {
    if (!this.tasks.has(taskId)) {
      const { nowMs, generation } = this.#tick();
      this.tasks.set(taskId, {
        taskId,
        generation,
        startMs: nowMs,
        operations: 0,
        pairs: new Map(),
        recoveriesWithoutProgress: 0,
        state: "planning",
      });
    }
    return this.tasks.get(taskId);
  }

  #validateAndQuarantineJournal() {
    this.journal.rows = this.journal.rows.map((row, index) => {
      try {
        exactKeys(row, JOURNAL_FIELDS, [], "journal_schema_invalid");
        for (const field of JOURNAL_FIELDS) {
          if (row[field] === undefined || row[field] === null) deny("journal_schema_invalid");
        }
        if (!OPERATION_STATES.includes(row.outcomeCategory)) deny("journal_schema_invalid");
        if (["Reserved", "Dispatched", "Verifying", "Unknown"].includes(row.outcomeCategory)) {
          row.outcomeCategory = "ClosedUnknown";
          row.verificationGrade = "restart-quarantine";
        }
        return row;
      } catch {
        this.#diagnose("journal_corrupt");
        return {
          operationId: `quarantined-operation-${index + 1}`,
          taskId: `quarantined-task-${index + 1}`,
          capabilityId: "unknown",
          adapterId: "unknown",
          adapterVersion: "unknown",
          policyVersion: "unknown",
          dispatchCategory: "quarantined",
          outcomeCategory: "ClosedUnknown",
          coarseTick: 0,
          generation: this.clock.generation,
          verificationGrade: "corrupt-quarantine",
        };
      }
    });
  }

  #parseProposal(proposal) {
    exactKeys(proposal, ["tool", "schemaVersion", "arguments"], [], "proposal_schema_invalid");
    text(proposal.tool, "tool");
    integer(proposal.schemaVersion, "schemaVersion");
    const manifest = this.registry.get(proposal.tool);
    if (!manifest) deny("tool_unknown");
    if (proposal.schemaVersion !== manifest.schemaVersion) deny("schema_version_unknown");
    if (this.registryVersion !== "registry-v1") deny("registry_version_unknown");
    if (!manifest.allowedModes.includes(this.buildMode)) deny("build_mode_denied");
    let args;
    if (manifest.declaredEffect === "message") {
      args = exactKeys(proposal.arguments, ["endpointId", "channel", "body", "accountId", "windowId"], [], "arguments_schema_invalid");
      for (const field of ["endpointId", "channel", "body", "accountId", "windowId"]) text(args[field], field);
      if (!new Set(["person-a", "person-b"]).has(args.endpointId)) deny("endpoint_unknown");
      if (args.channel !== "fixture-chat") deny("channel_unknown");
    } else {
      args = exactKeys(proposal.arguments, ["destination", "accountId", "windowId"], [], "arguments_schema_invalid");
      for (const field of ["destination", "accountId", "windowId"]) text(args[field], field);
      if (args.destination !== "fixture-screen") deny("destination_unknown");
    }
    return { manifest, args };
  }

  #validateObservation(observation, actionLike = null) {
    exactKeys(observation, [
      "observationId",
      "capturedAtMs",
      "generation",
      "accountId",
      "windowId",
      "endpointId",
      "channel",
      "permission",
      "visibility",
      "authenticated",
      "contextEpoch",
      "registryVersion",
      "adapterVersion",
      "privateText",
    ], [], "observation_schema_invalid");
    text(observation.observationId, "observationId");
    integer(observation.capturedAtMs, "capturedAtMs");
    for (const field of ["generation", "accountId", "windowId", "endpointId", "channel", "registryVersion", "adapterVersion"]) {
      text(observation[field], field);
    }
    for (const field of ["permission", "visibility", "authenticated"]) bool(observation[field], field);
    integer(observation.contextEpoch, "contextEpoch");
    if (typeof observation.privateText !== "string") deny("observation_schema_invalid");
    const { nowMs, generation } = this.#tick();
    if (observation.generation !== generation) deny("observation_generation_invalid");
    if (observation.capturedAtMs > nowMs) deny("observation_future");
    if (nowMs - observation.capturedAtMs > OBSERVATION_MAX_AGE_MS) deny("observation_stale");
    if (observation.contextEpoch !== this.contextEpoch) deny("context_epoch_invalid");
    if (observation.registryVersion !== this.registryVersion) deny("registry_version_unknown");
    if (!observation.permission || !observation.visibility || !observation.authenticated) deny("dependency_unavailable");
    if (actionLike) {
      if (observation.accountId !== actionLike.accountId || observation.windowId !== actionLike.windowId) deny("target_mismatch");
      if (actionLike.endpointId && observation.endpointId !== actionLike.endpointId) deny("target_mismatch");
      if (actionLike.channel && observation.channel !== actionLike.channel) deny("target_mismatch");
      if (observation.adapterVersion !== actionLike.adapterVersion) deny("adapter_version_unknown");
    }
    return observation;
  }

  #checkDependencies() {
    if (!this.dependencies.permission) deny("permission_lost");
    if (!this.dependencies.visibility) deny("visibility_lost");
    if (!this.dependencies.authenticated) deny("authentication_lost");
  }

  #checkBudget(task, count = 0) {
    if (task.state === "failed") deny("no_progress_circuit");
    const { nowMs, generation } = this.#tick();
    if (generation !== task.generation) deny("task_generation_invalid");
    if (nowMs - task.startMs >= MACHINE_DEADLINE_MS) deny("machine_deadline_exhausted");
    if (task.operations + count > OPERATION_BUDGET) deny("operation_budget_exhausted");
  }

  #checkPermit(action, permit) {
    if (action.policyClass !== "POL-03") return;
    if (!permit || !isRecord(permit)) deny("permit_missing");
    exactKeys(permit, [
      "permitId", "actionId", "taskId", "preparedDigest", "generation", "issuedAtMs", "expiresAtMs",
      "userEpoch", "cancelEpoch", "intentRevision", "contextEpoch", "consumed",
    ], [], "permit_schema_invalid");
    const stored = this.permits.get(permit.permitId);
    if (!stored) deny("permit_unknown");
    if (stored.consumed) deny("permit_replayed");
    for (const field of [
      "actionId", "taskId", "preparedDigest", "generation", "issuedAtMs", "expiresAtMs", "userEpoch",
      "cancelEpoch", "intentRevision", "contextEpoch",
    ]) {
      if (permit[field] !== stored[field]) deny("permit_binding_mismatch");
    }
    const { nowMs, generation } = this.#tick();
    if (stored.generation !== generation || stored.generation !== action.generation) deny("permit_generation_invalid");
    if (nowMs >= stored.expiresAtMs) deny("permit_expired");
    if (stored.actionId !== action.actionId || stored.preparedDigest !== action.preparedDigest) deny("permit_binding_mismatch");
    if (stored.taskId !== action.taskId || stored.userEpoch !== this.userEpoch || stored.cancelEpoch !== this.cancelEpoch) deny("permit_epoch_invalid");
    if (stored.intentRevision !== action.intentRevision || stored.contextEpoch !== action.contextEpoch) deny("permit_binding_mismatch");
  }

  prepare({ requestId, taskId = "task-1", proposal, observation }) {
    text(requestId, "requestId");
    text(taskId, "taskId");
    if (this.cancelled) deny("cancelled");
    this.#checkDependencies();
    const { manifest, args } = this.#parseProposal(proposal);
    this.#validateObservation(observation);
    if (observation.adapterVersion !== manifest.adapterVersion) deny("adapter_version_unknown");
    if (observation.accountId !== args.accountId || observation.windowId !== args.windowId) deny("target_mismatch");
    if (manifest.declaredEffect === "message" && (observation.endpointId !== args.endpointId || observation.channel !== args.channel)) deny("target_mismatch");
    const existing = [...this.actions.values()].find((action) => action.requestId === requestId);
    if (existing) return existing;
    this.#task(taskId);
    const base = {
      actionId: this.#id("prepared"),
      requestId,
      taskId,
      capabilityId: manifest.capabilityId,
      operation: manifest.tool,
      policyClass: manifest.policyClass,
      adapterId: manifest.adapterId,
      adapterVersion: manifest.adapterVersion,
      registryVersion: this.registryVersion,
      policyVersion: this.policyVersion,
      generation: this.clock.generation,
      userEpoch: this.userEpoch,
      cancelEpoch: this.cancelEpoch,
      intentRevision: this.intentRevision,
      contextEpoch: this.contextEpoch,
      observation: copy(observation),
      accountId: args.accountId,
      windowId: args.windowId,
      endpointId: args.endpointId,
      channel: args.channel,
      body: args.body,
      destination: args.destination,
      expectedEffect: manifest.declaredEffect === "message"
        ? { kind: "message", endpointId: args.endpointId, channel: args.channel, body: args.body, accountId: args.accountId, windowId: args.windowId }
        : { kind: "navigation", destination: args.destination, accountId: args.accountId, windowId: args.windowId },
    };
    const action = deepFreeze({ ...base, preparedDigest: digestPrepared(base) });
    this.actions.set(action.actionId, action);
    this.#event("Prepared", { taskId, actionId: action.actionId });
    return action;
  }

  render(action) {
    if (this.actions.get(action.actionId) !== action) deny("prepared_unknown");
    const preview = deepFreeze({
      previewId: this.#id("preview"),
      actionId: action.actionId,
      preparedDigest: action.preparedDigest,
      renderRevision: 1,
      generation: this.clock.generation,
    });
    this.previews.set(preview.previewId, preview);
    this.#event("PreviewRendered", { taskId: action.taskId, actionId: action.actionId });
    return preview;
  }

  approve(input) {
    exactKeys(input, ["source", "previewId", "response"], [], "approval_schema_invalid");
    if (input.source !== "trusted-user-input") deny("approval_source_untrusted");
    if (input.response !== "approve") deny("approval_not_affirmative");
    const preview = this.previews.get(input.previewId);
    if (!preview) deny("preview_unknown");
    const action = this.actions.get(preview.actionId);
    if (!action || preview.preparedDigest !== action.preparedDigest) deny("preview_invalid");
    if (action.policyClass !== "POL-03") deny("permit_not_required");
    if (this.cancelled) deny("cancelled");
    if (this.operationsByRequest.has(action.requestId)) deny("operation_already_exists");
    const { nowMs, generation } = this.#tick();
    if (generation !== action.generation) deny("approval_generation_invalid");
    const existing = [...this.permits.values()].find((permit) => permit.actionId === action.actionId && !permit.consumed);
    if (existing) return existing.publicPermit;
    const storedPermit = {
      permitId: this.#id("permit"),
      actionId: action.actionId,
      taskId: action.taskId,
      preparedDigest: action.preparedDigest,
      generation,
      issuedAtMs: nowMs,
      expiresAtMs: nowMs + PERMIT_TTL_MS,
      userEpoch: this.userEpoch,
      cancelEpoch: this.cancelEpoch,
      intentRevision: this.intentRevision,
      contextEpoch: this.contextEpoch,
      consumed: false,
    };
    const publicPermit = deepFreeze(copy(storedPermit));
    storedPermit.publicPermit = publicPermit;
    this.permits.set(storedPermit.permitId, storedPermit);
    this.#event("ApprovalSubmitted", { taskId: action.taskId, actionId: action.actionId });
    return publicPermit;
  }

  stop(reason = "Stop") {
    this.cancelled = true;
    this.cancelEpoch += 1;
    this.userEpoch += 1;
    this.#event("CancelRequested", { reason });
    for (const operation of this.operations.values()) {
      if (operation.state === "Reserved") {
        operation.state = "CancelledNoDispatch";
        this.journal.update(operation.operationId, { outcomeCategory: "CancelledNoDispatch", verificationGrade: "not-dispatched" });
      }
    }
    return deepFreeze({ cancelled: true, cancelEpoch: this.cancelEpoch });
  }

  loseDependency(kind) {
    if (!Object.hasOwn(this.dependencies, kind)) deny("dependency_unknown");
    this.dependencies[kind] = false;
    return this.stop(`${kind}-lost`);
  }

  reserve(action, permit = null) {
    if (this.actions.get(action.actionId) !== action) deny("prepared_unknown");
    if (this.cancelled) deny("cancelled");
    if (action.generation !== this.clock.generation) deny("action_generation_invalid");
    this.#checkDependencies();
    this.#validateObservation(action.observation, action);
    this.#checkPermit(action, permit);
    const task = this.#task(action.taskId);
    this.#checkBudget(task, 1);
    const existing = this.operationsByRequest.get(action.requestId);
    if (existing) return existing;
    const { nowMs, generation } = this.#tick();
    const operation = {
      operationId: this.#id("operation"),
      requestId: action.requestId,
      taskId: action.taskId,
      actionId: action.actionId,
      state: "Reserved",
      generation,
      receipts: [],
      verification: null,
    };
    this.journal.write({
      operationId: operation.operationId,
      taskId: operation.taskId,
      capabilityId: action.capabilityId,
      adapterId: action.adapterId,
      adapterVersion: action.adapterVersion,
      policyVersion: action.policyVersion,
      dispatchCategory: "reserved",
      outcomeCategory: "Reserved",
      coarseTick: Math.floor(nowMs / 1_000),
      generation,
      verificationGrade: "unverified",
    });
    this.operations.set(operation.operationId, operation);
    this.operationsByRequest.set(action.requestId, operation);
    this.#event("DispatchReserved", { taskId: action.taskId, operationId: operation.operationId });
    return operation;
  }

  admit(operation, action, permit = null, freshObservation = action.observation) {
    if (this.operations.get(operation.operationId) !== operation) deny("operation_unknown");
    if (operation.state === "CancelledNoDispatch" || this.cancelled) deny("cancelled");
    if (operation.state !== "Reserved") deny("operation_state_invalid");
    this.#checkDependencies();
    this.#validateObservation(freshObservation, action);
    this.#checkPermit(action, permit);
    const task = this.#task(action.taskId);
    this.#checkBudget(task, 1);
    task.operations += 1;
    if (permit) this.permits.get(permit.permitId).consumed = true;
    operation.state = "Dispatched";
    this.journal.update(operation.operationId, { dispatchCategory: "admitted", outcomeCategory: "Dispatched" });
    this.#event("DispatchBegin", { taskId: action.taskId, operationId: operation.operationId });
    return operation;
  }

  execute(operation, action, behavior = "effect-with-receipt") {
    if (operation.state !== "Dispatched") deny("operation_state_invalid");
    const receipts = this.adapter.dispatch(operation, action, behavior);
    operation.receipts.push(...receipts.map((receipt) => copy(receipt)));
    operation.state = "Verifying";
    this.journal.update(operation.operationId, { outcomeCategory: "Verifying" });
    this.#event("AdapterReturned", { taskId: operation.taskId, operationId: operation.operationId, receiptCount: receipts.length });
    return receipts.map((receipt) => copy(receipt));
  }

  handleCallback(callback) {
    exactKeys(callback, ["operationId", "generation", "status"], [], "callback_schema_invalid");
    const operation = this.operations.get(callback.operationId);
    if (!operation || callback.generation !== this.clock.generation || operation.generation !== callback.generation || FINAL_STATES.has(operation.state)) {
      this.#diagnose("stale_callback", callback.operationId);
      return deepFreeze({ accepted: false, reason: "stale_callback" });
    }
    const duplicate = operation.receipts.some((receipt) => receipt.status === callback.status && receipt.generation === callback.generation);
    if (!duplicate) operation.receipts.push(copy(callback));
    return deepFreeze({ accepted: !duplicate, reason: duplicate ? "duplicate_callback" : "recorded" });
  }

  verify(operation, action) {
    if (!new Set(["Verifying", "Unknown"]).has(operation.state)) deny("operation_state_invalid");
    const evidence = this.verifier.observe(operation.operationId, copy(action.expectedEffect));
    if (evidence.expectedValues === action.expectedEffect || evidence.observedValues === action.expectedEffect) deny("oracle_alias_invalid");
    const receiptStatuses = new Set(operation.receipts.map((receipt) => receipt.status));
    let next;
    if (receiptStatuses.size > 1 || evidence.grade === "conflict" || evidence.grade === "wrong") next = "Unknown";
    else if (evidence.grade === "matched") next = "Verified";
    else if (evidence.grade === "partial") next = "Partial";
    else if (evidence.grade === "pending" || (evidence.grade === "missing" && receiptStatuses.has("accepted"))) next = "Unknown";
    else if (evidence.grade === "missing") next = "NoEffect";
    else next = "Unknown";
    operation.state = next;
    operation.verification = evidence;
    const task = this.#task(action.taskId);
    if (this.cancelled) task.state = next === "Verified" ? "stopped-verified" : "stopped-unknown";
    else task.state = next === "Verified" ? (action.operation === "navigation.open" ? "planning" : "completed") : next.toLowerCase();
    this.journal.update(operation.operationId, { outcomeCategory: next, verificationGrade: evidence.grade });
    this.#event("PredicateObserved", { taskId: action.taskId, operationId: operation.operationId, grade: evidence.grade });
    return deepFreeze({ operationState: next, taskState: task.state, evidence });
  }

  dispatch(action, permit = null, behavior = "effect-with-receipt") {
    const existing = this.operationsByRequest.get(action.requestId);
    if (existing) return existing;
    const operation = this.reserve(action, permit);
    this.admit(operation, action, permit, action.observation);
    this.execute(operation, action, behavior);
    this.verify(operation, action);
    return operation;
  }

  reconcile(operation, action) {
    if (operation.state !== "Unknown" && operation.state !== "Verifying") deny("reconcile_not_allowed");
    return this.verify(operation, action);
  }

  debitInternal(taskId, operationName) {
    text(operationName, "operationName");
    if (this.cancelled) deny("cancelled");
    const task = this.#task(taskId);
    this.#checkBudget(task, 1);
    task.operations += 1;
    this.#event("InternalOperation", { taskId, operationName });
    return task.operations;
  }

  noProgress(taskId, state, action, { recovery = false, progress = false } = {}) {
    const task = this.#task(taskId);
    if (progress) {
      task.pairs.clear();
      task.recoveriesWithoutProgress = 0;
      return deepFreeze({ stopped: false });
    }
    const key = `${state}\u0000${action}`;
    const count = (task.pairs.get(key) ?? 0) + 1;
    task.pairs.set(key, count);
    if (recovery) task.recoveriesWithoutProgress += 1;
    if (count >= 2 || task.recoveriesWithoutProgress >= 2) {
      task.state = "failed";
      this.#diagnose("no_progress_circuit", null);
      return deepFreeze({ stopped: true, reason: "no_progress_circuit" });
    }
    return deepFreeze({ stopped: false });
  }

  beginPlanning(planner) {
    return deepFreeze({
      planner,
      generation: this.clock.generation,
      userEpoch: this.userEpoch,
      cancelEpoch: this.cancelEpoch,
      intentRevision: this.intentRevision,
    });
  }

  resolvePlanning(handle) {
    if (handle.generation !== this.clock.generation || handle.userEpoch !== this.userEpoch || handle.cancelEpoch !== this.cancelEpoch || this.cancelled) {
      return deepFreeze({ kind: "discarded", code: "late_planner_result" });
    }
    const result = handle.planner.propose();
    if (result.kind === "failure") return result;
    try {
      this.#parseProposal(result.value);
      return result;
    } catch (error) {
      if (error instanceof ContractError) return deepFreeze({ kind: "denied", code: error.code });
      throw error;
    }
  }

  restart(nextGeneration, { journalRows } = {}) {
    this.closedGenerations.add(this.clock.generation);
    this.clock.restart(nextGeneration);
    const journal = new FakeJournal(journalRows ?? this.journal.snapshot());
    return new AuthorityCore({
      clock: this.clock,
      ledger: this.ledger,
      verifier: this.verifier,
      adapter: this.adapter,
      journal,
      buildMode: this.buildMode,
      registryVersion: this.registryVersion,
      policyVersion: this.policyVersion,
    });
  }

  deleteHistory() {
    this.journal.clear();
    this.diagnostics.length = 0;
    this.exportSink.length = 0;
    this.historyDeleted = true;
    this.operations.clear();
    this.operationsByRequest.clear();
    this.actions.clear();
    this.previews.clear();
    this.permits.clear();
    this.#event("HistoryDeleted");
  }

  exportAudit() {
    const projection = this.journal.snapshot().map((row) => copy(row));
    this.exportSink.push(...projection);
    return projection;
  }

  privacySnapshot() {
    return deepFreeze({
      journal: this.journal.snapshot(),
      diagnostics: copy(this.diagnostics),
      exportSink: copy(this.exportSink),
      journalFields: FakeJournal.fieldInventory(),
    });
  }
}

export function fixtureObservation(clock, overrides = {}) {
  return {
    observationId: "observation-1",
    capturedAtMs: clock.nowMs,
    generation: clock.generation,
    accountId: "account-a",
    windowId: "window-a",
    endpointId: "person-a",
    channel: "fixture-chat",
    permission: true,
    visibility: true,
    authenticated: true,
    contextEpoch: 1,
    registryVersion: "registry-v1",
    adapterVersion: "adapter-v1",
    privateText: "",
    ...overrides,
  };
}

export function messageProposal(overrides = {}) {
  return {
    tool: "message.send",
    schemaVersion: 1,
    arguments: {
      endpointId: "person-a",
      channel: "fixture-chat",
      body: "Meet at six.",
      accountId: "account-a",
      windowId: "window-a",
      ...(overrides.arguments ?? {}),
    },
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== "arguments")),
  };
}

export function navigationProposal(overrides = {}) {
  return {
    tool: "navigation.open",
    schemaVersion: 1,
    arguments: {
      destination: "fixture-screen",
      accountId: "account-a",
      windowId: "window-a",
      ...(overrides.arguments ?? {}),
    },
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== "arguments")),
  };
}
