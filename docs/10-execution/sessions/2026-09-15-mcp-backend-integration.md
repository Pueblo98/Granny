---
title: "Local conversation backend and MCP draft integration"
status: review
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
next_action: Review the completed local demo and failed live proposal evidence before any capability expansion.
changed_paths:
  - .github/workflows/conversation-runtime.yml
  - docs/01-product/traceability.md
  - docs/02-design/browser-prototype.md
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
  - docs/10-execution/messages/2026-09-15-ui-backend-be-007.md
  - docs/README.md
  - prototypes/conversation-runtime/.gitignore
  - prototypes/conversation-runtime/README.md
  - prototypes/conversation-runtime/browser-check.mjs
  - prototypes/conversation-runtime/live-consent-check.mjs
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
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/cloud.js
  - prototypes/stage-1/cloud.test.mjs
  - prototypes/stage-1/runtime-browser-check.mjs
---

# Local conversation backend/MCP handoff

## Scope and result

Simon requested implementation on 2026-09-15: one real local browser/backend/MCP vertical slice with fictional contacts and an unsent demo store. **Implemented and deterministically verified:** ordinary chat/typed request → semantic proposal → actual MCP contact lookup → specific ambiguity → exact preview/edit → separate user confirmation → actual local draft write → separate stored read → verified not-sent result. No Android, account or real-send capability. T-117 is in review; canonical product gates and T-103 remain unchanged.

[Runtime/startup](../../../prototypes/conversation-runtime/README.md) and [granny.conversation.v1](../../04-architecture/conversation-runtime-contract.md) are the implementation/interface owners. Official MCP client/server 2.0.0 and Zod 4.6.5 were explicitly approved and lockfile-pinned. MCP 2025-11-25 is observed during initialization and required by tests; tool discovery and all three tool calls use actual stdio JSON-RPC. No large hand-rolled protocol stack, arbitrary server/tool/network/shell or filesystem path input.

Backend independently validates schemas/identities, binds immutable exact preview to one confirmation, expires/invalidate approvals, fences late results, preserves request/event identities, enforces budgets and quarantines unknown effects. Model output cannot confirm. Stop before admission prevents write; Stop during write is unknown with no automatic read/retry. Explicit quoted/marked bodies are independently checked against original input so model spans cannot silently trim punctuation/whitespace. Separate file readback, not write acknowledgment, proves completion.

## Coordination and file ownership

Started from main 5ffa589; inspected frontend 09fa64d and Qwen bff087c with common ancestor 387662f. Qwen research/handoff and provider limits were read at exact branch contents; its older UI was never transplanted. The provider was adapted into the backend with typed semantic slots and original-text provenance. Board messages BE001–007 and FE001–006 preserve exact published agreements. Frontend's final checkpoint ae9656c / FE006 e3ad478 was merged with both histories preserved; only generated cockpit snapshots conflicted and were regenerated.

[FE006](../messages/2026-09-15-ui-backend-fe-006.md) explicitly delegated six files for the live-consent entry. Backend changed only its named app.js connection/mode/privacy paragraphs, cloud.js requested-mode binding, cloud.test.mjs and runtime-browser-check.mjs consent regressions, and the two named README/design paragraphs. No styles/layout or unrelated frontend behavior changed. Demo remains default; live entry requires explicit availability discovery and separate fictional-text/OpenRouter disclosure. No model request on connection or consent dialog; no keys in browser. Those six file boundaries return to frontend after this published handoff.

## Executed checks

Environment: Node 26.8.1; Chromium 151.0.7922.173; Python/PyYAML already installed; synthetic data only.

| Exact command | Observed result | Evidence limit |
|---|---|---|
| `node --test prototypes/conversation-runtime/*.test.mjs prototypes/stage-1/cloud.test.mjs prototypes/stage-1/model.test.mjs prototypes/stage-1/scheduler.test.mjs prototypes/stage-1/serve.test.mjs` | **127 tests passed**: 25 backend/provider/HTTP, 27 client, 67 scripted model, 7 scheduler, 1 static server | Stub provider; actual MCP transport/files for normal effects and explicit fault fixtures |
| `node prototypes/conversation-runtime/browser-check.mjs` | **17 assertions passed**; actual UI → HTTP → MCP → stored readback, screenshot inspected | Stub model; fictional people/destination; no native/user evidence |
| `node prototypes/conversation-runtime/live-consent-check.mjs` | **10 assertions passed**, consent → mode live → one stub interpretation → actual MCP verified unsent draft | Proves live-mode wiring with a stub provider, not live Qwen quality; zero paid calls |
| `node prototypes/stage-1/runtime-browser-check.mjs` | **37 assertions passed**; prior fences/unknown/reset/expiry plus separate live consent | Explicit wire fixtures; no MCP evidence from this command |
| `node prototypes/stage-1/browser-check.mjs` | **130 assertions passed**, no browser errors or external requests | Existing scripted workflows/access regressions, not Android |
| `node prototypes/stage-1/runtime-integration-check.mjs http://127.0.0.1:4181` | **13 assertions passed** against the owned combined server | Frontend-authored test, also independently run by frontend; read actual FE006 evidence limits |
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | **46 passed**; expected negative Git fixture prints “fatal: Needed a single revision” | Repository tooling only |
| `python3 scripts/validate-docs.py`; `python3 scripts/cockpit.py --write`; `--check`; `python3 scripts/check_handoff.py --base origin/main`; `git diff --check` | Passed at final delivery (docs, fresh snapshot, scoped handoff and whitespace) | Structural/coverage/whitespace only |

Required failure coverage: wrong/ambiguous people; exact content; missing/changed/stale/replayed confirmations; Stop before dispatch and during a real pending write; duplicate requests/events and read-only reconnect; provider timeout/unavailable route; actual MCP call timeout and pending disconnect (tests pause/terminate only their own child); malformed/injected MCP output; unknown acknowledgment without duplicate; unapproved tool/server/path; secret exclusion from served assets/errors and content-free diagnostics. No blind retries. Rate/process/token/price/privacy filters remain unchanged from the Qwen experiment.

Initial stdio smoke failed inside the host sandbox, where even a minimal Node child pipe lost output; outside-sandbox smoke and tests passed. Two initial actual-browser failures were test readiness/label selector mistakes; fixed in backend test only. The delegated consent fixture initially reopened a dialog before its close event; fixed the test to await that event. No policy or frontend execution condition was relaxed to obtain a pass. Initial kickoff handoff check failed while the record was active; final coverage uses this contemporaneous review record, no disabled check.

## Live Qwen evidence — failed proposal, preserved

`node --env-file=/absolute/private/.env prototypes/conversation-runtime/live-smoke.mjs --live`: **FAIL**, exactly one synthetic provider request, 929 ms, `state:idle`, `event:chat`, `exact:false`, zero draft writes. Qwen returned chat instead of structured draft fields. No retry, fallback or cap increase. No credential/transcript/raw reasoning log; cost was not collected, so this is not a reconciled bill. This failed evidence remains separate from passing deterministic/live-mode-wiring tests. Live natural-language draft reliability is **not established**.

The earlier Qwen branch also had tone/punctuation failures and route outages; its source evidence remains at bff087c. No clean live quality claim, human/dignity/accessibility acceptance, native Android capability, canonical EVAL pass or release gate is inferred.

## Publication, primary vault and next bounded work

Worktree: /tmp/granny-mcp-backend-integration; branch feature/mcp-backend-integration. Milestones: kickoff 70256e4; contract aea7f44; first backend e783d17; expanded evidence 2ee0d61; integrated demo 49cde23/4d175f6; actual browser test 658eaea; safety hardening b9806e6; final frontend handoff merge a262452. Final source/record commit is located through this file's publication history and BE007; avoid circular self-hashes. Task-branch push remains authorized; no PR/main action performed by this session.

Read-only fetch/PR inspection observed an **external merge of PR #8 at earlier backend e783d17**, origin/main 0343792. Latest integrated frontend/safety/consent work remains newer task-branch work. The primary checkout stays at 5ffa589 with original action-policy/Canvas edits and untracked To DO preserved. No stash/reset/private env/Obsidian edits or claimed main-vault synchronization. Hosted CI for this final workflow remains unrun; config has immutable actions, pinned dependencies and no live-provider secret.

First follow-up: review the conversational slice and diagnose the failed live proposal with a separately bounded synthetic evaluation plan; do not expand tools to mask a model failure. **Next read-only capability proposal:** “Show the demo draft I just created,” restricted to a draft ID already verified in the same session, explicit current request, one MCP read, no directory listing/arbitrary ID/other-session data, no model authority or writes. Not implemented. No real message archive, personal files or Android route is admitted.


Read-only primary verification: `python3 scripts/check_vault.py --checkout /home/lgtw/Work/granny --expected-commit 0343792 --path docs/04-architecture/conversation-runtime-contract.md` returned **NEEDS REVIEW**: primary HEAD 5ffa589 differs from fetched origin/main 0343792, expected merge absent, new contract absent, user-modified Canvas. This is expected stale-vault evidence, not a reason to overwrite user files or update main without authority. Primary status remains exactly the original action-policy/Canvas edits and untracked To DO. Targeted secret-format scan found no matches in new runtime/client/checkpoint sources; heuristic only, complemented by dynamic asset/error isolation tests.
