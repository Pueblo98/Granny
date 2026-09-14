---
title: "Run the Stage 1 browser design prototype"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [prototype, design]
related:
  - ../../docs/02-design/browser-prototype.md
  - ../../docs/02-design/product-design-spec.md
---

# Stage 1 browser design prototype

A dependency-free browser frontend for Granny's five scripted MVP workflows, with a separate opt-in connected local demo-draft mode. This is **not the Android application, production agent, or T-103 runtime**. Scripted external actions/results are fictional fixtures; the connected backend can create real local demo drafts for fictional contacts, never send messages. Never enter personal data.

## Run

Use the existing Node runtime (validated with Node 26.8.1):

```bash
node prototypes/stage-1/serve.mjs
```

Open **http://127.0.0.1:4173** on the same computer. Keep the terminal running; Ctrl+C stops it. An optional second argument selects another port if 4173 is occupied. There is no install/build step, account, cloud service or paid design tool.

The server binds only 127.0.0.1 and serves an exact allowlist of runtime scripts/styles and three original fictional SVG illustrations. Test files and repository files are excluded. This is a local preview server, not a backend. Do not bind to 0.0.0.0, deploy publicly or add uploads/analytics.

## Review

- Start with the conversation: type a goal or open **Talk (simulated)**. Supported requests need no category selection. Talk never uses a microphone or speech API.
- Try “Tell David I’ll call after dinner.” Resolve the person/channel, edit the exact preview, then choose **Open this draft**. Default outcome is a fictional **unsent** draft.
- Try “Show me the photos Sophie sent yesterday.”, “What am I looking at?”, “Play some Nina Simone.” and “Make this easier to read.” Results and controls appear in the same conversation. Screen help asks for a supplied fictional screen; no actual screen is observed.
- Demonstration progression is automatic, normally 650 ms per stage. These are scripted timings, not measured model/Android latency. Stop, edits, reset and task replacement invalidate pending callbacks.
- Menu reveals the secondary settings/help/privacy/history functions. Scripted data lives in this tab's memory; no browser persistence or account exists. Connected mode has separate server-side synthetic state, described below. Do not enter personal data.
- Open **http://127.0.0.1:4173/?review=1** for separate reviewer controls. Participant mode never inserts these controls into its DOM/focus order. Reviewer choices expose fixtures, outcomes, timing/expiry, enlarged text and proposed visual territories; hypothetical sends are explicitly simulations.

Start with the [review script and coverage/gaps](../../docs/02-design/browser-prototype.md). English, name, interaction and neutral/Open Day/Bright Signal styling remain proposals. No final font, palette or public name is selected.

## Connected local demo (separate opt-in)

**Menu → Demo connection → Connect to local demo** explicitly consents to fictional-data use. The static server above deliberately has no API, so this option requires the backend session's same-origin loopback runtime server serving these current frontend assets. Its canonical interface is [granny.conversation.v1 at the agreed checkpoint](https://github.com/Pueblo98/Granny/blob/aea7f442021347aab0130fcbe220ab5a1ab53b1b/docs/04-architecture/conversation-runtime-contract.md); frontend does not own or duplicate that runtime. See the [frontend coordination record](../../docs/10-execution/sessions/2026-09-15-ui-backend-frontend.md) for exact integrated commits and evidence before claiming a runnable combined build.

The connected slice prepares an unsent message for a fictional person: request, required clarification, exact person/channel/body/effect preview, explicit **Create this unsent demo draft**, creating/checking, and a verified **not sent** result. Editing message words creates a fresh preview; changing person/destination returns to a new natural request because backend-approved identity choices must not be invented by the frontend. An expired approval keeps the readable draft and offers review again. Typed “yes” is not confirmation.

Connected state comes only from ordered runtime events. No scripted timing, model prose or browser timer manufactures completion. Stop disables approval immediately and waits for backend acknowledgment. Connection loss disables action controls and recovers events read-only; it does not retry a confirmation. Unknown effect blocks another connected draft/session in this tab and remains disclosed even after leaving the connected view. Returning to scripted mode requests cancellation first where needed; browser reset is not deletion of the backend's synthetic store.

Text size and unfinished composer/editor content are preserved across secondary navigation. Scripted aliases, music and activity remain separate from backend contacts/execution. Connected mode currently exposes only the local demo, not a live/cloud-provider selector. No key is sent to the browser, no runtime calls occur before opting in, and CSP permits same-origin connections only. The default five-workflow scripted experience is unchanged.

## Supported rule-based grammar

The router recognizes bounded English forms, not general natural-language understanding. Message words are preserved; leading/trailing request whitespace and optional command words are not part of the draft. Use fictional content only.

| Goal | Representative forms and slots |
|---|---|
| Message | `Tell David …`, `Text Sophie …`, `Write a message to David Brother … via Example Mail`; person, optional differentiator/channel and exact remaining body. Explicit aliases also work with tell/message/text. |
| Photos | `Show me the photos Sophie sent yesterday`, `Show Sophie's photos from yesterday`, `Find photos from Sophie Book club on 12 September`; missing person/date is clarified. Fixed clock: 14 September 2026. |
| Screen | `What am I looking at?`, `Explain this screen`; choose supplied fictional context, then `Explain more simply` or `return` when known. |
| Media | `Play some Nina Simone`, `Listen to Sinnerman`; choose between ambiguous tracks, then `pause` / `resume`. No audio is produced. |
| Readability | `Make this easier to read`, `Make Granny text larger`, `Set external text normal`; clarify scope, preview/apply locally or give external guidance only. |

Clarification accepts the displayed choice label as a typed reply. `Change the message to …` edits the current message; photo follow-ups accept the displayed person and supported date forms. Unsupported input stays unsupported and invites another typed request. Typed `yes` never grants consequential approval. Arbitrary dates, providers, people, music and phrasing are not a functioning AI capability.

## Checks

```bash
node prototypes/stage-1/model.test.mjs
node prototypes/stage-1/scheduler.test.mjs
node prototypes/stage-1/cloud.test.mjs
node prototypes/stage-1/serve.test.mjs
node prototypes/stage-1/browser-check.mjs
node prototypes/stage-1/runtime-browser-check.mjs
python3 scripts/validate-docs.py
python3 scripts/cockpit.py --check
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/check_handoff.py --base origin/main --head HEAD
git diff --check
```

The browser check uses an already installed Chromium at /usr/bin/chromium and Node's built-in WebSocket/CDP transport. Set GRANNY_CHROMIUM to an existing executable if needed; do not install dependencies implicitly. It launches an isolated temporary browser profile and ephemeral loopback server, closes them afterward, and reports a temporary directory containing synthetic screenshots/results. No user browser profile is read. Sandbox environments may require permission to launch Chromium and listen locally.

The model test can also run under node --test, but this environment's runner summarized the test file as one test. Direct execution prints each individual assertion case and its total. No test result here passes a canonical device or human EVAL.

cloud.test.mjs and runtime-browser-check.mjs use fake-fetch/wire fixtures: they test the frontend, **not real MCP or server-side enforcement**. Actual integrated backend tests must run separately. The browser driver accepts an optional exact existing loopback origin via browser({baseURL}); it never starts or terminates someone else's server in that mode.

## Source ownership

| File | Role |
|---|---|
| [index.html](index.html) | Accessible app/reviewer shell, restrictive content policy |
| [styles.css](styles.css) | Responsive conversation and proposed semantic territory values |
| [fixtures.js](fixtures.js) | Fictional contacts, photo provenance, supplied screens and media metadata |
| [intent.js](intent.js) | Modest documented rule-based request/slot interpretation; no general AI |
| [model.js](model.js) | In-memory conversation/task transitions, approval versions, local preferences |
| [scheduler.js](scheduler.js) | Cancellable bounded demonstration delays and preview expiry |
| [cloud.js](cloud.js) | Same-origin v1 client: event fencing, exact confirmation, Stop and read-only recovery; no provider key/model calls |
| [app.js](app.js) | Reusable native controls, exact proposed copy and view composition |
| [serve.mjs](serve.mjs) | Local-only allowlisted static server |
| [model.test.mjs](model.test.mjs) | Deterministic simulation regression cases |
| [scheduler.test.mjs](scheduler.test.mjs) | Controlled-clock stale callback, Stop/reset/edit and expiry cases |
| [cloud.test.mjs](cloud.test.mjs) | Deterministic frontend transport/event/approval regressions, not backend evidence |
| [serve.test.mjs](serve.test.mjs) | Exact allowlist, methods, traversal and response-header checks |
| [browser-check.mjs](browser-check.mjs) | Real browser clicks, layout, focus, storage and request checks |
| [runtime-browser-check.mjs](runtime-browser-check.mjs) | Connected rendering with explicit wire fixtures; not MCP integration evidence |
| [browser-driver.mjs](browser-driver.mjs) | Test-only CDP helper; importing/running the helper alone is not a test |

Do not copy this simplified state model into the product runtime as a safety implementation. Production authority, verification and permission boundaries belong in the canonical agent/architecture/safety docs. No package manager, framework or vendor has been selected for the product.

Design changes update the canonical behavior owner if behavior changes, then the prototype, coverage manifest and regression tests. Use the task worktree and Git publication workflow. Rollback is removing/reverting only this isolated prototype directory and its documentation links in a reviewed change; no production integration exists.
