---
title: "Session — Explicit Scroll Row frontend implementation metaprompt"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, implementation, metaprompt]
related:
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/FRONTEND-IMPLEMENTATION-METAPROMPT.md
  - ../../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../../02-design/browser-prototype.md
  - ../../09-decisions/ADR-0016-explicit-home-room-row.md
  - ../backlog.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: main
next_action: "Paste the selected-Home implementation metaprompt into a fresh development session and implement only its bounded browser checkpoint."
changed_paths:
  - docs/README.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/README.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/FRONTEND-IMPLEMENTATION-METAPROMPT.md
  - docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
---

# Session — Explicit Scroll Row frontend implementation metaprompt

## Scope and authority

Simon asked for a new-session metaprompt that first understands the selected
Harbour Blue design and existing frontend visually and technically, then
actually implements the chosen Home including scroll behavior and honest
placeholders for unresolved assets such as a final logo.

In a follow-up, Simon clarified that the existing mock UI must be viewed and
assessed because it contains prior work even though its visual result was poor.
He authorized reusing, adapting or deleting its in-scope code as necessary and
asked the implementation lead to orchestrate parallel work with Terra
sub-agents.

This session prepares that execution prompt; it does not modify prototype code.
The next session is authorized for the selected SCR-003/CMP-010–012 Home in the
existing dependency-free browser prototype only. Full SCR-016/SCR-017, Context
Rooms persistence/context, Android, Figma, provider access and real data remain
excluded.

## What changed

- Added the [implementation metaprompt](../../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/FRONTEND-IMPLEMENTATION-METAPROMPT.md)
  next to the accepted selected reference.
- Required original-detail inspection of the selected Home and Harbour Blue
  board, followed by technical inspection of the existing shell, renderer,
  in-memory state, CSP/server and browser regression checks.
- Required the next session to run and visually inspect the current rendered
  mock before editing, then document a `reused / adapted / replaced / removed`
  inventory. The prompt allows deletion of mapped, obsolete, version-controlled
  UI presentation while protecting workflows, safety contracts and tests.
- Added a lead-orchestrator pattern with up to three parallel
  `gpt-5.6-terra` sub-agents for legacy-UI, visual/accessibility and test audits,
  followed by optional parallel read-only review. Shared production-file edits,
  scope decisions, validation and final handoff remain with the lead agent.
- Defined real overflow detection, truthful Previous/Next states, keyboard and
  focus behavior, live-region updates, gesture-independent See all rooms,
  large-text vertical fallback and image-failure behavior.
- Kept room interiors, full library functionality and persistence out of the
  first checkpoint while requiring working, clearly labeled fictional
  placeholder destinations instead of dead controls.
- Linked the handoff from the selected folder, design gallery, docs map,
  browser owner, milestone and T-119 status without claiming implementation.

## Evidence

The prompt was checked against ADR-0016, SCR-003/016/017, CMP-007/010–012,
T-119, the selected Home/Harbour Blue references, the prototype source map and
its documented test commands. No browser implementation, screenshot,
accessibility technology, Android/device test or human review ran in this
documentation-only preparation session.

`python3 scripts/cockpit.py --write` regenerated the snapshot with 58 records,
and `python3 scripts/cockpit.py --check` passed. The full
`python3 scripts/validate-docs.py` check could not start link validation because
the existing dirty checkout contains an unrelated tracked deletion of
`docs/02-design/claude-code-design-system-handoff.md`; the script raises
`FileNotFoundError` on that missing input. After the Terra-orchestration and
legacy-UI refinement, full `git diff --check` passed. An explicit
trailing-space scan of both new Markdown files returned no matches. The three
deepest new frontmatter references resolved to the expected existing browser,
ADR and task packet files. `python3 -m unittest discover -s scripts -p
'test_*.py'` passed 47 tests; its internal fixture intentionally printed
`fatal: Needed a single revision` while the suite still completed `OK`.

The Obsidian URI for the new metaprompt was processed successfully. A follow-up
window-manager query could not confirm the rendered note because no usable
Hyprland client JSON was available in this shell, so in-app rendering remains
unverified.

The primary checkout already contained extensive unrelated design edits and
three tracked handoff deletions; they were preserved and are not part of this
session.

## Handoff

Copy the fenced prompt into a fresh implementation session. The code session
must use the normal executable-work worktree/branch workflow, preserve the dirty
primary vault, produce its own contemporaneous record and stop at the selected
Home checkpoint. It must report any dependency caused by selected design files
that are not yet present in its clean task base rather than copying unrelated
primary changes.
