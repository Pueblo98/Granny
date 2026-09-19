---
title: "Prepare shared-state frontend implementation metaprompt"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, implementation, metaprompt]
related:
  - ../../02-design/mockups/2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md
  - ../../02-design/shared-conversation-state-surfaces.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex shared-state implementation handoff session
branch: docs/shared-state-implementation-metaprompt
base_commit: fb782b27074435adc65e700e0a90b64edfe608d6
next_action: Paste the metaprompt into the active frontend session and implement the shared state family without replacing Home or the current Room.
changed_paths:
  - docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/README.md
  - docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md
  - docs/02-design/shared-conversation-state-surfaces.md
  - docs/10-execution/current-milestone.md
---

# Scope and authority

Simon requested a metaprompt for the active session currently building the UI.
The handoff explains every shared-state reference and directs that session to
implement them as reusable bottom-connected surfaces over the existing Home and
Rooms. This session prepares and publishes the handoff only; it does not edit
the frontend.

# What changed

The metaprompt gives the active implementation session exact source/image
paths, integration rules, state-specific copy and controls, place-versus-state
architecture, Harbour Blue roles, responsive/accessibility behavior,
deterministic coverage, boundaries and stop point. It explicitly preserves the
active session's current branch and useful code rather than restarting work.

It asks the lead session to remain the integration authority while optionally
using Terra sub-agents for bounded read-only audits. It requires proof over both
Home and one decorated Room before the shared renderer is wired into every
already-implemented Room.

# Evidence

- `python3 scripts/cockpit.py --write` refreshed the derived snapshot;
  `python3 scripts/cockpit.py --check` passed with 74 session records, 13
  Canvas nodes / five edges and three Base views / embeds.
- `python3 scripts/validate-docs.py` passed with zero errors across 213 Markdown
  files and 2,737 local links. The documentation-tool regression suite passed
  47 tests, and `git diff --check` passed.

No frontend source, runtime, browser render, Android, device or participant test
was changed or run by this documentation-only session.

# Handoff

Paste the metaprompt into the active implementation session. That session owns
source inspection, code changes, rendered comparison, regression evidence and
its own scoped publication record. It must stop after the seven shared surfaces
rather than expanding product scope.
