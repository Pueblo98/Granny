---
title: "Claude Code handoff — build the design system and run design-sync"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [design, brand, handoff, tokens]
related:
  - brand-and-visual-identity.md
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - naming-exploration.md
  - ../../design-tokens/README.md
---

# Claude Code: build and sync the design system

## Assignment

**Selected visual input, 2026-09-17:** Simon accepted [Round conversation](brand-and-visual-identity.md#accepted-shape-direction--round-conversation) as the composer shape moving forward, including compact/normal/expanded use and a favicon direction. Use the embedded exact reference for composer specimens; do not substitute cushion, tucked-tail, ticket or ribbon. Palette/type and finished icon assets remain separate refinements.

Create a reusable, reviewable design system from this repository's brand vision and semantic contracts, then import it using `/design-sync` in Claude Code. Deliver brand guidance, color and typography foundations, machine-readable tokens, reusable component specimens and a verified synced system. This is a design-system construction session. App screen layouts, Home/navigation decisions and end-to-end product design belong to a separate later session.

Read this file in Claude Code with the Granny repository available. Do not require the separate app-design handoff or a combined archive. Current request authorizes preparing this brief; the build/sync instructions below are the assignment for the future Claude Code session when Simon starts it. No system has been built or synced by writing this specification.

## Paste into Claude Code

> Read docs/02-design/claude-code-design-system-handoff.md and its canonical sources. Build the proposed design system described there: brand foundation, semantic colors, typography, spacing, shapes, iconography, motion, tokens and reusable component specimens. Work in an isolated repository worktree. Use current product contracts, not the rejected prototype's appearance, as your source. Produce visual foundation/component review sheets and actual reusable source before using /design-sync. Then invoke /design-sync in this Claude Code session against the scoped system source and verify that colors, fonts and representative component states were imported correctly. If the slash command requires my input, give me the exact command and source path to enter; do not substitute a made-up shell command or claim sync succeeded. Keep all unapproved visual choices labeled proposed. Do not design the app screens, decide Home/navigation, implement Android, use Figma, or enable an organization-wide default as part of this session. Finish with the source paths, preview instructions, validation report, sync destination/version and explicit remaining gaps.

## Source authority and required reading

Read AGENTS.md, the current milestone and decision queue for current authority. Then read [product vision](../00-vision/product-vision.md), [brand foundation and four territories](brand-and-visual-identity.md), [semantic components](design-system.md), [accessibility](accessibility.md), [voice](voice-ux.md), [token maturity](../../design-tokens/README.md) and [naming](naming-exploration.md). Consult [action policy](../05-safety-privacy/action-policy.md) for confirmation/Stop specimens. Canonical documents remain owners; generated guides must link their source revision and disclose proposals rather than introduce competing product rules.

Simon rejects the current prototype as too button-heavy and generically AI-styled. The old stylesheet and identity boards can reveal existing values or historical experiments, but are not approved visual references. In particular, older brand text suggesting a shortcut grid must not override this feedback. Build foundations without fixing a Home composition.

## Brand vision to carry into the system

Purpose: return practical agency to people who want computing outcomes without managing its interface. Promise: ask for something useful, understand what happens and stay in charge. Central idea: capability made approachable. The adult remains the author of the task.

The product is an ordinary stock-Android tablet app for independent older adults with varied preferences and access needs. It is not a medical service, caregiver-monitoring dashboard or replacement OS. Granny is a temporary codename; do not invent a final wordmark or use grandmother imagery.

| Brand quality | System expression |
|---|---|
| Capable and candid | Specific actions; legible information; visibly distinct prepared, complete and unknown results |
| Respectful | Adult language and proportions; user control; no diagnosis, patronizing praise or age caricatures |
| Clear | Strong hierarchy, readable labels and generous spacing; essential actions stay discoverable |
| Warm | Patient language, thoughtful color and comfortable rhythm; no faux intimacy or childish shapes |
| Steady | Consistent component anatomy, predictable focus and restrained motion |

Avoid generic AI gradients, sparkles/orbs, glass effects, repeated floating cards, pill-shaped ordinary labels, dense button collections, confetti and engagement mechanics. Components can be expressive without decorative competition with private content. A component catalog contains many controls; a future screen should expose only the controls relevant to its current state.

## Visual direction and review values

No territory or font is accepted. Start with **Open Day as a proposed working theme**, following the existing recommendation, and show Bright Signal as a compact foundation challenger using identical specimens. This selects a reversible review baseline, not the final brand. Keep Living Pages and Everyday Spark documented as existing alternatives; do not blend all four into an incoherent default or block source creation while awaiting final identity acceptance.

Open Day working palette, sourced from the brand document:

| Role | Proposed value |
|---|---|
| Canvas / surface | #F5FAF7 / #FFFFFF |
| Primary text / secondary text | #152522 / #44524C |
| Primary action / on-primary | #123B36 / #FFFFFF |
| Secondary / decorative accent | #275D54 / #F4B942 |
| Success / warning | #285C40 / #684500 |
| Danger / on-danger | #982D35 / #FFFFFF |
| Focus | #5C32A3 |

Yellow is an accent, not a generic warning background or default action fill. Sending is not automatically danger-red; deletion has its own role. Document borders, disabled explanations, selected, hover, pressed and focus states as semantic tokens. Resolve missing values as explicit proposals and measure actual pairs, including composites. Do not claim inherited contrast calculations validate newly generated states. Dark mode is not accepted: deliver a complete light candidate and explicitly record dark as outside v1 unless Simon requests it.

Typography candidate: Atkinson Hyperlegible Next, regular body and semibold controls/headings; confirm exact available weights, glyph coverage, version and license before bundling. Use a documented system-sans fallback for previews if unavailable, visibly labeling that substitution in review metadata. No silent remote-font requirement. Bright Signal's existing Manrope/Source Sans 3 pairing is a challenger, not a mixed default.

Type roles (size/line-height in proposed Android sp): display 32/40, heading 28/36, body 20/30, body-large 24/34, button/status 20/28, supporting 18/26. Web specimen units must be explicitly mapped and scalable; CSS pixels are not proof of Android dp/sp conformance.

Spacing: 4/8/12/16/24/32/48dp; nominal inset 24, narrow 16; 12 between distinct primary targets. Open Day's candidate radii are 12dp controls and 16dp containers. Prefer flat grouping through spacing and rules; add elevation only for a defined semantic need. Icon style: recognizable 2–2.5dp strokes with visible labels for essential actions; document asset provenance and license. Motion: proposed 120ms press, 180ms state, 240ms panel; reduced motion uses immediate static equivalents.

## Build deliverables

Keep reusable values in the existing `design-tokens/` boundary and documentation in `docs/02-design/`. A scoped `design-system/` source/specimen directory is a proposed new location; confirm it does not collide with existing work. These are future deliverable paths, not files claimed to exist now.

1. A source-linked brand guide covering purpose, voice, visual principles, do/don't examples and token maturity. It must accompany sync so colors alone do not stand in for brand vision.
2. A versioned token source with primitives → semantic roles → component references; name, type, value, unit, theme, source and proposed/accepted status. Derive CSS variables from this source. Keep raw hex values out of component styles and reject unresolved aliases.
3. Reusable React component source and a runnable local specimen gallery, scoped to design-system interoperability. Inspect the actual `/design-sync` requirements before choosing build tooling. React here is a transfer format, not a production Android framework decision. Identify and obtain any required dependency installation authority under repository rules.
4. Actual component specimens for CMP-007 buttons/fields/switches; CMP-001 Stop/Cancel; CMP-002 input/transcript; CMP-003 exact preview; CMP-004 activity; CMP-005 choice; CMP-006 outcome; CMP-008 guidance/disclosure; CMP-009 content/settings rows. Use the canonical anatomy/state contracts. No backend, real microphone, external send or app navigation implementation.
5. Foundation sheets showing swatches, type, spacing, focus/targets, radii and icon/motion rules. Component sheets cover enabled, focused, pressed, selected, loading, disabled-with-reason, error and completion where applicable; include long labels and enlargement. These are isolated specimens, not an app redesign.
6. Validation and sync record: source commit, system source path, theme maturity, font provenance, measured contrast, specimen coverage, actual destination identifier and verified imported values/states. Missing evidence is recorded explicitly.

Keep MVP and App V1 distinctions in specimen annotations; ADR-0012 memory/adaptation must not silently enter MVP. [ADR-0013](../09-decisions/ADR-0013-bounded-interface-composition.md) accepts bounded semantic composition, and [ADR-0014](../09-decisions/ADR-0014-stable-home-context-panel.md) limits Home to zero or one CMP-010 context panel around stable conversation/input anchors. Include component schema/version, allowed typed slots/actions, focus/source order and reflow constraints in the registry; unknown types and arbitrary executable controls fail closed. Build the context-panel specimen and its absent, active, sensitive-summary, kept, expired and large-text states without deciding its final visual treatment.

## Accessibility and specimen acceptance

Essential text including action labels targets at least 7:1; supporting text at least 4.5:1; essential control boundaries/focus at least 3:1. State never depends on color alone. Targets are at least 56dp in native proposals, with primary/Stop/consequential actions at least 64dp; labels wrap and controls grow. Focus ring proposal is 3dp with 2dp separation, not clipped.

Verify specimens at narrow/tablet widths, 200% text, and combined 200% system plus 1.5 app scaling. Include keyboard operation, persistent labels, explicit On/Off state and reduced motion. Stop never disables; exact previews never truncate recipient or content; no generic Enter-to-send behavior. Report browser evidence separately from unrun TalkBack, switch, device and participant evidence.

## Run /design-sync after building the source

[Anthropic's design-system setup guide](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design), checked 2026-09-17, describes `/design-sync` in Claude Code for an existing React-based design system, reading its tokens and components. It is an import/sync step, not a guarantee that a Markdown brief becomes a finished library.

1. Inspect the command available in the installed Claude Code session and its current instructions. Identify the authenticated destination; use a clearly named proposed Granny review system. Avoid overwriting an unrelated existing system.
2. Build and validate the scoped source above. Give the command only the system directory, token source, brand guide and licensed assets needed for this import. Exclude private Obsidian state, credentials, research source material and unrelated repository history.
3. Invoke `/design-sync` through Claude Code's supported slash-command interface. If it cannot be invoked by the agent, ask Simon to enter `/design-sync` and provide the exact source paths to select. Do not run it as a shell executable or invent flags, configuration files or endpoint names.
4. Inspect what the sync produces. Confirm actual semantic colors, font mapping/fallback, source-linked guidance and representative components: primary control, Stop, exact preview and unknown outcome. Compare against the local gallery; fix discrepancies and repeat only affected checks.
5. Record success only when the destination and imported content are observable. A request being submitted or a local guide being written is not completion. If authentication, command availability or import fails, hand off the complete local source and the precise blocked sync step.

Creating a review system is distinct from making it an organization-wide default. Do not toggle global publication/default settings or replace another team's system without explicit scope. Do not use Figma for this workflow; its quota is not a prerequisite.

## Completion

Return the source locations, how to run the gallery, the proposed brand/theme used, exact checks and gaps, the actual synced system reference and its version/source commit. The later app-design session consumes that system; it must not need to reconstruct its palette or typography. This task ends with reusable foundations and verified sync, not app screens or production readiness.
