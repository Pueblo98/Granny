---
title: "ADR-0016 — Selected Home with explicit room portrait row"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [adr, design, accessibility, home, context-rooms]
related:
  - README.md
  - ADR-0014-stable-home-context-panel.md
  - ADR-0015-context-rooms.md
  - ../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../02-design/product-design-spec.md
  - ../02-design/design-system.md
  - ../10-execution/backlog.md
---

# ADR-0016 — Selected Home with explicit room portrait row

## Context and authority

[ADR-0014](ADR-0014-stable-home-context-panel.md) selected a stable
conversation Home with zero or one context panel before Context Rooms existed.
[ADR-0015](ADR-0015-context-rooms.md) subsequently accepted optional Rooms but
kept their Home entry unresolved and inherited ADR-0014's prohibition on a room
row. Simon then reviewed four Harbour Blue Home rounds. He preferred Open Room
Portraits over tiled room surfaces and, on 2026-09-19, explicitly selected
[round 4 option A — Explicit Scroll Row](../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md)
as the direction to use and develop in future sessions because it is direct,
accessible and visually strong.

This is an interaction-composition decision. It does not admit persistent room
data, accept Android geometry or pass an accessibility or release gate.

## Options considered

| Option | Benefit | Cost / risk |
|---|---|---|
| One continuation panel and secondary Rooms route | Lowest Home density | Rooms remain less visible and direct |
| All-visible open portrait gallery | Immediate overview with little control chrome | Does not explain growth beyond a small fixed room set |
| Explicit horizontal portrait row | Recognizable open portraits plus written browsing and direct library access | Adds navigation controls and needs careful overflow/reflow behavior |
| One-room portrait spotlight | Strongest room recognition and largest target | Hides the overall set and increases navigation steps |
| Vertical portrait stream | Natural partial-next cue on expanded width | Adds vertical-scroll ownership and focus/reflow complexity |

## Decision

For future Context Rooms design and development, Home uses the selected
**Explicit Scroll Row** composition:

- the stable Round conversation composer, Type, Talk, Send, Menu and active-task
  Stop remain the primary app-owned anchors;
- Home may show one compact CMP-010 continuation panel and one CMP-012 room
  portrait row at the same time, without requiring room selection before chat;
- the room row uses open, unframed portraits on the Linen canvas with live
  written room names and purposes; it is not a tile grid, boxed shelf, app
  launcher or decorative floor plan;
- overflow has explicit written Previous and Next controls with truthful
  enabled/disabled state, plus a written See all rooms route. Gesture and
  partial-next cues are supplementary, never the only navigation;
- each portrait/name/purpose group is one broad semantic target. Art is
  removable and contains no essential text;
- no overflow means no false scrolling affordance. The renderer may show the
  complete small set and suppress or disable unavailable movement honestly;
- at narrow width or large text, the row reflows to a vertical sequence or
  direct-list treatment while preserving order, targets, labels, the Rooms
  route and composer access.

This supersedes ADR-0014's zero-or-one-region and no-carousel limit for the
Context Rooms Home. It retains ADR-0014's stable conversation anchors,
privacy, optional continuation, focus stability and quiet-Home principles. The
five-workflow MVP may continue using the simpler PRD-FR-002 Home; CMP-012 is the
selected App V1/T-119 extension under PRD-FR-022.

## Consequences and validation

SCR-003 owns the selected Home hierarchy; CMP-010 owns the compact continuation
and new CMP-012 owns the explicit room row. CMP-011 continues to own room entry,
identity and source semantics shared with the Rooms library and room interior.
T-119 must prototype the selected row with deterministic fictional data rather
than reopen the earlier Home compositions.

EVAL-008/012 and access review must cover: no-room, one-room, all-fit and
overflow states; truthful Previous/Next state; direct See all rooms; portrait
image failure; keyboard, switch and TalkBack traversal; focus retention after
movement; 200% and combined 300% scaling; 360/600/840dp reflow; reduced motion;
and whether people still understand that Home can handle any request.

The safe fallback for an unavailable or failed row is the written Rooms route
and direct list, never an unlabeled gesture or hidden room set. Reconsider if
the row competes with writing, is mistaken for mandatory categories, makes
Rooms look like separate agents or loses reachability at large text.

## Decision authority and history

**Accepted by Simon on 2026-09-19.** After reviewing round 4, Simon wrote that
he loved “A explicit scroll row,” considered it “the most accessible and direct
one while still looking great,” and directed future sessions to use and develop
it. This accepts the composition direction and supersedes the conflicting Home
limit in ADR-0014; it does not accept implementation evidence, persistence,
final geometry or a product release gate.
