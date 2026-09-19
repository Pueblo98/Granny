---
title: "Android implementation boundary"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [boundaries]
related:
  - ../AGENTS.md
---

# Android implementation boundary

Stage 1 Android app code starts with the bounded [T-120 native voice shell](stage1/README.md). It is an own-app foreground surface, not an OS or mandatory default launcher. Start with [readiness/DoR](../docs/10-execution/development-readiness.md), [backlog](../docs/10-execution/backlog.md), [ADR-0011](../docs/09-decisions/ADR-0011-explicit-activation-and-access.md), [design](../docs/02-design/product-design-spec.md) and [architecture](../docs/04-architecture/system-overview.md).

The shell does not imply that broader MVP implementation, external app control, a model provider, persistent personal data or public distribution is admitted. Each later Android slice retains its own task, route, permission and evidence boundary.
