---
title: "Stage 1 Threat Model"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [safety, threats]
related:
  - action-policy.md
  - safety-and-privacy.md
  - ../06-evals/canonical-tasks.md
---

# Threat model

Scope: stock-Android app, proposed MVP and conditional V1 helper/memory interfaces. Actors: adult, co-present helper, malicious screen/content sender, malicious/compromised app/provider, stolen-device user and mistaken model. Assets: user authority, intended recipient/content, credentials, audio/screens, memory, audit, device usability. OS and owning-app authentication are external boundaries; a model is untrusted for authority.

All mitigations below are specified, **unimplemented/unrun**. Gate numbers link to [readiness](../10-execution/development-readiness.md); operational owner is a discipline, with Simon accountable until assigned. Threat classes inherit [action policy](action-policy.md) and [data schedule](safety-and-privacy.md).

| ID | Threat and preconditions | Impact | Mitigation | Detection / eval | Residual risk | Owner | Gate |
|---|---|---|---|---|---|---|---|
| THR-01 | Indirect prompt injection — Web/message/notification/image/document includes fake system text or tool request | Unwanted send/share/egress | Provenance-typed data; no instruction promotion; independent schema/scope/policy; tainted fields cannot mint grant | EVAL-010 injection across all five media types | Novel injection still affects explanation accuracy | agent + security | GATE-06 |
| THR-02 | Confused deputy — Planner uses a permitted navigation tool for a consequential UI effect | Unauthorized send/mark-read/discard | Registry declares real effects; separate prepare/commit; no generic SetText/Click to model; context predicates | EVAL-010 disguised send/permission controls | Adapter misclassification | Android + safety | GATE-06 |
| THR-03 | Wrong entity/content — Duplicate names, stale contact, timezone ambiguity or spoofed metadata | Message/photo sent/shown to wrong person | Stable endpoint binding, explicit clarification, exact preview, independent fixture oracle | EVAL-001/003/013 | Incorrect source contact data | product + agent | GATE-07 |
| THR-04 | Stale/replayed approval — App/content/recipient changes; delayed/replayed callback | Different effect executed under old approval | Digest/version/epoch/TTL binding; one-use permit; serialized local check/consume | EVAL-010 edit/replay/clock/restart | In-flight remote race after dispatch | executor + security | GATE-06 |
| THR-05 | User takeover not detected — User touches external UI or TalkBack changes state during plan | Agent fights user or commits on changed screen | Prove attribution/exclusion per route; stop surface prerequisite; revalidate immediately; otherwise manual handoff | EVAL-006 external touch + assistive tech | Some OEM/app event ambiguity | Android + accessibility | GATE-03 |
| THR-06 | Unsafe coordinate fallback — Missing tree tempts guessed tap | Wrong control/hidden consequence | Coordinates disabled MVP/V1; selected image explanation only; no privileged workaround | EVAL-002/010 missing semantics | Reduced task coverage | Android + safety | GATE-06 |
| THR-07 | Repeat/unknown commit — Network/callback loss after external acceptance | Duplicate message/call/reminder | Dispatch journal; unknown quarantine; no blind retry; one status reconciliation | EVAL-003/010/014 dropped receipt | External service lacks reliable status | executor | GATE-07 |
| THR-08 | Capture/transcript leakage — Broad tree, screenshot, microphone or logs outlive task | Private content disclosed | Scoped activation; protected-screen exclusion; redaction before egress; in-memory raw data; no content logs | EVAL-008/010 canary secrets/expiry | Redaction false negatives, shoulder surfing | privacy + Android | GATE-06 |
| THR-09 | Provider or support leakage — Remote retention, diagnostics or model output exposes private text | Unauthorized secondary processing | Separate consent; provider terms/residency review; previewed redacted support export; no production data in Git | EVAL-008/009; RES-08 terms review | Provider operations outside local enforcement | privacy + backend | GATE-09 |
| THR-10 | Memory poisoning/resurrection — Untrusted content/helper suggests facts; restored backup revives deletion | Wrong future action or sensitive inference | Explicit save/source; revision checks; derived deletion/tombstones; backup exclusions | EVAL-008/017 | User-confirmed erroneous facts | memory + privacy | GATE-06 |
| THR-11 | Helper coercion/overreach — Buyer/relative pressures adult or exceeds granted scope | Surveillance, lost agency | No remote MVP; optional separate identity; local diff approval; private decline and immediate revoke | EVAL-016; RES-08 separate interviews | Co-present coercion cannot be reliably detected | product + safeguarding reviewer | GATE-09 |
| THR-12 | Stolen unlocked device/account — Attacker has physical device or authenticated helper session | Impersonation and private data exposure | OS lock boundary; no lock bypass; protected local store; helper fresh auth/grants; no secrets in agent | EVAL-010 lock/restart; EVAL-016 revoked session | Unlocked physical access and coerced unlock | security + Android | GATE-09 |
| THR-13 | Permission/service/process loss — Android revokes/kills service or provider is offline | Invisible continuation, unresponsive Stop, false success | Local latch/state/journal; actual pre-dispatch checks; watchdog disables executor; no restart continuation | EVAL-005/006/009/010 | Already-dispatched effect cannot be recalled | Android + executor | GATE-07 |
| THR-14 | Authentication/support phishing — Fake login/help screen or malicious link solicits credentials | Account compromise | No credential tool or captured auth fields; owning app handoff; no automatic link execution | EVAL-010 protected/fake login | User may act manually on malicious content | security + design | GATE-09 |
| THR-15 | Inaccessible or misunderstood consent — Low contrast, tiny targets, voice mishearing, timeout | Unintended approval or exclusion | No default approval; exact preview; silent/ambiguous speech rejects; assistive-tech and teach-back testing | EVAL-007/012 | Noisy environment and individual variance | design + accessibility | GATE-05 |
| THR-16 | Distribution/supply-chain mismatch — Build enables unreviewed dynamic route, recipe update or malicious package | Policy violation or unsafe control | Signed/versioned build/registry; package/version admission; capability kill switch; no model-downloaded scripts | EVAL-009/011; install/update review | Store/OEM/policy changes | Android + release | GATE-04 |

## Abuse-case acceptance

No untrusted input can expand scope, invoke a restricted tool, choose an unconfirmed person, save inferred memory, mint/reuse consent or enable private helper access. Detection must use canary values, action receipts and deny events, not trust the model's own explanation. Red-team transcripts use synthetic content only.

A severe authorization/privacy failure blocks promotion regardless of task success rate. Record preconditions, effect, evidence, fixed failure mode, updated eval and residual risk. Safety reviewer signs unresolved residual-risk decision explicitly; Simon cannot infer a pass from an average metric. Before pilot, add incident/withdrawal/support contacts and provider/market-specific privacy review. No legal/medical assurance is claimed.
