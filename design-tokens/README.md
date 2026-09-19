---
title: "Design token maturity and handoff"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design]
related:
  - ../docs/02-design/design-system.md
  - ../docs/02-design/brand-and-visual-identity.md
  - ../docs/02-design/figma.md
---

# Design token maturity and handoff

The [browser-first handoff](../docs/02-design/browser-prototype.md) is active. Its [stylesheet](../prototypes/stage-1/styles.css) contains a neutral interaction baseline and reviewer-only Open Day / Bright Signal comparisons on the same conversation. These reversible proposed values are not final identity. CSS pixels/em are not Android dp/sp. These custom properties are not an accepted portable token schema. Future production exports must trace to a reviewed browser component/screenshot or optional Figma variable; a Figma subscription is not required.

Stage 1 only. Simon selected [Harbour Blue as the current visual design system](../docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md) on 2026-09-19. Its written reference owns the selected board's values and type intent. No accepted public name, production font files, logo, machine-readable token schema or validated production set follows from that selection. [Interaction roles](../docs/02-design/design-system.md) remain separate; earlier identity candidates in the brand owner are historical.

## Promotion path

**Current selection — Harbour Blue:** main-board, accent, Send and outline choice is resolved. Use the linked final transcription instead of reopening the shortlist. Earlier selection checkpoints below are historical. The next token implementation still requires exact units, unshown states, font-file checks and accessibility validation; no code/export was created by this selection.

**Foundation selection, Simon, 2026-09-19:** [Linen canvas, white surface and dark ink](../docs/02-design/brand-and-visual-identity.md#selected-foundation--linen) now stay fixed. Soft Plum is the baseline accent; a final Send/accent shortlist includes expressly requested blue alternatives. Values stay in the brand owner. Main-board/action selection and validated production exports remain separate next steps.

**Selected direction, Simon, 2026-09-19:** [Soft Plum](../docs/02-design/brand-and-visual-identity.md#selected-visual-direction--soft-plum) now guides mockup work. Canvas and ordinary outlines are being refined; exact production tokens, fonts and other theme presets remain open. The brand owner records values and arithmetic. No stylesheet, machine-readable token export or app implementation changed with this selection.

Brand foundation → identity territories → Simon review + accessibility/user evidence → selected proposed direction → validated semantic tokens and logo assets → browser components/prototypes (Figma optional) → explicit acceptance recorded in Git → Android implementation.

1. **Neutral feasibility:** synthetic Home/policy/permission prototypes may use system sans, white background, #152522 text, #123B36 primary, #982D35 danger, #5C32A3 focus. These existing candidate pairings are provisional test fixtures, not brand acceptance. Label screenshots accordingly.
2. **Candidate exploration:** use semantic roles `surface.canvas`, `surface.panel`, `text.primary`, `text.secondary`, `action.primary`, `status.success/warning/danger`, `focus.ring`, typography and dimension roles. Separate territory values from meaning. Never derive “danger = brand accent”.
3. **Selected proposed:** record Simon's direction and remaining linguistic/font/dark-mode questions. Validate every used foreground/background pair including overlays and disabled explanations; font coverage, fallback metrics, 200% wrapping, target bounds, reduced motion and focus.
4. **Accepted production:** acceptance links the actual decision; version the machine-readable export, licenses and checksum/source references. Figma variables and Android resources must reproduce same role/value pairs; automated comparison plus physical accessibility tests gates release.

No production token file is generated in this prototype mission. Next token task must specify schema, units (Android dp/sp vs Figma logical units), theme modes, font weight mapping, fallback and migration. No API secrets, paid font binaries without rights, private Figma credentials or device-specific assets.

Every token change includes purpose, before/after, impacted SCR/CMP IDs, measured contrast, layout regressions, approval status and rollback. Add semantic roles only for actual component needs. Production visual UI waits for GATE-05/GATE-08; fake-adapter and neutral feasibility work does not wait for a final marketing name. See [Figma handoff](../docs/02-design/figma.md).
