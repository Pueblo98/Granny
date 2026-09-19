---
title: "T-120/T-121 native voice and spoken-readback shell"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [android, voice, speech, accessibility, implementation]
related:
  - ../../docs/09-decisions/ADR-0011-explicit-activation-and-access.md
  - ../../docs/10-execution/backlog.md
  - ../../docs/10-execution/task-packets.md
---

# T-120/T-121 native voice and spoken-readback shell

This is the first bounded own-app Android shell. T-120 implements explicit
tap-to-talk with Android's on-device `SpeechRecognizer`, a complete typed
fallback, visible partial/final transcript states, Done listening, Stop,
editable final text and conservative non-model cleanup.

T-121 adds explicit Android `TextToSpeech` readback of the visible request,
Stop speaking, revision-bound Repeat, persistent Sound off/on and four closed
speech-rate choices with preview-before-Apply and one-step Restore. Written
text remains visible and complete; the app never starts readback automatically.

It is not a complete Granny app. It has no planner, external app adapter,
message send, model, cloud speech, downloadable TTS voice management, background
capture, wake word, persistent transcript or analytics. Submitting a request only
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
- Spoken output accepts only an installed locale-compatible TTS voice whose
  Android metadata reports no network requirement. Absence/failure keeps the
  written route and does not fall back to a network voice.
- Read/Repeat sends the exact selected text revision to the installed Android
  TTS service for that utterance. The app creates no speech audio file and
  clears its repeat copy on edit, lifecycle exit or output-route loss.
- Speech rate and Sound are stored in private versioned preferences with
  synchronous compare-and-set/readback. The manifest TTS service query is
  package visibility metadata, not an additional permission.

## Host evidence — 2026-09-20

Use the already prepared JDK 17 / API 36 toolchain:

```text
./gradlew --no-daemon clean testDebugUnitTest assembleDebug lintDebug
```

The latest command passes 55 cases across the combined voice, text-size and speech suites,
debug assembly and lint with zero
errors. Lint retains two deliberate version notices because this shell targets
the selected Android 16/API 36 reference configuration while API 37 is present
in the local SDK. `aapt2 dump permissions` reports only `RECORD_AUDIO`, and the
debug runtime dependency report is empty.

Host tests cover input/output generation state, stale callback and revision
rejection, hypothesis selection, cleanup, and settings failure/readback
contracts. They do not exercise a microphone, recognizer/TTS service, Android
permission UI, installed voice/locale pack, acoustic condition, audible
output, audio focus, TalkBack or process lifecycle.

## Device evidence still required

No Android device was attached at handoff. The exact T-120/T-121 packets define
the later Samsung input/output matrix. Use synthetic phrases and text
and retain no raw audio or personal transcript. Record exact app SHA, device,
OS/API, recognizer component, locale/model status, permission path, offline
state, partial/final result, correction effort, Stop/lifecycle result and
timings. For output also record TTS engine/voice, its network-required metadata,
airplane-mode behavior, exact spoken fixture, Stop latency, each rate, audio
focus and TalkBack interaction. A successful install, one correct transcript or
one audible utterance does not pass RES-06, EVAL-005/007/009/012 or a release
gate.

## C5 Granny-local text size

The native shell now provides Standard / Larger / Larger still / Largest
(1.0 / 1.15 / 1.3 / 1.5 times base sp, compounded with system font scaling).
Selecting a choice only changes the sample. Apply writes the private,
versioned `granny_text_scale` preference; readback must match before success.
Restore reinstates the previous saved value once. Cancel abandons a preview;
true backgrounding cancels it, while configuration recreation retains only
preference/preview state. No transcript is retained by this mechanism.

The store contains schema/version/current/previous enum only, uses synchronous
commit and a single-process compare-and-set lock, and remains excluded from
backup and transfer. Unknown save outcomes block further writes in that process.
There is no Android/third-party settings control or natural-language dispatch.
The inherited voice entry and local request submission remain separate.

See the [session record](../../docs/10-execution/sessions/2026-09-20-c5-native-text-scale.md)
and [exact tablet verification](../../docs/10-execution/t101-c5-tablet-verification.md).
Host fake-store readbacks are distinct from actual disk/restart, Android layout,
TalkBack and keyboard evidence. Those device cases are unrun.

## Shared conversation integration

The [native integration contract](../../docs/10-execution/t120-tablet-integration-handoff.md)
now owns the bounded join between typed input, accepted voice revisions,
shared conversation surfaces and C5 preference authority. The
[integration record](../../docs/10-execution/sessions/2026-09-20-native-conversation-integration.md)
records the exact committed speech dependency and all source/host checks.
Physical tablet testing is on hold at Simon's direction.
