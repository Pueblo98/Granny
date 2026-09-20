---
title: "Native spoken readback and speech controls"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, android, accessibility, speech]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../02-design/voice-ux.md
  - ../../02-design/design-system.md
  - ../../../android/stage1/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t121-spoken-readback
next_action: Review the published T-121 branch, then separately authorize the exact Samsung TTS device matrix if physical evidence is wanted.
changed_paths:
  - android/stage1/README.md
  - android/stage1/app/src/main/AndroidManifest.xml
  - android/stage1/app/src/main/java/org/pueblo98/stage1/MainActivity.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/AndroidTextToSpeechOutput.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/SharedPreferencesSpeechSettingsStore.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/SpeechOutputAdapter.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/SpeechOutputController.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/SpeechRate.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/SpeechSettingsController.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/speech/SpeechSettingsStore.java
  - android/stage1/app/src/main/res/values/strings.xml
  - android/stage1/app/src/test/java/org/pueblo98/stage1/speech/SharedPreferencesSpeechSettingsStoreTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/speech/SpeechOutputControllerTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/speech/SpeechSettingsControllerTest.java
  - docs/01-product/traceability.md
  - docs/02-design/voice-ux.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/task-packets.md
  - docs/README.md
---

# Native spoken readback and speech controls

## Scope and authority

Simon explicitly requested implementation of the first recommended standalone
tablet feature, spoken readback and speech controls, on 2026-09-20. This slice
extends the existing own-app Android shell with explicit read-aloud, Stop
speaking, Repeat, Sound off and preview/apply/restore speech-rate controls. It
does not add automatic speech, document ingestion, a model, network access,
background audio, wake words or physical-device actions.

The branch starts from published C5 checkpoint
`7da7f030fb2beaeb43ddb658707ef5e2a2e6a08b`, which already contains the native
voice shell and local text-scale controls. The clean C5 and voice worktrees and
the dirty primary Obsidian checkout remain untouched.

## What changed

The native shell now exposes explicit **Read request aloud**, **Stop speaking**,
revision-bound **Repeat readback** and persistent **Sound off/on** controls. It
also provides Slower, Normal, Faster and Fastest rate choices. A selected rate
must finish a fixed spoken preview before Apply; the versioned preference store
uses compare-and-set, synchronous commit and independent readback, with one-step
Restore and no automatic retry after an uncertain outcome.

`AndroidTextToSpeechOutput` wraps the platform TTS service and accepts only an
installed locale-compatible voice whose metadata reports no network
requirement. It sends exact explicitly selected text, rejects over-limit input
instead of truncating, uses generation-tagged progress callbacks and creates no
audio file. Missing voice data, start/rate errors and engine loss preserve the
written path. Starting Talk or Type stops output; edit, route loss and lifecycle
exit invalidate stale output and clear the repeat copy. Sound off also stops
active output. The manifest adds only the TTS service package-visibility query,
not a permission.

Pure controller/store tests cover explicit start, exact revision, replacement,
Stop and stale callbacks; repeat invalidation; lifecycle/route loss; all four
rates; listen-before-Apply; Sound persistence; restart/restore; compare-and-set
conflict; corrupt, failed, unknown and mismatched persistence outcomes. The
canonical voice, architecture, privacy, task packet, traceability, milestone
and Android handoff records now state the implemented boundary and unrun gaps.

## Evidence

With JDK 17, API 36 and cached Gradle 9.6/AGP 9.4, the offline clean build and
follow-up suite pass: 55 tests across eight suites, zero failures/errors/skips,
debug APK assembly and lint with zero errors. Lint reports the two inherited
API-version notices only (`targetSdk`/`compileSdk` 36 while API 37 is installed).
The debug runtime classpath reports no dependencies. `aapt2 dump permissions`
reports only `android.permission.RECORD_AUDIO`; source and merged-manifest scans
find no Internet permission, network client or synthesized-audio file route.
The debug APK is v2-signed and has SHA-256
`47a524fb75e30cc229fec9c4c0537b87b314c5d73071f0394f6f04a1911d23dc`.

No Android device, recognizer, microphone or TTS engine was exercised. Audible
output, exact engine/voice selection, its runtime egress/offline behavior,
language data, rate fidelity, Stop latency, audio focus/routes, lifecycle and
TalkBack/keyboard/switch access remain unrun under EVAL-007/009 and RES-06.

## Handoff

The bounded implementation is ready for review on
`feature/t121-spoken-readback`. This mixed code/documentation task is published
as a task branch only; it is not authorized for automatic main integration.
The primary checkout and its unrelated Context Rooms/Obsidian work remain
untouched. Device evidence is a separately authorized follow-up using the exact
T-121 matrix and synthetic text.
