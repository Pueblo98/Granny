---
title: "Core outcome modules implementation metaprompt"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, implementation, metaprompt]
related:
  - ../../02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/CORE-OUTCOME-MODULES-IMPLEMENTATION-METAPROMPT.md
  - ../../02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex core-outcome implementation handoff session
branch: docs/core-outcome-modules-metaprompt
base_commit: dab237a9acef30f7e2a66c16ce84dce9a01b76dc
next_action: Paste the accepted metaprompt into the active Astra frontend session; implementation stops at its reviewed mixed-work branch boundary.
changed_paths:
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/CORE-OUTCOME-MODULES-IMPLEMENTATION-METAPROMPT.md
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/README.md
  - docs/10-execution/current-milestone.md
---

# Scope and authority

Simon requested an implementation metaprompt that explains every screen in the
reviewed core-outcome batch in depth. This session prepares that handoff for the
existing Astra frontend session; it does not edit frontend code, implement an
outcome, contact a service or authorize mixed-work integration.

# What changed

The accepted metaprompt explains all ten references across five reusable inline
module families. It defines the shared compositional rule, exact fictional
fixtures, entry and exit behavior, controls, source and outcome truth,
responsive collapse, focus/semantic requirements, state transitions, visual
review and regression coverage.

It directs the implementation session to audit and reuse its current code,
allows bounded refactoring or removal of obsolete in-scope mock UI, and asks
the Astra lead to orchestrate up to three bounded Terra audits when useful. It
explicitly prevents these modules from becoming top-level tabs or mini-app
dashboards and stops before the unspecified navigation/supporting-surface
batch, real services, Android or main integration.

# Evidence

The handoff was checked against the ten full-size selected images, their README
and manifest, the shared state-surface contract, browser prototype ownership,
SCR/CMP sources, accessibility/voice requirements and action policy. Repository
validation produced these results:

- `python3 scripts/cockpit.py --write` refreshed the snapshot; `--check`
  passed with 81 session records, 13 Canvas nodes / five edges and three Base
  views / embeds.
- `python3 scripts/validate-docs.py` passed with zero errors across 230
  Markdown files and 2,909 checked local links.
- Handoff coverage and `git diff --check` passed.

No browser implementation, screenshot comparison, device/accessibility test,
service integration or human comprehension study ran in this documentation
session.

# Handoff

Paste the metaprompt into the active Astra implementation session. That session
must inspect its actual branch and current UI before editing, then stop at a
reviewed mixed-work branch/PR boundary. The next review asks whether all five
outcomes feel like parts of one conversation rather than separate mini-apps.
