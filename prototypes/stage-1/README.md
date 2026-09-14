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

A dependency-free, conversation-first sandbox for Granny's five MVP workflows, with an optional Qwen conversation experiment. This is **not the Android application, production agent, or T-103 runtime**. Every device action/result is a fictional fixture. Never enter personal data. This task is based on conversation-first parent `387662f`; later parent improvements need reconciliation before integration.

## Run

Use the existing Node runtime (validated with Node 26.8.1):

```bash
node prototypes/stage-1/serve.mjs
```

Open **http://127.0.0.1:4173** on the same computer. Keep the terminal running; Ctrl+C stops it. An optional numeric argument selects another port. This default mode is scripted and makes no model calls. No install/build step is needed.

The server binds only 127.0.0.1 and serves allowlisted runtime assets and two constrained local API routes. It never serves `.env`, source tests, the repository or personal files. Do not bind to 0.0.0.0, deploy, expose through a tunnel or add analytics.

## Optional Qwen mode

```bash
node --env-file=/absolute/path/to/private/.env prototypes/stage-1/serve.mjs 4180 --cloud
```

The env file contains `OPENROUTER_API_KEY`; [.env.example](../../.env.example) is a blank template, not a key file to publish. In a worktree, point at your existing private file. The key stays in the Node process. Open http://127.0.0.1:4180 and select **Menu → AI mode** to read/accept the disclosure. Only then do typed synthetic requests leave the machine. Normal page load is free/offline apart from loading local assets.

[Qwen setup, limits and evidence](../../docs/08-research/openrouter-qwen-prototype.md) owns the full contract: 20 requests per server process, six/minute, one concurrent, 768 output tokens, constrained pricing/privacy, no automatic retry. Availability and exact task wording are not yet reliable enough to expand autonomy. Model proposals require local review; cloud mode never sends messages or controls Android.

## Review

- Home has one conversation composer; secondary controls live in Menu, not feature tiles.
- Scripted mode uses the local intent parser; cloud mode proposes a simulated task for explicit review. Message bodies and aliases are editable locally.
- Talk uses a sample transcript, never the microphone.
- Local tasks progress through a bounded simulation scheduler; clarification and consequential previews wait for the person. Stop rejects stale callbacks.
- Add `?review=1` to the URL for failure/expiry/clock/scale controls. These are reviewer tools, not product controls.
- Normal messaging ends at **Draft opened. Not sent.** The separately labeled admitted-send review is hypothetical, not an approved integration.
- Settings and history work in tab memory. No persistent browser storage, microphone, screen capture, speech output, real media or send API is used. Only opt-in cloud mode uses OpenRouter; clearing the tab does not delete provider-held data.

Start with the [review script and coverage/gaps](../../docs/02-design/browser-prototype.md). English, name, layout and grayscale styling are proposals.

## Checks

```bash
node --test --test-isolation=none prototypes/stage-1/openrouter.test.mjs prototypes/stage-1/serve.test.mjs prototypes/stage-1/model.test.mjs prototypes/stage-1/scheduler.test.mjs
node prototypes/stage-1/cloud-browser-check.mjs
python3 scripts/validate-docs.py
python3 -m unittest discover -s scripts -p 'test_*.py'
git diff --check
```

The browser check uses an already installed Chromium at /usr/bin/chromium and Node's built-in WebSocket/CDP transport. Set GRANNY_CHROMIUM to an existing executable if needed; do not install dependencies implicitly. It launches an isolated temporary browser profile and ephemeral loopback server, closes them afterward, and reports a temporary directory containing synthetic screenshots/results. No user browser profile is read. Sandbox environments may require permission to launch Chromium and listen locally.

These checks use a stub provider and make no paid calls. The inherited browser-check.mjs still targets the former tile UI at this parent commit; the active conversation session owns its replacement. Run that session's final suite after reconciliation. No prototype test passes a canonical device or human EVAL.

## Source ownership

| File | Role |
|---|---|
| [index.html](index.html) | Accessible app/reviewer shell, restrictive content policy |
| [styles.css](styles.css) | Responsive layout and proposed grayscale semantic CSS values |
| [model.js](model.js), [scheduler.js](scheduler.js) | Finite fictional task state, bounded progression and invalidation |
| [app.js](app.js) | Reusable native controls, exact proposed copy and view composition |
| [serve.mjs](serve.mjs) | Loopback-only static assets and origin-checked opt-in API |
| [openrouter.mjs](openrouter.mjs), [cloud.js](cloud.js) | Server-only provider adapter and cancelable browser conversation transport |
| [model.test.mjs](model.test.mjs) | Deterministic simulation regression cases |
| [openrouter.test.mjs](openrouter.test.mjs), [cloud-browser-check.mjs](cloud-browser-check.mjs) | Secret, consent, limit, proposal and cancellation regressions, no paid calls |
| [qwen-smoke.mjs](qwen-smoke.mjs) | Explicit --live synthetic paid smoke; never CI |

Do not copy this simplified state model into the product runtime as a safety implementation. Production authority, verification and permission boundaries belong in the canonical agent/architecture/safety docs. No package manager, framework or vendor has been selected for the product.

Design changes update the canonical behavior owner if behavior changes, then the prototype, coverage manifest and regression tests. Use the task worktree and Git publication workflow. Rollback is removing/reverting only this isolated prototype directory and its documentation links in a reviewed change; no production integration exists.
