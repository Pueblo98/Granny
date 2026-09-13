---
title: "ADR-0009 — Five MVP experiments and policy-bounded control"
status: accepted
owner: Simon
last_updated: 2026-09-14
tags: [adr]
related:
  - README.md
  - ../10-execution/open-questions.md
  - ../10-execution/development-readiness.md
---

# ADR-0009 — Five MVP experiments and policy-bounded control


## Context

Accepted ADR-0001/0002/0005/0007 require a stock-Android app and semantic-first control, not an unrestricted assistant or a guaranteed store exception. Current [Google Play evidence](../08-research/android-stage-1-feasibility.md) materially limits autonomous AccessibilityService behavior. The thesis still needs useful external delegation rather than a launcher demo.

## Options

| Option | Benefit | Cost / risk |
|---|---|---|
| Broad dynamic accessibility agent as public general assistant | Broad proposed coverage | No-go under reviewed Play policy; reliability and wrong-effect risks; reject as public MVP |
| API/integration-led app with explicit handoff | Strongest candidate distribution posture, narrow effects | Integrations may not support desired photo/message outcomes; handoff is not completion |
| Human-authored finite accessibility recipes | Bounded repeatable paths, policy distinction worth investigating | Still needs disclosure/route review and versioned semantic/verification tests; not automatically approved |
| Genuine disability-specific accessibility product | Could fit exception only with actual core purpose/evidence | Material audience/product change; cannot relabel general assistant to qualify |
| Private synthetic dynamic-control lab | Tests technical ceiling without public promise | Not release/distribution approval; no real-user permission to expand collection |

## Decision

Select five product experiments: sent family photos, scoped screen explanation/recovery, exact message preparation/confirmation, requested media and Granny in-app text adjustment. Make API/integration-led plus manual handoff the candidate MVP posture; admit static recipes only after evidence. Dynamic accessibility planning is isolated synthetic lab work only. Coordinate fallback disabled in proposed MVP. Scope details live in [PRD](../01-product/prd.md) and [scope](../01-product/scope-and-roadmap.md).

Require at least two useful externally verified delegated workflows before thesis validation. Do not disguise gallery search as sent-photo retrieval or draft opening as sent. If permitted integrations/recipes cannot meet that bar, revisit MVP/product/distribution with Simon; do not jump to Stage 2.

## Consequences and validation

Narrower advertised support and explicit partial states; separate lab/candidate capability registries and builds; route-specific app/version tests. API viability is unknown, not established by this choice. RES-02/04/07 and EVAL-001–004/011/012 gate GATE-02/03/04/07. Calls/basic reminders/V1 memory and helper proposals remain beyond MVP; later remote help and proactive routines excluded.

## Authority / reconsideration

**Accepted by Simon on 2026-09-14.** After reviewing the five experiments, API/integration-led candidate, evidence-gated static recipes, synthetic-only dynamic accessibility planning and two externally verified workflow minimum, Simon explicitly replied “yeah approved” to the request to accept this ADR on those terms.

Acceptance establishes the experiment scope and control posture, not a promise that all five workflows are feasible or approval of the entire detailed PRD. GATE-02 passes for this decision only. Actual route admission, device safety, distribution, MVP implementation and pilot readiness remain subject to their separate gates. ADR-0010/0011, numeric quality targets, final V1 scope and brand choices are not accepted by this approval. No implementation, public launch, external submission or Stage 2/3 work is authorized by this record.

Revisit with Simon if permitted routes cannot support at least two useful externally verified delegated workflows, or primary policy, supported APIs or measured user jobs materially change. Preserve the options above as the decision's rationale; do not silently substitute weaker outcomes.
