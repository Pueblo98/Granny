---
title: "Local conversation runtime — Room-aware chat and fictional drafts"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [prototype, backend, mcp]
related:
  - ../../docs/04-architecture/conversation-runtime-contract.md
  - ../../docs/10-execution/sessions/2026-09-15-mcp-backend-integration.md
  - ../../docs/10-execution/sessions/2026-09-20-room-chat-openrouter.md
  - ../stage-1/README.md
---

# Local conversation runtime

One bounded local runtime serves the same assistant on Home and in all fictional Context Rooms, then supports fictional contact resolution → exact preview → explicit confirmation → actual isolated local draft write → separate stored-record readback. Success means **“Draft created in the demo. Not sent.”** No real messaging account, Android integration or arbitrary MCP installation.

## Start

Tested with Node 26.8.1. Official MCP client/server 2.0.0, Zod 4.6.5 and transitive packages pinned in package-lock.json. Dependencies were explicitly approved for this isolated experiment. A fresh checkout installs that exact lockfile:

```bash
cd prototypes/conversation-runtime
npm ci --ignore-scripts --no-audit --no-fund
cd ../..
node prototypes/conversation-runtime/server.mjs
```

`node_modules/` is intentionally ignored and absent in every new worktree until this command runs. A missing `zod` or MCP package therefore means the per-worktree install has not run; do not commit or copy `node_modules`. Tests that spawn the real MCP stdio child can fail in a restricted host sandbox even after installation. Repeat the exact test under a narrowly approved outside-sandbox execution and preserve both results rather than changing the protocol or skipping the test.

Open http://127.0.0.1:4180. Optional numeric port argument. The backend serves the sibling conversation-first UI and same-origin API; use its explicit connected demo entry. Scripted UI remains separate. Stub model is deterministic; MCP initialization, JSON-RPC stdio, tool discovery/calls, temporary files and independent readback are real. Only the three allowlisted demo tools are exposed. MCP wire protocol **2025-11-25** is observed during initialization and required, using SDK 2.0.0's maintained legacy handshake support.

Try `Hello`, then `Tell David Brother "Meet at six.  🌱" via Example Messages`. Ambiguity example: `Tell David "Meet at six."`. The unquoted fixture `Tell David Brother I will call after dinner. via Example Messages` also works. Demo grammar is deliberately deterministic for testing; Qwen performs live semantic interpretation. Review exact recipient/channel/body, optionally edit, then explicitly create the unsent demo draft. Stop remains local and bounded. Unknown effects cannot be retried in that session.

## Optional live interpretation

```bash
node --env-file=/absolute/path/to/private/.env prototypes/conversation-runtime/server.mjs --live
```

The existing private env defines OPENROUTER_API_KEY; never copy it into the checkout, browser, screenshots or command arguments. `--live` only makes the route available; explicit UI consent and a live session are still required. Use **Menu → Settings → About Granny → AI connection → Use live AI chat**, review the disclosure, then continue. The connection screen checks availability automatically but makes no provider call. No paid request occurs on page load or session creation. Synthetic text only. Latest input plus at most ten bounded prior conversation messages may leave the machine. Home sends no Room sources; inside a Room, at most three query-relevant non-private current-Room fictional references are sent in a separate untrusted context message. No cross-room source, MCP output, confirmation, draft result, private file or secret enters model context. No raw transcript logging.

The system prompt defines one respectful adult assistant across Home and Rooms,
forbids action claims and treating reference content as instructions, and asks
the model to name a source it uses. The browser shows the backend's source
receipt below ordinary model text. Draft proposals still pass through exact
slot/span validation and separate confirmation; a model answer never becomes
action authority.

Qwen3.8 Flash is replaceable behind provider.mjs. Prior limits retained: 20/process, six/minute, one in flight, 768 output tokens, 25s timeout, required parameter support, collection deny, no fallback, price ceilings $0.15/M input and $0.47/M output. No implicit retry or account-wide billing guarantee. Restart resets process counters, not provider charges. Do not run repeated live sessions to bypass caps.

## Tests and evidence

```bash
node --test prototypes/conversation-runtime/*.test.mjs
node prototypes/conversation-runtime/browser-check.mjs
node prototypes/conversation-runtime/live-consent-check.mjs
```

Tests use a real local stdio server for normal draft effects. Explicit adverse fixtures wrap that port to lose an acknowledgment, delay a dispatched write or corrupt readback; these faults are test-only. Provider HTTP is stubbed in deterministic tests. The backend-owned browser-check.mjs drives the committed frontend through the real HTTP/MCP/store path. The frontend-owned runtime-browser-check script separately tests supplied wire fixtures; it is not MCP evidence. The CI workflow runs deterministic tests only and has no provider secret. See the session for actual commands/results.

One separately authorized synthetic live interpretation, **not CI**:

```bash
node --env-file=/absolute/path/to/private/.env prototypes/conversation-runtime/live-smoke.mjs --live
```

Exactly one provider request, no retry, no draft write; the current smoke asks one synthetic Kitchen question and reports only state/code/timing/source-binding/grounding evidence. Failure is retained, not relabeled a pass. Deterministic success does not establish general live language reliability or native Android capability.

## Lifecycle and scope

Ctrl+C shuts down HTTP and the MCP child and removes its temporary synthetic draft directory. The server creates its own directory; neither model nor browser can choose a path. Crash remnants can remain in the OS temporary directory, containing synthetic drafts only. Restart creates a new store and restores no permits or pending work. Each session expires after 30 minutes; eight sessions/process, 64 commands/session, bounded event history. Stop remains available at budget exhaustion.

The trusted local UI is the confirmation source. This developer loopback service is not authenticated multi-user infrastructure and must not be exposed through LAN/tunnel/public hosting. Host/Origin/body validation blocks ordinary browser cross-origin access. Server-side policy protects against model/tool output, not malicious software already running as the same OS user.

[Wire contract](../../docs/04-architecture/conversation-runtime-contract.md) owns all request/event/state semantics. [Original session evidence](../../docs/10-execution/sessions/2026-09-15-mcp-backend-integration.md) and the [Room-aware extension](../../docs/10-execution/sessions/2026-09-20-room-chat-openrouter.md) distinguish implemented, tested, published, frontend-reviewed, live and unavailable capabilities. Production gates remain unchanged.
