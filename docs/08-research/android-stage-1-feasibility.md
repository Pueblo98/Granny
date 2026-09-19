---
title: "Android Stage 1 Capability and Distribution Feasibility"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [research, android, distribution]
related:
  - research-plan.md
  - ../04-architecture/system-overview.md
  - ../10-execution/development-readiness.md
---

# Android Stage 1 feasibility

**Evidence dates: initial assessment 2026-09-13; full route recheck and partial manual tablet inventory 2026-09-19.** The feasibility conclusions remain a primary-source desk assessment, not a device capability test or store approval. Android/API facts, policy text, project inference and proposed experiments are separated below. The [manual inventory](2026-09-19-t101-physical-inventory.md) identifies the reference model/build and partial app/access state, but no working integration has been established. The current per-workflow matrices, source statements and unrun experiments are in the [T-101 route inventory](2026-09-19-t101-route-inventory.md).

The 2026-09-19 recheck found no conflict with the accepted candidate/lab split. It narrowed the route posture: sent-photo provenance has no current ordinary candidate route; one-session screen explanation and a named media integration are conditional; exact local message preparation and Granny-local text scale are ordinary routes, but neither a manual compose handoff nor an internal setting counts as externally verified delegation. The two-external-workflow kill criterion is therefore at high risk until device experiments establish both scoped explanation and media, or another permitted integration is found.

## Distribution conclusion

**Recommendation: conditional go for an API/integration-led Stage 1 product with honest manual handoffs; go for bounded synthetic offline contract tests; needs evidence for fixed accessibility recipes; no-go for public general-assistant autonomous AccessibilityService control under the reviewed policy.** Do not change the target audience to claim a disability exception without actual product/research grounds and approval.

Google Play's [AccessibilityService policy](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en) prohibits autonomous initiation/planning/execution through the API, distinguishes static human-defined rule automation, and describes an exception for verified accessibility tools serving disability-related core purposes. A general voice assistant is not automatically such a tool. Nonqualifying uses require separate prominent in-app disclosure/affirmative consent and declaration/review. Changing use requires updated declarations. This establishes policy constraints, not approval for Granny.

**Project inference:** asking for one goal, adding a confirmation button, limiting step counts or sideloading an eventual Play build does not by itself establish permission for dynamic AccessibilityService planning. Do not use “human in the loop” as an unsupported exemption. Fixed scripts with model-selected parameters need explicit policy analysis of the complete behavior; not enough that each individual click is deterministic.

## Candidate control / distribution decisions

| Model | Assessment | Why / tradeoffs | Required evidence and unlock |
|---|---|---|---|
| API/integration-only ordinary Play app; manual owning-app handoff where necessary | Conditional go | Narrower reach, clearer permission boundaries; app policy/integration terms still apply; handoff not full delegation | Manifest/data/disclosure review, API availability and outcome verification; GATE-03/04 |
| Static human-authored accessibility recipes, user selects bounded workflow | Needs evidence | Policy distinguishes deterministic automation, but natural-language selection/parameters and adaptive branches need review | Exact recipe/code/UX disclosure and review question; no dynamic planner masquerading as script |
| Dynamic AccessibilityService general assistant on Play | No-go under reviewed policy | Product-wide audience/goal planner cannot assume verified-tool exception | Material approved policy/product change before enabling; no consent-only workaround |
| Disability-focused verified accessibility tool | Needs evidence; not current recommendation | Could permit autonomous function for core disability support, but changes primary purpose/research/claims | Actual target need, disability-specific design/research, truthful declaration and authoritative review; Simon decision |
| Internal developer/synthetic sideload prototype | Go for bounded lab evidence | Can test platform mechanics independently of public distribution; no personal data or policy-approval claim | Trusted install, synthetic accounts, permissions manually granted, no protection bypass; GATE-06 for control prototype |
| Direct-distribution real-user pilot | Conditional go; not a shortcut to release | Higher install trust/friction/support burden, Android restricted settings and other terms remain | Signed install/update/rollback, participant consent, platform restrictions, jurisdiction/support review; GATE-04/09 |
| Managed-device/device-owner deployment | Needs evidence; excluded MVP recommendation | Requires actual managed provisioning/ownership; narrows audience and may reset/restrict device | Explicit distribution option and new ADR; not assumed available to ordinary app |
| OEM/system/root/AOSP route | No-go Stage 1 | Requires privileges excluded by accepted stage boundary | future-stage context only, not a fallback for this milestone |

Internal/closed Play testing is not assumed exempt from Play policy. No policy contact, declaration, app submission, store review or direct distribution has been performed.

## Capability and permission matrix

Classification labels match the requested categories. Each row distinguishes source capability from product implication; all app-specific success claims remain unknown.

| Capability | Platform classification / primary source | Stage 1 implication and limitation | Test / eval |
|---|---|---|---|
| App Home/touch/settings | Ordinary Android/app API | App-owned UI possible; no system-wide replacement/always-visible claim | Orientation/font/IME/local state; EVAL-005/007 |
| Default Home | Default-app/launcher role; [RoleManager](https://developer.android.com/reference/android/app/role/RoleManager) | User-granted role where available; does not confer root, app data or system privileges; deferred optional V1 | Role availability/revoke/return; no MVP dependency |
| Semantic observation/action | AccessibilityService semantic inspection/action; [service guide](https://developer.android.com/guide/topics/ui/accessibility/service), [reference](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService) | User enables service; declared retrieval/actions; roots may be null/incomplete and app semantics differ; policy filters use | Person/date/tree quality, secure screens, stale nodes, service kill; EVAL-001/002/006 |
| Touch/gesture automation | AccessibilityService semantic inspection/action / structured test automation | Semantic action preferred; gesture API is not universal reliable control; testing instrumentation is not ordinary production privilege | User-touch attribution, TalkBack coexistence, cancellation; coordinate MVP/V1 disabled |
| Screen capture | MediaProjection or other explicit session grant; [MediaProjection](https://developer.android.com/media/grow/media-projection) | Android 14+ session consent and foreground-service requirements; capture can be app/window scoped and revoked; not persistent grant | Grant/revoke/rotation/app switch/lock; EVAL-005/008 |
| Accessibility screenshots | AccessibilityService with declared screenshot capability; [reference](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService) | API/version-dependent screenshot methods and failure codes; does not remove capture/privacy/policy boundaries | Actual API support, timing and secure-window failures; explicit scope only |
| Secure windows/passwords | Unknown/infeasible protected content; [FLAG_SECURE](https://developer.android.com/reference/android/view/WindowManager.LayoutParams#FLAG_SECURE) | Window flag prevents screenshot/nonsecure-display exposure; service restrictions and sensitive nodes need testing; never bypass | Protected fixture blank/error is expected safe result, not failure to overcome |
| Microphone/speech | User-granted runtime permission; accepted initial route uses `SpeechRecognizer.createOnDeviceSpeechRecognizer` after `isOnDeviceRecognitionAvailable`; [SpeechRecognizer](https://developer.android.com/reference/android/speech/SpeechRecognizer), [RecognizerIntent](https://developer.android.com/reference/android/speech/RecognizerIntent) | On-device service/language/partial/formatting support varies; optional extras may be ignored; never substitute generic/remote recognition silently; not intended as unrestricted continuous recognition | T-120 host contract plus exact-device quiet/noisy/offline/locale, partial/final, interruption, revoke and mic-denial runs; EVAL-005/007/009 |
| Background operation | Ordinary app lifecycle + foreground-service restrictions; [background starts](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start) | Starting services/microphone from background is constrained; no ambient always-on promise | Lock, background, battery restriction, process death, One UI; EVAL-006/009 |
| Installed app discovery/open | Ordinary Android/app API plus package visibility; [package visibility](https://developer.android.com/training/package-visibility) | Targeted queries/registered routes; no QUERY_ALL_PACKAGES assumption; opening not task completion | Missing handler/multiple handlers/unknown version |
| Notifications | Notification listener or approved integration; [NotificationListenerService](https://developer.android.com/reference/android/service/notification/NotificationListenerService) | Separate user-granted special access; notification content incomplete/redacted and not historical message database | Deferred broad listener; no MVP dependency; permission revoke and canary leakage if explored |
| Contacts/people | Ordinary picker or runtime permission; [common intents](https://developer.android.com/guide/components/intents-common) | Prefer selected contacts/explicit aliases to broad address-book access; endpoint ambiguity persists | Duplicate names, revoked URI, no contact provider; EVAL-003 |
| Calls | Ordinary intent/approved calling app; runtime permission for direct telephony path if selected | Dialer handoff differs from placed call; Wi-Fi tablet may lack telephony; no CALL_LOG requirement | Registered VoIP/dialer route, ring/answer oracle; EVAL-013 |
| Messaging | Ordinary compose intents or approved app integration | Android documents SMS/email compose and general Sharesheet handoff; these cannot read an inbox or prove external draft fidelity, send or delivery. No personal-messenger API is presumed available | Exact draft/endpoint/receipt, account sync, duplicate send; EVAL-003 |
| SMS/call-log access | Sensitive runtime/role/policy constraints; [sensitive permissions](https://support.google.com/googleplay/android-developer/answer/16558241?hl=en) | Not required in proposed MVP; no exception assumed | Manifest denies broad SMS/call-log permissions; EVAL-011 |
| Media | Owner-exposed Media3 session/library, approved integration, or admitted semantic recipe | The owner app can accept/reject controllers and commands. Spotify's beta Android SDK 0.8.0 App Remote / 2.1.0 Auth is a concrete conditional candidate with user authorization and PlayerState; search/open may not play and subscriptions/catalog/DRM restrict | Source URI/title/playing state + independent session/audio oracle; EVAL-004 |
| Local text/speech setting | Ordinary Android/app API | Granny controls its own text/UI; this is not global system font change | Read-back/restore/reflow; EVAL-007 |
| System brightness/settings | User-granted special permission or user-owned settings handoff; [Settings.System](https://developer.android.com/reference/android/provider/Settings.System) | Some writes require special access; many settings restricted; no WRITE_SECURE_SETTINGS assumption | MVP manual handoff; exact field/permission if later explored |
| Files/photos | Ordinary picker grants; [Photo picker](https://developer.android.com/training/data-storage/shared/photo-picker), [Storage Access Framework](https://developer.android.com/training/data-storage/shared/documents-files) | Selected URI access; not all files or private messenger storage; picker photos do not prove sender/date | URI expiry, no selection, metadata mismatch; EVAL-001/015 |
| Authentication | Owning app/OS user interaction | No raw credential tool, arbitrary account data or automated recovery | Suspend observation, resume after explicit user action; EVAL-010 |
| Device owner / dedicated mode | Device-owner or managed-device mode; [dedicated devices](https://developer.android.com/work/dpc/dedicated-devices) | Requires real provisioning route; stock app install does not grant it | Excluded MVP; no device reset/provisioning performed |
| Persistent privileged control | OEM/system privilege or root/AOSP only — future Stage 2 | Not available by ordinary app permission | Excluded; no Stage 2 work |
| Cross-app reliable verification | Unknown pending integration/device evidence | No universal Android “task complete” receipt; must define per-adapter postcondition | Synthetic recipient/content oracle; no click-success proxy |

## Test matrix and support admission

**Physical first row, partial:** supplied Samsung `SM-X238U` / Galaxy Tab A11+ 5G, Android 16, One UI 8.0, build and patch captured in the [manual inventory](2026-09-19-t101-physical-inventory.md) without serial, IMEI, Android ID, MAC, SSID or account names. API level, RAM/display dimensions and capability behavior remain unobserved. The approximate $140 price remains source-reported only in [hardware](../07-hardware/reference-hardware.md).

**Additional rows:** emulator at proposed minimum API 34; emulator at current stable API identified during spike; second stock OEM tablet before multi-device pilot. API 34 is a provisional test floor, not final minSdk. Record targetSdk/store deadline from current policy at build time. One device cannot establish Android-wide reliability.

**App candidates, not supported claims:** WhatsApp consumer Android as communication candidate for photos/draft (synthetic accounts only; no assumption Business APIs expose personal inbox); YouTube Android as media candidate; Android Settings/permission UI; local controlled fixture surface. A native supported media route may replace the media candidate after evaluation. Installed availability/terms must be checked; no app installed or account created in this session.

For each device × app/version × control mode, run nominal and denied/revoked grant, offline/provider outage, signed-out, font/display scale, portrait/landscape, IME, notification overlay, app version change, TalkBack and manual-touch cases. Record observation completeness, unique target resolution, side effects, independent postcondition, time/steps, stop latency and failure code. Controlled fixture success is contract evidence only, not proof third-party apps work.

Admission requires correct result at accepted gate threshold, no unsafe consequential side effects, actual stop/takeover evidence, truthful unknown reporting, permitted route and tested version. Unknown version disables only affected automation and offers guidance; don't disable the user's ordinary app access.

## Policy and distribution evidence program

Read [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en): sensitive-data handling, disclosures, consent, privacy policy and data practices require accurate representation. This source is not Granny's completed privacy notice. Review collection by third-party SDKs and account-deletion obligations if accounts are introduced. [Android restricted settings](https://support.google.com/android/answer/12623953?hl=en) documents restrictions around sensitive access for some installed apps; installation trust and manual enablement need device testing. Never automatically bypass these protections.

Questions for an eventual authorized Play review: (1) Is the exact fixed recipe selection/parameterization behavior within allowed automation? (2) Which disclosure/video accurately represents screen/cloud processing and action side effects? (3) Is any claimed accessibility core purpose evidenced, rather than a general assistant label? (4) Do all permissions have minimum-scope alternatives? (5) Does any model-replanned action path make the proposed build inadmissible? Prepare a synthetic demonstration and manifest/flow inventory before submission. No external contact is authorized by this document.

**Kill criteria:** no permitted path to two externally verified useful workflows; no reliable Stop/takeover on candidate route; raw sensitive content unavoidable in unapproved cloud route; chosen participant cannot understand/revoke consent. Result is revise scope or pause release, not start AOSP.

## Source register

The original linked Google/Android Developers and Play/Android Help sources were accessed 2026-09-13. They were rechecked on 2026-09-19 together with current User Data/disclosure guidance, Android restricted settings, common compose intents, Media3 controller/session documentation, Spotify's official Android SDK/release, DataStore 1.2.1 and scalable-content guidance. The [T-101 inventory](2026-09-19-t101-route-inventory.md#current-primary-sources) records exact links, statements and inference. These sources establish documented API/policy behavior, not Granny compatibility, provider selection or acceptance. API references must be checked against actual runtime/API/app versions and policy before submission. External accessibility sources are recorded separately in [accessibility](../02-design/accessibility.md).

**Evidence not collected:** physical capability measurements; complete device/app/grant/network configuration; successful messenger/media integration; takeover guarantee; provider terms; store declaration/review; signed pilot distribution; participant or competitor tests. RES-02/04/05 and EVAL-001–011 specify the next evidence.
