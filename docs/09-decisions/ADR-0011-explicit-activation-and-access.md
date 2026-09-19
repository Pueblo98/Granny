---
title: "ADR-0011 — Explicit voice activation and native on-device recognition"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [adr]
related:
  - README.md
  - ../10-execution/open-questions.md
  - ../10-execution/development-readiness.md
---

# ADR-0011 — Explicit voice activation and native on-device recognition


## Context

Stock Android background microphone/service limits and ordinary tablet microphones constrain ambient interaction. Older adults differ in speech preference, hearing, vision and dexterity. “Voice first” must not remove touch agency or depend on future dock hardware.

## Options

| Option | Benefit | Cost / risk |
|---|---|---|
| Always-on wake word | Low initiation effort in ideal conditions | Privacy/battery/background/home-noise feasibility unproven; name/wake acoustics not selected |
| Push-and-hold speech | Clear capture boundary | Sustained dexterity burden and accidental cutoff |
| Tap-to-talk with explicit end/Stop, editable transcript and full touch path | Visible consent, achievable foreground capture, inclusive alternatives | Extra initiation action; users need clear distinction between Stop, mute and pause |

For the first recognizer implementation:

| Option | Benefit | Cost / risk |
|---|---|---|
| Android on-device `SpeechRecognizer` behind a local adapter | No voice egress, platform lifecycle and permission integration, smallest reversible first slice | Availability, locale quality, formatting and partial-result behavior vary by device and installed recognizer |
| Bundled Whisper-class or other ASR model | Consistent local engine and direct model control | APK/model size, heat, memory, latency, licensing and maintenance require device evidence |
| Cloud or realtime speech provider | Potential quality and conversational latency gains | Voice egress, network dependence, provider retention/cost and transcript/interpretation divergence |

For transcript cleanup:

| Option | Benefit | Cost / risk |
|---|---|---|
| Platform formatted/raw hypotheses plus conservative deterministic cleanup | Inspectable, testable and reversible; no model dependency | Less aggressive filler/self-correction handling |
| Small local cleanup language model | More Wispr Flow-like rewriting | Device support and latency unknown; semantic drift can change names, dates, recipients or message meaning |

## Accepted decision

Tap-to-talk for MVP/V1, no always-on wake word. User can stop capture, edit/replace intent or use touch/typing for every supported flow. Barge-in only while an explicitly active capture session actually exists; never promise ambient stop-word availability. Companion/product name may be unified provisionally, but wake-word design is separately evidence-gated and deferred.

The initial Stage 1 recognition route is Android's on-device
`SpeechRecognizer`, created only after a user activates Talk and the runtime
microphone grant exists. The app checks on-device availability and fails to the
typed path; it does not silently fall back to a network recognizer. The
recognizer sits behind a local adapter so a later measured implementation can
replace it without changing the transcript or authorization contracts.

Initial cleanup uses the recognizer's formatted and raw hypotheses when the
implementation supplies both, followed only by deterministic whitespace and
punctuation-spacing normalization. The verbatim final hypothesis remains
available during the active session, the displayed final transcript is
editable, and submission freezes the exact visible revision. No small cleanup
language model, bundled Whisper-class model, cloud transcription, speech-to-
speech provider or transcript-derived action authority is included in the
first slice. Names, numbers, dates, recipients and user-authored message
meaning must never be silently rewritten.

[Accessibility](../02-design/accessibility.md) owns measured external baselines and stronger proposed internal targets: 56dp controls, 64dp main/Stop, 12dp spacing, essential text7:1, other text4.5:1, meaningful UI/focus3:1, 200% text reflow, nonvoice/non-audio access and tested traversal. [Voice](../02-design/voice-ux.md) owns copy/activation behavior. Candidate typography/color stay proposed and require Simon's brand-direction decision.

## Consequences and validation

A microphone denial, unavailable on-device recognizer or unsupported locale still leaves useful full touch flows. No custom dock, hardware privacy light or background microphone guarantee. Capture indicators and local Stop must remain truthful on Android lifecycle loss. Stronger dimensions may require scrolling/reflow rather than dense grids; support in ordinary external apps may be limited and must be disclosed.

T-120 implements the bounded own-app shell and host-testable contract. RES-03/06/09 and EVAL-005/006/007/009/012 still require exact device/provider/locale configuration, quiet/noisy-room recognition, permission/revocation, Stop, lifecycle, access and comprehension evidence. This decision does not pass GATE-05/06/07/09. If actual users cannot activate the control or native recognition cannot meet the measured task need, compare a bundled local ASR route before considering separately consented cloud speech.

## Decision authority and reconsideration

**Accepted by Simon on 2026-09-20** in direct review: use Android native on-device recognition, defer the language-model cleanup layer and proceed with the bounded integration/test plan. Acceptance selects the initial route and interaction baseline; it does not claim that the supplied Samsung configuration has passed recognition, latency, acoustic, accessibility or lifecycle evidence.

Revisit the recognizer adapter after T-120 device evidence or when the supported device/locale matrix changes. A bundled local model remains the next comparison if the native route fails. Cloud speech, ambient activation or semantic transcript rewriting requires a new explicit decision with privacy/provider evidence. No final wake word, public name or typeface is selected here.
