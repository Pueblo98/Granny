---
title: "Navigation and supporting surfaces — iteration 1"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, mockups, navigation]
related:
  - ../../02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/README.md
  - ../../02-design/mockups/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex navigation mockup session
branch: main
base_commit: 89f766d3f932dbe8787ede4f31ab32052b2acbfd
next_action: Simon reviews whether the 13 surfaces form one quiet navigation system and chooses any structures needing refinement before implementation handoff.
changed_paths:
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/01-menu.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/02-today-minimal-history.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/03-settings-overview.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/04-privacy-and-data.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/05-accessibility-preferences.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/06-help-what-can-i-ask.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/07-new-conversation.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/08-return-from-external-app.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/09-global-search-results.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/10-global-search-no-results.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/11-onboarding-welcome.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/12-onboarding-preferences.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/13-onboarding-optional-access.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/README.md
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/comparison.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/manifest.json
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/prompts.md
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/rejected/03-settings-trash-back-rejected.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/rejected/08-return-extra-turns-rejected.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/rejected/09-global-search-mismatched-summary-rejected.png
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/rejected/README.md
  - docs/02-design/mockups/README.md
  - docs/10-execution/current-milestone.md
---

# Scope and authority

Simon requested the next mockup batch for Menu, Today/minimal task history,
Settings, Privacy/data, Accessibility, Help, new conversation, external-app
return, global search and onboarding/initial preference setup. This session
produces review rasters only under the repository's mockup exception in the
primary checkout. It does not implement frontend or Android code, persist data,
request permissions or contact external services.

# Design and delivered work

The design read is: older adults and people with varied access needs need
direct, written orientation without a permanent navigation dashboard; the
emotional posture is calm and candid; the medium is a first-round raster
reference for the eventual tablet app.

Thirteen selected frames cover every requested area. Global search has result
and no-result states. Onboarding uses three skippable steps so interaction
orientation, reversible preferences and optional access are not bundled.
Return from an external app restores the originating conversation and reports
unknown send status instead of guessing success.

Three first attempts were regenerated once for semantic errors: a trash icon
on Back to Home, an invented return-state conversation pair and an unrelated
search-history match. Rejected files remain in the iteration folder and are
excluded from the selected manifest.

# Evidence and limits

- All 13 selected 1586 × 992 PNGs and the 1624 × 4102 comparison sheet were
  inspected for copy, subject, crop, style drift, private data and watermark.
- README embeds, prompt log and JSON manifest make the round locally
  reviewable and reproducible as a design reference.
- `python3 scripts/cockpit.py --write` refreshed the snapshot; `--check`
  passed with 85 session records, 13 Canvas nodes / five edges and three Base
  views / embeds.
- `python3 scripts/validate-docs.py` checked 247 Markdown files and 3,010 local
  links. The new navigation files introduced no reported error; the command
  remained non-green only because the pre-existing untracked `docs/Notes.md`
  and `docs/To do table features.md` lack frontmatter. They were not modified.
- Manifest JSON parsing and `git diff --check` passed.
- Handoff coverage is non-green in the dirty primary checkout because it also
  sees pre-existing untracked `.claude`, `.playwright-mcp`, Context Room assets
  and personal notes outside this session. Those paths remain untouched and
  are not claimed by this handoff.

Raster inspection does not establish exact contrast, Android dp/sp, font
fidelity, TalkBack, keyboard/switch operation, IME behavior, large-text reflow,
permission flows, persistence, external-app verification or older-adult
comprehension.

# Handoff

Review question: does this feel like one quiet navigation system around the
conversation, and which surface—if any—still feels too much like a conventional
settings dashboard? Refinement and implementation instructions wait for Simon's
feedback.
