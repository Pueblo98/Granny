---
title: "T-122 native Setup and Capability Center"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, setup, accessibility]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../02-design/product-design-spec.md
  - ../../../android/stage1/README.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: feature/t122-setup-capability-center
next_action: Review the pushed T-122 branch; continue with the separately bounded T-101 C2 evidence packet without device execution
changed_paths:
  - android/stage1/README.md
  - android/stage1/app/build.gradle.kts
  - android/stage1/app/src/main/java/org/pueblo98/stage1/MainActivity.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/setup/CapabilityCenterModel.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/ConversationSpeechBridge.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/SpeechOutputController.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/setup/CapabilityCenterModelTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/speech/ConversationSpeechBridgeTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/speech/SpeechOutputControllerTest.java
  - docs/01-product/traceability.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/task-packets.md
  - docs/README.md
---

# T-122 native Setup and Capability Center

## Scope and authority

Simon requested implementation of Setup and Capability Center as the next
native slice on 2026-09-20. The bounded outcome is a truthful own-app status
and repair destination for the already integrated Type, on-device Talk,
explicit offline-eligible spoken output, Granny text size, speech rate and Sound
controls. It may open Android's own app-settings page only after a direct user
action. It adds no setup gate, account, network, provider, model, download,
external-app route, background service or permission.

This session owns T-122 only. The separate T-101 C2 evidence packet and local
fictional draft are later bounded sessions. No tablet action, APK install,
permission change, external app action or main integration is authorized here.

## What changed

The Android shell now exposes an optional Setup and capabilities destination.
Its status rows are projected by a pure model from current permission,
recognizer, speech-adapter and local preference state. Type remains ready;
Talk separates microphone permission from on-device recognizer availability;
spoken answers separate installed offline-eligible voice availability from
Sound; text size and speech rate use the controllers' closed labels. External
message, media and screen routes are explicitly unavailable in this build.

Try voice enters the existing T-120 path. Try spoken answer uses a fixed
synthetic sentence under its own speech-purpose generation; it cannot populate
Repeat, authorize a rate, or become task content. Stop and stale callbacks keep
their existing fail-closed behavior. The user may open Android's app-details
settings only by tapping the named control, and live state is rebuilt on return.
The destination is optional and does not gate the conversation.

Artifact identity is version code 3 / `0.3-setup-capabilities`. No permission,
runtime dependency, service, provider, account, model, network route, setup
profile or analytics store was added.

## Evidence

All Android commands used Temurin 17.0.20.1 and a temporary official Android
API 36/build-tools 36.0.0 SDK. The first test attempt did not run because the
previous `/tmp/granny-c2-toolchain` had been cleaned; the replacement toolchain
was restored outside the repository and the final clean run was offline.

- `android/stage1/gradlew -p android/stage1 --offline --no-daemon clean :app:testDebugUnitTest :app:assembleDebug :app:lintDebug :app:dependencies --configuration debugRuntimeClasspath` — pass: 146 tests across 17 suites; debug APK assembled; lint 0 errors/17 warnings; runtime dependency graph `No dependencies`.
- API-36 `aapt2 dump badging` — package `org.pueblo98.stage1`, version code 3, version name `0.3-setup-capabilities`, minSdk 31, compile/target platform 36.
- API-36 `aapt2 dump permissions` — only `android.permission.RECORD_AUDIO`.
- Merged-manifest inspection — backup disabled, cleartext disabled, launcher Activity remains the only exported component.
- Debug APK SHA-256 — `533c8853125019ecfb9d4ed2fe8a8ac91657eabe01abefe81243901198c2b366`; local debug output only, not installed or published.

No device, emulator, microphone, recognizer, TTS engine, Android settings UI,
TalkBack, keyboard/switch, rotation, 200% text, network monitor or audible
quality check ran. Host status projection cannot prove installed-engine
retention/egress, recognizer privacy, repair success, layout usability or a
release gate.

## Handoff

Worktree: `/home/lgtw/Work/granny-worktrees/t122-setup-capability-center`.
Base: `origin/main` at `c834e4297d56860ba4547bcca60b6b9f24acb66e`.
The primary checkout and its untracked user files remain untouched. This mixed
code/documentation session stops at a reviewed task-branch push; it has no
authority to merge or synchronize the primary vault. The next bounded session
prepares the T-101 C2 evidence packet and media-route desk evidence only.
