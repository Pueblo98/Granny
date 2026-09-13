---
title: "Stage 1 Architecture Map"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [architecture]
related:
  - docs/04-architecture/system-overview.md
  - docs/03-agent/tool-contracts.md
  - docs/10-execution/development-readiness.md
---

# Stage 1 architecture map

Only the installable app on stock Android is active. Granny is a codename. This map summarizes the proposed [canonical system architecture](docs/04-architecture/system-overview.md).

User voice/touch → local session coordinator → typed planner proposal → independently enforced local policy/permit → admitted Android capability → fresh verification → truthful visible result. Local Stop, privacy controls and audit remain available without the model/network. Observed screens and provider output are untrusted data.

Local components: app shell, voice wrapper, session/cancel state, scope/permission monitor, observer, executor, policy/registry, verifier, explicit memory and minimal audit. Optional provider transport is behind a replaceable adapter and local egress filter. MVP has no family backend or memory sync. V1 helper proposals use separate identity and local adult approval; remote screen/control is deferred.

[Tool contracts](docs/03-agent/tool-contracts.md) define typed interfaces; [action policy](docs/05-safety-privacy/action-policy.md) defines authority; [feasibility](docs/08-research/android-stage-1-feasibility.md) limits routes. Public general-assistant dynamic AccessibilityService control is not an admitted release model. APIs/manual handoff are the proposed candidate route; fixed recipes need review; dynamic control is synthetic-lab-only.

No vendor/framework/database is selected. No root, device-owner, system signature, OEM service, AOSP or custom hardware is assumed. The first [bounded implementation slice](docs/10-execution/backlog.md#t-103) uses fake adapters and synthetic evidence to test local cancellation/confirmation/verification before device integration.
