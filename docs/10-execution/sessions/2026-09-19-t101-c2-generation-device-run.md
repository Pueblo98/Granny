---
title: "T-101 C2 generation recovery device session"
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
branch: fix/t101-c2-generation-device-run
next_action: Repair and host-test the idle Stop control's state clarity; do not access TBL-01 again without fresh exact authority.
changed_paths:
  - docs/08-research/2026-09-19-t101-c2-device-evidence.md
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
---

# T-101 C2 generation recovery device session

## Scope and authority

Simon authorized a bounded generation-recovery verification on `TBL-01` using
only commit `2ef6c98de65aec9798f686c7669cb4fcaae478a1` and these APK SHA-256
digests:

- fixture: `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`
- observer: `b5acd8315c6dbeefdabc42f85c5c4560036d9042be6091bb086adafa1f0b5476`

The authorization permits Developer options and USB debugging, trusting this
computer, a redacted `adb devices` count, installing only those two artifacts,
and running the synthetic single-app-window sequence C2-10 followed immediately
by C2-12. It permits content-free outcome recording, then requires both APKs to
be uninstalled and debugging settings restored.

Full-screen sharing, personal apps/accounts/data, screenshots, unrestricted
shell commands and network egress remain prohibited. The run must stop
immediately on any unresponsiveness.

## Starting checkpoint

Before connection, the isolated branch HEAD exactly matched the authorized
commit and both ignored build artifacts matched the authorized SHA-256 values.
No device command has run in this session.

## Live checkpoint

Exactly one authorized transport was present; only the redacted count was
displayed. Both reviewed APK installs returned `Success`. No identifier, device
detail, screenshot, log, shell output or personal content was retained.

- C2-10: after one rotation, the observer returned `EXPLAINED` with explicit
  bounded capture-resize evidence and sharing ended. This passes the ordered
  setup case and leaves the higher ledger generation needed for the C2-12
  regression check.
- Persistent UI issue: the red control remains labeled `Stop capture` even when
  no capture is active. This is a state-clarity defect, not a C2-10 oracle
  failure.

- C2-12: in the same process after C2-10 and rotation, removing the observer
  task ended sharing. Reopening the Lab displayed the new `STOPPED` result with
  the limit `No capture continues without the lab task`, not the prior C2-10
  result. This passes the targeted generation-recovery and task-removal oracle.

The authorized case sequence is complete. No further capture case ran.

## Teardown and disposition

Both exact-package uninstalls returned `Success`. Simon revoked USB debugging
authorization, disabled USB debugging and Developer options, unplugged the
cable and confirmed restoration. No device command ran afterward.

The ordered C2-10→C2-12 generation regression passes on this exact synthetic
build/device row. The always-visible `Stop capture` label remains a separate
state-clarity defect. C2 remains disabled/not admitted, T-101 remains in
progress and GATE-03/04/06 are not promoted because selected-package identity,
retention/egress and distribution evidence remain open.

## Validation

- `python3 scripts/cockpit.py --write` / `--check` — PASS; 54 session records.
- `python3 scripts/validate-docs.py` — PASS with zero errors; 340 external URLs
  were not fetched.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — PASS, 47 tests.
- `python3 scripts/check_handoff.py --base
  origin/fix/t101-c2-generation-recovery` — PASS.
- `git diff --check` — PASS.

These checks add no Android/runtime, user, policy, legal, retention or egress
proof. Commit, push and exact remote-SHA verification remain.
