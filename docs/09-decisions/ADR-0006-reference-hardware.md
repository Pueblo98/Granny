---
title: ADR-0006 — Initial Reference Hardware
status: accepted
owner: Simon
last_updated: 2026-09-10
tags: [decision, hardware]
related:
  - ../07-hardware/reference-hardware.md
---

# ADR-0006 — Initial Reference Hardware

## Context

A physical Android target is needed for experience and device-control learning. The supplied context identifies a used Samsung Galaxy Tab A11+ purchased for about $140.

## Decision

Use that physical Samsung tablet as the initial reference device. Inventory its exact model/region/OS before relying on the marketing name or technical specifications.

## Consequences

Early prototypes and feasibility notes can be concrete. Findings from one OEM/model are not assumed to generalize across Android.

## Alternatives

Emulator-only work and immediate custom hardware—deferred because they respectively miss real-device behavior and overbuild the current phase.
