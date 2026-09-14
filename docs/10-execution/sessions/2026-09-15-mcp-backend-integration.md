---
title: "Local conversation backend and MCP draft integration"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [execution, session, backend]
related:
  - ../backlog.md
  - ../messages/2026-09-15-ui-backend-be-001.md
record_type: session
session_state: active
record_basis: contemporaneous
agent: Codex backend integration session
branch: feature/mcp-backend-integration
next_action: Agree frontend checkpoint and implement bounded local MCP draft runtime.
changed_paths:
  - docs/10-execution/messages/2026-09-15-ui-backend-be-001.md
---

# Scope and authority

Simon requested implementation on 2026-09-15: one real local browser/backend/MCP vertical slice using fictional contacts and a local unsent draft store. Separate from T-103 and native Android evidence. Backend owns execution; frontend owns rendering/transport. No main merge, PR action, real send or personal-data integration authorized. Task-branch publication authorized.

## Evidence

Startup: main has user-owned action-policy and Canvas edits plus untracked To DO; preserved. Frontend 09fa64d and Qwen bff087c inspected clean; both PRs open. Backend isolated from main at 5ffa589. No peer integration messages at startup. Implementation/tests remain pending.

## Handoff

Active kickoff; see linked message for exact ownership and checkpoint request.
