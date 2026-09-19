---
title: "T-101 C2 synthetic screen-explanation scaffold"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [android, experiment, synthetic, screen-explanation]
related:
  - ../../docs/08-research/2026-09-19-t101-route-inventory.md
  - ../../docs/06-evals/canonical-tasks.md
  - ../../docs/04-architecture/capability-admission.md
  - ../../docs/10-execution/backlog.md
---

# T-101 C2 synthetic screen-explanation scaffold

Status: **host checks pass; first bounded device run did not pass admission**.

This lab-only Android 16 scaffold prepares the smallest C2 experiment from the
[T-101 route inventory](../../docs/08-research/2026-09-19-t101-route-inventory.md#c2--one-session-screen-explanation).
It is not the Granny application, a production observer or a supported-app
claim. Its first `TBL-01` run produced narrow positive observations plus a
reproducible protected-content failure and an aborted Stop attempt.

## What is here

- `fixture`: a synthetic-only app with normal, untrusted-instruction, stale,
  private-canary and `FLAG_SECURE` scenes. Its asset manifest is the independent
  expected-state oracle for a future run.
- `observer`: a lab-only app that requests one Android MediaProjection session,
  samples at most a 16×16 grid from one in-memory frame, maps only known fixture
  colors to fixed bounded explanations, and releases the projection immediately.
- Fourteen passing pure local JUnit tests for consent/Stop generation handling,
  fail-closed marker classification and private-canary suppression.

The observer cannot OCR, identify arbitrary apps, click, recover, authenticate,
read accessibility trees, contact a model, use a network, save a screenshot or
generalize beyond the five synthetic color markers. A matching fixture marker
is not proof of the selected package or of generic screen understanding.

## Scope and build boundary

| Item | Prepared value | Limit |
|---|---|---|
| Build mode | Synthetic device lab only | Must never ship in a candidate build |
| Packages | `org.pueblo98.granny.c2fixture`, `org.pueblo98.granny.c2observer` | Test-only identifiers |
| SDK | `compileSdk 36`, `targetSdk 36`, `minSdk 36` | Exact Android 16 lab row only |
| Runtime libraries | Android platform APIs only | No Compose, model, analytics, OCR or networking SDK |
| Declared permissions | `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PROJECTION` in observer only | No internet, storage, microphone, account, notification-listener or accessibility permission |
| Retention | One down-sampled in-memory color summary | No bitmap/file/database/log payload |
| Stop | Observer button, foreground-service notification action and Android projection chip/callback | Visibility and latency remain device evidence |
| Outcome | Fixed fixture explanation, withheld, stopped or unavailable | No automated recovery or external action |

Android's official documentation requires per-session user consent, a
`mediaProjection` foreground-service declaration and `onStop()` cleanup. It
also says Android 14+ offers either a single app window or the full display.
The scaffold instructs the operator to select only the fixture window, but API
36 does not provide this app with an independently verified selected-package
identity. That unresolved oracle blocks a successful C2 package/source claim.

Current setup sources, accessed 2026-09-19:

- [Android MediaProjection guide](https://developer.android.com/media/grow/media-projection)
- [MediaProjectionManager reference](https://developer.android.com/reference/android/media/projection/MediaProjectionManager)
- [Android 16 SDK setup](https://developer.android.com/about/versions/16/setup-sdk)
- [Android Gradle Plugin 9.4 compatibility](https://developer.android.com/build/releases/agp-9-4-0-release-notes)
- [Android local unit-test guide](https://developer.android.com/training/testing/local-tests)

## Known scaffold limits

- API 36 MediaProjection does not independently report the selected package to
  this observer. Human chooser confirmation plus a matching fixture marker is
  useful lab context, but it cannot pass the full package/source-identity oracle.
- C2-07's dedicated manual test control rejected the late Android result on
  the first bounded device run.
- The service now handles `onCapturedContentResize()` by replacing both the
  bounded ImageReader surface and virtual-display dimensions. Invalid,
  excessive or failed geometry stops unavailable; successful rotation/resize
  remains unrun device evidence.
- Source syntax and API 36 compilation are verified on the recorded host
  toolchain. Device lifecycle coverage remains incomplete and C2 is not
  admitted.

These are experiment findings and preparation gaps, not reasons to weaken the
oracle or infer support. C2 cannot pass until the relevant gaps are resolved and
the device matrix is actually run.

## Host build evidence — 2026-09-19

After Simon accepted the Android SDK License Agreement and authorized local SDK
installation, the isolated host toolchain used:

- Eclipse Temurin JDK `17.0.20.1+1`; archive SHA-256
  `3808d1d15e3ec6bd5b84057fb5d84c33d8a1536a258146bcea2e603fc726e08e`;
- Gradle `9.6.0`; distribution SHA-256
  `bbaeb2fef8710818cf0e261201dab964c572f92b942812df0c3620d62a529a01`;
- Android command-line tools `22.0`; archive SHA-256
  `4e4c464f145a7512b57d088ac6c278c03c9eea610886b35a5e0804e74eedf583`;
- Android SDK Platform 16 / API 36 revision 2, Build Tools `36.0.0`, and
  Platform-Tools `37.0.1`; and
- Android Gradle Plugin `9.4.0` plus JUnit `4.13.2` from the declared build.

The generated wrapper pins Gradle 9.6.0 and its distribution checksum. The
final clean host command was:

```text
./gradlew --no-daemon clean :observer:testDebugUnitTest \
  :fixture:assembleDebug :observer:assembleDebug lintDebug
```

It completed 92 tasks successfully. The three JUnit suites now pass 14 cases
with no failures or skips. Lint reported zero errors, four fixture warnings and three
observer warnings. The remaining warnings are deliberate lab limits: exact API
36 targeting rather than current API 37, the compatible pinned Gradle version,
and absent production icons. Explicit extraction rules now exclude all app
files from cloud backup and device transfer.

The locally produced, uncommitted debug APKs were signed by the ordinary
Android debug certificate with SHA-256 digest
`8849d40201dbc7ebb49178c37c93837af8f973f40e3f383748bf7af8ce174f53`:

| APK | SHA-256 | Inspected declared permissions |
|---|---|---|
| `fixture-debug.apk` | `b4c4a6bd5ba090067ab1c92dc70f329336f5042301796ed01d8f762ebc93fd1d` | none |
| `observer-debug.apk` | `5688e33734b1717baf555ec6c5d450cf5bcb05ac19484b4e3ece08ca61dcb9c1` | `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PROJECTION` |

`apksigner` verified APK Signature Scheme v2 for both. These artifacts remain
ignored build output in the isolated worktree; neither APK nor signing material
is committed. Successful compilation, lint and pure unit tests are static and
offline-fixture evidence only, not Android runtime or device evidence.

## First bounded device-run matrix — 2026-09-19

The [content-free ledger](../../docs/08-research/2026-09-19-t101-c2-device-evidence.md)
owns the evidence details. No screenshot, pixels, log or personal content was
retained.

| Case | Disposition | Key limit |
|---|---|---|
| C2-01 | expected denial observed | Human-observed result only |
| C2-02 | expected classification observed; partial | Package/source identity unproved |
| C2-03 | expected non-action observed | No external action occurred |
| C2-04 | expected stale warning observed | Human-observed result only |
| C2-05 | expected withholding observed; partial | Device retention not independently inspected |
| C2-06 | **failed twice** | Protected fixture was classified as the prior normal scene |
| C2-07 | expected late-result rejection observed | No capture began |
| C2-08 | **aborted after safety event** | Tablet temporarily unresponsive; causality unknown |
| C2-09 | inconclusive | One UI indicator exposed no usable Stop control |
| C2-10 | unrun | Run stopped after C2-08 |
| C2-11 | incidental only | Nonfixture result failed closed, but protocol was not clean |
| C2-12 | unrun | Run stopped after C2-08 |

The independent device oracle must combine the fixture-owned manifest, a
human-confirmed system chooser selection, Android capture lifecycle state and
a content-free result ledger. The observer's own message is never sufficient.
Package/window identity remains unresolved and is a prospective failure, not a
threshold to relax after running.

## Install and teardown procedure used

The proposed transport is USB ADB on exactly one human-confirmed `TBL-01`.
The first run used separate explicit authority. This procedure is retained as
history and does not authorize a rerun.

After reviewing the recorded commit/APK digests, the run used:

```text
adb devices
adb install --no-streaming -r fixture/build/outputs/apk/debug/fixture-debug.apk
adb install --no-streaming -r observer/build/outputs/apk/debug/observer-debug.apk
```

`adb devices` exposes a transient transport identifier. It may be used only to
confirm exactly one authorized device and must not be copied into Git or the
evidence record. If zero or multiple devices appear, stop. Do not use `-g`,
`adb shell`, screen capture, diagnostic dumps or package/content inspection.
Launch both apps manually from the tablet and grant only the system's one-time
projection consent for the named case.

The teardown used:

```text
adb uninstall org.pueblo98.granny.c2observer
adb uninstall org.pueblo98.granny.c2fixture
```

Then the human owner disables USB debugging and revokes the debugging computer
if those settings were enabled for the run. Teardown deletes only these two
synthetic test packages. Failure to uninstall is recorded; it never authorizes
clearing other apps or resetting the tablet.

## Exact authority required for any rerun

A later run requires revised reviewed artifacts and explicit approval for all
of the following, not a generic "continue":

1. On `TBL-01` only, manually enable Developer options and USB debugging, trust
   the named development computer, run only the reviewed commands above and
   install only the two reviewed APKs.
2. Run C2-01 through C2-12 using only the fixture scenes, with no network,
   cloud, personal accounts/content, accessibility service or other app.
3. Permit only Android's per-session MediaProjection consent; do not grant
   broader permissions or select the full display.
4. Retain only content-free case results, versions, timing and failure labels;
   never screenshots, pixels, canary text or transport identifiers.
5. Uninstall only the two test packages and restore debugging settings as
   described above.

This does not authorize T-104, public distribution, Play contact, accessibility
automation, general app control or promotion of GATE-03/04/06.
