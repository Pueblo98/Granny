---
title: "T-101 C2 lifecycle and result-state repair session"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, android, evidence, safety, session]
related:
  - ../../08-research/2026-09-19-t101-c2-device-evidence.md
  - ../backlog.md
  - ../development-readiness.md
  - ../../../experiments/c2-screen-explanation/README.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: fix/t101-c2-lifecycle-state
next_action: Review the published repair commit and exact APK hashes; obtain fresh exact device authority before any TBL-01 connection, install or C2-09/10/12 verification.
changed_paths:
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
  - experiments/c2-screen-explanation/observer/src/main/AndroidManifest.xml
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureService.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/LabSessionLedger.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/MainActivity.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/LabSessionLedgerTest.java
---

# T-101 C2 lifecycle and result-state repair session

## Scope and authority

This source-only task follows the authorized repaired C2 verification and
addresses only its C2-09/10/12 lifecycle/state findings. It does not access the
tablet, grant a permission, install an APK, capture content, use ADB, inspect an
account or personal app, add egress, implement T-104 or promote a gate.

The repair starts from published repaired-run evidence commit
`03c2ed73f93e482ff0a8e866c3f4f17b690e93f3`. The primary checkout and its
dirty/untracked work remain untouched.

## Implemented bounded changes

- Register a runtime screen-off receiver and immediately stop/release the
  projection when Android turns the screen off.
- Set `stopWithTask=false` and explicitly handle `onTaskRemoved()` so removal
  has a content-free result and projection shutdown path.
- Add a process-local generation-guarded ledger containing only fixed lab
  state/result text. Recreated activities recover active/completed state instead
  of displaying `Not started` while capture state differs.
- Add three pure tests for active/result recovery, stale-generation rejection
  and task-removal result recovery.

No frame, marker sample, package identity, projection grant, intent, user
content, file, database record, log or network route is added.

## Host evidence

- Clean offline Gradle build: 92 tasks successful.
- Eight pure JUnit suites: 32/32 cases passed with no failure or skip.
- Android lint: zero errors; eight expected lab-only version/icon warnings.
- Fixture permissions: none.
- Observer permissions: `FOREGROUND_SERVICE` and
  `FOREGROUND_SERVICE_MEDIA_PROJECTION` only.
- Both APKs: APK Signature Scheme v2 verified with debug certificate SHA-256
  `8849d40201dbc7ebb49178c37c93837af8f973f40e3f383748bf7af8ce174f53`.
- Fixture APK SHA-256:
  `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`.
- Observer APK SHA-256:
  `efc6b8d8e62fd5e413ae9d1e5143bc37fda621d5395b2ae64c1f114b9ae3d576`.

## Limits and disposition

No repaired artifact ran on Android in this task. Host tests cannot prove
prompt screen-off/task-removal cleanup, indicator removal, rotation result
recovery, selected-package identity, device retention or egress isolation. The
prior C2-09/10/12 device dispositions remain unchanged. C2 stays disabled/not
admitted, T-101 stays in progress and GATE-03/04/06 are not promoted.

## Validation

- `./gradlew --offline --no-daemon clean :observer:testDebugUnitTest
  :fixture:assembleDebug :observer:assembleDebug lintDebug` — PASS; 92 tasks,
  32/32 unit cases, zero lint errors and eight expected warnings.
- `aapt2 dump permissions` — fixture none; observer only
  `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PROJECTION`.
- `apksigner verify --verbose --print-certs` — PASS for both APKs with v2 and
  the recorded debug certificate.
- `python3 scripts/cockpit.py --write` / `--check` — PASS; 51 session records.
- `python3 scripts/validate-docs.py` — PASS with zero errors; 340 external URLs
  were not fetched.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — PASS, 47 tests.
- `python3 scripts/check_handoff.py --base
  origin/fix/t101-c2-repaired-device-run` — PASS.
- `git diff --check` — PASS.

These host checks do not add Android/device, user, policy, legal, retention or
egress proof. Commit, push and exact remote-SHA verification remain for final
handoff.
