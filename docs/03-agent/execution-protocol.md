---
title: "Local task transaction and verification protocol"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [agent, contract, safety]
related:
  - tool-contracts.md
  - device-control.md
  - ../05-safety-privacy/safety-and-privacy.md
  - ../06-evals/canonical-tasks.md
---

# Local execution protocol

**Proposed specification, not runtime code.** This document owns transaction ordering, event authority and crash/cancel reconciliation. [Tools](tool-contracts.md) own payload schemas; [device control](device-control.md) owns route/freshness/budget rules; [action policy](../05-safety-privacy/action-policy.md) owns consequence and confirmation. It refines PRD-SAF-001–005, FR-012/013/016 and NFR-003/004 for T-103, EVAL-006/009/010. ADR-0010 remains proposed; an offline fake replay can test these assumptions without adopting a production architecture.

## Three different state machines

Do not collapse these into one enum:

| State owner | Meaning | Example |
|---|---|---|
| Session coordinator | User-visible task progress, mapped to the [19 design states](../02-design/product-design-spec.md) | A task is verifying or partially completed |
| Local authority/executor | One operation's right to dispatch and outcome knowledge | A permit was consumed; remote effect remains unknown |
| Adapter/admission registry | Whether an exact route/configuration may be used | Message integration remains disabled pending evidence |

A completed navigation operation can leave the task planning its next step. A stopped task may have an operation whose effect is still unknown. A permitted class does not enable an unadmitted adapter.

## Trusted events and projections

Every event carries taskId, local sequence, event kind, source role, process/session generation, current user/cancel epochs and intent revision when relevant. Only trusted local code assigns sequence, timestamps and source identity. These are interface records, not model-controlled JSON claims.

| Event / producer | Minimum private payload | Consumer behavior |
|---|---|---|
| IntentSubmitted / shell or scoped speech adapter | Original text reference, input mode, revision | Coordinator resolves goal; text cannot add a tool or override restrictions |
| IntentCorrected / shell | Replacement ref and prior revision | Pause queued work; increment revision, invalidate plans/previews/permits |
| ObservationReady / observer | Observation ref, origin/scope/version/freshness/completeness | Accept only for current request/epoch; observed text remains data |
| PlanProposed / planner adapter | Bounded typed plan and required manifest version | Validate schema and registry; never accept planner-issued authorization |
| PreviewRendered / shell | Prepared action ID/version and render revision | Establish which immutable consequence is visible; not approval |
| ApprovalSubmitted / trusted user-input boundary | Visible preview identity, explicit response evidence | Policy validates binding and issues at most one transient permit |
| CancelRequested / local control, permission or lifecycle handler | Task and reason | Advance latch/epoch immediately; do not wait for planner, network or adapter return |
| DispatchReserved / executor | Operation ID, capability/adapter/policy versions, permit consumption status | Persist write-ahead intent; only executor can admit adapter entry |
| AdapterReturned / registered adapter | Operation ID, acknowledgement and scoped evidence refs | Ignore stale/duplicate callbacks for authority; schedule bounded verification if permitted |
| PredicateObserved / verifier | Predicate ID, observed values ref, freshness/provenance | Update outcome knowledge, not plan authority |
| DependencyLost / local monitor | Permission/provider/version/visibility category | Stop affected work; discard sensitive snapshots as required; no automatic resume |
| SessionClosed / coordinator | Reason and known outcome categories | Release raw context and permits; leave only policy-allowed content-free history |

UI derives state from coordinator projections, not directly from model prose. Activity summaries may be generated, but labels like sent, stopped and unknown come from typed outcomes. Telemetry gets only the redacted projection defined below, not full events.

## Operation lifecycle and legal outcomes

| Operation state | Allowed next state | Required condition / consequence |
|---|---|---|
| Proposed | Denied, Prepared, Ready | Schema, support mode and effect classification checked |
| Prepared | Ready, Invalidated, Cancelled | Consequential operation needs fresh exact user approval; local preparation creates no external effect |
| Ready | Reserved, Invalidated, Denied, Cancelled | Recheck all authoritative versions/epochs, budget, grants, context and permit |
| Reserved | Dispatched, CancelledNoDispatch, Unknown | Durable intent exists; final permit consumption and adapter-entry admission have not yet occurred. Crash here is conservatively unknown unless absence of adapter entry is proven |
| Dispatched | Verifying, Unknown | Permit consumed at final admission when required; adapter entered once; callback success alone proves neither effect nor completion |
| Verifying | Verified, Partial, NoEffect, Unknown | Independent registered predicates; incomplete/mismatched evidence never upgrades |
| NoEffect | Fresh proposal or Failed | Retry only when independently proven no effect and the capability's rule permits it; consumed permits are never restored |
| Unknown | Verified, Partial, NoEffect, ClosedUnknown | At most the permitted read-only reconciliation; no effectful retry |
| Invalidated / Denied / CancelledNoDispatch / Verified / Failed / ClosedUnknown | Terminal for this operation | Further user work is a new operation with fresh authority; old callbacks cannot reopen dispatch |

Partial is a known subset plus unresolved predicates. It may terminate the operation/task or lead to a new independent step only when that step cannot repeat or worsen the unresolved effect. For one possibly sent message, unknown send status is not permission to prepare a duplicate automatically.

NoEffect requires proof appropriate to the route, not absence of a receipt, empty UI, timeout or exception. If an external effect may have happened, return Unknown/Partial instead of a generic failure suggesting retry.

## Dispatch and Stop linearization

A local critical section must serialize **adapter-entry admission** with the cancellation latch. Expensive observation, network, model and disk waits must not hold a lock that blocks Stop.

1. Resolve/validate schema, registry, entity and fresh observation outside the short critical section.
2. Prepare durable dispatch-intent record. If persistence fails, do not dispatch. Any awaited work requires freshness and cancel recheck afterwards.
3. In the short serialized transition, verify current generation/epochs, scope, context, deadlines, budget and fresh permit; claim the single-use permit and mark adapter entry admitted.
4. Adapter entry is the linearization point of DispatchBegin. It must not merely queue an unguarded effect for later. Adapters recheck cancellation immediately before each internal external operation and cannot enqueue hidden continuation.
5. Release the critical section; wait asynchronously for bounded return/verification. Stop advances the latch independently.
6. Record result based on evidence, and never reuse the consumed permit even after local failure.

The journal and external service cannot form one atomic transaction. A crash between journal write and adapter entry may overstate uncertainty; safe uncertainty is preferable to duplicate effect. A Stop after DispatchBegin may race with a remote effect; the contract forbids **new dispatch admission after the latch**, not promises to recall packets or undo an already-dispatched action. If a device adapter cannot implement a responsive boundary, it fails admission and falls back to guidance.

After Stop, reconciliation may consume an already-delivered or in-flight receipt under still-valid data scope; it may not start another adapter read, polling loop or capture. If fresh status access is needed, offer an explicit user-requested check/manual inspection under new scope and budget, never resume the cancelled task or resend its effect. Before cancellation, a single permitted read-only reconciliation remains bounded by the existing task's budget. This distinction preserves both no-post-latch dispatch and truthful in-flight outcomes.

T-103 uses deterministic fake entry/latch scheduling. Physical p95 timing and human-touch attribution remain separate EVAL-006 evidence. A nonblocking fake implementation cannot prove Android's lifecycle or another app's behavior.

## Binding, freshness and version rules

Prepare an immutable record of capability/operation, exact recipient endpoint, account/channel, content bytes, attachment identities, declared effects, task/intent/plan revision, registry/policy/adapter version and context. The trusted renderer and executor use the same local record. A model-supplied digest or recipient label is not authority.

“Normalized digest” in common types means a deterministic encoding of typed fields, **not rewriting message text**. Preserve exact Unicode content and channel-specific semantics; no trimming, translation, altered punctuation or hidden normalization after preview. Any required adapter transformation must be visible before approval, or the route is unsupported. Cryptographic implementation and canonical encoding version must be selected/tested in the coding task; a fake equality token is not a security primitive.

Approval is bound to the displayed prepared record and current task/user generation. Re-rendering unchanged text is not a new approval. Content/target/account/policy/adapter/intent changes invalidate it. Ordinary observation timestamp changes alone need not invalidate unchanged context, but the adapter must prove equivalence; otherwise ask again.

Monotonic deadlines are valid only in one process/boot generation. Reject unknown generations, future capture timestamps, counter regression/overflow, stale observations and permits expired at the boundary. Do not translate an old monotonic timestamp into wall-clock authority after restart. Privacy retention may use wall time, but clock uncertainty must not restore expired data or grants.

## Verification predicates

Each capability registers an expected predicate set, an observation source and failure behavior. An expected value is distinct from the observed value: a verifier cannot pass by comparing a plan to itself.

| Claim | Necessary observation | Insufficient evidence |
|---|---|---|
| App opened | Current foreground route/package matches admitted target | Intent accepted by Android |
| Photo found from person/date | Attachment provenance plus exact endpoint/time interval from admitted source | Face recognition, gallery image or suggested filename |
| Message prepared | Local immutable draft read-back | Model says it drafted |
| External draft opened | Owning app/draft state where available; otherwise only launch/handoff claim | Claiming sent or delivered |
| Message sent | Admitted receipt/status tied to expected account/endpoint/content or unambiguous operation ID | Button click, no error, planner confidence |
| Media playing | Matched content identity and active playback state | Search result or app launch |
| Text adjustment applied | Stored value and resulting own-app UI/read-back | Preview-only state |

Evidence with wrong account, operation, generation, predicate or version is rejected. Duplicate identical evidence is idempotent. Conflicting evidence records a verification defect and preserves uncertainty; never pick the more reassuring result. Read-only reconciliation after permission loss must not read protected data without a valid scope.

## Crash, duplicate suppression and privacy

Maintain a minimal durable operation journal distinct from private active-session payloads. Proposed durable fields: opaque operation/task IDs, capability and version IDs, dispatch/outcome category, coarse retention timestamp, permitted opaque provider receipt reference if demonstrably non-content-bearing, and verification grade. No recipient, message body, screenshot, transcript, ordinary content hash, prepared digest or permit in durable/exported audit. Ordinary hashes of names/messages can leak guessable content.

Restart clears permits and raw context, increments generation and quarantines unresolved dispatches. It never reconstructs a send from a journal. A same-session duplicate request ID resolves to the existing operation result, not new dispatch. An unknown effect prevents automated resend; offer owning-app manual inspection. If an adapter needs sensitive receipt/endpoint material to reconcile after restart, that is a new privacy design question, not permission to silently persist it.

Journal retention/deletion follows the [privacy owner](../05-safety-privacy/safety-and-privacy.md). Deleting history removes that evidence; it cannot prove the remote effect did not happen. Do not retain hidden payloads/fingerprints or promise duplicate detection across history deletion, app-data clearing, reinstall or retention expiry. Those cases require a new explicit task and honest missing-history warning where relevant; no automatic continuation. The product cannot prevent a person manually sending twice in another app.

## Review invariants and evidence

T-103 must cover: untrusted producer cannot issue approval; mismatched preview cannot dispatch; one permit has at most one admission; cancelled epoch admits none later; every internal adapter operation uses the budget; deadline/freshness checks survive awaits; unknown never retries; restart never resumes; duplicate callbacks never create authority; metadata exports contain no fixture canary text.

Use the [T-103 packet](../10-execution/task-packets.md#t-103-packet) for test cases, not a second protocol definition. EVAL-006 owns cancellation, EVAL-010 authorization/injection/replay, EVAL-009 dependency/provider variation, EVAL-008 durable data/export. All remain unrun until a runtime test artifact exists.
