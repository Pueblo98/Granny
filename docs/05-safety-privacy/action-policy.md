---
title: "Stage 1 Action and Confirmation Policy"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [safety, policy]
related:
  - safety-and-privacy.md
  - threat-model.md
  - ../03-agent/tool-contracts.md
---

# Action policy — single enforcement authority

**Proposed mechanics; confirmed principles:** consequence-specific approval, visible control, user primacy, no untrusted-screen authority and stock-Android limits come from current direction and [accepted ADRs](../09-decisions/README.md). Product scope is the [PRD](../01-product/prd.md). Agent descriptions must link here, not create competing action classifications. Stricter platform/distribution restrictions always deny an otherwise product-allowed action.

## Authorized local demo — 2026-09-15

Simon requested a real local backend/MCP prototype for fictional unsent messages. [Runtime contract](../04-architecture/conversation-runtime-contract.md) enforces POL-02 local preparation/save with an explicit exact preview and single-use confirmation binding for this experiment. It does not reclassify a demo write as external sending or admit POL-03 account/device effects. Contact/tool output is untrusted; only independent readback permits a created-draft result. Stop after dispatch yields unknown and no automatic duplicate. Production policy and gates below remain unchanged.

## Classes and common enforcement

| Class | Authority / default | Authentication and confirmation | Visibility / cancellation / undo | Time, revalidation and evidence |
|---|---|---|---|---|
| POL-00 Observe | Read minimum user-approved scope for active request | OS grant plus purpose consent; separate cloud consent; unlocked active session | Visible reading/capture state; Stop ends collection; read aloud can expose content and follows speech preference | Snapshot ≤2s old for action decisions; no background observation; audit scope ID/count/code, no raw content |
| POL-01 Navigate/reversible | Execute admitted low-consequence step for current intent | No repetitive confirmation; unlocked session and actual grant check | Visible task + Stop; no undo claim for navigation with discarded work; detect unsaved edits first | [Shared operation/time budget](../03-agent/device-control.md); one proven-no-effect retry; postcondition must verify; unknown surface denied |
| POL-02 Prepare/local preference | Prepare without external consequence; local reversible settings/explicit alias edits | User request/explicit local Save; no external approval inferred | Preview and edit; Cancel before effect; Restore if prior value known | Content/context versions tracked; local read-back; draft expires with session; audit operation type only |
| POL-03 Consequential | Fresh specific approval, single exact effect | Local user preview → affirmative touch or unambiguous active-session speech; owning app authenticates if required; unlocked is necessary but not identity proof | Target/content/channel/effect visible; Stop effective before dispatch; in-flight reconciled; external undo only if supported and separately authorized | Proposed permit 60s from approval, one use, task/plan/user/device epoch bound; fresh observation; outcome journal; no automatic retry of unknown effect |
| POL-04 Delegated routine | Explicit bounded recurring grant, **disabled MVP/V1** | Future ADR must define actor/scope/time/frequency/limits and authentication | Persistent inspect/revoke and understandable activity; no silent scope growth | No implementation authority now; new evals before admission |
| POL-R Restricted | Explain limit; user-operated manual route only | Neither generic yes nor helper permission enables tool | No protected observation/operation; user retains ordinary Android access | Denial reason, no credential/content logging; no alternate-tool workaround |

**Approval binding:** local issuer creates opaque, unforgeable single-use permit bound to user/session/device ID, task ID, plan version, prepared-action digest, capability/adapter/policy version, recipient stable endpoint, exact normalized content+attachment hashes, channel, expected effect, screen/context epoch, relevant permission snapshot and expiry. Only policy/executor can validate/consume it. Model receives an opaque reference, never signing material.

Material edits, person/channel/account change, unexpected window, app/recipe version change, lock, cancellation, touch takeover, permission/cloud-consent revocation, session expiry or process restart invalidate it. A fresh monotonic TTL prevents clock changes extending authority. A preapproved request is not a blanket session grant. Prior family consent, model confidence, screen instructions, silence and unrelated “yes” are never permits.

At dispatch, validate digest and current state under the same serialized executor lock as consuming permit and writing dispatch journal. Cancellation queued before dispatch wins. After dispatch, record known/unknown outcome and reconcile; at-most-once dispatch does not imply exactly-once third-party effect. Expiry leaves preview readable. High-risk domains remain restricted even with user approval.

## Category matrix

Each row inherits **all** fields of its class above; row-specific limitations override it. “MVP” means proposed scope after feasibility/distribution gates, never blanket platform permission.

| Category / release | Observe | Prepare | Execute directly | Fresh confirmation | Bounded delegation | Restrict / verify / forbidden shortcut |
|---|---|---|---|---|---|---|
| Open/search admitted apps — MVP | POL-00 active scope | Resolve app/query | POL-01 | If opening itself exposes explicitly sensitive content, ask user to open manually | No | Verify expected package/result; unknown installed app not allowed by model string |
| Read screen/photos/messages — MVP scoped | POL-00 | Summarize source/uncertainty | Read-only navigation POL-01 | Separate disclosure for cloud/read-aloud private content | No | No credential/secure data; opening conversation can mark read: adapter must declare this social side effect and require POL-03 or exclude route |
| In-app text, speech, media volume — MVP | Current setting | POL-02 preview | POL-02 apply known reversible value | Unneeded unless privacy effect changes | No | Read-back; restore prior value; no alarm/call volume or global accessibility automation |
| Device settings — MVP guidance | Non-sensitive allowed status | Open appropriate settings handoff | Navigation only | Android user decides changes | No | Permission/security changes never automated; brightness/global changes out until separately admitted |
| Message draft — MVP | Scoped contacts/context | POL-02 local exact draft | No external insertion by generic text tool | POL-03 for external draft handoff (possible sync/typing side effect) | No | Handoff is prepared, not sent; no SMS inbox or notification-text substitute for message archive |
| Send message / start call — admitted MVP send; V1 calls | Exact target/status only | POL-02 | No | POL-03 for exact effect | No | Receipt/target account verifies; no coordinate commit, no automatic resend/redial |
| View selected files/photos — MVP photos/V1 documents | POL-00 via grant | Selected subset only | POL-01 view | POL-03 for external share/export | No | No broad storage crawl; no share from viewing intent |
| Save/move/delete files — later App | Scoped metadata | POL-02 preview | No | POL-03 after new scope admission | No | Require actual recovery/undo semantics; permanent delete excluded MVP/V1 |
| Calendar/reminders — V1 | Chosen items | POL-02 parsed date/time/timezone | No | POL-03 create/update/delete | No | Verify persisted schedule, not intent launch; no medical-critical guarantee |
| App installation/uninstallation — Stage 1 | App availability only | Explain legitimate user route | No | User acts in owning store/system; Granny approval grants nothing | No | POL-R executor; no install packages tool, no bypass restricted settings |
| Permissions/security/default roles — Stage 1 | Grant status only | User-owned settings handoff | No | OS-specific user grant only | No | POL-R mutation; no click-to-enable accessibility or disable protections |
| Credentials/account recovery — Stage 1 | Recognize boundary without reading protected fields | Plain generic guidance | No | Owning app authenticates user | No | POL-R; no password, OTP, cookie/token export, biometrics spoofing or recovery tool |
| Purchases/finance/legal assent — Stage 1 | No protected account inspection | Explain limitation | No | Cannot unlock restricted tools | No | POL-R regardless of apparent low amount or UI simplicity |
| Location/emergency/medical — Stage 1 | No background location or health inference | Explain product limitation; ordinary user-owned route | No | Cannot authorize emergency dispatch/medical decision | No | POL-R; no emergency-service promise, no silent location sharing |
| Explicit aliases/preferences — MVP | User's local items POL-00 | POL-02 | Save explicit local value POL-02 | Delete-all/export data uses POL-03 | No | Provenance and derivative deletion verified; no automatic inference persistence |
| Explicit dates/relationships — V1 | POL-00 private | POL-02 proposed entry | No automatic extracted saves | POL-03 confirm new personal fact/share/export | No | Keep uncertain/source label; no diagnosis |
| History/diagnostics/data deletion — MVP | Own local summaries | POL-02 exact export/delete preview | Local bounded expiry per disclosed schedule | POL-03 user-triggered export/delete-all | No | Export preview exactly matches output; no raw audit content, no silent support upload |
| Co-present helper — MVP | Only what adult chooses to show | Adult-controlled setup | No extra helper power | Adult makes each consent decision | No | POL-R remote access; buyer relationship is not authorization |
| Helper config proposals — V1 | Explicit configuration scope only | Propose diff | No automatic apply | POL-03 adult local approval / invitation; revoke available immediately | No | No messages/memory/screens/history; old grant cannot approve new scope |
| Remote assistance — later App | No current access | Deferred design J-004 | No | New scoped live-session design needed | No | POL-R MVP/V1; fail closed on private-screen transition |
| Proactive suggestions/routines — later App | No passive monitoring MVP/V1 | None automatically | No | New policy/UX/evidence required | POL-04 only after new decision | Quiet by default; no inferred consent from repetition |

## Overrides and residual limits

Unknown capability or consequence defaults to POL-R. A harmless-looking navigation control may send, mark read, discard edits, synchronize a draft or accept terms; adapters must declare actual effects. For any side effect not represented in the preview, deny and replan/hand off.

Touch takeover in external apps is a measured constraint, not guaranteed interception. Accessibility events may not distinguish human from tool action reliably. If adapter cannot provide sufficient exclusion/revalidation, no automated sequence runs. Synthetic labs must test this explicitly.

Visible Stop and fresh confirmation reduce risk but cannot guarantee cancel after an external service has accepted a request. Receipt checks can remain unknown. Same-display spoofing/shoulder surfing and coerced consent retain residual risk; no model can determine valid consent from apparent age or relationship. See [threat model](threat-model.md).
