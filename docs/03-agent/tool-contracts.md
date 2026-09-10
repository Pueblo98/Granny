---
title: Tool Contract Conventions
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - agent
  - tools
related:
  - device-control.md
  - autonomy-model.md
  - ../06-evals/failure-taxonomy.md
---

# Tool Contract Conventions

No production tools are defined yet. Future tools should be narrow, typed, inspectable, testable, and independently permission-enforced.

Each contract must specify: purpose; input/output schema; required permission; autonomy classification; preconditions; idempotency/reversibility; timeout/retry limit; resulting-state evidence; privacy/audit behavior; explicit error taxonomy; and simulation/eval behavior.

Do not expose a generic shell, arbitrary coordinates, unrestricted HTTP, raw credentials, or a universal “do action” primitive to the model. Separate prepare and commit tools for consequential actions (for example, draft versus send). Bind confirmation tokens to the exact prepared action and expire them after material state changes.
