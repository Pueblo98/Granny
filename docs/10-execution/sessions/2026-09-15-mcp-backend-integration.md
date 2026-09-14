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
session_state: review
record_basis: contemporaneous
agent: Codex backend integration session
branch: feature/mcp-backend-integration
next_action: Frontend consumes the agreed runtime; finish adversarial HTTP/provider and browser integration checks.
changed_paths:
  - docs/10-execution/messages/2026-09-15-ui-backend-be-001.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-002.md
  - docs/04-architecture/conversation-runtime-contract.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-003.md
  - prototypes/conversation-runtime/.gitignore
  - prototypes/conversation-runtime/mcp-host.mjs
  - prototypes/conversation-runtime/mcp-server.mjs
  - prototypes/conversation-runtime/package-lock.json
  - prototypes/conversation-runtime/package.json
  - prototypes/conversation-runtime/provider.mjs
  - prototypes/conversation-runtime/runtime.mjs
  - prototypes/conversation-runtime/runtime.test.mjs
  - prototypes/conversation-runtime/schema.mjs
  - prototypes/conversation-runtime/server.mjs
---

# Scope and authority

Simon requested implementation on 2026-09-15: one real local browser/backend/MCP vertical slice using fictional contacts and a local unsent draft store. Separate from T-103 and native Android evidence. Backend owns execution; frontend owns rendering/transport. No main merge, PR action, real send or personal-data integration authorized. Task-branch publication authorized.

## Evidence

Startup: main has user-owned action-policy and Canvas edits plus untracked To DO; preserved. Frontend 09fa64d and Qwen bff087c inspected clean; both PRs open. Backend isolated from main at 5ffa589. No peer integration messages at startup. Implementation/tests remain pending.

## Handoff

Active kickoff; see linked message for exact ownership and checkpoint request.

## Implementation checkpoint

Actual MCP stdio handshake/discovery/contact read passed outside sandbox; SDK 2.0.0 and negotiated protocol 2025-11-25. Dependency installation explicitly approved. Runtime and tests now exist; integrated browser, HTTP/provider adverse checks and final canonical updates remain in progress. This review checkpoint is not completion. Kickoff coverage check failed as expected while record was active; no check disabled.
