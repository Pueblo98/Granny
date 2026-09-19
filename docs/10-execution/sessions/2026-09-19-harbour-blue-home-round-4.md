---
title: "Session — Harbour Blue Home composition round 4"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, mockups]
related:
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/round-4/README.md
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/round-3/README.md
  - ../../02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md
  - ../current-milestone.md
  - ../cockpit-guide.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: main
next_action: "Future sessions start from selected option A — Explicit Scroll Row; next bounded work is its responsive/state handoff or authorized T-119 implementation."
changed_paths:
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-4/README.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-4/01-explicit-scroll-row.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-4/02-airy-portrait-gallery.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-4/03-portrait-spotlight.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-4/04-vertical-portrait-stream.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-4/comparison.png
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-3/README.md
  - docs/02-design/mockups/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/sessions/2026-09-19-harbour-blue-home-round-3.md
---

# Session — Harbour Blue Home composition round 4

## Scope and authority

Simon identified round 3's B — Open Room Portraits as the strongest current
Home direction and asked for further variations based on it, especially a
smaller continuation treatment and different ways to scroll or move through
Rooms. This round is mockup-only work in the primary checkout under the
2026-09-19 exception.

The generation work did not itself select a final Home. In Simon's subsequent
review on the same date, he explicitly selected A — Explicit Scroll Row for
future design and development; the separate selection record and ADR-0016 own
that propagation. This session still did not create room interiors, implement
frontend or Android code, author Figma, publish Git changes or touch private
Obsidian settings. Existing unrelated local edits remain preserved.

## What changed

- Added [round 4](../../02-design/mockups/2026-09-19-harbour-blue-home/round-4/README.md)
  with four full-screen PNGs and a comparison sheet based directly on the
  selected Open Room Portraits composition.
- Reduced continuation weight across the set and compared an explicit
  horizontal row, an all-visible gallery, a one-room spotlight pager and a
  vertical stream.
- Preserved unframed removable portrait art, live room names/purposes, the
  Linen/Harbour Blue roles and the stable bottom Round composer.
- Marked round 3 as the selected refinement base without deleting its other
  directions. Updated the gallery and milestone; the final Harbour Blue source
  folder remains unchanged.

## Evidence and limits

All four individual source PNGs and the comparison were inspected at original
detail. Required Home identity, invitation, fictional continuation, written
Menu, room names, bottom Type/Talk/Send composer and no idle Stop are present.
No room is placed inside an individual card. A exposes Previous/Next, B exposes
all fixtures, C exposes written pager controls and position text, and D exposes
a written scroll cue plus direct “See all rooms”.

A did not produce the requested partial Reading crop, so its scroll model is
communicated mainly by controls. C deliberately removes the continuation
purpose line; D intentionally clips Reading as a scroll cue. Generated fonts,
exact colors, Android target sizes, adaptive behavior, semantics, focus order
and comprehension are not certified by the rasters.

`python3 scripts/cockpit.py --write` regenerated the snapshot with 54 records;
`python3 scripts/cockpit.py --check` passed. `git diff --check` passed.
`python3 scripts/validate-docs.py` reported the same 14 pre-existing local
errors from incomplete untracked style-board iteration-2/iteration-3 files and
missing frontmatter in Simon's notes; it reported no round-4 path error. All
five round-4 PNGs were inspected at original detail. The round-4 README was
opened in the primary `docs` Obsidian vault, where Obsidian reported the README
note open on workspace 4. Renderer interaction and human review remain unrun.

## Handoff

Simon accepted A — Explicit Scroll Row after local review. Future sessions use
the stable selected reference and ADR-0016 rather than reopening this four-way
comparison. There is no commit, push, PR or merge under the mockup exception.
The next bounded work is responsive/state design or separately authorized
T-119 implementation; room interiors and implementation remain stopped here.
