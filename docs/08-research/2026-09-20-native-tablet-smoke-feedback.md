---
title: "Native tablet smoke test — Simon-reported feedback"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [research, android, voice, evidence]
related:
  - ../10-execution/sessions/2026-09-20-native-voice-continuity.md
  - ../06-evals/evidence-protocol.md
  - ../06-evals/canonical-tasks.md
---

# Native tablet smoke test — Simon-reported feedback

## Decision and hypothesis

Assess whether the integrated T-120/T-121/C5 shell preserves a usable local
request and reversible text sizing. Related PRD-FR-001/002/011/013/016,
PRD-ACC-003, UC-013/J-007 and UC-007/J-006; EVAL-005/006/007/009 and RES-06.
Execution is partial. These observations do not pass an entire eval or gate.

## Method and configuration

Simon manually tested the installed `org.pueblo98.stage1` integration on the
reference Samsung SM-X238U. ADB installation was explicitly authorized and
returned `Success`; no launch or microphone grant was automated. Source
`481b00141b96f152c76e147aaa0c60fb1f418048`, publication `3483f88`, APK SHA-256
`ec0b389a45e202f4243f0257de7c660cebaa974cff1a51a6dc272b7bbf4132ae`.

The prior reference inventory is One UI 8.0 / Android 16,
`BP2A.250605.031.A3.X238UQS5AZE1`, security patch 5 April 2026, Play system
update 1 November 2025. These versions were not re-measured during this run.
Locale, keyboard, recognizer/TTS engine and voice, connectivity, grant choices,
accessibility profile, trial counts, timings and teardown were not reported.
The instructed fixture was `make text larger`; actual spoken words were not
collected. No audio, screenshot, personal transcript, account or device serial
is stored. The duplicated chat report is one report, not an additional trial.

## Observations

| Instructed case | User report | Classification and limit |
| --- | --- | --- |
| 1: choose Larger then Cancel | Works great | Reported successful cancellation; no independent timing or repeated-run data. |
| 2: Apply larger then Restore | Works great | Reported complete reversible own-app effect; exact visual measurements unreported. |
| 3: Read/Stop/Repeat/edit | Speech works; voice and cadence are robotic and poor | Audible output reported, subjective quality failed the user's expectation. Stop/Repeat/edit subcases not individually confirmed. |
| 4: Talk and transcript review | Earlier words sometimes disappear; stops after one sentence; input quality poor | Reported usability failure; exact words, event ordering and frequency unknown. |
| 5: background then reopen | Is great | Reported positive lifecycle case; input/output subcases and Stop latency not independently distinguished. |

No success-rate percentage or latency claim is justified. There are three
positive case-level reports, two voice-quality/usability concerns, and missing
subcase/configuration evidence. None of these establishes retention/egress,
TalkBack, task removal, rotation, C2 identity, or general recognition quality.

## Source findings and follow-through

Root source inspection independently found that `beginListening` cleared the
existing draft and the Activity ended a user turn on every recognizer final.
These are plausible causes, not a measured reconstruction of Simon's run.
The TTS selector sorted voices by locale/name rather than declared quality.

The [repair session](../10-execution/sessions/2026-09-20-native-voice-continuity.md)
owns bounded fixes and host oracles. A later separately authorized comparison
must establish whether the actual tablet improves. Simon remains the approver;
T-101, T-120/T-121 review and GATE-03/04/06 retain their existing gate boundaries.
