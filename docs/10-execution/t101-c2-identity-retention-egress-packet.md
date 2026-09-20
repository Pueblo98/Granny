---
title: "T-101 C2 identity, retention and egress evidence packet"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, synthetic, verification, privacy]
related:
  - t101-c2-local-safety-verification.md
  - ../08-research/2026-09-19-t101-c2-device-evidence.md
  - ../08-research/2026-09-19-t101-route-inventory.md
  - ../04-architecture/capability-admission.md
  - ../06-evals/evidence-protocol.md
  - ../../experiments/c2-screen-explanation/README.md
---

# T-101 C2 identity, retention and egress evidence packet

**Prepared only; no device, account or runtime-network case is authorized or
executed.** This packet narrows the three missing C2 claims. It deliberately
does not ask Simon to rerun the current APKs: they cannot prove selected-package
identity, and source inspection alone cannot prove runtime retention or egress.

## Claim ledger

| Claim | Current evidence | Maximum truthful disposition | Missing evidence |
|---|---|---|---|
| Android stopped/revoked the one projection session and the observer released its local surfaces | Four bounded content-free device runs plus fixture behavior | Positive lifecycle observations on the recorded build/configuration; not admission | Latest source build remains unrun; more importantly, source identity and data boundaries are separate claims |
| The captured window belonged to the selected package | Human chooser selection only; public API 36 `MediaProjection.Callback` exposes Stop, resize and visibility callbacks, not a selected-package identifier | **Unproved and structurally unavailable from the current observer/API contract** | A separately reviewed controlled-fixture origin oracle or an explicitly weaker accepted outcome |
| No captured payload was durably retained by the observer | Static manifest/source: backup/transfer disabled; bounded in-memory `ImageReader`; no file/database payload path found | Strong source evidence for intended design; not runtime proof and not a zero-RAM-remnant claim | Independent before/after app-private durable-store inspection on the exact APK and configuration |
| No captured payload left the observer | No `INTERNET` permission, no network/provider/analytics dependency, no cleartext traffic, package-scoped result broadcast and nonexported capture service | Strong static negative-route evidence for the reviewed APK; not runtime traffic proof | Independently reviewed, per-UID runtime network audit with synthetic canary, zero payload capture and a declared observer blind spot |

Android documents `INTERNET` as the permission that allows applications to open
network sockets. Its absence materially constrains ordinary app networking, but
it is not a substitute for an independent runtime oracle. The Android
MediaProjection callbacks document lifecycle and captured-region changes; they
do not document the selected app's package identity. Sources were accessed
2026-09-20: [network operations](https://developer.android.com/develop/connectivity/network-ops/managing),
[MediaProjection.Callback](https://developer.android.com/reference/android/media/projection/MediaProjection.Callback)
and [MediaProjectionManager](https://developer.android.com/reference/android/media/projection/MediaProjectionManager).

## Required source task before any identity run

The current reviewed artifacts are **no-go for a package-identity claim**. Do
not add a guessed package name from chooser text, task order, pixels or fixture
labels. Prepare a new lab-only source task with all of these properties:

1. The controlled fixture generates a fresh high-entropy challenge for one run,
   renders it visibly in the shared app window and separately commits the same
   challenge plus its fixed fixture package/build identity to a test-owned
   local oracle.
2. The observer reports only a one-way digest and case ID, never the challenge
   or frame. A test harness compares observer digest with the fixture-owned
   commitment after capture has ended.
3. A second fixture and stale/replayed challenge must fail. App switch,
   full-display selection, protected content, Stop and process/task removal must
   also deny or produce unavailable.
4. The claim is only **controlled fixture-origin matched** on the recorded lab
   build. It does not establish that MediaProjection generally reveals the
   selected third-party package, and it cannot be promoted to a candidate route
   without a supported production identity contract.

If that narrower claim is not product-useful, Simon must explicitly revise the
C2 accepted outcome. A lab convention must not silently weaken it.

## Unrun durable-retention procedure

This procedure may be finalized only after the exact APK/source identity is
frozen and a reviewer confirms the inspection command emits app-private file
names, sizes and hashes only—never file contents, frames, canaries, personal
data or device identifiers.

1. Use only a debuggable lab APK and the synthetic fixture. Record a content-free
   digest of the observer's app-private files/databases/preferences/cache before
   capture.
2. Run normal, protected, Stop-during-capture and task-removal cases using a
   fresh synthetic visual canary each time.
3. After terminal cleanup, process death and one cold restart, record the same
   metadata-only digest. Search app-private durable bytes for only the test-owned
   canary digest using an offline harness whose source is reviewed first.
4. Pass only when no new payload-bearing durable artifact or canary match
   exists. Expected configuration/preferences and content-free case status must
   be allowlisted by exact schema. Unexpected files, inspection failure or an
   unreadable location are **inconclusive/fail closed**, not a pass.
5. Teardown removes only the two lab packages under fresh device authority.

This can support “no durable app-owned captured payload found by the bounded
inspection.” It cannot support “all memory was erased” or “the OS/provider
retained nothing.” A separate memory-forensics claim is out of scope.

## Unrun egress procedure and prerequisite

Before device execution, create and review a small local audit harness that:

- attributes connection attempts to the observer UID without granting it a VPN,
  accessibility, notification-listener or certificate-install privilege;
- records only direction, transport class, byte count and case-relative time;
  it must not store packet payloads, hostnames, IP addresses, SSIDs or other
  applications' traffic;
- has a proven positive-control fixture on the same controlled network and a
  documented blind-spot test for DNS, IPv4/IPv6, QUIC/UDP and delegated/system
  traffic; and
- observes normal, protected, Stop, revoke, task-removal and idle-after-restart
  windows on the exact reviewed observer build.

Pass requires zero observer-attributed network attempts/bytes in every window,
working positive controls and no instrumentation gap. Any attributed activity,
observer ambiguity or missing transport coverage fails closed. The maximum
claim is “no observer-UID egress observed by this harness on this configuration.”
It does not prove that another process, OS component or future build cannot
transmit data.

## Review gate before a future run

A future execution packet must name exact source/APK hashes, tablet build,
fixture and harness versions; include independent reviewer sign-off on the
fixture-origin protocol and metadata-only inspections; enumerate commands and
fields; and receive fresh case-specific device authority. It must keep the
existing prohibition on personal apps/data, screenshots, logcat, broad packet
capture, full-display sharing and automatic permission changes.

Until those prerequisites exist, C2 remains **not admitted**. The existing
[local safety packet](t101-c2-local-safety-verification.md) may still verify its
narrow lifecycle repair if separately authorized, but it must not be reported
as package-identity, retention or egress evidence.
