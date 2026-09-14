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
artifact_commit: c7cdd821f5f214f067a1b8566d9751a4272bb470
next_action: Review the connected demo with Simon and hand off only the agreed live-consent entry paths to the backend session
changed_paths:
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-001.md
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-002.md
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-003.md
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-004.md
  - docs/10-execution/messages/2026-09-15-ui-backend-fe-005.md
  - prototypes/stage-1/browser-check.mjs
  - docs/02-design/browser-prototype.md
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/index.html
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/serve.test.mjs
  - prototypes/stage-1/browser-driver.mjs
  - prototypes/stage-1/runtime-browser-check.mjs
  - prototypes/stage-1/runtime-integration-check.mjs
  - prototypes/stage-1/cloud.js
  - prototypes/stage-1/cloud.test.mjs
---

# Frontend runtime coordination

## Scope and authority

Simon authorized continuing the existing conversation-first frontend and coordinating a real local demo-draft runtime with the separate backend/MCP session through the existing board. Frontend owns layout/access/copy/event rendering/client transport/browser tests. Backend owns runtime/provider/MCP/server-side enforcement and contract editing. No production backend, real sends/accounts/devices, deployment, keys in browser, main merge or private Obsidian edits in this lane.

## Checkpoint

Frontend worktree /tmp/granny-conversation-first and branch feature/conversation-first are unchanged; inspected clean at 09fa64d. Backend worktree exists at /tmp/granny-mcp-backend-integration on feature/mcp-backend-integration, initially at 5ffa589 with no peer topic message. Qwen bff087c diverges from the frontend after 387662f; newer frontend files must be preserved.

The kickoff preceded cross-cutting changes. FE001 published at 7e919ae; FE002 at 241e20d; technical contract agreement FE003 and six additional browser checks at de942c0. Backend's granny.conversation.v1 contract at aea7f44 is being consumed in an explicit connected-mode extension. Backend retains its contract/runtime and shared canonical documentation; frontend retains browser-prototype.md and prototype README. Prior delivered scripted evidence is not relabeled as integrated evidence. Rollback is a scoped adapter/UI revert, leaving scripted mode available.

## Validation and publication

Kickoff/acknowledgment documentation, cockpit and whitespace checks passed; each checkpoint was committed and published with remote SHA verification. Integrated frontend rerun: 67 model, 7 scheduler, 23 client and 1 static-server test passed; 130 scripted browser assertions passed (Chrome 151.0.7922.173), no exceptions or external requests, artifacts /tmp/granny-conversation-review-Qowc7b. These include unfinished input, selection, scroll and editor/settings retention. Connected frontend wire-fixture browser checks passed 24 assertions; tablet/narrow screenshots inspected at /tmp/granny-conversation-review-UBsXZ7. Wire fixtures are not actual backend integration evidence.

Root separately ran backend-owned runtime.test.mjs at published e783d17: 9/9 real MCP tests passed, including real local write/readback, cancellation/unknown and exact-content cases. This ran from the backend checkout read-only without changing its files/index or starting a second backend implementation. Browser-to-real-MCP combined testing is still pending incorporation of the frontend checkpoint by the backend session. Host sandbox denied loopback listening; browser/static/MCP test commands were rerun with explicit tool permission, no checks bypassed. Documentation/cockpit/handoff/whitespace checks and 46 Python tooling tests passed.

Sol's isolated frontend-client lane owns only cloud.js and cloud.test.mjs. Terra independently reviewed new root-owned UI code read-only. Root found replay/approval and malformed-event gaps in the first adapter review and requested regression fixes before integration; UI review prompted persistent unknown-outcome disclosure and explicit unacknowledged-turn copy. No worker edited shared canonical docs or either peer session's checkout/index.

Independent Sol review found one additional malformed-snapshot gap: an event beyond the declared cursor could advance internal replay position. Root fixed it, added a regression, and bound the initial consent to mode demo. Client suite now passes 25 tests. The real-runtime browser driver script is added for the peer's combined loopback checkpoint; until executed its presence is not integration evidence.

## Combined browser evidence

Root executed **node prototypes/stage-1/runtime-integration-check.mjs http://127.0.0.1:4181** against backend-owned combined checkpoint **4d175f6b80a97baeac380a98a5e2e043a63c325e** (code combine 49cde23, UI c7cdd82). **13 assertions passed**, no browser exceptions or external requests. The test created one fictional local unsent draft through actual HTTP/runtime/MCP, with selected David Gardening group / Example Mail, exact edited whitespace/newline/emoji, separate verified result, chat and Stop. Screenshots /tmp/granny-conversation-review-1KuSUp were inspected in tablet portrait and landscape. First attempt failed because the test expected Garden club instead of the canonical Gardening group differentiator; only the test was corrected. A sandbox Chromium launch was rerun with permission, not by weakening browser checks.

Root also ran **node --test prototypes/conversation-runtime/runtime.test.mjs prototypes/conversation-runtime/provider.test.mjs prototypes/conversation-runtime/server.test.mjs** from the peer checkout at 4d175f6: **22/22 passed**, real MCP plus deterministic provider/HTTP fixtures. No live provider call was made by this frontend session. Peer reports one failed live proposal (chat rather than structured draft); that is not repaired or contradicted by deterministic success.

Static preview http://127.0.0.1:4173 serves /tmp/granny-conversation-first (node prototypes/stage-1/serve.mjs); only this task's own server was restarted for cloud.js allowlisting. Combined preview http://127.0.0.1:4181 is owned by the backend session, started there with node prototypes/conversation-runtime/server.mjs 4181. Port 4180 is unrelated/occupied and was not stopped. The frontend fixture suite additionally checks unknown warning/quarantine across full reset and expired-preview renewal without retry. Final counts and immutable ownership handoff are in the next frontend message.

Remaining: config-gated live consent entry requested by BE006 has separate backend-session authority and needs a narrow file-ownership handoff after this frontend checkpoint. No live quality, Android, screen-reader, representative-human or final branding claim. Main remains unmerged; primary user edits/private state are preserved. PR6 was observed open and non-draft on 2026-09-15; this frontend session did not change its draft status or merge it.

This record is a checkpoint for review while the authorized task continues, not a claim the integrated slice is complete. Messages are written only in the frontend worktree; peer and primary directories are read directly. No polling daemon or automatic integration is installed. Primary main still has user-owned Canvas/action-policy edits and an untracked note; all are untouched. Branch-only messages are not visible in the normal main Obsidian vault. Existing draft PR6 remains unmerged.
