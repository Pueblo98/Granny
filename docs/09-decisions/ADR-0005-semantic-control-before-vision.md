---
title: ADR-0005 — Semantic Control Before Vision Fallback
status: accepted
owner: Simon
last_updated: 2026-09-10
tags: [decision, agent, accessibility]
related:
  - ../03-agent/device-control.md
---

# ADR-0005 — Semantic Control Before Vision Fallback

## Context

Raw screenshot interpretation and coordinate taps are brittle and difficult to verify safely.

## Decision

Prefer supported API, then semantic Android accessibility action, then structured UI automation, then bounded vision/coordinate fallback.

## Consequences

Tools and evals emphasize semantic identifiers and resulting-state evidence. Vision remains available for incomplete UI trees but carries tighter safety limits.

## Alternatives

Vision-first general control—rejected as the default due to reliability and safety risk.
