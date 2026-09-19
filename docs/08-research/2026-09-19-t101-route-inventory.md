---
title: "T-101 route inventory and device worksheets"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [research, android, evidence, routes]
related:
  - android-stage-1-feasibility.md
  - research-plan.md
  - research-protocols.md
  - ../04-architecture/capability-admission.md
  - ../06-evals/evidence-protocol.md
  - ../09-decisions/ADR-0009-mvp-and-control-posture.md
  - ../10-execution/backlog.md
  - ../10-execution/task-packets.md
---

# T-101 route inventory and device worksheets

## Decision and evidence status

This is the Step A source/desk artifact for [T-101](../10-execution/backlog.md#t-101), accessed **2026-09-19**. It covers all five experiments accepted by [ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md) and prepares Steps B and C. A later [partial manual physical inventory](2026-09-19-t101-physical-inventory.md) fills the non-identifying Step B values that Simon could read safely. The combined record does **not** establish app compatibility, device timing, Play approval, user comprehension or a supported configuration.

Step A accessed no tablet, account, app, provider or store. Step B later used only Simon's manual transcription of visible Settings values; Codex did not connect to or operate the tablet. No command, ADB action, install, update, developer-setting or permission change, sign-in, external-app actuation, personal-data inspection or Android scaffold occurred. Physical inventory is **partial and user-reported**; every synthetic-device experiment remains **unrun**. T-101 therefore remains in progress, and GATE-03/04 plus the device/real-data portion of GATE-06 remain open.

Disposition terms in this note are route-planning terms, not admission:

- **Go:** ordinary documented route is suitable for the smallest synthetic experiment; support still needs runtime evidence.
- **Conditional:** a documented route is plausible only for the named build, configuration, scope or partial outcome; prerequisites must be measured.
- **No-go:** route cannot truthfully meet the named outcome or violates the accepted boundary.
- **Unknown:** documentation is insufficient; keep disabled until a source or experiment resolves it.

## Current primary sources

Access dates below are 2026-09-19. Page versions are recorded when the publisher exposes one; an access date is not an effective date.

| Publisher / source | Exact current statement used | Project inference and limit |
|---|---|---|
| Google Play, [AccessibilityService API policy](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en) | Autonomous initiation, planning and execution through AccessibilityService is prohibited for automation; deterministic human-defined scripts are distinguished; verified disability accessibility tools have a core-purpose exception. Non-tools need the documented declaration, disclosure and consent path. | General-assistant dynamic control remains no-go for a public candidate. A finite recipe is only a review candidate, not approved by being deterministic or confirmed by the user. |
| Google Play, [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en) and [prominent disclosure guidance](https://support.google.com/googleplay/android-developer/answer/11150561?hl=en) | Screen recordings, accessibility-derived data and unexpected sensitive-data handling require applicable in-app disclosure, affirmative consent, accurate Data safety/privacy treatment and responsibility for third-party SDK behavior. | A MediaProjection or accessibility route is not distribution-ready merely because Android showed a system grant. Cloud explanation needs a separate minimized egress contract. |
| Google Play, [15 July 2026 policy announcement](https://support.google.com/googleplay/android-developer/answer/17134731?hl=en) | The User Data requirements also apply to third-party AI integrations; developers remain responsible for limited use, disclosure and consent. It also announces the regular 2026 target-API deadline without naming a route exception. | Current-source addition: a future AI provider does not dilute Granny's disclosure/data responsibility. The exact target SDK is still a build-time evidence item, not selected here. |
| Android Help, [restricted settings](https://support.google.com/android/answer/12623953?hl=en) | On Android 13+, some sideloaded apps can require the user to allow restricted settings before sensitive access such as accessibility can be enabled. Android warns that accessibility can read screen content and interact with apps. | Direct distribution is not a permission shortcut. The actual install provenance and OEM flow must be recorded in EVAL-005; this session does not change it. |
| Android Developers, [AccessibilityService reference](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService) and [service guide](https://developer.android.com/guide/topics/ui/accessibility/service) | The user explicitly enables the service in Settings; declared capability is required to retrieve window content; trees can be null, incomplete or stale and services can perform semantic actions. | Source-grounded observation and finite semantic recipes require exact target-app/device tests. The service cannot supply reliable fresh target, provenance, Stop or effect evidence by documentation alone. |
| Android Developers, [MediaProjection guide](https://developer.android.com/media/grow/media-projection) and [Android 14 behavior change](https://developer.android.com/about/versions/14/behavior-changes-14#media-projection) | For apps targeting Android 14/API 34+, each projection capture session needs user consent, a projection token is single-use, and the app must use the declared media-projection foreground-service type. Capture may be a selected app window or full display, and `onStop` must release resources. | Conditional observation route for one explicit screen-explanation task. It is not a persistent observation grant, semantic truth, action route or cloud consent. |
| Android Developers, [`FLAG_SECURE`](https://developer.android.com/reference/android/view/WindowManager.LayoutParams#FLAG_SECURE) | Secure content is excluded from screenshots/non-secure displays; sensitive views may be secured during projection. | Blank/protected capture is a required safe-unavailable outcome, never a bypass target. |
| Android Developers, [Photo Picker](https://developer.android.com/training/data-storage/shared/photo-picker) | The picker lets the user grant access to selected images/videos from a date-sorted media library, including eligible cloud media. | It exposes user-selected media, not the communication sender, endpoint/channel or sent timestamp. It cannot satisfy the sent-family-photo outcome or substitute a gallery result. |
| Android Developers, [common intents](https://developer.android.com/guide/components/intents-common) and [Sharesheet guidance](https://developer.android.com/distribute/aep/aep-req-share-sheet) | `ACTION_SENDTO` can initiate SMS/MMS or email compose with supplied fields; general external sharing uses the system chooser. The documented result is opening/initiating a compose or chooser flow. | A local exact draft plus handoff is plausible. Intent resolution, foreground arrival or chooser display is not proof the external draft retained every field, and never proves sent/delivered. No official generic consumer-messenger inbox/send API is established by these Android routes. |
| Android Developers, [Media3 connection guide](https://developer.android.com/media/media3/session/connect-to-media-app), [MediaController reference](https://developer.android.com/reference/androidx/media3/session/MediaController) and [platform MediaController](https://developer.android.com/reference/android/media/session/MediaController) | A controller can query/control a media session when it has the session token or connects to an exposed service; the media app chooses commands/connection. Discovering active platform sessions generally requires media-control permission, notification-listener access or an owner-supplied token. | Media3 is a protocol surface, not universal access to every installed media app. An owning app must expose and accept the exact browse/play route; notification-listener access is not adopted as a generic workaround. |
| Spotify for Developers, [Android SDK](https://developer.spotify.com/documentation/android) and [official SDK release](https://github.com/spotify/android-sdk/releases/tag/v0.8.0-appremote_v2.1.0-auth) | The beta Android SDK can initiate/control playback and subscribe to `PlayerState` after app authorization. Current listed release is App Remote 0.8.0 / Auth 2.1.0; the Spotify app and user permission are required. | A versioned Spotify-only synthetic route is plausible. App/account/region/catalog/subscription behavior, exact URI resolution, Pause/Stop timing and terms remain untested. This is not a provider selection or general-media claim. |
| Android Developers, [DataStore](https://developer.android.com/topic/libraries/architecture/datastore) and [scalable Compose content](https://developer.android.com/develop/ui/compose/accessibility/scalable-content) | DataStore 1.2.1 is documented for consistent transactional small preference storage; Android guidance supports app-defined scalable content and testing in-app scale together with system font/display settings. | Granny can own, preview, persist, read back and restore its own text-scale preference without device-wide settings authority. Compose/framework selection remains outside this evidence task. |
| Samsung, [Galaxy Tab A11+ 5G product listing](https://www.samsung.com/us/tablets/galaxy-tab-a11-plus/buy/galaxy-tab-a11-plus-5g-128gb-gray-sku-sm-x238uzaaatt/) | Samsung identifies `SM-X238U` as a Galaxy Tab A11+ 5G model. | Confirms the marketing family for the manually observed model code; it does not establish the individual tablet's settings, current app behavior or carrier/account state. |

The Meta WhatsApp Cloud API documentation endpoints were checked as candidate-integration leads but were not reliably retrievable in this desk session. No consumer WhatsApp inbox, provenance or send capability is inferred from Business Platform terminology or from absence of a retrieved page. The consumer-messenger route therefore remains unknown rather than silently assumed.

## Cross-route non-negotiable findings

1. No public candidate may expose a general-assistant dynamic AccessibilityService planner. The synthetic lab and candidate registries/builds stay separate.
2. No route uses root, AOSP, device-owner, unrestricted shell, coordinates, credential collection or automated permission/security changes.
3. Android consent, intent acceptance, adapter callback, foreground arrival or UI change is never by itself an independent outcome oracle.
4. Inbox observation is different from compose; sender/channel/date provenance is different from local image metadata; playback is different from launch/search; external draft opened is different from sent; Granny-local scale is different from device-wide settings.
5. Mark-read, draft sync, account switching, ads/paywalls and external app focus are declared collateral effects. Unknown effects remain unknown and are never automatically retried.

## Route 1 — sent family photos

**Exact accepted outcome:** show attachments sent by the user-selected person through the selected communication channel in the requested local date interval, with source provenance; do not infer identity from faces or substitute local gallery recency.

| Route / build | Grants, auth and consent | Observation → action → independent postcondition | Stop/takeover and collateral effects | Version/distribution constraint | Evidence / disposition |
|---|---|---|---|---|---|
| Android Photo Picker or selected local URI / candidate | User selects URI; no broad library grant | Picker returns selected media; it has no sender/channel provenance. No action can reconstruct the accepted origin. | User cancels picker; persistent URI access and local metadata exposure are possible if requested. | Picker availability/backport and cloud-provider behavior vary. | Current primary-source desk evidence / **No-go** for sent-photo retrieval; may support a separately requested selected-image explanation only. |
| Approved communication integration / candidate | Owning service authentication, minimum read scope, explicit private-message purpose and any cloud consent | Integration must observe stable sender endpoint, channel and service timestamp plus attachment ID; Granny queries exact interval; an independently obtained integration record must match all four fields. | Local Stop blocks new query/action; opening a thread may mark read and must be declared or avoided. No saving/sharing. | No qualifying consumer integration is verified. Provider terms, app/account versions and distribution need review. | **Unknown**; keep disabled until official owner documentation and a synthetic account route exist. |
| Human-authored fixed semantic recipe / synthetic device lab only | User-enabled accessibility service, exact package/version, prominent disclosure/consent; synthetic account | Fresh semantic tree must expose conversation endpoint, channel/date and attachments; bounded navigation reads them; a separate synthetic fixture/service ledger verifies provenance, not the recipe's own tree assertion. | Persistent visible local Stop; any thread-open/mark-read effect is POL-03 or route-excluding. Touch takeover ends recipe; secure/incomplete/stale tree fails safely. | Lab-only until exact static recipe and policy review; general dynamic planning prohibited and coordinates disabled. | **Conditional — lab experiment only**; device semantics, provenance and Stop are unrun. |
| Open owning app for manual search / candidate fallback | App installed/authenticated by user | Granny opens or explains route; user finds result. Postcondition is only handoff/opened app. | User owns all external actions. | Ordinary intent/deep-link availability varies. | **Go as manual guidance**, **No-go as externally delegated completion**. |

**Workflow disposition:** no ordinary candidate route currently meets the accepted outcome. The only plausible automation path is an exact integration that remains unknown or a policy-gated fixed recipe in the synthetic lab. T-104 must not start as a claimed consumer-messenger slice from this desk evidence.

## Route 2 — scoped screen explanation and recovery

**Exact accepted outcome:** on explicit request, identify the approved active app/source, explain only observable content with uncertainty and offer a bounded next step; exclude credentials/secure content and never treat on-screen instructions as authority.

| Route / build | Grants, auth and consent | Observation → action → independent postcondition | Stop/takeover and collateral effects | Version/distribution constraint | Evidence / disposition |
|---|---|---|---|---|---|
| Per-session app-window MediaProjection / candidate | Android capture consent for each session, declared foreground-service type, separate in-app data disclosure and separate cloud consent if any pixels leave device | System supplies selected-window frames; Granny performs local fixture-grounded explanation or minimized redacted provider request. Oracle uses a controlled synthetic screen with independently known labels/protected regions; explanation must name source and uncertainty. Recovery is guidance/manual handoff, not automated click. | Stop calls local capture shutdown and releases surfaces; Android/user projection stop callback must end collection. Notifications/other content, rotation and sensitive pixels are collateral risks; app-window scope is preferred. | API/target behavior, OEM chooser and protected-window behavior require physical test. User Data duties remain even with system consent. | **Conditional** for one explicit observation/explanation session; action/recovery automation is excluded. |
| Package-scoped AccessibilityService observation / candidate or fixed-recipe lab | User enables service in Settings; declared window-content capability; Play declaration/disclosure/consent; private-data/cloud scopes separate | Fresh semantic tree identifies current package/window and nodes; explanation cites only present nodes. Controlled fixture tree provides independent expected content; protected/null/stale tree returns partial/unavailable. Any recovery action must be a separately admitted finite recipe. | Visible Stop must remain reachable outside target app. Tree reads can expose private data; opening/navigating can mark read or discard state. Touch takeover invalidates observation. | Public dynamic planner is no-go. Observation/fixed recipe needs exact package/version, static behavior and policy review. | **Conditional** for scoped observation; **Unknown** for any finite recovery action; **No-go** for public dynamic control. |
| User-selected screenshot/image / candidate fallback | User explicitly selects image; any egress separately consented | Explain selected artifact; oracle is fixture image plus known labels. | Stop ends processing/speech; no live app action. | Does not prove current active-screen state. | **Go** for a truthful selected-image subset, **No-go** as a claim of live recovery. |

**Workflow disposition:** conditional candidate for explicit, scoped explanation with guidance. Automated recovery remains unknown or lab-only; secure/empty/incomplete observations must surface as unavailable.

## Route 3 — exact message preparation and confirmation

**Exact accepted outcome:** prepare literal user-approved recipient/channel/body; after fresh confirmation either open a truthful external draft for user action or, only through a separately admitted integration, send once and independently verify the exact effect.

| Route / build | Grants, auth and consent | Observation → action → independent postcondition | Stop/takeover and collateral effects | Version/distribution constraint | Evidence / disposition |
|---|---|---|---|---|---|
| Granny-local immutable draft / candidate | No external grant; explicit local Save/approval rules | Granny resolves synthetic alias and stores exact recipient/channel/body locally; local readback from storage matches bytes and version. | Stop/cancel removes permit and draft as specified; no external effect. | Ordinary app-local implementation; framework unselected. | **Go** to synthetic own-app experiment; preparation is not external delegation. |
| Android `ACTION_SENDTO` SMS/email compose or system Sharesheet / candidate | Owning app remains authenticated; user grants URI if attachment; fresh approval before handoff because draft insertion/sync is possible | Trusted renderer binds exact fields; intent opens owning compose/chooser. Independent oracle must read back exact external draft state through an owner-supported result; if unavailable, report only `compose handoff opened`. User taps Send manually. | Stop before dispatch prevents intent launch; after handoff, Take over ends Granny automation. External app may normalize/drop fields, sync a draft, switch account or expose chooser suggestions. | Handler/device/app behavior varies; tablet may lack SMS. Generic share does not guarantee target/recipient. | **Conditional** for truthful manual handoff; **Unknown** for externally verified exact draft; **No-go** for sent/delivered claim. |
| Approved messaging send integration / candidate | Provider authentication, exact send scope, recipient endpoint, data/terms review and fresh POL-03 confirmation | Integration accepts exact immutable record; independent provider/second-endpoint receipt must bind account, endpoint, bytes and operation ID. Callback alone is insufficient. | Stop blocks pre-dispatch admission; in-flight result is reconciled once and never blindly retried. Remote drafts/messages may persist. | No consumer-messenger integration is verified; provider/app/account version and distribution unknown. | **Unknown** and disabled. |
| Fixed semantic compose recipe / synthetic device lab only | Exact app/version, accessibility disclosure/grant and synthetic account | Recipe inserts exact fields in a known compose surface; a separate readback verifies draft. Send control remains user-operated unless a future separately admitted commit exists. | Persistent Stop; touch takeover invalidates recipe. Draft sync/account switch/keyboard transformations are forbidden unpreviewed effects. | Static recipe/policy review required; dynamic planning/coordinates no-go. | **Conditional — lab draft experiment only**; not a candidate send route. |

**Workflow disposition:** go for local exact preparation; conditional for honest SMS/email/manual compose handoff; no present route may claim consumer-message send. Draft/opened-handoff does not count toward the two externally delegated-workflow bar.

## Route 4 — requested media

**Exact accepted outcome:** resolve the requested title/artist/service, start the matching non-purchase item and independently verify content identity plus active playback; Pause remains touch-accessible and ads/paywalls/auth/offline states are truthful partial outcomes.

| Route / build | Grants, auth and consent | Observation → action → independent postcondition | Stop/takeover and collateral effects | Version/distribution constraint | Evidence / disposition |
|---|---|---|---|---|---|
| Owner-exposed Media3 MediaLibrary/MediaSession integration / candidate | Installed target and package visibility; owner session/service accepts controller and commands; any owner auth remains in owner UI | Browse/search owner library, select stable media ID, issue play. Controller/player state independently reports matching media ID/title/artist and `isPlaying`; notification or launch alone is insufficient. | Local Stop/Pause sends only if session still matches; user media controls remain primary. Queue replacement, volume, ads and resume position are collateral effects and must be declared. | Only apps exposing/accepting a compatible service/session qualify; active-session discovery is not universally available to ordinary apps. | **Conditional** per named owner app/version; no actual candidate identified or tested. |
| Spotify Android SDK App Remote 0.8.0 + Auth 2.1.0 / synthetic device candidate | Spotify app installed; user authorizes app-control access and is authenticated; synthetic test account/content; provider terms reviewed before build | Resolve exact Spotify URI from controlled fixture, call play, subscribe to `PlayerState`; oracle matches URI/track metadata and active non-paused state. | Stop/Pause via player API plus local Stop latch; ads, relinking, unavailable item, account/subscription and app background state are explicit partial/failure cases. | Official page labels SDK beta; exact Spotify app version, region/catalog and account eligibility form the support row. No provider commitment here. | **Conditional** and strongest current external-action candidate; physical integration and policy/terms evidence unrun. |
| Search/deep link/app launch / candidate fallback | Owning app authenticated | Open search or item URI. Postcondition proves only handler/foreground route unless owner state is available. | User takes over. Links may open paywall, wrong version or browser. | App/version/link behavior varies. | **Go as manual guidance**, **No-go as verified playback**. |
| Fixed semantic playback recipe / synthetic device lab only | Exact app/version; accessibility disclosure/grant; synthetic account | Human-authored path selects fixture result and presses Play; independent audio/session/fixture oracle matches item and playing state. | Visible Stop/Pause; touch takeover; ads/paywall/auth changes deny or return partial. | Lab-only pending policy and semantic stability; no coordinates/dynamic planner. | **Conditional — lab fallback**, after API route experiment rather than before it. |

**Workflow disposition:** conditional for a named provider integration, with Spotify App Remote the most concrete current candidate. Generic Media3 is conditional only where an owner app exposes and accepts the route; launch/search alone is no-go as completion.

## Route 5 — Granny-owned text adjustment

**Exact accepted outcome:** preview, apply, persist and restore a Granny-only text-size preference while layouts reflow and essential controls remain reachable; never claim a device-wide or third-party change.

| Route / build | Grants, auth and consent | Observation → action → independent postcondition | Stop/takeover and collateral effects | Version/distribution constraint | Evidence / disposition |
|---|---|---|---|---|---|
| App-owned scale state plus transactional preference store / candidate | No special Android grant; explicit local apply | Read current app value, preview scale, persist selected bounded value, recompose own UI. Independent oracle reads stored value and measured own-app semantics/layout; Restore reads back prior value. | Cancel before apply leaves state unchanged; Restore is visible after apply. Combined system font/display + app multiplier can clip/reflow and must be tested. | Framework/store choice remains implementation detail; DataStore 1.2.1 is one documented option, not selected dependency. | **Go** to smallest own-app synthetic experiment; device/accessibility evidence still required for support. |
| Android display/font Settings handoff / candidate fallback | User owns Settings; no automated mutation | Open documented Settings screen and explain scope; user acts. Postcondition is only handoff unless the user requests a later fresh read. | Take over immediately; Granny must not automate permissions or secure settings. Device-wide collateral effect is explicit. | OEM Settings routes vary. | **Go as manual guidance**, outside the accepted Granny-owned apply outcome. |

**Workflow disposition:** go for a strictly Granny-local route. It is useful and accessibility-relevant, but it is not an externally delegated workflow and cannot satisfy ADR-0009's two-workflow thesis bar.

## Desk disposition summary and kill-risk consequence

| Experiment | Candidate disposition | Lab-only disposition | Counts now toward externally verified thesis bar? |
|---|---|---|---|
| Sent family photos | **No-go** via picker/manual route; integration **Unknown** | Fixed semantic recipe **Conditional** | No — no runtime route or provenance oracle |
| Scoped explanation/recovery | Scoped projection/semantic observation **Conditional**; selected-image subset **Go**; automated recovery **Unknown** | Finite recovery recipe **Conditional** only if separately specified | No — desk plausibility only |
| Message preparation/confirmation | Local prep **Go**; honest compose handoff **Conditional**; send integration **Unknown** | Fixed draft recipe **Conditional** | No — preparation/handoff is not verified external completion |
| Requested media | Named owner integration **Conditional**; launch/search **No-go** as completion | Fixed recipe **Conditional** fallback | No — device/provider run absent |
| Granny-owned text | Own-app preference **Go** | Not needed | No — internal setting |

The accepted kill criterion is now an explicit **high risk**, not yet triggered: only scoped external-screen explanation and a named media integration have plausible conditional paths to useful externally verified outcomes, and neither is measured. Sent-photo retrieval has no present candidate route, message preparation/handoff cannot count as send, and text adjustment is internal. If either conditional external path fails, fewer than two useful external workflows remain; Simon must revisit scope/product/distribution rather than weaken outcome labels or begin Stage 2.

## Step B — physical inventory worksheet

**Execution status:** partial manual inspection on 2026-09-19. Simon visually read and transcribed permitted Settings values for `TBL-01`; Codex had no device connection or control. The complete configuration and all capability behavior remain unverified. See the [method, exact observations and limits](2026-09-19-t101-physical-inventory.md).

| Admitted field | Record format for future run | Current value |
|---|---|---|
| Pseudonymous device label | Locally assigned non-identifying label, for example `TBL-01` | `TBL-01` — manually assigned |
| Exact manufacturer/model/SKU | Visible Settings/About value, excluding serial | Samsung `SM-X238U`; official Samsung listing maps it to Galaxy Tab A11+ 5G |
| Android release / API | Exact displayed release plus API from an authorized read-only source | Android 16; API level not directly observed |
| OEM UI and build | One UI/OEM version and build string without unique device identifier | One UI 8.0; `BP2A.250605.031.A3.X238UQS5AZE1` |
| Security patch | Exact patch date | Android patch 2026-04-05; Google Play system update 2025-11-01 |
| Locale / timezone | Current language/locale and timezone, no location inference | English (United States); automatic date/time on; Madrid time displayed; automatic-time-zone setting and zone ID unobserved |
| Display/window/font | Resolution and logical window dp where authorized; orientation, display size and font scale | Font slider midpoint, bold off, screen zoom 2/5; resolution, logical dp, orientation and exact scale unobserved |
| Input/access | Active input modes and relevant accessibility state by category only; no typed history/dictionary | Samsung Keyboard default in English; Google voice typing on/automatic; TalkBack, Link to Windows and Voice Access off; Live Transcribe and Sound Notifications listed with state unobserved |
| Speech support | On-device/installed recognizer availability, locale and offline status; no recording | Google voice typing listed/on with automatic language selection; on-device/offline support unobserved |
| Target app packages/versions | Package and exact version for fixture/communication/media/Settings targets | Photos `7.89.0.968035987`; Messages installed/version unobserved; Chrome `138.0.7204.179`; Gmail `2025.07.28.789007522`; Google app `16.35.65.ve.arm64`; WhatsApp/Spotify/YouTube reported absent |
| Synthetic account fixture | `signed-out` or pseudonymous fixture label only; never email/name/token | Unobserved / not prepared; personal account state excluded |
| Grants/app-ops | Required permission/special-access names and granted/denied state only | Unobserved; no change authorized |
| Network profile | `offline`, `metered test`, or `controlled test network`; never SSID/address | Unobserved; no network identifier collected |
| Build/adapter identity | Exact build digest, build mode, capability/adapter/recipe/policy version | No Granny Android build or adapter supplied/inspected |

Always exclude serial number, IMEI, MAC, Android ID, advertising ID, SSID, IP address, account names/addresses, contacts, screenshots, personal messages/photos/media, tokens and personal content. Do not copy a full diagnostic dump into Git.

### Connected-device identity checkpoint before any future command

1. Simon supplies the physical tablet and explicit scope for that run. A human visually confirms the exact tablet and assigns the pseudonymous label without recording a unique hardware identifier.
2. Confirm whether zero, one or multiple devices are connected **before** any command. If not exactly the authorized `TBL-01`, stop. Any transient transport identifier used to select the device stays out of Git and the evidence note.
3. Review the exact read-only command list and its output fields before execution. Reject any command that emits excluded identifiers or personal/app content; prefer manual Settings inspection when it is sufficient.
4. Leave developer options, USB debugging, restricted settings, permissions/app-ops, accessibility services, accounts, defaults and network configuration unchanged. Existing state is observed only if separately authorized.
5. Record missing access as missing; never infer API/One UI/app support from the marketing label.

## Step C — smallest synthetic experiments

All fixtures use opaque endpoints and fabricated content. Each experiment is a separate authorization and admission question. Candidate capabilities remain disabled by default; lab adapters are absent from candidate builds. No SDK/install/account/service/permission action is authorized by this plan.

### C1 — sent-photo finite-recipe feasibility (lab only)

- **Fixture/input:** exact named communication app/version on `TBL-01`; synthetic accounts `person-a`/`person-b`; channel `fixture-chat`; two synthetic image attachments, one inside and one outside a fixed local-date interval; duplicated display name.
- **Expected effect:** locate only the attachment tied to the selected stable endpoint/channel/date and present it without saving/sharing; declare any mark-read effect before entry.
- **Forbidden effects:** gallery substitution, face identity, unrelated thread/image access, undeclared mark-read, save/share/download, dynamic planning, coordinate taps or cloud upload.
- **Independent oracle:** test-owned fixture endpoint/message ledger exported by the controlled fixture, separate from semantic tree/adapter callback.
- **Variants:** normal; tree missing/stale; permission/service revoked; Stop before and during each step; app/recipe version mismatch; signed-out/auth screen; offline; duplicate name; secure screen; human touch takeover.
- **Teardown/retention:** sign out/remove only the authorized synthetic fixture under later teardown authority; clear transient observations; retain content-free case result/version only.
- **Invalidation:** OS/app/recipe/locale/access profile, permission/policy or semantic-tree change; any wrong provenance, mark-read surprise or Stop failure suspends route.

### C2 — one-session screen explanation

**Device disposition, 2026-09-19:** the reviewed fixture and observer were installed on `TBL-01` for one bounded, content-free [device run](2026-09-19-t101-c2-device-evidence.md), then successfully uninstalled and debugging was restored. C2-01–05 and C2-07 produced their narrow expected human-observed result categories, but these do not satisfy the independent package/source, retention or egress oracles. C2-06 failed twice: the protected fixture was classified as the prior normal scene instead of unavailable. C2-08 was aborted after temporary tablet unresponsiveness, C2-09 was inconclusive, C2-10/C2-12 were unrun and C2-11 has only an incidental out-of-protocol negative. C2 is therefore not admitted. Current API review still leaves selected-package identity unresolved: MediaProjection supplies chosen content but the API 36 observer does not independently receive the selected package.

- **Fixture/input:** local synthetic screen app with known normal, malicious-instruction, stale, private-canary and `FLAG_SECURE` screens; request one app-window explanation.
- **Expected effect:** capture only the selected window after per-session consent, identify fixture package/source, explain present labels with uncertainty and offer guidance; protected screen returns unavailable.
- **Forbidden effects:** full-device/background capture, credentials, action from screen text, persistent token, capture after revoke/Stop, unconsented egress or automated recovery.
- **Independent oracle:** fixture-owned visible-state manifest plus capture lifecycle/egress canary monitor, not model confidence.
- **Variants:** normal; user denies/revokes projection; Stop before/during processing; orientation/window resize; API/target/build mismatch; provider offline; auth/secure window; app switch; cloud consent absent.
- **Teardown/retention:** release projection/surface; zero retained frames/canaries; content-free outcome only.
- **Invalidation:** Android/target SDK/OEM capture change, provider/data contract change, selected-window leakage or Stop callback failure.

### C3 — exact local draft and honest compose handoff

- **Fixture/input:** `person-a` and `person-b`, duplicate display label, channel `fixture-sms` or controlled email handler, exact text `Meet at six.` and mutation `Meet at seven.`.
- **Expected effect:** local immutable draft readback matches endpoint/channel/bytes; after fresh approval, candidate opens compose. Claim `external draft opened` only if an independent owner-supported readback matches; otherwise claim `compose handoff opened` and require user Send.
- **Forbidden effects:** send/delivery claim, external send, wrong account/person, field normalization not previewed, hidden draft sync, permit reuse or retry after unknown.
- **Independent oracle:** test-owned local draft store; for external compose only, controlled fixture messaging app's separate draft ledger. Foreground arrival is not enough.
- **Variants:** normal; handler absent; grant revoked; Stop before intent dispatch and immediate takeover after; handler/app version change; signed-out/auth prompt; offline; changed body/recipient invalidates approval; process restart.
- **Teardown/retention:** delete synthetic local/external draft under fixture authority; clear permit/raw content; retain content-free outcome.
- **Invalidation:** OS/handler/app/build/policy/schema change, any unpreviewed transformation/sync or wrong-field handoff.

### C4 — named media integration

- **Fixture/input:** Spotify App Remote 0.8.0/Auth 2.1.0 or a controlled Media3 fixture, synthetic test account where provider permits, two same-title items, exact stable URI, ad/paywall/unavailable states.
- **Expected effect:** play exact non-purchase fixture item; independent PlayerState/media-session state matches URI/title/artist and active playback; visible Pause stops supported playback.
- **Forbidden effects:** purchase/trial acceptance, wrong item, play claim from launch/search, volume/global-setting mutation, repeated toggle, unapproved analytics or credential handling.
- **Independent oracle:** provider/player state plus fixture audio/session monitor independent of request callback.
- **Variants:** normal; app-control permission revoked; Stop/Pause race; SDK/app/catalog version mismatch; signed-out/auth expired; offline; ad/paywall; relinked URI; another session active; app background/killed.
- **Teardown/retention:** stop playback, disconnect controller, revoke/delete synthetic authorization as permitted; retain only content-free route/version results.
- **Invalidation:** provider terms/SDK/app/account/region/catalog/OS change or any failure to identify/pause the exact item.

### C5 — Granny-owned text scale

- **Fixture/input:** own-app build with known default, bounded larger value and prior value; synthetic long names/draft; 100/130/200% system font across required widths/orientations.
- **Expected effect:** preview then apply only Granny scale, persist exact value, reflow without clipping Stop/confirmation, restore prior value and survive app restart.
- **Forbidden effects:** Android/third-party setting change, inaccessible essential control, horizontal essential-content loss, value written before Apply or retained after Restore.
- **Independent oracle:** direct preference readback plus automated layout/semantics bounds and manual TalkBack/keyboard checks; UI label alone is insufficient.
- **Variants:** normal; cancel/Stop before apply; storage write failure/revoke-equivalent corruption; app/build/schema version migration; no auth dependency; offline; process restart; maximum combined scale.
- **Teardown/retention:** restore fixture default and clear test-only state; retain layout result/version, no private content.
- **Invalidation:** UI/token/layout/store/schema/system font behavior or supported window-class change.

## Gate impact and exact next authorization

- **GATE-03 stays Needs evidence:** Step B exact device/app inventory, then authorized synthetic-device runs must show fresh target resolution, actual observation/action, independent postconditions, visible Stop/takeover and failures on the same configuration.
- **GATE-04 stays Needs evidence:** the public dynamic accessibility route remains blocked under reviewed policy; candidate API/integration and any finite recipe still need manifest/data/disclosure architecture plus an appropriate policy reviewer. No store approval/contact occurred.
- **GATE-06 stays Ready only for offline fake replay and Needs evidence for device actuation/real data:** T-103's accepted fixture invariants do not prove projection/accessibility lifecycle, grants, egress isolation or external effects.

Step B is now partial: the safe manually visible fields above are recorded, while API level, complete display/window data, offline speech, app packages/versions, accounts, grants, network profile and build/adapter identity remain unknown or absent. Do not fill those gaps with commands or personal-account inspection under this authorization.

The C2 scaffold's first device run produced a reproducible protected-content failure and an aborted Stop attempt. A source-only follow-up now passes 29 host cases with a two-phase freshness gate, bounded marker-band sampling and explicit ten-second C2-08/09/10/12 single-app controls. Those repaired APKs are hashed but completely unrun on Android; package identity remains unresolved and host logic cannot close any failed/inconclusive/unrun device row. Review the repair commit/artifacts and temporary-unresponsiveness event before requesting fresh exact device authority. C5 is lower risk but does not reduce the two-external-workflow kill risk. Each other C1–C5 experiment still requires its own device/build/fixture/account/grant/network/actuation/retention authority. T-104 remains blocked until the sent-photo route and applicable device-safety boundary have actual evidence.
