---
title: "T-103 offline authority core implementation"
status: review
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, agent, safety]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../03-agent/execution-protocol.md
  - ../../06-evals/canonical-tasks.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex T-103 implementation session
branch: feature/t103-offline-authority-core
artifact_commit: 466d13c89347e007a1de63768f96315f0e02ec64
next_action: Simon reviews the bounded T-103 evidence and decides whether to accept the task; synchronize the primary vault after its concurrent design edits are safely committed.
changed_paths:
  - docs/01-product/traceability.md
  - docs/06-evals/canonical-tasks.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/task-packets.md
  - prototypes/t103-authority-core/EVIDENCE.md
  - prototypes/t103-authority-core/README.md
  - prototypes/t103-authority-core/authority.test.mjs
  - prototypes/t103-authority-core/core.mjs
---

# T-103 offline authority core handoff

## Scope and authority

Simon explicitly requested implementation of all of [T-103](../backlog.md#t-103), units A-D and deterministic cases C01-C20 on 2026-09-17. Work is limited to the pure offline authority/outcome replay core, fake ports, its tests, evidence, and canonical implementation links. Android/device actions, real accounts or messages, network/provider calls, MCP execution, production scaffolding, PR creation and main integration are excluded.

The task started from fetched `origin/main` at `ed439325845f6e7e0c0b41e0508c36eb5859b103` in `/tmp/granny-t103-offline-authority-core`. The primary checkout's unrelated modified and untracked design work was inspected and left untouched.

## What changed

[The standalone implementation](../../../prototypes/t103-authority-core/README.md) composes `AuthorityCore` with named `FakeClock`, `FakePlanner`, `FakeAdapter`, `FakeEffectLedger`, `FakeVerifier` and `FakeJournal` ports. It uses strict closed runtime schemas, immutable SHA-256-bound prepared actions, transient locally issued permits, a finite registry/build-mode/policy intersection, controlled monotonic ticks and boot generations. It is dependency-free and separate from the T-117 MCP transport.

Units A-D and all C01-C20 cases are implemented. The fake adapter supports one navigation effect and one exact message effect across receipt-before-effect, effect-without-receipt, duplicate receipt, conflicting receipt, no-effect and delayed-effect schedules. The verifier reads a test-owned ledger into a separate observation object; adapter acknowledgement never proves completion. Stop ordering, dependency rechecks, restart quarantine, same-session idempotency, shared budgets, no-progress circuits, provider replacement, history deletion and corrupted evidence fail closed.

[The evidence report](../../../prototypes/t103-authority-core/EVIDENCE.md) maps every case and EVAL owner. The exact private canary is absent from serialized journal, diagnostic and export projections. Durable fields are limited to opaque operation/task IDs, capability/adapter/policy versions, dispatch/outcome categories, coarse tick, generation and verification grade; no body, recipient, digest or permit is stored there.

## Evidence

Environment: Linux host; Node 26.8.1; npm 11.19.0; fixture `t103-fixture-v1`; synthetic data only.

| Exact command | Result | Evidence limit |
|---|---|---|
| `npm ci --ignore-scripts --no-audit --no-fund` from `prototypes/conversation-runtime` | Exit 0; 14 lockfile packages installed in ignored `node_modules` | Existing T-117 setup only; no dependency added to T-103 |
| `node --check prototypes/t103-authority-core/core.mjs` and test file | Exit 0 | JavaScript syntax only |
| `node prototypes/t103-authority-core/authority.test.mjs` | Exit 0; **20/20 tests, 147 explicit assertions**, C01-C20 all mapped | Deterministic fake-only contract evidence |
| `node --test prototypes/conversation-runtime/*.test.mjs` | Exit 0; **25/25 tests** including actual local MCP stdio child cases | Fictional T-117 regression; not part of the T-103 execution path |
| `python3 scripts/validate-docs.py` | Exit 0; 139 Markdown documents, 2,023 local links, 0 errors | Structural documentation evidence only |
| `python3 scripts/cockpit.py --write`; `python3 scripts/cockpit.py --check` | Exit 0; fresh snapshot, 36 records, 12 Canvas nodes/3 edges, 3 Base views and embeds | Generated/structural cockpit evidence only |
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | Exit 0; 47 tests passed; expected negative Git fixture printed `fatal: Needed a single revision` | Repository documentation tooling only |
| `python3 scripts/check_handoff.py --base origin/main` | Exit 0; handoff coverage passed | Scoped path coverage, not implementation quality |
| GitHub PR #20 required checks after merging current main into the task branch | Runtime, Repository maintenance and GitGuardian all passed | Hosted repository checks; no Android/device/provider evidence |
| Targeted source scan for filesystem/child/HTTP/network/timer APIs | Exit 0; only the deliberate `shell.exec` rejection fixture matched | Heuristic; complemented by source/diff review |
| `git diff --check` | Exit 0 | Whitespace only |

Fixed ordering coverage: Stop before reserve, after journal/before admission and after admission; restart before journal, after journal and after effect/before receipt; time advanced across observation, permit and shared-deadline rechecks. No randomized schedules were needed or run, so there is no seed. Assertions cover 1999/2000/2001 ms observation ages, 59999/60000/60001 ms permit ages, future timestamps, clock regression and old generations.

No live-provider command, private environment file, Android/device action, real app/account/message, personal data, HTTP/network route or MCP child exists in T-103. Canonical EVAL-006/008/009/010 and GATE-03/04/06/07 remain unpassed as complete evals/gates.

## Handoff

Worktree: `/tmp/granny-t103-offline-authority-core`; branch: `feature/t103-offline-authority-core`; original base: `origin/main` at `ed439325845f6e7e0c0b41e0508c36eb5859b103`. Implementation commit `466d13c89347e007a1de63768f96315f0e02ec64` was pushed and independently matched its remote branch. The branch then merged current main, reran all required checks, and [PR #20](https://github.com/Pueblo98/Granny/pull/20) merged normally on 2026-09-19 as `4778c0f04fa83e9c785bac7146002021d13c8877` after all required checks passed.

The required post-merge vault check reported **NEEDS REVIEW**: the primary checkout remained at `d9a4b1a81aee31ddd8863194d4a279e73b8a243c` with concurrent modified canonical files and untracked design artifacts, including overlap in the milestone and generated cockpit snapshot. Those changes were preserved; no copy, stash, reset, forced checkout or automatic merge was used. The T-103 handoff is present on remote `main` but will appear in the primary Obsidian vault only after that checkout can safely fast-forward to the merge commit or later.
