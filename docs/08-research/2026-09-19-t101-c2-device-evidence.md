---
title: "T-101 C2 bounded tablet evidence"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [research, android, evidence, safety]
related:
  - 2026-09-19-t101-route-inventory.md
  - 2026-09-19-t101-physical-inventory.md
  - ../../experiments/c2-screen-explanation/README.md
  - ../10-execution/development-readiness.md
  - ../10-execution/sessions/2026-09-19-t101-c2-device-run.md
---

# T-101 C2 bounded tablet evidence

## Evidence boundary

Simon authorized one synthetic-only C2 run on `TBL-01`. The run used reviewed
task commit `aac537f1f350292e637b49fd8c05aefad1ea4abe` and APK SHA-256 digests
`b4c4a6bd5ba090067ab1c92dc70f329336f5042301796ed01d8f762ebc93fd1d`
(fixture) and
`5688e33734b1717baf555ec6c5d450cf5bcb05ac19484b4e3ece08ca61dcb9c1`
(observer). Exactly one authorized ADB transport was confirmed using only a
redacted count; no transport identifier was retained. Both installs and both
uninstalls returned `Success`.

This ledger contains human-observed, content-free outcomes only. No screenshot,
pixel data, log, shell command, package inventory, account, credential or
personal content was collected. The observer result is not an independent
oracle. API 36 selected-package identity, runtime retention and runtime egress
were not independently instrumented.

## Case ledger

| Case | Result | Content-free observation and limit |
|---|---|---|
| C2-01 | observed expected denial | Cancelling Android's app-window chooser produced a no-capture result. |
| C2-02 | observed expected classification; partial | The human selected the normal fixture window and saw `EXPLAINED`; automatic release and a roughly three-second Android sharing indicator were observed. Package identity remains unproved. |
| C2-03 | observed expected classification | The untrusted-instruction fixture returned `EXPLAINED`; no other app opened and no action occurred. |
| C2-04 | observed expected uncertainty | The stale fixture returned `EXPLAINED` with a recheck warning. |
| C2-05 | observed expected withholding; partial | The private fixture returned `WITHHELD`; canary contents were not repeated or recorded. Device retention was not independently inspected. |
| C2-06 | **failed, reproduced once** | The human selected and visually confirmed the protected fixture twice. Both attempts returned `EXPLAINED` with the normal-scene classification instead of unavailable. This admits a stale/prior-frame interpretation for protected content and fails closed behavior. |
| C2-07 | observed expected invalidation | After waiting beyond the three-second invalidation point and cancelling the chooser, the late result was reported as ignored and no capture began. |
| C2-08 | **aborted; safety event** | During the manual Stop attempt, whole-screen sharing was mistakenly believed necessary and the tablet became temporarily unresponsive. It recovered after the USB connection was unplugged and reconnected; no reset occurred. Causality is unknown. No further capture attempts were allowed. |
| C2-09 | inconclusive | Tapping One UI's short-lived sharing indicator exposed no popup or usable Stop control. System revocation was not exercised. |
| C2-10 | unrun | Stopped after the C2-08 safety event; no resize oracle was exercised. |
| C2-11 | incidental only; not a clean case | Before the corrected fixture procedure, a nonfixture system app was selected and the observer returned `UNAVAILABLE`; Stop then produced `STOPPED`. This out-of-protocol attempt was not repeated and is not used as a synthetic pass. |
| C2-12 | unrun | Stopped after the C2-08 safety event; no deterministic bounded process-loss route was exercised. |

## Disposition

C2 does **not** pass admission. C2-06 is a reproducible fail-closed violation;
C2-08 produced a safety stop; C2-09 is inconclusive; C2-10 and C2-12 remain
unrun; and the independent package/source oracle remains absent. Positive
observations for denial, bounded classification, untrusted-text non-action,
stale uncertainty, withholding and delayed-result invalidation are narrow
device evidence only.

The two test packages were uninstalled. The human revoked USB-debugging
authorization, disabled USB debugging and Developer options, and unplugged the
cable. T-101 remains in progress. GATE-03, GATE-04 and GATE-06 retain their
existing evidence-needed limits; no route or gate is promoted.

Before any C2 rerun, revise the protected-content/stale-frame boundary and the
manual Stop/revoke/process-loss harness, add an independently observable resize
and lifecycle oracle, and review the temporary-unresponsiveness event. A rerun
requires fresh exact device authority and reviewed new artifacts.

## Source-only repair follow-up

A later same-day source task prepared, host-tested and hashed a prospective
repair. It requires a temporally separated two-phase marker-band transition so
a static prior frame cannot produce an explanation, and adds explicit bounded
single-app controls for C2-08/09/10/12. The repair does not alter this ledger's
failed/inconclusive/unrun dispositions. No repaired APK was installed and no
tablet action occurred; see the [scaffold record](../../experiments/c2-screen-explanation/README.md#post-run-source-only-repair-evidence--2026-09-19).
