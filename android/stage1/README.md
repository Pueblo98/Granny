---
title: "T-120 native on-device voice shell"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [android, voice, implementation]
related:
  - ../../docs/09-decisions/ADR-0011-explicit-activation-and-access.md
  - ../../docs/10-execution/backlog.md
  - ../../docs/10-execution/task-packets.md
---

# T-120 native on-device voice shell

This is the first bounded own-app Android shell. It implements explicit
tap-to-talk with Android's on-device `SpeechRecognizer`, a complete typed
fallback, visible partial/final transcript states, Done listening, Stop,
editable final text and conservative non-model cleanup.

It is not a complete Granny app. It has no planner, external app adapter,
message send, model, cloud speech, TTS voice selection, background capture,
wake word, persistent transcript or analytics. Submitting a request only
freezes and displays the exact local text revision.

## Boundary

- `minSdk 31`, `compileSdk/targetSdk 36`.
- Android platform APIs plus JUnit 4 only; no AndroidX, Compose, provider SDK,
  model artifact or Internet permission. The debug runtime classpath has no
  dependencies.
- `RECORD_AUDIO` is requested only after Talk.
- Only `createOnDeviceSpeechRecognizer` is used. Unavailable recognition
  fails to Type; there is no generic or network recognizer fallback.
- The app does not open, store or export an audio stream. Android's selected
  on-device recognition service owns capture for the active foreground session.
- Transcript state is process memory only. Backup and device transfer exclude
  every app data domain.

## Host evidence — 2026-09-20

Use the already prepared JDK 17 / API 36 toolchain:

```text
./gradlew --no-daemon clean testDebugUnitTest assembleDebug lintDebug
```

The command above passes: 16 JUnit cases, debug assembly and lint with zero
errors. Lint retains two deliberate version notices because this shell targets
the selected Android 16/API 36 reference configuration while API 37 is present
in the local SDK. `aapt2 dump permissions` reports only `RECORD_AUDIO`, and the
debug runtime dependency report is empty.

Host tests cover the pure generation/state, hypothesis-selection and cleanup
contracts. They do not exercise a microphone, recognition service, Android
permission UI, locale pack, acoustic condition, TalkBack or process lifecycle.

## Device evidence still required

No Android device was attached at handoff. The exact T-120 packet defines the
later Samsung matrix. Use synthetic phrases
and retain no raw audio or personal transcript. Record exact app SHA, device,
OS/API, recognizer component, locale/model status, permission path, offline
state, partial/final result, correction effort, Stop/lifecycle result and
timings. A successful install or one correct transcript does not pass RES-06,
EVAL-005/007/009/012 or a release gate.
