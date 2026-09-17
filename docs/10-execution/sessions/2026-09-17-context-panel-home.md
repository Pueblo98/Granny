---
title: "Resolve Home conflict with one optional context panel"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, session, design, decision]
related:
  - ../brainstorming-alignment.md
  - ../open-questions.md
  - ../../09-decisions/ADR-0014-stable-home-context-panel.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Home decision propagation session
branch: docs/context-panel-home-2026-09-17
next_action: Run the separate design-system and app-composition sessions using ADR-0014; compare the resulting one-panel Home with a quiet anchor in representative access/comprehension research.
changed_paths:
  - docs/01-product/prd.md
  - docs/01-product/traceability.md
  - docs/01-product/user-journeys.md
  - docs/02-design/claude-code-design-system-handoff.md
  - docs/02-design/claude-design-handoff.md
  - docs/02-design/conversation-first-plan.md
  - docs/02-design/design-system.md
  - docs/02-design/figma.md
  - docs/02-design/product-design-spec.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/05-safety-privacy/threat-model.md
  - docs/06-evals/canonical-tasks.md
  - docs/09-decisions/ADR-0013-bounded-interface-composition.md
  - docs/09-decisions/ADR-0014-stable-home-context-panel.md
  - docs/09-decisions/README.md
  - docs/10-execution/brainstorming-alignment.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/task-packets.md
  - docs/README.md
---

# Resolve Home conflict with one optional context panel

## Scope and authority

Simon explicitly selected the recommended low-clutter Home direction on 2026-09-17: stable conversation controls with zero or one context panel. “For now” is recorded as a current accepted, reversible product direction rather than final visual acceptance. This session resolves OQ-14's final product conflict and does not implement a UI, accept brand values or promote a gate.

## What changed

[ADR-0014](../../09-decisions/ADR-0014-stable-home-context-panel.md) fixes the Home boundary. PRD-FR-002 is confirmed; SCR-003 and new CMP-010 define the absent/present, privacy, focus and reflow behavior. The context panel can select only release-admitted verified information, does not add a new capability, and cannot expose unsolicited private detail or move stable controls. The design handoffs now explore visual treatments within that behavior instead of reopening a dashboard decision.

## Evidence

Documentation, cockpit, handoff and whitespace checks are run before publication. EVAL-007/008/012 are specifications for future accessibility, privacy and human evidence; no participant, Android or runtime test is claimed by this documentation change.

## Handoff

The OQ-14 product decision is complete. Final visual treatment and representative older-adult comprehension/access evidence remain open. The quiet conversation anchor is the safe fallback if the one-panel direction fails evidence.
