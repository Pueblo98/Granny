---
title: "Room-aware OpenRouter chat prototype"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, prototype, agent, rooms]
related:
  - ../backlog.md
  - ../../02-design/context-rooms.md
  - ../../04-architecture/conversation-runtime-contract.md
  - ../../../prototypes/conversation-runtime/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/room-chat-openrouter
artifact_commit: ec61011c79786bd454b4ea1297bec15bc482600b
next_action: Simon reviews the published Home-and-Rooms live-chat branch before any integration
changed_paths:
  - docs/01-product/traceability.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/context-rooms.md
  - docs/04-architecture/conversation-runtime-contract.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/sessions/2026-09-20-room-chat-openrouter.md
  - docs/10-execution/task-packets.md
  - docs/Cockpit.md
  - docs/README.md
  - prototypes/conversation-runtime/README.md
  - prototypes/conversation-runtime/browser-check.mjs
  - prototypes/conversation-runtime/live-consent-check.mjs
  - prototypes/conversation-runtime/live-smoke.mjs
  - prototypes/conversation-runtime/provider.mjs
  - prototypes/conversation-runtime/provider.test.mjs
  - prototypes/conversation-runtime/runtime.mjs
  - prototypes/conversation-runtime/runtime.test.mjs
  - prototypes/conversation-runtime/schema.mjs
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/cloud.js
  - prototypes/stage-1/cloud.test.mjs
  - prototypes/stage-1/room-ui.js
  - prototypes/stage-1/runtime-browser-check.mjs
---

# Room-aware OpenRouter chat prototype

## Scope and authority

Simon explicitly requested implementation on 2026-09-20: connect the existing
private `.env` OpenRouter key to the new browser frontend, add the chat backend,
and make the assistant usable from Home and every Context Room. This is a
bounded extension of the fictional browser prototype and local conversation
runtime. It does not select a production Android architecture, admit real
personal data, accept a product gate or enable an autonomous action.

The implementation keeps the key in the loopback backend, retains explicit
live-mode consent and the existing draft preview/confirmation boundary, and
uses one assistant session across Home and Rooms. A Room turn may include at
most three deterministic, non-private references from the currently open
fictional Room. Room content is untrusted reference data, not instructions.
Home sends no Room references. No cross-room retrieval is introduced by this
slice.

## Readiness and rollback

The existing T-117 runtime supplies the replaceable provider adapter, strict
wire schema, Stop/cancellation behavior, resource caps and fictional draft MCP.
T-119 supplies six synthetic Room packs, direct Room routes and explicit
private/exclusion metadata. The current user direction overrides T-119's prior
prototype-only no-provider boundary only for this synthetic browser slice.

Oracles cover strict context validation, provider message construction without
credential leakage, current-Room source selection, Home/Room navigation and
conversation continuity. Adverse cases cover private/excluded references,
oversized or malformed context, provider failure and Stop. Rollback is a
reviewed revert of this task branch; the implementation creates no production
or persistent user data.

## Implemented result

The `granny.conversation.v1` turn payload now accepts an optional strict place
and source envelope. Home sends an empty source list. The Room UI selects at
most three query-relevant current-Room fixtures, prefers the item explicitly
chosen with **Ask Granny about this**, and omits private or excluded items.
Aggregate source text is bounded before the backend validates it.

The provider has a version-controlled system prompt for one respectful adult
assistant across Home and Rooms. It forbids action claims and treating Room
references as instructions. References are serialized in a separate
user-role message before the exact newest user request; history is trimmed to
the existing character budget. OpenRouter credentials remain only in the
server process. Chat events return a minimal place/source receipt, which the
browser validates and displays without making it an action result.

Connected mode no longer disables Rooms or returns every submitted request to
Home. The same session and backend history follow navigation through all six
Rooms. Existing live consent now names bounded Room-reference egress; draft
preview, exact confirmation, MCP readback, Stop, uncertainty quarantine and
resource limits are unchanged.

## Actual validation

Node 26.8.1 and Chromium 151.0.7922.173 were used. Dependencies were installed
from the existing lockfile with scripts/audit/funding disabled. No dependency
or lockfile changed.

| Check | Observed result | Boundary |
|---|---|---|
| Provider, runtime and HTTP tests run as three isolated Node test files | 6 + 18 + 4 = 28 passed | Strict context, prompt ordering, secret omission, caps, MCP action invariants and loopback API |
| Stage-1 model/scheduler/cloud/rooms-store/outcomes/serve checks | 67 + 7 + 28 + 58 + 11 + 1 passed | Scripted regressions, frontend receipt validation, Room state and static allowlist |
| `rooms-browser-check.mjs` | 350 checks passed | Existing six-Room fictional fixture and adverse UI states |
| `home-browser-check.mjs` | 158 checks passed, 0 browser errors | Selected Home and navigation regressions |
| `runtime-browser-check.mjs` | 58 checks passed, 0 browser errors | Home sends no Room sources; every Room sends its own bounded place; private source absent; Room answer/source receipt rendered |
| Stage-1 `browser-check.mjs` | 137 checks passed, 0 browser errors | Existing conversation-first interaction regression |
| Conversation-runtime `browser-check.mjs` | 19 checks passed | Actual browser → HTTP → runtime → MCP/store path, including current-Room context |
| `live-consent-check.mjs` | 10 checks passed, one stub-provider call | Explicit live mode/consent and unchanged verified draft path; no paid request |
| One explicit `live-smoke.mjs --live` using the existing private env | `idle` / `chat`, source bound, grounded answer, 3,121 ms, one provider call, zero draft writes | Single synthetic Kitchen question only; no retry and no transcript/key output |
| Documentation/cockpit/handoff checks | documentation PASS; 283 Markdown files; cockpit 104 records; handoff PASS at final commit | Structural repository evidence only |

The final connected-Room screenshot was visually inspected at 840×1000. It
keeps the selected Room composition and shared composer, shows ordinary model
text as unverified, and names `Vegetable soup · Kitchen · Recipes` as the
fictional source. Temporary screenshots remain under `/tmp` and are not
committed.

## Handoff and limits

Implementation checkpoint is
`ec61011c79786bd454b4ea1297bec15bc482600b` on
`feature/room-chat-openrouter` in
`/home/lgtw/Work/granny-worktrees/room-chat-openrouter`. The final handoff
commit and verified remote SHA are recorded in Git rather than recursively in
this file. Start the review branch with the existing key without printing it:

```bash
node --env-file=/home/lgtw/Work/granny/.env prototypes/conversation-runtime/server.mjs --live
```

Then open the printed loopback URL and use **Menu → Settings → About Granny →
Demo connection → Check live model availability → Review live conversation
consent**. No model call occurs until text is submitted.

One successful paid synthetic answer is not general reliability evidence.
Real personal/health/account data, cross-room retrieval, provider retention
assurance, persistent Room storage, Android integration, participant evidence
and production gates remain unrun or excluded. Unrelated untracked files in
the primary checkout were not read, staged or changed.
