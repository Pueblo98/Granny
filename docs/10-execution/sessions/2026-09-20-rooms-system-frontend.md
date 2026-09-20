---
title: "Rooms system fictional frontend slice"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, prototype, rooms]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex lead with Terra audits
branch: feature/explicit-scroll-row-home
next_action: Simon reviews the Rooms-system checkpoint; mixed-code main integration needs separate authority
related:
  - ../backlog.md
  - ../../../prototypes/stage-1/README.md
changed_paths:
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/01-full-rooms-library.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/02-search-all-rooms.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/03-all-items-and-unfiled.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/04-create-room.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/05-rename-and-purpose.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/06-organize-item.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/07-move-item-undo.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/08-archive-room.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/09-restore-room.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/10-delete-room-only.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/11-delete-underlying-items.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/12-cross-room-source.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/13-sensitive-source-denied.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/14-empty-library.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/15-loading.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/16-offline.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/17-missing-artwork.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/18-narrow.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/19-large-text.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/20-combined-scale.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/21-short.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/22-art-disabled.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/23-unfiled.png
  - docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/README.md
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/index.html
  - prototypes/stage-1/room-create.js
  - prototypes/stage-1/room-dialog.js
  - prototypes/stage-1/room-fixtures.js
  - prototypes/stage-1/room-library.js
  - prototypes/stage-1/room-ui.js
  - prototypes/stage-1/rooms-browser-check.mjs
  - prototypes/stage-1/rooms-store.js
  - prototypes/stage-1/rooms-store.test.mjs
  - prototypes/stage-1/rooms-system-browser-check.mjs
  - prototypes/stage-1/rooms-system-review.mjs
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/styles.css
---

# Rooms system frontend

## Scope and continuity

Simon authorized the 17-reference fictional Rooms-system slice under T-119.
Continue the existing dedicated worktree and branch from inspected
`67abdb2108a7b2a06cf812fd48b4e925c130de3a`. Freshly fetched origin/main
`497c4d1a5ca6981c5c7dceee7204d46505bf426f` is already an ancestor; all new
design references are present. Primary checkout and private Obsidian state
remain untouched. Publication is authorized; mixed-code main merge is not.

Skills used: session lifecycle for continuity/handoff; design handoff for
SCR-016/017, CMP-003/007/011 and accessibility authority; task slice in implement
mode for fictional scope; UI craft in Harden mode for responsive/adverse states.
No persistence, real private content, external retrieval, provider, microphone,
Android, generated art or dependencies are authorized.

## Pre-edit audit and reuse inventory

- Keep app.js Home row, composer SVG contour/focus, task model, scheduler,
  Stop/preview/result and optional connected-demo fences. `homeView` owns place;
  speech/task state is temporary and navigation resolves work before leaving.
- Keep room-ui.js identity, atmosphere measurement, collection/detail and
  local conversation rendering. Adapt them to stable canonical item IDs and
  membership projections, preserving current Room on source inspection.
- Adapt library's broad semantic entry/result controls and failed-image slots.
  Replace private library route/query ownership with controlled durable places.
- Replace room-create.js five-step wizard with a required-name/purpose dialog
  shared with rename. Remove its obsolete step/template styles and callers only
  after new coverage works.
- Replace nested mutable item ownership and shallow fixture reset with a pure
  in-memory canonical store. Membership changes must not delete items.
- Add one dialog family and one persistent receipt region; never stack dialogs.
  Keep originating focus/scroll and native Escape/Tab containment.
- Existing server serves an exact loopback allowlist; CSP blocks third-party
  assets/media/fonts. Reviewer controls exist only with review query enabled.
  No browser storage or microphone is used.

Lead read authority and inspected all 17 individual references at original
detail plus comparison, selected Home and Harbour board. Baseline rendered
Home/library/Kitchen/direct collection/detail/conversation/narrow/200% evidence:
`/tmp/granny-conversation-review-2x1f3o`. All seven shared states and constrained
height were exercised by the existing shared-state capture in
`/tmp/granny-conversation-review-lgGZsX`. Existing captures remained unchanged.

Parallel Terra audits: code/state inventory, visual/accessibility comparison,
and deterministic/adverse test coverage. Useful findings: nested items cannot
support truthful Unfiled; shallow reset risks fixture mutation; current library
hides composer; old wizard conflicts with the new simple create surface;
cross-room source must not switch atmosphere. Test auditor ran baseline Rooms
suite: 357 assertions passed. Lead retains product interpretation and shared
file integration; one agent is assigned only new store and pure test files.

## Evidence and handoff

Implemented the complete 17-family fictional slice. `rooms-store.js` separates
canonical item identity from memberships, with revision-bound exact Undo and
deep reset. `room-ui.js` retains the single room renderer and owns temporary
management callbacks; `room-dialog.js` contains focus and remembers the actual
invoking control. `app.js` still owns durable place and shared task state.
Search/list return state keeps query, focus and scroll. No new task state is a
Room route, and active work still resolves before navigation.

The old wizard and its dead CSS were removed, not kept alongside a second
creation flow. Library-specific nested item/search ownership was replaced.
The Home composer, contour, six-room atmosphere, 48 symbols, model, scheduler,
cloud client and five scripted workflows were retained. `serve.mjs` adds only
two explicit local script paths; no CSP relaxation, asset generation or package
change occurred. Deletion here is explicit fictional tab-state behavior; no
repository assets, user files or external originals were deleted.

Delegated exclusive files: Terra code auditor implemented the pure store/tests;
then the temporary screenshot harness. Terra test auditor added the new browser
suite and migrated the existing Rooms suite. Lead reviewed their complete
diffs, hardened reset/duplicate/membership behavior and expanded browser checks
from 45 to 61. Visual auditor remained read-only. Its actionable findings led
to fixed portrait intrinsic sizing, consequence-labelled organization rows and
narrow header clearance. Lead also repaired creation from All items, actual
invoker focus return, source-inspection cleanup and Clear-button shrinkage.
No agent published, merged or changed authority.

### Executed checks

All commands below ran from the task worktree. Counts are assertions/tests,
not production capability or user evidence.

| Command | Result |
|---|---|
| `node prototypes/stage-1/model.test.mjs` | PASS 67 |
| `node prototypes/stage-1/scheduler.test.mjs` | PASS 7 |
| `node prototypes/stage-1/cloud.test.mjs` | PASS 27 |
| `node prototypes/stage-1/serve.test.mjs` | PASS 1 |
| `node prototypes/stage-1/rooms-store.test.mjs` | PASS 58 assertions |
| `node prototypes/stage-1/rooms-system-browser-check.mjs` | PASS 61 |
| `node prototypes/stage-1/rooms-browser-check.mjs` | PASS 350 |
| `node prototypes/stage-1/home-browser-check.mjs` | PASS 158 |
| `node prototypes/stage-1/room-layout-browser-check.mjs` | PASS 143 |
| `node prototypes/stage-1/shared-state-browser-check.mjs` | PASS 129 |
| `node prototypes/stage-1/browser-check.mjs` | PASS 137 |
| `node prototypes/stage-1/runtime-browser-check.mjs` | PASS 37, wire fixtures only |
| `node prototypes/stage-1/rooms-review.mjs` | PASS, existing six-room captures |
| `node prototypes/stage-1/rooms-system-review.mjs` | PASS 23 captures, zero browser errors |
| `python3 scripts/validate-docs.py` | PASS, local documentation only |
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | PASS 47; expected invalid-revision fixture prints a Git diagnostic |
| `python3 scripts/cockpit.py --write` | PASS, regenerated only derived snapshot |
| `python3 scripts/cockpit.py --check` | PASS, 87 records |
| `python3 scripts/check_handoff.py --base origin/main` | PASS, scoped working-tree coverage |
| `git diff --check` | PASS |

Legacy test migration is intentional: exact latest purpose strings, explicit
Search route and simple required-name/purpose sheet replace superseded copy,
inline search and five-step template assumptions. Six-room/48-symbol, reset,
safety, no-capture/storage and responsive assertions remain. Initial failures
were addressed rather than treated as pre-existing exceptions.

Final screenshots and source-frame mapping are in the
[checkpoint review](../../02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/README.md).
Raw capture run: `/tmp/granny-conversation-review-M1GW6w`.
Browser: Chromium 151.0.7922.173. Representative checks cover 1440×900/1000,
840, 600 and 360 widths, 480px constrained height, 200% and combined 300% text,
native keyboard traversal/Escape, no-image identity, focus restoration and
normal-flow composer non-overlap. Existing reduced-motion rules remain; no
essential animation was added. An additional 840×600 Chromium forced-colors and
reduced-motion emulation check passed six semantic targets, visible focused
Create and a scrollable dialog. Grayscale meaning is preserved by written
labels, consequences and outcomes; no human grayscale comprehension test ran.

New surfaces use canonical blue roles; the previously approved brighter
Home/Room shell is not silently redesigned. Library portrait aspect ratios,
system-font fallback and longer scrollable sheets differ deliberately from the
raster. Custom room appearance is a labelled placeholder. Underlying item
deletion is explicitly non-undoable in memory; Reset/reload restores fixtures.
Sensitive-source behavior is a safe-label simulation, not real access policy.
Private payloads are absent and excluded from browsing. Browser evidence does
not prove Android dp/sp, TalkBack/switch hardware, device/keyboard behavior,
real offline support, external actions, provider retrieval or comprehension.
No real MCP/provider integration run was authorized or performed for this slice.

### Handoff boundary

Worktree: `/home/lgtw/Work/granny-worktrees/explicit-scroll-row-home`.
Task branch: `feature/explicit-scroll-row-home`; publication target is the
[existing scoped branch](https://github.com/Pueblo98/Granny/tree/feature/explicit-scroll-row-home).
The containing commit is the delivery locator; no invented future hash is used.
Mixed-code merge remains unauthorized, so the primary vault is not synchronized.
Concurrent primary work remains untouched. The verified same-worktree preview
server was restarted to load its new allowlist; review at
`http://127.0.0.1:4173/`. This is a local server, not a production service promise.

Next bounded action: Simon reviews the wide portrait field versus the narrow
one-room-per-row library, plus operation wording. No next backend, native or
persistence implementation is implied.
