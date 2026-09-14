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

A dependency-free, local-only interaction sandbox for Granny's five MVP workflows. This is **not the Android application, production agent, or T-103 runtime**. Every external action/result is a fictional fixture. Never enter personal data.

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
- Menu reveals the secondary settings/help/privacy/history functions. Data lives in this tab's memory; no browser storage, account or provider exists. Do not enter personal data.
- Open **http://127.0.0.1:4173/?review=1** for separate reviewer controls. Participant mode never inserts these controls into its DOM/focus order. Reviewer choices expose fixtures, outcomes, timing/expiry, enlarged text and proposed visual territories; hypothetical sends are explicitly simulations.

Start with the [review script and coverage/gaps](../../docs/02-design/browser-prototype.md). English, name, interaction and neutral/Open Day/Bright Signal styling remain proposals. No final font, palette or public name is selected.

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
node prototypes/stage-1/serve.test.mjs
node prototypes/stage-1/browser-check.mjs
python3 scripts/validate-docs.py
python3 scripts/cockpit.py --check
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/check_handoff.py --base origin/main --head HEAD
git diff --check
```

The browser check uses an already installed Chromium at /usr/bin/chromium and Node's built-in WebSocket/CDP transport. Set GRANNY_CHROMIUM to an existing executable if needed; do not install dependencies implicitly. It launches an isolated temporary browser profile and ephemeral loopback server, closes them afterward, and reports a temporary directory containing synthetic screenshots/results. No user browser profile is read. Sandbox environments may require permission to launch Chromium and listen locally.

The model test can also run under node --test, but this environment's runner summarized the test file as one test. Direct execution prints each individual assertion case and its total. No test result here passes a canonical device or human EVAL.

## Source ownership

| File | Role |
|---|---|
| [index.html](index.html) | Accessible app/reviewer shell, restrictive content policy |
| [styles.css](styles.css) | Responsive conversation and proposed semantic territory values |
| [fixtures.js](fixtures.js) | Fictional contacts, photo provenance, supplied screens and media metadata |
| [intent.js](intent.js) | Modest documented rule-based request/slot interpretation; no general AI |
| [model.js](model.js) | In-memory conversation/task transitions, approval versions, local preferences |
| [scheduler.js](scheduler.js) | Cancellable bounded demonstration delays and preview expiry |
| [app.js](app.js) | Reusable native controls, exact proposed copy and view composition |
| [serve.mjs](serve.mjs) | Local-only allowlisted static server |
| [model.test.mjs](model.test.mjs) | Deterministic simulation regression cases |
| [scheduler.test.mjs](scheduler.test.mjs) | Controlled-clock stale callback, Stop/reset/edit and expiry cases |
| [serve.test.mjs](serve.test.mjs) | Exact allowlist, methods, traversal and response-header checks |
| [browser-check.mjs](browser-check.mjs) | Real browser clicks, layout, focus, storage and request checks |
| [browser-driver.mjs](browser-driver.mjs) | Test-only CDP helper; importing/running the helper alone is not a test |

Do not copy this simplified state model into the product runtime as a safety implementation. Production authority, verification and permission boundaries belong in the canonical agent/architecture/safety docs. No package manager, framework or vendor has been selected for the product.

Design changes update the canonical behavior owner if behavior changes, then the prototype, coverage manifest and regression tests. Use the task worktree and Git publication workflow. Rollback is removing/reverting only this isolated prototype directory and its documentation links in a reviewed change; no production integration exists.
