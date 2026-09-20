---
title: "Perception v0.3 tablet retest — positive owner-reported sequence"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, perception, evidence]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t101-screen-understanding
next_action: Review the perception PR; define on-device OCR scope and dependency approval separately
related:
  - 2026-09-20-perception-freshness.md
  - ../../../experiments/ui-perception/README.md
changed_paths:
  - docs/10-execution/sessions/2026-09-20-perception-v03-retest.md
  - docs/10-execution/current-milestone.md
  - experiments/ui-perception/README.md
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

## Reported outcomes

The following are Simon's responses to five ordered prompts on the identified
v0.3 build, not agent-observed UI dumps or instrumented timing. Expected values
were stated before each trial. No failed attempts or retries were reported in
this sequence; unreported actions cannot be excluded.

| Case | User-reported result | Narrow classification |
| --- | --- | --- |
| R03-01 Baseline | Confirmed 3 elements and Text size observed-only | Expected semantic result |
| R03-02 Disabled control, without Stop first | Explicitly reported 3 elements and Text size unavailable | Expected disabled-node handling |
| R03-03 Canvas only | Confirmed zero-element/not-found result; separately confirmed the full coverage-unknown warning | Expected partial coverage, not OCR success |
| R03-04 Return from Canvas to Disabled, without Stop first | Explicitly reported 3 elements and Text size unavailable | Expected case-transition result |
| R03-05 Inspect then immediate Stop, wait three seconds | Reported it stops and clears immediately in response to the no-late-result prompt | User-reported cancellation success; latency unmeasured |

All five prompted checks have positive reports. This is one short ordered
sequence, not a broad success-rate estimate. The v0.2 zero-element failure stays
recorded in the freshness note; its cause is unconfirmed and absence in this
sequence does not prove elimination. No claim of race exhaustiveness, box IoU,
custom-app coverage, protected-screen isolation, retention/egress or battery
validation. No gate passed.

Simon subsequently confirmed the Accessibility service was disabled. This is a
user report, not an independent OS-state query. The lab remains installed unless
removed by the user; USB debugging state and uninstall cleanup are not verified.
No device commands were run while recording these results.

Session-lifecycle and evidence-review skills guided scoped publication and the
separation of owner reports from independently measured evidence. Self-review
only. No merge/main synchronization or media-branch integration. The next major
perception gap is Android-side OCR; choosing/installing a runtime dependency and
its data/lifecycle tests requires a separately bounded implementation step.
