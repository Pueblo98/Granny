---
title: "T-101 C2 host build-validation session"
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
next_action: Review the published follow-up commit and recorded APK hashes, then separately authorize or reject the exact TBL-01 device matrix; the selected-package oracle remains unresolved.
changed_paths:
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/08-research/2026-09-19-t101-physical-inventory.md
  - docs/01-product/traceability.md
  - docs/04-architecture/capability-admission.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - experiments/c2-screen-explanation/README.md
  - experiments/c2-screen-explanation/fixture/src/main/AndroidManifest.xml
  - experiments/c2-screen-explanation/fixture/src/main/res/xml/data_extraction_rules.xml
  - experiments/c2-screen-explanation/gradle/wrapper/gradle-wrapper.jar
  - experiments/c2-screen-explanation/gradle/wrapper/gradle-wrapper.properties
  - experiments/c2-screen-explanation/gradlew
  - experiments/c2-screen-explanation/gradlew.bat
  - experiments/c2-screen-explanation/observer/src/main/AndroidManifest.xml
  - experiments/c2-screen-explanation/observer/src/main/res/xml/data_extraction_rules.xml
---

# T-101 C2 host build-validation session

## Scope and authority

Simon authorized the next bounded step after publication of the C2 source
scaffold: install the official host toolchain and dependencies, generate and
inspect the Gradle wrapper, and build/test the exact scaffold from commit
`466b92039b77f997e2dec9816048232b9ee2b4c6`.

This is host-only static/offline-fixture evidence. It does not authorize a
tablet connection, ADB/device command, Developer options or USB debugging,
APK installation, MediaProjection consent, permission change, app actuation,
account/personal-data access, T-104, gate promotion, PR merge or release.

## Worktree and starting point

The clean isolated worktree is `/tmp/granny-t101-c2-scaffold` on
`feature/t101-c2-scaffold`, tracking the verified Pueblo98/Granny origin. The
dirty primary checkout remains untouched. The starting scaffold commit and
remote branch SHA both equal `466b92039b77f997e2dec9816048232b9ee2b4c6`.

## Evidence

Simon personally accepted the Android SDK License Agreement before its prompt
was answered. The isolated local toolchain used Temurin `17.0.20.1+1`, Gradle
`9.6.0`, command-line tools `22.0`, Android 16/API 36 revision 2, Build Tools
`36.0.0`, Platform-Tools `37.0.1` and AGP `9.4.0`. Published archive checksums
and the generated wrapper distribution checksum were verified; exact hashes
are recorded in the experiment README.

The final clean wrapper command compiled both debug APKs, ran both pure JUnit
suites and lint. Result: 92 executed tasks; 10 tests, 0 failures, 0 errors and
0 skips; lint 0 errors, 4 fixture warnings and 3 observer warnings. The
remaining warnings are the deliberate API 36 target, compatible pinned Gradle
version and absent lab-app icons. The earlier backup warning was resolved with
explicit rules excluding all files from cloud backup and device transfer.

`apkanalyzer` reports no fixture permission and exactly
`FOREGROUND_SERVICE` plus `FOREGROUND_SERVICE_MEDIA_PROJECTION` for the
observer. `apksigner` verifies v2 signatures for both. APK hashes and the debug
certificate digest are recorded in the README; APKs, build reports, local SDK,
Gradle cache, accepted-license file and debug signing material remain local,
ignored and uncommitted.

No `adb` command, device enumeration, tablet connection, install, Android
runtime, MediaProjection consent, capture, app actuation or C2-01–C2-12 case
occurred. The selected-package oracle, deterministic device Stop-before-consent
control and successful resize handling remain unresolved.

Repository checks also pass: cockpit generation/check with 46 records;
documentation validation with 159 Markdown files, 2,302 local links and zero
errors; 47 documentation-tool tests; handoff coverage; XML and JSON parsing;
wrapper JAR integrity; forbidden-permission/output scans; and Git whitespace
validation. The documentation validator did not fetch its 340 external links,
and cockpit rendering/human review remains unrun.

## Handoff

Publish this follow-up only to `feature/t101-c2-scaffold`; mixed source/docs
main integration remains unauthorized. The next bounded decision is whether to
revise the oracle/test controls before separately authorizing the exact
synthetic `TBL-01` device matrix. T-101 and GATE-03/04/06 remain open.
