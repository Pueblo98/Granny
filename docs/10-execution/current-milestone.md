---
title: "Current milestone — conversation-first browser experience"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution]
related:
  - development-readiness.md
  - backlog.md
  - open-questions.md
  - ../01-product/prd.md
---

# Current milestone — conversation-first browser experience

## Design system built and synced — 2026-09-18

The [Claude Code construction brief](../02-design/claude-code-design-system-handoff.md)
was executed. A versioned token source, a 28-component React package with 87
authored specimen cells, a runnable gallery and a source-linked brand guide now
exist and are imported into the Claude Design project *Granny Design System
(proposed)*. [Session record](sessions/2026-09-18-design-system-build.md) owns
the deliverables, the measured evidence (96 contrast pairs and 30 browser
checks, both clean) and the gaps.

Simon's next decisions: territory, typeface and the remaining OQ-14 Home
direction. Nothing in the system is accepted by building it, no app screen was
designed, and no product gate moved. The [Claude Design app brief](../02-design/claude-design-handoff.md)
now has a system to consume rather than a palette to reconstruct.

## Current design feedback and vault synchronization — 2026-09-17

Simon rejects the browser UI as too button-heavy and generically AI-styled. Two separate briefs now serve the next work: [Claude Code builds and syncs the design system](../02-design/claude-code-design-system-handoff.md); [Claude Design composes the app](../02-design/claude-design-handoff.md) under accepted ADR-0013 bounded composition after the remaining [OQ-14 Home choice](open-questions.md#brainstorming-alignment-review--oq-14). They are separate files, not a bundle. Figma quota does not block the proposed Claude Code route. No system construction, sync or new app UI has been executed by preparing these briefs.

Main and the local vault now include the conversation runtime, UI/UX skills, brainstorm and ADR-0012 through PR #11 (a200395). Earlier unmerged/stale statements below are historical checkpoints. [The current session](sessions/2026-09-17-vault-design-handoff.md) records edit preservation, publication and final vault checks. Product gates remain unchanged.

## Simon class brainstorming input — 2026-09-17

[Simon's class brainstorming session](../08-research/source-material/2026-09-17-class-brainstorming.md) is preserved as an attributed planning input. Compatible conversation, contextual-module, guidance/annotation, Android-target and orchestration ideas refine existing proposals without changing gates. On 2026-09-17 Simon retained consequence-based approval and the MVP/App V1/later split, accepted [automatic important-fact memory plus bounded adaptive communication](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md) for App V1, and accepted ADR-0013 bounded composition. [OQ-14](open-questions.md#brainstorming-alignment-review--oq-14) now keeps only persistent Home structure open for discussion.

## Local backend/MCP experiment — 2026-09-15

Simon explicitly authorized [T-117](backlog.md#t-117), a bounded conversation-first browser/backend/MCP slice with fictional contacts, specific confirmation and verified unsent demo-store writes. [Runtime contract](../04-architecture/conversation-runtime-contract.md) and [session evidence](sessions/2026-09-15-mcp-backend-integration.md) own its actual implementation/test state. Backend and frontend coordinate through published board checkpoints. Dependency installation for the official MCP SDK was explicitly approved. This is an exception to earlier no-backend prototype statements, not T-103 completion, Android integration or promotion of GATE-03/04/06/07–09. Live synthetic Qwen calls retain prior caps and consent; broader data/release gates remain open.

## Active milestone — review the conversation-first browser experience

Simon authorized [conversation-first implementation](../02-design/conversation-first-plan.md) on 2026-09-14: message checkpoint first, then the five integrated MVP simulations, supporting preferences/privacy/recovery and proposed visual comparison. He asked to continue the working message direction on 2026-09-15 and authorized a draft PR after integrated checks. [Build record](sessions/2026-09-14-conversation-build.md) owns current evidence/publication. Main integration is not authorized. No backend, Android automation, capture, live media/message or production gate work is part of this mission.

T-102's conversation-first browser revision is implemented for review; the development cockpit remains approved and complete. Test and iterate the actual browser experience. Final interaction/brand acceptance, device/participant evidence and all production gates retain their existing owners and limits.

## Previous milestone — cockpit approved; conversation-first plan prepared

Simon approved the development cockpit on 2026-09-14 and requested T-114 complete. [Approval record](sessions/2026-09-14-cockpit-approval.md) owns the exact scope and evidence. The conversation-first app redesign remains a separate review; no product gate changes.

At that previous milestone, Simon's instruction was cockpit first, then a redesign plan. [Cockpit](../Cockpit.md), [visual map](../Development.canvas), [session deliveries and agent board](agent-board.md), and [plugin assessment](obsidian-cockpit-plugins.md) now provide development oversight. Bases/Canvas/Bookmarks were already enabled; no community installation or private Obsidian JSON edits occurred. [Maintenance](cockpit-guide.md) makes records and freshness checks part of future change tasks.

The feature-button Home was rejected by Simon, despite passing mock checks. The [conversation-first plan](../02-design/conversation-first-plan.md) was prepared before the newly authorized implementation above. Browser and cockpit were merged through [PR #3](https://github.com/Pueblo98/Granny/pull/3), 70af0db, on 2026-09-14, and the primary docs/ vault checkout was synchronized. The separate Figma branch remains preserved; this is not a claim every branch was merged.

T-115 delivered [session lifecycle guidance and automated checks](cockpit-guide.md#automated-maintenance-contract), with successful live CI and GitHub-required maintenance enforcement on main. [Its handoff](sessions/2026-09-14-session-maintenance.md) records the inspected settings and validation; [PR #4](https://github.com/Pueblo98/Granny/pull/4) owns final integration state. New change sessions maintain their scoped record and run freshness/coverage checks. This operational work does not implement the conversation-first redesign or pass product gates.

T-118 adds a reviewed project-local [UI/UX skill package](ui-ux-skills.md): one Granny-specific interface-craft layer plus Google's pinned adaptive, edge-to-edge and Android testing guidance with local authority guardrails. This improves later design/development instructions only; no product behavior, native app, device evidence or gate changed.

## Previous milestone — initial browser interaction prototype

Simon switched the design medium from quota-blocked Figma to a local browser on 2026-09-14. [Run the prototype](../../prototypes/stage-1/README.md); [coverage, authority and review checklist](../02-design/browser-prototype.md). T-102's initial design slice now contains five clickable MVP workflows, onboarding, editable drafts/aliases, reversible text scale, and explicit Stop/expiry/failure/unknown scenarios. It uses fictional data, no AI/device capture or real sends. Review and refine this artifact next; T-103 and physical Android work remain separate.

The task branch starts at origin/main ce3f32f, which already includes Git-workflow PR #2. The earlier Figma task branch remains unmerged and preserved; this task does not merge it. Historical no-prototype/read-only statements below describe previous milestones. No product or release gate is passed by the browser checks.

## Workflow refinement follow-up

The following paragraphs retain historical delivery evidence. Git-workflow PR #2 and browser/cockpit PR #3 have since been merged; earlier branch-based startup advice is superseded by main and the current operating instructions.

Git workflow validation, 2026-09-14: in the isolated docs/git-workflow worktree, `python3 scripts/validate-docs.py` passed with 0 errors (78 Markdown documents, four skills, 1,403 local links, four preserved source hashes); the 19 documentation-tool unit tests passed; the changed granny-spec-change skill passed its packaging validator; `git diff --check` passed. The readiness/Figma branch was pushed and its remote HEAD independently verified as a4fc05b315494affb51c63eb979ad263ebd40115. No product eval or main merge was performed. The original checkout's user-owned action-policy heading edit remains outside the published commits. These are mechanical/self-review checks, not proof of future-agent compliance.

Simon's subsequent 2026-09-14 request authorizes GitHub publication and future task-branch pushes with worktree isolation. The [Git workflow](git-workflow.md) owns this standing authority and the validation/commit/push/remote-SHA handoff. The follow-up branch docs/git-workflow starts from a4fc05b and contains the readiness and Figma history; main integration remains pending separate review/authority. Use that branch for sessions needing the new rules until integration. No product gate changes follow from publishing documentation.

Simon's 2026-09-14 follow-up requests a holistic documentation/skills/workflow system **before actual design and development**. T-113 supplies [delivery workflows and four repository skills](operating-workflows.md), [first task packets](task-packets.md), [transaction protocol](../03-agent/execution-protocol.md), [capability admission](../04-architecture/capability-admission.md), [evidence review](../06-evals/evidence-protocol.md) and [research execution protocols](../08-research/research-protocols.md). Documentation-tool regression tests are executable; T-103's 20 product-contract cases remain unrun. No application code, external Figma file or participant/device study was created. The official remote Figma MCP connection was verified read-only on 2026-09-14; no canvas mutation or credential/config file was added to the repository.

The next user-authorized work can start a named low-fi design package or T-103's offline fake replay from these packets; no need for another broad specification-writing milestone. Remaining real-world evidence and Simon decisions still gate production work. Skills are repo-local. No new global setting, plugin or scheduled automation was installed by this repository task; the pre-existing official Figma plugin connection is documented in the Figma contract.

The mission's documentation package is written for review. Only the stock-Android tablet app is active; no Android/runtime/backend implementation was started. Simon accepted the five MVP experiments and control posture on 2026-09-14; detailed product choices remain proposed and technical/user evals unrun. [Development readiness](development-readiness.md) is the authoritative gate/status assessment; [backlog](backlog.md) gives bounded next tasks, not another plan to write the PRD.

## Delivered in this milestone

48 stable PRD requirements; explicit MVP/V1/later boundaries; four proto-personas and five jobs; 25 use cases and eight journeys; 15 screens/19 states/nine components; voice/access/content/Figma contract; brand foundation, 81 naming candidates, 30 live longlist, 12 scored candidates, three finalists and four reproducible identity territories with local boards; finite typed agent tools, Android/local-cloud/trust boundaries; canonical action/privacy/memory/helper/threat policies; 17 unrun evals, metric/failure definitions and full requirement mapping; prioritized evidence program; nine gates, roadmap, DoR and first synthetic coding slice.

[ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md) is **accepted by Simon on 2026-09-14**, completing T-100 and passing GATE-02 for experiment scope only. ADR-0010/0011 remain **proposed**. Seven earlier accepted ADRs and deprecated ADR-0004 history remain unchanged. Supplied Dream Book/handoff/conversation and local Obsidian state are preserved.

## Key constraints discovered

Current official Play policy does not permit a general-assistant AccessibilityService to autonomously initiate, plan and execute actions. The [route assessment](../08-research/android-stage-1-feasibility.md) recommends an API/integration-led candidate, static recipes only after review, and dynamic control restricted to a synthetic lab. None is a claim of store approval. At least two useful external delegated workflows must be verified to validate the thesis; handoff or in-app resize alone is insufficient.

## Proposed next milestone

Evidence-led foundation: MVP/control review T-100 is complete; next inventory device and policy routes (T-101), or build offline policy/Stop/verification replay only (T-103) in a separately requested coding session. Produce/test low-fi interaction and iterate naming/identity (T-102/108) within their authorization and evidence boundaries. Do not begin broad MVP implementation or personal-data automation.

Naming recommendation: Daykind / Handspan / Clearfold, all uncleared with documented concerns. Identity recommendation: test Open Day against challengers. Neither is accepted. That initial browser used provisional grayscale; the current conversation build adds reviewer-only territory comparisons. Figma remains a partial paused artifact.

## Completion versus remaining authority

GATE-02 is passed for the agreed experiment scope, not blanket acceptance of every specification or release. GATE-03 platform proof, GATE-04 route viability and GATE-05 design/brand evidence remain outstanding. GATE-06 is specified for synthetic replay; real-device/data safety remains evidence-needed. GATE-07–09 are not passed. The [readiness validation record](development-readiness.md) contains exact mechanical checks.

No push, merge, publication, dependency installation, external Figma edits,
new plugin enablement, private Obsidian edits or source-material rewrites were
performed by this MCP setup. Connection verification does not authorize future
canvas writes.
