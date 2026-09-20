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
artifact_commit: 75490c56b3188a2d3158a73d916af8ba16408d74
next_action: Simon reloads the loopback UI and submits one recipe question directly from the composer, then accepts the live-provider disclosure
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
  - prototypes/stage-1/browser-check.mjs
  - prototypes/stage-1/cloud.js
  - prototypes/stage-1/cloud.test.mjs
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/room-ui.js
  - prototypes/stage-1/runtime-browser-check.mjs
  - prototypes/stage-1/runtime-integration-check.mjs
  - prototypes/stage-1/support-ui.js
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

Simon then reported that ordinary questions still produced the stub's exact
fixed fallback. The runtime was live-capable, but the connection screen made
**Connect to local demo** the primary action and hid OpenRouter behind a manual
availability check. The corrected screen checks the same-origin runtime
configuration automatically, makes **Use live AI chat** the primary action
when available, and labels **Use offline test replies** as fixed responses that
are not AI. The provider disclosure and explicit consent still occur before a
live session, and the availability request itself creates no session or paid
model call.

Simon's next live transcript confirmed the provider answer but exposed a
second presentation defect: the chat card rendered its generic idle helper
above the actual model text. The card now renders model text as its single
answer paragraph and retains the non-action disclosure separately. A frontend
entry audit also confirmed Home, all six Rooms, item-level **Ask Granny**, Help
and Search share the connected composer. **Start a new conversation** now
creates a fresh session in the already selected live or offline mode instead
of silently returning to scripted behavior. Full reset and the explicit leave
control still disconnect.

Simon then supplied a Room transcript showing that the bottom composer still
used `Granny · scripted fictional response` unless the hidden connection flow
had already been completed. This invalidated the claim that all chat entries
were integrated by default. The first Home, Room or item-level composer
submission now checks only the same-origin runtime configuration. When live AI
is available it preserves the exact question, opens the provider disclosure,
and, only after consent, creates a live session and sends that question with
its bounded Home/Room context. Cancel preserves the question and creates no
session/model turn. The live path cannot fall through to the scripted Room
responder; the scripted prototype remains the fallback when live availability
is absent.

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
| `runtime-browser-check.mjs` | 70 checks passed, 0 browser errors | First recipe submit offers consent, creates no session/turn before approval, preserves the question/source after approval and never creates a scripted Room reply; connected-entry and duplicate-output coverage remains |
| Stage-1 `browser-check.mjs` | 137 checks passed, 0 browser errors | Existing conversation-first interaction regression |
| Conversation-runtime `browser-check.mjs` | 19 checks passed | Actual browser → HTTP → runtime → MCP/store path, including current-Room context |
| `live-consent-check.mjs` | 10 checks passed, one stub-provider call | Explicit live mode/consent and unchanged verified draft path; no paid request |
| One explicit `live-smoke.mjs --live` using the existing private env | `idle` / `chat`, source bound, grounded answer, 3,121 ms, one provider call, zero draft writes | Single synthetic Kitchen question only; no retry and no transcript/key output |
| Restarted `127.0.0.1:4173` browser smoke through **Use live AI chat** | Corrected harness observed a 913-character cookie-recipe answer, no fixed-stub fallback and no browser errors | Two synthetic provider turns were incurred: the first completed but the harness selected helper copy; one corrected rerun verified the generated answer. No action or draft request was made |
| Post-unification live browser turn against restarted `127.0.0.1:4173` | One 805-character cookie-recipe answer paragraph, no generic helper line, no fixed stub and no browser errors | One additional synthetic provider turn; presentation/path evidence only, with no action or draft request |
| Fresh-page recipe composer → consent → live turn against restarted `127.0.0.1:4173` | Original tomato-substitution question remained visible, live answer returned with Vegetable Soup provenance, zero `.room-reply` scripted responses and no browser errors | Two synthetic provider turns: the first completed but the harness assumed singular provenance wording; the corrected rerun verified 493 answer characters. No action or draft request |
| Documentation/cockpit/handoff checks | documentation PASS; 283 Markdown files; cockpit 104 records; handoff PASS at final commit | Structural repository evidence only |

The final connected-Room screenshot was visually inspected at 840×1000. It
keeps the selected Room composition and shared composer, shows ordinary model
text as unverified, and names `Vegetable soup · Kitchen · Recipes` as the
fictional source. Temporary screenshots remain under `/tmp` and are not
committed.

## Handoff and limits

Latest implementation checkpoint is
`75490c56b3188a2d3158a73d916af8ba16408d74` on
`feature/room-chat-openrouter` in
`/home/lgtw/Work/granny-worktrees/room-chat-openrouter`. The final handoff
commit and verified remote SHA are recorded in Git rather than recursively in
this file. Start the review branch with the existing key without printing it:

```bash
node --env-file=/home/lgtw/Work/granny/.env prototypes/conversation-runtime/server.mjs --live
```

Then open the printed loopback URL and use **Menu → Settings → About Granny →
AI connection → Use live AI chat**, review the disclosure and continue. The
screen checks availability automatically; no model call occurs until text is
submitted. **Use offline test replies** intentionally selects the fixed stub
and is not an AI conversation.

One successful paid synthetic answer is not general reliability evidence.
Real personal/health/account data, cross-room retrieval, provider retention
assurance, persistent Room storage, Android integration, participant evidence
and production gates remain unrun or excluded. Unrelated untracked files in
the primary checkout were not read, staged or changed.
