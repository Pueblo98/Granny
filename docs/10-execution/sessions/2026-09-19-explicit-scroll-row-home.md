---
title: "Session — Explicit Scroll Row Home implementation"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, prototype, accessibility]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../09-decisions/ADR-0016-explicit-home-room-row.md
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../../02-design/browser-prototype.md
record_type: session
session_state: active
record_basis: contemporaneous
agent: Codex
branch: feature/explicit-scroll-row-home
next_action: "Implement and validate the selected Home while preserving the five scripted workflows and local-only security boundary."
changed_paths:
  - prototypes/stage-1/index.html
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/app.js
  - prototypes/stage-1/fixtures.js
  - prototypes/stage-1/assets/room-fitness-placeholder.svg
  - prototypes/stage-1/assets/room-trips-placeholder.svg
  - prototypes/stage-1/assets/room-reading-placeholder.svg
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/serve.test.mjs
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/browser-check.mjs
  - prototypes/stage-1/runtime-browser-check.mjs
  - prototypes/stage-1/README.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/frontend-checkpoint-1/README.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/frontend-checkpoint-1/home-expanded.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/frontend-checkpoint-1/home-narrow-large-text.png
  - docs/10-execution/sessions/2026-09-19-explicit-scroll-row-home.md
---

# Session — Explicit Scroll Row Home implementation

## Scope and authority

Simon authorized the selected Explicit Scroll Row Home checkpoint in the
dependency-free Stage 1 browser prototype. The slice may integrate Home,
review-only fixture states, a fictional Kitchen placeholder, room placeholder
destinations and the vertical `See all rooms` fallback. It does not authorize
the complete Rooms library, room interiors, persistence, real personal data,
network/provider access, production backend work, Android code or Figma edits.

The task starts from integrated `origin/main` commit `4c2a7bc` in the isolated
worktree `/home/lgtw/Work/granny-worktrees/explicit-scroll-row-home`. The dirty
primary checkout and its concurrent Context Rooms asset work remain untouched.

## Pre-edit technical inventory

- Empty Home is static markup in `index.html` (`#welcome`) and is hidden by
  `app.js` `render()` once turns exist or connected mode starts. Thread and
  current-task content are rebuilt inside `#thread` by `render()` and
  `renderRuntime()`; secondary Menu destinations are renderer-owned
  `[data-panel]` task cards selected by `menuPanel`.
- The persistent `#composer` submits through `newRequest()`. It accepts direct
  typed follow-ups, protects unfinished work with the confirmation dialog and
  delegates task truth to `model.js`. `openTalk()` opens an explicitly simulated
  editable transcript dialog; it never requests media access. Active work uses
  the stable top `#stop-dock`, while render preserves focus keys, input
  selection and scroll position.
- `model.js` `create()` owns in-memory task, history, scale, aliases,
  preferences and reviewer fixtures. `reset` recreates the complete state with
  monotonic IDs; `clearSession` clears conversation/player while retaining
  explicit preferences. Reloading clears the tab state; there is no web
  persistence.
- Reviewer mode is gated by `?review=1`. It appends `#review-panel` after the
  participant shell, changes fixture/model state through explicit controls,
  applies a separate review scale and is absent from participant DOM.
- `index.html` CSP permits only self scripts/styles/images/data images and self
  connections. `serve.mjs` is loopback-only, path-allowlisted and sends a
  Permissions Policy that disables microphone, camera and geolocation. Browser
  checks assert loopback-only requests and absence of local/session storage,
  IndexedDB, service workers and CacheStorage.
- `browser-check.mjs` protects the five scripted workflows: exact fictional
  message/person/channel preview and invalidation; photo provenance/viewer;
  supplied-screen explanation; silent music pause/resume; and local text-size
  preview/apply/restore. It also covers failure fixtures, active Stop, focus and
  scroll retention, participant/reviewer separation, responsive geometry and
  no egress/persistence. `runtime-browser-check.mjs` separately protects the
  optional connected local-demo boundary.

## Initial implementation boundary

**Reuse:** `model.js`, scheduler/runtime integration, local fixtures and SVG
asset serving, safety previews, Stop semantics, dialogs, menu destinations,
focus/scroll restoration, local server/CSP and the five workflow tests.

**Adapt:** the static header, welcome visibility, composer markup/styles,
renderer empty/thread split, Menu presentation, reviewer controls and browser
geometry assertions so the accepted Home states are deterministic.

**Replace:** the boxed 900px white app shell, generic grey palette, old
invitation/introduction card, sticky shadowed footer and obsolete visual
territory comparison with the Linen/Harbour Blue hierarchy, Round composer,
compact continuation and open room portrait row.

**Remove:** duplicate or unreachable in-scope CSS produced by the old visual
territories and rejected Home composition, after preserving every caller and
behavioral assertion. No workflow, safety, connected-demo or security contract
will be removed for visual simplicity.

The smallest coherent refactor keeps the state model and connected-demo
renderers intact, introduces one renderer-owned empty-Home surface around the
existing composer, and adds a small in-memory Home view/fixture controller in
`app.js`. Conversation and Menu content continue to use the proven thread
renderer; placeholder destinations remain local, clearly fictional and
reversible.

## Baseline evidence

The pre-edit prototype was inspected at 1280×800 and 360×720, with Menu open,
Talk open and the message workflow at `clarify-person`. Temporary screenshots
in `/tmp/granny-conversation-review-FeTOqw/` confirm a functional but cramped,
generic grey/white composition: the introduction card is clipped by the sticky
composer at expanded height, and the selected Harbour Blue hierarchy, compact
continuation and room row are absent.

Pre-edit executable baseline from the integrated checkpoint passed 67 model,
7 scheduler, 27 cloud, one server, 130 browser and 37 runtime-browser checks.

## Agent assignments

Three read-only Terra audits run in parallel before production edits:

- `legacy_ui_audit`: rendering/state boundary and keep/adapt/replace/remove
  audit with file/function references.
- `visual_access_audit`: selected PNG/Harbour Blue, SCR/CMP, accessibility and
  responsive fidelity checklist.
- `test_interaction_audit`: deterministic Home/state/security coverage and
  regression-risk audit of the existing browser driver/checks.

The lead agent retains product interpretation, all shared frontend edits,
integration review, authoritative validation and final handoff.

## Validation

Pending implementation and review.

## Handoff

Session active.
