---
title: "Rooms system mockups — iteration 1"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, mockups, context-rooms]
related:
  - ../../02-design/mockups/2026-09-20-rooms-system/iteration-1/README.md
  - ../../02-design/mockups/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Rooms-system mockup session
branch: design/rooms-system-iteration-1
base_commit: 6f5896d
next_action: Simon reviews the 17 proposed Rooms-system structures; only selected patterns are then propagated into canonical PRD, screen and component instructions.
changed_paths:
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/01-full-rooms-library.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/02-search-all-rooms.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/03-all-items-and-unfiled.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/04-create-room.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/05-rename-and-purpose.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/06-organize-item.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/07-move-item-undo.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/08-archive-room.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/09-restore-room.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/10-delete-room-only.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/11-delete-underlying-items.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/12-cross-room-source.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/13-sensitive-source-denied.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/14-empty-library.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/15-loading.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/16-offline.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/17-missing-artwork.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/README.md
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/comparison.png
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/manifest.json
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/prompts.md
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/rejected/12-cross-room-source-trips-scenery-rejected.png
  - docs/02-design/mockups/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/sessions/2026-09-20-rooms-system-iteration-1.md
---

# Scope and authority

Simon requested the next mockup iteration for the missing Rooms system and
explicitly placed canonical PRD/design-system propagation after visual review.
This session therefore generated proposed references only. It did not implement
frontend or Android code, accept a final interaction, admit persistent data,
change privacy policy or claim device/user evidence.

The user-supplied operating rules required a task branch/worktree for change
work. The primary checkout's unrelated local room-art changes remained
untouched; they were used only as local visual references.

# Delivered work

Seventeen individual 1586 × 992 landscape PNGs cover the full library, global
search, All items/Unfiled, create/edit/organize, Undo, archive/restore, room-only
deletion, separate underlying-data deletion, cross-room source disclosure,
sensitive-source denial, and empty/loading/offline/missing-art states. A derived
1696 × 1630 comparison sheet labels every state outside its product screenshot.

The visual thesis uses open portrait targets for room recognition, plain rows
for direct browsing, and white bounded surfaces only for focused edits or
consequences. It preserves one assistant, the Harbour Blue system and the Round
composer. One cross-room output was regenerated because Trips scenery obscured
the current Kitchen context; the rejected version remains labelled outside the
selected manifest.

# Evidence boundary

Every selected image was inspected at original size and the comparison sheet was
inspected as a whole for crop, copy, watermark, state distinction, style drift
and room-context errors. The README embeds every artifact for Obsidian review.
The images contain fictional room/item fixtures only.

Raster review does not establish exact contrast, Android dp/sp, text scaling,
TalkBack, keyboard/switch behavior, focus containment, dialog semantics,
live-region/Undo timing, offline capability, persistence, policy enforcement or
older-adult comprehension. Simon's visual review precedes any canonical
specification update.

# Handoff

Review first whether the open library, plain content rows and consequence-first
panels feel like one calm system. Then decide which structures should be
formalized and which should be reduced or combined without producing a busier
dashboard.
