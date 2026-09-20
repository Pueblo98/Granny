---
title: "Native tablet follow-up — repaired voice and accessibility smoke feedback"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [research, android, voice, accessibility, evidence]
related:
  - 2026-09-20-native-tablet-smoke-feedback.md
  - ../10-execution/sessions/2026-09-20-native-voice-continuity.md
  - ../10-execution/backlog.md
  - ../06-evals/evidence-protocol.md
  - ../06-evals/canonical-tasks.md
---

# Native tablet follow-up — repaired voice and accessibility smoke feedback

## Claim and evidence layer

Simon reported completing the requested follow-up walkthrough of the repaired
native shell and the requested tablet accessibility smoke checks on 2026-09-20.
This is **self-reported synthetic-device smoke evidence** on the reference
tablet, not an independently instrumented evaluation, participant study or gate
review. It contributes narrow observations to T-120/T-121, EVAL-005/006/007/009
and RES-06; none of those complete specifications is passed by this report.

## Configuration and privacy boundary

The intended artifact is the installed repaired version-2 package
`org.pueblo98.stage1`, source checkpoint
`0099e6ef0a131df60c15083b3448a24d0e96fd7c`, APK SHA-256
`657738dc424a06b6af3be3adf4cc2799cf4660aa1f7bd8eb6a3ecf630818719a`,
on the Samsung SM-X238U reference tablet. The prior record identifies Android
16 / One UI 8.0, but the OS build, recognizer, TTS engine/voice, locale, network
state, permission state, accessibility services, trial count and timings were
not re-reported for this follow-up. Treat the intended artifact/configuration as
an inference from the immediately preceding authorized install unless those
details are later confirmed.

No raw audio, transcript, screenshot, device identifier or personal content was
provided or retained in Git. The spoken and typed fixtures were not reported.

## Reported observations

| Area reviewed | Simon's report | Supported interpretation and limit |
| --- | --- | --- |
| Repaired voice-input continuity and controls | Follow-up completed; no remaining interaction defect was reported | Positive owner smoke result for the requested repaired flow, including the previously reported lost-draft/premature-stop area. Exact phrases, subcase results, repetitions and timings are absent, so recognition accuracy and Stop latency are not quantified. |
| Spoken readback | Voice is slightly better but still “kind of ehh” | Audible output remains usable enough to inspect, and the local ranking change may have helped, but naturalness/cadence remains below Simon's desired quality. This does not select or authorize cloud TTS. |
| C5 persistence/restart and large-text layout | Works great | Positive smoke observation for the requested app-owned text/access path; exact scale, restart sequence and layout bounds were not recorded. |
| TalkBack, keyboard/switch reachability and microphone-denial fallback | Works great | Positive smoke observation for the requested access paths. Traversal logs, service configuration, device geometry and per-control results were not recorded, so this is not full EVAL-005/007 or RES-06 evidence. |

The owner also reported the integrated browser/frontend walkthrough cohesive and
acceptable for now; that separate design-owner decision is recorded in the
browser handoff and session record rather than treated as tablet evidence here.

## Interpretation and remaining evidence

The repair is no longer blocked by the earlier reported draft-loss and
single-sentence usability defects. Written and typed fallbacks remain mandatory.
Spoken-output naturalness is the only reported dissatisfaction in this follow-up.
Android's installed offline voice can therefore remain the safe baseline while
the product separately compares these options before changing dependencies or
privacy posture:

1. accept the current offline voice as an accessibility aid rather than a
   polished conversational voice;
2. evaluate another installed/offline engine or bundled local model under a new
   dependency, storage, performance and licensing review; or
3. evaluate cloud TTS only after provider terms, consent, egress, retention,
   latency, cost, outage and written-fallback contracts are prepared.

No cloud provider, downloadable voice, network permission or new data flow is
authorized by this evidence. Full device matrices still need named
configuration, case-level results and denominators; representative older-adult
comprehension and preference work remains unrun.
