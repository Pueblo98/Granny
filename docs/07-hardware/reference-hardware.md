---
title: "Stage 1 reference-tablet facts"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [reference-hardware]
related:
  - ../09-decisions/ADR-0006-reference-hardware.md
  - ../08-research/android-stage-1-feasibility.md
  - ../08-research/research-plan.md
---

# Stage 1 reference-tablet facts

Stage 1 uses an ordinary stock Android tablet. Stage 3 dock/hardware concepts are dormant [future-stage context](../00-vision/product-vision.md), not requirements or experiments here.

## Supplied fact and partial physical inventory

The [initialization handoff](../08-research/source-material/initialization-handoff.md) describes a used **Samsung Galaxy Tab A11+**, purchased for approximately **$140**. A later [manual physical inventory](../08-research/2026-09-19-t101-physical-inventory.md) observed model `SM-X238U`, which Samsung's official listing identifies as Galaxy Tab A11+ 5G, running Android 16 / One UI 8.0 with build `BP2A.250605.031.A3.X238UQS5AZE1` and Android security patch 2026-04-05. This is a user-reported Settings observation, not independent compatibility evidence. Exact API level, memory/storage, logical window metrics and service behavior remain unknown. [ADR-0006](../09-decisions/ADR-0006-reference-hardware.md) selects the supplied tablet as initial reference, not a measured support matrix.

## Inventory before device-dependent claims

Use the anonymous [RES-04 worksheet](../08-research/research-plan.md#res-04), [T-101](../10-execution/backlog.md#t-101) and the [Step B worksheet](../08-research/2026-09-19-t101-route-inventory.md#step-b--physical-inventory-worksheet). The 2026-09-19 manual pass records model/OS/OEM build/patch, locale and partial display/input/access/app state. API level, exact display/window metrics, offline speech, complete target packages/versions, synthetic account, grants, network class and build/adapter remain unknown or absent. Do not collect serial, IMEI, MAC, Android ID, SSID, account identifiers, contacts, screenshots or personal content. No managed-device privileges, telephony availability or foreground microphone/control guarantee is assumed.

Before any future command, a human must confirm the supplied tablet, assign a pseudonymous label and confirm exactly one authorized device is selected without recording its transport/hardware identifier. The exact read-only command list and outputs require separate authorization; developer options, USB debugging, restricted settings, permissions, accessibility services and accounts remain unchanged unless explicitly authorized later.

Test ordinary tablet microphone/speaker/display/access behavior only where it affects Stage 1 flows. No dock acoustics, charging alignment, firmware or hardware design tasks. [Android feasibility](../08-research/android-stage-1-feasibility.md) owns route classification and proposed configuration matrix; only measured results can promote a device/app pair to supported.
