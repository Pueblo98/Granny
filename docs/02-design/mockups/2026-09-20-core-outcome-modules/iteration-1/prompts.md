---
title: "Core outcome modules — generation prompts"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, mockups, prompts, outcomes]
related:
  - README.md
  - manifest.json
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
---

# Core outcome modules — generation prompts

Each call produced one full-screen raster. Every frame used this common prompt
foundation followed by its frame-specific instruction.

## Common foundation

```text
Create one polished full-screen 16:10 landscape tablet UI mockup for Granny, a temporary codename. Show a spacious conversation, not a separate mini-app page: small written Granny at upper left; quiet written Home, Rooms and Menu at upper right; one user request and one Granny response; one earned rectangular white contextual module; and the selected large Round conversation composer near the bottom with persistent label, visible writing line, outlined microphone plus Talk, and blue circular paper plane plus Send. Preserve generous Linen negative space and a simple top-to-bottom reading order.

Use Harbour Blue exactly: Canvas #FBF6EE, Surface #FFFFFF, Ink #2E2D32, Accent #2C5981, Outline #597DA0, Send #165D9C, separated focus ring #4930A1 only when demonstrated, Stop/danger #962F43 only for real stop/destructive meaning, On-colour #FFFFFF. Approximate Bricolage Grotesque 600 for display and DM Sans 400/600 for body and controls.

Use fictional content only. Essential controls must have written labels. No gradient, glass, glow, deep shadow, AI sparkle, orb, robot, mascot, avatar, final logo, watermark, private data, icon-only navigation, bottom tabs, dashboard grid, cramped crop or extra widgets. Leave room for 200% text reflow and an unclipped focus ring. Produce one flat raster without device frame or review annotation.
```

## Frame-specific instructions

### 01 — Photos: found

```text
Request: “Show me the photos Sophie sent yesterday.” Reply: “I found 3 fictional photos from Sophie.” Module heading “Photos from Sophie”; provenance “Sophie · Book club”, “Yesterday · 13 September 2026”, “Example Messages”. Show one large editorial seaside-path photo and only a narrow preview of the next image. Add written controls “Previous photo”, “Next photo”, “Photo 1 of 3”, “Open full size”, “Done”, plus description “Seaside path and blue water”. Prioritize the large image without hiding sender/date/source.
```

### 02 — Photos: no result

```text
Use the same request. Reply: “I found the conversation, but no photos for that date.” Module heading “No photos found”; retain “Sophie · Book club”, “13 September 2026”, “Example Messages”. Explain that the conversation was available but contained no photos for the selected date. Actions: “Change date”, “Choose another Sophie”, “Done”. Distinguish no-result from loading, permission or offline states.
```

### 03 — Screen explanation

```text
Request: “What am I looking at?” Reply: “This is the tablet’s Display settings. The highlighted section changes text size.” Module source label “Supplied fictional screen · captured for this request” and state “Read only”. Show a fictional two-pane Settings screenshot with Display selected and rows Text size, Screen zoom and Dark theme; explain each in adjacent plain language. Actions: “Explain text size”, “Explain another option”, “Back to reading”, “Take over”. No system authority or change claim.
```

### 04 — Guidance highlight

```text
Request: “Show me where to make the words larger.” Reply: “Text size is the second option. I’ve highlighted it below.” Module source “Supplied fictional screen · Read only”. Heading “Find Text size”. On the fictional Settings screenshot, place a separated purple outline around the Text size row with numbered marker 1 and written Text size label. Steps: “1 Choose Text size.” and “2 Use the larger example that feels comfortable.” State: “Granny is only showing where it is. Nothing has changed.” Actions: “Back to explanation”, “Back to reading”, “Take over”.
```

### 05 — Message: exact draft review

```text
Request: “Tell David I’ll call after dinner.” Reply: “I prepared the exact fictional draft for you to review.” Module heading “Check the draft” and “Nothing has been opened or sent yet.” Structured fields: To / David; Which person / Brother; Channel / Example Messages; Message / I’ll call after dinner.; What happens / A fictional unsent draft opens. Add “This does not send the message.” Actions: “Open this draft”, “Change it”, “Cancel”, “Repeat”.
```

### 06 — Message: prepared, not sent

```text
Use the same request. Reply: “The fictional draft is ready.” Module heading “Draft opened” and strong state “Prepared — not sent”. Sections: “What Granny verified” / “A fictional unsent draft opened for David — Brother in Example Messages.”; “What Granny did not do” / “Granny did not send the message.”; “Next step” / “Review the draft there and tap Send yourself if it looks right.” Actions: “Continue manually”, “Done”. Use a document/open symbol that does not imply sent.
```

### 07 — Media: playing

```text
Request: “Play Sinnerman by Nina Simone.” Reply: “Sinnerman by Nina Simone is playing in Example Music.” Module heading “Now playing”. Show restrained nonbranded cover art, title Sinnerman, artist Nina Simone, source Example Music, written state Playing, progress 0:42 / 10:22, written primary “Pause”, “Done”, and “Sound on”. Do not add queue, skip, recommendation or autoplay controls.
```

### 08 — Media: unavailable

```text
Use the same request. Reply: “Example Music isn’t available on this tablet.” Module heading “Music not started”. Fields: Title / Sinnerman; Artist / Nina Simone; Requested source / Example Music; Status / Service unavailable. State “No music was started. You can choose another available source or open your music apps yourself.” Actions: “Choose another source”, “Open apps”, “Done”.
```

### 09 — Reading: preview

```text
Request: “Make Granny’s text larger.” Reply: “Here is a preview. Nothing has changed yet.” Module heading “Preview larger text”. Compare “Current — Normal” and “Preview — Large” using the same sample “Your next appointment is on Tuesday at 10:30.” Controls “Smaller”, selected written value “Large”, “Larger”, “Apply”, “Cancel”, “Restore default”. State “This changes Granny’s text only.” The examples must stack on narrow/large-text layouts.
```

### 10 — Reading: applied and restore

```text
Use the same request. Reply: “Granny’s text is larger.” Module heading “Larger text applied”. Facts: Changed — Granny’s text; Previous size — Normal; Current size — Large. Show the same appointment sample at the applied size. State “Other apps and tablet settings were not changed.” and “You can restore this from Menu later.” Actions: “Restore previous size”, “Done”.
```

## Targeted correction prompts

Frames 03 and 04 were each edited once with this correction appended to their
existing image reference:

```text
Remove the blue circular “G” avatar beside Granny’s response and close the resulting gap naturally. Use only the plain written speaker label “Granny” in the conversation; no avatar, logo, monogram or mascot anywhere. Preserve all module semantics and copy.
```
