---
title: "T-103 offline authority core"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [prototype, agent, safety, tests]
related:
  - ../../docs/10-execution/backlog.md
  - ../../docs/10-execution/task-packets.md
  - ../../docs/03-agent/execution-protocol.md
  - EVIDENCE.md
---

# T-103 offline authority core

This dependency-free Node module implements the deterministic fake-only slice defined by T-103. It is separate from `prototypes/conversation-runtime`: there is no MCP transport, provider request, HTTP server, Android API, filesystem path, real account or real message route.

Run the complete suite from the repository root:

```bash
node prototypes/t103-authority-core/authority.test.mjs
```

The command runs 20 top-level `node:test` cases, prints the C01-C20/EVAL mapping and reports the explicit assertion count. No install is needed for this directory. [The evidence report](EVIDENCE.md) records the current result and exact limitations.

## Structure

- `core.mjs` owns closed operation/event values, strict schemas, immutable prepared actions, SHA-256 preview binding, transient one-use permits, controlled monotonic time and generations, local registry/policy admission, budgets, cancellation, restart quarantine and privacy projections.
- Named fake ports are `FakeClock`, `FakePlanner`, `FakeAdapter`, `FakeEffectLedger`, `FakeVerifier` and `FakeJournal`. `AuthorityCore` composes them without coupling them to a transport.
- `authority.test.mjs` owns the synthetic fixture, independent expected/observed values and fixed C01-C20 schedules. The ledger is the test-owned effect oracle; adapter receipts cannot produce a verified result by themselves.

## Fixture and boundaries

Fixture version `t103-fixture-v1` uses endpoints `person-a` and `person-b`, channel `fixture-chat`, bodies `Meet at six.` and `Meet at seven.`, selectable account/window/generation values, and `SYNTHETIC-PRIVATE-DO-NOT-EXPORT` for privacy assertions. Fake ledger behavior includes receipt-before-effect, effect-without-receipt, duplicate receipt, conflicting receipt, no effect and delayed effect.

This artifact proves deterministic contract behavior only. It does not measure Stop latency, operate Android, validate a distribution route, contact a provider, use personal data, or pass GATE-03, GATE-04, GATE-06 or GATE-07.

Simon accepted the five bounded T-103 review points on 2026-09-19. That acceptance completes this offline module only; the limits above remain unchanged.
