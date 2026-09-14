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
  - .github/workflows/conversation-runtime.yml
  - docs/01-product/traceability.md
  - docs/03-agent/tool-contracts.md
  - docs/04-architecture/conversation-runtime-contract.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/action-policy.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-001.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-002.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-003.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-004.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-005.md
  - docs/10-execution/messages/2026-09-15-ui-backend-be-006.md
  - docs/README.md
  - prototypes/conversation-runtime/.gitignore
  - prototypes/conversation-runtime/README.md
  - prototypes/conversation-runtime/browser-check.mjs
  - prototypes/conversation-runtime/live-smoke.mjs
  - prototypes/conversation-runtime/mcp-host.mjs
  - prototypes/conversation-runtime/mcp-server.mjs
  - prototypes/conversation-runtime/package-lock.json
  - prototypes/conversation-runtime/package.json
  - prototypes/conversation-runtime/provider.mjs
  - prototypes/conversation-runtime/provider.test.mjs
  - prototypes/conversation-runtime/runtime.mjs
  - prototypes/conversation-runtime/runtime.test.mjs
  - prototypes/conversation-runtime/schema.mjs
  - prototypes/conversation-runtime/server.mjs
  - prototypes/conversation-runtime/server.test.mjs
---

# Scope and authority

Simon requested implementation on 2026-09-15: one real local browser/backend/MCP vertical slice using fictional contacts and a local unsent draft store. Separate from T-103 and native Android evidence. Backend owns execution; frontend owns rendering/transport. No main merge, PR action, real send or personal-data integration authorized. Task-branch publication authorized.

## Evidence

Startup: main has user-owned action-policy and Canvas edits plus untracked To DO; preserved. Frontend 09fa64d and Qwen bff087c inspected clean; both PRs open. Backend isolated from main at 5ffa589. No peer integration messages at startup. Implementation/tests remain pending.

## Handoff

Active kickoff; see linked message for exact ownership and checkpoint request.

## Implementation checkpoint

Actual MCP stdio handshake/discovery/contact read passed outside sandbox; SDK 2.0.0 and negotiated protocol 2025-11-25. Dependency installation explicitly approved. Runtime and tests now exist; integrated browser, HTTP/provider adverse checks and final canonical updates remain in progress. This review checkpoint is not completion. Kickoff coverage check failed as expected while record was active; no check disabled.

## Backend evidence checkpoint

- `node --test prototypes/conversation-runtime/runtime.test.mjs prototypes/conversation-runtime/provider.test.mjs prototypes/conversation-runtime/server.test.mjs`: **22 tests passed**, no paid calls. Actual MCP handshake/discovery/draft write/separate readback; explicit fault ports for pending/lost acknowledgment and hostile observations; strict HTTP/provider boundary tests. Exact protocol 2025-11-25 asserted with SDK 2.0.0.
- `node --env-file=/absolute/private/.env prototypes/conversation-runtime/live-smoke.mjs --live`: **FAIL**, one synthetic provider call, 929 ms; model returned chat instead of structured proposal (`state:idle`, `event:chat`, `exact:false`), zero draft writes. No retry. Text/credentials not logged; cost was not collected, so this is not a reconciled usage bill. Live semantic reliability is unproven; the deterministic complete slice cannot substitute for that evidence.
- Docs validator and whitespace checks passed during canonical update. Frontend c7cdd82 / ready message ff2f4a8 now published; integrated browser check still pending combination.

## Actual combined browser checkpoint

`node prototypes/conversation-runtime/browser-check.mjs`: 17 assertions passed through actual browser UI, HTTP runtime, MCP stdio and isolated demo files. Includes exact-body edit, ambiguity, explicit confirmation, independent stored read, stable replay IDs and preview Stop. Screenshot inspected. Two initial failures were test readiness/label selector mistakes; corrected only backend-owned test. No frontend implementation changes. `python3 -m unittest discover -s scripts -p 'test_*.py'`: 46 passed. CI workflow added with immutable actions and pinned SDK install, stub-only; hosted run unrun because no PR/main action authorized. Peer requests 8917f56 client correction before final acceptance; pending integration.
