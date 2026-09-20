---
title: "ADR-0017 — Local synthetic conversation evidence store"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [adr, architecture, prototype, sqlite, evidence]
related:
  - README.md
  - ../04-architecture/conversation-evidence-store.md
  - ../04-architecture/conversation-runtime-contract.md
  - ../05-safety-privacy/safety-and-privacy.md
  - ../10-execution/backlog.md
---

# ADR-0017 — Local synthetic conversation evidence store

## Context

The connected Room prototype held conversations in browser/runtime memory and rendered the mutable set of candidate sources as if every source had supported an answer. That could misstate provenance. Simon authorized a bounded local synthetic implementation in which conversations and message-specific evidence survive browser/backend restart, without admitting production personal data.

The existing deployment boundary is a same-origin Node loopback backend on Node 26. A future stock-Android app would plausibly use Room/SQLite, but that production selection is not made here.

## Options

| Option | Benefit | Cost / risk |
|---|---|---|
| Backend SQLite through built-in `node:sqlite` | One authority with transactions, constraints and migrations; no dependency; close conceptual Android mapping | Local temporary file needs explicit lifecycle and is not a production security design |
| Browser IndexedDB | Browser-native persistence | Splits ownership from runtime/provider state and has weaker Android mapping |
| JSON files | Simple inspection | Requires custom transactions, locking, migrations and relationships |
| Process/tab memory | No new persistence code | Restart loss and mutable-global citation bug remain |

## Proposed decision

Use backend SQLite for the authorized synthetic prototype. Store normalized conversations, messages, immutable source revisions, retrieval decisions, provider runs, future source preferences, message-evidence links and minimal action history. Fetch citations only by exact assistant message ID. Keep the database path fixed by the server and expose narrow methods rather than SQL.

The implementation may proceed under the explicit task authority while this ADR remains proposed. Acceptance would confirm the prototype architecture only. A production Android store, retention/encryption/backup policy and migration guarantee require later decisions and evidence.

## Consequences and reversibility

No dependency is added. Missing schema is created and seeded; newer schema fails closed. Fixed fictional samples remain labelled and separate. Existing memory-only chats are not imported. The store is bounded and removable as described in the architecture contract, and the task branch can be reverted without changing accepted product scope.

Local tests must prove conversation isolation, message-ID citation lookup, immutable revision receipts, future-only exclusion, replay idempotency, stale-response fencing, restart behavior and database failure. Browser checks must prove Today opens exact IDs and rendered citations follow persisted message evidence. These are local synthetic results, not Android, human or production-privacy evidence.

## Authority

**Proposed for Simon's review on 2026-09-20.** The implementation request authorizes this bounded experiment but does not by itself accept a production database or data policy.
