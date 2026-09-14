---
title: "Design token maturity and handoff"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [design]
related:
  - ../docs/02-design/design-system.md
  - ../docs/02-design/brand-and-visual-identity.md
  - ../docs/02-design/figma.md
---

# Design token maturity and handoff

The [browser-first handoff](../docs/02-design/browser-prototype.md) is active. Its [stylesheet](../prototypes/stage-1/styles.css) contains a neutral interaction baseline and reviewer-only Open Day / Bright Signal comparisons on the same conversation. These reversible proposed values are not final identity. CSS pixels/em are not Android dp/sp. These custom properties are not an accepted portable token schema. Future production exports must trace to a reviewed browser component/screenshot or optional Figma variable; a Figma subscription is not required.

Stage 1 only. There is no accepted public name, final palette, font or logo. Token roles are proposed; no machine-readable token schema or production set exists. [Interaction roles](../docs/02-design/design-system.md) and [four concrete identity candidates](../docs/02-design/brand-and-visual-identity.md) own their respective definitions; do not duplicate candidate values here.

## Promotion path

Brand foundation → identity territories → Simon review + accessibility/user evidence → selected proposed direction → validated semantic tokens and logo assets → browser components/prototypes (Figma optional) → explicit acceptance recorded in Git → Android implementation.

1. **Neutral feasibility:** synthetic Home/policy/permission prototypes may use system sans, white background, #152522 text, #123B36 primary, #982D35 danger, #5C32A3 focus. These existing candidate pairings are provisional test fixtures, not brand acceptance. Label screenshots accordingly.
2. **Candidate exploration:** use semantic roles `surface.canvas`, `surface.panel`, `text.primary`, `text.secondary`, `action.primary`, `status.success/warning/danger`, `focus.ring`, typography and dimension roles. Separate territory values from meaning. Never derive “danger = brand accent”.
3. **Selected proposed:** record Simon's direction and remaining linguistic/font/dark-mode questions. Validate every used foreground/background pair including overlays and disabled explanations; font coverage, fallback metrics, 200% wrapping, target bounds, reduced motion and focus.
4. **Accepted production:** acceptance links the actual decision; version the machine-readable export, licenses and checksum/source references. Figma variables and Android resources must reproduce same role/value pairs; automated comparison plus physical accessibility tests gates release.

No production token file is generated in this prototype mission. Next token task must specify schema, units (Android dp/sp vs Figma logical units), theme modes, font weight mapping, fallback and migration. No API secrets, paid font binaries without rights, private Figma credentials or device-specific assets.

Every token change includes purpose, before/after, impacted SCR/CMP IDs, measured contrast, layout regressions, approval status and rollback. Add semantic roles only for actual component needs. Production visual UI waits for GATE-05/GATE-08; fake-adapter and neutral feasibility work does not wait for a final marketing name. See [Figma handoff](../docs/02-design/figma.md).
