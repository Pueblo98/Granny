---
title: "T-101 C2 generation recovery repair session"
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
branch: fix/t101-c2-generation-recovery
next_action: Review the published generation-recovery commit and exact APK hashes; obtain fresh exact authority before any further TBL-01 access or C2-12 verification.
changed_paths:
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureSessionStateMachine.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/MainActivity.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/CaptureSessionStateMachineTest.java
---

# T-101 C2 generation recovery repair session

## Scope and authority

This source-only repair follows the authorized lifecycle verification at commit
`817008aa90b23663c5eef8ed7b42e7706d13ec55` and its published evidence commit
`ad6d0df23e37941fd1fdb5ca4c1dd90c05dcef43`. It addresses only the stale
C2-10 result displayed after C2-12. No tablet access, ADB command, install,
capture, personal-data inspection, network egress, T-104 work or gate promotion
is authorized or performed.

## Repair

Rotation recreated `MainActivity`, including a fresh consent state machine at
generation zero, while the process-local content-free ledger retained the
current higher generation. The next session therefore looked stale to the
ledger, which refused its active/result updates and left the prior C2-10 text
visible.

The activity now constructs its state machine from the ledger's current
generation. The next explicit request increments above that seed, so its
updates cannot be rejected merely because the activity was recreated. A pure
regression test seeds generation three, verifies that the next request is four
and confirms that generation three cannot be reused.

The repair changes no projection, frame, permission, storage, network or
package-selection behavior.

## Validation and limits

- Clean offline Gradle build: 92 tasks successful.
- Eight pure JUnit suites: 33/33 cases passed with no failure or skip.
- Android lint: zero errors; eight expected lab-only warnings.
- Fixture permissions: none.
- Observer permissions: `FOREGROUND_SERVICE` and
  `FOREGROUND_SERVICE_MEDIA_PROJECTION` only.
- Both APKs: APK Signature Scheme v2 verified with debug certificate SHA-256
  `8849d40201dbc7ebb49178c37c93837af8f973f40e3f383748bf7af8ce174f53`.
- Fixture APK SHA-256:
  `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`.
- Observer APK SHA-256:
  `b5acd8315c6dbeefdabc42f85c5c4560036d9042be6091bb086adafa1f0b5476`.

Host evidence cannot revise C2-12; another device run would need fresh exact
authority. Commit, push and exact remote-SHA verification remain.

- `python3 scripts/cockpit.py --write` / `--check` — PASS; 53 session records.
- `python3 scripts/validate-docs.py` — PASS with zero errors; 340 external URLs
  were not fetched.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — PASS, 47 tests.
- `python3 scripts/check_handoff.py --base
  origin/fix/t101-c2-lifecycle-device-run` — PASS.
- `git diff --check` — PASS.
