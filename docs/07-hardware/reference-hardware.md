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

## Supplied fact versus unknown

The [initialization handoff](../08-research/source-material/initialization-handoff.md) describes a used **Samsung Galaxy Tab A11+**, purchased for approximately **$140**. This is supplied provenance, not a verified marketing model, device capability or current price. Exact physical model/region, Android/API/One UI/security build, memory/storage, installed apps and service behavior remain unknown. [ADR-0006](../09-decisions/ADR-0006-reference-hardware.md) selects the supplied tablet as initial reference, not a measured support matrix.

## Inventory before device-dependent claims

Use the anonymous [RES-04 worksheet](../08-research/research-plan.md#res-04), [T-101](../10-execution/backlog.md#t-101) and the prepared [Step B worksheet](../08-research/2026-09-19-t101-route-inventory.md#step-b--physical-inventory-worksheet-unrun). Record exact model/SKU, OS/API/OEM build/security patch, locale/timezone, logical display/font/window settings, relevant input/access and speech support, app package/version, synthetic-account/grant/network states and build/adapter identity. **Every field remains unrun and unknown as of 2026-09-19.** Do not collect serial, IMEI, MAC, Android ID, SSID, account identifiers, contacts, screenshots or personal content. No managed-device privileges, telephony availability or foreground microphone/control guarantee is assumed.

Before any future command, a human must confirm the supplied tablet, assign a pseudonymous label and confirm exactly one authorized device is selected without recording its transport/hardware identifier. The exact read-only command list and outputs require separate authorization; developer options, USB debugging, restricted settings, permissions, accessibility services and accounts remain unchanged unless explicitly authorized later.

Test ordinary tablet microphone/speaker/display/access behavior only where it affects Stage 1 flows. No dock acoustics, charging alignment, firmware or hardware design tasks. [Android feasibility](../08-research/android-stage-1-feasibility.md) owns route classification and proposed configuration matrix; only measured results can promote a device/app pair to supported.
