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
session_state: active
record_basis: contemporaneous
agent: Codex
branch: feature/room-chat-openrouter
artifact_commit: null
next_action: Implement and validate one shared Home-and-Rooms assistant against fictional browser fixtures
changed_paths:
  - docs/02-design/context-rooms.md
  - docs/04-architecture/conversation-runtime-contract.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/sessions/2026-09-20-room-chat-openrouter.md
  - docs/README.md
  - prototypes/conversation-runtime
  - prototypes/stage-1
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

## Handoff

Implementation and validation are in progress in
`/home/lgtw/Work/granny-worktrees/room-chat-openrouter`. Unrelated untracked
files in the primary checkout are outside scope and remain untouched.
