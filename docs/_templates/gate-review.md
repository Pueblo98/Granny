---
title: "Gate evidence and decision review template"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [template]
related:
  - ../06-evals/evidence-protocol.md
  - ../10-execution/development-readiness.md
---

# Gate review — named gate and configuration

Set actual metadata. This form is a review artifact, not authority to pass a gate. Link required approver, task, PRD/EVAL/RES, exact build/configuration and evidence records that exist.

## Criteria and evidence

For each criterion: prospective rule, evidence layer/source/date, actual result, pass/fail/not evaluated, limitations and retest trigger. Include failures, exclusions, n/denominators, privacy handling and independent oracle. No runtime claim from a documentation or fake-only check.

## Recommendation and authority

Ready / Ready with proposed assumptions / Needs evidence / Needs Simon decision / Blocked / Not applicable to current stage. Explain precise unlocked work and what remains prohibited. Record actual approver/date only when explicit; no implied sign-off.

## Follow-through

Canonical gate/task/OQ/ADR updates if authorized; rejected/deferred criteria; mitigation/rollback; next bounded evidence collection. Do not edit historical results to support the recommendation.
