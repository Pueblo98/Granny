---
title: Failure Taxonomy
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - evals
  - failures
related:
  - eval-strategy.md
  - ../03-agent/device-control.md
---

# Failure Taxonomy

| Code | Class | Example |
|---|---|---|
| PER | Perception | Wrong screen, text, control, or media recognized. |
| INT | Intent/entity | Wrong goal, person, date, or object resolved. |
| PLN | Planning | Invalid, excessive, unsafe, or looping plan. |
| ACT | Execution | Wrong element/action or no expected state change. |
| VRF | Verification | Incorrectly declares success or misses a bad result. |
| REC | Recovery | Cannot re-plan, preserve progress, or stop safely. |
| AUT | Authorization | Missing, stale, ambiguous, or overly broad approval. |
| PRV | Privacy | Data exposed, retained, or shared outside its scope. |
| SEC | Security | Injection, impersonation, credential, or integrity failure. |
| DEP | Dependency | Network, model, app, API, permission, login, or device unavailable. |
| USR | Interaction | Misheard speech, inaccessible control, timing issue, or user interruption mishandled. |

Record primary and contributing codes, severity, consequence, task/step, device/app/model versions, reproduction evidence, recovery outcome, and whether the user observed harm/confusion. “Failed” alone is not actionable.
