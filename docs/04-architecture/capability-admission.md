---
title: "Capability admission, build modes and support lifecycle"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [architecture, android, release]
related:
  - system-overview.md
  - ../03-agent/tool-contracts.md
  - ../08-research/android-stage-1-feasibility.md
  - ../06-evals/evidence-protocol.md
---

# Capability admission and support lifecycle

This is the proposed **registry and release admission contract** for PRD-DST-001–004, NFR-005 and SAF-001/003. It implements accepted ADR-0009's control posture without claiming that any third-party app works. [Feasibility](../08-research/android-stage-1-feasibility.md) owns current platform/policy findings. [Readiness](../10-execution/development-readiness.md) owns gate decisions. A manifest entry is a claim to review, never self-issued authority.

## Admission is an intersection

A tool may dispatch only when all apply:

`product release scope ∩ build mode ∩ admitted adapter/version ∩ actual device/app configuration ∩ current grants/consent ∩ action policy ∩ current task/permit ∩ visibility/cancel health ∩ budget`

Missing, expired, conflicting or unparsable admission denies automation. App launch/manual access can remain available separately; disabled automation must not lock the person out of ordinary Android.

## Build-mode boundaries

| Proposed mode | May contain / do | Cannot imply | Admission required |
|---|---|---|---|
| Offline contract fixture | Fake planner/observer/ledger, one synthetic external-effect model, deterministic clock | Android compatibility, network access, Play eligibility or production crypto | T-103 DoR; no device grants, SDK or real service |
| Synthetic device lab | Explicitly enabled test adapter, synthetic account/content and measured device | Permission to use personal accounts, publish dynamic control or test on unaware users | GATE-03 experiment setup + GATE-06 device safety boundary, current install/actuation authority |
| Public-candidate build | Only route-reviewed API/integration capabilities; individually admitted fixed recipes if validated | Store approval merely because dynamic adapter is disabled in UI | GATE-03/04/06 evidence per route, static manifest checks and negative tests |
| Consented pilot build | Only admitted subset on named matrix; consent/support/rollback operations | General availability or support beyond selected configurations | GATE-08/09 and explicit pilot authorization |
| Later App/V1 extension | Separate accepted release scope and extension tests | Inherited permission from MVP capability name | V1 task-level DoR, updated policy/schema/evals |

These are logical separation requirements, not a chosen Gradle flavor, package name or backend. Candidate artifacts must not expose lab routes through hidden flags, deep links, debug menus, model output or remote configuration. Prefer excluding lab code and permissions entirely where practical; the actual build strategy is an engineering decision to verify. A signed artifact is not automatically trusted or admissible.

## Capability manifest contract

One entry identifies one operation/route version; namespace CAP-10 play/pause still have distinct operation schemas. Fields are finite and locally validated. Proposed record:

| Field | Meaning / validation |
|---|---|
| capabilityId, operation, schemaVersion | Registry-owned ID and enum; reject unknown fields/versions |
| adapterId, adapterVersion, recipeVersion? | Exact implementation and human-authored recipe provenance if used |
| executionMode, releaseScope, distributionRoute | Closed values; lab permission cannot be promoted into candidate by parameter |
| transport/controlClass | Native API, approved integration or specifically admitted semantic recipe; never arbitrary URL/shell/code |
| supportedConfiguration | Device/API/OEM/app package/signature/version range, locale, input/access profile and required services |
| requiredGrants / consentScopes | Actual runtime/special grants, owning-app authentication and independent egress scope |
| declaredEffects / policyClass | Navigation/read/mark-read/draft-sync/send/etc.; policy recomputes most restrictive result |
| preconditions / postconditions | Registered predicate IDs and independent observation sources; no model-supplied script |
| cancellation / idempotency / retry | Adapter entry boundary, internal dispatch checks, no-effect proof, reconciliation availability |
| dataFields / egress / retention | Minimum private inputs and allowed outputs; links to privacy owner, no live secrets |
| budget / deadlines | References canonical bounds; any smaller adapter bounds explicit |
| evidenceRefs / review | Dated run/configuration records, failure cases, reviewers and unresolved limits |
| admissionState / invalidation | Candidate, lab-only, admitted-for-exact-scope, suspended or retired; not inferred from installation |
| artifactIdentity / policyVersion | Build/source identity and governing policy; future signature/distribution mechanism remains unselected |

The planner receives a redacted subset of available operation schemas, never writable admission records, permits, package-signing controls or credentials. Registry updates are trusted application/release operations, not model memory writes.

## Capability support worksheet — current honest starting state

| Workflow / operation | Candidate route | Required postcondition | Current disposition / next evidence |
|---|---|---|---|
| UC-002 sent family photos / CAP-06 | Permitted communication integration or lab-only admitted fixed recipe | Exact sender/channel/date + attachment | Candidate integration unknown; picker/manual route no-go for outcome; fixed recipe conditional for lab experiment only. [T-101 route evidence](../08-research/2026-09-19-t101-route-inventory.md#route-1--sent-family-photos); physical configuration partial, route evidence unrun, T-104 blocked |
| UC-003 explanation / CAP-01/02 | Per-session app-window projection, scoped semantic observation, or selected image | Bounded source-grounded explanation with protected content excluded | Conditional for explicit scoped observation; selected-image subset go; automated recovery unknown/lab-only. [T-101 route evidence](../08-research/2026-09-19-t101-route-inventory.md#route-2--scoped-screen-explanation-and-recovery); `TBL-01` inventory partial, projection/egress evidence unrun |
| UC-006 draft / CAP-07 | Granny-local preparation | Exact locally reviewed text/recipient/channel | Go to own-app synthetic experiment; specified, not implemented. T-105 remains separate |
| UC-006 handoff / CAP-08 | Android SMS/email compose or system chooser; exact owner integration if later found | Opened handoff vs independently read-back external draft distinguished | Conditional for truthful manual handoff; unknown for verified consumer-app draft. [T-101 desk evidence](../08-research/2026-09-19-t101-route-inventory.md#route-3--exact-message-preparation-and-confirmation); no sent claim |
| UC-006 commit / CAP-09 | Supported send integration only | Receipt matched to exact intended effect | Disabled; no working consumer-messenger integration established |
| UC-004 media / CAP-10 | Owner-exposed Media3 route, named approved integration, or lab-only fixed recipe | Exact content + active playback | Conditional per named owner/version; Spotify App Remote 0.8.0/Auth 2.1.0 is the current concrete candidate, not selected support. [T-101 route evidence](../08-research/2026-09-19-t101-route-inventory.md#route-4--requested-media); Spotify is absent from the partial `TBL-01` inventory and device/provider evidence is unrun |
| UC-007 text / CAP-11 | Granny-owned preference/UI | Stored value + accessible reflow | Go to own-app synthetic experiment; specified, not implemented; no device-wide claim. [T-101 desk evidence](../08-research/2026-09-19-t101-route-inventory.md#route-5--granny-owned-text-adjustment) |
| Stop / CAP-12 | Local coordinator plus tested adapter cancellation boundary | No post-latch dispatch and honest in-flight status | Fake proof T-103 first, device proof EVAL-006 later |

A candidate app name is a test hypothesis, not support. Do not convert WhatsApp Business API documentation into a claim to read an adult's consumer WhatsApp inbox. Do not substitute a controlled fake for a failed third-party route.

## Admission review sequence

1. Identify the adult's outcome and exact supported configuration; document no-effect, partial and unknown behavior.
2. Classify platform access and route policy from current primary sources; record unresolved interpretation separately.
3. Demonstrate fixture invariants, then synthetic device action/observation/verification/Stop within approved scope.
4. Review permission/disclosure/data/backup/export, authentication and accessibility limitations on the same configuration.
5. Collect required repetitions and adversarial cases under the evidence protocol. Failures are retained.
6. Review build manifest and executable surface: no lab bridge, stale config or unauthorized routes. Test unknown/expired admission and missing Stop surface.
7. Named reviewer recommends admission; Simon resolves release/pilot authority under applicable gates. Record exact artifact/configuration, limitations and revalidation triggers.
8. Keep the route disabled until all required evidence and authority exist. A model update cannot self-enable it.

## Invalidation, updates and rollback

| Change/event | Immediate behavior | Evidence before restoration |
|---|---|---|
| App/OS/recipe/signature outside matrix | Deny affected automation; explain manual option | Observation/target/effect/postcondition and Stop regression |
| Policy/consent/permission changed | Invalidate prepared authority, drop disallowed observations | Fresh user-owned grant/consent and route review as relevant |
| Model/provider changed | Existing policy remains authoritative; reject stale plans | Schema, injection, entity, latency/egress regression; no bypass by cheaper provider |
| Unknown or wrong consequential effect | Quarantine task, suspend route for material defect | Root cause, independent ledger/oracle reproduction, fixed adversarial eval, reviewer |
| Stop/visibility service unhealthy | Stop new dispatch; report uncertainty if in flight | Device lifecycle/touch/cancel proof; never hide or disable Stop to keep automation running |
| Bad release/artifact | Disable affected route; preserve manual device use | Known-good artifact plus compatible data/schema; no forceful data reset without user |
| Registry integrity/expiry failure | Fail closed locally, including offline | Trusted validated replacement; remote outage cannot extend admission automatically |

No remote kill-switch or update backend is implemented or selected. A future support design must specify delivery authenticity, offline behavior, revocation latency and rollback tests before depending on remote control. The offline fallback is local denial, not a guarantee that a server can recall an action.

## First physical inventory

T-101 records a pseudonymous fixture/device label; marketed model, Android/API, OEM build/security patch, display/window sizes, input/access settings, available speech support and test app versions. The [2026-09-19 manual inventory](../08-research/2026-09-19-t101-physical-inventory.md) partially fills that row for `TBL-01`; unresolved fields remain unknown, not inferred. Do not collect serial/IMEI/MAC/Android ID, account names, personal contact lists or screenshots. Any command set must be reviewed against connected devices and current authority before running; do not automatically enable developer settings, USB debugging or accessibility.

Physical device access is not present merely because a tablet is mentioned in the repository. A missing tablet blocks device evidence only; offline T-103 and low-fi interaction work remain possible.
