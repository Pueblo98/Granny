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

## Workflow refinement follow-up

Simon's 2026-09-14 follow-up requests a holistic documentation/skills/workflow system **before actual design and development**. T-113 supplies [delivery workflows and four repository skills](operating-workflows.md), [first task packets](task-packets.md), [transaction protocol](../03-agent/execution-protocol.md), [capability admission](../04-architecture/capability-admission.md), [evidence review](../06-evals/evidence-protocol.md) and [research execution protocols](../08-research/research-protocols.md). Documentation-tool regression tests are executable; T-103's 20 product-contract cases remain unrun. No application code, external Figma file or participant/device study was created.

The next user-authorized work can start a named low-fi design package or T-103's offline fake replay from these packets; no need for another broad specification-writing milestone. Remaining real-world evidence and Simon decisions still gate production work. Skills are repo-local, with no global settings/plugins or scheduled automation installed.

The mission's documentation package is written for review. Only the stock-Android tablet app is active; no Android/runtime/backend implementation was started. Simon accepted the five MVP experiments and control posture on 2026-09-14; detailed product choices remain proposed and technical/user evals unrun. [Development readiness](development-readiness.md) is the authoritative gate/status assessment; [backlog](backlog.md) gives bounded next tasks, not another plan to write the PRD.

## Delivered in this milestone

48 stable PRD requirements; explicit MVP/V1/later boundaries; four proto-personas and five jobs; 25 use cases and eight journeys; 15 screens/19 states/nine components; voice/access/content/Figma contract; brand foundation, 81 naming candidates, 30 live longlist, 12 scored candidates, three finalists and four reproducible identity territories with local boards; finite typed agent tools, Android/local-cloud/trust boundaries; canonical action/privacy/memory/helper/threat policies; 17 unrun evals, metric/failure definitions and full requirement mapping; prioritized evidence program; nine gates, roadmap, DoR and first synthetic coding slice.

[ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md) is **accepted by Simon on 2026-09-14**, completing T-100 and passing GATE-02 for experiment scope only. ADR-0010/0011 remain **proposed**. Seven earlier accepted ADRs and deprecated ADR-0004 history remain unchanged. Supplied Dream Book/handoff/conversation and local Obsidian state are preserved.

## Key constraints discovered

Current official Play policy does not permit a general-assistant AccessibilityService to autonomously initiate, plan and execute actions. The [route assessment](../08-research/android-stage-1-feasibility.md) recommends an API/integration-led candidate, static recipes only after review, and dynamic control restricted to a synthetic lab. None is a claim of store approval. At least two useful external delegated workflows must be verified to validate the thesis; handoff or in-app resize alone is insufficient.

## Proposed next milestone

Evidence-led foundation: MVP/control review T-100 is complete; next inventory device and policy routes (T-101), or build offline policy/Stop/verification replay only (T-103) in a separately requested coding session. Produce/test low-fi interaction and iterate naming/identity (T-102/108) within their authorization and evidence boundaries. Do not begin broad MVP implementation or personal-data automation.

Naming recommendation: Daykind / Handspan / Clearfold, all uncleared with documented concerns. Identity recommendation: Open Day tested against challengers. Neither is accepted. Figma has a precise brief, not an existing file.

## Completion versus remaining authority

GATE-02 is passed for the agreed experiment scope, not blanket acceptance of every specification or release. GATE-03 platform proof, GATE-04 route viability and GATE-05 design/brand evidence remain outstanding. GATE-06 is specified for synthetic replay; real-device/data safety remains evidence-needed. GATE-07–09 are not passed. The [readiness validation record](development-readiness.md) contains exact mechanical checks.

No push, merge, publication, dependency installation, external Figma edits, plugin enablement, private Obsidian edits or source-material rewrites are authorized by this milestone.
