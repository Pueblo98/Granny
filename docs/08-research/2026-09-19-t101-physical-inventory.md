---
title: "T-101 partial manual physical inventory"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [research, android, evidence, hardware]
related:
  - 2026-09-19-t101-route-inventory.md
  - ../07-hardware/reference-hardware.md
  - ../04-architecture/capability-admission.md
  - ../06-evals/evidence-protocol.md
  - ../10-execution/backlog.md
---

# T-101 partial manual physical inventory

## Decision and hypothesis

This record answers the physical-configuration portion of [T-101](../10-execution/backlog.md#t-101) only: identify the supplied stock tablet and enough current settings to bound later synthetic experiments without collecting a unique hardware identifier or personal content. It does not claim that Granny, Android automation or any target app works on this configuration, and it does not advance GATE-03/04/06.

## Method, ethics and environment

On 2026-09-19, Simon manually read visible values from Settings on the supplied tablet and transcribed them to Codex. Codex did not connect to or operate the tablet. No command, ADB, developer setting, USB debugging, install, update, permission change, account access, app actuation, screenshot, recording or personal-content inspection occurred. No raw chat transcript is retained in Git.

The evidence class is **partial manual physical inventory, user-reported and not independently rechecked**. The pseudonymous label is `TBL-01`. Serial number, IMEI, MAC, Android ID, advertising ID, SSID, IP address, account identifiers, contacts, messages, photos and tokens were excluded.

## Primary sources and observations

Samsung's [official Galaxy Tab A11+ 5G listing](https://www.samsung.com/us/tablets/galaxy-tab-a11-plus/buy/galaxy-tab-a11-plus-5g-128gb-gray-sku-sm-x238uzaaatt/), accessed 2026-09-19, maps model `SM-X238U` to the Galaxy Tab A11+ 5G. That source confirms the marketing family only; all current settings below are Simon's manual observations.

| Field | Observed value | Evidence limit |
|---|---|---|
| Device label | `TBL-01` | Locally assigned pseudonym |
| Manufacturer / model | Samsung `SM-X238U`; official listing calls it Galaxy Tab A11+ 5G | Serial and carrier/account identifiers excluded |
| Android release / API | Android 16; API level not directly observed | Do not infer the runtime API in the physical row |
| OEM UI / build | One UI 8.0; `BP2A.250605.031.A3.X238UQS5AZE1` | Manually transcribed, no diagnostic dump |
| Security state | Android security patch 2026-04-05; Google Play system update 2025-11-01 | No update was requested or performed |
| Locale / timezone | English (United States); automatic date/time on; Madrid time displayed | Automatic-time-zone switch and canonical zone ID not directly observed; no location inference |
| Display / font | Font-size slider at midpoint; bold font off; screen zoom 2/5 | Resolution, logical window dp, orientation and exact scale factors unobserved |
| Input | Samsung Keyboard default, English; Google voice typing on with automatic language selection | Typed history and personal dictionary excluded |
| Accessibility | TalkBack off; Link to Windows off; Voice Access off; Live Transcribe and Sound Notifications listed | States of Live Transcribe and Sound Notifications unobserved; no service was toggled |
| Speech support | Google voice typing listed and on | On-device recognizer, offline language pack and recording behavior unobserved; no audio captured |
| Installed app observations | Chrome `138.0.7204.179`; Gmail `2025.07.28.789007522`; Google app `16.35.65.ve.arm64`; Google Photos `7.89.0.968035987`; Google Messages installed, version unobserved | Presence/version only; apps and content were not opened |
| Absent target-app observations | WhatsApp, Spotify and YouTube reported not installed | No install or store contact occurred |
| Synthetic account fixture | Unobserved / not prepared | Personal account state deliberately not inspected |
| Grants / app-ops | Unobserved | No permission or special-access screen was changed |
| Network profile | Unobserved | No SSID, address or account/network detail collected |
| Granny build / adapter | None supplied or inspected | No Android scaffold, APK, adapter, recipe or policy artifact exists for this run |

## Interpretation and decision criterion

The manual inventory removes uncertainty about the physical model family, Android/One UI release, build, patch dates, locale and several access settings. It also shows that the current tablet lacks the proposed WhatsApp and Spotify target apps and has no prepared synthetic account or Granny build. Those facts narrow experiment setup; they do not make an app unsupported, select an install source or authorize installation.

No target app was actuated and no observation/action/postcondition/Stop path ran. The physical row is therefore **partial**, all Step C cases remain **not executed**, and T-101 remains in progress. Configuration changes, app installs/updates or a later independently captured inventory invalidate the affected rows.

## Follow-through

The next useful thesis-risk experiment is the planned one-session scoped screen explanation (`C2`), because it tests one of only two still-plausible external workflow families without requiring personal accounts. Its [lab-only scaffold](../../experiments/c2-screen-explanation/README.md) now compiles and passes 10 host unit cases; the two debug APKs were hashed and statically inspected but not installed or device-executed. It still requires a separate exact device-run authorization for reviewed commit/APK digests, USB/ADB/debugging changes, install/teardown, per-session capture consent and C2-01–C2-12. Until that authority is granted, installs, capture, permission changes, app actuation and runtime network/egress remain prohibited.

The alternative lowest-risk own-app experiment is `C5` text scale, but it does not reduce the accepted two-external-workflow kill risk. `C1`, `C3` external handoff and `C4` additionally need controlled target apps/accounts or providers. Bluetooth control is outside ADR-0009's five T-101 experiments and requires its own later scope.
