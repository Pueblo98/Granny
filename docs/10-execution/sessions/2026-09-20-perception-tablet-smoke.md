---
title: "Perception lab tablet smoke — installation checkpoint"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, perception, evidence]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t101-screen-understanding
next_action: Simon manually enables only the lab service; then test fictional maps and Stop with no personal screens
related:
  - 2026-09-20-screen-understanding.md
  - ../../06-evals/canonical-tasks.md
  - ../../../experiments/ui-perception/README.md
changed_paths:
  - docs/10-execution/sessions/2026-09-20-perception-tablet-smoke.md
---

# Synthetic tablet smoke: installation only

## Scope and authority

After requesting tablet testing, Simon confirmed connection and said “please go
ahead” in response to the explicit offer to install the separate Granny
Perception Lab. Scope: the lab's fictional screen, labels/boxes/annotation,
Stop/lifecycle and unavailable-access behavior. No personal apps/screens,
cloud calls, automatic permission grants or production-app replacement.
Accessibility enabling remains a manual user step. EVAL-002/009 device evidence
is not established by installation alone; no gate is accepted.

## Frozen artifact and observation

- Source commit: `93815d50ff7874dc8e8f49d90a7b16c398826abf`.
- APK SHA-256: `3f3604b762736c94241b4b3394703a7fa795b54cffd091f360772fa366681e65`.
- Package: `org.pueblo98.granny.perceptionlab`, version 1 / `0.1-read-only-lab`.
- Inspected APK: minimum API 34, target API 36, expected launcher; no production
  package replacement. Exactly one authorized USB device was reported.
- Device model `SM-X238U`, Android 16 / API 36; serial omitted.
- Exact-package preflight `pm path` found no existing lab installation.
- One `adb -d install` attempt returned `Success`.
- One `adb -d shell am start -W -n org.pueblo98.granny.perceptionlab/.MainActivity`
  returned `Status: ok`, cold launch, TotalTime 1002 ms / WaitTime 1009 ms.
  Those are activity-launch timings, **not perception latency**.

## Remaining test and cleanup

Installation and activity-start command completed; visible rendering, permission
enabling, correct boxes, capture, Stop, rotation, lock and unavailable-access
cases are **not executed** at this checkpoint. No screenshot, hierarchy dump,
general logcat or personal content was collected. Debugging remains enabled and
the lab remains installed for the supervised continuation. Disable its service
and remove the lab after the agreed tests; revoke debugging when finished.

Independent oracle remains the three fictional labels Screen zoom, Text size
and Dark theme. Canvas text deliberately has no native semantics and must not
be invented by this native-only observer. Record each actual attempt and failure
before making any capability claim. Self-review only; awaiting user interaction.
