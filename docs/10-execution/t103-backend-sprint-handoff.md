---
title: "Handoff metaprompt — complete T-103 offline backend sprint"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, backend, handoff, prompt]
related:
  - task-packets.md
  - backlog.md
  - development-readiness.md
  - ../03-agent/execution-protocol.md
  - ../04-architecture/capability-admission.md
---

# Handoff metaprompt — complete T-103 offline backend sprint

## How to use this handoff

Start a fresh coding session in `/home/lgtw/Work/granny` and paste the prompt below. Simon requested this handoff on 2026-09-17 for implementation of **all of T-103**, units A–D and cases C01–C20. The pasted instruction is the new session's implementation request. This file does not authorize Android/device actions, live providers, PR creation or main integration by itself.

## Copy into the new session

> Use `$granny-session-lifecycle` and `$granny-task-slice` to implement the complete T-103 offline authority and outcome replay. Continue through units A, B, C and D and cover every required case C01–C20 before handing off. This is an explicit coding request for T-103 only.
>
> Start by reading `AGENTS.md`, `docs/README.md`, the current milestone, development readiness/Definition of Ready, `docs/10-execution/backlog.md#t-103`, `docs/10-execution/task-packets.md#t-103-packet`, tool contracts, execution protocol, device-control budgets, action policy, privacy policy, threat model, capability admission, EVAL-006/008/009/010 and the evidence protocol. Inspect `prototypes/conversation-runtime` and its T-117 evidence, but do not treat that specialized MCP draft demo as T-103 completion.
>
> Fetch the verified `Pueblo98/Granny` origin. Preserve all dirty and untracked work in the primary checkout. Create a new short-lived `feature/t103-offline-authority-core` branch and isolated worktree from current `origin/main`, then create one contemporaneous session record. Do not edit the primary checkout or another session's worktree.
>
> Verify Node and the existing runtime baseline first. In the isolated worktree run `npm ci --ignore-scripts --no-audit --no-fund` from `prototypes/conversation-runtime`; `node_modules` is intentionally ignored and must never be staged. Then run `node --test prototypes/conversation-runtime/*.test.mjs`. The MCP child-process tests may require execution outside a restricted sandbox; request the narrow tool approval when needed and do not weaken or skip them. Record Node/npm versions and exact results. Do not use a private env file or run live-provider commands.
>
> Implement a pure deterministic authority core with fake ports only. Choose the smallest reversible structure after inspection, prefer existing Node/test tooling and add no dependency unless current authority explicitly allows it. Keep the core separable from the T-117 MCP transport. No real sleep, wall-clock-dependent assertion, network, provider/model call, MCP child, Android API/service, filesystem chosen by model input, personal data, credentials, unrestricted shell, coordinates or production scaffold may enter T-103.
>
> **Unit A — types, fake clock, registry and strict validation:** implement closed typed states/events; controlled monotonic time and boot generations; finite capability/build-mode registry; local policy/admission; strict rejection of unknown fields, tools, versions, modes, trusted planner fields, future observations and invalid generations. Complete C05, C07, C08 and C19.
>
> **Unit B — preview, permit, ledger and independent verification:** implement immutable prepared actions; exact recipient/channel/body/account/window binding; user-provenance approval; one-use permit reservation/consumption; synthetic reversible navigation and one synthetic message effect; a test-owned effect ledger independent of adapter acknowledgements; registered postcondition verification. Complete C01–C04, C06 and C13.
>
> **Unit C — cancellation, restart, uncertainty and budgets:** implement cancellation latch and user epoch; deterministic Stop orderings before reserve, between journal/admission and after admission; minimal content-free operation journal; restart generation and unresolved-operation quarantine; no automatic resume or resend; same-session idempotency; permission/visibility/auth rechecks; shared operation/deadline budgets and no-progress circuit breaker; corrupted/conflicting evidence handling. Complete C09–C12, C15, C16 and C20.
>
> **Unit D — provider replacement, privacy projection and evidence:** use deterministic stub/late/malformed/alternate planner proposals without network; keep provider output unable to authorize; inspect durable journal, diagnostics and export sinks for the exact canary `SYNTHETIC-PRIVATE-DO-NOT-EXPORT`; delete history and prove old callbacks cannot resurrect action; generate a C01–C20 case-to-test evidence report. Complete C14, C17 and C18, then rerun the whole matrix.
>
> Use the packet's exact fixture: opaque endpoints `person-a` and `person-b`, channel `fixture-chat`, text `Meet at six.`, changed text `Meet at seven.`, independently selectable account/window/generation and the privacy canary. The ledger must support receipt-before-effect, effect-without-receipt, duplicate receipt, conflicting receipt, no effect and delayed effect. Expected values and observations must remain separate objects and sources.
>
> Enumerate the required race orderings deterministically. If adding seeded schedules, preserve the seed and minimal reproducer; generated sequences supplement the fixed C01–C20 cases. Enforce observation freshness at 1999/2000/2001 ms, permit boundaries at 59999/60000/60001 ms, future timestamps, clock regression and old boot generations exactly as the canonical protocol specifies.
>
> Write or expose one rerunnable command for the complete T-103 suite. A pass requires all C01–C20 assertions, no canary in forbidden sinks, no hidden payload/digest/permit in the durable journal, and honest partial/unknown states. Do not loosen postconditions, reinterpret unknown as failure/no-effect, or count adapter success as independent verification.
>
> Update only canonical consumers affected by actual implementation discoveries: backlog T-103 status, traceability code/test links, T-103 packet/eval references if needed, current milestone and the session record. Keep T-103 at `review` when implemented and self-validated unless Simon separately accepts completion. Do not start T-101, T-104–T-107, Android integration, live-model work, memory expansion, context-panel backend work or a T-117 refactor as part of this session.
>
> Run the complete new T-103 suite, existing conversation-runtime tests, documentation validation, cockpit write/check, documentation-tool tests, handoff coverage and `git diff --check`. Review staged files and secrets explicitly. Commit scoped work, push the task branch under standing authority and verify the remote SHA. Hand off the worktree, branch, commits, exact case/test count and mapping, race order/seed coverage, fixture version, environment, failed or unrun checks, unsupported behavior and next bounded task. Do not create or merge a PR unless the current session has separate authority.

## Required completion evidence

The new session must return all of the following:

| Evidence | Required content |
|---|---|
| Scope | T-103 only; units A–D and C01–C20 |
| Implementation | Pure core and named fake ports; no Android/network/provider/MCP execution path |
| Oracle | Independent test-owned ledger and observation source, separate from expected plan/adapter response |
| Determinism | Controlled clock/generation and enumerated race orderings; seeds recorded if used |
| Privacy | Exact canary absent from journal, diagnostics and export; stored field inventory shown |
| Tests | Exact commands, exit codes, total assertions/tests and C01–C20 mapping |
| Regression | Existing conversation-runtime suite result; sandbox-only stdio limitation distinguished from code failure |
| Git | Worktree, branch, commit, matching remote SHA and unmerged/integration state |
| Limits | No Android, external app, real message, live model, personal data or gate-promotion claim |

## Environment clarification verified for this handoff

`node_modules` is deliberately excluded by `prototypes/conversation-runtime/.gitignore`, so a newly created worktree does not contain installed packages. That is expected per-worktree setup, not missing repository source. On 2026-09-17, the exact lockfile installation succeeded in an isolated worktree with Node 26.8.1 and npm 11.19.0:

```text
npm ci --ignore-scripts --no-audit --no-fund
added 14 packages
```

The 25 existing backend/provider/HTTP tests passed when run outside the restricted sandbox. Inside the sandbox, provider tests passed while the two suites that spawn an MCP stdio child failed at the file level, matching the recorded host restriction. The correct response is a narrow outside-sandbox test run, not changing application code or committing `node_modules`.
