---
title: "Run the Stage 1 browser design prototype"
status: proposed
owner: Simon
last_updated: 2026-09-14
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

The server binds only 127.0.0.1 and serves four allowlisted prototype files. It is a local preview server, not a deployment backend. Do not change it to 0.0.0.0, deploy publicly or add uploads/analytics without a separately reviewed task.

## Review

- Home has all five task shortcuts, Talk and a generic typed-request path.
- Typed requests are routed by an explicit task choice: no hidden AI interpretation. Message bodies and aliases are genuinely editable.
- Talk uses a sample transcript, never the microphone.
- A task pauses at simulated planning/acting/waiting/verifying states. Use **Next simulated step** or **Complete sample outcome** below the app. Those reviewer controls are not proposed product controls.
- Open **Review tools & design notes** to inject a failure, expire a preview, advance the logical clock, or test enlarged text.
- Normal messaging ends at **Draft opened. Not sent.** The separately labeled admitted-send review is hypothetical, not an approved integration.
- Settings and history work in tab memory. Text size applies across screens; reset/reload clears state. No storage, microphone, screen capture, speech output, model call, real media or send API is used.

Start with the [review script and coverage/gaps](../../docs/02-design/browser-prototype.md). English, name, layout and grayscale styling are proposals.

## Checks

```bash
node prototypes/stage-1/model.test.mjs
node prototypes/stage-1/browser-check.mjs
python3 scripts/validate-docs.py
python3 -m unittest discover -s scripts -p 'test_*.py'
git diff --check
```

The browser check uses an already installed Chromium at /usr/bin/chromium and Node's built-in WebSocket/CDP transport. Set GRANNY_CHROMIUM to an existing executable if needed; do not install dependencies implicitly. It launches an isolated temporary browser profile and ephemeral loopback server, closes them afterward, and reports a temporary directory containing synthetic screenshots/results. No user browser profile is read. Sandbox environments may require permission to launch Chromium and listen locally.

The model test can also run under node --test, but this environment's runner summarized the test file as one test. Direct execution prints each individual assertion case and its total. No test result here passes a canonical device or human EVAL.

## Source ownership

| File | Role |
|---|---|
| [index.html](index.html) | Accessible app/reviewer shell, restrictive content policy |
| [styles.css](styles.css) | Responsive layout and proposed grayscale semantic CSS values |
| [model.js](model.js) | Finite design-screen state, fictional data, manual-clock transitions |
| [app.js](app.js) | Reusable native controls, exact proposed copy and view composition |
| [serve.mjs](serve.mjs) | Local-only allowlisted static server |
| [model.test.mjs](model.test.mjs) | Deterministic simulation regression cases |
| [browser-check.mjs](browser-check.mjs) | Real browser clicks, layout, focus, storage and request checks |

Do not copy this simplified state model into the product runtime as a safety implementation. Production authority, verification and permission boundaries belong in the canonical agent/architecture/safety docs. No package manager, framework or vendor has been selected for the product.

Design changes update the canonical behavior owner if behavior changes, then the prototype, coverage manifest and regression tests. Use the task worktree and Git publication workflow. Rollback is removing/reverting only this isolated prototype directory and its documentation links in a reviewed change; no production integration exists.
