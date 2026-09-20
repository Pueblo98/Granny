---
title: "Stage 1 Typed Capability Contracts"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [agent, interfaces]
related:
  - device-control.md
  - ../05-safety-privacy/action-policy.md
  - ../04-architecture/system-overview.md
---

# Typed capability contracts

These vendor-neutral interfaces define the proposed MVP; bounded fixture implementations are listed below and do not imply production admission. [Policy](../05-safety-privacy/action-policy.md) owns grants/consequence/permit rules; [device control](device-control.md) owns budgets/freshness and [execution protocol](execution-protocol.md) owns transaction/event/journal semantics. [Capability admission](../04-architecture/capability-admission.md) owns build/configuration support. There is no generic shell, arbitrary HTTP, raw credential, unbounded tap or model-defined script capability.

## Local prototype implementation exceptions

The [conversation runtime](../04-architecture/conversation-runtime-contract.md) implements a narrowly authorized local demo interpretation of CAP-05/07/12: real MCP calls against fictional contacts and an isolated unsent store. The native debug shell implements a local CAP-11 preference slice and [T-124](../10-execution/backlog.md#t-124) implements only CAP-10 `media.requestHandoff` mechanics against locally discovered Android handlers. It does not implement CAP-10 play/pause evidence. These prototype names do not admit CAP-08/09, real sending or candidate external control. The generic vendor-neutral production contracts below remain proposed; T-103 and canonical device evals are not completed by these experiments.

## Common types and trust

```text
CapabilityId = one of registry-owned enumerated identifiers below
Request<T> = {taskId: UUID, stepId: UUID, requestId: UUID,
              intentRevision: UInt, planVersion: UInt, policyVersion: String,
              adapterVersion: String, userEpoch: UInt, cancelEpoch: UInt,
              deadlineMonotonicMs: UInt64, scopeRef: OpaqueId,
              observationRef?: OpaqueId, permitRef?: OpaqueId, input: T}
Result<T> = Verified<T> | Prepared<T> | Partial<T> | Unknown | Denied | Failed
ResultCommon = {requestId, observedAt, evidenceRefs: OpaqueId[],
                effect: None|Local|External, failureCode?, retry: Never|ReobserveOnce}
Observation = {id, origin: Native|Semantic|UserSelectedImage,
               packageRef, appVersion, windowId, displayId, epoch,
               capturedAt, sensitivity: Public|Personal|Protected,
               grantedScopeRef, elements: ElementSummary[], completeness}
ElementRef = {observationId, ephemeralNodeKey, packageRef, windowId,
              role, allowedActions, labelDigest, resourceId?, ancestorDigest,
              boundsForValidation, epoch}
PreparedAction = {id, version, taskId, capabilityId, recipientEndpoint?,
                  channelRef?, contentRef?, attachmentDigests[],
                  effectDescription, normalizedDigest, expiresAt}
Evidence = {id, kind: LocalReadback|SemanticPostcondition|ProviderReceipt|
                     HumanObserved|UserReported,
            predicateId, observedAt, originRef, confidence: Known|Uncertain}
FailureCode = PER_INCOMPLETE | INT_AMBIGUOUS | ACT_NO_EFFECT | VRF_UNKNOWN |
              AUT_DENIED | AUT_STALE | PRV_SCOPE | SEC_PROTECTED |
              DEP_OFFLINE | DEP_AUTH | DEP_PERMISSION | DEP_VERSION |
              USR_INTERRUPTED | PLN_BUDGET | REC_STOPPED
ComponentPlan = {schemaVersion, taskId, planVersion,
                 regions: [{componentId, componentVersion, variant,
                            typedSlotsRef, allowedActionRefs[], orderHint}],
                 focusStartRef?, contentVersion}
RoomContextEnvelope = {currentRoomRef?, queryPurpose, sourceRefs[],
                       sourceRoomRefs[], sensitivityRefs[], generatedAt,
                       resolverVersion, scopeRef}
RoomChangeProposal = {proposalId, expectedRoomRevision?,
                      operation: Create|AddReference|MoveReference|RemoveReference|
                                 Archive|Restore|DeleteContainer,
                      roomRef?, itemRefs[], destinationRef?, expiresAt}
```

UUIDs are session/install-scoped internal IDs, never device serials. Content references resolve only inside scope-aware local stores; raw personal values do not go into audit. Prepared/element content digests are private transient values, not exportable anonymous identifiers. The execution protocol defines exact-content encoding and prohibits durable personal-content hashes/permits. HumanObserved is a test oracle, not production claim. UserReported is presented as “You said…” and does not upgrade independent task verification. Model confidence alone cannot produce Verified. Outputs cannot create new executable capabilities.

Result is a tagged union, not a free-form model object: each variant contains ResultCommon and a fixed discriminator. Verified requires a registered postcondition satisfied by fresh independent evidence; Prepared identifies the immutable preview and explicitly has no completed external outcome; Partial lists verified predicate IDs and unresolved IDs; Unknown names a possibly dispatched effect and forbids repeat; Denied includes policy reason and no-effect evidence; Failed includes failure category and whether no effect is proven. Uncertain effect must return Unknown/Partial, never Denied or Failed with an implicit no-effect claim. Missing/extra fields, wrong types and out-of-range values fail schema validation before dispatch.

ComponentPlan is presentation data, never a capability or action request. The renderer accepts only registered CMP IDs/versions/variants and typed slots, derives native semantics/focus/reflow locally, and resolves action references only to already permitted app actions. Unknown components, arbitrary code/handlers/styles, deceptive consequence labels, missing required preview fields or duplicate effect controls fail the entire plan to a known fallback. Rendering cannot mint a permit or dispatch a tool.

Proposed bounded inputs: one active task, ≤12 plan steps; person/query text ≤256 Unicode code points, exact message draft ≤4096 code points (lower adapter limit applies; never silently truncate), entity results ≤5 per explicitly requested page, known registry predicates only. TextScale and SpeechRate use the closed preview choices in the design system; PrivateSpeech and ReducedMotion are booleans. A composite tool debits every internal action/read/wait against the shared executor budget; no hidden unbounded search. Oversized input produces an editable clarification, not a guessed shortened command.

Interface failure enum maps to the canonical taxonomy for logs/evals: PER_INCOMPLETE→PER-02, INT_AMBIGUOUS→INT-02, ACT_NO_EFFECT→ACT-02, VRF_UNKNOWN→VRF-03, AUT_DENIED→AUT-01, AUT_STALE→AUT-02, PRV_SCOPE→PRV-01, SEC_PROTECTED→SEC-02, DEP_OFFLINE/DEP_AUTH→DEP-02 (with dependency subtype), DEP_PERMISSION→DEP-01, DEP_VERSION→DEP-03, USR_INTERRUPTED→USR-01, PLN_BUDGET→PLN-02, REC_STOPPED→REC-02. Safe expected denials/interruption are outcomes, not automatically defects; record defect only when required behavior fails. Preserve specific source code when taxonomy family alone loses detail.

Registry entry: capability ID, schema version, allowed build modes, adapter package/signature/version predicates, API/recipe origin, actual side effects, scopes/Android grants, class, confirmation rule, deadlines, pre/postcondition predicates, idempotency, privacy fields and associated eval IDs. Policy computes most restrictive class among operation, parameters, adapter and observed state. User-supplied package names/URLs cannot become routes without registry lookup.

## MVP capabilities

All calls inherit: active unlocked task, actual permission and scope recheck, current versions/epochs, unexpired deadline and cancellation latch. Every tool returns audit envelope (capability, class, result/failure, duration, evidence kind, versions, no raw text). Personal fields stay local unless privacy filter and separate provider consent permit the minimum slice.

| ID / typed input → output | Permissions / class / confirmation | Preconditions and verification | Failure / retry / privacy |
|---|---|---|---|
| CAP-01 observe.screen {scope, requestedFields: FieldEnum[]} → Observation | User-started semantic grant or owning API; POL-00; no screenshot implied | Allowlisted foreground package/window; reject protected fields/windows; evidence timestamp and completeness | Null/stale tree → PER_INCOMPLETE; one fresh read; Personal tree ephemeral |
| CAP-02 observe.selectedImage {grantedUriRef, purpose: ExplainScreen} → scoped image/text evidence | Picker URI or explicit capture grant; POL-00; separate cloud consent | User selection/session valid; capture secure/unavailable error terminal; no identity/permission inference | Expired URI/capture → deny; one user-selected retry only; never ambient capture |
| CAP-03 app.open {registeredRouteId} → Prepared or Verified foreground | Admitted native intent/API or tested semantic route; POL-01 or declared POL-03 side effect | Target package/version known, no protected state; verify foreground package; does not verify downstream task | No handler/version mismatch → guidance; one re-observe, no repeated launch; package status minimal |
| CAP-04 ui.navigate {elementRef, action: Open / ScrollForward / ScrollBack / Back, expectedPredicateId} → evidence | Semantic service and admitted fixed recipe/build; POL-01; declared mark-read/discard effects elevate/deny | Element freshly re-resolved unique in same package/window/epoch; action in allowlist; recipe transition valid | Stale/ambiguous/unsaved work denies; one retry after proven no effect; no Send/Accept/Delete/SetText through this tool |
| CAP-05 people.resolve {queryRef, contextScopeRef} → UniqueEndpoint or Candidates or None | Explicit local aliases/approved contact picker; POL-00 | Endpoint from known source; choices carry minimum differentiator; no frequency guess for consequence | INT_AMBIGUOUS → user choice; repeat safe read; Personal endpoint never audit |
| CAP-06 photos.find {personRef, channelRef, startInstant, endInstant, zone} → MatchingAttachments or Partial | Admitted integration or fixed recipe with allowed observation; POL-00/01, elevated if mark-read | Exact endpoint/channel/interval; bounded search; verify attachment and sender/date evidence | Missing metadata = partial; no face/name inference; one read retry; no save/share; Personal image refs ephemeral |
| CAP-07 message.prepare {recipientRef, channelRef, exactBodyRef} → PreparedAction | Local only POL-02; no external insertion | Resolved endpoint, supported route, no unresolved content; digest immutable canonical bytes; read-back preview | New content produces new version; safe local recompute keyed by draft ID; message body Personal |
| CAP-08 message.handoff {preparedRef} → Prepared externalDraft | POL-03 fresh permit; registered native/approved route | Digest matches exact endpoint/body/channel; adapter declares sync/typing effects; verify draft UI if available else opened-only | No handler/auth/unknown → no send assertion; no automatic repeat after uncertain handoff; no clipboard fallback |
| CAP-09 message.commit {preparedRef} → Verified sendReceipt or Unknown | POL-03 permit; only separately admitted supported send integration; **disabled until gates** | Exact preview, authenticated owning route; journal before dispatch; validate receipt target/content reference/status | Retry Never on unknown; reconcile status read once; no coordinate/accessibility catch-all send; Personal output redacted |
| CAP-10 media.requestHandoff {registeredHandler, mediaFocus, exactQuery} → HandoffEvidence or Unknown; media.play {registeredService, selectedContentRef} / media.pause {playbackRef} → PlaybackEvidence | Handoff: exact locally discovered/reviewed handler in synthetic lab; play/pause: admitted media API/recipe; no paid transaction; POL-01 | Handoff binds exact handler/focus/query and proves only launch acceptance; play/pause require resolved content and independent identity + playing/paused state | Stop revokes pre-launch handoff; after launch user takes over and playback remains unverified; unknown never retries; ads/paywall/auth stop; query Personal; no subscription acceptance |
| CAP-11 preferences.preview/apply {key: TextScale / SpeechRate / PrivateSpeech / ReducedMotion, value, priorVersion} → LocalPreferenceEvidence | Local settings POL-02; explicit local user action | Typed range and previous value; apply compare-and-set; read back and verify UI accessible | Version conflict re-preview; same request id idempotent; no global Android settings writes |
| CAP-12 task.cancel {taskId, reason: Stop / Takeover / Revoked / Locked} → CancelReceipt + InFlightStatus | Trusted local control, never needs model/permit/network | Atomic cancel epoch advance; deny later dispatch; stop capture/speech; reconcile in-flight journal | Must succeed locally or service disables itself; repeat idempotent; no raw content |
| CAP-13 memory.list/edit/delete {scope: ExplicitPreferences / Aliases, itemId?, expectedVersion?, valueRef?} → ItemEvidence | User-local scope; POL-00 read, POL-02 edit, POL-03 bulk delete/export | Provenance explicit; derivative lookup invalidated transactionally; tombstone/read-back | Version conflict → review; deletion idempotent; no automatic inferred writes; policy governs retention |
| CAP-14 audit.summary/export {taskIds?, exportPreviewRef?} → RedactedSummary or ExportRef | Own user; POL-00 summary, POL-03 export | Export preview digest matches output; no audio/screens/tree/content/secrets | Export cancelled/no grant stops; no implicit upload; summary minimal |

CAP-10 and CAP-11 are namespaces of separate typed operations with separate schemas; do not accept a generic verb string. CAP-10 handoff evidence cannot satisfy a `media.play` or `media.pause` postcondition. CAP-13 operation schemas prohibit arbitrary queries or store access. CAP-04 is available only to the admitted deterministic recipe engine (or isolated synthetic dynamic lab), never a public unbounded model click tool. General structured UI automation frameworks are test tools, not production privileges.

## Provider and simulation ports

```text
PlannerPort.propose(RedactedContext, CapabilityManifestSubset)
    -> ValidatedPlanProposal | NeedClarification | ProviderFailure
SpeechPort.transcribe(ScopedAudioStream, Locale) -> PartialText | FinalText | Failure
VerifierPort.check(PredicateId, ExpectedValuesRef, FreshObservation) -> Evidence
FixturePort.reset(FixtureId, VersionedEnvironment) -> StartingStateDigest
ReplayPort.feed(RecordedSyntheticObservation, ClockTick, UserEvent) -> Trace
```

Provider adapters cannot receive permits, native nodes, credentials or arbitrary network destinations. Transport/credentials are infrastructure-owned. Replay uses synthetic fixtures, fake clock and deterministic receipt/action drivers; it cannot dispatch to real apps. Evaluation injects permission loss, stale nodes, duplicate callback, process death, provider outage, user touch, lock and malicious observed text.

V1 capabilities (calls, reminders, documents, Context Rooms, helper proposals and ADR-0012 automatic important-fact memory/adaptive communication) require their named schemas with PRD-FR-018–020/022, PRD-PRV-003/005 and EVAL-008/012/013–017 before task admission. No unrestricted placeholder API should be implemented “for later.”

<a id="cap-15"></a>
## CAP-15 — Context Room organization and retrieval (proposed App V1)

CAP-15 is a namespace of closed typed operations, not a generic room-store API:

| Operation | Input → output | Class and invariant |
|---|---|---|
| `rooms.list/get/search` | room/query/scope refs → labeled rooms or provenance-carrying canonical item refs | POL-00; local bounded reads; whole-store prompt export and raw content enumeration denied |
| `rooms.context.resolve` | goal + current room + allowed scopes → `RoomContextEnvelope` | POL-00; minimum necessary current-room first, relevant cross-room second; sensitivity/egress policy filters before planner |
| `rooms.change.prepare/apply` | `RoomChangeProposal` → exact diff then receipt | POL-02 for create/add/move/remove/archive/restore; expected revisions, visible receipt/Undo and canonical item preservation |
| `rooms.deleteContainer` | inventory + exact room revision → verified container deletion receipt | POL-03; invalidates room-scoped plans/permits, rehomes room-only refs and never deletes canonical content |

Underlying item/memory deletion calls the owning typed capability through a
separate prepared action. Room membership cannot widen file permission, memory
admission, helper access, egress or external-action authority. T-119 may model
CAP-15 against a deterministic in-memory fixture only; persistent storage needs
an admitted data design, EVAL-008/012 evidence and a separately ready task.
