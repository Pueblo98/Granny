---
title: "Session — Harbour Blue Home composition round 3"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, mockups]
related:
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/round-3/README.md
  - ../../02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md
  - ../current-milestone.md
  - ../cockpit-guide.md
record_type: session
session_state: revision-requested
record_basis: contemporaneous
agent: Codex
branch: main
next_action: "Continue with round 4 from selected base B — Open Room Portraits, making continuation smaller and varying room browsing."
changed_paths:
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-3/README.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-3/01-quiet-room-list.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-3/02-open-room-portraits.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-3/03-type-led-room-index.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-3/04-room-name-trail.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-3/comparison.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-2/README.md
  - docs/02-design/mockups/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/sessions/2026-09-19-harbour-blue-home-round-2.md
---

# Session — Harbour Blue Home composition round 3

## Scope and authority

Simon retained round 2's continuation-led Home, especially the large
“Continue in Kitchen” language, and requested a further Home-only exploration
where other Rooms no longer appear as separated tiles. He authorized the
continuation to remain a rectangle while the room links blend more naturally
with the Linen background. This is a mockup-only round in the primary checkout
under the 2026-09-19 exception.

The round does not revise the canonical zero-or-one Home-region contract,
select a winner, create room interiors, implement frontend or Android code,
author Figma, publish Git changes or touch private Obsidian settings. Existing
unrelated local edits remain preserved.

## What changed

- Added [round 3](../../02-design/mockups/2026-09-19-harbour-blue-home/round-3/README.md)
  with four full-screen Home PNGs and a 2 × 2 comparison sheet.
- Held the white rectangular fictional continuation panel and stable bottom
  Round composer constant while comparing a quiet illustrated list, open room
  portraits, a type-led room index and a horizontal room-name trail.
- Kept other Rooms borderless at rest while documenting that broad semantic
  targets, interaction feedback and separated focus rings remain required in
  implementation.
- Preserved round 2 as generation history and marked it superseded for current
  review. Updated the gallery and milestone; the selected style-board folder
  remains unchanged because this round applies rather than reopens it.

## Evidence and limits

All four local source PNGs were inspected at original detail. Every screen
contains the same Home identity, neutral invitation, fictional rectangular
“Continue in Kitchen” / “Vegetable soup” panel, other-room names and purposes,
written Menu, bottom Type/Talk/Send composer and no idle Stop. Other Rooms sit
directly on Linen rather than inside independent cards. No tabs, room interior,
alerts, scores, prompt chips, real names or private data appear.

The image generator does not certify exact fonts, colors, dp/sp, responsive
reflow, semantic target bounds, focus order or human understanding. B's room
art is the most decorative treatment; D's horizontal trail requires vertical
stacking at narrow widths or large text. The comparison resamples the source
screens and is not authoritative for fine geometry.

`python3 scripts/cockpit.py --write` regenerated the snapshot with 53 records;
`python3 scripts/cockpit.py --check` passed. `git diff --check` passed.
`python3 scripts/validate-docs.py` reported the same 14 pre-existing local
errors from the incomplete untracked style-board iteration-2/iteration-3 files
and missing frontmatter in Simon's notes; it reported no round-3 path error.
All five round-3 PNGs were inspected at original detail. The round-3 README was
opened in the primary `docs` Obsidian vault; Obsidian reported the README note
open on workspace 4. Renderer-level interaction and human review remain unrun.

## Handoff

The round is ready for Simon's local review on `main` under the mockup
exception; there is no commit, push, PR or merge. The next bounded decision is
which borderless room treatment to refine, or which restrained parts to combine
without creating a busier fifth design. Room interiors and implementation
remain stopped.
