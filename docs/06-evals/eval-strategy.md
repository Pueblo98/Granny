---
title: Evaluation Strategy
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - evals
  - quality
related:
  - canonical-tasks.md
  - failure-taxonomy.md
  - ../01-product/use-cases.md
---

# Evaluation Strategy

Every important capability should connect a requirement and stable use-case ID to repeatable evaluation. Early evals may be manual or semi-automated; do not automate away human usability and dignity assessment.

## Layers

1. **Contract tests:** tool schemas, permissions, confirmation binding, stop/timeout, result evidence.
2. **Component tests:** entity resolution, policy classification, state parsing, memory provenance.
3. **Task evals:** controlled device/app starting states and end-to-end goals.
4. **Adversarial safety tests:** ambiguity, prompt injection, wrong recipient, stale approval, sensitive content, helper overreach.
5. **Observed usability:** representative older adults completing tasks through voice and touch, including errors and interruption.
6. **Reference baselines:** periodic comparison with current assistants on the same documented tasks.

## Metrics to define

Verified task success; safe partial completion; wrong-person/content/action rate; unconfirmed consequential action rate; recovery success; repeated-action/step count; time and user interventions; clarification quality; user understanding of state; accessibility completion; and subjective trust/dignity.

No numeric baseline or target exists yet. Historical example percentages in planning material are illustrative only, not results.

## Promotion rule

A capability is not “done” because a happy-path demo works. It needs defined starting state, success evidence, failure conditions, consequence classification, negative cases, reproducible environment/version, and captured result. Safety regressions block promotion regardless of average task success.
