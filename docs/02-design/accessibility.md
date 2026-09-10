---
title: Accessibility Specification
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - design
  - accessibility
related:
  - design-system.md
  - voice-ux.md
  - ../01-product/personas.md
---

# Accessibility Specification

Accessibility is a product and architecture constraint from the first prototype. The product must not assume disability or cognitive impairment merely because a user is older.

## Requirements

- Provide touch alternatives for voice tasks and visual alternatives for audio-only status.
- Preserve semantic labels, roles, order, focus, and state for screen readers and agent inspection.
- Support text scaling and reflow without clipping or hiding actions.
- Use strong contrast and never encode meaning by color alone.
- Use forgiving, separated touch targets and avoid precision gestures for essential actions.
- Keep layouts, language, and control placement predictable.
- Give enough time to read, hear, decide, and respond; avoid surprise timeouts.
- Offer replay, repeat, slower speech, captions/transcripts, and volume controls.
- Minimize memory burden: keep relevant names, choices, and consequences visible.
- Prevent errors, explain specific recovery, and preserve user-entered work.
- Honor reduced-motion preferences and avoid unnecessary animation.

## Proposed internal targets—not accepted standards

The planning conversation suggested exploring controls at least 56 dp, primary actions around 64–80 dp, body text around 20 sp, important information at 24–32 sp, and headings at 32–48 sp. These are design hypotheses to test on the physical tablet; they are not requirements copied from platform guidance and must not be accepted without layout and user validation.

Before implementation, verify current Android and WCAG requirements from primary sources and document the supported conformance target. Do not rely on historical figures copied from the planning conversation.

## Test matrix

Test at minimum: font scaling, display scaling, high contrast, TalkBack, hearing without audio cues, use without voice, reduced dexterity, one-handed reach, ambient noise, slow responses, interruption, changed app layouts, offline states, and fatigue. Include representative older adults in observed testing.

## Open questions

- Which accessibility profiles must V1 support and on which Android versions?
- What numeric targets exceed platform minimums without making workflows inefficient?
- Which speech rates, voices, languages, captions, and hearing-device integrations matter initially?
- How will the agent distinguish access preference from inferred health status? It should not diagnose.
