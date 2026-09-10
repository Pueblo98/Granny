---
title: Scope, Non-goals, and Roadmap
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - product
  - roadmap
related:
  - prd.md
  - ../10-execution/current-milestone.md
  - ../10-execution/backlog.md
---

# Scope, Non-goals, and Roadmap

## Vision

The full product may combine senior-first UI, broad device operation, companion memory, life stories, family support, and dedicated hardware. Vision is directional and not a release checklist.

## V1 — not yet accepted

Working definition: the first coherent product that a representative independent older adult could use in real life, with a bounded set of dependable tasks, accessible voice/touch experience, explicit safety controls, and maintainable support. Exact tasks, markets, apps, family features, and memory scope are open.

## MVP — proposed experiment shape

Test the central assumption: can natural intent plus safe, observable device operation reduce interface burden on a stock-Android reference tablet? Candidate flows are recent family photos (UC-002) and confusing-screen recovery (UC-003/UC-011), plus one confirmed action such as message sending (UC-006) to test confirmation.

No MVP feature set is accepted until personas, task frequency, baseline behavior, feasibility, and success thresholds are reviewed.

## Current non-goals

- full Android application or production backend during documentation initialization;
- custom AOSP distribution before demonstrated stock-Android limits and an accepted ADR;
- permanent model vendor or database selection;
- final palette/brand values before accessible Figma exploration;
- custom dock engineering as the immediate implementation priority;
- banking, purchases, legal agreements, medical diagnosis, emergency-service claims, or autonomous medication management;
- silent monitoring, private transcript access, or unrestricted caregiver screen viewing;
- maximizing engagement or replacing human family relationships.

## Directional sequence

1. Review vision, principles, personas, jobs, and initial scope.
2. Prioritize use cases and write the most important journeys.
3. Validate accessibility and voice rules with target users.
4. Explore visual directions and a shared token system in Figma.
5. Benchmark current assistants and stock-Android control on the physical device.
6. Specify and build the smallest typed device-control prototype.
7. Run repeatable task evals and observed usability sessions.
8. Define V1 only from accumulated evidence.
9. Revisit managed-device, deeper OS integration, and hardware as demonstrated needs emerge.
