---
title: "Stage 1 Privacy and Data Policy"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [privacy, safety]
related:
  - action-policy.md
  - threat-model.md
  - ../03-agent/memory-system.md
---

# Privacy, data and user authority

**Synthetic prototype exception:** Simon's 2026-09-15 request authorizes opt-in fictional conversation through a local OpenRouter proxy. [Experiment contract](../08-research/openrouter-qwen-prototype.md) owns actual fields, retention limits, disclosure, endpoint protections and test evidence. No real-user data use is authorized; no provider terms, region or deletion guarantee is accepted. This does not implement the product storage/retention inventory below.

Proposed operational policy for PRD-PRV-001–006; confirmed boundary: family support must not become surveillance. [Action policy](action-policy.md) owns consequence rules; [threat model](threat-model.md) owns abuse cases. This is product specification, not a statement of legal compliance, medical classification or approved vendor terms.

## Data and retention inventory

All durations are proposed product defaults, not observed behavior or legal mandates. Disclose before collection; no real-user cloud use until terms, region, subprocessors and deletion semantics are reviewed at GATE-06/09. Local private data uses OS-protected app storage; keystore-backed encryption design and backup exclusions are verification tasks, not implemented claims.

| Class / purpose | Location and authorized consumers | Collection / default retention | Correction, deletion and export |
|---|---|---|---|
| Raw microphone audio for active intent | Device buffer; chosen speech processor only with separate consent | Tap-to-talk and OS grant; memory only, discard after final transcription or capture failure; ≤30s capture | Stop discards buffer; no raw audio history/export; provider retention must be separately disclosed/tested |
| Transcript/typed request/local draft | Local active session; minimized planner payload if consented | Explicit task; clear at task end unless user still reviewing, or 15-minute inactivity/lock/process loss; absolute session cap 1 hour | Edit supersedes old version; cancel clears permits; no default transcript archive |
| Semantic tree / screenshot / selected image | Scoped local observer; selected redacted slice to provider if consented | User-started scope; in-memory only; discard after step/task or protected boundary/revocation | No screenshot gallery/audit; grant does not authorize training or export |
| Selected file URI / attachment references | Local scoped content grant; approved adapter | Only task-needed URI; release when no longer required; persistent grant only explicitly selected V1 use | Delete references/caches; user app's original files remain |
| Explicit UI/voice preferences | Local private store | Explicit setting choice until changed/deleted | Review/edit/restore; export local settings if requested |
| Contact aliases and V1 explicit facts | Local structured store, private to user | Explicit Save only; until deleted; review after 12 months proposed, no automatic erasure of chosen contact | Source/confidence/scope visible; edit/delete/export; remove derived index/cache; no family access |
| Task/audit history | Local minimal journal; user UI and policy | Task type, coarse timestamp, result/evidence grade, codes/versions; 7 days rolling default | Clear history; unresolved effects retain no content and expire on same schedule; never duplicate by analytics |
| Diagnostic export | Local preview; user-chosen support recipient | Opt-in exact preview; app temp file removed within 24h; proposed support copy ≤30 days if collected later | Support deletion process required before pilot; optional note may be private, user reviews separately |
| Consent/authorization state | Local policy store; remote provider/service only when necessary | Consent version/scope/time and active grants; permits in memory ≤60s; consent records until revoked or app data deleted | Revocation immediate local; retain content-free revoked record ≤7 days; no reusable approval in backups |
| Provider transport/account secrets | OS/account/infrastructure boundary, never model/audit | Minimum required for chosen service; not in Git or user-facing history | Owning provider/account controls; revoke integrations; no raw credential tool |
| V1 helper identity/grant/proposals | Local grant authority + selected backend after ADR/evidence | Optional invitation; grant proposed 90-day review; proposal expires in 7 days | Revoke local immediately; delete pending proposals; no task/content entitlement |
| Research recordings/consent | Separate restricted research storage, never repository personal data | Explicit study consent; proposed raw recordings ≤30 days, deidentified synthesis only in Git | Participant withdrawal process before study; separate consent for optional recording |

No cloud synchronization, raw recordings, automatic memory extraction, ad analytics or remote helper access in MVP. A user's selection of a screenshot may contain third-party private content; explain scope and redact before egress. Do not send the whole screen because a model could use more context.

## Data flow and deletion semantics

Capture/selection → local sensitivity classification/redaction → scope/consent check → minimum provider payload → transient response → local typed proposal → independent policy/executor → minimal result journal. Model/provider credentials remain outside model input. TLS and application authentication are implementation requirements for any network route; vendor choice remains open.

Delete memory item: validate user and expected version → mark tombstone and deny retrieval → transactionally remove value + alias/index/cache/derived summaries → invalidate pending plan/permit that referenced it → verify absence → show receipt. If sync is introduced in V1, replicate tombstone before accepting restored data; failed propagation is Pending deletion, never Deleted everywhere. No orphaned embeddings; embedding store is unnecessary in MVP.

Delete local data: preview preferences, aliases, consent and history; warn that messages/photos in other apps and provider-held records are separate → clear app stores/keys/scoped refs and stop work → verify empty state → restart setup. No promise to erase messages already sent or recipients' copies. Cloud/account deletion needs a provider-specific verified contract before offering such a claim. MVP backups exclude private memory/content, credentials, permits and consent authority. Restoring an app never restores execution approval; restore test is mandatory before pilot.

MVP content-free deletion tombstones persist until all referencing local tasks/caches are invalidated, at most 7 days; private stores have no backup/sync restoration route. A future V1 sync design must retain authoritative tombstones/version watermarks until every admitted replica acknowledges deletion and older snapshots cannot be restored into active retrieval. Offline replicas stay unable to serve stale data until reconciled. Never expire a sync tombstone merely because a local 7-day timer elapsed. Exact backend retention/restore protocol is a V1 evidence gate, not an MVP backend requirement.

## Memory ownership and confidence

User-stated and user-confirmed facts remain distinct from model inference. Store provenance, source time, last confirmed, sensitivity, scope and revision. Inferences may exist transiently as candidate interpretations but are never saved as facts in MVP/V1. No medical/cognitive diagnosis, inferred vulnerability, financial profile or relationship truth from a photo. Conflicts prompt user choice, not silent overwrite. Corrections invalidate derived plans and previews.

## Family/helper boundary

MVP: co-present guidance only; no helper backend/account/grant. Adult operates grants and can stop without explaining why. The person buying the tablet obtains no rights to data. User may choose no family involvement.

V1 proposal: separate authenticated helper identity can submit scoped contact/accessibility suggestions. Default grant reveals only selected configuration fields and status of that proposal; no private conversations, screenshots, history, microphone activity, memory, location or usage pattern. Adult sees old/new diff and approves locally. Invitation must show helper identity, scope, expiry and revocation; no automatic invitation from contacts. Revocation immediately removes local authority and rejects queued proposals even offline. Grant expansion is new consent, never inherited.

Remote viewing/control remains later App. Do not send “safety alerts” that reveal adult behavior as a workaround. Research helpers separately, avoid a helper answering the adult's preference questions, and provide a private decline/withdrawal route. Coercion cannot be eliminated by a checkbox; residual concerns gate helper release.

## Pilot support and incidents

Transaction/journal refinement: [execution protocol](../03-agent/execution-protocol.md) specifies local ordering and a content-free crash journal. Private prepared/element digests remain transient; ordinary hashes of names/messages are not anonymous audit evidence. No hidden payload, permit or content fingerprint may survive history deletion to support duplicate detection. Retention expiry, deletion or reinstall removes local evidence, not a remote effect; no promise of exactly-once behavior across those boundaries. Unknown effect never triggers automated resend. EVAL-008/010 must test these limits with synthetic canaries and interrupted journal writes.

Before real users: name support owner and reachable channel/hours, install provenance, supported matrix, participant withdrawal route, incident escalation and tested rollback. No response SLA is promised until staffed.

Suspected wrong-person send/data exposure: disable affected capability locally; preserve minimal content-free event; tell user the known effect and uncertainty; prevent repeated action; investigate using synthetic reproduction. Do not upload raw personal screen/audio by default. Restore capability only after root cause, updated eval and reviewer approval. Account recovery belongs to owning account provider; support never asks for passwords/OTP or takes invisible control.

**Current state:** policy specified, not implemented or validated. Encryption, backup, provider retention, deletion, consent comprehension and helper boundaries need EVAL-008/010/016/017 and RES-08 before their release gates.
