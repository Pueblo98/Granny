---
title: "T-101 C2 local safety verification packet"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, synthetic, verification]
related:
  - sessions/2026-09-20-android-c2-local-safety-sprint.md
  - ../08-research/2026-09-19-t101-c2-device-evidence.md
  - ../06-evals/canonical-tasks.md
  - ../../experiments/c2-screen-explanation/README.md
---

# T-101 C2 local safety verification packet

**Prepared only; all cases below are unrun.** This packet checks the source-only
idle Stop repair and the new single-session lifecycle boundary. It does not
establish selected-package identity, runtime retention/egress, C2 admission or
full EVAL-002/006 completion. Simon performs or supervises every tablet action.

## Reviewed artifact

These exact source and APK identities passed host build and independent source
review. They have not been installed or run on the tablet.

| Artifact | Exact source / SHA-256 |
|---|---|
| Source | `e83ee9578b6ca16b5711efc941ff1921add80d11` |
| Fixture APK | `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678` |
| Observer APK | `f5f902dd7359cfe282f51af7b3fdce4b928ef0fb4cfadcbfa596822c0cc74b13` |

Use the APKs under the root sprint worktree's
`experiments/c2-screen-explanation/{fixture,observer}/build/outputs/apk/debug/`.
APK files and signing material are ignored local outputs, never Git artifacts.

## Scope and independent observations

Only `TBL-01`: Samsung SM-X238U, One UI 8.0, Android 16,
`BP2A.250605.031.A3.X238UQS5AZE1`, security patch 5 April 2026,
Google Play system update 1 November 2025. These are Simon-reported reference
values; this sprint has not queried the tablet. Stop if configuration differs.

Fixture manifest declares no permissions. Observer declares only
`FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PROJECTION`. Neither declares
internet, microphone, storage, contacts, accounts or accessibility access. Both
disable backup and cleartext traffic. Binary permission inspection and APK signature verification pass.
No provider, analytics, WebView or network SDK is added. Manifest/source evidence
is static: it does not independently prove runtime memory erasure or egress.

The human compares fixture-owned scenes with fixed observer outcomes and checks
Android's sharing indicator independently of observer text. An observer label
alone cannot establish cleanup. Human chooser selection is context, not an
independent package-identity oracle. No screenshot, logs, memory dump, packet
capture, personal data or transport identifier is collected.

## Allowed setup and safety stop

After exact approval only, Simon may temporarily enable Developer options and
USB debugging, connect the named development computer and approve its debugging
prompt. A supervised operator may run only `adb devices` to confirm exactly one
authorized tablet (retain count only) and these installs, using the reviewed
local APK paths:

```text
adb install --no-streaming -r fixture/build/outputs/apk/debug/fixture-debug.apk
adb install --no-streaming -r observer/build/outputs/apk/debug/observer-debug.apk
```

No `adb shell`, automatic taps, permission auto-grant, logcat, screenshot,
screen recording, accounts, personal apps or full-display sharing is allowed.
Leave existing network and accessibility settings unchanged; no new grant other
than per-case single-app projection consent. Open the two labs manually.

**Stop the run once if the tablet becomes unresponsive, a personal/nonfixture
window or full display is selected, sharing persists beyond the bounded trial
without a working Stop, protected content is explained, or any unexpected app,
permission or data appears.** Cancel the chooser or use an available system Stop
sharing control; if needed lock the screen and let Simon recover the tablet.
Do not continue or reset it. Report the case and content-free failure only.

## Numbered synthetic cases

Each case gets one attempt unless an explicit repeat is listed. Record expected,
unexpected, inconclusive or not executed; do not turn missing observations into
passes. A very brief intermediate state may be unobservable manually.

1. **Idle and denied consent.** Open C2 Screen Explanation Lab. Confirm the Stop
   control is disabled and says `No capture to stop`. Tap `2. Choose fixture app
   window`, then cancel Android's chooser. Confirm no sharing indicator appears,
   a no-capture result is shown, and a fresh request remains possible.
2. **Single active session and visible Stop.** Tap `1. Open synthetic fixture`,
   tap `normal`, then return to the Lab using Recents. Tap the C2-08
   ten-second Stop trial. In Android's chooser select Share one app and only
   C2 Synthetic Screen Fixture. After two seconds return to the Lab. Confirm
   new trial/start controls cannot launch another chooser while this session is
   active. Tap red Stop once. Expect a Stop-requested state until completion,
   then `STOPPED`, no explanation, disabled idle Stop and no sharing indicator.
   Record the indicator ending separately from the Lab result, and report any
   explanation appearing after Stop. If intermediate Stop-requested state is
   too brief, record it unobserved. Immediately tap a fresh C2-08 request after
   completion: it must either run as a new session (Stop it again) or refuse
   with a terminal unavailable result, never remain stuck active. Record this
   second attempt separately; manual speed is not a deterministic race oracle.
3. **Recreation and a fresh subsequent request.** Run C2-10 on the normal fixture,
   select only its app window, wait two seconds, rotate once and wait up to
   fourteen seconds. Return to the Lab: expect a recoverable bounded-resize
   result and sharing ended. Now run C2-08 and Stop it as in case 2. Expect the
   new Stop result, never the previous resize result; no automatic restart.
4. **Task removal after recreation.** In the same process after case 3, run C2-12
   on the normal fixture. Two seconds after sharing starts, open Recents and
   remove only the C2 Screen Explanation Lab task. Confirm sharing ends. Reopen
   the Lab: expect the new `STOPPED` task-removal result and idle Stop state,
   never the previous case's result. Do not remove any personal app task.
5. **Lock cleanup.** Run C2-09 on the normal fixture, sharing only its window.
   Wait two seconds and lock once. Unlock manually and return to the Lab.
   Expect sharing ended, a Stop result, no resumed capture and idle Stop.
   Do not report unlock credentials or infer which callback ended sharing.
6. **Invalidated and recreated chooser.** Tap the C2-07 control and wait at least
   three seconds in Android's chooser before cancelling. Expect late consent
   ignored and no sharing. Repeat once, rotating while the chooser is open,
   then cancel. Expect safe cancellation/unavailable and no automatic capture;
   a fresh explicit request must remain possible. Record any stuck request state
   or second chooser while requesting. Rotation here checks recreation and
   cancellation only: it does not prove the three-second timer survived.
7. **Protected regression.** Select the normal fixture and perform one standard
   check; confirm only a fixed fixture explanation and sharing ends. Open the
   fixture, tap `secure`, return to the Lab and run a standard
   check selecting only that fixture window. Expect `UNAVAILABLE`, no prior
   normal explanation and sharing ended within the bounded timeout.

TalkBack, keyboard, 200% system-font reflow, deliberate service/process kill,
precisely scheduled Stop-before-service races and independent runtime memory/
network instrumentation are **not executed by this packet**. They need their
own controlled procedure or instrumentation; do not infer them from these taps.

## Teardown and evidence to report

After stopping sharing, uninstall only the two synthetic packages:

```text
adb uninstall org.pueblo98.granny.c2observer
adb uninstall org.pueblo98.granny.c2fixture
```

Simon revokes this computer's debugging authorization, disables USB debugging
and Developer options if enabled for this run, and disconnects the cable.
Record uninstall failures without clearing other apps or resetting the tablet.

Report only case number, attempt number, terminal category, fixed outcome code,
whether sharing ended, whether a new chooser was wrongly available, whether an
old result reappeared, any approximate elapsed seconds, missing observations,
interventions and restoration complete/incomplete. Never report fixture canary
text, personal content, screenshots or transport identifiers.

## Exact authorization text

For exactly the reviewed identities above, the requested authorization is:

> I authorize this packet's exact source commit and both listed APK SHA-256
> values on TBL-01 only. I will perform or supervise setup, the seven numbered
> synthetic cases and teardown. I authorize only temporary debugging setup,
> one-device confirmation, installation/removal of these two reviewed packages,
> and per-case single-app projection consent for the synthetic fixture. Retain
> only the listed content-free observations. No shell, screenshots, microphone,
> personal apps/accounts/data, full-screen sharing, network egress or additional
> device commands are authorized. Stop at the stated safety conditions.

Approval applies to this one run, not future builds. Main integration remains
a separate mixed-code decision; no route or gate is accepted by test authority.
