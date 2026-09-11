---
title: ADR-0001 — Stock Android Before AOSP
status: accepted
owner: Simon
last_updated: 2026-09-11
tags: [decision, android]
related:
  - ../04-architecture/system-overview.md
  - ADR-0007-three-stage-product-strategy.md
---

# ADR-0001 — Stock Android Before AOSP

## Context

Granny needs deep device interaction, but no measured limitation yet justifies maintaining a custom operating-system distribution.

## Decision

Begin with stock Android, then a senior launcher, companion/voice layer, semantic AccessibilityService control, and managed-device capabilities as evidence requires. Evaluate AOSP only after concrete limitations are documented and a new ADR is accepted.

## Consequences

Faster learning and lower maintenance; some platform restrictions may remain. Feasibility evals must record those restrictions rather than working around them invisibly.

This decision governs Stage 1 and the transition gate. It does not remove the
future Granny OS from the product strategy: ADR-0007 defines that OS as Stage 2,
while this ADR prevents Stage 2 implementation from starting before Stage 1
evidence and explicit activation.

## Alternatives

Immediate AOSP fork—rejected for current phase due to cost and unproven need.
