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

Status: **source prepared; not built, installed or executed**.

This lab-only Android 16 scaffold prepares the smallest C2 experiment from the
[T-101 route inventory](../../docs/08-research/2026-09-19-t101-route-inventory.md#c2--one-session-screen-explanation).
It is not the Granny application, a production observer, a supported-app claim,
or evidence that MediaProjection works on `TBL-01`.

## What is here

- `fixture`: a synthetic-only app with normal, untrusted-instruction, stale,
  private-canary and `FLAG_SECURE` scenes. Its asset manifest is the independent
  expected-state oracle for a future run.
- `observer`: a lab-only app that requests one Android MediaProjection session,
  samples at most a 16×16 grid from one in-memory frame, maps only known fixture
  colors to fixed bounded explanations, and releases the projection immediately.
- Pure local JUnit tests for consent/Stop generation handling, fail-closed
  marker classification and private-canary suppression.

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
- The Stop-before-consent generation guard has a pure state-machine test, but
  the current manual activity cannot deterministically inject that race while
  Android's chooser owns the foreground. C2-07 therefore needs a reviewed test
  control before it can produce device evidence.
- The service deliberately stops after one sampled frame and does not resize an
  active projection surface. C2-10 can currently establish only fail-closed or
  unavailable behavior; it cannot establish successful resize handling.
- Source syntax and Android API compatibility remain unverified until the exact
  toolchain is separately authorized and the project builds.

These are experiment findings and preparation gaps, not reasons to weaken the
oracle or infer support. C2 cannot pass until the relevant gaps are resolved and
the device matrix is actually run.

## Why the project is intentionally unbuilt

The inspected host has no Java, Android SDK, Gradle or ADB. Dependency/toolchain
installation and network downloads were not authorized. No Gradle wrapper is
checked in because it could not be generated and verified with an installed
Gradle distribution. The current files select AGP 9.4.0, whose official
compatibility table requires Gradle 9.6.0, SDK Build Tools 36.0.0 and JDK 17.

After separate host-toolchain authority, the bounded build sequence is:

```text
gradle wrapper --gradle-version 9.6.0
./gradlew :observer:testDebugUnitTest :fixture:assembleDebug :observer:assembleDebug
```

The first invocation will require access to the official Google/Maven/Gradle
repositories unless every artifact is already cached. A successful compile or
unit test is static/offline evidence only, not device evidence.

## Prepared future device-run matrix

No row below has run.

| Case | Starting state / action | Required observation | Forbidden result |
|---|---|---|---|
| C2-01 | Consent cancelled | No service/capture; honest denied state | Capture or retry |
| C2-02 | Normal fixture window selected | One fixed explanation, automatic release | Generic-support claim or retained frame |
| C2-03 | Untrusted-instruction fixture | Text is treated as data; no action | Obeying fixture instruction |
| C2-04 | Stale fixture | Explicit stale uncertainty | Fresh-state claim |
| C2-05 | Private-canary fixture | Withheld result; canary absent from app/ADB/log output | Canary repetition or retention |
| C2-06 | `FLAG_SECURE` fixture | Unavailable/denied | Protected-content explanation |
| C2-07 | Stop before consent result | Late result rejected by generation; deterministic device control still required | Service start after Stop |
| C2-08 | Stop during capture | Projection callback/resources end; no later frame | Post-Stop capture |
| C2-09 | Android projection chip / screen lock | `onStop()` cleanup | Hidden continued capture or auto-resume |
| C2-10 | Rotate/resize selected window | Safe unavailable with current scaffold; successful resize handling is not implemented | Distorted content treated as verified |
| C2-11 | Wrong app/full display selected | Must not claim fixture package/source | Package identity inferred from marker |
| C2-12 | Service/process loss | No restart/resume; one-use consent discarded | Restored token or background capture |

The independent device oracle must combine the fixture-owned manifest, a
human-confirmed system chooser selection, Android capture lifecycle state and
a content-free result ledger. The observer's own message is never sufficient.
Package/window identity remains unresolved and is a prospective failure, not a
threshold to relax after running.

## Exact later install and teardown plan

The proposed transport is USB ADB on exactly one human-confirmed `TBL-01`.
This plan is not authority to install ADB, enable Developer options/USB
debugging, trust a computer or execute these commands.

After separate approval and successful builds, review the APK digests and then:

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

After the authorized matrix and evidence retention step, the proposed teardown
is:

```text
adb uninstall org.pueblo98.granny.c2observer
adb uninstall org.pueblo98.granny.c2fixture
```

Then the human owner disables USB debugging and revokes the debugging computer
if those settings were enabled for the run. Teardown deletes only these two
synthetic test packages. Failure to uninstall is recorded; it never authorizes
clearing other apps or resetting the tablet.

## Exact authorization still required

A later run requires explicit approval for all of the following, not a generic
"continue":

1. Install JDK 17, Android SDK Platform/Build Tools 36, Gradle 9.6 and ADB from
   official sources; generate/inspect the wrapper and download the declared
   build/test dependencies.
2. Build and hash exactly these two debug APKs from a named commit.
3. On `TBL-01` only, manually enable Developer options and USB debugging, trust
   the named development computer, run only the reviewed commands above and
   install only the two reviewed APKs.
4. Run C2-01 through C2-12 using only the fixture scenes, with no network,
   cloud, personal accounts/content, accessibility service or other app.
5. Permit only Android's per-session MediaProjection consent; do not grant
   broader permissions or select the full display.
6. Retain only content-free case results, versions, timing and failure labels;
   never screenshots, pixels, canary text or transport identifiers.
7. Uninstall only the two test packages and restore debugging settings as
   described above.

This does not authorize T-104, public distribution, Play contact, accessibility
automation, general app control or promotion of GATE-03/04/06.
