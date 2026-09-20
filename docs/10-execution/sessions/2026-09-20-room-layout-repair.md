---
title: "Session — responsive room layout repair"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, prototype]
related:
  - ../backlog.md
  - ../../02-design/browser-prototype.md
  - ../../02-design/mockups/2026-09-20-room-layout-repair/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/explicit-scroll-row-home
next_action: "Simon reviews the responsive hero/composer repair; mixed-code main integration remains separate."
changed_paths:
  - prototypes/stage-1/app.js
  - prototypes/stage-1/index.html
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/rooms-browser-check.mjs
  - prototypes/stage-1/room-layout-browser-check.mjs
  - prototypes/stage-1/README.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/2026-09-20-room-layout-repair/README.md
  - docs/02-design/mockups/2026-09-20-room-layout-repair/kitchen-hero.png
  - docs/02-design/mockups/2026-09-20-room-layout-repair/kitchen-chat.png
  - docs/02-design/mockups/2026-09-20-room-layout-repair/home-hidden.png
  - docs/02-design/mockups/2026-09-20-room-layout-repair/kitchen-short-composer.png
  - docs/02-design/mockups/2026-09-20-room-layout-repair/narrow-composer-focus.png
---

# Responsive room layout repair

## Scope and authority

Simon requested a responsive hero fade without rectangular boundaries,
uncropped room-chat portraits, normal-flow composer spacing without overlap,
a continuous bubble pointer, properly centered Rooms after Home Hide, and
room-local continuation content. This is a bounded T-119 repair, not a new
Home design, room concept or native implementation.

Continued the clean existing dedicated worktree
`/home/lgtw/Work/granny-worktrees/explicit-scroll-row-home`, dependent on
`1be55b9548a61785f14b95d9aa5c6cf319ab07d6`. Inspected primary status, worktrees,
origin and fetched main; primary now points at `6f5896d` with unrelated
untracked design/notes files. No primary or private Obsidian edits were made.

## Causes and implementation

- Fixed percentage-width plus 350/360px height created an inset image crop.
  Replaced with full content-section bounds, proportional masks, and natural
  chat portrait aspect ratio. Background cover remains undistorted, while
  chat uses contain. No source assets were modified.
- Room composer was relative, not fixed, but `margin-top:auto` consumed spare
  viewport height. Removed that spacer and explicitly retained normal flow
  with a 1em content gap. Global/Home shell behavior is otherwise retained.
- Separate form border and tail SVG overlapped. Replaced them with one closed
  measured SVG contour, with a matching separated focus contour. Semantic
  form layout and textarea remain unchanged; no seam-cover overlay exists.
- Hidden continuation left the two-column Home grid active. The hidden state
  now uses one centered region, preserving real overflow and written controls.
- Existing continuations already resolve collection/item IDs inside the
  active room. Added tests across all six rooms; no global reminder, inferred
  history or cross-room data is introduced.

Reused all room fixture/rendering/state, search/source/creation, safe global
workflows, focus logic and local-only server/CSP. Removed only the obsolete
fixed artwork geometry and two-part bubble border construction.

Lead made all edits and visually inspected baseline and repaired screens.
Terra's read-only audit independently identified fixed art boxes, auto margin,
two-column Hide layout and two-border seam, and suggested geometry assertions.
No delegated production edits or additional agents. Lifecycle/design-handoff,
task-slice and UI-craft guided isolation, bounded scope and accessible rendered
review; they do not confer native conformance or product-gate acceptance.

## Evidence and limits

[Screenshots](../../02-design/mockups/2026-09-20-room-layout-repair/README.md)
include expanded hero/chat, hidden Home, short viewport and narrow focused
composer. New `room-layout-browser-check.mjs`: 130 passing assertions.
An old Rooms assertion expected a tiny separate tail bounding box; adapted
to verify the whole contour extends below the form and stays in its wrapper.
The new test also geometrically checks that no border crosses the pointer mouth.

Final checks all passed:

- `node prototypes/stage-1/room-layout-browser-check.mjs`: 130 assertions;
  independently rerun by the read-only Terra reviewer.
- `node prototypes/stage-1/home-browser-check.mjs`: 158 assertions.
- `node prototypes/stage-1/rooms-browser-check.mjs`: 357 assertions.
- `node prototypes/stage-1/browser-check.mjs`: 132 assertions/five workflows.
- `node prototypes/stage-1/runtime-browser-check.mjs`: 37 wire-fixture checks.
- `node prototypes/stage-1/model.test.mjs`: 67 tests.
- `node prototypes/stage-1/scheduler.test.mjs`: 7 tests.
- `node prototypes/stage-1/cloud.test.mjs`: 27 tests.
- `node prototypes/stage-1/serve.test.mjs`: 1 allowlist test.
- `python3 scripts/cockpit.py --write` / `--check`: 64 records, fresh snapshot.
- `python3 scripts/validate-docs.py`: zero errors.
- `python3 -m unittest discover -s scripts -p 'test_*.py'`: 47 tests.
- `git diff --check`: clean; commit-range handoff checked before push.

Terra's final read-only rendered review found no regression in hero fade,
uncropped portrait, normal-flow spacing, pointer/focus or Hide centering.
Android dp, IME, TalkBack/switch and human evidence remain unrun; no new
network/persistence/microphone or production integration occurred.

## Handoff

Preview remains `http://127.0.0.1:4173`; scoped branch publication is required,
not mixed-code main merge. Exact delivery commit is available in this record's
Git history. Next review is the hero fade and flow spacing across Simon's
tablet-sized browser windows, not another redesign of Home.
