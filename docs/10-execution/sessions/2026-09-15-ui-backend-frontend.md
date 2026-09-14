---
title: "Frontend coordination and runtime adapter slice"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [execution, frontend, integration]
related:
  - ../agent-board.md
  - ../messages/2026-09-15-ui-backend-fe-001.md
  - ../../02-design/browser-prototype.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Frontend Codex session
branch: feature/conversation-first
artifact_commit: 09fa64d90becd1089788b75dc02ec090c2890cad
next_action: Coordinate the backend contract and implement its bounded frontend adapter without replacing the delivered conversation UI
changed_paths:
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-001.md
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-002.md
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-003.md
  - prototypes/stage-1/browser-check.mjs
---

# Frontend runtime coordination

## Scope and authority

Simon authorized continuing the existing conversation-first frontend and coordinating a real local demo-draft runtime with the separate backend/MCP session through the existing board. Frontend owns layout/access/copy/event rendering/client transport/browser tests. Backend owns runtime/provider/MCP/server-side enforcement and contract editing. No production backend, real sends/accounts/devices, deployment, keys in browser, main merge or private Obsidian edits in this lane.

## Checkpoint

Frontend worktree /tmp/granny-conversation-first and branch feature/conversation-first are unchanged; inspected clean at 09fa64d. Backend worktree exists at /tmp/granny-mcp-backend-integration on feature/mcp-backend-integration, initially at 5ffa589 with no peer topic message. Qwen bff087c diverges from the frontend after 387662f; newer frontend files must be preserved.

The kickoff precedes cross-cutting changes. Backend contract is not yet consumed; connected mode is not yet implemented. Prior delivered scripted evidence is linked in the kickoff, not relabeled as integrated evidence. Rollback is a scoped adapter/UI revert, leaving scripted mode available.

## Validation and publication

Kickoff documentation checks and exact publication reference will be recorded at the next checkpoint. This record is a checkpoint for review while the authorized task continues, not a claim the integrated slice is complete. Messages are written only in the frontend worktree; peer and primary directories are read directly. No polling daemon or automatic integration is installed.
