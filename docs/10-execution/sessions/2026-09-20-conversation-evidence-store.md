---
title: "Conversation evidence store implementation"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, prototype, architecture, conversations, evidence]
related:
  - ../backlog.md
  - ../../04-architecture/conversation-evidence-store.md
  - ../../04-architecture/conversation-runtime-contract.md
  - ../../02-design/context-rooms.md
  - ../../05-safety-privacy/safety-and-privacy.md
  - ../../09-decisions/ADR-0017-local-conversation-evidence-store.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/conversation-evidence-store
artifact_commit: fb3a7c89a0ee792080746dde29167bb9d3da0fea
next_action: review the message-owned citation and Today flows at the loopback UI, then decide whether to accept ADR-0017 for this prototype boundary
changed_paths:
  - .github/workflows/conversation-runtime.yml
  - ARCHITECTURE.md
  - docs/01-product/traceability.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/context-rooms.md
  - docs/04-architecture/conversation-evidence-store.md
  - docs/04-architecture/conversation-runtime-contract.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/06-evals/canonical-tasks.md
  - docs/06-evals/eval-strategy.md
  - docs/09-decisions/ADR-0017-local-conversation-evidence-store.md
  - docs/09-decisions/README.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/sessions/2026-09-20-conversation-evidence-store.md
  - docs/10-execution/task-packets.md
  - docs/README.md
  - prototypes/conversation-runtime/README.md
  - prototypes/conversation-runtime/browser-check.mjs
  - prototypes/conversation-runtime/conversation-browser-check.mjs
  - prototypes/conversation-runtime/conversation-store.mjs
  - prototypes/conversation-runtime/conversation-store.test.mjs
  - prototypes/conversation-runtime/migrations/001-conversation-evidence.sql
  - prototypes/conversation-runtime/provider.mjs
  - prototypes/conversation-runtime/provider.test.mjs
  - prototypes/conversation-runtime/runtime.mjs
  - prototypes/conversation-runtime/runtime.test.mjs
  - prototypes/conversation-runtime/schema.mjs
  - prototypes/conversation-runtime/server.mjs
  - prototypes/conversation-runtime/server.test.mjs
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/cloud.js
  - prototypes/stage-1/conversation-data.js
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/index.html
  - prototypes/stage-1/outcomes-browser-check.mjs
  - prototypes/stage-1/room-ui.js
  - prototypes/stage-1/runtime-browser-check.mjs
  - prototypes/stage-1/runtime-integration-check.mjs
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/support-ui.js
---

# Conversation evidence store implementation

## Scope and base

Simon authorized a bounded local synthetic implementation that makes persisted
conversations genuinely separate and makes each assistant message own only the
evidence actually used for that answer. It excludes production personal data,
external-account ingestion, unrestricted cross-Room retrieval, Android device
automation and production release admission.

Repository ancestry inspection found required dependency
`a55fc011b207484374d69855d98b765eb6e748fa` was not an ancestor of
`origin/main`; `origin/feature/room-chat-openrouter` pointed to that SHA.
This branch and dedicated worktree were created from that unmerged dependency:

- branch `feature/conversation-evidence-store`;
- worktree `/home/lgtw/Work/granny-worktrees/conversation-evidence-store`;
- base `origin/feature/room-chat-openrouter` at `a55fc011b207484374d69855d98b765eb6e748fa`.
- implementation commit `fb3a7c89a0ee792080746dde29167bb9d3da0fea`;
  the later handoff-only commit refreshes this record and cockpit snapshot.

## Prior ownership and defect

| State | Previous owner | Problem |
|---|---|---|
| Conversation and Today | `app.js` tab memory plus `support-state.js` samples | Reload/restart loss; UI aggregation owned identity |
| Runtime turns/provider responses | `conversation-runtime/runtime.mjs` process memory | No durable conversation/message owner |
| Rooms/collections/items | `rooms-store.js` | No immutable revision or answer-use relation |
| Selected/excluded sources | Mutable `room-ui.js` state | Future choice could look like historical evidence |
| Request context | `roomUI.assistantContext()` | Client content was the context envelope |
| Response receipt | Every context candidate copied into the chat event | Available sources appeared as if actually used |
| Action history | Script model history and runtime events | Consequential results and assistant prose lacked one explicit persisted distinction |

The defect was an ownership failure. Mutable candidate/preference state was
treated as answer-specific evidence, so a UI-only filter would have preserved
the false data model.

## Architecture, schema and APIs

The loopback Node backend now owns schema-v1 SQLite through Node 26's built-in
`node:sqlite`; no package was added. CLI review uses the fixed
`${tmpdir()}/granny-conversation-runtime/conversations-v1.sqlite3` path.
Tests use `:memory:` or test-owned temporary files. The browser cannot choose
a path or issue SQL.

SQLite matches the existing backend, supplies transactions/foreign
keys/migrations without a dependency, and can plausibly map to later Android
Room/SQLite. IndexedDB would split authority into the browser; JSON would need
custom locking, migration and referential integrity; memory would retain
restart loss. [ADR-0017](../../09-decisions/ADR-0017-local-conversation-evidence-store.md)
is proposed because this changes a consequential prototype boundary. It does
not select production Android storage.

Migration `001-conversation-evidence.sql` creates normalized conversations,
messages, Rooms, collections, canonical sources, immutable source revisions,
memberships, retrieval runs/decisions, provider runs, message-evidence links,
future source preferences and minimal action history. Foreign keys and
message/provider/idempotency/citation uniqueness are enforced.
`PRAGMA user_version` records schema version.

`conversation-store.mjs` owns migrations, deterministic fixture/sample
seeding, transactions, bounds and queries. The server exposes only narrow
same-origin create/list/get, exact-message citation, source-preference,
clear-history and reset routes plus typed runtime routes. It reconstructs
provider context from stored current revisions and rejects private,
cross-scope, unavailable and future-excluded sources before egress.

The provider must return a structured `report_answer` result with
`usedSourceIds`. A completed assistant message and its evidence links commit
transactionally, then citations are read through
`fetchMessageCitations(assistantMessageId)`. Replayed request/event identities
are idempotent. A stale run must match its conversation, triggering user
message and retrieval run. Assistant text and verified action results remain
distinct; minimal action history stores result/evidence grade/codes, never
treating prose as proof.

## Lifecycle and privacy behavior

- New conversation creates a UUID/session and archives the prior active
  nonfixture conversation. Titles derive once from the first user message and
  are bounded to 54 characters. Prior Today rows are read-only exact-ID views.
- Two fixed-UUID fictional samples use `fictional_sample` mode and cannot
  resolve to the active live/offline conversation.
- Completed conversations/messages/evidence survive reload and CLI backend
  restart. Runtime sessions, permits, pending work and MCP drafts do not.
- Select-for-next and exclude-from-future never create, remove or replace an
  earlier citation.
- Historical View source opens the exact immutable revision. Later revisions
  do not substitute. Deleted/unavailable sources return a redacted receipt
  retaining title, revision, provenance and integrity metadata.
- Clear history removes archived nonfixture conversations and dependent rows,
  retaining the active conversation and fixed samples. Full reset removes all
  nonfixture conversations/action history, restores fixtures and creates a
  fresh offline conversation.
- Existing tab/process-memory chats are discarded, not fabricated as migrated
  data. Bounds are 20 nonfixture conversations, 200 messages per conversation
  and 100 action-history records. These are synthetic limits, not production
  retention promises.

Missing databases migrate and seed safely. A newer `user_version` fails with
`unsupported_schema`; open/corruption/migration failure becomes
`database_unavailable` without global-state fallback. The store closes on
graceful shutdown.

## Frontend integration

`conversation-data.js` is a narrow API client/cache, not another authority.
`app.js` renders stored turns and exact message citations, starts a new
backend conversation/session without deleting the prior one, and makes Today
resolve exact IDs. `room-ui.js` persists future selection/exclusion separately
and opens the cited revision. `support-ui.js` presents prior conversations as
read-only and keeps samples labelled. Home, Rooms, item-level Ask Granny and
support navigation retain one assistant.

**The response component renders only evidence rows returned for that assistant
message ID.** It never consults current Room candidates, accumulated
conversation sources or mutable selected-next state to label history.

## Validation evidence

Final deterministic unit/API commands:

```text
node --test prototypes/conversation-runtime/conversation-store.test.mjs  # 18 pass
node --test prototypes/conversation-runtime/provider.test.mjs            # 6 pass
node --test prototypes/conversation-runtime/runtime.test.mjs             # 18 pass
node --test prototypes/conversation-runtime/server.test.mjs              # 7 pass
node --test prototypes/stage-1/cloud.test.mjs                             # 28 pass
node --test prototypes/stage-1/model.test.mjs                             # 67 pass
node --test prototypes/stage-1/outcomes.test.mjs                          # 11 pass
node --test prototypes/stage-1/rooms-store.test.mjs                       # pass, 58 assertions
node --test prototypes/stage-1/scheduler.test.mjs                         # 7 pass
node --test prototypes/stage-1/serve.test.mjs                             # 1 pass
node --test prototypes/stage-1/support-state.test.mjs                     # pass, 36 assertions
```

Final browser/integration commands:

```text
node prototypes/stage-1/browser-check.mjs                          # 137 checks
node prototypes/stage-1/home-browser-check.mjs                     # 158 checks
node prototypes/stage-1/rooms-browser-check.mjs                    # 350 checks
node prototypes/stage-1/room-layout-browser-check.mjs              # 143 checks
node prototypes/stage-1/rooms-system-browser-check.mjs             # 61 checks
node prototypes/stage-1/support-browser-check.mjs                  # 71 checks
node prototypes/stage-1/runtime-browser-check.mjs                  # 73 checks
node prototypes/stage-1/shared-state-browser-check.mjs             # 129 checks
node prototypes/stage-1/outcomes-browser-check.mjs                 # pass
node prototypes/conversation-runtime/browser-check.mjs             # 19 checks, real HTTP/MCP/files
node prototypes/conversation-runtime/conversation-browser-check.mjs # 13 checks, real HTTP/SQLite/MCP/browser
node prototypes/conversation-runtime/live-consent-check.mjs        # 10 checks, stub/no paid call
node prototypes/stage-1/runtime-integration-check.mjs http://127.0.0.1:4180 # 13 checks
```

Restricted-sandbox attempts for several real localhost/MCP checks returned
`EPERM` or `mcp_unavailable`; the same commands passed under the approved
loopback execution boundary. Coverage includes A versus B/C, independent A/B
answers, repeated-source links, future exclusion/selection, revision/deletion
receipts, pre-egress scope denial, conversation/sample isolation,
new-conversation/Today/clear/reload/restart, replay/stale fencing,
failed/stopped/unknown states, database failure and content-free diagnostics.
The persistence-layer test explicitly calls
`fetchMessageCitations(assistantMessageId)`.

Documentation and lifecycle validation also passed:

```text
python3 scripts/cockpit.py --write                              # 105 records; snapshot written and structurally valid
python3 scripts/cockpit.py --check                              # PASS
python3 scripts/validate-docs.py                                # PASS; 0 errors
python3 scripts/check_handoff.py --base origin/feature/room-chat-openrouter # PASS
python3 -m unittest discover -s scripts -p 'test_*.py'          # 47 pass
git diff --check                                                # pass
```

No paid live-provider smoke ran. No Android/device or representative-human
evidence ran. EVAL-008/012 and production retention/privacy gates remain
unpassed.

## Start, recovery and rollback

```bash
cd prototypes/conversation-runtime
npm ci --ignore-scripts --no-audit --no-fund
cd ../..
node prototypes/conversation-runtime/server.mjs 4173
```

Open `http://127.0.0.1:4173/`. This uses offline deterministic replies and
the fixed SQLite path. Live mode remains separately consented, server-side and
unnecessary for review.

For recoverable synthetic data, use **Reset everything** or the bounded reset
API. For a clean file rollback, stop the server, remove
`/tmp/granny-conversation-runtime/conversations-v1.sqlite3` and any
`-wal`/`-shm` companions, then restart to recreate schema v1. This deletes
only synthetic review transcripts. Reverting this branch restores the prior
memory implementation. There is no downgrade migration or production
backup/restore guarantee.

## Risks and next task

The OS-temporary database has no production at-rest encryption, backup
exclusion or durable deletion guarantee. The loopback service assumes a
trusted local OS user. Room organization mutations remain browser-memory
fixtures; only seeded canonical data and conversation/evidence relations
persist. Structured source declaration is a bounded model claim, not proof of
faithful reasoning.

Next: review two answers using different sources, historical View source after
exclusion/revision, two Today rows and Clear history, then decide whether to
accept ADR-0017 for this prototype boundary. Android Room mapping and
production retention/privacy remain a separately authorized task.
