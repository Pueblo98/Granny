---
title: Conceptual Architecture
status: proposed
owner: Simon
last_updated: 2026-09-11
tags:
  - architecture
related:
  - docs/04-architecture/system-overview.md
  - docs/03-agent/device-control.md
  - docs/05-safety-privacy/safety-and-privacy.md
---

# Conceptual Architecture

> **Active scope:** This architecture describes the Stage 1 stock-Android app.
> Any custom-OS or dedicated-hardware component is future-stage context and is
> not an implementation requirement.

## Purpose

Define system boundaries early enough for product and technical discussion without prematurely selecting frameworks, vendors, databases, or deployment topology.

## Boundaries

```text
User / trusted helper
        |
Android client
  ├─ senior launcher and touch UI
  ├─ voice input/output and visible activity state
  ├─ screen observation (system APIs, accessibility tree, vision fallback)
  ├─ action executor and post-action verification
  └─ device-control service / managed-device capabilities
        |
Safety and permission enforcement (local and service-side)
        |
Agent / planner
  ├─ intent and context resolution
  ├─ plans, tool selection, recovery, and reporting
  └─ model adapter layer (replaceable providers/models)
        |
Memory and backend services
  ├─ consent-aware personal memory and provenance
  ├─ sync, account, and family-support boundaries
  └─ audit/event data needed for safety and evaluation
        |
Family/caregiver experience (separate identity and explicit grants)
```

## Responsibility rules

- The Android client owns the senior-first interface, current device state, execution, visible feedback, and safe stop/undo behavior.
- The action executor performs typed capabilities; a model must not receive unrestricted device authority.
- The safety layer gates action categories independently of model confidence and records consequential approvals.
- The planner may propose actions and recover from changed state, but tools enforce permissions and preconditions.
- Model integrations remain replaceable infrastructure.
- Memory distinguishes source, confidence, sensitivity, sharing scope, correction, deletion, and retention.
- The family experience uses explicit, narrow permissions and must never imply access to private companion content.

## Undecided

Deployment topology, offline behavior, identity system, data stores, model vendors, synchronization, audit retention, and the exact split between on-device and remote computation are open. See [system overview](docs/04-architecture/system-overview.md) and [open questions](docs/10-execution/open-questions.md).
