---
title: "Native on-device voice shell and cleanup boundary"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, android, voice]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../09-decisions/ADR-0011-explicit-activation-and-access.md
  - ../../02-design/voice-ux.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t120-native-voice
next_action: Review the bounded shell, then run the separately controlled Samsung permission/offline/acoustic/lifecycle matrix with synthetic phrases.
changed_paths:
  - android/README.md
  - android/stage1/.gitignore
  - android/stage1/README.md
  - android/stage1/app/build.gradle.kts
  - android/stage1/app/src/main/AndroidManifest.xml
  - android/stage1/app/src/main/java/org/pueblo98/stage1/MainActivity.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/AndroidOnDeviceVoiceRecognizer.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/TranscriptCleaner.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/TranscriptHypotheses.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/VoiceRecognizerAdapter.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/VoiceSessionController.java
  - android/stage1/app/src/main/res/drawable/ic_launcher_voice.xml
  - android/stage1/app/src/main/res/values/strings.xml
  - android/stage1/app/src/main/res/xml/data_extraction_rules.xml
  - android/stage1/app/src/test/java/org/pueblo98/stage1/voice/TranscriptCleanerTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/voice/TranscriptHypothesesTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/voice/VoiceSessionControllerTest.java
  - android/stage1/build.gradle.kts
  - android/stage1/gradle.properties
  - android/stage1/gradle/wrapper/gradle-wrapper.jar
  - android/stage1/gradle/wrapper/gradle-wrapper.properties
  - android/stage1/gradlew
  - android/stage1/gradlew.bat
  - android/stage1/settings.gradle.kts
  - docs/01-product/prd.md
  - docs/01-product/traceability.md
  - docs/02-design/voice-ux.md
  - docs/04-architecture/system-overview.md
  - docs/08-research/android-stage-1-feasibility.md
  - docs/09-decisions/ADR-0011-explicit-activation-and-access.md
  - docs/09-decisions/README.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/task-packets.md
  - docs/README.md
---

# Native on-device voice shell and cleanup boundary

## Scope and authority

Simon explicitly selected Android native on-device recognition, deferred the
cleanup language model and requested a new plan plus implementation on
2026-09-20. T-120 implements only the own-app foreground Talk/Type/transcript
slice and its host-testable boundary. It may prepare but does not silently run
the physical-device microphone matrix, retain personal speech, add cloud audio
or start adjacent external-control work.

The branch starts from committed `feature/explicit-scroll-row-home` at
`1e81dd7`, then merges `origin/main` at `ee386ed`. The separate Home worktree's
uncommitted Context Rooms files remain untouched.

## What changed

Canonical decision, requirement, architecture, research, traceability and task
owners now select the initial platform route and define the bounded cleanup,
fallback, permission, lifecycle and evidence contracts. T-120 and its detailed
task packet own the implementation and exact-device follow-up.

The new `android/stage1` Java shell has one foreground Activity, a narrow
recognizer interface and an Android adapter that checks on-device availability
and calls only `createOnDeviceSpeechRecognizer`. Talk alone requests
`RECORD_AUDIO`; unavailable/denied/error states retain Type. The UI exposes
provisional text, Done listening, Stop, editable final text and exact local
submission. A 10-second no-speech prompt and 30-second cap are visible local
session behavior.

The pure controller invalidates old recognizer generations on Stop or
replacement. Android formatted/raw hypotheses feed a deterministic cleaner
that only normalizes whitespace and punctuation spacing. There is no Internet
permission, planner, provider SDK, model artifact, transcript archive or raw
audio store. Backup and device transfer exclude all app domains.

## Evidence

- Offline Gradle `clean testDebugUnitTest assembleDebug lintDebug` passes with
  16 tests, zero failures/errors/skips and a 2.4 MiB debug APK. Lint has zero
  errors and two deliberate API-version notices: target/compile API 36 while
  API 37 is locally available.
- Gradle `:app:dependencies --configuration debugRuntimeClasspath` reports no
  runtime dependencies. The source/manifest scan finds no Internet permission,
  provider SDK or model library.
- `aapt2 dump permissions` against the built APK reports only
  `android.permission.RECORD_AUDIO`.
- `adb devices` reports no attached device. Physical recognizer, microphone,
  permission UI, offline, acoustic, lifecycle, TalkBack, rotation and human
  correction evidence remains unrun.
- Repository documentation, cockpit, handoff, tooling and diff checks are run
  at final branch handoff; their exact results are recorded in the final
  delivery channel and commit checks.

## Handoff

Review on `feature/t120-native-voice`. The branch starts from the latest
committed Home branch, incorporates `origin/main` and leaves the dirty primary
vault plus the owner's uncommitted Context Rooms worktree untouched. Mixed
code/documentation work is not merged under the documentation-only standing
authority. The next bounded action after review is the exact-device matrix in
the T-120 packet; it may produce device evidence but does not pass a gate by
itself.
