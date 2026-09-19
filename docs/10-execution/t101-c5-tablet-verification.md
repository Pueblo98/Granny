---
title: "T-101 C5 — synthetic native text-size verification"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [android, accessibility, verification]
related:
  - sessions/2026-09-20-c5-native-text-scale.md
  - ../06-evals/canonical-tasks.md
  - ../../android/stage1/README.md
---

# T-101 C5 — synthetic native text-size verification

Execution status: **unrun**. This packet is a request for a later, expressly
authorized run. It grants no tablet access. T-101, EVAL-007 and GATE-03/04/06
remain open. C5 does not satisfy the two-external-workflow experiment bar.

## Exact artifact and audit

Final source commit: `9bd5b94f659275183aa74fc99d17e04d53132c41`.

APK SHA-256: `bb7d2c07c1c00becf34c81a0c7a2743adfe56af2af689b849eba1b735123c0fd`.
Only that immutable APK is eligible for this request; rebuilds require hash
review. Package: `org.pueblo98.stage1`; debug APK at
`android/stage1/app/build/outputs/apk/debug/app-debug.apk`.

The inherited manifest declares only `RECORD_AUDIO`; this test does **not**
authorize granting or using it. Do not tap Talk. No INTERNET permission,
network library, analytics, accessibility service, projection service, storage
permission or external-app route is added. The inherited on-device recognizer
is not exercised by these cases. Static inspection is not runtime egress proof.

The only new durable data is `shared_prefs/granny_text_scale.xml`, containing
`text_scale.schema`, `text_scale.version`, `text_scale.current` and optional
`text_scale.previous`. Values are closed enums and counters, not text content.
Backup and transfer exclude all private app domains. No transcript, audio,
account, personal image or message is part of this run.

## Setup, observation and stop conditions

Reference: Simon's SM-X238U, Android 16 / One UI 8.0, build
`BP2A.250605.031.A3.X238UQS5AZE1`. Stop if the configuration differs materially.
Simon performs or supervises every tablet interaction. No unattended commands,
accounts, personal apps, full-screen sharing or screenshots are required.

1. Record the existing font setting, orientation and any authorized temporary
   setup so each can be restored. Do not capture identifying device values.
2. Install only the exact hashed debug APK by Simon's chosen supervised method.
   If another non-fixture installation of this package exists, stop rather than
   replace or erase it. Keep the microphone denied and network state unchanged.
3. If independent preference readback by ADB is authorized, Simon enables USB
   debugging only for this run and selects the one visually confirmed tablet.
   Keep transport identifiers out of the report. Do not enumerate unrelated
   packages, files, accounts or logs.
4. At any unexpected capture/permission prompt, unresponsive UI, inaccessible
   Stop/Cancel/Apply/Restore, wrong-app effect or personal content, stop the case
   and report its number and a content-free failure description. Do not retry
   an unknown effect automatically.

The only optional device-shell observation in scope is this exact command,
with the locally selected authorized transport substituted privately:

```text
adb -s <authorized-tablet> shell run-as org.pueblo98.stage1 cat shared_prefs/granny_text_scale.xml
```

This reads only the synthetic preference record, independently of the app's
status label. Missing file before the first Apply is expected. No `logcat`,
full filesystem dump, broad `dumpsys`, shell mutation or other command is
included. If ADB is not authorized/available, report preference-oracle cases
inconclusive; visual labels alone do not establish persistence.

## Numbered synthetic cases

1. **Preview and cancel.** Open Stage 1 voice shell. Scroll to Granny text size.
   Tap Preview Largest. Only the sample should grow; current app text should
   remain Standard. Read the record (absent on a fresh install). Tap Cancel
   preview at the bottom. Sample returns to current size; no preference write.
2. **Apply and independent readback.** Tap Preview Larger, then Apply previewed
   size. App-owned text grows, status names Larger, and readback must show
   schema 1/current COMFORTABLE/previous DEFAULT/version 1 on a fresh fixture.
   Repeated taps without a new preview must not create another write.
3. **Restart and restore.** Close the fixture through Recents, then reopen it.
   Larger must remain. Readback must still match. Tap Restore previous size;
   Standard returns, current DEFAULT/version 2, previous absent. Repeat Restore
   must be disabled or perform no write. No voice starts on restart.
4. **Rotation and interruption.** Select Preview Largest without Apply. Rotate
   portrait→landscape: retain the sample and pending preview without a write.
   Press Home and return: abandon the preview, preserving the saved size.
   Repeat with lock/unlock. Cancel stays reachable whenever a preview is active.
5. **Combined scaling and reflow.** Only if Settings changes are authorized,
   repeat Standard and Largest previews/Apply/Restore at system font 100%,
   130% and 200% (or record the exact available OEM setting; never infer a
   percent from a slider). Check portrait/landscape and available narrow,
   medium and expanded windows; target 360/600/840dp, report unavailable
   configurations unrun. Essential labels must wrap without horizontal loss.
   Stop/Cancel must stay outside the scrolling area and clear of system bars.
6. **Keyboard and access.** Type only `Synthetic long reading sample for the
   Granny text-size test.` Keep the keyboard open. Apply Larger, then select
   Preview Largest so Cancel/Apply are active and Restore has a prior value.
   Verify all three remain reachable by scrolling/focus. With separately authorized
   TalkBack/keyboard/switch setup, visit and activate every choice; current
   display and selected preview states must be distinguishable, outcome
   announcements truthful, focus usable and no action triggered by focus alone.

Storage corruption, failed disk writes and stale version injection are host
cases only in this request. They are not declared device passes. No natural
language interpretation, microphone, C2 capture or external workflow is tested.

## Teardown and report

Restore Standard; uninstall this synthetic fixture if it was installed for the
run. Remove transferred APK; restore only settings/grants changed during this
run, disable newly enabled debugging/Developer options, revoke the temporary
computer authorization and disconnect. Do not erase unrelated tablet data.

Report APK hash/source commit, pseudonym TBL-01, configuration, cases actually
run, access/font/window profile, expected versus observed enum/version only,
pass/fail/inconclusive per case and teardown completion. Exclude transport IDs,
raw text/audio, screenshots, personal data and broad logs. A host test pass or
successful install is not an Android case pass or capability admission.

## Required authorization text

> I authorize the exact C5 APK and source identified in this packet for the
> numbered synthetic cases I name, on TBL-01 under my supervision. I authorize
> installation and removal of that fixture only. Microphone access, capture,
> accounts, personal data, external apps and network egress are excluded.
> I explicitly select whether temporary USB debugging and the single read-only
> preference command are allowed, and which font/accessibility changes are
> allowed. Restore all setup changes made for this run afterward.

Simon must name allowed cases and optional setup; silence does not authorize
ADB, Settings changes or a broader test. Capability/gate acceptance is a
separate decision after independent review of actual results.
