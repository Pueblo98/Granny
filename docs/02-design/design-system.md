---
title: Design System Foundation
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - design
  - design-system
related:
  - accessibility.md
  - voice-ux.md
  - figma.md
---

# Design System Foundation

## Experience direction

Granny should feel calm, warm, clear, familiar, non-clinical, and adult. It should reduce cognitive load without reducing dignity. Voice is primary for intent, but every core experience remains usable by touch.

## Proposed design rules

- Present one primary task or decision at a time.
- Keep important controls large, separated, and consistently placed.
- Prefer plain labels to unexplained icons.
- Make listening, thinking, acting, waiting, confirmation, success, failure, offline, and remote-help states unambiguous.
- Keep navigation and adaptive content stable; do not rearrange the interface frequently.
- Never shrink text to make a screen fit; simplify or paginate the content.
- Make cancel/stop visible while the agent acts and undo visible when technically possible.
- Use redundancy—text, shape, position, and optionally sound—not color alone.

## Semantic token roles

Values are deliberately unassigned pending visual exploration and accessibility
testing. Future machine-readable values live in the repository's
`design-tokens/` implementation boundary; this document owns their product and
design meaning inside the vault.

- Color: `background.primary`, `background.secondary`, `surface.primary`, `surface.elevated`, `text.primary`, `text.secondary`, `border.primary`, `brand.primary`, `action.primary`, `success`, `warning`, `danger`, `info`, `focus`, `disabled`.
- Typography: `display`, `heading.1`, `heading.2`, `body`, `body.large`, `button`, `caption`, `system.status`.
- Layout: spacing scale, readable measure, safe screen edges, touch separation, modal/confirmation regions.
- Components: minimum control size, primary action, destructive action, status banner, conversation turn, media card, person card, confirmation sheet.
- Motion: duration and easing roles with reduced-motion equivalents.

## Interaction-state contract

Every interactive component or flow must consider: default, focused, pressed, disabled, loading/acting, completed, error, uncertain, offline, awaiting confirmation, cancelled, and interrupted. Agent activity must not be represented as an indefinite spinner without meaningful status.

## Not decided

No brand palette, typeface, token values, component inventory, icon system, illustration style, motion timings, or screen layouts are accepted. Explore 3–4 distinct visual directions in Figma, then record selected values in Git-backed tokens and an ADR if consequential.
