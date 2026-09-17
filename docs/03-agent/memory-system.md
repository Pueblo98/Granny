---
title: "Stage 1 Memory Interaction Contract"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [agent, memory]
related:
  - ../05-safety-privacy/safety-and-privacy.md
  - tool-contracts.md
---

# Memory interaction contract

[Privacy/data policy](../05-safety-privacy/safety-and-privacy.md) owns classes, retention, correction/deletion/sharing semantics. This document owns the agent-facing representation and transitions. MVP persists explicit UI preferences and user-entered aliases only. Under [ADR-0012](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md), App V1 automatically captures allowed important facts directly stated by the user and silently tunes bounded communication preferences after the person's setup choice. Stories and proactive routines are later App.

## Proposed schema

```text
MemoryItem {id, revision, kind: Preference|ContactAlias|ImportantFact|AdaptiveCommunication,
            valueRef, subjectRef?, provenance: {sourceKind, sourceRef, statedAt},
            epistemic: UserStated|UserSelected|BehaviorObserved,
            sensitivity: Personal|Sensitive, sharingScope: Private,
            policyClass, createdAt, lastReviewedAt?, reviewAfter?,
            derivedRefs[], state: Active|CorrectionPending|DeletionPending|Deleted}
TransientCandidate {proposedValue, sourceRef, uncertainty, expiresAt}
```

MVP permits explicit Preference/ContactAlias. App V1 permits ImportantFact only when the adult directly stated it and a local allowlist admits its class; it permits AdaptiveCommunication from setup choice, direct correction or bounded interaction behavior. Sensitive or restricted classes are rejected from automatic saving. No medical/cognitive label, credential, inferred vulnerability, financial/legal profile, passive transcript archive or embeddings are permitted. Model importance selects a candidate; confidence alone cannot admit it. Source distinguishes the adult's statement, setup selection, observed interaction, owning integration and helper proposal; third-party or helper suggestions never become automatic facts.

## Interaction and state transitions

Read: authorize private scope → select explicit items relevant to goal → carry provenance to planner → audit only class/count. No whole-store retrieval by default. Empty memory returns None, not generated biography.

MVP save: explicit local choice → validate typed value and source → immutable revision → read-back → user-visible receipt. App V1 automatic save: model proposes candidate/importance → local policy validates direct-user provenance and allowed class → immutable revision/read-back → quiet “Remembered” receipt with Undo, without interrupting for confirmation. A mention from a screen, message, helper or third party does not become the user's fact. Correct: expected revision → new revision → invalidate old derived candidates/cache and referencing plans/permits → verify new value. Conflict: keep the existing value and ask only when the conflict matters; never silently overwrite. Delete: immediately deny retrieval, remove derivatives, keep content-free tombstone per privacy policy, verify absence. Never use old summaries to re-add deleted facts.

Export: exact private-scope preview and fresh approval; local portable JSON/text format later must carry provenance and sharing scope. External app originals and recipient copies are outside deletion authority. V1 sync needs explicit ownership, tombstone and restore semantics before implementation.

## Context and initiative

Session context is ephemeral, with limits in privacy policy. “What was I reading?” uses the active session reference only; no implied browsing archive. User correction clears pending intent authority. MVP has no passive memory capture. App V1 may automatically save admitted important facts and bounded communication adjustments, but does not retain a transcript or mine external content. A saved fact or preference improves requested tasks; it does not authorize monitoring, family sharing, a scheduled action or an external consequence. The person can pause adaptive learning and reset communication behavior to the setup baseline.

Tests: EVAL-008 MVP memory deletion/cache invalidation and content-free history; EVAL-017 V1 automatic fact/adaptation selection, receipts/Undo, recall, correction/export/restore and drift; EVAL-016 denies helper memory access. SCR-010/011/012 give natural-language and touch review. No memory evidence has been collected yet.
