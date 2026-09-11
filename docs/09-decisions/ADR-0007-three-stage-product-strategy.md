---
title: ADR-0007 — Three-Stage Product Strategy
status: accepted
owner: Simon
last_updated: 2026-09-11
tags: [decision, product, scope]
related:
  - ../00-vision/product-vision.md
  - ../01-product/scope-and-roadmap.md
  - ../10-execution/current-milestone.md
---

# ADR-0007 — Three-Stage Product Strategy

## Context

The Dream Book combines an installable Android experience, deeper control of
Android, and dedicated physical hardware. Without an explicit stage boundary,
agents may treat long-term OS or hardware capabilities as current app
requirements and overbuild Stage 1.

## Decision

Granny has three sequential product stages:

1. **Stage 1 — Android tablet app.** Build and validate an installable Granny
   application on stock Android tablets.
2. **Stage 2 — Granny OS.** Develop a Granny-controlled Android/AOSP fork to
   provide deeper system ownership and reliability after Stage 1 evidence
   defines the requirements.
3. **Stage 3 — Granny hardware.** Develop the integrated physical product: a
   tablet plus dock/base with voice audio, charging, attachment, status, and
   tactile privacy/control hardware.

Stage 1 is the exclusive active stage until Simon explicitly changes it. Stage
2 and Stage 3 documentation is future-stage context and does not authorize
planning, design, implementation, procurement, or research outside a direct
Stage 1 dependency.

## Rationale

The app is the fastest path to testing the user experience, distribution,
device-control feasibility, safety model, and real demand. Those findings
should define OS privileges and hardware requirements rather than allowing the
end-state vision to dictate premature engineering.

## Consequences

- The current PRD, design system, architecture, backlog, and evals describe
  Stage 1 unless explicitly labeled otherwise.
- Stage 1 must run on stock Android and cannot assume root, system signatures,
  OEM privileges, custom firmware, dock sensors, or proprietary hardware.
- Stage 1 research records platform limitations that may become Stage 2 inputs.
- Hardware ideas remain preserved but dormant until Stage 3 is activated.
- Entering a later stage requires explicit user direction, refreshed scope and
  milestone documents, and relevant technical ADRs.

## Alternatives considered

- Develop app, OS, and hardware together: rejected because it mixes validation
  and multiplies cost and technical risk.
- Treat the OS and hardware as merely optional ideas: rejected because they are
  part of the stated long-term strategy, even though they are inactive now.
