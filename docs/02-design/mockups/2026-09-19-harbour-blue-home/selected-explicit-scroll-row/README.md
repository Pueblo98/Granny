---
title: "Selected Home composition — Explicit Scroll Row"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [design, mockups, home, context-rooms, selected]
related:
  - ../round-4/README.md
  - FRONTEND-IMPLEMENTATION-METAPROMPT.md
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
  - ../../../../09-decisions/ADR-0016-explicit-home-room-row.md
  - ../../../product-design-spec.md
  - ../../../design-system.md
  - ../../../accessibility.md
---

# Selected Home composition — Explicit Scroll Row

**Selected by Simon on 2026-09-19 for future Home design and development
sessions.** Start from this composition rather than reopening the earlier Home
directions, palette or composer shape.

![Selected Harbour Blue Home with a compact Continue in Kitchen panel, open room portraits, written Previous and Next controls and the Round composer](explicit-scroll-row-selected.png)

This file is an unchanged copy of
[round 4 option A](../round-4/01-explicit-scroll-row.png). The original round,
comparison and exact generation prompt remain preserved in the
[round-4 record](../round-4/README.md#a--explicit-scroll-row).

## Selected structure

- Home remains the universal conversation surface. The large Round composer,
  Type, Talk, Send and Menu retain stable meanings and locations.
- A compact rectangular continuation surface may show one useful unfinished
  item, such as fictional “Continue in Kitchen” / “Vegetable soup”.
- Other Rooms appear as open, unframed portraits and live written labels on the
  Linen canvas, not as cards, tiles, app icons or a boxed shelf.
- The row uses explicit written **Previous** and **Next** controls when its
  content overflows. A direct **See all rooms** route remains available; swipe,
  drag or a partially visible next portrait may reinforce but never replace
  those paths.
- The portrait, room name and purpose form one broad semantic target. Room art
  is removable and never carries essential text.
- The selected Harbour Blue roles and Round composer remain fixed inputs.

## Development interpretation

The raster is a composition reference, not literal Android geometry. In a real
row, Previous/Next must reflect the true position and become unavailable with a
visible reason at an end; controls must not imply scrolling when every Room
fits. On narrow screens or at large text, the row becomes a vertical sequence
or direct-list treatment rather than shrinking labels or requiring essential
horizontal scrolling. The composer remains available after reflow.

Future design work may refine spacing, portrait crops, scroll feedback,
pressed/focus states, empty/loading/error behavior and narrow layouts. It must
not replace the selected structure with a tile grid, icon-only carousel,
permanent bottom navigation or multiple competing continuation cards without a
new explicit Simon decision.

## Next implementation handoff

Simon authorized the bounded next frontend checkpoint on 2026-09-19. Use the
[implementation metaprompt](FRONTEND-IMPLEMENTATION-METAPROMPT.md) in a fresh
development session to inspect the selected reference and existing browser
prototype, then implement this Home with real overflow behavior, responsive
fallbacks, fictional placeholders and regression coverage. That checkpoint
stops before full Rooms library/interior, persistence, Android or backend work.

## Evidence boundary

Selection accepts this Home composition direction. It does not prove exact
contrast, fonts, dp/sp, TalkBack order, switch/keyboard operation, 200% reflow,
older-adult comprehension, Context Rooms persistence or Android feasibility.
Those remain implementation and evaluation work under T-119 and EVAL-008/012.

The generated source shows all three sample Rooms despite the original prompt
asking for a partial Reading crop. Future implementation should show an honest
overflow cue only when more Rooms actually exist.
