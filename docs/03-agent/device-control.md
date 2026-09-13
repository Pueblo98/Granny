---
title: "Stage 1 Device Control and Recovery"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [agent, android]
related:
  - tool-contracts.md
  - ../05-safety-privacy/action-policy.md
  - ../06-evals/canonical-tasks.md
---

# Device control and recovery

[ADR-0005](../09-decisions/ADR-0005-semantic-control-before-vision.md) establishes API → semantic accessibility → structured UI automation → bounded vision/coordinates preference. Availability is filtered by [distribution feasibility](../08-research/android-stage-1-feasibility.md). A lower route is not automatically permitted when a higher route fails.

## Execution algorithm

1. Local coordinator accepts one task and snapshots permission/consent/build-registry versions and user/cancel epoch.
2. Observer obtains scoped state; executor rejects action-critical observations older than proposed 2 seconds or with changed window/epoch.
3. Planner or fixed recipe proposes one typed step with registered pre/postcondition. Independent policy computes real consequence and denies unsupported routes.
4. For POL-03, local UI reviews immutable PreparedAction; permit remains local and exact.
5. Under serialized executor lock, re-resolve semantic target or API entity; check unique identity, current package/window/version, preconditions, grants, policy, permit and cancel epoch. Consume permit and journal dispatch intent atomically relative to local queue.
6. Dispatch once. Callback is execution acknowledgement, not outcome. Observe postcondition and independently grade evidence.
7. Record verified/partial/unknown. Continue only if next step still fits original goal, scope and remaining budget. Report accurate result.

## Semantic identity and stale UI

ElementRef is ephemeral: observation/window/package/role/resource ID where exposed, label and ancestor digests, allowed action set, state and interaction epoch. Bounds are used to detect change, not constitute semantic identity. Re-resolve immediately before action; require one match with equivalent label/role/context. Null root, multiple matches, recycled/stale node, scroll/recomposition, IME, notification/dialog, rotation, window swap or app update invalidates prior reference. Never click the first matching text across windows.

Adapters must declare side effects such as mark-read, draft sync or discarded edits. A navigation tool cannot submit forms, send, share, delete, approve dialogs or enter credentials. Protected windows suspend capture and execution. Unknown dialogs stop rather than clicking a guessed dismiss button.

Observation identity and context epoch are different. A fresh snapshot gets a new observation ID; it retains the external context epoch only if the adapter proves the relevant account/window/entity/content/preconditions unchanged. Showing Granny's own confirmation does not itself change the bound external target, but returning must re-observe it. Any material target change invalidates approval; inability to prove equivalence requires a new preview or manual handoff. This avoids treating a new timestamp as new authority or endlessly invalidating unchanged previews.

Composite capabilities such as photos.find must debit every internal UI/API effect and wait against the same task budget and cancellation latch. Adapters cannot hide loops behind one tool invocation. A verified intermediate step returns to planning for the remaining goal; only the entire requested postcondition allows completed. EVAL-006/010 must exercise a two-step task as well as terminal success.

## Budgets — proposed, shared across replans

| Limit | Value / rationale | Exhaustion behavior |
|---|---|---|
| Task effects | ≤12 dispatched actions | Recover/stop, no reset by replan |
| Active machine time | ≤60s including app/network/model waits; excludes user reading/approval pause | Fail safely or partial; no background continuation |
| Observation/API deadline | 5s nominal | One fresh read if safe |
| App transition wait | 5s then explain; at 15s offer manual path | Bound by remaining 60s |
| Postcondition verification | 5s + one 5s re-observation | Unknown/partial; never retry send |
| Reversible retry | Once after independent evidence of no effect | Circuit breaker |
| Loop detection | Same normalized state/action pair twice, or two recoveries without progress | Safe stop and reason |
| Consequential dispatch | One per single-use permit | No blind resend/retry; fresh request cannot ignore unresolved prior effect |
| Cancel response | Proposed p95 latch ≤200ms; next dispatch prohibited | On control-service health failure, disable execution |

Timeouts use monotonic clock. Context/permit expiry follows [policy](../05-safety-privacy/action-policy.md) and [retention](../05-safety-privacy/safety-and-privacy.md). Larger user reading time does not extend a minted permit; renew preview calmly.

## Takeover and cancellation races

User/cancel events have priority over queued model output. Permission loss, lock, process restart or lost stop surface increment epoch and clear permits. No new dispatch after latch; reconcile in-flight effects using read-only status if still permitted. Third-party action cannot always be recalled. Report “I stopped; [effect] is unknown” until evidence.

Do not claim all touches outside Granny can be intercepted. Validate event attribution/gesture interruption on each device/app/accessibility profile; if reliable detection or mutual exclusion cannot be established, restrict route to manual handoff. Avoid touch-blocking overlays that prevent the user's takeover. TalkBack touches are user control, not nuisance.

## Recovery table

| Trigger | Permitted recovery | Prohibited recovery / result |
|---|---|---|
| No tree / missing labels | Fresh semantic observation; explicit selected screenshot explanation | No guessing hidden controls; unavailable/partial |
| Node/window/app version changed | Invalidate plan/permit; check admitted version and re-resolve | No stale click or generic coordinates |
| Permission revoked | Stop protected work and clear snapshots; user opens Android settings | No self-enablement; permission lost |
| Authentication/secure screen | Stop observation and let owning app authenticate | No credential tool; authentication required |
| Offline/provider outage | Local help and manual path; explicit new request after recovery | No queued effect or automatic resume |
| Wrong/missing entity | Clarification or explicit contact selection | No relationship/frequency guess |
| Unsaved edits/destructive dialog | Explain and hand off user choice | No repeated Back/dismiss |
| Unknown consequence | Reconcile receipt/current state once; quarantine task against duplicate | No retry or success from callback |
| User touch/Stop/lock | Latch and reconcile, preserve external app state | No automatic resumption or invented undo |
| Budget/no-effect loop | Terminal safe stop + specific next step | No reset budget, new provider, route downgrade or hidden retry |

## Vision fallback

MVP permits separately consented image explanation only. Coordinate interaction is disabled in MVP/V1 proposed scope until a dedicated adapter/decision/eval gate defines low-consequence bounds and independent verification. Future bounded fallback could identify one nonconsequential target in one current frame with strict bounds/epoch checks; it cannot commit, authenticate, grant permissions or bypass secure capture. This is deferred Stage 1 work, not an OS requirement.

Verification evidence and privacy-safe replay requirements are in [tool contracts](tool-contracts.md). EVAL-001–010 cover these failures; physical tests remain unrun.
