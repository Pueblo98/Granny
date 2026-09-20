---
title: "Perception v0.3 tablet retest — installed, functional results pending"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, perception, evidence]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t101-screen-understanding
next_action: Simon manually enables the lab service and reports the first Baseline inspection
related:
  - 2026-09-20-perception-freshness.md
  - ../../../experiments/ui-perception/README.md
changed_paths:
  - docs/10-execution/sessions/2026-09-20-perception-v03-retest.md
---

# Explicit v0.3 device retest

Simon authorized the tablet retest and subsequently confirmed connection.
The initial USB check found no device; after reconnection exactly one authorized
USB device was present. Model `SM-X238U`, API 36; serial not retained. The exact
lab package already existed. No unrelated package inventory/content collected.

Source: `bdabab0cbde69119f83f22107fcfa1dfc3d3d7f2`.
APK: versionCode 3, `0.3-fresh-semantics`, SHA-256
`588737cd2834b31634f022d5427bf751de1b73c29d758d31d1c329639fffd6cb`.
Local manifest inspection confirmed the expected package and minimum API 34.

One same-package `adb -d install -r` returned Success. Explicit launcher command
returned Status ok, cold launch of
`org.pueblo98.granny.perceptionlab/.MainActivity`; TotalTime 984 ms, WaitTime
995 ms are launch timings, not perception latency. No production app, media
branch, permission or provider was changed. Accessibility enabling remains a
manual user action. No screenshot, hierarchy dump or broad log collection.

Prospective sequence: Baseline → Disabled control → Canvas only → Disabled
control, inspecting at each step and recording every failure/refusal before
retry. Baseline expects 3 elements; Disabled control expects 3 and Text size
unavailable; Canvas only expects 0 with coverage unknown. Then exercise Stop
during capture. No expected values enter the parser. End with the service
disabled; uninstall/debugging cleanup remain user-controlled.

Functional outcomes are not executed/reported at this checkpoint. Installation
does not close the prior intermittent Case 4 failure or pass a gate. Self-review
only; maintain this record as user reports arrive. No merge/main synchronization.
