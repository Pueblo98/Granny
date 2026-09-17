---
title: "Record four OQ-14 decisions and expand Home/interface choices"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, session, decisions, brainstorming]
related:
  - ../brainstorming-alignment.md
  - ../open-questions.md
  - ../../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex OQ-14 decision propagation session
branch: docs/oq14-decisions-2026-09-17
next_action: Simon chooses the Home model and generated-interface boundary after reviewing the expanded examples.
changed_paths:
  - docs/01-product/prd.md
  - docs/01-product/scope-and-roadmap.md
  - docs/01-product/traceability.md
  - docs/01-product/use-cases.md
  - docs/01-product/user-journeys.md
  - docs/02-design/conversation-first-plan.md
  - docs/02-design/product-design-spec.md
  - docs/02-design/voice-ux.md
  - docs/03-agent/agent-behavior.md
  - docs/03-agent/memory-system.md
  - docs/03-agent/tool-contracts.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/action-policy.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/05-safety-privacy/threat-model.md
  - docs/06-evals/canonical-tasks.md
  - docs/09-decisions/ADR-0010-local-authority-and-data.md
  - docs/09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md
  - docs/09-decisions/README.md
  - docs/10-execution/backlog.md
  - docs/10-execution/brainstorming-alignment.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/sessions/2026-09-17-brainstorm-import.md
  - docs/README.md
---

# Record four OQ-14 decisions and expand Home/interface choices

## Scope and authority

Simon explicitly retained the existing consequence-based approval policy and MVP/App V1/later release split. He chose automatic model-selected important-fact capture to minimize user work, and chose an explicit setup communication preference followed by silent optimization over time. Home and generated-interface direction remain open and receive concrete comparison material only.

## Propagation

[ADR-0012](../../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md) records the new accepted App V1 behavior. PRD-PRV-003, release scope, memory/agent/architecture contracts, action/privacy policy, screens/journey, threat model, T-111, EVAL-017 and traceability now agree on: explicit setup baseline; automatic typed direct-user fact capture; no per-fact confirmation; quiet receipt/Undo; review/correct/delete and pause/reset; no transcript archive, third-party fact mining, protected-trait inference or external-action authority.

The retained release split leaves MVP memory as explicit preferences/aliases and routes automatic personal facts/adaptation to App V1. The retained action policy continues exact fresh approval for external consequences and low-friction action for admitted reversible steps.

## Open discussion

The alignment brief compares conversation canvas, persistent dashboard and stable-conversation/pinned-shelf Home models. It separately compares fixed components, free-form generated UI and bounded composition, then explains how persistence and component freedom interact. No Home/component owner changes in this session.

## Evidence and handoff

Documentation validation, cockpit freshness, handoff coverage, documentation-tool tests and whitespace checks are run before publication. This change records product authority and specifications only; it does not implement memory, run EVAL-017, use real personal data or pass GATE-06/09. Primary Obsidian checkout remains dirty/stale and is not modified without resolution of its overlapping local action-policy edit.
