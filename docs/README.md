---
title: "Stage 1 documentation map"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [navigation]
related:
  - 10-execution/current-milestone.md
  - 10-execution/development-readiness.md
  - 01-product/prd.md
  - 09-decisions/README.md
---

# Documentation map

**Active experience direction:** [Context Rooms](02-design/context-rooms.md) · [accepted decision](09-decisions/ADR-0015-context-rooms.md) · [visual asset system](02-design/context-room-visual-system.md) · [Kitchen/Fitness starter catalog](02-design/context-room-starter-catalog.md) · [generation handoff](02-design/context-room-asset-production.md) · [T-119 prototype packet](10-execution/task-packets.md#t-119-packet). Preserve one global assistant and quiet Home; prototype optional rooms with fictional data and reviewed local visual packs before persistent implementation.

**Start here for development oversight:** [Cockpit](Cockpit.md) · [visual map](Development.canvas) · [session/message views](10-execution/cockpit.base) · [agent board](10-execution/agent-board.md). [Cockpit guide](10-execution/cockpit-guide.md) owns update/refresh rules. [Conversation-first build](02-design/conversation-first-plan.md) remains the shell foundation; Context Rooms is the next design/contract slice. [Its earlier build record](10-execution/sessions/2026-09-14-conversation-build.md) separates implemented simulation, review and production evidence.

**Stage 1 stock-Android tablet app only.** Granny is a temporary codename. Vision, App MVP, App V1, later App, future Stage 2 OS and future Stage 3 hardware are separate scopes in [product scope](01-product/scope-and-roadmap.md). docs/ is the Obsidian vault; the whole Git repository is the project source of truth. Ignored Obsidian JSON is private local user state.

Local backend/MCP experiment: [versioned runtime contract](04-architecture/conversation-runtime-contract.md) · [startup/tests](../prototypes/conversation-runtime/README.md) · [T-117 evidence](10-execution/sessions/2026-09-15-mcp-backend-integration.md). Next offline engineering handoff: [complete T-103 authority-core sprint](10-execution/t103-backend-sprint-handoff.md). Actual local execution uses fictional data; production Android gates remain unchanged.

Latest Simon-authored planning input: [class brainstorming capture](08-research/source-material/2026-09-17-class-brainstorming.md) · [resolved OQ-14 alignment packet](10-execution/brainstorming-alignment.md). All six product conflicts have explicit direction; visual and human evidence remains open.

## First read / current state

[Current milestone](10-execution/current-milestone.md) → [readiness/gates/DoR](10-execution/development-readiness.md) → [backlog](10-execution/backlog.md) → [open decisions](10-execution/open-questions.md). The development-readiness specification is written for review. It does not establish runtime feasibility, user demand or final brand acceptance. Start bounded fake-interface/evidence work, not broad MVP implementation.

## Canonical owners

| Area / question | Read here |
|---|---|
| Long-term intent / principles | [Vision](00-vision/product-vision.md), [principles](00-vision/product-principles.md); mixed-stage source is context only |
| What is required, for whom, in which release? | [PRD](01-product/prd.md), [scope/capability map](01-product/scope-and-roadmap.md), [proto-personas/jobs](01-product/personas.md) |
| What happens end to end? | [26 use cases](01-product/use-cases.md), [9 journeys](01-product/user-journeys.md), [requirement traceability](01-product/traceability.md) |
| What does the user see/control in every state? | [Product design spec](02-design/product-design-spec.md), [semantic components](02-design/design-system.md), [Context Rooms direction](02-design/context-rooms.md), [room visual system and starter catalog](02-design/context-room-visual-system.md) |
| How does it speak and remain accessible? | [Voice/content](02-design/voice-ux.md), [accessibility](02-design/accessibility.md) |
| What is the brand and name option space? | [Brand/4 identities](02-design/brand-and-visual-identity.md), [naming/screening/iteration](02-design/naming-exploration.md), [local boards](02-design/identity-review.html) |
| Where do we design and review the app now? | [Browser design/handoff](02-design/browser-prototype.md), [run the prototype](../prototypes/stage-1/README.md), [token handoff](../design-tokens/README.md); [Figma](02-design/figma.md) is paused, final identity unaccepted |
| How does the agent interpret, plan and recover? | [Behavior](03-agent/agent-behavior.md), [autonomy integration](03-agent/autonomy-model.md), [device control](03-agent/device-control.md) |
| What typed capabilities and memory interfaces exist? | [Tools](03-agent/tool-contracts.md), [memory contract](03-agent/memory-system.md) |
| Where are component/data/trust boundaries? | [Root map](../ARCHITECTURE.md), [system contract](04-architecture/system-overview.md) |
| What may execute, confirm or never happen? | [Canonical action matrix](05-safety-privacy/action-policy.md); agent/UX link here, not duplicate policy |
| What data is kept/shared/deleted, and who helps? | [Privacy/data/helper rules](05-safety-privacy/safety-and-privacy.md), [threat model](05-safety-privacy/threat-model.md) |
| How do we prove quality and classify failure? | [Canonical evals](06-evals/canonical-tasks.md), [metrics/strategy](06-evals/eval-strategy.md), [failure taxonomy](06-evals/failure-taxonomy.md) |
| What stock hardware is actually known? | [Reference tablet](07-hardware/reference-hardware.md); exact inventory pending, Stage 3 inactive |
| What evidence exists and what comes next? | [Source register](08-research/README.md), [Android feasibility](08-research/android-stage-1-feasibility.md), [research program](08-research/research-plan.md) |
| What is accepted versus proposed? | [ADR index](09-decisions/README.md); twelve accepted records including the MVP control posture, automatic-memory/adaptive-communication, bounded-composition, one-panel Home and Context Rooms decisions, two proposals, one deprecated historical record |
| How do agents maintain this system? | [AGENTS](../AGENTS.md), [session lifecycle skill](../.agents/skills/granny-session-lifecycle/SKILL.md), [automated maintenance and visibility checks](10-execution/cockpit-guide.md#automated-maintenance-contract), and [UI/UX skill provenance](10-execution/ui-ux-skills.md); [CLAUDE](../CLAUDE.md) delegates to AGENTS |
| How is work isolated and published? | [Git worktrees, push verification and reviewed integration](10-execution/git-workflow.md); [repository reconciliation metaprompt](10-execution/repository-reconciliation-metaprompt.md) for branch/PR audits; standing task-branch pushes plus checked documentation-only PR/main integration and safe vault synchronization |
| How do we move from specs to bounded work? | [Delivery workflows and repo skills](10-execution/operating-workflows.md), [first task packets](10-execution/task-packets.md) |
| What happens at dispatch, Stop, crash and recovery? | [Execution transaction protocol](03-agent/execution-protocol.md); tool schemas and policy remain their existing owners |
| When is an adapter/build actually supported? | [Capability admission and support lifecycle](04-architecture/capability-admission.md) |
| How do we collect and judge evidence? | [Evidence protocol](06-evals/evidence-protocol.md), [research execution protocols](08-research/research-protocols.md) |

## Knowledge conventions

Canonical Markdown frontmatter includes title, status, owner Simon, actual last_updated date, tags and relative related paths. Editorial statuses: draft/proposed/review/accepted/deprecated. Requirement status confirmed/proposed/evidence-needed/blocked is separate; tests can be unrun. Only Simon or already accepted authority confers acceptance. Label facts, inference, proposals and unknowns; do not invent participants/results or treat primary-source documentation as measured device evidence.

PRD-OUT/FR/ACC/SAF/PRV/NFR/DST-### are current requirements; REQ-### are retired aliases in PRD. UC/J/SCR/CMP/EVAL/T IDs, CAP/RES/GATE IDs and ADR numbers retain identity; never recycle or renumber to tidy history. Explicit anchors make links stable. [Traceability](01-product/traceability.md) connects jobs→requirements→use cases/journeys/screens/components→contracts/policy→tasks→eval/research, with code and results absent until real.

Update one canonical owner, affected downstream contracts/evals and dates/links. Consequential changes need ADR options and authority; routine copy does not. A capability is incomplete without verified outcome, cancellation and safe failure coverage. Screen content remains untrusted data. Standard relative Markdown links work across GitHub/editors/Obsidian.

## Sources, templates and checks

Preserved [Dream Book PDF](00-vision/dream-book.pdf)/[TeX](00-vision/dream-book.tex), [handoff](08-research/source-material/initialization-handoff.md) and [conversation](08-research/source-material/planning-conversation.md) remain inputs, not new acceptance. [Source register](08-research/README.md) records hashes. The [mission metaprompt](10-execution/astra-stage-1-planning-metaprompt.md) is retained historical assignment context, not a next task to repeat.

Templates: [spec/requirement](_templates/spec.md), [ADR](_templates/adr.md), [use case](_templates/use-case.md), [journey](_templates/user-journey.md), [eval](_templates/eval.md), [research](_templates/research-note.md). Replace prompts, add actual relative links and today's modification date; no empty stubs as deliverables. Run `python3 scripts/validate-docs.py` from repository root; exact results in [readiness](10-execution/development-readiness.md).

Execution templates: [task packet](_templates/task-packet.md), [design handoff](_templates/design-handoff.md), [gate review](_templates/gate-review.md). Repository SKILL.md files use their host packaging schema, with owner/status/date under metadata; the validator checks them separately. Run `python3 -m unittest discover -s scripts -p 'test_*.py'` when changing the documentation checker. Structural validation does not prove skill behavior or fresh-session discovery.
