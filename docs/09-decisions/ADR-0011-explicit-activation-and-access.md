---
title: "ADR-0011 — Propose explicit voice activation and accessible interaction baseline"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [adr]
related:
  - README.md
  - ../10-execution/open-questions.md
  - ../10-execution/development-readiness.md
---

# ADR-0011 — Propose explicit voice activation and accessible interaction baseline


## Context

Stock Android background microphone/service limits and ordinary tablet microphones constrain ambient interaction. Older adults differ in speech preference, hearing, vision and dexterity. “Voice first” must not remove touch agency or depend on future dock hardware.

## Options

| Option | Benefit | Cost / risk |
|---|---|---|
| Always-on wake word | Low initiation effort in ideal conditions | Privacy/battery/background/home-noise feasibility unproven; name/wake acoustics not selected |
| Push-and-hold speech | Clear capture boundary | Sustained dexterity burden and accidental cutoff |
| Tap-to-talk with explicit end/Stop, editable transcript and full touch path | Visible consent, achievable foreground capture, inclusive alternatives | Extra initiation action; users need clear distinction between Stop, mute and pause |

## Proposed decision

Tap-to-talk for MVP/V1, no always-on wake word. User can stop capture, edit/replace intent or use touch/typing for every supported flow. Barge-in only while an explicitly active capture session actually exists; never promise ambient stop-word availability. Companion/product name may be unified provisionally, but wake-word design is separately evidence-gated and deferred.

[Accessibility](../02-design/accessibility.md) owns measured external baselines and stronger proposed internal targets: 56dp controls, 64dp main/Stop, 12dp spacing, essential text7:1, other text4.5:1, meaningful UI/focus3:1, 200% text reflow, nonvoice/non-audio access and tested traversal. [Voice](../02-design/voice-ux.md) owns copy/activation behavior. Candidate typography/color stay proposed and require Simon's brand-direction decision.

## Consequences and validation

A microphone denial still leaves useful full touch flows. No custom dock, hardware privacy light or background microphone guarantee. Capture indicators and local Stop must remain truthful on Android lifecycle loss. Stronger dimensions may require scrolling/reflow rather than dense grids; support in ordinary external apps may be limited and must be disclosed.

RES-03/06/09, EVAL-005/006/007/012; GATE-05/06/09. If actual users cannot activate the control, evaluate accessible alternatives within Stage 1 rather than assume always-on capture. Exact min SDK/font/platform support still requires matrix evidence.

## Authority / reconsideration

**Proposed, not accepted.** Simon chooses the interaction baseline after prototype/access evidence; existing adult dignity/direct-touch/visible-agency instructions remain confirmed. Revisit activation only through privacy/platform/user evidence and a superseding decision. No final wake word, public name or typeface selected.
