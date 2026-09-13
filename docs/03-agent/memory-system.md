---
title: "Stage 1 Memory Interaction Contract"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [agent, memory]
related:
  - ../05-safety-privacy/safety-and-privacy.md
  - tool-contracts.md
---

# Memory interaction contract

[Privacy/data policy](../05-safety-privacy/safety-and-privacy.md) owns classes, retention, correction/deletion/sharing semantics. This document owns the agent-facing representation and transitions. MVP persists explicit UI preferences and user-entered aliases only; V1 may add user-confirmed relationships/preferences/dates. Stories and proactive routines are later App.

## Proposed schema

```text
MemoryItem {id, revision, kind: Preference|ContactAlias|ExplicitFact,
            valueRef, subjectRef?, provenance: {sourceKind, sourceRef, statedAt},
            epistemic: UserStated|UserConfirmed,
            sensitivity: Personal|Sensitive, sharingScope: Private,
            consentRef, createdAt, lastConfirmedAt, reviewAfter?,
            derivedRefs[], state: Active|CorrectionPending|DeletionPending|Deleted}
TransientCandidate {proposedValue, sourceRef, uncertainty, expiresAt}
```

MVP permits Preference/ContactAlias; Sensitive facts rejected from automatic saving. No medical label, passive transcript archive or embeddings required. A confidence estimate does not turn ModelInference into UserConfirmed. Source includes whether value came from the adult, an owning integration or a helper proposal; helper suggestions require adult review before becoming active.

## Interaction and state transitions

Read: authorize private scope → select explicit items relevant to goal → carry provenance to planner → audit only class/count. No whole-store retrieval by default. Empty memory returns None, not generated biography.

Save: explicit local choice → validate typed value and source → immutable revision → read-back → user-visible receipt. A request mentioning a person does not save a relationship. Correct: expected revision → new revision → invalidate old derived candidates/cache and referencing plans/permits → verify new value. Conflict: show both values and sources for user resolution. Delete: immediately deny retrieval, remove derivatives, keep content-free tombstone per privacy policy, verify absence. Never use old summaries to re-add deleted facts.

Export: exact private-scope preview and fresh approval; local portable JSON/text format later must carry provenance and sharing scope. External app originals and recipient copies are outside deletion authority. V1 sync needs explicit ownership, tombstone and restore semantics before implementation.

## Context and initiative

Session context is ephemeral, with limits in privacy policy. “What was I reading?” uses the active session reference only; no implied browsing archive. User correction clears pending intent authority. No proactive execution or passive memory capture in MVP/V1. A saved preference improves requested tasks; it does not authorize monitoring, family sharing or a scheduled action.

Tests: EVAL-008 MVP memory deletion/cache invalidation and content-free history; EVAL-017 V1 facts/export/restore; EVAL-016 denies helper memory access. SCR-010/012 give natural-language and touch review. No memory evidence has been collected yet.
