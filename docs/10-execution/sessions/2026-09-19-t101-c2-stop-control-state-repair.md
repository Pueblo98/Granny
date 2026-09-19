---
title: "T-101 C2 Stop-control state repair session"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, android, evidence, accessibility, session]
related:
  - ../../08-research/2026-09-19-t101-c2-device-evidence.md
  - ../backlog.md
  - ../development-readiness.md
  - ../../../experiments/c2-screen-explanation/README.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: fix/t101-c2-stop-control-state
next_action: Review the published Stop-state repair and exact artifacts; tablet verification, if desired, requires fresh exact authority.
changed_paths:
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/MainActivity.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/StopControlState.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/StopControlStateTest.java
---

# T-101 C2 Stop-control state repair session

## Scope and authority

This source-only repair follows Simon's report during the authorized
generation-recovery run that the red control always read `Stop capture`, even
when no capture was active. It changes only local lab control presentation and
pure tests. No tablet access, ADB, install, capture, personal data, network
egress, T-104 work or gate promotion is authorized or performed.

## Repair

- The red control is enabled and labeled `Stop capture` only while the
  process-local ledger reports an active capture.
- Idle, requesting and completed states disable the control and label it
  `No capture to stop`.
- A pressed active control disables immediately as `Stop requested` until the
  service result restores the non-active presentation.
- The broadcast receiver renders the ledger's current content-free state so
  result delivery and control state update together.
- Pure tests cover the active presentation and every non-active ledger phase.

This changes no projection, frame, permission, storage, network, package or
result-classification behavior.

## Validation and limits

- Clean offline Gradle build: 92 tasks successful.
- Nine pure JUnit suites: 36/36 cases passed with no failure or skip.
- Android lint: zero errors; eight expected lab-only warnings.
- Fixture permissions: none.
- Observer permissions: `FOREGROUND_SERVICE` and
  `FOREGROUND_SERVICE_MEDIA_PROJECTION` only.
- Both APKs: APK Signature Scheme v2 verified with debug certificate SHA-256
  `8849d40201dbc7ebb49178c37c93837af8f973f40e3f383748bf7af8ce174f53`.
- Fixture APK SHA-256:
  `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`.
- Observer APK SHA-256:
  `241ec620e8b4f72361f7c011d723a0fb36e441a605477c13cab8ccf510286618`.

Host evidence cannot establish rendered Android behavior; any tablet check
requires fresh exact authority. Commit, push and exact remote-SHA verification
remain.

- `python3 scripts/cockpit.py --write` / `--check` — PASS; 55 session records.
- `python3 scripts/validate-docs.py` — PASS with zero errors; 340 external URLs
  were not fetched.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — PASS, 47 tests.
- `python3 scripts/check_handoff.py --base
  origin/fix/t101-c2-generation-device-run` — PASS.
- `git diff --check` — PASS.
