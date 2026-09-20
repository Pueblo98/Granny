---
title: "Session — room content and artwork separation"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, prototype]
related:
  - ../backlog.md
  - ../../02-design/browser-prototype.md
  - ../../02-design/mockups/2026-09-20-room-content-separation/README.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: feature/explicit-scroll-row-home
next_action: "Integrated through PR #44 and accepted within the current frontend iteration; no layout revision is queued."
changed_paths:
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/room-ui.js
  - prototypes/stage-1/room-layout-browser-check.mjs
  - prototypes/stage-1/README.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/2026-09-20-room-content-separation/README.md
  - docs/02-design/mockups/2026-09-20-room-content-separation/kitchen-hero.png
  - docs/02-design/mockups/2026-09-20-room-content-separation/kitchen-chat.png
---

# Content and artwork separation

## Scope, cause and implementation

Simon accepted the larger artwork size but requested less interference behind
Browse labels and a constrained left conversation column. Continued the clean
dedicated `explicit-scroll-row-home` worktree from
`a97de45e32310e0f69e7b868df824a5f431b38ea`; fetched origin, preserved primary
changes and private Obsidian state. This is a bounded T-119 presentation fix,
not room data, policy, backend or native implementation.

The prior masks used viewport percentages unrelated to controls and a 72%
conversation width intruded into the art. Replaced that relationship with a
3:2 content/art grid plus gutter; a ResizeObserver and render callback measure
the actual reading edge and collection-symbol start for mask boundaries.
Overview horizontal fading holds detail farther right, and vertical fading
finishes before symbol controls. Image sizes, normal-flow composer, single
bubble contour, Home Hide and room-local data remain unchanged. Narrow/large
text returns to full-width content with artwork removed.

Lead owns all edits and inspected before/after renders. Terra's read-only
review found clean content separation but cramped source actions; lead changed
those actions to a wrapping row beneath source text and reran checks.
Lifecycle/design-handoff/UI-craft guidance preserved scoped delivery and
accessible reflow. No shared-file agent edits or new assets.

## Evidence

- `node prototypes/stage-1/room-layout-browser-check.mjs`: 143 assertions,
  including fade-to-symbol bounds and reading-column/art alignment.
- `node prototypes/stage-1/home-browser-check.mjs`: 158 assertions.
- `node prototypes/stage-1/rooms-browser-check.mjs`: 357 assertions.
- `node prototypes/stage-1/browser-check.mjs`: 132 workflow assertions.
- `node prototypes/stage-1/runtime-browser-check.mjs`: 37 wire fixtures.
- `node prototypes/stage-1/model.test.mjs`: 67 tests.
- `node prototypes/stage-1/scheduler.test.mjs`: 7 tests.
- `node prototypes/stage-1/cloud.test.mjs`: 27 tests.
- `node prototypes/stage-1/serve.test.mjs`: 1 allowlist test.
- `python3 scripts/cockpit.py --write` / `--check`: fresh snapshot, 66 records.
- `python3 scripts/validate-docs.py`: zero errors.
- `python3 -m unittest discover -s scripts -p 'test_*.py'`: 47 tests.
- `git diff --check`: clean; commit-range handoff checked before publication.

[Screenshots](../../02-design/mockups/2026-09-20-room-content-separation/README.md)
are separate from earlier evidence. Android dp/IME, TalkBack/switch and human
comprehension remain unrun. No persistence, microphone, provider or real data.

## Handoff

Preview remains `http://127.0.0.1:4173`. Scoped task-branch push is not a main
merge; exact delivery commit is available in this record's Git history.
