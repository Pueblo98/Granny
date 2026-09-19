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
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/frontend-checkpoint-1/README.md
  - ../../02-design/browser-prototype.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: feature/explicit-scroll-row-home
next_action: "Review the published task branch and checkpoint evidence; mixed code/documentation integration still requires current authority."
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
  - docs/10-execution/cockpit-snapshot.md
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

Useful first-wave findings were reconciled rather than copied verbatim:

- All three audits agreed that `model.js`, scheduler/cloud boundaries, Stop,
  dialogs, Menu destinations, local server/CSP and workflow regressions were
  sound foundations, while the old boxed shell, default introduction card,
  sticky footer and grey/territory styling were rejected presentation.
- The visual/access review required real measured overflow, visible end-state
  reasons, a direct narrow/large-text list, removable art and unclipped violet
  focus. The selected raster was explicitly not treated as proof that three
  visible rooms overflow.
- The test review recommended an isolated Home browser suite so the long
  workflow/safety suite remained intact. It also identified physical keyboard,
  range announcement, image-failure, reviewer isolation, 300% geometry and
  no-capture/no-persistence cases.

## Implementation

Implementation commit `e5d5790` keeps the proven task model and adds a small
renderer-owned Home state around it:

- Rebuilt the idle shell with the selected invitation, Harbour Blue/Linen
  roles and broad Round composer. Talk and Send remain written native controls;
  the paper-plane mark is decorative. Empty Send reports native validation and
  a polite explanation without creating work.
- Added one in-memory Kitchen continuation. Hide removes it until reload/full
  reset and returns focus to the composer. Kitchen is an honest fictional
  placeholder with no saved soup, history or persistence.
- Added Fitness, Trips and Reading as broad semantic room buttons with live
  names/purposes and hand-authored, decorative local SVG placeholders. Image
  failure removes the art only.
- Measured row overflow from rendered geometry. Written controls are hidden
  when everything fits; true overflow exposes focusable `aria-disabled`
  first/middle/last states, a visible reason and exactly one polite foreground
  announcement per movement. Pointer/wheel scrolling remains supplementary.
- Added a vertical `See all rooms` list and labelled room placeholders. Direct
  routes restore Home/source focus; a room opened from the list can return to
  the same list item before returning Home.
- Kept composer-first source/keyboard order while placing the continuation and
  row above it at expanded landscape. At 700 CSS pixels or less, 200% app text
  or combined 300% text, Rooms become a direct vertical list and the entire
  page remains ordinarily scrollable.
- Replaced the obsolete Neutral/Open Day/Bright Signal reviewer selector with
  deterministic Home fixtures: continuation hidden, no rooms, one room,
  all-fit, forced overflow and portrait failure. Participant mode contains no
  reviewer DOM.
- Extended only the exact static-server allowlist for the three placeholder
  assets. CSP, Permissions Policy, loopback binding, no-write routes and
  no-storage/no-external-request contracts remain in force.

### Final reused / adapted / replaced / removed inventory

**Reused:** `model.js`, `scheduler.js`, `cloud.js`, intent parsing, task/result
renderers, exact confirmation/expiry/Stop logic, dialogs, Menu destinations,
focus-key/selection retention and the five scripted workflows. Their 67 model,
7 scheduler, 27 client, 132 workflow-browser and 37 connected wire-fixture
checks remain active.

**Adapted:** `index.html` shell/composer semantics; `app.js` empty/thread/Menu
composition, focus return and scroll handling; `fixtures.js` local Home data;
reviewer controls; static asset allowlist; README/handoff documentation; and
the existing browser check's idle/tokens assertions.

**Replaced:** the old boxed 900-pixel white shell, grey palette, generic
rectangular sticky composer and first-run visual emphasis with the spacious
Linen canvas, selected hierarchy and responsive Round writing surface. The
stylesheet was refactored coherently rather than layering duplicate rules over
the rejected presentation.

**Removed:** obsolete Open Day/Bright Signal executable territory CSS,
reviewer selector and screenshot loop; default display of the competing
introduction card; shadow/gradient footer styling; and the image-failure
fallback frame. The Introduction, privacy/reset, preferences, history, help,
connected demo and every scripted/safety path remain reachable and tested.

## Second-wave review

Three Terra agents independently reviewed the completed diff without editing:

- Visual comparison found no blocker and confirmed the selected hierarchy,
  honest all-fit row and 300% vertical fallback. The lead removed the native
  textarea resize grip, refined the balloon-tail join and used opaque Surface.
  Missing polished continuation art and exact fonts remain documented limits,
  not invented assets.
- Accessibility/interaction review confirmed source order, Stop semantics,
  native room targets, image failure and focus return. Its actionable findings
  were resolved by making first/end reasons visible, adding list-context
  return, directly describing Talk as simulated and testing reduced motion.
- Regression review confirmed the suite was substantive but requested stronger
  proof. The Home check now asserts actual `scrollLeft` and foreground-range
  changes, native keyboard activation, fresh-session continuation restoration,
  all-fit geometry, static-only paths/no API, cookies, delivered CSP and
  microphone/speech interception from document initialization.

No sub-agent edited shared production files, spawned another agent, published
a branch or made product decisions.

## Review evidence

[Frontend checkpoint 1](../../02-design/mockups/2026-09-19-harbour-blue-home/frontend-checkpoint-1/README.md)
embeds a 1440×900 participant Home and a full-page 600-pixel-wide combined
300% text state, both captured from implementation commit `e5d5790`. It records
fixture state, visual comparison, placeholder inventory, exact checks and
known limits without overwriting the selected source.

## Owner review refinement

Simon reviewed the locally served checkpoint before integration. On request,
the redundant bottom-of-page prototype sentence was removed from Home; the
same fictional-data, no-recording, no-account and no-sending disclosure remains
reachable through Introduction and Menu → Privacy and reset. The Round
composer tail was moved beyond the 44-pixel corner arc and its white join mask
was widened so the corner outline no longer intersects the tail. The live
review server remained loopback-only. The Home browser suite now protects the
absence of the redundant footer and the retained disclosure route.

## Validation

Final validation used the repository's existing Node 26.8.1, Chromium
151.0.7922.173 and Python environment; no dependency was installed:

- `node prototypes/stage-1/model.test.mjs` — 67 passed.
- `node prototypes/stage-1/scheduler.test.mjs` — 7 passed.
- `node prototypes/stage-1/cloud.test.mjs` — 27 passed.
- `node prototypes/stage-1/serve.test.mjs` — 1 passed, including CSP,
  Permissions Policy, exact allowlist, traversal and write-method rejection.
- `node prototypes/stage-1/home-browser-check.mjs` — 157 assertions, zero
  browser errors, expected static loopback requests only.
- `node prototypes/stage-1/browser-check.mjs` — 132 assertions, zero browser
  errors; all five scripted workflows and active Stop passed.
- `node prototypes/stage-1/runtime-browser-check.mjs` — 37 assertions, zero
  browser errors; frontend wire fixtures only, not real MCP/backend evidence.
- `python3 scripts/cockpit.py --write` and `--check` — passed after this session
  was marked complete.
- `python3 scripts/validate-docs.py` — passed with zero errors.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — 47 passed.
- `python3 scripts/check_handoff.py --base origin/main --head HEAD` — passed.
- `git diff --check` — passed.

These checks establish browser-fixture behavior only. CSS pixels do not prove
Android dp/sp or physical targets. TalkBack, switch access, native Android
reflow/IME/navigation/Stop, older-adult comprehension, final name/logo/font/art
acceptance and complete Rooms/persistence behavior remain unrun or out of
scope.

## Handoff

The bounded selected-Home checkpoint is complete on
`feature/explicit-scroll-row-home`. The branch is ready for publication and
review, but this mixed code/documentation task is not authorized to merge to
`main`. The dirty primary checkout and its concurrent Context Rooms asset work
were not modified or synchronized.
