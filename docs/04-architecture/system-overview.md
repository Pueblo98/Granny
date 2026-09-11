---
title: System Overview
status: proposed
owner: Simon
last_updated: 2026-09-11
tags:
  - architecture
  - system
related:
  - ../../ARCHITECTURE.md
  - ../03-agent/device-control.md
  - ../05-safety-privacy/safety-and-privacy.md
---

# System Overview

> [!IMPORTANT]
> This is a Stage 1 app architecture. It may identify capability gaps for the
> future Granny OS, but it must not assume privileged/AOSP APIs or Stage 3
> hardware.

This document expands the boundaries in the root [architecture map](../../ARCHITECTURE.md). It is conceptual; no framework, vendor, database, protocol, or deployment topology is selected.

## Proposed components

| Component | Responsibility | Trust boundary |
|---|---|---|
| Senior launcher/UI | Stable home, touch flows, visual status, accessibility semantics. | User-facing; no hidden consequential state. |
| Voice layer | Capture intent, render speech/transcript, interruption and mute state. | Audio collection and retention require clear policy. |
| Screen observer | Current app, semantic tree, permitted screenshot/state signals. | May expose sensitive third-party content. |
| Action executor | Typed local actions, preconditions, step results, stop/undo. | Enforces capability and confirmation, not model alone. |
| Device-control service | Android accessibility/system/managed-device integrations. | Least privilege; stock Android first. |
| Agent/planner | Intent/entity resolution, planning, recovery, reporting. | Proposes actions but cannot bypass tools/policy. |
| Model adapter | Replaceable conversational/planning/vision models. | Minimize shared data; vendor-neutral contracts. |
| Memory | Consent-aware personal knowledge, provenance, correction, retention. | Separates private, shared, sensitive, inferred data. |
| Backend | Identity, sync, approved services, policy/audit support. | Scope and topology undecided. |
| Family experience | Explicit configuration and bounded remote assistance. | Separate identity/grants; no implicit surveillance. |

## End-to-end action flow

Intent → contextual understanding → plan proposal → policy/tool authorization → device observation/action → resulting-state verification → user-visible report. Confirmation pauses the flow before a classified consequential effect and is revalidated at execution.

## Platform path

Start with stock Android on the reference device, a senior launcher, voice/companion surface, and semantic AccessibilityService-based experiments. Evaluate managed/dedicated-device capabilities only as needed. Record concrete limitations before proposing deeper system integrations or AOSP.

## Architecture questions

- Which work must remain on-device for latency, privacy, safety, or offline continuity?
- How are identity, device ownership, user consent, helper roles, and revocation represented?
- How are plans/tool calls authorized and audited without retaining unnecessary content?
- What reliable evidence proves action success across third-party apps?
- What is the secure recovery path when accounts, permissions, or models fail?
