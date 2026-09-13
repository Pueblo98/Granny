---
title: "Stage 1 reference-tablet facts"
status: proposed
owner: Simon
last_updated: 2026-09-14
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

Use the anonymous [RES-04 worksheet](../08-research/research-plan.md#res-04) and [T-101](../10-execution/backlog.md#t-101). Record exact model/SKU, OS/API/OEM build, language, logical display/font settings, relevant app/package/version and synthetic-account/grant/network states. **Do not collect serial, IMEI, MAC, account identifiers or personal content for this planning test.** No managed-device privileges, telephony availability or foreground microphone/control guarantee is assumed.

Test ordinary tablet microphone/speaker/display/access behavior only where it affects Stage 1 flows. No dock acoustics, charging alignment, firmware or hardware design tasks. [Android feasibility](../08-research/android-stage-1-feasibility.md) owns route classification and proposed configuration matrix; only measured results can promote a device/app pair to supported.
