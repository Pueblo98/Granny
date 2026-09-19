import test, { after } from "node:test";
import assert from "node:assert/strict";
import {
  AuthorityCore,
  ContractError,
  FakeClock,
  FakeEffectLedger,
  FakeJournal,
  FakePlanner,
  FIXTURE_VERSION,
  PRIVATE_CANARY,
  fixtureObservation,
  messageProposal,
  navigationProposal,
} from "./core.mjs";

const results = new Map();
const definitions = [
  ["C01", "valid exact dispatch and independent receipt", "EVAL-010"],
  ["C02", "verified navigation returns to planning before message completion", "EVAL-006/010"],
  ["C03", "edited consequence invalidates old permit", "EVAL-010"],
  ["C04", "permit/request/callback replay is idempotent", "EVAL-010"],
  ["C05", "untrusted authority and unknown schema fields are denied", "EVAL-010"],
  ["C06", "stable endpoint, account, channel and window stay bound", "EVAL-010"],
  ["C07", "observation freshness and generation boundaries", "EVAL-010"],
  ["C08", "permit expiry and generation boundaries", "EVAL-010"],
  ["C09", "Stop orderings serialize against adapter admission", "EVAL-006"],
  ["C10", "permission, visibility and authentication are rechecked", "EVAL-006/009"],
  ["C11", "restart quarantines every unresolved crash window", "EVAL-006/010"],
  ["C12", "lost callback cannot trigger a duplicate effect", "EVAL-010"],
  ["C13", "adapter success is not outcome evidence", "EVAL-010"],
  ["C14", "provider timeout, lateness, malformed and alternate proposals", "EVAL-009"],
  ["C15", "shared internal-operation and deadline budgets", "EVAL-006/010"],
  ["C16", "same-pair and recovery no-progress circuits", "EVAL-010"],
  ["C17", "private content is excluded from durable and export sinks", "EVAL-008/010"],
  ["C18", "history deletion prevents callback resurrection", "EVAL-008/010"],
  ["C19", "build-mode and version admission fail closed", "EVAL-009/010"],
  ["C20", "conflicting evidence, corruption and clock regression stay uncertain", "EVAL-006/010"],
];

function make() {
  const clock = new FakeClock({ nowMs: 10_000, generation: "boot-1" });
  const ledger = new FakeEffectLedger();
  const core = new AuthorityCore({ clock, ledger });
  return { clock, ledger, core };
}

function prepareMessage(core, clock, {
  requestId = "request-1",
  taskId = "task-1",
  proposal = messageProposal(),
  observation = fixtureObservation(clock),
} = {}) {
  return core.prepare({ requestId, taskId, proposal, observation });
}

function approve(core, action) {
  const preview = core.render(action);
  return core.approve({ source: "trusted-user-input", previewId: preview.previewId, response: "approve" });
}

function makeCheck(id) {
  let count = 0;
  const check = {
    equal(actual, expected, message) {
      count += 1;
      assert.equal(actual, expected, message);
    },
    deepEqual(actual, expected, message) {
      count += 1;
      assert.deepEqual(actual, expected, message);
    },
    ok(value, message) {
      count += 1;
      assert.ok(value, message);
    },
    notEqual(actual, expected, message) {
      count += 1;
      assert.notEqual(actual, expected, message);
    },
    throwsCode(fn, code) {
      count += 1;
      assert.throws(fn, (error) => error instanceof ContractError && error.code === code, `expected ${code}`);
    },
    done() {
      results.set(id, count);
    },
  };
  return check;
}

function caseTest(definition, run) {
  const [id, title] = definition;
  test(`${id} ${title}`, { concurrency: false }, () => {
    const check = makeCheck(id);
    run(check);
    check.done();
  });
}

caseTest(definitions[0], (check) => {
  const { core, clock, ledger } = make();
  const action = prepareMessage(core, clock);
  const permit = approve(core, action);
  const operation = core.dispatch(action, permit);
  check.equal(operation.state, "Verified");
  check.equal(ledger.count(operation.operationId), 1);
  check.equal(core.tasks.get("task-1").state, "completed");
  check.equal(operation.verification.source, "test-owned-effect-ledger");
  check.notEqual(operation.verification.expectedValues, operation.verification.observedValues[0]);
  check.deepEqual(operation.verification.expectedValues, operation.verification.observedValues[0]);
});

caseTest(definitions[1], (check) => {
  const { core, clock, ledger } = make();
  const navigation = core.prepare({ requestId: "request-nav", taskId: "task-1", proposal: navigationProposal(), observation: fixtureObservation(clock) });
  const navOperation = core.dispatch(navigation, null);
  check.equal(navOperation.state, "Verified");
  check.equal(core.tasks.get("task-1").state, "planning");
  const message = prepareMessage(core, clock, { requestId: "request-message" });
  const messageOperation = core.dispatch(message, approve(core, message));
  check.equal(messageOperation.state, "Verified");
  check.equal(core.tasks.get("task-1").state, "completed");
  check.equal(ledger.effects.length, 2);
});

caseTest(definitions[2], (check) => {
  const { core, clock, ledger } = make();
  const original = prepareMessage(core, clock);
  const oldPermit = approve(core, original);
  const edited = prepareMessage(core, clock, {
    requestId: "request-2",
    proposal: messageProposal({ arguments: { body: "Meet at seven." } }),
  });
  check.throwsCode(() => core.reserve(edited, oldPermit), "permit_binding_mismatch");
  check.equal(ledger.effects.length, 0);
  check.notEqual(original.preparedDigest, edited.preparedDigest);
  const newPermit = approve(core, edited);
  check.equal(core.dispatch(edited, newPermit).state, "Verified");
  check.equal(ledger.effects[0].body, "Meet at seven.");
});

caseTest(definitions[3], (check) => {
  const { core, clock, ledger } = make();
  const action = prepareMessage(core, clock);
  const permit = approve(core, action);
  const first = core.dispatch(action, permit);
  const duplicateRequest = core.dispatch(action, permit);
  check.equal(first, duplicateRequest);
  check.equal(ledger.count(first.operationId), 1);
  check.equal(core.permits.get(permit.permitId).consumed, true);
  check.throwsCode(() => core.reserve(action, permit), "permit_replayed");
  const duplicateCallback = core.handleCallback({ operationId: first.operationId, generation: "boot-1", status: "accepted" });
  check.equal(duplicateCallback.accepted, false);
  check.equal(ledger.count(first.operationId), 1);
  check.throwsCode(() => approve(core, action), "operation_already_exists");
  const duplicateReceiptFixture = make();
  const duplicateReceiptAction = prepareMessage(duplicateReceiptFixture.core, duplicateReceiptFixture.clock);
  const duplicateReceiptOperation = duplicateReceiptFixture.core.dispatch(
    duplicateReceiptAction,
    approve(duplicateReceiptFixture.core, duplicateReceiptAction),
    "duplicate-receipt",
  );
  check.equal(duplicateReceiptOperation.receipts.length, 2);
  check.equal(duplicateReceiptOperation.state, "Verified");
  check.equal(duplicateReceiptFixture.ledger.count(duplicateReceiptOperation.operationId), 1);
});

caseTest(definitions[4], (check) => {
  const { core, clock, ledger } = make();
  check.throwsCode(() => prepareMessage(core, clock, { proposal: { ...messageProposal(), approval: true } }), "unknown_field");
  check.throwsCode(() => prepareMessage(core, clock, { proposal: { tool: "shell.exec", schemaVersion: 1, arguments: {} } }), "tool_unknown");
  check.throwsCode(() => prepareMessage(core, clock, { proposal: messageProposal({ arguments: { permit: "model-made" } }) }), "unknown_field");
  const action = prepareMessage(core, clock, { requestId: "request-valid" });
  const preview = core.render(action);
  check.throwsCode(() => core.approve({ source: "planner", previewId: preview.previewId, response: "approve" }), "approval_source_untrusted");
  check.equal(ledger.effects.length, 0);
});

caseTest(definitions[5], (check) => {
  for (const [field, value] of [["endpointId", "person-b"], ["accountId", "account-b"], ["windowId", "window-b"], ["channel", "other-chat"]]) {
    const { core, clock, ledger } = make();
    const observation = fixtureObservation(clock, { [field]: value });
    check.throwsCode(() => prepareMessage(core, clock, { observation }), field === "channel" ? "target_mismatch" : "target_mismatch");
    check.equal(ledger.effects.length, 0);
  }
});

caseTest(definitions[6], (check) => {
  for (const [age, allowed] of [[1_999, true], [2_000, true], [2_001, false]]) {
    const { core, clock } = make();
    const observation = fixtureObservation(clock, { capturedAtMs: clock.nowMs - age });
    if (allowed) check.ok(prepareMessage(core, clock, { requestId: `request-${age}`, observation }));
    else check.throwsCode(() => prepareMessage(core, clock, { observation }), "observation_stale");
  }
  {
    const { core, clock } = make();
    check.throwsCode(() => prepareMessage(core, clock, { observation: fixtureObservation(clock, { capturedAtMs: clock.nowMs + 1 }) }), "observation_future");
  }
  {
    const { core, clock } = make();
    check.throwsCode(() => prepareMessage(core, clock, { observation: fixtureObservation(clock, { generation: "boot-0" }) }), "observation_generation_invalid");
  }
  {
    const { core, clock } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    clock.advance(2_001);
    check.throwsCode(() => core.admit(operation, action, permit), "observation_stale");
  }
});

caseTest(definitions[7], (check) => {
  for (const [age, allowed] of [[59_999, true], [60_000, false], [60_001, false]]) {
    const { core, clock } = make();
    const action = prepareMessage(core, clock, { requestId: `request-${age}` });
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    clock.advance(age);
    const fresh = fixtureObservation(clock);
    if (allowed) check.equal(core.admit(operation, action, permit, fresh).state, "Dispatched");
    else check.throwsCode(() => core.admit(operation, action, permit, fresh), "permit_expired");
  }
  {
    const { core, clock } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    clock.restart("boot-2");
    check.throwsCode(() => core.reserve(action, permit), "action_generation_invalid");
  }
  {
    const { core, clock } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const restarted = core.restart("boot-2");
    check.throwsCode(() => restarted.reserve(action, permit), "prepared_unknown");
    check.equal(restarted.permits.size, 0);
  }
});

caseTest(definitions[8], (check) => {
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    core.stop("before-reserve");
    check.throwsCode(() => core.reserve(action, permit), "cancelled");
    check.equal(ledger.effects.length, 0);
  }
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    core.stop("after-journal-before-admission");
    check.equal(operation.state, "CancelledNoDispatch");
    check.throwsCode(() => core.admit(operation, action, permit, fixtureObservation(clock)), "cancelled");
    check.equal(ledger.effects.length, 0);
  }
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    core.admit(operation, action, permit, fixtureObservation(clock));
    core.stop("after-admission");
    core.execute(operation, action);
    const outcome = core.verify(operation, action);
    check.equal(outcome.operationState, "Verified");
    check.equal(outcome.taskState, "stopped-verified");
    check.equal(ledger.count(operation.operationId), 1);
  }
});

caseTest(definitions[9], (check) => {
  for (const [kind, code] of [["permission", "cancelled"], ["visibility", "cancelled"], ["authenticated", "cancelled"]]) {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    core.loseDependency(kind);
    check.throwsCode(() => core.admit(operation, action, permit, fixtureObservation(clock)), code);
    check.equal(ledger.effects.length, 0);
    check.equal(core.cancelled, true);
  }
});

caseTest(definitions[10], (check) => {
  {
    const { core, clock, ledger } = make();
    prepareMessage(core, clock);
    const restarted = core.restart("boot-2");
    check.equal(restarted.journal.rows.length, 0);
    check.equal(ledger.effects.length, 0);
  }
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const operation = core.reserve(action, approve(core, action));
    const restarted = core.restart("boot-2");
    check.equal(restarted.journal.rows[0].outcomeCategory, "ClosedUnknown");
    check.equal(restarted.journal.rows[0].verificationGrade, "restart-quarantine");
    check.equal(ledger.effects.length, 0);
    check.equal(restarted.operations.size, 0);
    check.equal(operation.state, "Reserved");
  }
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    core.admit(operation, action, permit, fixtureObservation(clock));
    core.execute(operation, action, "effect-without-receipt");
    const restarted = core.restart("boot-2");
    check.equal(restarted.journal.rows[0].outcomeCategory, "ClosedUnknown");
    check.equal(ledger.count(operation.operationId), 1);
    check.equal(restarted.operations.size, 0);
  }
});

caseTest(definitions[11], (check) => {
  const { core, clock, ledger } = make();
  const action = prepareMessage(core, clock);
  const permit = approve(core, action);
  const operation = core.dispatch(action, permit, "effect-without-receipt");
  check.equal(operation.state, "Verified");
  check.equal(operation.receipts.length, 0);
  check.equal(ledger.count(operation.operationId), 1);
  check.equal(core.dispatch(action, permit), operation);
  check.equal(ledger.count(operation.operationId), 1);
});

caseTest(definitions[12], (check) => {
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const operation = core.dispatch(action, approve(core, action), "receipt-before-effect");
    check.equal(operation.state, "Unknown");
    check.equal(core.tasks.get("task-1").state, "unknown");
    check.equal(ledger.count(operation.operationId), 0);
    ledger.flush(operation.operationId);
    check.equal(core.reconcile(operation, action).operationState, "Verified");
  }
  {
    const { core, clock } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    core.admit(operation, action, permit, fixtureObservation(clock));
    core.execute(operation, action, "effect-with-receipt");
    core.verifier.override(operation.operationId, { ...action.expectedEffect, endpointId: "person-b" });
    check.equal(core.verify(operation, action).operationState, "Unknown");
  }
  {
    const { core, clock } = make();
    const action = prepareMessage(core, clock);
    const operation = core.dispatch(action, approve(core, action), "no-effect");
    check.equal(operation.state, "NoEffect");
    check.equal(core.tasks.get("task-1").state, "noeffect");
  }
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const operation = core.dispatch(action, approve(core, action), "delayed-effect");
    check.equal(operation.state, "Unknown");
    ledger.flush(operation.operationId);
    check.equal(core.reconcile(operation, action).operationState, "Verified");
  }
  {
    const { core, clock } = make();
    const action = prepareMessage(core, clock);
    const permit = approve(core, action);
    const operation = core.reserve(action, permit);
    core.admit(operation, action, permit, fixtureObservation(clock));
    core.execute(operation, action, "effect-with-receipt");
    core.verifier.override(operation.operationId, {
      kind: "message", accountId: "account-a", windowId: "window-a", channel: "fixture-chat",
    });
    const partial = core.verify(operation, action);
    check.equal(partial.operationState, "Partial");
    check.equal(partial.taskState, "partial");
  }
});

caseTest(definitions[13], (check) => {
  const { core } = make();
  const proposal = messageProposal();
  const timeout = core.resolvePlanning(core.beginPlanning(new FakePlanner("timeout", proposal)));
  check.deepEqual(timeout, { kind: "failure", code: "provider_timeout" });
  const lateHandle = core.beginPlanning(new FakePlanner("stub", proposal));
  core.stop("provider-pending");
  check.deepEqual(core.resolvePlanning(lateHandle), { kind: "discarded", code: "late_planner_result" });
  const alternateCore = make().core;
  const alternate = alternateCore.resolvePlanning(alternateCore.beginPlanning(new FakePlanner("alternate", proposal)));
  check.equal(alternate.kind, "proposal");
  check.equal(alternate.provider, "alternate");
  const malformedCore = make().core;
  const malformed = malformedCore.resolvePlanning(malformedCore.beginPlanning(new FakePlanner("malformed")));
  check.equal(malformed.kind, "denied");
  check.equal(malformed.code, "proposal_schema_invalid");
});

caseTest(definitions[14], (check) => {
  {
    const { core } = make();
    for (let index = 1; index <= 12; index += 1) check.equal(core.debitInternal("task-budget", `internal-${index}`), index);
    check.throwsCode(() => core.debitInternal("task-budget", "internal-13"), "operation_budget_exhausted");
    check.equal(core.tasks.get("task-budget").operations, 12);
  }
  {
    const { core, clock } = make();
    core.debitInternal("task-deadline", "read");
    clock.advance(60_000);
    check.throwsCode(() => core.debitInternal("task-deadline", "poll"), "machine_deadline_exhausted");
    check.equal(core.tasks.get("task-deadline").operations, 1);
  }
});

caseTest(definitions[15], (check) => {
  {
    const { core } = make();
    check.equal(core.noProgress("task-loop", "same-state", "same-action").stopped, false);
    check.equal(core.noProgress("task-loop", "same-state", "same-action").stopped, true);
    check.throwsCode(() => core.debitInternal("task-loop", "route-downgrade"), "no_progress_circuit");
  }
  {
    const { core } = make();
    check.equal(core.noProgress("task-recovery", "state-a", "recover-a", { recovery: true }).stopped, false);
    check.equal(core.noProgress("task-recovery", "state-b", "recover-b", { recovery: true }).stopped, true);
    check.equal(core.tasks.get("task-recovery").state, "failed");
  }
});

caseTest(definitions[16], (check) => {
  const { core, clock } = make();
  const action = prepareMessage(core, clock, {
    proposal: messageProposal({ arguments: { body: PRIVATE_CANARY } }),
    observation: fixtureObservation(clock, { privateText: PRIVATE_CANARY }),
  });
  core.dispatch(action, approve(core, action), "effect-with-receipt");
  core.exportAudit();
  const snapshot = core.privacySnapshot();
  const serialized = JSON.stringify(snapshot);
  check.equal(serialized.includes(PRIVATE_CANARY), false);
  check.equal(serialized.includes(action.preparedDigest), false);
  check.equal(serialized.includes("permit-"), false);
  check.equal(serialized.includes("person-a"), false);
  check.equal(serialized.includes("body"), false);
  check.deepEqual(snapshot.journalFields, [
    "operationId", "taskId", "capabilityId", "adapterId", "adapterVersion", "policyVersion",
    "dispatchCategory", "outcomeCategory", "coarseTick", "generation", "verificationGrade",
  ]);
});

caseTest(definitions[17], (check) => {
  const { core, clock, ledger } = make();
  const action = prepareMessage(core, clock);
  const operation = core.dispatch(action, approve(core, action));
  check.equal(ledger.count(operation.operationId), 1);
  core.deleteHistory();
  check.equal(core.journal.rows.length, 0);
  const restarted = core.restart("boot-2");
  check.equal(restarted.journal.rows.length, 0);
  const callback = restarted.handleCallback({ operationId: operation.operationId, generation: "boot-1", status: "accepted" });
  check.equal(callback.accepted, false);
  check.equal(restarted.operations.size, 0);
  check.equal(ledger.count(operation.operationId), 1);
});

caseTest(definitions[18], (check) => {
  {
    const clock = new FakeClock({ nowMs: 10_000, generation: "boot-1" });
    const core = new AuthorityCore({ clock, buildMode: "candidate" });
    check.throwsCode(() => prepareMessage(core, clock), "build_mode_denied");
    check.throwsCode(() => prepareMessage(core, clock, { proposal: messageProposal({ tool: "message.send.lab" }) }), "build_mode_denied");
  }
  {
    const clock = new FakeClock({ nowMs: 10_000, generation: "boot-1" });
    const core = new AuthorityCore({ clock, registryVersion: "registry-v2" });
    check.throwsCode(() => prepareMessage(core, clock, { observation: fixtureObservation(clock, { registryVersion: "registry-v2" }) }), "registry_version_unknown");
  }
  {
    const { core, clock } = make();
    check.throwsCode(() => prepareMessage(core, clock, { observation: fixtureObservation(clock, { adapterVersion: "adapter-v2" }) }), "adapter_version_unknown");
  }
  {
    const clock = new FakeClock({ nowMs: 10_000, generation: "boot-1" });
    check.throwsCode(() => new AuthorityCore({ clock, policyVersion: "policy-v2" }), "policy_version_unknown");
  }
});

caseTest(definitions[19], (check) => {
  {
    const { core, clock, ledger } = make();
    const action = prepareMessage(core, clock);
    const operation = core.dispatch(action, approve(core, action), "conflicting-receipt");
    check.equal(operation.state, "Unknown");
    check.equal(ledger.count(operation.operationId), 1);
    check.equal(core.tasks.get("task-1").state, "unknown");
  }
  {
    const { core } = make();
    const corrupt = {
      operationId: "operation-corrupt", taskId: "task-corrupt", capabilityId: "CAP-09", adapterId: "fake-message",
      adapterVersion: "adapter-v1", policyVersion: "policy-v1", dispatchCategory: "admitted", outcomeCategory: "Dispatched",
      coarseTick: 1, generation: "boot-1", verificationGrade: "unverified", hiddenPayload: PRIVATE_CANARY,
    };
    const restarted = core.restart("boot-2", { journalRows: [corrupt] });
    check.equal(restarted.diagnostics[0].code, "journal_corrupt");
    check.equal(restarted.journal.rows[0].outcomeCategory, "ClosedUnknown");
    check.equal(restarted.operations.size, 0);
    check.equal(JSON.stringify(restarted.privacySnapshot()).includes(PRIVATE_CANARY), false);
  }
  {
    const { core, clock } = make();
    core.debitInternal("task-clock", "read");
    clock.regress(1);
    check.throwsCode(() => core.debitInternal("task-clock", "act"), "clock_regression");
  }
});

after(() => {
  const totalAssertions = [...results.values()].reduce((sum, count) => sum + count, 0);
  process.stdout.write(`\nT-103 ${FIXTURE_VERSION}: ${results.size}/20 cases, ${totalAssertions} explicit assertions\n`);
  for (const [id, title, evals] of definitions) {
    process.stdout.write(`${id} | ${evals} | ${results.get(id) ?? 0} assertions | ${title}\n`);
  }
});
