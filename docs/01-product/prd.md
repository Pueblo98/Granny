---
title: Stage 1 Android Tablet App — Product Requirements Document
status: draft
owner: Simon
last_updated: 2026-09-11
tags:
  - product
  - requirements
related:
  - ../00-vision/product-vision.md
  - personas.md
  - use-cases.md
  - scope-and-roadmap.md
  - ../09-decisions/ADR-0007-three-stage-product-strategy.md
---

# Stage 1 Android Tablet App — Product Requirements Document

> [!IMPORTANT]
> This PRD covers only Stage 1: an installable application for stock Android
> tablets. Granny OS/AOSP is Stage 2 and dedicated tablet/dock hardware is Stage
> 3. Later-stage capabilities are not current requirements.

## Purpose

Translate Granny's long-term vision into testable requirements for the Stage 1
Android tablet app while keeping App V1 and App MVP scope explicit.

## Users and jobs

The leading primary-user hypothesis is an independently living older adult who is cognitively independent but repeatedly encounters avoidable technology friction. A trusted relative is a secondary user who wants to help without constant remote troubleshooting or invasion of privacy. These are hypotheses, not research findings; see [personas](personas.md).

Core job: **When technology becomes confusing, help me accomplish what I intended without requiring me to understand the technology.**

## Core experience

The user expresses a goal through voice or touch. Granny resolves relevant personal/device context, presents or executes safe steps, makes its activity visible, asks before consequential actions, verifies the result, and provides a clear recovery path. Direct touch remains available throughout.

## Initial requirements

| ID | Requirement | Scope status |
|---|---|---|
| REQ-001 | Accept ordinary spoken intent and provide a touch alternative for core flows. | V1 candidate |
| REQ-002 | Provide a calm home experience with large, readable, stable controls. | V1 candidate |
| REQ-003 | Inspect current Android/app state semantically when platform support allows. | MVP candidate |
| REQ-004 | Operate a deliberately limited set of device/app actions through typed tools. | MVP candidate |
| REQ-005 | Follow Observe → Understand → Plan → Act → Verify → Recover for non-trivial tasks. | MVP candidate |
| REQ-006 | Make agent listening, acting, waiting, success, failure, and confirmation states apparent. | V1 candidate |
| REQ-007 | Require understandable approval before consequential actions. | MVP constraint |
| REQ-008 | Resolve people and relationships with ambiguity handling; never guess through a consequential action. | V1 candidate |
| REQ-009 | Explain failures in plain language, preserve context, and offer a safe next step. | MVP constraint |
| REQ-010 | Allow the user to inspect, correct, and delete retained personal memory. | V1 candidate |
| REQ-011 | Separate private companion data from explicitly family-shared or administrative data. | V1 constraint |
| REQ-012 | Keep model providers behind replaceable interfaces. | Architecture constraint |

These requirements establish direction, not an accepted release contract. Scope labels need product review.

## Non-functional requirements

- **Understandability:** status, confirmation, and failure language must be comprehensible without technical knowledge.
- **Accessibility:** layout, type, touch, semantics, voice/touch equivalence, timing, and motion must follow the [accessibility specification](../02-design/accessibility.md).
- **Safety:** tool enforcement cannot rely solely on model judgment; consequential approvals are auditable.
- **Reliability:** meaningful actions are verified against resulting state; step success alone is insufficient.
- **Privacy:** collect only purpose-bound data with visible sharing and deletion controls.
- **Adaptability:** interface adaptation is slow and predictable, not a constantly rearranging feed.

Numeric performance, latency, reliability, and accessibility targets remain open pending workflow definition and testing.

## Success signals

- task completion and safe-recovery rate on canonical workflows;
- consequential actions never occurring without the required approval;
- fewer user requests for app/menu knowledge during observed tests;
- users can correctly describe what Granny is doing and how to stop it;
- usability and dignity feedback from representative older adults;
- low rates of wrong-person, wrong-content, and repeated-loop failures.

No target values are accepted yet. See [eval strategy](../06-evals/eval-strategy.md).

## Constraints and non-goals

See [scope and roadmap](scope-and-roadmap.md). Current non-goals include
substantial Stage 1 implementation during the planning milestone, any Stage 2
AOSP work, Stage 3 hardware work, production backend infrastructure, permanent
model/database selection, a finalized brand palette, autonomous high-risk
transactions, medical diagnosis, and silent family monitoring.

## Open questions

- Which use cases define MVP and V1?
- What connectivity/offline behavior is essential?
- Which third-party apps and locales are initial targets?
- Which actions are prohibited versus strongly confirmed?
- How should onboarding, identity, consent, and account recovery work?
- What evidence threshold promotes these draft requirements into an accepted release contract?
