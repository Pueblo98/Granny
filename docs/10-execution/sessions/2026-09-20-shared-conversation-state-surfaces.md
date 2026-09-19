---
title: "Define shared conversation state surfaces"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, conversation, rooms]
related:
  - ../../02-design/shared-conversation-state-surfaces.md
  - ../../02-design/mockups/2026-09-20-shared-state-pack/iteration-1/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex shared conversation surface specification session
branch: docs/shared-conversation-surfaces
base_commit: f873f652e25425e48835ffcffe43be54d0a4a3b6
next_action: Use the surface contract when implementing the seven shared states over Home and Rooms; test large-text, focus restoration and interruption before claiming fidelity.
changed_paths:
  - docs/README.md
  - docs/02-design/context-rooms.md
  - docs/02-design/design-system.md
  - docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/README.md
  - docs/02-design/shared-conversation-state-surfaces.md
  - docs/10-execution/current-milestone.md
---

# Scope and authority

Simon approved the shared-state visual direction and requested a concise written
contract describing what each state must look like and entail. He explicitly
clarified that the mockups are UX/UI references rather than seven pages: the
current Home or Room should remain while shared states appear through composer
expansion, temporary surfaces and responsive overlays.

This task documents that interpretation. It does not create new mockups,
implement frontend or Android code, alter action policy, accept exact raster
geometry or claim accessibility/device evidence.

# What changed

The accepted state-surface contract now distinguishes underlying place from
temporary interaction state. It records the essential visible words, controls
and behavior for Listening, Editable transcript, Clarification, Exact
consequence preview, Active task + Stop, Prepared — not sent and Unknown
outcome. It also defines normal bottom anchoring, one-surface-at-a-time
composition, room continuity, responsive focused-sheet fallback and restoration
of originating scroll/focus.

Context Rooms and the semantic component owner now link the same rule. The
mockup gallery explicitly labels the seven rasters as state studies rather than
page templates.

# Evidence

- `python3 scripts/cockpit.py --write` refreshed the derived snapshot;
  `python3 scripts/cockpit.py --check` passed with 73 session records, 13
  Canvas nodes / five edges and three Base views / embeds.
- `python3 scripts/validate-docs.py` passed with zero errors across 211 Markdown
  files and 2,720 local links.
- The documentation-tool regression suite passed 47 tests and
  `git diff --check` passed. Handoff coverage passed after commit.

No browser/runtime implementation, Android, TalkBack, switch, microphone,
device, participant or comprehension test ran.

# Handoff

Future frontend work may vary exact geometry and may let a long or enlarged
surface occupy most of the viewport. It conforms only if the required state
information, controls, semantics and underlying Home/Room continuity remain.
The first implementation review should exercise the same state from both Home
and Kitchen, then verify dismissal, interruption and large-text restoration.
