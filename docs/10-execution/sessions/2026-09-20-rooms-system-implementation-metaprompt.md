---
title: "Rooms system implementation metaprompt"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, implementation, metaprompt, context-rooms]
related:
  - ../../02-design/mockups/2026-09-20-rooms-system/iteration-1/ROOMS-SYSTEM-IMPLEMENTATION-METAPROMPT.md
  - ../../02-design/mockups/2026-09-20-rooms-system/iteration-1/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Rooms-system implementation-handoff session
branch: docs/rooms-system-implementation-metaprompt
base_commit: d64d5463b744f8e9e2bb596a83535023fb4015cd
next_action: Paste the metaprompt into the active Astra frontend session; implement and review the fictional Rooms slice before any canonical PRD/design-system propagation.
changed_paths:
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/ROOMS-SYSTEM-IMPLEMENTATION-METAPROMPT.md
  - docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/README.md
  - docs/02-design/mockups/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/sessions/2026-09-20-rooms-system-implementation-metaprompt.md
---

# Scope and authority

Simon reviewed the Rooms-system mockup round positively and requested an
implementation metaprompt. This session prepared the handoff for the Astra
frontend session already in progress. It did not edit executable frontend code,
change canonical product behavior, admit persistence or authorize Android,
backend, real-data or external-app work.

# Handoff shape

The metaprompt directs the implementation session to inspect and preserve its
current code, use the 17 individual mockups as visual references and build one
reusable in-memory Rooms/item/membership model rather than 17 static pages. It
covers direct library/search/browse, create/edit/organization with persistent
Undo, archive/restore, separated room/data deletion, cross-room disclosure and
denial, degraded states, responsive/accessibility behavior and deterministic
regression coverage.

It preserves the selected Explicit Scroll Row Home, Harbour Blue, the Round
composer and accepted shared conversation surfaces. It allows local reviewed
assets or honest placeholders already present in the active implementation,
but prohibits screenshot-as-UI, remote assets and copying uncommitted files
between worktrees.

# Evidence boundary

This is an instruction artifact, not implementation evidence. No browser UI,
Android build, persistence, retrieval, permission, accessibility-device or
human-comprehension result was produced in this session. The executing session
must record its actual code, rendered comparisons and test results.
