---
title: "Accept bounded composition and expand low-clutter Home directions"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, session, design, decision]
related:
  - ../brainstorming-alignment.md
  - ../open-questions.md
  - ../../09-decisions/ADR-0013-bounded-interface-composition.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex bounded-composition decision session
branch: docs/bounded-composition-2026-09-17
next_action: Simon selects or refines the Home hypothesis before a new visual design session freezes composition.
changed_paths:
  - docs/02-design/claude-design-handoff.md
  - docs/02-design/conversation-first-plan.md
  - docs/02-design/design-system.md
  - docs/03-agent/agent-behavior.md
  - docs/03-agent/tool-contracts.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/threat-model.md
  - docs/06-evals/canonical-tasks.md
  - docs/09-decisions/ADR-0013-bounded-interface-composition.md
  - docs/09-decisions/README.md
  - docs/10-execution/brainstorming-alignment.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/sessions/2026-09-17-oq14-decisions.md
  - docs/README.md
---

# Accept bounded composition and expand low-clutter Home directions

## Scope and authority

Simon explicitly accepted bounded composition as the generated-interface boundary. He remains undecided about Home because both conversation-first simplicity and glanceable value are attractive, while a crowded widget surface is undesirable. This session records the accepted boundary and expands Home hypotheses without selecting one.

## Decision propagation

[ADR-0013](../../09-decisions/ADR-0013-bounded-interface-composition.md) allows automatic task-specific composition from registered semantic components and typed slots. Renderer-owned semantics/reflow and policy-owned actions remain independent of model output. Arbitrary executable UI, novel consequential labels and removal/movement of stable controls are unavailable. Design system, handoff, agent/tool and architecture owners now agree; threat/eval cases cover composition attacks.

## Home exploration

The alignment brief adds quiet anchor, one glance panel, closed Today drawer, resume-first and user-selected calm-mode directions. Based on W3C accessibility/older-user guidance, it recommends testing a stable anchor plus at most one optional verified context panel against a pure quiet anchor. This is a design hypothesis, not older-adult research evidence or acceptance.

## Evidence and handoff

Documentation validation, cockpit freshness, handoff coverage, documentation-tool tests and whitespace checks are run before publication. No UI implementation, Figma authoring, participant study or gate promotion occurs. The primary Obsidian vault is updated only after reviewed integration under the repository workflow.
