---
title: "Mockup gallery and image filing"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, mockups]
related:
  - 2026-09-20-core-outcome-modules/iteration-1/README.md
  - 2026-09-20-rooms-system/iteration-1/README.md
  - 2026-09-20-shared-state-pack/iteration-1/README.md
  - 2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - 2026-09-19-harbour-blue-home/round-4/README.md
  - 2026-09-19-harbour-blue-home/round-3/README.md
  - ../brand-and-visual-identity.md
  - 2026-09-19-style-boards/README.md
  - 2026-09-17-chat-entry/README.md
---

# Mockup gallery

**Current core outcome-module review:** [iteration 1](2026-09-20-core-outcome-modules/iteration-1/README.md)
places Photos, screen explanation, message drafting, media and reading
assistance inside the existing Harbour Blue conversation rather than turning
them into five mini-app dashboards. Ten fictional-data frames pair each module
with a no-result, guidance, handoff, unavailable or restore state. Navigation
and additional supporting surfaces remain outside this bounded checkpoint.

**Current Rooms-system review:** [iteration 1](2026-09-20-rooms-system/iteration-1/README.md)
extends the selected Harbour Blue shell through the full library, global search,
All items/Unfiled, room and item organization, archive/restore, separated
deletion scopes, cross-room disclosure and degraded states. These 17 screens are
proposed visual references and have not been promoted into canonical PRD or
design-system instructions. Simon authorized the active frontend session to use
the [bounded implementation metaprompt](2026-09-20-rooms-system/iteration-1/ROOMS-SYSTEM-IMPLEMENTATION-METAPROMPT.md)
for a fictional in-memory prototype while those production contracts remain
unchanged.

**Current shared state pack:** [iteration 1](2026-09-20-shared-state-pack/iteration-1/README.md)
extends the selected Harbour Blue conversation shell through listening,
editable transcript, recipient clarification, exact draft review, active work
with visible Stop, verified prepared-not-sent and honest unknown-outcome states.
The fixture is fictional, and the result branches are alternatives rather than
a guaranteed linear run. This visual pack does not implement or validate the
workflow.

**Current final selection:** [Harbour Blue — image and written design system](2026-09-19-style-boards/final-harbour-blue/README.md), selected by Simon on 2026-09-19. Use this for ongoing visual work. The numbered iterations below are preserved exploration history.

**Selected Home composition:** [Explicit Scroll Row](2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md), selected by Simon on 2026-09-19 for future Home design and development. It combines a compact continuation rectangle, open room portraits, written Previous/Next, direct See all rooms and the stable bottom composer. [Round 4](2026-09-19-harbour-blue-home/round-4/README.md) and [round 3](2026-09-19-harbour-blue-home/round-3/README.md) remain preserved comparison history. Round 1 and round 2 are described by their session records but their local artifact folders are not retained in this checkout. Selection does not authorize room interiors or prove implementation/accessibility.

**Next frontend checkpoint:** Simon authorized implementation of the selected
Home in the existing browser prototype. Start a fresh development session from
the [bounded implementation metaprompt](2026-09-19-harbour-blue-home/selected-explicit-scroll-row/FRONTEND-IMPLEMENTATION-METAPROMPT.md),
which requires real accessible overflow, responsive/list fallbacks and explicit
placeholders while stopping before the full Rooms library or room interiors.

Start with the [style-board iterations and Simon's feedback](2026-09-19-style-boards/README.md), including [iteration 5's Linen final shortlist](2026-09-19-style-boards/iteration-5/README.md). The [15 earlier chat-entry concepts](2026-09-17-chat-entry/README.md) preserve the five rounds leading to the selected Round conversation bubble.

## Filing convention

Each exploration lives in `docs/02-design/mockups/YYYY-MM-DD-topic/`, with a `README.md` index and descriptive numbered PNG filenames. Style boards use `iteration-1/`, `iteration-2/`, and so on, each with its gallery and prompts; Simon's feedback notebook stays above these folders and must be read before every round. Historical chat-entry folders retain their existing `round-N/` names. Every image has a relative Markdown embed and descriptive alt text in its gallery. Use local assets inside the existing docs vault, without remote image URLs or links into a generator cache. Click an image in Obsidian to inspect it at full size.

Brand choices remain in [brand and visual identity](../brand-and-visual-identity.md); behavior and components remain in [design system](../design-system.md). A gallery preserves artifacts without becoming a second token or product authority. Generated fonts/pixels are visual approximations.

**Local workflow, Simon, 2026-09-19:** during this mockup-only iteration phase, work directly in the primary repository on main. Do not create additional worktrees, task branches, PRs or GitHub publication steps for each mockup round. Preserve unrelated local edits. This exception concerns mockup work; executable app work retains its normal workflow.
