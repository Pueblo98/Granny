---
title: "Separate design-system construction from app design handoffs"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, session, design]
related:
  - ../../02-design/claude-code-design-system-handoff.md
  - ../../02-design/claude-design-handoff.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex design handoff session
branch: docs/separate-design-handoffs
next_action: Start Claude Code with the system-construction brief; use the separate app-design brief after product decisions.
changed_paths:
  - docs/02-design/claude-code-design-system-handoff.md
  - docs/02-design/claude-design-handoff.md
  - docs/02-design/design-system.md
  - docs/02-design/figma.md
  - docs/10-execution/current-milestone.md
---

# Scope and result

Simon requested separate files, not a combined bundle: first a Claude Code assignment to construct brand guidance, visual foundations, tokens and components and then use /design-sync; second a later Claude Design assignment for app composition. The prior combined handoff mixed system construction and Figma authoring with app design. This change separates their inputs, deliverables and completion criteria.

The system brief carries source-linked brand vision, proposed Open Day review values with a challenger, accessibility requirements, reusable source deliverables and the verified documented role of /design-sync. It does not claim execution, install dependencies, select an accepted identity or decide Home/interface authority. The existing handoff becomes app-design-only and consumes the resulting system. No archive is generated.

## Validation

Documentation validation passed with 0 errors; cockpit freshness, scoped handoff coverage and whitespace checks passed. No runtime or external sync was performed; this is a documentation handoff, not a completed design system. Publication follows on the named branch; exact commits are available in this record's Git history.
