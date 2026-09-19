---
title: "Expand the Context Room visual catalog to six room dossiers"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, context, rooms, assets]
related:
  - ../../02-design/context-room-starter-catalog.md
  - ../../02-design/context-room-visual-system.md
  - ../../02-design/context-room-asset-production.md
  - ../../02-design/context-rooms.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Context Room catalog expansion session
branch: main
base_commit: dc9efd897adc5a2c5f93ab629ff7ac1a211e1b1d
next_action: Generate and review six room-mark contact sheets and six environment contact sheets, then produce K01, F01, T01, G01, R01 and P01 as the first UI-ready identities.
changed_paths:
  - docs/02-design/context-room-starter-catalog.md
  - docs/02-design/context-room-visual-system.md
  - docs/02-design/context-room-asset-production.md
  - docs/02-design/context-rooms.md
  - docs/02-design/context-room-catalog/kitchen.md
  - docs/02-design/context-room-catalog/fitness.md
  - docs/02-design/context-room-catalog/trips.md
  - docs/02-design/context-room-catalog/garden.md
  - docs/02-design/context-room-catalog/reading.md
  - docs/02-design/context-room-catalog/projects.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/task-packets.md
  - docs/README.md
---

# Scope and authority

Simon found the two-room Kitchen/Fitness catalog too superficial and requested
at least five defined room types, logo ideas for each and a fuller account of
the backgrounds and supporting assets that make each room usable. This session
expands the visual choice space and its production guidance. It does not
generate artwork, change T-119's two-room fictional data fixture, create
default rooms or authorize runtime image generation.

# What changed

The starter catalog now indexes six complete room dossiers: Kitchen, Fitness /
Movement, Trips, Garden, Reading and Projects / Hobbies. Every dossier defines
the room's job and purpose copy, eight large-silhouette room marks, eight
coherent visual packs, eight direct-browse symbols, a recommended neutral
direction and room-specific generation/avoid guidance.

Across the set this provides 48 mark concepts, 48 environment packs and 48
collection-symbol concepts. Each environment pack names its outside portrait,
interior backdrop, removable decor cluster, surface motif and empty-state
illustration. The visual-system and production owners now define marks and
symbols alongside atmosphere assets, preserve Harbour Blue semantic colors and
stage generation through twelve contact sheets before one complete identity
per room. Canonical Context Rooms, milestone, T-119 packet and docs navigation
now point to the six-room catalog without expanding functional scope.

# Evidence

`python3 scripts/cockpit.py --check` passed with 56 records, 13 Canvas nodes,
five edges and three Base views/embeds. `git diff --check` passed, and the
documentation tooling suite passed all 47 tests. A scoped catalog check found
frontmatter and resolvable relative links in all ten new/expanded catalog files
and confirmed exactly eight marks, eight packs and eight symbols in each of the
six dossiers.

The full `python3 scripts/validate-docs.py` run is blocked before validation by
the already-deleted local `docs/02-design/claude-code-design-system-handoff.md`;
the related current-milestone scan also still finds pre-existing missing local
iteration-2, iteration-3 and Claude frontend-metaprompt links. Those unrelated
concurrent deletions/files were preserved rather than restored or overwritten.
No image model, browser prototype, Android build, accessibility tool or
participant study was run; every asset direction remains a proposed generation
brief until its contact sheet and in-UI rendering are reviewed.

# Handoff

This mockup/asset-documentation round was written directly in the primary
checkout under Simon's 2026-09-19 mockup-only workflow exception. Existing
unrelated local style-board, Harbour Blue and Home-selection work was preserved.
The next bounded design round should generate twelve comparison sheets first:
one eight-mark sheet and one eight-environment sheet for each room. After Simon
chooses directions, generate K01/F01/T01/G01/R01/P01 and inspect them in the
actual Harbour Blue Home, library, creation and room states before expanding
the remaining packs.
