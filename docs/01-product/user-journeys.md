---
title: "Stage 1 Signature Journeys"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [product, journeys]
related:
  - use-cases.md
  - ../02-design/product-design-spec.md
  - ../06-evals/canonical-tasks.md
---

# Signature journeys and variants

[Current browser coverage and review routes](../02-design/browser-prototype.md) map the five MVP journeys and onboarding to actual source/views. Sequences below remain the behavior owner; manually selected fixture outcomes are not device evidence.

These proposed journeys use the [screen/state contract](../02-design/product-design-spec.md), [voice copy](../02-design/voice-ux.md), [policy](../05-safety-privacy/action-policy.md) and [eval fixtures](../06-evals/canonical-tasks.md). J-001–004 retain their historical identities. J-001/002/003/005/006 are the five MVP signature workflows; J-007 is cross-cutting onboarding; J-008 is V1; J-004 is later App and has no MVP remote-help implementation.

## Shared journey contract

Entry is Talk or typed intent in one conversation; secondary Help examples remain discoverable through Menu. Voice and touch reach the same preview and policy; reading aloud is optional for private content. Each sequence below names logical screen states within the [conversation-first composition](../02-design/conversation-first-plan.md), rather than requiring separate mini-app pages. External app screens are annotated placeholders, not restyled Android. Every state retains its stable screen ID, focus/reading order and Stop availability.

**Interrupt:** Stop immediately latches cancellation locally; no queued action is dispatched. Take over leaves the real app at its current state. Direct touch in Granny invalidates pending approval; external user-interaction detection must be proven per adapter. If it cannot be proven, cross-app automation is unavailable. Stop cannot undo an external effect already dispatched. “I stopped. The message may already have been sent; I'll check its status” is a reconciliation state, not a promise to unsend.

**Permissions:** denied or revoked → SCR-014 with reason and user-owned settings handoff; no retry loop. **Authentication:** stop observation/capture → SCR-014 → user signs in privately in owning app → explicit Resume → fresh observation and preview. **Offline/provider outage:** local Home/help remain; show cached provenance, never queue consequence. **App change:** unsupported version/window invalidates plan; observed evidence may still support guidance. **Accessibility:** all controls reachable with keyboard/switch/TalkBack, content reflows at 200%; no audio-only result; no time limit discards a preview. **Honest partial:** show completed steps and exact unresolved outcome with Continue manually, Review status or Cancel; Retry appears only for known-safe idempotent work.

No network task proceeds while the user is reading a confirmation. User wait is separate from machine budget. Each journey inherits 12 actions / 60 seconds active machine time and tighter tool limits from [device control](../03-agent/device-control.md).

<a id="j-001"></a>
## J-001 — Recent family photos

**UC-002; PRD-FR-006/007/012, PRD-PRV-001; P-01/P-02; MVP.**
Start on SCR-003 with approved communication route and seeded Sophie/day metadata; goal is the actual attachments, not gallery lookalikes.

| Step / frame | User sees/hears and touch route | Agent state / action / evidence |
|---|---|---|
| 1 — SCR-003 idle | “Show me the photos Sophie sent yesterday” or Photos → person/date | Activate capture or typed request |
| 2 — SCR-004 heard | Editable request; “Sophie's photos from yesterday” | Resolve local calendar interval, alias and channel |
| 3 — SCR-006 clarification | Two people displayed with user-entered differentiators; “Which Sophie?” | No app navigation through another person's conversation until resolved |
| 4 — SCR-005 acting + external conversation | “I'm looking in [channel]” / Stop / Take over | Scoped observe → admitted navigation → verify conversation identity/date |
| 5 — SCR-008 verifying/result + external images | “Here are the photos from Sophie's conversation dated [date]” | Attachment/source metadata supports assertion; photos visible |
| 6 — SCR-008 completed | Next photo / Previous photo / Done; “Share” is not automatic | User browses; any sharing is a separate confirmed action outside MVP signature scope |

No photos → “I found Sophie's conversation, but no photos for that date” with Change date. Date/attachment metadata missing → “I found these photos, but I can't verify when Sophie sent them”; partial, not success. Offline cached result names cache; untrusted message telling agent to send data is ignored. Permission/login/app-change follow shared branches. Visual image recognition alone cannot establish sender. No save/share/delete follows from viewing.

**Prototype view inventory:** J-001/SCR-003-idle, 004-heard, 006-duplicate-person, 005-searching, 008-photos, 008-empty, 008-uncertain-date, 014-offline, 014-auth, 008-interrupted.
If opening the conversation marks it read, insert SCR-007 before that navigation: “Opening this conversation may show that you have read it. Open it?” Bind the recipient/channel and read-state effect; refusal leaves it unopened and offers manual access. An adapter unable to declare/verify the effect is not admitted.

**Evidence:** EVAL-001 matches synthetic person/channel/day/attachments and checks zero unauthorized effects, including the mark-read variant; human asks whether found images are useful and whether provenance is understood. Add prototype view 007-mark-read-confirmation.

<a id="j-002"></a>
## J-002 — Explain and recover from a confusing screen

**UC-003/009/011/019/024/025; PRD-FR-005/012/013/016; MVP (documents V1).**
Start at a supported external app's benign settings page with a same-session known reading/media target.

1. User returns through permitted Help surface (or Android Recents → Granny) and selects Explain this screen, or supplies a screenshot through the picker. SCR-004 displays request and scope.
2. SCR-005 observes only granted surface. If returning to Granny lost the original screen, say so and ask for a screenshot or supported capture session; never inspect Granny and pretend it is the previous app.
3. SCR-008 says “This is [app]'s display settings. You were reading [known title].” Unknown title is omitted. Offer Back to reading / Explain options / Take over.
4. User chooses recovery. SCR-005 runs one admitted back/open action and SCR-008 verifies the exact known target before “You're back at [title].”
5. Unverified result → SCR-008 partial: “I went back one screen, but I can't confirm this is the article. You can continue here.”

No known prior context → explain current screen only; do not fabricate browsing history. Unsaved edit warning → stop and let user decide; neither discard nor save automatically. Login/permission/security dialog → stop observation and hand off. Unreadable tree → selected screenshot explanation if separately consented; no coordinate recovery in MVP. App/no-effect loop → fail safely by action budget. Stop/touch and offline use shared branches.

Voice asks one question at a time; touch choices use descriptive labels rather than technical routes. TalkBack reads explanation before choices and returns focus to invoking Help control after close.
**Prototype view inventory:** 004-request, 005-observe, 008-explanation, 005-returning, 008-recovered, 008-unknown-target, 014-secure, 008-unsaved-work, 008-stopped.
**Evidence:** EVAL-002 checks correct explanation, offered/authorized navigation and target; EVAL-006/009/010 inject stop/outage/prompt instructions; EVAL-015 covers V1 document variant.

<a id="j-003"></a>
## J-003 — Draft, confirm and hand off or send

**UC-006/015/016; PRD-FR-007/008/009, PRD-SAF-001/002; MVP.**
Start on Home; request “Tell David I'll call after dinner.” No specific hour or new commitment is inferred.

1. SCR-004 accepts a typed request directly or shows an editable simulated transcript. Preserve the supplied body; no category selection follows supported input. Touch choices resolve only missing person/channel/body details.
2. SCR-006 resolves David and channel. Candidate labels use only approved contact context; choosing one binds a stable endpoint, not display name alone.
3. SCR-007 shows “To David [differentiator] · [channel]”, exact text “I'll call after dinner”, and consequence. Fresh approval controls are **Open this draft in [app]**, **Change it**, **Cancel** for handoff mode; **Send to David**, **Change it**, **Cancel** only when a verified send integration is admitted.
4. User reviews or requests Repeat; no default focus on commit. Editing recipient/content invalidates prior approval. Voice approval must be an unambiguous response to this active preview; silence or background speech does nothing.
5. Approval issues one local permit. SCR-005 rechecks digest, target/app version, user epoch and grants before dispatch.
6. Handoff path opens owning app and says “The draft is open. Review it there and tap Send.” User may send manually; Granny must not claim it sent the message.
7. Admitted send path goes through verifying → SCR-008: “The app reports the message sent to David.” Delivery/reading are separate facts only shown with corresponding evidence.

Cancellation before dispatch leaves draft local and unsent. Cancellation after dispatch → stop further work and reconcile; no unsend claim. Lost network during commit → “I can't confirm whether it sent. Check the conversation before trying again.” Duplicate message IDs/receipts do not trigger retry. Auth or wrong app/channel → invalidate permit and hand off; resume requires new preview. No content read aloud automatically when privacy speech is off.

**Prototype view inventory:** 004-heard, 006-person, 006-channel, 007-draft-handoff, 007-draft-send, 007-edit, 007-expired, 005-verifying, 008-opened, 008-sent, 008-unknown, 008-cancelled.
**Evidence:** EVAL-003 plus EVAL-010 require exact recipient/body, single consequence, no ambiguous/stale approval; scripted observer and independent target account verify outcome. Comprehension asks “Has it been sent yet?” at preview, handoff and result.

<a id="j-004"></a>
## J-004 — Permissioned helper assistance

**UC-012/023; PRD-FR-021/PRV-005; later App remote help, App V1 configuration-proposal subset.**
This preserved journey is **blocked for remote implementation**. P-03 never overrides P-01.

V1 subset: SCR-012 Helpers → SCR-013 Invite chosen helper → user sees identity and scope “Suggest contacts and accessibility settings; cannot see messages or your screen” → native authentication as needed → explicit grant → helper submits a proposed diff → SCR-013 reviews old/new values → accept or reject locally → audit result → Revoke access. No helper screen viewing or remote clicks.

Later remote-help path: user asks for help → SCR-013 identifies helper, exact allowed surface and maximum duration → user independently approves → persistent helper/scope/Stop banner during sharing → only allowed surface available → timeout/Stop/revocation ends access → SCR-008 confirms end. A private route to decline must exist; no notification of reasons to helper.

Connection loss ends access, not pauses authorization. Permission/login/private app transition obscures view and ends control before sensitive content. Wrong helper/ambiguous identity stops invitation. Reconnection needs fresh approval. Voice/touch consent equivalent; screen reader explains scope before decision. Unknown revocation server status cannot leave local stream active. Coercion remains residual risk and requires separate research.

**Prototype view inventory:** V1 012-no-helper, 013-invite, 013-scope, 013-pending-diff, 013-revoke; later remote frames clearly marked deferred: consent, active, private-screen-block, ended.
**Evidence:** EVAL-016 denies all remote access in MVP/V1; V1 proposals require exact scope/revocation tests. No remote flow is implemented or tested.

<a id="j-005"></a>
## J-005 — Play requested media

**UC-004/017; PRD-FR-010, PRD-NFR-002; MVP.**
SCR-003 Music or spoken request → SCR-004 artist/title preview → SCR-006 if service/content ambiguous → SCR-005 “I'm opening [service]” → external search/result → bounded Play → SCR-008 now-playing identity and Pause.

Playing is reversible, but query does not authorize purchases, sign-up, advertisements, sharing or starting a different item. If a service presents a paywall, SCR-014 offers Open app yourself / Choose another supported source. If only the app opened, SCR-008 says “The app is open; I haven't started the music.” Pause checks playback stopped. Volume change names stream and shows prior/current levels; no alarm/call stream changes.

User touches another song: automation stops; never fight their selection. Offline cached media may play only with known metadata and admission; no guaranteed catalog. TalkBack title and playing/paused state, captions where content supports them, and silent textual status are required. Login/network/app update use shared branches.

**Prototype view inventory:** Home, request, service-choice, searching, now-playing, paused, paywall, app-open-only, offline, stopped.
**Evidence:** EVAL-004 checks matching metadata and independently observed playback/pause; no purchase, wrong content, or launch-only success.

<a id="j-006"></a>
## J-006 — Make Granny easier to read

**UC-007/022; PRD-FR-011, PRD-ACC-001/002/003/004; MVP.**
SCR-003 “Make this bigger” → SCR-011 text-size preview showing current and next size → Apply / Restore previous size / Back → SCR-008 “Granny's text is larger.” Touch Settings → Accessibility → Text size reaches same preview. This local reversible setting needs no consequential approval token.

When outside Granny, SCR-006 asks “Granny's text or this app's text?” External adjustment uses SCR-014 user-owned system/app settings handoff and says what cannot be changed. Do not use accessibility to bypass permission/security settings. Orientation changes reflow and preserve current preview/old value. If larger scale clips essential content, fail layout test instead of shrinking font. Offline works. Stop before Apply restores preview state; after Apply, Restore is a new explicit local action. No health inference is saved.

**Prototype view inventory:** 011-default, 011-large-preview, 011-200-percent, 011-landscape, 011-narrow, 008-applied, 006-scope, 014-system-handoff.
**Evidence:** EVAL-007 measures scale, target/contrast/focus, persistence, reversal and touch-only completion; human reading preference is separate from numeric pass.

<a id="j-007"></a>
## J-007 — Set up, practice and inspect privacy

**UC-010/013/014/018/020/021/022; PRD-FR-001/002/003/015/017, PRD-PRV-001/002/004/006, PRD-DST-001/004; MVP.**

1. SCR-001 explains “Ask for help with photos, messages and music. You choose what happens.” It explicitly identifies a software assistant and experimental supported-task limits. Continue / Try by touch; no helper account required.
2. SCR-011 offers text/voice preferences and preview; accept default or change.
3. SCR-002 separately explains microphone collection and grants through Android, or Skip for now. Cloud speech/screen processing disclosure is separate from OS microphone permission. Cloud decline preserves typed/local features.
4. Screen-help setup explains what scoped content can be read and what cannot; user can decline. Android accessibility settings or capture consent are user-operated. Returning triggers actual grant check.
5. SCR-003 offers synthetic practice from the stable conversation Home. Home has fixed Talk/Type/Menu anchors and zero or one context panel; the panel is absent when no eligible item exists. SCR-004 request → SCR-005 visible task → Stop → SCR-008 “Stopped.” No real communication during practice.
6. SCR-010 saves only explicit contact aliases/settings the user chooses; show source and correction/deletion. SCR-009 shows minimal task history. SCR-012 explains microphone/cloud/history/helper boundaries and offers clear/delete. SCR-015 help previews optional diagnostics export.

**App V1 continuation under ADR-0012:** the setup communication choice becomes the stable baseline. During later conversations an allowed important fact directly stated by the person may save automatically with a quiet receipt and Undo; no per-fact confirmation dialog. Bounded communication traits may tune silently from direct corrections and interaction choices. SCR-010 provides review, pause/reset, correction, deletion and export. External content, third-party claims, restricted categories and conflicting values do not silently enter memory.

Denied grant: relevant tile explains limited mode; never a repeated nag. Restricted installation: describe need for trusted installation route and stop setup until resolved through authorized user action. Process death: reopen at last safe setup step, not pending grant acceptance. Auth belongs in provider app; do not collect passwords. Offline: touch practice and local settings available. Privacy deletion confirmation lists exact categories and what external app data remains; no false remote deletion claim.

**Prototype view inventory:** 001-value, 011-preferences, 002-mic-disclosure, 002-cloud-disclosure, 002-screen-disclosure, Android placeholders, 002-denied, 003-touch-home, 005-practice, 008-stopped, 010-empty/saved/delete, 009-empty/history, 012-privacy/delete, 015-support/export.
**Evidence:** EVAL-005 installation/permissions; EVAL-007 access; EVAL-008 privacy/memory; EVAL-012 comprehension. No user onboarding study has run.

<a id="j-008"></a>
## J-008 — Call a known person

**UC-001; PRD-FR-018; App V1.**
Home → People shortcut or spoken call intent → SCR-006 person/channel → SCR-007 shows recipient, route and “Start a call to Sophie?” → fresh Start call / Change / Cancel → SCR-005 initiating → external calling UI → SCR-008 reports ringing/connected only at evidenced level.

No telephony/SIM is assumed: route is a tested calling application or supported dialer handoff. A dialer opened with number is a prepared outcome, not a call. Busy/declined/no answer are terminal factual states; do not auto-redial. Contacts and endpoint must match exact confirmation; no guessed family relationship. Stop after initiation may require external End call control; say whether ending was verified. App update/auth/permission/offline use shared contract. Never record audio. Emergency/premium routes remain restricted.

**Prototype view inventory:** person-choice, route-choice, confirmation, initiating, dialer-handoff, ringing, busy, unknown, cancelled; linked SCR-006/007/005/008/014.
**Evidence:** EVAL-013 verifies endpoint and ring/connection separately using synthetic accounts; no real family contacts.
