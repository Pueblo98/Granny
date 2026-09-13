---
title: "Repository agent operating rules"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [instructions]
related:
  - docs/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
---

# Agent operating map

Granny is a **temporary codename**, not the accepted public name, for an AI-first computer experience for older adults. Thesis: the computer learns to operate itself for the person. Only **Stage 1: an installable stock-Android tablet app** is active. [Scope](docs/01-product/scope-and-roadmap.md) separates Vision, proposed App MVP, App V1 and later App releases; Stage 2 OS/AOSP and Stage 3 hardware are dormant `future-stage context`. Only Simon can activate them with the required accepted decisions. No root/OEM/device-owner/custom-dock assumption may leak into Stage 1.

## Start each task

1. Read [docs map](docs/README.md), [current milestone](docs/10-execution/current-milestone.md), [readiness/DoR](docs/10-execution/development-readiness.md) and the canonical owner for the selected task.
2. Check [ADRs](docs/09-decisions/README.md), [open questions](docs/10-execution/open-questions.md), applicable nested instructions, and `git status --short --branch`. Preserve unrelated changes.
3. Repository Markdown is the knowledge base; **docs/ is the Obsidian vault**, repository is the full source of truth. Never create a second notes store or modify/stage ignored `docs/.obsidian/*.json`.

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

## Git and finish

Normal work uses short-lived feature/, fix/, docs/ or chore/ branches; main is protected. Keep focused imperative commits, inspect full diff and run relevant checks first. Preserve user work and never rewrite shared history. No secrets, credentials/signing material, personal data, .env, generated builds or volatile Obsidian state in Git. Do not install dependencies, push, merge, publish or alter external systems without current authority. When authorized, use reviewed PRs with passing checks; after merge synchronize main fast-forward-only and remove completed local branch when safe.

Before handoff: validate links/frontmatter/IDs/trace and affected executable tests; update milestone/backlog/open questions/ADR when state changes; report exact tests, unrun gaps, branch/commits/worktree and next bounded task. Keep this file an operating map; product behavior belongs in canonical specifications.
