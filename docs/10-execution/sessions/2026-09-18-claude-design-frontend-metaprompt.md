---
title: "Prepare Claude Design frontend build metaprompt"
status: proposed
owner: Simon
last_updated: 2026-09-18
tags: [execution, session, design, handoff]
related:
  - ../../02-design/product-design-spec.md
  - ../../02-design/design-system.md
  - ../../09-decisions/ADR-0013-bounded-interface-composition.md
  - ../../09-decisions/ADR-0014-stable-home-context-panel.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Claude Design handoff session
branch: docs/claude-design-frontend-metaprompt
base_commit: ed439325
next_action: Paste the execution metaprompt into the synced Claude Design project and build the zero-panel Home plus complete fictional David message flow as the first editable checkpoint.
changed_paths:
  - docs/02-design/claude-design-frontend-metaprompt.md
  - docs/02-design/claude-design-handoff.md
  - docs/10-execution/current-milestone.md
---

# Scope and result

Simon requested a substantial Claude Design metaprompt to begin developing the
Stage 1 frontend after the design-system sync, using the selected Codex
conversation interaction and the product's low-control, straightforward design
principles. The resulting prompt is self-contained enough to start the core
shell and message flow while routing Claude Design to the canonical product,
accessibility, safety and component contracts.

The prompt targets the actual synced Claude Design project and exact source
revisions. It directs execution rather than another broad concept exercise:
zero-panel Home and the full fictional David message path first, then the other
four MVP flows, supporting routes, responsive states and accessibility
annotations. It requires a visible control inventory so each button earns its
place and rejects capability tiles, prompt-chip walls, generic AI styling and
dashboard composition.

# Reconciliation of completed design streams

The design-system package was completed at `17658b0`, while Simon's accepted
Round conversation selection is recorded separately at `8d84fbd`. The synced
`0.1.0` registry also predates ADR-0014's CMP-010 Home context panel. The prompt
does not claim these later decisions already exist in the synced component
package. It tells Claude Design to use the Round shape as an accepted app
composition delta, default to the valid zero-panel Home, annotate one proposed
CMP-010 state and return both gaps to the design-system owner.

All synced visual values remain proposed. Preparing this handoff does not
author the external Claude Design frontend, change behavior, accept a brand,
implement Android code, run participant/device evidence or advance a gate.

# Evidence and handoff

Documentation validation passed with 138 Markdown files and zero errors.
Cockpit freshness passed with 36 records, scoped handoff coverage passed and
`git diff --check` passed. All 47 documentation-tool unit tests passed. No
runtime, browser, native Android,
accessibility-device or human test is represented by those checks. The task
uses the existing design-sync record and reads the synced component contracts
without modifying the external Claude Design project.
