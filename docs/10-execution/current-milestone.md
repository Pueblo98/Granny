---
title: "Current milestone — delivery system refined, bounded design and evidence next"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [execution]
related:
  - development-readiness.md
  - backlog.md
  - open-questions.md
  - ../01-product/prd.md
---

# Current milestone — Stage 1 development-readiness package

## Active milestone — cockpit approved and complete; review conversation-first plan

Simon approved the development cockpit on 2026-09-14 and requested T-114 complete. [Approval record](sessions/2026-09-14-cockpit-approval.md) owns the exact scope and evidence. The conversation-first app redesign remains a separate review; no product gate changes.

Simon's latest instruction is cockpit first, then a redesign plan. [Cockpit](../Cockpit.md), [visual map](../Development.canvas), [session deliveries and agent board](agent-board.md), and [plugin assessment](obsidian-cockpit-plugins.md) now provide development oversight. Bases/Canvas/Bookmarks were already enabled; no community installation or private Obsidian JSON edits occurred. [Maintenance](cockpit-guide.md) makes records and freshness checks part of future change tasks.

The feature-button Home was rejected by Simon, despite passing mock checks. Review the [conversation-first plan](../02-design/conversation-first-plan.md) before a new implementation request. Existing browser code stays unchanged. T-102 remains in review with revision requested; production gates remain unchanged. Browser and cockpit were merged through [PR #3](https://github.com/Pueblo98/Granny/pull/3), 70af0db, on 2026-09-14, and the primary docs/ vault checkout was synchronized. The separate Figma branch remains preserved; this is not a claim every branch was merged.

T-115 delivered [session lifecycle guidance and automated checks](cockpit-guide.md#automated-maintenance-contract), with successful live CI and GitHub-required maintenance enforcement on main. [Its handoff](sessions/2026-09-14-session-maintenance.md) records the inspected settings and validation; [PR #4](https://github.com/Pueblo98/Granny/pull/4) owns final integration state. New change sessions maintain their scoped record and run freshness/coverage checks. This operational work does not implement the conversation-first redesign or pass product gates.

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

Naming recommendation: Daykind / Handspan / Clearfold, all uncleared with documented concerns. Identity recommendation: test Open Day against challengers. Neither is accepted. Current browser styling is deliberately provisional grayscale; Figma remains a partial paused artifact.

## Completion versus remaining authority

GATE-02 is passed for the agreed experiment scope, not blanket acceptance of every specification or release. GATE-03 platform proof, GATE-04 route viability and GATE-05 design/brand evidence remain outstanding. GATE-06 is specified for synthetic replay; real-device/data safety remains evidence-needed. GATE-07–09 are not passed. The [readiness validation record](development-readiness.md) contains exact mechanical checks.

No push, merge, publication, dependency installation, external Figma edits,
new plugin enablement, private Obsidian edits or source-material rewrites were
performed by this MCP setup. Connection verification does not authorize future
canvas writes.
