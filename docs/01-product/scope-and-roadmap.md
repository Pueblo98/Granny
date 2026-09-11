---
title: Scope, Non-goals, and Roadmap
status: proposed
owner: Simon
last_updated: 2026-09-11
tags:
  - product
  - roadmap
related:
  - prd.md
  - ../10-execution/current-milestone.md
  - ../10-execution/backlog.md
---

# Scope, Non-goals, and Roadmap

## Stage 1 — Android tablet app (active)

Stage 1 is an installable application for stock Android tablets. It must test
the core product thesis using permissions and capabilities available to an
ordinary application or an honestly declared accessibility tool. It cannot
assume root, system signatures, OEM access, custom firmware, or dedicated dock
hardware.

### App V1 — not yet accepted

Working definition: the first coherent product that a representative independent older adult could use in real life, with a bounded set of dependable tasks, accessible voice/touch experience, explicit safety controls, and maintainable support. Exact tasks, markets, apps, family features, and memory scope are open.

### App MVP — proposed experiment shape

Test the central assumption: can natural intent plus safe, observable device operation reduce interface burden on a stock-Android reference tablet? Candidate flows are recent family photos (UC-002) and confusing-screen recovery (UC-003/UC-011), plus one confirmed action such as message sending (UC-006) to test confirmation.

No MVP feature set is accepted until personas, task frequency, baseline behavior, feasibility, and success thresholds are reviewed.

## Stage 2 — Granny OS (future context)

An Android/AOSP fork providing deeper system ownership, provisioning,
background reliability, permission mediation, observability, recovery, and
hardware integration. Stage 1 must record capability and reliability gaps that
could become Stage 2 requirements. No Stage 2 planning or implementation is
active.

## Stage 3 — Granny hardware (future context)

An integrated tablet and dock/base with high-quality microphones and speaker,
charging and attachment, tactile controls, clear status, and physical microphone
privacy. No industrial, mechanical, electrical, acoustic, procurement, or
manufacturing work is active.

## Current non-goals

- full Android application or production backend during documentation initialization;
- any Stage 2 OS/AOSP implementation or Stage 3 hardware work;
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
9. Preserve measured stock-Android gaps as future Stage 2 inputs without
   beginning OS work.

## Later-stage entry gates

Only Simon may activate a later stage. Entry requires an explicit scope change,
an accepted milestone, and technical ADRs grounded in Stage 1 evidence. A
future-stage idea appearing in the Dream Book is not authorization to work on
it now.
