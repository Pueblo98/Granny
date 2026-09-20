---
title: "Perception freshness hardening after intermittent empty map"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, perception, regression]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t101-screen-understanding
next_action: Review local freshness repair; obtain fresh authority before tablet retest
related:
  - 2026-09-20-perception-adverse-fixtures.md
  - ../../../experiments/ui-perception/README.md
  - ../../06-evals/canonical-tasks.md
changed_paths:
  - docs/10-execution/sessions/2026-09-20-perception-freshness.md
  - experiments/ui-perception/README.md
  - experiments/ui-perception/android/app/build.gradle.kts
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/FixtureAccessibilityService.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/NativeSnapshotReader.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/ScreenMap.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/MainActivity.java
  - experiments/ui-perception/android/app/src/test/java/org/pueblo98/granny/perceptionlab/PerceptionTest.java
---

# Local freshness repair, not a clean device-suite claim

## Authority and prior reports

Simon requested continuing the local investigation after reporting that the
Accessibility service was disabled. No ADB, install, permission enabling or
tablet access in this step. Same isolated T-101 lab, EVAL-002/009; no production
manifest, action route, new dependency, provider or acceptance-gate change.

Version 0.2 owner-reported observations, not instrumented measurements:

- Duplicate labels: ambiguous, positive report.
- Missing label: unlabeled controls 1, explicitly confirmed.
- Disabled control: initially zero elements and Text size not-found (failed).
  Baseline subsequently returned 3. On returning to Case 4, clearing and
  inspecting again, Simon reported 3 and Text size unavailable (successful retry).
- Canvas only: zero elements and not-found as expected, positive report.
- Simon confirmed disabling the service afterward. Actual OS grant state was
  not independently queried; no assertion that the app was uninstalled.

Keep the failed attempt in the record. Exact timing, navigation order, physical
conditions, sample counts and tree/cache state are missing. Do not infer a clean
pass rate from conversational confirmations.

## Findings, hypothesis and implementation

Confirmed source gaps: reader accepted cached nodes, silently skipped null
children, and invisible-root propagation could produce a zero-element map.
Capture checked window identity but did not reread semantics after screenshot.
Cache/lifecycle timing is a plausible explanation, **not confirmed tablet cause**.

Android documents cache clearing and node refresh, including false refresh for
obsolete nodes: [service API](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService#clearCache())
and [node API](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo#refresh()).

Version 0.3 clears the cache for each explicit observation, refreshes nodes,
rejects obsolete/invisible roots and missing children, and compares a second
fresh tree after capture. Changed window/content/state/geometry withholds the
image instead of publishing mismatched evidence. No automatic retry, no expected
fixture count supplied to the parser. Equal empty observations remain partial
and explicitly coverage-unknown. They cannot prove an empty visual screen.

DoR/oracle: injected before/after maps independently vary empty/populated state,
enabled state, labels, window, bounds, role and clickability; unchanged maps with
different UUID/time must agree. Existing stale/Stop tests remain. This tests the
comparison contract, not Android IPC/cache implementation. Rollback is previous
lab source/artifact; no personal state migrated. Costs include extra bounded
reads and possible timeout/false refusal, which need device measurement.

## Evidence and handoff

Executed: 29 Python host/configuration tests; 12 JVM tests; offline debug APK
assembly and lint (zero errors, 18 lab warnings); documentation validation,
cockpit freshness, scoped handoff and whitespace checks all passed. The four new
JVM cases exercise semantic stability/mismatch, not actual Android node refresh.
No dependency installation or tablet command was run. Physical reproduction and
retest remain unrun; no claimed fix verification on the tablet. Next authorized
device run should repeat Baseline → Disabled control → Canvas only → Disabled
control with explicit inspection, retaining every zero/unavailable outcome and
testing Stop during capture. No new continuous collection or personal app test.

Self-review under the task-slice/session-lifecycle skills. Task worktree
`/tmp/granny-screen-understanding`; branch `feature/t101-screen-understanding`.
Publish for review only; do not merge this mixed-code PR under docs-only authority.
