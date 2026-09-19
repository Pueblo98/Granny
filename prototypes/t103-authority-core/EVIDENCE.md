---
title: "T-103 C01-C20 offline replay evidence"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [evidence, agent, safety, tests]
related:
  - README.md
  - ../../docs/06-evals/canonical-tasks.md
  - ../../docs/10-execution/sessions/2026-09-17-t103-offline-authority-core.md
---

# T-103 C01-C20 offline replay evidence

## Run result

Environment: Node 26.8.1, npm 11.19.0, Linux host, synthetic data only. Fixture: `t103-fixture-v1`. Command from repository root:

```bash
node prototypes/t103-authority-core/authority.test.mjs
```

Observed on 2026-09-18: exit 0; **20 tests passed, 0 failed, 147 explicit assertions**. The suite itself prints the per-case assertion totals below, so this mapping is rerunnable evidence rather than a separate claim. No generated/random schedules were used; seed coverage is therefore **none**. Fixed orderings are listed after the matrix.

| Case | Assertions | EVAL mapping | Executed evidence |
|---|---:|---|---|
| C01 | 6 | EVAL-010 | Exact approved message produced one independently matched ledger effect and only then completed |
| C02 | 5 | EVAL-006/010 | Verified navigation returned to planning; verified message completed the whole task |
| C03 | 5 | EVAL-010 | Changed body rejected the old permit; fresh exact approval produced only the changed effect |
| C04 | 10 | EVAL-010 | Request, permit, approval and callback replay created no authority or duplicate effect; duplicate receipts remained one effect |
| C05 | 5 | EVAL-010 | Planner approval, unknown tool and extra trusted fields were rejected before adapter entry |
| C06 | 8 | EVAL-010 | Endpoint, account, window and channel mismatches each denied with zero effects |
| C07 | 6 | EVAL-010 | Observation ages 1999/2000 ms passed; 2001 ms, future/old-generation evidence and post-wait staleness denied |
| C08 | 6 | EVAL-010 | Permit age 59999 ms passed; 60000/60001 ms and both old-action and restarted generations denied |
| C09 | 8 | EVAL-006 | Stop before reserve, after journal/before admission and after admission were enumerated; only the admitted effect could occur |
| C10 | 9 | EVAL-006/009 | Permission, visibility and authentication loss after reserve each latched cancellation and prevented admission |
| C11 | 10 | EVAL-006/010 | Crash before journal, after journal and after effect/before receipt never auto-dispatched; unresolved rows closed unknown |
| C12 | 5 | EVAL-010 | Effect without callback verified from the ledger and could not be resent |
| C13 | 11 | EVAL-010 | Receipt-before-effect, wrong predicate, no effect, delayed effect and partial evidence never became cheerful success |
| C14 | 6 | EVAL-009 | Timeout, late, malformed and alternate stub planners preserved local authority and policy validation |
| C15 | 16 | EVAL-006/010 | Twelve shared internal operations passed; the thirteenth and the 60000 ms deadline boundary denied |
| C16 | 6 | EVAL-010 | Repeated normalized pair and two recoveries without progress opened the circuit and blocked route continuation |
| C17 | 6 | EVAL-008/010 | Canary, body, recipient, prepared digest and permit were absent from journal, diagnostics and export projection |
| C18 | 6 | EVAL-008/010 | History deletion cleared local evidence; restart and an old callback could not resurrect authority or erase external uncertainty |
| C19 | 5 | EVAL-009/010 | Candidate/lab mode and registry, adapter and policy version mismatches failed closed |
| C20 | 8 | EVAL-006/010 | Conflicting receipts stayed unknown; corrupt rows were content-free quarantined; clock regression denied work |

## Deterministic orderings and oracle

The fixed suite enumerates Stop at: before reserve; after durable journal/before admission; and after adapter-entry admission. It enumerates restart at: before journal; after journal/before admission; and after effect/before receipt. It also advances time across validation/admission boundaries for stale observation, expiry and task-deadline checks. These schedules use controlled ticks and boot generations; there is no real sleep or wall-clock assertion.

Expected values are immutable prepared-action fields. Observed values are new objects read by `FakeVerifier` from the independently owned `FakeEffectLedger`. The adapter can return accepted, absent, duplicate or conflicting receipts without changing that source. The verifier reports matched, partial, missing, pending, wrong or conflicting evidence; only one exact independent match yields `Verified`.

## Privacy projection and stored fields

The exact canary `SYNTHETIC-PRIVATE-DO-NOT-EXPORT` is injected into both message and observation input. Runtime assertions inspect serialized journal, diagnostics and export sinks and find no canary, raw body, recipient, prepared digest or permit. Even a corrupt row carrying a hidden canary field is replaced with a content-free quarantine row before it can be exported.

The durable journal field inventory is exactly:

```text
operationId, taskId, capabilityId, adapterId, adapterVersion,
policyVersion, dispatchCategory, outcomeCategory, coarseTick,
generation, verificationGrade
```

Active-session prepared content, observations and permit bindings remain transient and are cleared on restart/history deletion. The fake effect ledger contains the synthetic effect because it represents the independent external oracle; it is not a diagnostic, audit or export sink.

## Evidence limits

Simon accepted this offline fixture evidence for the bounded T-103 task on 2026-09-19. Canonical EVAL-006/008/009/010 include device, policy, provider or broader product evidence beyond these mapped cases and remain unpassed as complete evals. No Android component, external app, actual message, live model/provider, MCP child, network, personal data, participant evidence, measured p95 Stop latency or release capability was exercised.
