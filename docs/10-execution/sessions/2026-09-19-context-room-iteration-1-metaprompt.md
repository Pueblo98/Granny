---
title: "Prepare Context Room iteration-1 asset metaprompt"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, session, design, context, rooms, assets, metaprompt]
related:
  - ../../02-design/context-room-iteration-1-metaprompt.md
  - ../../02-design/context-room-starter-catalog.md
  - ../../02-design/context-room-asset-production.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Context Room asset metaprompt session
branch: main
base_commit: dc9efd897adc5a2c5f93ab629ff7ac1a211e1b1d
next_action: Run the metaprompt in a fresh image-generation session to create and review the 84 separate iteration-1 assets across all six rooms.
changed_paths:
  - docs/02-design/context-room-iteration-1-metaprompt.md
  - docs/02-design/context-room-asset-production.md
  - docs/10-execution/current-milestone.md
  - docs/README.md
---

# Scope and authority

Simon requested a compact metaprompt for a new session to generate iteration 1
of every defined Context Room asset. He clarified that the session should read
the canonical files and dossiers as it works, keep one continuous art narrative
and generate one image per asset rather than composite contact sheets.

# What changed

The metaprompt covers only K01, F01, T01, G01, R01 and P01. For each room it
requests one mark, portrait, backdrop, decor cluster, motif, empty state and
eight separately generated collection symbols: 14 files per room and 84 total.
It directs the execution session to establish a shared visual bible, reread each
room dossier before generation, use one image call per asset, inspect and file
each result immediately, and preserve exact prompt/manifest evidence.

The production brief, current milestone and docs map link the metaprompt. This
session created no image assets, UI implementation, runtime generation path or
accepted production art.

# Evidence

`python3 scripts/cockpit.py --check` passed with 58 records, 13 Canvas nodes,
five edges and three Base views/embeds. `git diff --check` passed. A scoped
frontmatter/link/invariant check passed for the metaprompt, production brief and
session record, including the separate-image, 84-file, no-contact-sheet and
shared-visual-bible requirements.

The full `python3 scripts/validate-docs.py` run remains blocked before
validation by the unrelated locally deleted
`docs/02-design/claude-code-design-system-handoff.md`; that concurrent deletion
was preserved. The metaprompt was checked against the six room dossiers, the
selected Harbour Blue reference, the asset-role contract and the built-in
image-generation workflow.

# Handoff

The documentation was written directly in the primary checkout under the
mockup-only workflow exception and preserves unrelated local work. The fresh
session should execute the prompt through all six rooms without asking Simon to
supervise every asset, then stop for review before packs 02–08 or UI work.
