---
title: "Navigation and supporting surfaces implementation metaprompt"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, implementation, navigation]
related:
  - ../../02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/NAVIGATION-SUPPORTING-SURFACES-IMPLEMENTATION-METAPROMPT.md
  - ../../02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex navigation implementation-handoff session
branch: main
base_commit: 89f766d3f932dbe8787ede4f31ab32052b2acbfd
next_action: The authorized Astra frontend session implements and verifies the thirteen references, then stops at its reviewed mixed-task branch and PR boundary.
changed_paths:
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/NAVIGATION-SUPPORTING-SURFACES-IMPLEMENTATION-METAPROMPT.md
  - docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/README.md
  - docs/10-execution/current-milestone.md
---

# Scope and authority

Simon approved the navigation and supporting-surface visual direction and asked
for a specification metaprompt explaining every screen to the active Astra
frontend implementation session. This change documents that implementation
handoff only. It does not edit frontend/native code, request permissions,
persist data, merge mixed work or claim device/human evidence.

# What changed

The accepted metaprompt maps all thirteen references to purpose, exact
fictional content, entry/exit, state ownership, focus and responsive behavior.
It distinguishes overlays, supporting destinations, inline return outcomes and
first-run setup; defines shared navigation state and required journeys; and
specifies accessibility, privacy, safety, test and Git boundaries.

The iteration README and milestone now link the handoff and record Simon's
approval to implement the direction without treating raster geometry as a
production specification.

# Evidence

- The metaprompt was checked against SCR-001–SCR-003, SCR-008–SCR-012,
  SCR-014–SCR-017 and CMP-001, CMP-003, CMP-006–CMP-009.
- It preserves the accepted Harbour Blue system, stable conversation shell,
  direct written navigation, exact-preview and Stop contracts.
- `python3 scripts/cockpit.py --write` refreshed the derived snapshot;
  `python3 scripts/cockpit.py --check` passed with 86 session records, 13
  Canvas nodes / five edges and three Base views / embeds.
- `python3 scripts/validate-docs.py` checked 249 Markdown files and 3,035 local
  links. It reported only the two pre-existing untracked personal notes,
  `docs/Notes.md` and `docs/To do table features.md`, which lack frontmatter;
  this session did not modify them.
- Manifest JSON parsing and `git diff --check` passed.
- `python3 scripts/check_handoff.py --base origin/main` remained non-green
  because the dirty primary checkout contains unrelated untracked `.claude`,
  `.playwright-mcp`, Context Room asset/mockup and personal-note paths. This
  session neither modified nor claimed those paths; its three scoped changed
  paths are covered by this record.
- Browser implementation, responsive rendering, Android behavior, permissions,
  persistence, external-app verification and comprehension remain unrun here.

# Handoff

Paste the linked metaprompt into the existing Astra implementation session. It
must inspect and reuse the current frontend, implement all thirteen references,
run the repository checks, push its scoped branch and stop before merge unless
Simon separately authorizes integration.
