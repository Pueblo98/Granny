---
title: "ADR-0014 — Stable conversation Home with one context panel"
status: deprecated
owner: Simon
last_updated: 2026-09-19
tags: [adr, design, accessibility, home]
related:
  - README.md
  - ADR-0016-explicit-home-room-row.md
  - ../01-product/prd.md
  - ../02-design/product-design-spec.md
  - ../10-execution/brainstorming-alignment.md
---

# ADR-0014 — Stable conversation Home with one context panel

> [!warning] Superseded for Context Rooms Home composition
> [ADR-0016](ADR-0016-explicit-home-room-row.md), accepted by Simon on
> 2026-09-19, preserves the stable conversation anchors but replaces this
> record's zero-or-one-region limit with a compact continuation plus an
> explicit open room portrait row. This record remains as decision history and
> as the simpler five-workflow MVP baseline.

## Context and authority

The class brainstorm proposed a persistent customizable dashboard, while the active design direction uses one conversation with stable Talk, Type, Menu and Stop controls. Simon wanted glanceable value without a crowded screen or unnecessary widgets. After reviewing five low-clutter Home directions, Simon explicitly chose the recommended stable conversation anchor with one optional context panel on 2026-09-17, adding “for now” to keep the direction reviewable after evidence.

## Options considered

| Option | Benefit | Cost / risk |
|---|---|---|
| Quiet conversation anchor | Lowest visual and navigation load | No glanceable reminder, unfinished task or recent artifact |
| Persistent dashboard or widget shelf | Many items visible at once | Competing focal points, layout drift and gradual return to the rejected feature grid |
| Stable anchor with one optional context panel | One clear starting point plus limited glanceable value | Relevance, privacy and comprehension must be tested |
| Closed Today route only | Keeps Home quiet while retaining access to a short list | Useful information remains one action away and may be missed |

## Decision

Home is a stable conversation surface. Talk, Type, Menu and active-task Stop keep fixed app-owned positions. When no task is active, Home may show **zero or one** large context panel below the invitation. The panel must use a registered semantic component under [ADR-0013](ADR-0013-bounded-interface-composition.md), contain verified release-admitted information, identify its state or source when needed, and offer one clear next action. It never becomes a tile grid, carousel, stack of widgets or model-defined control.

The default requires little management from the person: the system may select an eligible timely item automatically. Unfinished work that needs attention has priority over a time-sensitive reminder, recent artifact or explicitly kept item. An item that is no longer relevant disappears. **Keep here**, **Hide** and **Reset Home** give direct control without exposing layout editing. Additional eligible items live behind a labeled Today route as a short stable list; this does not add those items or their underlying capabilities to MVP.

Core controls and the visible panel do not move while Home is open. At large text or narrow width the renderer may reflow the panel below the stable input region and preserve reading/focus position. Home never previews sensitive message, contact, health, financial or private-memory details unsolicited; it uses a generic label or requires an explicit open action. The panel cannot authorize, execute or imply completion of an external consequence.

## Consequences and validation

PRD-FR-002, J-007, SCR-003 and CMP-010 own the observable behavior. EVAL-007 tests reflow, focus stability and touch/assistive-technology reachability with the panel absent and present. EVAL-012 compares the selected Home against a quiet anchor with older adults across access and technology-comfort profiles, checking whether the panel is understood, useful and distracting. EVAL-008 covers sensitive-preview and reset behavior.

This decision accepts the current Home structure, not its final visual styling, eligibility thresholds, brand treatment, an Android implementation or a release gate. Reconsider after representative human evidence if the panel is routinely ignored, misunderstood, exposes private context, displaces input, or increases task time or assistance. The safe fallback is the quiet conversation anchor with no panel.

## Decision authority and history

**Accepted by Simon on 2026-09-17.** After discussing the tradeoff for older adults, Simon wrote: “I like your idea with the one context panel for now so let's go with the recommended and resolve the conflict.”

**Deprecated on 2026-09-19 by [ADR-0016](ADR-0016-explicit-home-room-row.md)**
for future Context Rooms Home composition after Simon selected Explicit Scroll
Row. Stable Talk/Type/Menu/Stop positions, optional continuation semantics and
privacy/focus constraints remain inherited; the zero-or-one-region and
no-carousel limits do not.
