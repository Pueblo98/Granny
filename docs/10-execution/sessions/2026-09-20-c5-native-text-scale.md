---
title: "C5 native Granny text-size slice"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, accessibility]
related:
  - ../backlog.md
  - ../../08-research/2026-09-19-t101-route-inventory.md
  - ../../../android/stage1/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: GPT-6 Astra with Terra implementation and Sol independent review
branch: feature/t101-c5-local-text
artifact_commit: 9bd5b94f659275183aa74fc99d17e04d53132c41
next_action: Review the scoped PR and authorize named synthetic C5 tablet cases; keep external capability gates open.
changed_paths:
  - android/README.md
  - android/stage1/.gitignore
  - android/stage1/README.md
  - android/stage1/app/build.gradle.kts
  - android/stage1/app/src/main/AndroidManifest.xml
  - android/stage1/app/src/main/java/org/pueblo98/stage1/MainActivity.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/readability/SharedPreferencesTextScaleStore.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/readability/TextScale.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/readability/TextScaleController.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/readability/TextScaleStore.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/AndroidOnDeviceVoiceRecognizer.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/TranscriptCleaner.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/TranscriptHypotheses.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/VoiceRecognizerAdapter.java
  - android/stage1/app/src/main/java/org/pueblo98/stage1/voice/VoiceSessionController.java
  - android/stage1/app/src/main/res/drawable/ic_launcher_voice.xml
  - android/stage1/app/src/main/res/values/strings.xml
  - android/stage1/app/src/main/res/xml/data_extraction_rules.xml
  - android/stage1/app/src/test/java/org/pueblo98/stage1/readability/SharedPreferencesTextScaleStoreTest.java
  - android/stage1/app/src/test/java/org/pueblo98/stage1/readability/TextScaleControllerTest.java
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
  - docs/04-architecture/capability-admission.md
  - docs/04-architecture/system-overview.md
  - docs/08-research/android-stage-1-feasibility.md
  - docs/09-decisions/ADR-0011-explicit-activation-and-access.md
  - docs/09-decisions/README.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/sessions/2026-09-20-native-voice-shell.md
  - docs/10-execution/t101-c5-tablet-verification.md
  - docs/10-execution/task-packets.md
  - docs/README.md
---

# C5 native Granny text-size slice

## Scope and authority

Simon asked to continue completing the stock-Android tablet goals after PR #33
merged. This is a bounded source/build/test slice of T-101 C5, not blanket
permission for tablet commands, microphone use, installation or gate admission.
PRD-FR-011, PRD-PRV-002, PRD-ACC-001, UC-007/J-006, SCR-011, CAP-11 and
EVAL-007 own the local preview/apply/restore and persisted preference behavior.
The closed choices are Standard 1.0, Larger 1.15, Larger still 1.3 and Largest
1.5 times base sp, with system font scaling retained.

## Isolation and ownership

Root started from origin/main `6f5896d3628e3b1b6274958aa283f6a372a61d08`.
The native shell was identified on peer branch `feature/t120-native-voice`
at `9340e786ea209be3e4ca26fbc60cce7f1cc15078`. Root cherry-picked only its
source/contract commit `dc3d69a2371e568314f541b1e04d82feaa3fc0cf` as
`96b9dd1`; the only conflict was the generated cockpit, regenerated normally.
The peer's unrelated browser changes are excluded. Its worktree is untouched.

Root owns Activity/resource wiring and scoped documentation in the task
worktree. Terra owns only new readability core/store and their tests in a
separate `feature/t101-c5-readability-core` worktree. Sol reviews read-only.
Neither agent may edit the peer voice worktree. Manifest, Gradle, native voice
adapter/controller and C2 lab sources remain inherited dependencies.

## Readiness and boundaries

The privacy inventory explicitly allows chosen UI preferences in private local
storage until changed/deleted. CAP-11 requires version comparison and readback;
a success callback alone is not an outcome oracle. A preview must not write.
Stop cancels an unapplied preview; it does not silently undo a completed Apply.
Restore is an explicit new local action. Unknown/corrupt storage fails honestly.
No Android/system/third-party setting is changed. No dependency installation,
network route, provider, planner, personal data or extra permission is added.

C2 remains isolated and unadmitted: source tests cannot establish selected
package identity or independent runtime retention/egress. C1/sent-photo has no
admitted route; T-104 does not begin. GATE-03/04/06 remain open.

## Evidence

Final code commit: `9bd5b94f659275183aa74fc99d17e04d53132c41`. Terra core commits
`00d4172459ace837faabc440075aecc6a35207b0` and
`3afb17047ba76f6e8f2ea2bcf9ff37a42b7f8766` were integrated as `5a5858b`
and `5a6c342`. Root Activity/resources are `9bd5b94`.

- Existing voice baseline: 16 host cases, debug assembly, lint passed before
  source edits. Final combined native suite: **32 tests, zero failures/errors/
  skips** (16 voice, 11 preference controller, five preference adapter).
- Native command: `./gradlew --offline --no-daemon :app:testDebugUnitTest
  :app:assembleDebug :app:lintDebug`, run from `android/stage1` with the existing
  JDK 17/API 36 toolchain and cached Gradle dependencies. Final exit 0, 47 tasks.
  Lint: zero errors, two inherited version warnings. No dependencies installed.
- Separate C2 command: `./gradlew --offline --no-daemon
  :observer:testDebugUnitTest :fixture:assembleDebug :observer:assembleDebug
  lintDebug`, run in `experiments/c2-screen-explanation`: **49 host cases**,
  zero failures/errors/skips; both APKs built; lint zero errors/six warnings.
- Native runtime classpath report: no dependencies. Built-manifest inspection
  reports only inherited `android.permission.RECORD_AUDIO`; no new permission.
  Source scan finds no network, system-settings, accessibility-service or
  MediaProjection route in the native app. These are static checks.
- Native APK SHA-256: `bb7d2c07c1c00becf34c81a0c7a2743adfe56af2af689b849eba1b735123c0fd`.
  APK Signature Scheme v2 verification passes. Initial signing-tool invocation
  lacked `java` on PATH; rerun with the existing JDK succeeded.
- Rebuilt C2 fixture SHA-256:
  `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`;
  observer: `52612b9658f2ce1924aa40e68b88b9715d8124b9d56b01a641d507d65f9ec2bd`.
  C2 was regression-built only; neither artifact is authorized for installation.
- Repository tooling suite: **47 tests passed**. Documentation validator:
  219 Markdown files, zero errors after correcting the implementation trace's
  status/source link. Cockpit freshness and handoff coverage pass; diff check
  passes. Earlier missing trace status/artifact checks failed and were fixed.

Sol independently reviewed the controller, adapter, Activity and device packet.
Review fixes cover unknown cached save outcomes, partial/corrupt records,
version overflow, uncertainty surviving reload, accessible selected labels,
preview retention across rotation, cancellation on true background and truthful
control availability. Adapter tests assert a separate fake backing map and
record writes, rather than equating requested values with observed values.
They model SharedPreferences; they do not prove Android filesystem durability.

Root additionally kept Type reachable from the inherited idle/submitted states
and pinned Stop/Cancel outside the scrolling area. System-bar/cutout/IME handling
follows the platform [Views inset guidance](https://developer.android.com/develop/ui/views/layout/edge-to-edge),
reviewed 2026-09-20. No Compose/framework dependency was introduced.

**Unrun:** all actual tablet installation, preference disk/restart oracle,
rotation/background/lock, 100/130/200% system plus up to 1.5 app scaling,
360/600/840dp reflow, IME, TalkBack/keyboard/switch, physical microphone/voice
and independent runtime egress/retention cases. No device commands were run.
The [six-case packet](../t101-c5-tablet-verification.md) contains exact artifact,
setup/teardown, optional single-file readback, stop conditions and authorization.
No runtime EVAL or gate is promoted.

## Handoff

Root worktree: `/home/lgtw/Work/granny-worktrees/t101-c5-local-text`;
Terra worktree: `/home/lgtw/Work/granny-worktrees/t101-c5-readability-core`.
Peer voice branch/worktree and all design work remain untouched. Only the
identified voice source/contract commit is integrated locally, not the entire
peer branch or its browser changes. Main integration remains unapproved for
this new mixed slice. The primary vault remains on the previously synchronized
PR #33 main baseline with user assets/notes preserved.

Push/PR and remote SHA verification are completed at publication handoff.
Next action: review this concrete branch, then authorize named cases in the
[tablet packet](../t101-c5-tablet-verification.md). The test request excludes
microphone, capture, accounts, personal data and external applications.
