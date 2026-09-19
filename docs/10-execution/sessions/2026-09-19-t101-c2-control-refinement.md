---
title: "T-101 C2 Stop and resize refinement session"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, android, evidence, session]
related:
  - ../backlog.md
  - ../../08-research/2026-09-19-t101-route-inventory.md
  - ../../../experiments/c2-screen-explanation/README.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: feature/t101-c2-scaffold
next_action: Obtain exact authorization for the reviewed TBL-01 synthetic device matrix, including debugging, two-APK install, per-session projection consent, content-free evidence and teardown.
changed_paths:
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/08-research/2026-09-19-t101-physical-inventory.md
  - docs/01-product/traceability.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureGeometry.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureService.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureSessionStateMachine.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/MainActivity.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/CaptureGeometryTest.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/CaptureSessionStateMachineTest.java
---

# T-101 C2 Stop and resize refinement session

## Scope and authority

Simon authorized the recommended host-only refinement before the tablet phase:
add a deterministic manual control for the Stop-before-consent-result case and
implement safe resizing of the one-frame projection surface. This continues on
the clean isolated `feature/t101-c2-scaffold` worktree from published commit
`45a179114082d81fea165c2e5e80d08ad192ac51`.

This step permits source, pure tests, local build/lint and documentation only.
It does not authorize `adb`, device enumeration/connection, debugging changes,
APK installation, MediaProjection consent, tablet app actuation, personal data,
T-104, gate promotion, PR merge or release.

## Evidence

The observer now exposes a dedicated C2-07 control. It names the outstanding
consent generation, schedules invalidation after three seconds while Android's
chooser remains foreground, and rejects a late grant or cancellation result.
A stale scheduled callback cannot invalidate a replacement generation.

The MediaProjection callback now handles captured-content size changes using
the current official `onCapturedContentResize()` route. Projection creation,
resize callbacks and ImageReader events are serialized on the worker. A valid
change replaces the bounded ImageReader surface, resizes the VirtualDisplay and
closes the prior reader. Nonpositive, over-4096-dimension, over-8,388,608-pixel
or failed allocations stop unavailable without interpreting the resized frame.

The final clean host command executed 92 tasks successfully. Three pure JUnit
suites pass 14/14 cases with no failures, errors or skips. Lint reports zero
errors, four fixture warnings and three observer warnings; the remaining
warnings are the already recorded API/Gradle/icon lab limits. The fixture APK
hash remains
`b4c4a6bd5ba090067ab1c92dc70f329336f5042301796ed01d8f762ebc93fd1d`;
the refined observer APK hash is
`5688e33734b1717baf555ec6c5d450cf5bcb05ac19484b4e3ece08ca61dcb9c1`.
The observer still declares only the two MediaProjection foreground-service
permissions, and its v2 debug signature verifies.

Repository checks pass: cockpit generation/check with 47 records;
documentation validation with 160 Markdown files, 2,306 local links and zero
errors; 47 documentation-tool tests; handoff coverage; manifest/resource XML
and fixture JSON parsing; forbidden-permission/output scans; and Git whitespace
validation. The documentation validator did not fetch its 340 external links,
and cockpit rendering/human review remains unrun. No `adb` command, device
enumeration/connection, install, Android runtime, MediaProjection consent,
capture, app actuation or C2-01–C2-12 case occurred.

## Handoff

Publish this mixed source/docs refinement only to the existing task branch; do
not merge it under documentation-only authority. API 36 selected-package
identity remains unresolved regardless of this refinement. C2-07 and C2-10 are
prepared, not device-proven. T-101 and GATE-03/04/06 remain open.
