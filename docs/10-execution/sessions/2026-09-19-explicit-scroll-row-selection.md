---
title: "Session — Explicit Scroll Row Home selection"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, decision, home, context-rooms]
related:
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../../09-decisions/ADR-0016-explicit-home-room-row.md
  - ../../02-design/context-rooms.md
  - ../../02-design/product-design-spec.md
  - ../../02-design/design-system.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: main
next_action: "Start future Home design from Explicit Scroll Row; next bounded work is responsive/state handoff or separately authorized T-119 implementation."
changed_paths:
  - AGENTS.md
  - docs/README.md
  - docs/Cockpit.md
  - docs/01-product/prd.md
  - docs/01-product/traceability.md
  - docs/01-product/user-journeys.md
  - docs/02-design/accessibility.md
  - docs/02-design/brand-and-visual-identity.md
  - docs/02-design/context-room-asset-production.md
  - docs/02-design/context-room-visual-system.md
  - docs/02-design/context-rooms.md
  - docs/02-design/conversation-first-plan.md
  - docs/02-design/design-system.md
  - docs/02-design/harbour-blue-home-mockup-metaprompt.md
  - docs/02-design/mockups/README.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/round-4/README.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/explicit-scroll-row-selected.png
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/05-safety-privacy/threat-model.md
  - docs/06-evals/canonical-tasks.md
  - docs/09-decisions/README.md
  - docs/09-decisions/ADR-0013-bounded-interface-composition.md
  - docs/09-decisions/ADR-0014-stable-home-context-panel.md
  - docs/09-decisions/ADR-0015-context-rooms.md
  - docs/09-decisions/ADR-0016-explicit-home-room-row.md
  - docs/10-execution/backlog.md
  - docs/10-execution/brainstorming-alignment.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/task-packets.md
  - docs/10-execution/sessions/2026-09-19-harbour-blue-home-round-4.md
---

# Session — Explicit Scroll Row Home selection

## Scope and authority

After reviewing round 4, Simon explicitly selected option A — Explicit Scroll
Row as the Home composition to use and develop in future sessions. He described
it as the most accessible and direct option while still looking great and asked
that the choice be recorded throughout the Obsidian vault and selected folder.

This is explicit authority to accept the composition direction and resolve the
conflict with ADR-0014's earlier zero-or-one Home-region limit. It does not
authorize frontend or Android implementation, persistent room data, Figma
authoring, device work, participant research or a release-gate change. The
mockup-only 2026-09-19 primary-checkout exception remains in force; unrelated
local edits and private Obsidian settings were preserved.

## What changed

- Created the stable [selected reference folder](../../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md)
  with an unchanged copy of the selected raster and future-session rules.
- Added accepted [ADR-0016](../../09-decisions/ADR-0016-explicit-home-room-row.md)
  and deprecated ADR-0014 for Context Rooms composition while preserving its
  stable-anchor history and simpler MVP baseline.
- Added CMP-012 for the explicit Home room portrait row and propagated the
  selected hierarchy through PRD-FR-002/022, SCR-003/016, J-009, traceability,
  access, privacy/threats and the Context Rooms design plan.
- Updated T-119's backlog/packet to start from the selected row and cover
  no-room, one-room, all-fit, overflow, image-failure and responsive states.
- Updated AGENTS, docs map, Cockpit, current milestone, open questions, mockup
  gallery and the historical generation brief so future sessions do not reopen
  the earlier Home comparison.

## Accepted boundary

Future Context Rooms design and development starts from the stable Round
composer, optional compact continuation, open unframed portraits, live written
name/purpose, written Previous/Next for true overflow and written See all rooms.
The row is not a tile grid or mandatory category choice. When all Rooms fit,
the interface must not imply false overflow; at large text or narrow width it
must become a vertical/direct-list treatment while preserving composer access.

Selection does not establish exact fonts/colors, Android dp/sp, TalkBack or
switch behavior, focus retention, 200%/300% reflow, comprehension, persistence
or production feasibility. EVAL-008/012 and T-119 retain those obligations.

## Evidence and handoff

The selected PNG is byte-preserved from round 4 option A and was inspected at
original detail again in this session. `python3 scripts/cockpit.py --write`
regenerated the snapshot with 55 records and `python3 scripts/cockpit.py
--check` passed. `git diff --check` passed. The selected README was opened in
the primary `docs` Obsidian vault; Obsidian reported the README note open on
workspace 4.

`python3 scripts/validate-docs.py` could not complete: the existing dirty
checkout concurrently contains unrelated tracked deletions of
`claude-code-design-system-handoff.md`, `claude-design-frontend-metaprompt.md`
and `claude-design-handoff.md`; the validator raises `FileNotFoundError` on the
first missing path before link validation. Those user-owned deletions were not
restored or changed. The prior mockup round had 14 separate pre-existing
style-board/notes validation errors. Runtime, renderer interaction and human
review remain unrun.

No commit, push, PR or merge is performed under the current mockup-only local
iteration exception. The next bounded task is a responsive/state handoff for
CMP-012 or a separately authorized T-119 fictional-data implementation.
