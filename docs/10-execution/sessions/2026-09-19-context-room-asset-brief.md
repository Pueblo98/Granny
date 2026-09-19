---
title: "Prepare Context Room visual asset system and starter catalog"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, context, assets]
related:
  - ../../02-design/context-room-visual-system.md
  - ../../02-design/context-room-starter-catalog.md
  - ../../02-design/context-room-asset-production.md
  - ../task-packets.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Context Room asset planning session
branch: docs/context-room-assets
base_commit: ec30f3e7d025f763b851a21f2f7af10ccde3893c
next_action: Generate the two Kitchen/Fitness contact sheets from the production brief, review all 16 directions, then produce K01/K02/F01/F02 as the first UI-ready packs.
changed_paths:
  - docs/02-design/accessibility.md
  - docs/02-design/context-room-asset-production.md
  - docs/02-design/context-room-starter-catalog.md
  - docs/02-design/context-room-visual-system.md
  - docs/02-design/context-rooms.md
  - docs/02-design/design-system.md
  - docs/02-design/product-design-spec.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/task-packets.md
  - docs/README.md
---

# Scope and authority

Simon requested documentation describing the different assets needed to begin
the Context Rooms UI, including an outside representation, room background,
decor and five to ten choices per customizable area for Kitchen and
Gym/Fitness. This session prepares design and generation handoff documents. It
does not generate images, implement the frontend, add persistence or accept a
final room style.

# What changed

The visual system now defines five required asset roles, reviewed local packs,
low-effort assistant recommendation, neutral fallback, fixed UI boundaries and
catalog metadata. The starter catalog provides eight coherent Kitchen packs
and eight Fitness packs; every row specifies all five required assets. The
production brief stages contact sheets, four first UI-ready packs and later
catalog expansion, with prompt, size, naming, manifest, access and technical
review requirements.

Context Rooms, SCR-016/017, CMP-011, A11Y-11 and T-119 now link the same asset
model. The Kitchen/Fitness art catalog does not change the Kitchen/Trips data
fixture or expand the five-workflow MVP.

# Evidence

`python3 scripts/validate-docs.py` passed with 0 errors across 154 Markdown
files, including 49 requirements/trace rows, 26 use cases, nine journeys, 17
screens, 11 components and 19 tasks. `python3 scripts/cockpit.py --check`
passed with 43 records, 13 Canvas nodes, five edges and three Base views/embeds.
`python3 scripts/check_handoff.py --base origin/main` and `git diff --check`
passed. No asset rendering, browser screenshot, Android test, participant
review or runtime-model selection was performed.

# Handoff

Use the generation brief for the next separately requested visual-production
session. Start with two eight-direction contact sheets. After Simon reviews
them, generate K01/K02/F01/F02 as individual masters and validate them inside
the room-library and room-entry compositions before completing the remaining
catalog.
