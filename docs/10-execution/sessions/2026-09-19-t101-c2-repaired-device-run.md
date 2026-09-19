---
title: "T-101 C2 repaired tablet verification session"
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
branch: fix/t101-c2-repaired-device-run
next_action: Prepare a separately reviewed source-only repair for C2-09/10/12 lifecycle cleanup and content-free state/result recovery; do not rerun the current artifacts or access the tablet without fresh exact authorization.
changed_paths:
  - docs/08-research/2026-09-19-t101-c2-device-evidence.md
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/cockpit-snapshot.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
---

# T-101 C2 repaired tablet verification session

## Scope and authority

Simon authorized a fresh repaired C2 verification run on `TBL-01` using only
commit `8481cd58624f203076c6d8ce4cb8accd578135c9` and these reviewed APK
SHA-256 digests:

- fixture: `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`
- observer: `a1fe72b66e43a45fc42e30564b54d6cbbc1748adbccd409b335ad08c20cfa1b8`

The authorization permits Developer options and USB debugging, redacted
`adb devices`, installing only those two artifacts, and synthetic
single-app-window cases C2-02–06 and C2-08/09/10/12. It requires immediate
stop on any unresponsiveness, exact-package uninstall and restoration of
debugging settings.

Full-screen sharing, personal apps/accounts/data, screenshots, raw captured
content, transport identifiers in evidence, shell commands, network egress,
other packages, T-104 and gate promotion remain prohibited. No unauthorized
case will be substituted if a bounded manual oracle is unavailable.

## Starting state

No device command has run in this session. The repaired APKs passed 29 pure
host tests, clean assembly, lint, permission inspection and v2 signature
verification, but have never been installed. Host evidence does not change the
first run's failed/inconclusive/unrun dispositions.

## Live checkpoint

Exactly one authorized transport was present; only the count was displayed.
Both repaired APK digests matched the authorized values and both installs
returned `Success`.

- C2-02: the human selected only the normal synthetic fixture app window. The
  repaired observer returned `EXPLAINED`. This is provisional content-free
  evidence that the temporal marker path admitted a current normal fixture;
  it is not package/source identity proof.
- C2-03: the human selected the untrusted-instruction fixture window. The
  observer returned `EXPLAINED`; no other app opened and no action occurred.
- C2-04: the human selected the stale fixture window. The observer returned
  `EXPLAINED` with the required recheck-current-screen warning.
- C2-05: the human selected the private-canary fixture window. The observer
  returned `WITHHELD`; no fixture or canary content is recorded.
- C2-06 first repaired attempt: the human visually confirmed the protected
  fixture, selected only its app window and reported `UNAVAILABLE`. No prior
  scene was classified. One controlled normal-to-protected repeat remains.
- C2-06 controlled repeat: the human displayed normal, then switched to and
  visually confirmed the protected fixture before selecting only its app
  window. The observer again returned `UNAVAILABLE`. The repaired fixture now
  passes this bounded stale-prior-frame regression twice on `TBL-01`.
- C2-08: using the dedicated ten-second single-app trial, the human waited,
  returned to the observer and pressed its red Stop control. The observer
  returned `STOPPED`, and the human confirmed the tablet remained responsive.
- C2-09: after the dedicated single-app trial began, the human locked and
  unlocked the tablet. The Android sharing indicator was still visible after
  unlock and no immediate observer result appeared. A later `STOPPED` result
  said Android ended the session, but it appeared only around a manual stop and
  its trigger/timing is ambiguous. The lock oracle therefore does **not pass**;
  eventual cleanup was observed but prompt lock-triggered cleanup was not.
- C2-10: the human used the dedicated single-app trial, waited and rotated the
  tablet once. Sharing ended automatically, but the observer displayed no new
  result after the human returned. Because the required explicit resize
  evidence was absent, the case is **inconclusive**, not passed, and was not
  repeated.
- C2-12: after the dedicated single-app trial began, the human removed only
  the observer task. The Android sharing indicator remained visible, while the
  reopened observer showed `Not started`. The case therefore **fails** the
  process-loss oracle: capture outlived the task/UI state. A subsequent manual
  Stop removed the indicator, and the human confirmed the tablet remained
  responsive. No further case was run.

## Teardown and disposition

Both exact-package uninstalls returned `Success`. Simon revoked the computer's
USB debugging authorization, disabled USB debugging and Developer options,
unplugged the cable and reported `TBL-01` responsive. No further device command
ran after teardown.

The repaired run closes only the bounded C2-06 stale-prior-frame regression and
provides positive visible-Stop evidence for C2-08. C2 remains disabled and not
admitted: C2-09 does not pass prompt lock cleanup, C2-10 is inconclusive,
C2-12 fails task-removal containment, selected-package identity is absent and
retention/egress remain uninstrumented. T-101 remains in progress. GATE-03,
GATE-04 and the device/real-data portion of GATE-06 are unchanged.

## Validation

- `python3 scripts/cockpit.py --write` — PASS; snapshot regenerated with 50
  session records.
- `python3 scripts/cockpit.py --check` — PASS; structural check only.
- `python3 scripts/validate-docs.py` — PASS with zero errors; 340 external URLs
  were not fetched.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — PASS, 47 tests.
- `python3 scripts/check_handoff.py --base origin/fix/t101-c2-protected-lifecycle`
  — PASS.
- `git diff --check` — PASS.

These checks do not add Android/runtime, user, policy, legal, retention or
egress proof. Branch publication and exact remote-SHA verification remain for
the final handoff.
