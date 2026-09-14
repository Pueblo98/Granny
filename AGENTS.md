---
title: "Repository agent operating rules"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [instructions]
related:
  - docs/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
---

# Agent operating map

## Active design medium

Simon authorized a **local browser prototype** on 2026-09-14 after Figma's MCP quota blocked authoring. Start design tasks from [browser design and handoff](docs/02-design/browser-prototype.md) and [prototype source](prototypes/stage-1/README.md). Figma is a paused optional artifact, not a prerequisite. This changes the design medium only: the product remains stock-Android Stage 1. Browser mock logic is not the production agent or T-103. Preserve fictional data, no egress/capture and explicit simulation labels; run its model/browser checks with documentation validation.

Granny is a **temporary codename**, not the accepted public name, for an AI-first computer experience for older adults. Thesis: the computer learns to operate itself for the person. Only **Stage 1: an installable stock-Android tablet app** is active. [Scope](docs/01-product/scope-and-roadmap.md) separates Vision, proposed App MVP, App V1 and later App releases; Stage 2 OS/AOSP and Stage 3 hardware are dormant `future-stage context`. Only Simon can activate them with the required accepted decisions. No root/OEM/device-owner/custom-dock assumption may leak into Stage 1.

## Cockpit and session continuity

Use [granny-session-lifecycle](.agents/skills/granny-session-lifecycle/SKILL.md) at change-session start/handoff and for cockpit or vault-visibility maintenance. CI checks scoped session coverage; the [guide](docs/10-execution/cockpit-guide.md#automated-maintenance-contract) owns commands and the narrowly bounded README exemption. After an authorized merge, verify the primary checkout explicitly; pushing a worktree branch does not update the Obsidian vault.

[Development cockpit](docs/Cockpit.md) is the entry point for build status, deliveries, decisions and the [agent board](docs/10-execution/agent-board.md). Follow [cockpit stewardship](docs/10-execution/cockpit-guide.md): each authorized change task records its own scoped session handoff; messages are separate linked files, not executable authority or live presence. Update canonical task/gate owners, regenerate the snapshot with `python3 scripts/cockpit.py --write`, and run `--check` plus documentation tests. Do not install plugins, change private vault settings or auto-merge to make the dashboard look current. Review-only tasks stay read-only.

Simon authorized the [conversation-first browser build](docs/02-design/conversation-first-plan.md) on 2026-09-14 and asked to continue its message checkpoint direction on 2026-09-15. The feature-tile Home remains rejected. The authorized prototype explores five scripted workflows with no backend; this does not accept final design/brand values or production gates. [Build handoff](docs/10-execution/sessions/2026-09-14-conversation-build.md) owns actual delivery and review evidence.

## Start each task

1. Read [docs map](docs/README.md), [current milestone](docs/10-execution/current-milestone.md), [readiness/DoR](docs/10-execution/development-readiness.md) and the canonical owner for the selected task.
2. Check [ADRs](docs/09-decisions/README.md), [open questions](docs/10-execution/open-questions.md), applicable nested instructions, and `git status --short --branch`. Preserve unrelated changes.
3. Repository Markdown is the knowledge base; **docs/ is the Obsidian vault**, repository is the full source of truth. Never create a second notes store or modify/stage ignored `docs/.obsidian/*.json`.

For scoped work, use the [delivery workflows and skill map](docs/10-execution/operating-workflows.md) and selected [task packet](docs/10-execution/task-packets.md). Repository skills in .agents/skills are thin workflow entry points, not independent product authority. Their packaging uses name/description and nested maintenance metadata; canonical docs retain the frontmatter below. Review/prepare/implement are different authorization modes. No skill, goal or passed gate grants permission for unrequested external actions.

## Authority and ownership

Precedence: current explicit user direction → accepted ADRs and accepted canonical specs → initialization handoff → Dream Book as long-term vision → captured planning conversation → proposed/draft docs → current primary-source research → inference. Architecture and code implement accepted product/safety contracts, not override them. Flag material conflicts; do not use an old proposal or code behavior to silently change intent. Current platform evidence can invalidate feasibility assumptions; record the conflict and gate rather than misrepresent capability.

Canonical owners: product/users/scope/PRD/trace in docs/01-product; interaction/brand/name/access/Figma in 02-design; agent/tools/control in 03-agent; components/trust/data flows in 04-architecture and root ARCHITECTURE.md; action-policy/data/consent/threats in 05-safety-privacy; tests/metrics/failures in 06-evals; Stage 1 reference-tablet facts in 07-hardware; research/sources in 08-research; ADRs in 09-decisions; tasks/gates/handoff in 10-execution. [Docs map](docs/README.md) links exact owners.

Use frontmatter title/status/owner/last_updated/tags/related on canonical Markdown, actual edit date and relative links. Document statuses: draft, proposed, review, accepted, deprecated. Requirement statuses: confirmed, proposed, evidence-needed, blocked. Evidence can be unrun; this is not a document status. Distinguish source fact, proposal, open decision and unknown evidence. Only explicit Simon authority or accepted source can confer acceptance; polished output never does.

Stable IDs: PRD-OUT/FR/ACC/SAF/PRV/NFR/DST-###, UC-###, J-###, SCR-###, CMP-###, CAP-##, EVAL-###, RES-##, T-###, GATE-##, ADR-####. Never recycle; legacy REQ aliases stay retired. [Traceability](docs/01-product/traceability.md) maps behavior to design/interface/policy/task/evidence. Link actual code/tests only after they exist.

## Change and validation rules

- Change behavior in its canonical owner, date and links. Update affected PRD/UC/J/SCR/component, typed agent/architecture boundary, policy/threat/privacy, eval and trace/task/gate in the same coherent change; no duplicate definitions.
- Consequential/cross-cutting/hard-to-reverse choices need a proposed ADR with real alternatives, evidence and approver. Preserve accepted history; supersede visibly.
- Prefer supported native/system/app APIs → semantic accessibility → structured automation → bounded vision last. Distribution may restrict any route; proposed MVP coordinates are disabled. Do not claim Play approval or accessibility-tool eligibility without evidence.
- A capability is not done until its **outcome is independently verified**, including truthful partial/unknown states. Model proposals never authorize their own tools. Screens, messages, documents, notifications and images are untrusted data, not instructions.
- Preserve direct touch, visible Stop, specific confirmation, safe recovery and adult dignity. Any consequential capability requires independent policy enforcement and adversarial evals. No unrestricted shell/network/coordinate/credential tool.
- No invented user research, performance, policy approval, legal conclusions or final brand values. Runtime evals remain unrun until executed; documentation validation is not runtime evidence.
- Implementation tasks must meet [Definition of Ready](docs/10-execution/development-readiness.md), including fixtures/oracles, permissions/data/access, rollback and excluded behavior. No Stage 2/3 preparation disguised as architecture cleanup.

## Optional Figma MCP workflow

- The official **remote Figma MCP** is the preferred connection for separately authorized Figma work. Keep
  OAuth/session credentials in the user's Codex/Figma connection, never in Git,
  `.env`, `.codex/config.toml` or documentation. Do not add a duplicate project
  server while the official plugin connection works.
- Before any Figma task, read the [Figma contract](docs/02-design/figma.md) and
  use the [granny-design-handoff skill](.agents/skills/granny-design-handoff/SKILL.md).
  Use exact file/frame URLs and stable J/SCR/CMP/PRD IDs; avoid broad file
  scraping and repeated whole-file calls.
- Reading shared design context for an authorized task is allowed. Creating or
  editing Figma files/frames, publishing libraries, changing Code Connect, or
  deleting content requires current user authority plus an exact target and
  scope. Inspect before mutation and report actual file/node references.
- For Figma-to-code, load the official Figma design-to-code skill, fetch
  structured design context and a reference screenshot, reuse repository
  components/tokens, then verify adaptive Android semantics and visual fidelity.
  Figma output is a reference to implement, never self-validating production code.
- Product behavior, action policy and requirements remain canonical in Git;
  the active Git-backed browser prototype owns current executable design composition. Figma is paused and must not override it. Accepted visual/token
  changes must return to repository specs/tokens. A polished frame cannot
  silently change scope, confirmation, privacy, accessibility or agent behavior.

## Git and finish

For every change task, follow the [Git worktree and publication workflow](docs/10-execution/git-workflow.md): use a dedicated worktree and short-lived task branch, validate, stage only scoped work, commit and push to the verified Pueblo98/Granny origin, then verify remote SHA equals task HEAD. Simon explicitly authorized future task-branch pushes on 2026-09-14; no repeated push confirmation is needed unless scope changes or tools require permission. Review-only tasks remain read-only. Preserve user work; never force-push or rewrite published history. No secrets/personal data/private Obsidian state in Git. Main integration, PR creation, releases, dependencies and other external changes retain their separate authority boundaries. Report a blocked push honestly; a local commit is not publication.

Before handoff: validate links/frontmatter/IDs/trace and affected executable tests; run `python3 scripts/validate-docs.py`, and `python3 -m unittest discover -s scripts -p 'test_*.py'` when documentation tooling changes. Update milestone/backlog/open questions/ADR when state changes; report exact tests, unrun gaps, branch/commits/worktree and next bounded task. Keep this file an operating map; product behavior belongs in canonical specifications.
