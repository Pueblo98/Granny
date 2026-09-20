---
title: "T-101 screen understanding implementation and prior-work reconciliation"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, perception, evidence]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t101-screen-understanding
next_action: Review the implementation branch; separately authorize a synthetic-only Android lab run before production integration
related:
  - ../backlog.md
  - ../../03-agent/tool-contracts.md
  - ../../06-evals/canonical-tasks.md
changed_paths:
  - .github/workflows/repository-maintenance.yml
  - docs/08-research/2026-09-20-screen-understanding.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/sessions/2026-09-20-screen-understanding.md
  - experiments/ui-perception/README.md
  - experiments/ui-perception/android/app/build.gradle.kts
  - experiments/ui-perception/android/app/src/main/AndroidManifest.xml
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/CaptureFence.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/FixtureAccessibilityService.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/MainActivity.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/NativeSnapshotReader.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/ScreenMap.java
  - experiments/ui-perception/android/app/src/main/res/values/strings.xml
  - experiments/ui-perception/android/app/src/main/res/xml/data_extraction_rules.xml
  - experiments/ui-perception/android/app/src/main/res/xml/perception_service.xml
  - experiments/ui-perception/android/app/src/test/java/org/pueblo98/granny/perceptionlab/PerceptionTest.java
  - experiments/ui-perception/android/build.gradle.kts
  - experiments/ui-perception/android/gradle.properties
  - experiments/ui-perception/android/settings.gradle.kts
  - experiments/ui-perception/evaluate.py
  - experiments/ui-perception/make_fixture.py
  - experiments/ui-perception/perception.py
  - experiments/ui-perception/test_android_contract.py
  - experiments/ui-perception/test_perception.py
---

# Screen understanding implementation

## Authority and scope

Simon requested a goal, reconciliation of already-tested offline features and
other active GitHub sessions, then implementation of missing screen understanding.
This is a T-101 perception substep for UC-003/J-002, PRD-FR-005/012 and
EVAL-002/006/009/010. No production capability or gate is accepted.

Implement in an isolated experiment: structured observations, semantic input,
real local host OCR using the installed Tesseract, numbered image annotations,
bounded target lookup and a read-only Android synthetic-fixture observer.
No device installation/enabling, personal screen collection, provider call,
coordinate execution or new dependency installation is part of this run.

## Reconciliation and ownership

Fresh GitHub inspection found no open PRs; main is eeb1885. PR #44 already
integrated fictional browser screen explanations and numbered guidance. PR #31
integrated bounded C2 device evidence; PR #33 integrated later host-tested capture
safety repairs. T-103 already implements pure fake authority replay. None is a
general screenshot parser or OCR engine.

Unmerged published branches own T-122 setup/capability center, T-123 local draft,
and room-chat OpenRouter integration. The local T-124 media worktree has active
uncommitted native manifest/coordinator changes. Preserve those sources, existing
browser renderer and C2 lab; use fresh origin/main in this dedicated worktree.
GitHub and worktree checkpoints indicate artifacts/ownership, not live presence.

## Definition of Ready

- Outcome: supplied synthetic screen inputs yield a provenance-carrying map,
  numbered overlay, or explicit incomplete/denied/stale result; never an action.
- Interface: experimental versioned observation refines CAP-01/02 concepts;
  bounds are evidence, not semantic identity or permission.
- Data: synthetic only, local processing, explicit artifact output; Android
  fixture observation in memory with Stop/lifecycle clearing and no network.
- Oracle: independently authored target/absence expectations; parser never reads
  the oracle. Actual OCR is measured separately from replayed semantic fixtures.
- Adverse cases: duplicate labels, missing labels, password/protected data,
  changed window/epoch, expired observations, geometry, malformed input, text
  injection, OCR disagreement, cancellation and late callback suppression.
- Rollback: remove isolated experiment; production manifest/shell unchanged.
- Unrun: actual Android permission/semantic/screenshot behavior, arbitrary apps,
  detector/model benchmarks and physical memory/battery/privacy evidence.

## Evidence and handoff

Implemented [host and Android lab](../../../experiments/ui-perception/README.md)
and [research/reconciliation](../../08-research/2026-09-20-screen-understanding.md).
Host processing uses real local OCR, replayed semantics, provenance/conflict
fusion, numbered SVG/HTML, bounded target lookup and explicit partial results.
Native Java service reads only its own fixture after an explicit request,
captures its window once, and displays a cropped numbered image and JSON.
Stop/pause clears memory and invalidates callbacks; no executor/network/export.
Android OCR and production-shell wiring are not implemented.

Checks executed:

- `python3 -m unittest discover -s experiments/ui-perception -p 'test_*.py'`:
  29 host/configuration tests. The CI maintenance job now runs these without
  requiring Tesseract, device access or provider credentials.
- `python3 experiments/ui-perception/evaluate.py /tmp/granny-perception-eval-01`:
  passed actual Tesseract synthetic smoke; three arms × three repeats. Exact
  narrow timings and coverage are in the research note. Local generated review
  artifacts remain in that temporary directory, not versioned personal data.
- Existing Gradle wrapper, Java 17 and cached SDK/AGP, `--offline
  :app:testDebugUnitTest :app:assembleDebug :app:lintDebug`: passed six JVM tests,
  debug APK build and lint (zero errors, 12 warnings: SDK age, lab icon and
  English-only strings). First build exposed unwanted built-in Kotlin resolution;
  matched the existing native shell's Java-only configuration without installing
  dependencies. Source review fixed the required interactive-window flag.
- `python3 -m unittest discover -s scripts -p 'test_*.py'`: 47 passed.
- Documentation validation, regenerated cockpit freshness, handoff coverage and
  whitespace checks: passed on the publication candidate.

Browser review was attempted but the browser tool blocked both local file and
loopback navigation; no visual review pass is claimed. The temporary fictional
artifact server was stopped. Annotation-to-JSON consistency is unit-tested.
No device, arbitrary-app, battery/RAM, OS retention, representative-human or
multimodal/JEV benchmark was run. Platform accessibility permissions remain
broader than the own-package restriction enforced by this lab's code.

Self-review only; no independent reviewer or accepted product gate. Worktree:
`/tmp/granny-screen-understanding`, branch `feature/t101-screen-understanding`.
Mixed code/docs publication requires review; do not merge or synchronize the
primary vault under documentation-only standing authority. Existing primary and
other sessions' uncommitted work was left untouched.
