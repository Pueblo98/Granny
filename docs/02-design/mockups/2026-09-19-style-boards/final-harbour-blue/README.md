---
title: "FINAL — Harbour Blue design system and board transcription"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [design, mockups, selected]
related:
  - ../../../brand-and-visual-identity.md
  - ../../../design-system.md
  - ../iteration-5/README.md
  - ../iteration-5/prompts.md
  - ../README.md
---

# FINAL — Harbour Blue

**Current selected design system. Approved by Simon on 2026-09-19 for use going forward, until he requests a revision.**

This is the written companion to the selected **Linen / Harbour Blue** board, iteration 5 / 04. The image below is an unchanged copy of that board, not a regenerated variation. Its original “ITERATION 5” and “Simulated UI” labels are preserved; this folder and note mark its final/current selection.

![FINAL selected Harbour Blue design board: Linen canvas, white surfaces, dark ink, blue accent and Send controls, blue outlines, compact composer, focus and Stop examples](harbour-blue-final.png)

The brand owner delegates the selected board's detailed visual transcription to this note. This records the approved visual reference, not a complete implemented app, production token export or accessibility test result. [Semantic components](../../../design-system.md) continue to own behavior.

## 1. Colours printed on the board

These six hex codes are transcribed directly from its labeled swatches. They are the selected values, not samples of approximate generated pixels.

| Board label | Exact hex | Use shown |
|---|---|---|
| Canvas | #FBF6EE | Linen off-white behind all specimens |
| Surface | #FFFFFF | Chat/composer interiors, draft-panel interior and Hide button interior |
| Ink | #2E2D32 | Primary headings, input text, action labels and dark control symbols |
| Accent | #2C5981 | Filled “Open draft” button, with a white label |
| Outline | #597DA0 | Ordinary composer, compact composer, draft-panel and Hide borders |
| Send | #165D9C | Circular Send buttons, with a white paper-plane symbol |

The visible “Send” word is dark ink alongside the filled circle, not white text inside it. Talk remains an unfilled dark microphone symbol with a dark text label.

## 2. Focus and Stop colours

These treatments are visible in the image, but their hex codes are **not printed on it**. The values below come from the selected board's [recorded generation brief](../iteration-5/prompts.md#linen--harbour-blue) and its existing brand specification; they are not newly invented or pixel-sampled values.

| State role | Source-specified hex | Treatment shown |
|---|---|---|
| Focus ring | #4930A1 | Blue-violet outer ring, separated from the ordinary outline by a light/white gap |
| Stop control and state outline | #962F43 | Red circular control with white square symbol; red speech-balloon boundary |
| On-colour symbol/text | #FFFFFF | White paper plane, Stop square and “Open draft” text |

The generated focus and red lines appear brighter in places than their source hex values. Use the recorded values as the reproducible reference; do not turn those raster variations into extra palette entries.

## 3. Typography

The footer names **Bricolage Grotesque + DM Sans**.

| Role | Family / source treatment | Visible hierarchy |
|---|---|---|
| Display title | Bricolage Grotesque; source intent 600 | Large bold “Linen / Harbour Blue” |
| Body and input | DM Sans; source intent 400 | Invitation, input text, supporting sentences and specimen labels |
| Controls | DM Sans; source intent 600 | Talk, Send, Open draft, Hide and Stop |
| Other headings | Sans-serif, visually bold | Room to write, Compact, Input states and Draft waiting |

Family names are printed on the board; role mapping and numeric weights come from the established brief. Exact rendered family/weight cannot be certified from a generated bitmap. The board does not specify font sizes, line heights, tracking, font-file versions or fallback fonts. Supporting labels and the document icon appear muted grey; no separate supporting-ink hex is specified.

## 4. Composition and shapes

- **Board:** landscape PNG, 1536 × 1024 pixels (3:2). These are artifact dimensions, not app screen dimensions or a responsive breakpoint.
- **Header:** small uppercase iteration label at upper left; large title and subtitle below. Palette swatches sit at upper right: Canvas, Surface, Ink, Accent, then Outline and Send.
- **Main row:** large “Room to write” composer on the left; one draft context panel on the right.
- **Lower row:** Compact composer on the left; three vertically stacked Input states on the right.
- **Footer:** small type/fidelity note at bottom right.
- **Composer shape:** long, smoothly rounded speech balloon with a short lower-left tail. Large and compact examples share the silhouette.
- **Panel:** rounded rectangle, without a speech tail.
- **Controls:** circular Send/Stop fills; pill-shaped Open draft and Hide buttons. Talk is a microphone plus label, not a filled pill.
- **Surfaces:** white against Linen; no intended decorative shadow or gradient. Small raster fill variations are generation artifacts, not additional effects.

There are no specified numeric radii, padding, gaps, control diameters or responsive rules. The source describes an ordinary thin “2px-like” outline and a focus ring roughly twice its weight; these are illustration cues, not measured or accepted Android dp values.

## 5. Components, icons and exact visible copy

### Board heading

```text
GRANNY / ITERATION 5
Linen / Harbour Blue
One canvas. A clear next step.
```

“Granny” remains the project codename; this heading is board metadata, not a newly selected public name.

### Large composer

```text
Room to write
Type a request
What’s on your mind?
Talk
Send
```

“Type a request” sits above the writing line. A dark vertical caret appears before the invitation. Bottom-right controls show an outlined microphone and Talk, followed by the blue Send circle with a white paper plane and the separate Send label.

### Draft context panel

```text
Draft waiting
Continue when you’re ready.
Open draft
Hide
```

A muted outlined document icon with folded corner and short horizontal lines sits left of the heading. Open draft is the filled accent pill on the lower left; Hide is a white outlined pill on the lower right. The content is a fictional specimen, not a real waiting draft.

### Compact composer

```text
Compact
Type a request
Ask me anything...
Talk
Send
```

Same speech-balloon shape, caret, microphone/Talk and circular Send treatment in a shallower, shorter specimen.

### Input-state specimens

Section heading: **Input states**. The labels at left are **Default**, **Focus** and **Stop treatment** (the last wraps over two lines).

| Specimen | Text and controls | Boundary |
|---|---|---|
| Default | “Type a request”; “What’s on your mind?”; Talk; Send; caret, microphone and paper plane | Single ordinary blue outline |
| Focus | Same text, caret and Talk/Send controls | Ordinary outline plus separated, stronger blue-violet outer ring |
| Stop treatment | “Type a request”; “What’s on your mind?”; Talk; Stop; caret and microphone; red circle with white square replaces Send circle | Red single outline |

The extra ring/weight distinguishes focus in addition to its colour. The square and explicit Stop label distinguish Stop in addition to red. The Stop specimen represents an **available Stop action**, not a verified stopped/completed outcome. Exact lifecycle, confirmation and outcome behavior remains in the semantic component contracts; this transcription introduces none.

### Footer

```text
Bricolage Grotesque + DM Sans · Linen shortlist · Simulated UI
```

## 6. Reuse and scope

Use this board and its recorded values as the current visual reference. Earlier Soft Plum, Pearl and shortlist recommendations are historical, not competing defaults. Preserve the ordinary/focus/Stop distinction and the separate Send and accent roles when applying it.

Selection confirms the visual system **for now**. It does not supply unseen states, dark mode, success/warning tokens, disabled/loading treatments, motion, exact layout measurements or a full widget library. It also does not certify fonts, scaling, target sizes, TalkBack, device usability or production readiness. Do not fill those gaps silently and call them a one-to-one transcription.

[Original selected image](../iteration-5/04-harbour-blue.png) · [Original shortlist](../iteration-5/README.md) · [Generation brief](../iteration-5/prompts.md#linen--harbour-blue) · [All iteration history](../README.md) · [Simon's feedback](<../Notes - style boards.md>)
