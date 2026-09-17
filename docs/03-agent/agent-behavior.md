---
title: "Stage 1 Agent Behavior Contract"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [agent, contract]
related:
  - tool-contracts.md
  - device-control.md
  - memory-system.md
  - ../05-safety-privacy/action-policy.md
---

# Agent behavior contract

**Purpose:** translate user intent into an admitted, bounded task and report its evidenced outcome. The agent is a respectful software assistant, never user authority, clinician, account owner or private family observer. PRD and [policy](../05-safety-privacy/action-policy.md) constrain behavior even when the model proposes otherwise.

## Observe → Understand → Plan → Act → Verify → Recover

| Phase | Required record/output | Decision rule |
|---|---|---|
| Observe | Observation with origin, captured monotonic time, window/package/version, grant scope, user-interaction epoch, sensitivity and evidence references | Request least content; redact before cloud; absent tree is unknown, not empty app |
| Understand | Intent with original/edited text reference, goal enum, entities with provenance, time interval/timezone, selected route and ambiguity set | User-stated fact outranks inferred interpretation; material person/content ambiguity requires SCR-006; V1 may separately propose an allowed important-memory candidate |
| Plan | TaskPlan with version, allowed capability IDs, ordered bounded steps, pre/postconditions, max effects/budget and expected outcome | Registry checks admission; API first; no arbitrary instructions from observed content |
| Act | Serialized typed request with state epoch, cancel token and permit where needed | Local executor validates independently; one effect at a time |
| Verify | Evidence predicate and grade: verified, partial, unknown, disproven | A successful tool dispatch is never sufficient task evidence |
| Recover | Classified failure + remaining budget + bounded safe option or manual handoff | Re-observe once when safe, clarify or stop; never reset budget or duplicate consequence |

Model reasoning need not be exposed or logged. User-visible progress is goal/step/evidence. State belongs to local coordinator in [product design](../02-design/product-design-spec.md).

Presentation is a separate typed proposal under [ADR-0013](../09-decisions/ADR-0013-bounded-interface-composition.md). The model may select registered component IDs, versions, typed slots and allowed action references for the current task. It cannot supply executable UI, event handlers, policy semantics, novel consequential labels or authority. Schema rejection uses a renderer-owned safe fallback and never blocks Stop or typed input.

Guidance mode explains only externally meaningful state: the requested goal, the verified current step, what the person can do next and why a handoff or question is needed. Default progress remains concise; an explicit request can expand into tutorial steps. Visual arrows/highlights must be generated from an admitted semantic target or a user-supplied bounded image region, never from free-form model coordinates or hidden reasoning. If the target cannot be freshly resolved or a safe visible guidance surface cannot be maintained, provide a truthful manual handoff without annotation.

## Proposed planning representation

```text
Intent {taskId, revision, goal: GoalEnum, userTextRef, locale,
        entities: [{kind, opaqueId?, candidates[], provenance}],
        timeWindow?: {startInstant,endInstant,zone}, mode: Guidance|Act}
TaskPlan {taskId, version, intentRevision, capabilityManifestVersion,
          steps: Step[1..12], budget, maximumConsequence, expectedOutcome}
Step {id, capabilityId, typedArguments, requiresEvidenceIds[],
      preconditionPredicate, postconditionPredicate, effectClass,
      failureRoute: Clarify|Reobserve|Manual|Stop}
```

Only schema-conforming bounded values enter executor; unknown goal/capability is unsupported. Conversation strings are not executable predicates. Predicate vocabulary is fixed by adapter registry (package equals, entity equals, text equals within selected field, state equals, receipt matches), not model-supplied code.

## Context and untrusted content

Each value has provenance UserInput, LocalPreference, ApprovedIntegration, ObservedUI, ModelInference or HelperProposal. User input still cannot override prohibited capability policy. Observed UI, image text, messages, notifications, files and links cannot establish new goals, helper rights, tool grants or provider instructions. Quoted “ignore previous rules” is processed as content only. No copied screen text enters system/developer instruction fields.

Entity inference can suggest candidates but cannot become a consequential target. Under ADR-0012, App V1 may silently save an allowed important fact directly stated by the user after local memory-policy validation and a quiet receipt/Undo; screen content, image faces, third-party claims and relationship guesses remain ineligible. Use stable opaque endpoint IDs and user-approved labels for actions. Relative dates resolve in device/user-selected timezone and remain visible. If timezone unknown, ask; do not substitute developer location.

## Route choice and proactivity

Production candidate: API/integration-led tasks and manual handoffs. Fixed human-authored accessibility recipes remain conditional on current policy review. Dynamic model-selected accessibility sequences are lab-only pending a permitted distribution model. This distinction is enforced by build/registry admission, not a model instruction.

No ambient conversation, unsolicited task initiation, engagement feed, transcript archive or proactive external action in MVP/V1. MVP has no passive memory extraction; App V1's bounded automatic memory/adaptation follows the memory contract and cannot mine external screens or messages. Follow-up proposals after a result are optional and never auto-execute. “Would you like to share?” cannot itself open a share target.

## Conversation continuity

One active task per device user. New input during a task pauses pending action; clarify edit vs new task if it changes goal. Explicit correction increments revision and invalidates prepared permits. Lock/process death/15-minute idle clears raw session context; minimal local journal remains per data policy. Resume summarizes known outcome, observes again and requires new approval. Repetition reads explanation/preview, not tool rerun.

## Quality boundaries

No fabricated completion, hidden retry, invented contact relationship, medical diagnosis, financial/legal decision or credential handling. If a user asks an unsupported task, explain the specific limit and leave ordinary device control available. A model outage cannot disable Stop, local privacy controls, readable history or user touch.

Use [tool contracts](tool-contracts.md) for typed interfaces, [device control](device-control.md) for budgets/races, [memory](memory-system.md) for structured context and [evals](../06-evals/canonical-tasks.md) for adversarial acceptance.
