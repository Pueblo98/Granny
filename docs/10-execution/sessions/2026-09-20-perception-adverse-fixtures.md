---
title: "Perception adverse fixtures and user-reported baseline smoke"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, perception, evidence]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t101-screen-understanding
next_action: Simon enables the lab service manually and runs duplicate-label inspection first
related:
  - 2026-09-20-perception-tablet-smoke.md
  - ../../../experiments/ui-perception/README.md
  - ../../06-evals/canonical-tasks.md
changed_paths:
  - docs/10-execution/sessions/2026-09-20-perception-adverse-fixtures.md
  - experiments/ui-perception/README.md
  - experiments/ui-perception/android/app/build.gradle.kts
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/MainActivity.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/ScreenMap.java
  - experiments/ui-perception/android/app/src/test/java/org/pueblo98/granny/perceptionlab/PerceptionTest.java
---

# Bounded adverse fixture continuation

## Authority and readiness

Simon said “Ok lets go” after the proposed next step of richer fictional screens
with missing labels and ambiguous controls. Continue the same isolated lab and
supervised tablet test, not arbitrary-app access or production integration.
T-101 perception substep, UC-003/J-002, EVAL-002/009; no gate changes.

DoR: five finite fictional cases, expected results in the linked README; no
new permission/dependency/provider/storage route; original Stop/lifecycle
clearing remains. Only same-package lab update/launch is in scope; user alone
enables Accessibility. Rollback is disabling/removing this separate lab, not
resetting the production app. Expected results never enter the node parser.

## Earlier baseline: user-reported evidence only

On the installed version 0.1 artifact identified in the installation record,
Simon reported:

- Numbered fixture controls visible: “yes i see them”.
- Stop/immediate-Stop sequence stayed cleared: “yeah cleared”. The reply follows
  a combined instruction; individual subcase counts and timing are not known.
- Leaving the app and reopening: “yes no retained observation”.
- Rotation: inspection worked in both configurations; clarification confirmed
  original buttons remained and returned to their original state.
- Disabling the service then inspecting: affirmative reply to the expected
  enable-service message with no screenshot/map.

Five prompted scenario groups have positive owner reports. These are not five
instrumented trials, independent geometry measurements or proof of all lifecycle
races. No raw screenshot, UI dump, personal data or broad log was collected.
Lock behavior, OS retention, battery and egress remain unrun/unmeasured.

## Implementation and prospective oracle

Version 0.2 adds case cycling: baseline, duplicate Text size labels, an unlabeled
drawn button, disabled Text size, and canvas-only text. Native observation
summaries report label lookup and unlabeled count from actual collected nodes.
Lookup now rejects blank/null labels so an unlabeled node cannot become a named
reference. No case grants action authority. Eight JVM cases cover reference
behavior, stale windows, cancellation and geometry; Android execution remains
separate. The case table is the oracle, not a model-generated answer.

## Verification and handoff

- Python host/configuration tests: 29 passed.
- Existing Gradle wrapper with cached toolchain, offline `testDebugUnitTest`,
  `assembleDebug`, `lintDebug`: passed; eight JVM tests, lint zero errors and
  17 warnings (lab copy/icon/SDK warnings, not a production release sign-off).
- Documentation validation and whitespace checks passed. Final session handoff
  and regenerated cockpit checks run before publication.
- Version 2 / `0.2-adverse-fixtures` APK SHA-256:
  `b45980438ebeb7984af4178ebdaf70f07ebec27c8852064c38550f0c88fdc054`.
- Preflight found one USB device, the same `SM-X238U`, with the existing exact
  lab package. No other application content inspected.
- One same-package `adb -d install -r` returned `Success`. The launch command
  returned `Status: ok` but reported delivery to an existing instance and
  `com.android.settings/.SubSettings`, so lab foreground rendering is **not
  confirmed** by that command. User should return to the lab manually; no
  automatic Settings navigation or permission mutation attempted.

New adverse device outcomes remain unrun until Simon reports them. No permission
was enabled automatically, no screen captured by ADB, and no production package
modified. Self-review only. Continue on `feature/t101-screen-understanding` in
`/tmp/granny-screen-understanding`; no main merge or vault synchronization.
