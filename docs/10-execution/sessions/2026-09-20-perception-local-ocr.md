---
title: "Perception local OCR — source prepared, dependency download blocked"
status: draft
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, perception]
record_type: session
session_state: blocked
record_basis: contemporaneous
agent: Codex
branch: feature/t101-screen-understanding
next_action: Resolve pinned JitPack dependency, compile and review OCR before requesting a tablet retest
related:
  - 2026-09-20-perception-v03-retest.md
  - ../../../experiments/ui-perception/README.md
changed_paths:
  - docs/10-execution/sessions/2026-09-20-perception-local-ocr.md
  - docs/10-execution/current-milestone.md
  - experiments/ui-perception/README.md
  - experiments/ui-perception/prepare_model.py
  - experiments/ui-perception/android/settings.gradle.kts
  - experiments/ui-perception/android/app/build.gradle.kts
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/LocalOcr.java
  - experiments/ui-perception/android/app/src/main/java/org/pueblo98/granny/perceptionlab/MainActivity.java
  - experiments/ui-perception/android/app/src/test/java/org/pueblo98/granny/perceptionlab/LocalOcrRequestTest.java
---

# Bounded implementation, not a ready device build

Simon explicitly selected on-device OCR after the v0.3 retest and dependency
discussion. Scope is the separate own-package fictional-screen lab, not Stage 1,
media branches, arbitrary apps or production admission. No device command,
installation, service re-enabling, capture or provider action occurred here.

Added pinned Tesseract4Android 4.9.0, bundled English model, build-time checksum
check and immutable-revision notice/model download script. The worker keeps
observations in memory, stores only non-personal model bytes in no-backup storage,
has one global slot, suppresses late results after Stop and expires delivery at
ten seconds. It cannot guarantee immediate termination of native CPU processing.
UI presents OCR as a separate numbered visual-text supplement, not authoritative
control semantics. It preserves native disabled/ambiguous reference handling.

Model SHA-256: `7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2`.
Model revision: `65727574dfcd264acbb0c3e07860e4e9e9b22185`.
Wrapper source revision: `15c534717b1cb58261b58d4e4c1200c7f81f668c`.
English model and five upstream license texts downloaded and hash-verified.
The chosen wrapper has no downloaded binary yet: dependency verification metadata
must be generated/reviewed once resolution succeeds, before calling the build ready.

## Checks and limitations

- Existing Python lab checks: 29 passed.
- Documentation validation: 0 errors; cockpit write/check and handoff coverage
  passed; documentation-tooling suite: 47 passed; `git diff --check` passed.
- Initial Gradle scripts exposed import/SourceSet errors; corrected in source.
- Online Android build stalled resolving dependencies; interrupted. Direct
  JitPack artifact checks timed out (normal, IPv4 and www endpoints).
- Official GitHub 4.9.0 release lists no binary assets as an alternative.
- Offline build confirms the exact 4.9.0 artifact is absent from the Gradle cache;
  dependency resolution fails before compilation.
- New Java tests cover canceled and one-use result delivery, but are unrun.
- Android compile/unit/lint, native OCR execution, recognition accuracy, memory,
  battery, lifecycle/device cancellation and retention/egress evidence remain unrun.
- No claim of deterministic semantic understanding, production readiness or gate pass.

Next: restore artifact access without substituting an unreviewed mirror; resolve
and checksum dependencies, build/unit/lint, review merged APK permissions/notices,
then request a separately authorized tablet update. Start with Canvas only and
Stop during OCR; preserve failed attempts and misrecognized strings as evidence.
Rollback is the existing v0.3 source/build, without reinstalling anything here.
Task-slice and session-lifecycle skills keep this an isolated, unfinished slice.
No merge/main synchronization or media integration is authorized by this work.
