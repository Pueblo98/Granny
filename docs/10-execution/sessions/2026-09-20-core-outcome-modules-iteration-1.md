---
title: "Core outcome modules — iteration 1"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, mockups, outcomes]
related:
  - ../../02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/README.md
  - ../../02-design/mockups/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex core-outcome mockup session
branch: design/core-outcome-modules-iteration-1
base_commit: 497c4d1a5ca6981c5c7dceee7204d46505bf426f
next_action: Simon reviews which inline modules are ready and which need simplification before canonical specification or implementation work.
changed_paths:
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/01-photos-found.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/02-photos-no-result.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/03-screen-explanation.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/04-guidance-highlight.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/05-message-draft-review.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/06-message-prepared-unsent.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/07-media-playing.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/08-media-unavailable.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/09-reading-text-preview.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/10-reading-applied-restore.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/README.md
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/comparison.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/manifest.json
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/prompts.md
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/rejected/03-screen-explanation-g-avatar-rejected.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/rejected/04-guidance-highlight-g-avatar-rejected.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/rejected/README.md
  - docs/02-design/mockups/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/sessions/2026-09-20-core-outcome-modules-iteration-1.md
---

# Scope and authority

Simon authorized a new mockup batch for five outcome modules: Photos, screen
explanation, message drafting, media and reading assistance. This session
generated ten full-screen raster references plus one derived comparison sheet.
Because no supporting-navigation list followed the heading in the request, the
checkpoint preserves the existing shell but does not invent that separate
batch.

This work does not implement frontend or Android code, contact external apps,
change canonical behavior, accept production visuals or claim accessibility or
participant evidence. All depicted content is fictional.

# Design read and delivered work

The session read the selected Harbour Blue system, Explicit Scroll Row Home,
conversation-first plan, shared-state surface contract, product design spec,
design system, accessibility, voice and action-policy owners. It used the
repository design-handoff and UI-craft workflows in Refine mode, then generated
every raster through the built-in image tool.

The structural rule is one contextual rectangular module inside an ordinary
conversation, with provenance, state, consequence and recovery presented only
when relevant. The ten selected frames cover found/no-result photos,
explanation/guidance, exact/prepared message draft, playing/unavailable media,
and preview/applied reading size.

Frames 03 and 04 were regenerated once because their first outputs introduced
an unapproved circular “G” avatar. Rejected originals are retained under the
iteration's `rejected/` folder and excluded from the selected manifest. No
other generation failed or required replacement.

# Evidence and checks

- All ten selected 1586 × 992 PNGs were inspected at original detail for
  subject, copy, crop, watermark, private data, style drift and spaciousness.
- The 1624 × 2930 comparison was inspected after generation; its labels sit
  outside the product screenshots.
- README embeds provide the Obsidian review gallery; manifest and prompt log
  record the selected files and generation inputs.
- `python3 scripts/cockpit.py --write` refreshed the snapshot; `--check`
  passed with 80 session records, 13 Canvas nodes / five edges and three Base
  views / embeds.
- `python3 scripts/validate-docs.py` passed with zero errors across 228
  Markdown files and 2,890 checked local links.
- The documentation-tool regression suite passed 47 tests. Handoff coverage,
  JSON parsing and `git diff --check` passed.

Raster review cannot establish exact contrast, Android dp/sp, font fidelity,
TalkBack order, keyboard/switch traversal, live-region behavior, responsive
reflow, device feasibility, service integration, action verification or
older-adult comprehension.

# Handoff

The review question is: which modules feel ready to carry into the prototype,
and which should be simplified while keeping their provenance, state and
recovery language intact? Canonical product/design propagation and frontend
implementation wait for that review.
