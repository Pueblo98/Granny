---
title: "Session — Context Rooms visual cleanup"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, prototype, context-rooms]
related:
  - ../backlog.md
  - ../../02-design/browser-prototype.md
  - ../../02-design/mockups/2026-09-20-context-rooms-cleanup/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/explicit-scroll-row-home
next_action: "Simon reviews the brighter outlines and artwork balance in the local preview; mixed-code integration remains separate."
changed_paths:
  - prototypes/stage-1/app.js
  - prototypes/stage-1/index.html
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/room-ui.js
  - prototypes/stage-1/room-library.js
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/browser-check.mjs
  - prototypes/stage-1/rooms-browser-check.mjs
  - prototypes/stage-1/README.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/design-system.md
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/README.md
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/home-six-rooms.png
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/kitchen-overview.png
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/kitchen-conversation.png
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/rooms-library.png
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/kitchen-narrow.png
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/soup-200-text.png
  - docs/02-design/mockups/2026-09-20-context-rooms-cleanup/reading-art-disabled.png
---

# Context Rooms visual cleanup

## Scope and authority

Simon requested follow-up visual refinement of the existing T-119 frontend,
then clarified brighter mockup-blue outlines/important buttons (not all text),
and cropped/fading room portraits in room conversations. No new room behavior,
backend, storage, asset generation or native implementation was authorized.
Continued the existing isolated implementation worktree at
`/home/lgtw/Work/granny-worktrees/explicit-scroll-row-home`; primary dirty
changes and private Obsidian files remain untouched. Base inspected:
`9ff4762aeaf7b0539be4ef9f3c6676b5e94f9ecc`.

## Implementation and delegation

Lead implemented and integrated every production edit, inspected rendered
Home/Kitchen/conversation/narrow screens, and owns final validation. Terra
code audit was read-only and found no blocking regression; its narrow-mode
scroll caveat is the intentional canonical vertical fallback. Terra test
agent exclusively changed `rooms-browser-check.mjs`, adding artwork,
overflow and conversation-portrait assertions; lead reviewed the complete diff.
No concurrent edits of shared production files occurred.

Reused: six-room data, all 48 collection targets, search/detail/source/creation
flows, global assistant state, safe scripted workflows, Round composer tail
and focus, responsive fallback and local-only server/CSP.

Adapted: Home/library decoration mapping to decor objects; continuation
portrait with image-error handling; overview/chat atmosphere; mark dimensions;
body 22px/500 text, line weight and room spacing; brighter `#0066DD` outline
and primary action role with Ink labels. This is a browser interpretation of
Simon's visual selection, not exact raster sampling or final brand approval.

Removed: obsolete room corner decor/motif overlay markup and CSS, plus visible
Home scrollbar chrome. Native scrolling, truthful written controls and all
room interactions remain. No assets or fixture categories were deleted.

Skills used: lifecycle isolated the change and scoped handoff; design-handoff
preserved semantic/accessibility contracts; task-slice bounded implementation;
UI-craft guided visual hierarchy and the rendered anti-template review.

## Evidence

Review screenshots and intentional differences are in the
[cleanup gallery](../../02-design/mockups/2026-09-20-context-rooms-cleanup/README.md).
Exact checks are recorded at handoff below. During validation, two legacy
font-size assertions expected the former 20px/60px sizes; updated to 22px/66px
while retaining baseline-reset and true combined-300%-scaling checks.

A repeat run exposed a delayed-focus race during rapid item → Ask navigation.
Lead fixed queued focus to target only the original still-connected element,
both in room transitions and shell destination entry, and added a same-frame
navigation regression. The test agent had finished its exclusive file work
before that lead-owned final addition.

Executed checks:

- `node prototypes/stage-1/model.test.mjs`: 67 pass.
- `node prototypes/stage-1/scheduler.test.mjs`: 7 pass.
- `node prototypes/stage-1/cloud.test.mjs`: 27 pass.
- `node prototypes/stage-1/serve.test.mjs`: 1 pass.
- `node prototypes/stage-1/home-browser-check.mjs`: 158 pass.
- `node prototypes/stage-1/browser-check.mjs`: 132 pass, all five workflows.
- `node prototypes/stage-1/runtime-browser-check.mjs`: 37 pass; wire fixtures,
  not a real provider call.
- `node prototypes/stage-1/rooms-browser-check.mjs`: 357 assertions including
  the lead's rapid-navigation regression (final result checked before push).
- `node prototypes/stage-1/rooms-review.mjs`: all 18 captures generated with
  no browser exceptions; seven scoped review images retained in the gallery.
- `python3 scripts/cockpit.py --write` and `--check`: pass, 63 records.
- `python3 scripts/validate-docs.py`: pass, zero errors after correcting
  the new gallery's relative documentation links.
- `python3 -m unittest discover -s scripts -p 'test_*.py'`: 47 pass.
- `git diff --check`: pass. Commit-range handoff checked before publication.

Browser-only evidence: native Android dp geometry, TalkBack, switch access,
physical tablet tests and user comprehension remain unrun. No font-fidelity
claim; existing transparent asset halos are not retouched. Narrow/large-text
room screens remove artwork and stack collections; Home uses the same direct
vertical fallback as before.

## Handoff

Preview: `http://127.0.0.1:4173`. Delivery is on the existing scoped task
branch; exact implementation commit is available in this record's Git history.
Mixed-code main merge is not authorized by standing documentation authority.
Next review: outline intensity and artwork balance, not reopening room behavior.
