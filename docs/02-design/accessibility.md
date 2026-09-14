---
title: "Stage 1 Accessibility Specification"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [design, accessibility]
related:
  - product-design-spec.md
  - design-system.md
  - ../06-evals/canonical-tasks.md
---

# Accessibility specification

## Browser design evidence, not native conformance

The [browser prototype checks](browser-prototype.md) exercise HTML controls, Home/confirmation reflow at 360/600/840 CSS pixels including combined 300% review/app text scaling, heading focus and keyboard Escape. CSS pixels are not Android dp. Only the named browser configurations and assertions were checked; no TalkBack, switch, physical dexterity, native system font scaling or participant test is passed. The earlier evidence paragraph below describes the specification milestone. Return-focus restoration, all-screen scale coverage and human comprehension remain outstanding.

Proposed internal baseline for PRD-ACC-001–004 and every [screen](product-design-spec.md). Support is profile-specific and requires device and human evidence. No medical condition is inferred from preferences.

## External evidence, checked 2026-09-13

Android's [app accessibility guidance](https://developer.android.com/guide/topics/ui/accessibility/apps) recommends touch areas at least 48×48dp, meaningful semantic descriptions and contrast based on text size (4.5:1 for smaller text; 3:1 for larger text under its stated thresholds). This is platform guidance, not measured Granny compliance.

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) specifies web success criteria including normal-text contrast 4.5:1, large-text contrast 3:1, non-text contrast 3:1, 200% text resizing, reflow, timing adjustment, keyboard operation and target-size minimum 24×24 CSS pixels with exceptions. Its enhanced target criterion is 44×44 CSS pixels. CSS px, Android dp and sp are not interchangeable. Use WCAG AA as an audit reference for applicable interactions, not a blanket native-app certification or legal conclusion.

W3C's [Resize Text explanation](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) clarifies preserving content/function through resizing. Android guidance plus native assistive-tech tests govern actual implementation. Market-specific legal obligations require the chosen market and specialist review; none are inferred here.

## Internal requirements and tests

| ID | Proposed target beyond/alongside external baseline | Verification |
|---|---|---|
| A11Y-01 | All app text scales to 200%; controls expand/reflow; no clipped action, hidden content or essential horizontal scroll | SCR-001–015 at 1.0/1.3/2.0 font scale, display-size extremes, 360/600/840dp, both orientations; screenshots + manual reading |
| A11Y-02 | Essential text ≥7:1 including buttons/status; supporting text ≥4.5:1; essential control boundaries/focus ≥3:1; no color-only meaning | Compute sRGB contrast on actual composites; scanner/manual audit; disabled essential explanation retains contrast |
| A11Y-03 | Targets ≥56dp; main/Stop/confirm ≥64dp; distinct adjacent targets ≥12dp apart unless measured layout exception reviewed | Layout bounds test + dexterity study; dragging never sole interaction |
| A11Y-04 | Native role/name/state/value/action, logical traversal, no duplicate decorative announcements; focus restored | TalkBack and keyboard walkthrough for all journeys; assert no autofocus on Send; switch scanning reaches Stop/Cancel |
| A11Y-05 | All core tasks usable with no microphone and no sound; all voice status/confirmations visible | Deny microphone, mute audio, complete same fixtures; human silent-mode test |
| A11Y-06 | Critical content stays until dismissed; authority expiry does not erase readable preview; extended reading never triggers action | Leave every confirmation idle, renew/edit/repeat; check no consent on silence and no data loss within stated session |
| A11Y-07 | Reduced motion static equivalents, no flash effects; essential state independent of motion/haptics | Disable animations/reduced motion; inspect every state; no moving target or pulsing obligation |
| A11Y-08 | Plain adult wording, one question at a time, visible chosen recipient/time/content, no forced recall | RES-03 teach-back: user explains effect and stop; note language/access profile and qualitative dignity feedback |
| A11Y-09 | Speech rate and replay controls, private-content speech opt-out, no TalkBack/TTS competition | Audio-focus tests, Bluetooth route/disconnect, hearing/noisy-room study; text persists |
| A11Y-10 | Preference changes predictable and reversible, do not infer cognitive status, no age caricatures | EVAL-007 persistence/restore, RES-06/09 identity testing and copy review |

A11Y IDs are implementation audit items derived from PRD-ACC IDs, not a second product requirement authority.

## Profiles and evidence

Test independent dimensions: enlarged text/low vision; TalkBack; hearing without audio; touch with reduced dexterity; keyboard; switch; reduced motion; noisy room; slow response; low app familiarity. Combine key profiles (large text + keyboard; TalkBack + external control) to detect interference. People choose descriptions and accommodations; record no medical diagnosis in Git.

Prototype metrics target ≥90% completion of supported flows for each supported profile, with zero inaccessible Stop or confirmation controls. Small usability samples cannot establish population rates; report counts and observed obstacles. A profile failing Stop/consent is a release blocker, not averaged away. External Android/app UI limitations must be documented and tested; Granny cannot claim to restyle or repair them.

**Current evidence:** contrast arithmetic for candidate identity pairs only. No physical tablet, assistive-tech, usability or accessibility-conformance test has run. RES-06 / EVAL-007 / GATE-05 and GATE-09 own the next evidence.
