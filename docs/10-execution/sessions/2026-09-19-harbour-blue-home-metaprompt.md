---
title: "Prepare Harbour Blue Home mockup metaprompt"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, mockups, metaprompt]
related:
  - ../../02-design/harbour-blue-home-mockup-metaprompt.md
  - ../../02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md
  - ../../02-design/context-rooms.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Harbour Blue Home handoff session
branch: main
base_commit: dc9efd897adc5a2c5f93ab629ff7ac1a211e1b1d
next_action: Start a fresh mockup session with the metaprompt, generate the four round-1 Home directions and stop for Simon's composition review.
changed_paths:
  - docs/02-design/harbour-blue-home-mockup-metaprompt.md
  - docs/10-execution/current-milestone.md
  - docs/README.md
---

# Scope and authority

Simon confirmed the style-board phase is complete, selected Harbour Blue and
requested a metaprompt for a new session to generate navigable, low-button UI
mockups. The new session should first compare load-in Home compositions with
the selected canvas and writing composer, including restrained Context Room
presence where useful.

# What changed

The new execution metaprompt locks the exact Harbour Blue values, Round
conversation composer, product behavior and accessibility boundaries. It asks
for four structural Home directions with identical copy and visual language,
requires actual generated/filed artifacts and sets a review stop before the
Rooms library or room interiors are expanded.

# Evidence

The selected Harbour Blue PNG was inspected at original detail and its accepted
written transcription was used as the token/composition source.
`python3 scripts/cockpit.py --check` passed with 50 records, 13 Canvas nodes,
five edges and three Base views/embeds; `git diff --check` passed. The full docs
validator found no error in this handoff and reported 14 existing local
style-board/notes errors: missing iteration-2/3 files or links plus two
user-notes without frontmatter. No mockup image, frontend code, Figma frame,
Android artifact or participant evidence was created by this handoff.

# Handoff

Copy the prompt into a fresh design/image-generation session. That session
works directly in the primary mockup vault under the current exception, creates
the four named PNGs plus a comparison sheet and README, then asks Simon which
structure to refine without inventing a busier fifth design.
