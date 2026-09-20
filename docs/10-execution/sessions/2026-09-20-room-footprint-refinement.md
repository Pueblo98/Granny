---
title: "Session — full-width Hide and larger room artwork"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, prototype]
related:
  - ../backlog.md
  - ../../02-design/browser-prototype.md
  - ../../02-design/mockups/2026-09-20-room-footprint-refinement/README.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: feature/explicit-scroll-row-home
next_action: "Integrated through PR #44; Simon accepted the Home/Rooms scrolling and emphasis refinement for now."
changed_paths:
  - prototypes/stage-1/app.js
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/room-layout-browser-check.mjs
  - prototypes/stage-1/README.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/2026-09-20-room-footprint-refinement/README.md
  - docs/02-design/mockups/2026-09-20-room-footprint-refinement/home-hidden.png
  - docs/02-design/mockups/2026-09-20-room-footprint-refinement/kitchen-hero.png
  - docs/02-design/mockups/2026-09-20-room-footprint-refinement/kitchen-chat.png
---

# Full-width Hide and room footprint refinement

## Authority and isolation

Simon's explicit follow-up rejected the remaining empty margin/clipped Trips
after Hide and requested substantially larger overview/chat artwork with
size independent of fading. This is another bounded T-119 visual repair.
Reused the clean dedicated `explicit-scroll-row-home` worktree and branch,
dependent on `e4804e3db7a16af0d0356228d0eafd65ee539334`. Inspected status and
verified Pueblo98/Granny origin, fetched main, preserved unrelated primary
untracked design/notes files and all private Obsidian state. No merge authority
is inferred from publication.

## Changes and review

Removed the previous Hide state's 64rem cap; three room entries now divide
the full available width after gaps. Hide resets scrolling and recomputes
control state. Full-width section and control bounds are asserted; no negative
margin or arbitrary left shift is used. Narrow list and reviewer fixtures stay
unchanged.

Moved the artwork containing block from the padded room section to the outer
page shell. Hero dimensions follow viewport proportions; image width/scale and
mask are separate. Overview art is 115% shell width with proportional cover,
chat art is 60% with natural aspect ratio (formerly 27%). Left/bottom masking
does not shrink the image. Readability, flow composer, bubble contour, source
controls and current-room continuations remain unchanged.

Lead personally compared the Kitchen reference and original backdrop/portrait,
implemented all changes and inspected rendered images. Terra performed a
read-only diff/render review and independently reran all 132 layout assertions;
no concrete regression found. No delegated writes. Lifecycle, task-slice,
design-handoff and UI-craft guided scope/isolation and accessible visual review.

[Review images and asset mismatch](../../02-design/mockups/2026-09-20-room-footprint-refinement/README.md)
are preserved separately; the selected asset's window placement differs from
the raster composition and is not silently redesigned.

## Validation

- `node prototypes/stage-1/room-layout-browser-check.mjs`: 132 assertions.
- `node prototypes/stage-1/home-browser-check.mjs`: 158 assertions.
- `node prototypes/stage-1/rooms-browser-check.mjs`: 357 assertions.
- `node prototypes/stage-1/browser-check.mjs`: 132 assertions, five workflows.
- `node prototypes/stage-1/runtime-browser-check.mjs`: 37 wire-fixture checks.
- `node prototypes/stage-1/model.test.mjs`: 67 tests.
- `node prototypes/stage-1/scheduler.test.mjs`: 7 tests.
- `node prototypes/stage-1/cloud.test.mjs`: 27 tests.
- `node prototypes/stage-1/serve.test.mjs`: 1 allowlist test.
- `python3 scripts/cockpit.py --write` / `--check`: fresh snapshot, 65 records.
- `python3 scripts/validate-docs.py`: zero errors.
- `python3 -m unittest discover -s scripts -p 'test_*.py'`: 47 tests.
- `git diff --check`: clean; commit-range handoff checked before publication.

No backend/provider call, persistence, microphone, new asset or dependency.
Native Android dp/IME, TalkBack/switch and user comprehension remain unrun.

## Handoff

Preview: `http://127.0.0.1:4173`. Delivery commit is in this record's Git
history; task-branch publication is not main integration. Next review is
the now substantially larger artwork and the full-width three-entry Hide state.
