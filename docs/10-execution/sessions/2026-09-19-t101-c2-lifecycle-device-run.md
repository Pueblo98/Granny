---
title: "T-101 C2 lifecycle verification device session"
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
branch: fix/t101-c2-lifecycle-device-run
next_action: Repair and host-test generation seeding between recreated activities and the process ledger; do not access TBL-01 again without fresh exact authority.
changed_paths:
  - docs/08-research/2026-09-19-t101-c2-device-evidence.md
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
---

# T-101 C2 lifecycle verification device session

## Scope and authority

Simon authorized a bounded lifecycle verification run on `TBL-01` using only
commit `817008aa90b23663c5eef8ed7b42e7706d13ec55` and these APK SHA-256 digests:

- fixture: `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`
- observer: `efc6b8d8e62fd5e413ae9d1e5143bc37fda621d5395b2ae64c1f114b9ae3d576`

The authorization permits Developer options and USB debugging, trusting this
computer, a redacted `adb devices` count, installing only those two artifacts,
and synthetic single-app-window cases C2-08, C2-09, C2-10 and C2-12. It permits
content-free outcome recording, then requires both APKs to be uninstalled and
debugging settings restored.

Full-screen sharing, personal apps/accounts/data, screenshots, unrestricted
shell commands and network egress remain prohibited. The run must stop
immediately on any unresponsiveness.

## Starting checkpoint

Before connection, the isolated branch HEAD exactly matched the authorized
commit and both ignored build artifacts matched the authorized SHA-256 values.
The verified remote is `https://github.com/Pueblo98/Granny.git`. No device
command has run in this session.

## Live checkpoint

Exactly one authorized transport was present; only the redacted count was
displayed. Both APK digests matched before connection, and both bounded installs
returned `Success`. No device identifier, device detail, screenshot, log, shell
output or personal content was retained.

- C2-08: after the authorized single-app trial began, the human used the Lab's
  red Stop control. The observer returned `STOPPED` with no explanation, and
  the human confirmed that the tablet remained responsive. This passes the
  bounded visible-Stop oracle.

- C2-09: after the authorized single-app trial began, the human locked and
  unlocked the tablet. The observer returned `STOPPED — Android ended the
  capture session`; the sharing indicator was gone after unlock and the tablet
  remained responsive. This passes the observable prompt lock-cleanup oracle.
  The content-free result cannot distinguish whether Android's projection
  callback or the explicit screen-off handler won the cleanup race.

- C2-10: the human rotated the tablet once during the authorized single-app
  trial. Sharing remained active through the rotation, then the observer
  returned `EXPLAINED` with the fixed synthetic Wi-Fi-off result and an explicit
  limit stating that a bounded capture resize was observed. The sharing
  indicator was gone after completion and the tablet remained responsive. This
  passes the bounded resize and result-recovery oracle.

- C2-12: removing the observer task caused the sharing indicator to disappear,
  so capture did not outlive the task in this run. However, reopening the Lab
  displayed the stale prior C2-10 `EXPLAINED`/bounded-resize result instead of a
  new task-removal result. C2-12 therefore does **not pass** truthful result-state
  recovery even though projection cleanup was observed. The likely source
  defect is a recreated activity's state-machine generation restarting below
  the process ledger generation, causing new ledger updates to be rejected.

The authorized case set is complete. No further capture trial ran.

## Teardown and disposition

Both exact-package uninstalls returned `Success`. Simon revoked USB debugging
authorization, disabled USB debugging and Developer options, unplugged the
cable and confirmed restoration. No device command ran afterward.

C2-08, C2-09 and C2-10 pass their bounded lifecycle oracles. C2-12 confirms
task-removal projection cleanup but fails truthful result-state recovery. C2
remains disabled/not admitted, T-101 remains in progress and GATE-03/04/06 are
not promoted. The next work is source-only generation repair and host testing;
any tablet rerun requires fresh exact authority.

## Validation

- `python3 scripts/cockpit.py --write` / `--check` — PASS; 52 session records.
- `python3 scripts/validate-docs.py` — PASS with zero errors; 340 external URLs
  were not fetched.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — PASS, 47 tests.
- `python3 scripts/check_handoff.py --base
  origin/fix/t101-c2-lifecycle-state` — PASS.
- `git diff --check` — PASS.

These documentation checks add no Android/runtime, user, policy, legal,
retention or egress proof. Commit, push and exact remote-SHA verification remain
for final handoff.
