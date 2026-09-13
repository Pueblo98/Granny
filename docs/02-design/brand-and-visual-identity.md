---
title: "Brand and Visual Identity Exploration"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [design, brand]
related:
  - naming-exploration.md
  - design-system.md
  - figma.md
  - accessibility.md
---

# Brand and visual identity

Granny is a **temporary codename**, not the final wordmark or assistant persona. [Naming exploration](naming-exploration.md) owns candidates/screening. This document owns brand promise and proposed identity territories. None is accepted or user-validated.

## Foundation

**Purpose:** return practical agency to people who want the outcome of computing without its interface burden.
**Promise:** ask for something useful; understand what happens; stay in charge.
**Central idea:** capability made approachable. The computer takes on the navigation work while the adult remains the author of the task.

Primary audience: independent older adults with differing access needs/preferences; secondary buyer/helper: someone they choose. Buyer communications must respect the adult's primacy. Before a task the intended feeling is “I can start here”; during, “I know what it is doing and can change it”; after, “I know what happened and can get on with my day.” These are emotional goals to test, not findings.

| Personality | Observable product behavior | Anti-trait |
|---|---|---|
| Capable | Verified outcome or precise limitation | Omniscient, overpromising |
| Respectful | Adult language, user choice, no unsolicited oversight | Patronizing, controlling |
| Clear | Named actions, exact previews, readable status | Minimalist ambiguity, technical jargon |
| Warm | Patient pacing and useful recovery | Childish, faux intimacy, artificial affection |
| Steady | Stable layout, predictable stop and errors | Restless, engagement-driven |
| Candid | Distinguishes prepared/sent/unknown | Hiding uncertainty, clinical authority |

Relationship posture: capable companion and respectful tool, never child, nurse, guardian, surveillance service or robot mascot. Do not gender the assistant by default or cast its user as a patient. Reasons to believe must come from the implemented preview/Stop/verification/privacy experience; they cannot be claimed as proven now.

## Positioning and expression

| Alternative category (hypothesis, not tested competitor claim) | Granny's proposed position | Evidence required |
|---|---|---|
| Generic assistant | Bounded everyday tablet outcomes with explicit verification/recovery | Paired task baseline |
| Simplified launcher | Natural intent and guided takeover beyond a simpler grid | Observed interface burden |
| Accessibility tool | Accessible adult experience with chosen input/output; no automatic policy qualification claim | Profile tests and distribution review |
| Caregiver monitoring | User-owned assistance and narrow optional helper proposals | Privacy/consent comprehension |
| Clinical technology | Ordinary life and agency; no diagnosis/medical promise | Tone/imagery review and user interpretation |

App-store/communications working line: “The tablet app you can ask.” Supporting copy must name supported tasks and limitations rather than “controls everything.” Show a real proposed workflow, an exact confirmation and Stop. No fabricated testimonials, success rates, family relief claims or logo usage suggesting approval.

## Emotional and sensory language

First five seconds: a clear place to ask, readable choices, no sign that the user must pass a test. Calm means useful state changes with bounded waits; it does not mean a blank screen. Warmth comes from patient wording, light and spacing; avoid baby-like shapes/voices. Simplicity keeps the goal and escape visible; do not remove meaning-bearing controls. Trust comes from specific behavior, not hospital blue, locks everywhere or sterile branding.

Rhythm: strong heading, short prompt, generous action region, secondary details lower down. Private task content stays visually central without decoration competing. Images depict adults choosing, making, meeting and enjoying things; request image rights and avoid stereotypes about loneliness, frailty or technological incompetence. No imposed nostalgia. Flat illustration may explain permission/control, never provide fake clinical reassurance.

Listening: mic icon + Listening; planning: task verb; acting: named step; success: evidenced outcome + check; uncertainty: question/status + explanation; warning: triangle + consequence; privacy off/on: mic slash/capture text and actual state. Colors reinforce these labels; they are not the only code. Sound/haptic cues are optional and brief; every cue has a static visual equivalent. No confetti, streaks, rewards, neon AI gradient or omnipresent animated orb.

## Four reproducible territories

Explore these on identical SCR-003 Home and SCR-007 confirmation structure so preference is not confounded by layout. The [local review board](identity-review.html) contains authored HTML/SVG rough concepts with fallback fonts; it is not a Figma file or final assets.

### IDT-01 — Open Day

**Story:** An open doorway into useful everyday computing.
**Mood:** capable, clear, hospitable, grounded. **Avoid:** spa, botanical wellness, passive.
**Emotional/audience hypothesis:** A deep green anchor with warm yellow punctuation welcomes action without implying clinical care. Fits agency-oriented adults and family buyers without age coding.

| Role | Proposed hex |
|---|---|
| Primary/action | #123B36 |
| Secondary | #275D54 |
| Accent/decorative | #F4B942 |
| Background | #F5FAF7 |
| Surface/raised surface | #FFFFFF |
| Primary text | #152522 |
| Secondary text / border on white | #44524C |
| Success | #285C40 |
| Warning | #684500 |
| High-consequence deletion/danger | #982D35 |
| Focus | #5C32A3 |
| On-primary/on-danger | #FFFFFF |

**Typeface proposal:** display Atkinson Hyperlegible Next 600–700; body Atkinson Hyperlegible Next 400–450 and controls 600. Body/controls use design-system sizes and scaling. Font fallback: Android system sans then locale-appropriate Noto; Living Pages heading fallback Georgia/serif in web exploration, system sans if unavailable in Android. Bundle reviewed licensed files for production to avoid a network font dependency; confirm script coverage, font metrics and glyph differentiation on device. Family availability/license sources below; no claim a font alone guarantees accessibility.

**Logo concept families:** Humanist wordmark with open counters, moderately wide letterspacing and a distinctive opening in one letter; no customized letter until name chosen. Symbol families: two offset doorway strokes; a horizon notch; an open rectangular frame. App icon: one large open-frame mark, not a tiny word. Horizontal mark+name; stacked name below; monochrome retains open gap.
**Layout/shape/icons/imagery/motion/sound:** 16dp containers, 12dp controls; broad horizontal bands and generous vertical rhythm. Icons 2–2.5dp stroke, recognizable forms, labels always. Photography shows adults doing self-chosen things with varied ages/abilities and explicit rights; no stock caregiver handholding. Motion settles directly; optional dry two-note low-volume acknowledgment, no victory jingle.
**Home and confirmation direction:** Home: off-white field, dark green Talk block and clear grid of labeled shortcuts, small yellow edge near entry. Confirmation: white full-page card, dark recipient/body, green exact action and outlined Cancel; no decorative illustration beside private message.
**Strengths/risks/test:** Best balance of authority and warmth; risk of eco/financial association. Test whether green looks like health care or finance, whether wordmark feels adult, and whether the open-frame mark implies an app launcher.

| Foreground / background | Role | Calculated contrast |
|---|---|---|
| #152522 / #F5FAF7 | body/background | 15.08:1 |
| #152522 / #FFFFFF | body/surface | 15.91:1 |
| #FFFFFF / #123B36 | action | 12.32:1 |
| #44524C / #FFFFFF | supporting | 8.21:1 |
| #285C40 / #FFFFFF | success | 7.79:1 |
| #684500 / #FFFFFF | warning | 8.61:1 |
| #FFFFFF / #982D35 | danger | 7.60:1 |
| #5C32A3 / #FFFFFF | focus | 8.61:1 |
| #152522 / #F4B942 | text/accent | 8.99:1 |

### IDT-02 — Bright Signal

**Story:** Technology that makes the next step unmistakable.
**Mood:** direct, optimistic, crisp, modern. **Avoid:** hospital, corporate dashboard, neon.
**Emotional/audience hypothesis:** Cobalt and saturated yellow make legibility and intent feel confident. Suits users who prefer visible energy over muted aesthetics; no age preference assumed.

| Role | Proposed hex |
|---|---|
| Primary/action | #15367A |
| Secondary | #56328A |
| Accent/decorative | #FFD43B |
| Background | #F2F5FF |
| Surface/raised surface | #FFFFFF |
| Primary text | #15223A |
| Secondary text / border on white | #43516B |
| Success | #255A37 |
| Warning | #674900 |
| High-consequence deletion/danger | #9E2636 |
| Focus | #7025A8 |
| On-primary/on-danger | #FFFFFF |

**Typeface proposal:** display Manrope 600–700; body Source Sans 3 400–450 and controls 600. Body/controls use design-system sizes and scaling. Font fallback: Android system sans then locale-appropriate Noto; Living Pages heading fallback Georgia/serif in web exploration, system sans if unavailable in Android. Bundle reviewed licensed files for production to avoid a network font dependency; confirm script coverage, font metrics and glyph differentiation on device. Family availability/license sources below; no claim a font alone guarantees accessibility.

**Logo concept families:** Strong geometric wordmark with open apertures; symbol families: offset corner brackets; a single broad directional cut; two aligned bars forming a clear route. Icon silhouette must remain recognizable in one color. Horizontal name beside mark; stacked compact wordmark; avoid chevrons resembling navigation commands.
**Layout/shape/icons/imagery/motion/sound:** 8dp containers/control radius, precise grid, bold section dividers. Straight-ended labeled icons. Abstract geometric illustrations explain flows; documentary photography only in communications. 120–180ms transitions; optional clear short percussive onset cue with soft decay.
**Home and confirmation direction:** Home: pale blue-white canvas, cobalt Talk control, yellow optional decorative panel with dark ink. Confirmation: nearly all white with cobalt heading/primary action, no yellow warning-like decorative block around Send.
**Strengths/risks/test:** Strong visibility/scalability; risk of banking/enterprise tone or overstimulation. Test whether it feels inviting, whether yellow is confused with warnings, and whether stronger contrast improves task reading without fatigue.

| Foreground / background | Role | Calculated contrast |
|---|---|---|
| #15223A / #F2F5FF | body/background | 14.59:1 |
| #15223A / #FFFFFF | body/surface | 15.89:1 |
| #FFFFFF / #15367A | action | 11.41:1 |
| #43516B / #FFFFFF | supporting | 7.99:1 |
| #255A37 / #FFFFFF | success | 8.09:1 |
| #674900 / #FFFFFF | warning | 8.30:1 |
| #FFFFFF / #9E2636 | danger | 7.54:1 |
| #7025A8 / #FFFFFF | focus | 8.34:1 |
| #15223A / #FFD43B | text/accent | 11.15:1 |

### IDT-03 — Living Pages

**Story:** A useful computer with the composure of a well-edited page.
**Mood:** thoughtful, tactile, personal, literate. **Avoid:** nostalgic, ornate, sepia, luxury.
**Emotional/audience hypothesis:** Plum, ink and paper make personal content feel cared for. Editorial pacing supports stories as future context but must not force a memory-product position on MVP.

| Role | Proposed hex |
|---|---|
| Primary/action | #67263F |
| Secondary | #3D5141 |
| Accent/decorative | #D78342 |
| Background | #FFF8ED |
| Surface/raised surface | #FFFFFF |
| Primary text | #2E2424 |
| Secondary text / border on white | #63504A |
| Success | #34563A |
| Warning | #704400 |
| High-consequence deletion/danger | #9B242E |
| Focus | #4930A1 |
| On-primary/on-danger | #FFFFFF |

**Typeface proposal:** display Source Serif 4 600–700; body Source Sans 3 400–450 and controls 600. Body/controls use design-system sizes and scaling. Font fallback: Android system sans then locale-appropriate Noto; Living Pages heading fallback Georgia/serif in web exploration, system sans if unavailable in Android. Bundle reviewed licensed files for production to avoid a network font dependency; confirm script coverage, font metrics and glyph differentiation on device. Family availability/license sources below; no claim a font alone guarantees accessibility.

**Logo concept families:** Adaptable serif wordmark with sturdy strokes; symbol families: a folded page revealing an opening; two page edges forming a window; a single bracket-book form. Monochrome uses no fine hairlines; small app icon uses broad page fold without letters. Horizontal lockup for store/communications, stacked mark/name for onboarding.
**Layout/shape/icons/imagery/motion/sound:** 4dp cards and 8dp buttons; typography carries hierarchy, subtle rules instead of many cards. Simple two-tone editorial line illustrations; no fake paper texture behind text, no imposed old-photo nostalgia. Quiet page-reveal transition, reduced motion instant. Optional warm single plucked cue.
**Home and confirmation direction:** Home: paper background, generous ink heading, plum Talk button, clearly separated white action rows. Confirmation: plain white with source-style metadata and exact body; action remains a large sans button. Copper is decorative only because internal essential-text target fails on its accent pairing.
**Strengths/risks/test:** Distinctive warmth and adult credibility; risk of literary/English bias, font reading burden or nostalgic interpretation. Test serif headings against sans, avoid making product feel only for stories, measure reading speed and comfort.

| Foreground / background | Role | Calculated contrast |
|---|---|---|
| #2E2424 / #FFF8ED | body/background | 14.28:1 |
| #2E2424 / #FFFFFF | body/surface | 15.06:1 |
| #FFFFFF / #67263F | action | 10.90:1 |
| #63504A / #FFFFFF | supporting | 7.56:1 |
| #34563A / #FFFFFF | success | 8.27:1 |
| #704400 / #FFFFFF | warning | 8.35:1 |
| #FFFFFF / #9B242E | danger | 7.82:1 |
| #4930A1 / #FFFFFF | focus | 9.46:1 |
| #2E2424 / #D78342 | text/accent | 5.18:1 |

### IDT-04 — Everyday Spark

**Story:** A little more possibility in everyday tasks.
**Mood:** lively, personable, assured, contemporary. **Avoid:** toy, confetti, mascot, childish.
**Emotional/audience hypothesis:** Violet, teal and coral offer expressive warmth without a robot persona. Tests whether visual pleasure can coexist with precise control.

| Role | Proposed hex |
|---|---|
| Primary/action | #3D246B |
| Secondary | #146064 |
| Accent/decorative | #F18F9C |
| Background | #FAF5FF |
| Surface/raised surface | #FFFFFF |
| Primary text | #261D32 |
| Secondary text / border on white | #594B66 |
| Success | #295C44 |
| Warning | #674500 |
| High-consequence deletion/danger | #962F43 |
| Focus | #006267 |
| On-primary/on-danger | #FFFFFF |

**Typeface proposal:** display Nunito Sans 600–700; body Atkinson Hyperlegible Next 400–450 and controls 600. Body/controls use design-system sizes and scaling. Font fallback: Android system sans then locale-appropriate Noto; Living Pages heading fallback Georgia/serif in web exploration, system sans if unavailable in Android. Bundle reviewed licensed files for production to avoid a network font dependency; confirm script coverage, font metrics and glyph differentiation on device. Family availability/license sources below; no claim a font alone guarantees accessibility.

**Logo concept families:** Rounded but not bubble-letter wordmark; symbol families: one offset rounded loop with a deliberate opening; two joined arches; an asymmetric tile pair. Icon uses broad distinctive opening, not a generic sparkle/star/AI orb. Monochrome preserves asymmetry; no gradient dependence. Wordmark widths adapt to all finalists.
**Layout/shape/icons/imagery/motion/sound:** 24dp containers and 16dp controls; rounded forms with disciplined spacing, no floating random blobs. Friendly labeled geometric icons; editorial color-block illustration, diverse adults portrayed as agents. Small 180ms ease-out transition; static equivalent. Optional warm two-tone cue, no celebratory animation.
**Home and confirmation direction:** Home: very pale violet canvas, dark violet Talk, teal secondary outlines and small coral shape away from task labels. Confirmation: plain white preview, violet action, persistent Cancel/Change; coral never substitutes for danger or privacy state.
**Strengths/risks/test:** Most expressive, scalable beyond age framing; risk of child/wellness associations and excess ornament. Test dignity and comprehension before preference, compare fatigue over repeated tasks.

| Foreground / background | Role | Calculated contrast |
|---|---|---|
| #261D32 / #FAF5FF | body/background | 15.00:1 |
| #261D32 / #FFFFFF | body/surface | 16.10:1 |
| #FFFFFF / #3D246B | action | 12.63:1 |
| #594B66 / #FFFFFF | supporting | 8.01:1 |
| #295C44 / #FFFFFF | success | 7.75:1 |
| #674500 / #FFFFFF | warning | 8.65:1 |
| #FFFFFF / #962F43 | danger | 7.54:1 |
| #006267 / #FFFFFF | focus | 7.14:1 |
| #261D32 / #F18F9C | text/accent | 7.02:1 |


## Contrast method and limitations

Calculated 2026-09-13 using sRGB relative luminance: normalize channel to 0–1, linearize at 0.04045, weight 0.2126/0.7152/0.0722, then (Llighter+0.05)/(Ldarker+0.05). Values rounded to 2 decimals for display; threshold comparisons use unrounded values. These are arithmetic measurements of opaque color pairs, not a device/user accessibility test.

All listed essential text/primary/danger/status-on-white pairs exceed proposed 7:1; focus exceeds 3:1. Living Pages copper accent/body is 5.18:1 and **must not carry essential text** under Granny's 7:1 target; use it decoratively only. Borders/focus need validation against both adjacent colors; focus uses white separation around dark buttons. Disabled color overlays, photos, opacity, dark themes and actual component composites require separate measurements. Dark/high-contrast production palettes are not derived by inversion; they are part of GATE-05 production work.

## Typeface evidence

Accessed 2026-09-13: [Atkinson Hyperlegible Next source/license](https://github.com/googlefonts/atkinson-hyperlegible-next), [Source Sans](https://github.com/adobe-fonts/source-sans), [Source Serif](https://github.com/adobe-fonts/source-serif), [Manrope distribution](https://github.com/google/fonts/tree/main/ofl/manrope), [Nunito source family](https://github.com/googlefonts/nunito). Atkinson's publisher describes differentiated characters for low-vision readability; this supports candidate selection, not Granny test results. Repositories include font license information; capture exact downloaded version/license at handoff. Nunito Sans requires its own exact family distribution/license check before bundling. Do not assume family names or browser fallbacks equal installed fonts.

## Decision brief for Simon

Recommend **Open Day**, with its disciplined layout and high-contrast humanist text, as the first direction to prototype. It expresses everyday capability without assuming an age/medical identity and works for long repeated tasks. Keep Bright Signal as a serious alternative if users find it clearer or more confident. Do not mix all four palettes into one indecisive UI.

Scores below are creative judgment 1–5, not research. Risk column: 5 means lower anticipated risk.

| Territory | Brand fit | Distinctive | Accessible potential | Warmth | Clarity | Extension | Technical practicality | Low risk |
|---|---|---|---|---|---|---|---|---|
| Open Day | 5 | 4 | 5 | 5 | 5 | 5 | 5 | 4 |
| Bright Signal | 4 | 4 | 5 | 3 | 5 | 5 | 5 | 4 |
| Living Pages | 4 | 5 | 4 | 5 | 4 | 4 | 4 | 3 |
| Everyday Spark | 4 | 5 | 4 | 4 | 4 | 5 | 4 | 3 |

Simon chooses a direction to develop, reactions to names separately, and qualities to keep/remove. Confidence is high in visible state, large text and independent Stop as brand behavior; actual palette/typeface/symbol appeal remains taste and research. Test older adults and helpers separately for comprehension, dignity, recognition and preference on matched screens. Change recommendation if Open Day reads as medical/finance, has lower comprehension, or feels dull/untrustworthy to intended users.

Naming finalists **Daykind, Handspan, Clearfold** are independent strategic choices with screening limits. Daykind pairs with Open Day/Everyday Spark; Handspan with Open Day/Bright Signal; Clearfold with Bright Signal/Living Pages. Name choice never follows automatically from palette approval.

## Logo and identity production package

After feedback, develop three concept families for selected name/direction: adaptable wordmark, standalone symbol and app icon. Produce horizontal/stacked lockups, monochrome/reversed versions, Android adaptive-icon foreground/background and small monochrome icon. Proposed tests: symbol readable at 24/48dp; wordmark at 120px/30mm; clear space at least one symbol-stroke-module; test against competing app icons and accessibility symbols. These are trial dimensions, not approved final standards.

Use editable Figma/vector source with named layers, outlined SVG exports plus original live-type source, PDF overview and PNG 1×/2×/3× previews. Record name/territory/concept/status in filename, e.g. IDT-01-concept-a-wordmark-proposed.svg. Git stores reviewed exports, licenses, token values and source/Figma version references; Simon owns approval, designer owns source preparation. Do not convert exploratory HTML rough symbols into final marks by renaming them.

Application sheet: SCR-001 onboarding, SCR-003 Home, SCR-004 voice state, SCR-007 confirmation, SCR-008 uncertain result, app-store icon and one plain marketing panel. Include light, dark and high-contrast studies, large text, grayscale and reduced-motion equivalents. Reject generic robot/star/orb, medical cross, grandmother caricature, gendered default persona, fine-line inaccessible mark or strong confusion with existing identity.

Final name/mark adoption requires professional trademark and linguistic review in chosen markets; domains/handles and font/image licenses must be confirmed separately. No clearance/availability is claimed. [Figma](figma.md) and [design system](design-system.md) define return of approved semantic tokens to Git and Android.
