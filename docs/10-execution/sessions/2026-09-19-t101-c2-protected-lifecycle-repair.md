---
title: "T-101 C2 protected-content and lifecycle repair session"
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
branch: fix/t101-c2-protected-lifecycle
next_action: Review the repair commit, APK digests and temporary-unresponsiveness event; obtain fresh exact device authority before any installation or rerun.
changed_paths:
  - docs/08-research/2026-09-19-t101-c2-device-evidence.md
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
  - experiments/c2-screen-explanation/fixture/src/main/java/org/pueblo98/granny/c2fixture/FixtureActivity.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureService.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureTrialPlan.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/FixtureMarkerInterpreter.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/FrameSample.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/FreshFrameGate.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/LifecycleEvidenceGate.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/MainActivity.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/FreshFrameGateTest.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/LifecycleEvidenceGateTest.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/CaptureTrialPlanTest.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/FixtureMarkerInterpreterTest.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/FrameSampleTest.java
---

# T-101 C2 protected-content and lifecycle repair session

## Scope and authority

After the first bounded device run, Simon said to continue with the exact next
task identified in its handoff: a source-only repair and review of C2's
protected-content/stale-frame boundary and deterministic lifecycle controls.
This authorizes changes to the isolated lab scaffold, pure host tests and
associated repository documentation.

No tablet connection, ADB command, APK installation, MediaProjection consent,
device setting or permission change, personal content, network egress, external
app actuation, T-104 work, rerun, gate promotion, PR or main integration is
authorized by this session.

## Starting evidence and repair criteria

The first `TBL-01` run showed that a `FLAG_SECURE` fixture could surface a
stale/prior normal classification twice. A repair must therefore reject a
static prior frame rather than treating one color sample as fresh. It must also
make Stop/revoke/resize/process-loss trials manually observable without
requesting whole-screen sharing. Host tests may establish deterministic state
logic only; Android behavior remains unverified until a separately authorized
run of newly reviewed artifacts.

## Repair

The fixture now keeps its screen background stable while a centered synthetic
marker band alternates between two scene-specific phases every 750 ms. The
observer samples only that bounded band and requires the same scene in both
phases at least 500 ms apart. A static prior frame, black frame or unknown frame
cannot produce an explanation and instead reaches the bounded unavailable
timeout. This is a prospective repair for the reproduced C2-06 failure, not
device proof that `FLAG_SECURE` now behaves correctly.

The lab surface now provides explicit ten-second, share-one-app-only controls
for C2-08 Stop, C2-09 lock/revoke, C2-10 rotation and C2-12 task removal. Every
instruction says never to share the full display. Trial IDs/timing are
allowlisted. C2-10 accepts resize evidence only after temporal freshness, so an
initial sizing callback cannot be mistaken for the human rotation.

No bitmap, raw frame, content text, log, file, database, network route or new
permission was added. The service retains only transient aggregate color
summaries and one fixed interpretation while a bounded lifecycle trial is open.

## Evidence

The final clean offline Gradle command completed all 92 tasks. Seven pure JUnit
suites pass **29/29** cases with no failures or skips. They cover consent
generation, geometry, trial allowlisting, bounded marker-band sampling,
two-phase freshness, post-freshness resize ordering, fixed interpretation and
private-canary suppression. Lint reports zero errors and only the expected
lab-only version/icon warnings.

Static source scans found no internet, storage, audio, account, accessibility,
WebView, socket, file-output or logging route. `aapt2` reports no fixture
permissions and only `FOREGROUND_SERVICE` plus
`FOREGROUND_SERVICE_MEDIA_PROJECTION` for the observer. Both APKs verify with
APK Signature Scheme v2 and debug certificate SHA-256
`8849d40201dbc7ebb49178c37c93837af8f973f40e3f383748bf7af8ce174f53`:

- fixture SHA-256: `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678`
- observer SHA-256: `a1fe72b66e43a45fc42e30564b54d6cbbc1748adbccd409b335ad08c20cfa1b8`

Repository validation passed: cockpit write/check, documentation validation,
47 documentation-tool tests, handoff coverage against
`origin/feature/t101-c2-scaffold` and `git diff --check`. External links were
not fetched and Obsidian rendering/human review remains unrun.

## Limits and handoff

No ADB command, tablet connection, install, consent prompt or Android runtime
case occurred in this repair session. The new APKs are unrun. Host tests cannot
establish MediaProjection/One UI pixels, protected-content behavior, system
callbacks, Stop visibility, rotation, process loss, retention or egress. The
first device ledger remains failed/inconclusive/unrun exactly as recorded.
T-101 stays in progress and GATE-03/04/06 remain unchanged.
