---
title: "Navigation and supporting surfaces — generation prompts"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, mockups, prompts, navigation]
related:
  - README.md
  - manifest.json
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
---

# Navigation and supporting surfaces — generation prompts

Each built-in image-generation call produced one full-screen raster. The
selected Harbour Blue board, Home, outcome-module or Rooms search image named
for each call was supplied as a visual reference. Every call shared this base:

```text
Create one high-fidelity 16:10 landscape tablet UI mockup for Granny, a temporary codename. Use Harbour Blue exactly: Canvas #FBF6EE, Surface #FFFFFF, Ink #2E2D32, Accent #2C5981, Outline #597DA0, Send #165D9C, separated focus ring #4930A1 and danger/Stop #962F43 only for genuine Stop or destruction. Approximate Bricolage Grotesque 600 for display and DM Sans 400/600 for body and controls. Keep generous space, broad written targets, simple reading order and enough room for 200% text. No gradients, glass, glow, deep shadows, AI decoration, avatar, final logo, bottom tabs, private data, people or watermark.
```

## Selected frame instructions

1. **Menu:** selected Home subdued behind a right-side sheet; groups Go to
   (Today, Search, Rooms), Preferences (Settings, Accessibility, Privacy and
   data), Support (What can I ask?, Start a new conversation); written Close.
2. **Today:** three minimal summaries—Draft opened / Prepared — not sent;
   Photos from Sophie / No photos found; Text size changed / Large · restored
   available—with time/source, Open summary, Clear history and Back to Home.
3. **Settings:** five broad rows with summaries: Accessibility, Talk and voice,
   Privacy and data, Conversation, About Granny; no toggles on the overview.
4. **Privacy and data:** Cloud processing Off, Android permissions, minimal
   Task history, Local Granny data and no helper access; Review actions only.
5. **Accessibility:** Large preview; labeled Text size, Speech speed, Reduced
   motion and Captions choices; Apply, Restore previous choices, Back.
6. **Help:** five example sentences as plain text, three statements about
   clarification/consequence/uncertainty, typed path note, Ask Granny and Back.
7. **New conversation:** focused confirmation stating what clears, what stays
   and that nothing is deleted from another app; Start, Keep and Cancel.
8. **External return:** restored message conversation; Send status unknown;
   Known, Unknown and Before trying again; Review status, Open app yourself,
   Done; position-restored note.
9. **Global search results:** query `soup`; two saved items, Kitchen Room and
   one matching minimal task summary, all source-labelled; no external search.
10. **Global search empty:** query `train tickets`; No saved matches; Ask Granny
    instead, Search another phrase and Back; no silent external search.
11. **Onboarding welcome:** Step 1 of 3; natural requests, exact action review,
    Stop/take over; fictional examples, no account, Set up or Skip.
12. **Onboarding preferences:** Step 2 of 3; preview, Text size, explanation
    style and Speech speed; no inferred disability; Continue, Back or Skip.
13. **Onboarding optional access:** Step 3 of 3; separately unenabled
    Microphone, Screen help and Cloud processing rows; Continue without these,
    Back, review later; Android owns permission screens.

## Targeted corrections

- Frame 03: replace an incorrect trash icon beside Back to Home with a left
  navigation arrow; preserve all other content.
- Frame 08: remove an invented middle conversation pair so only the original
  request and the truthful return message remain.
- Frame 09: replace the unrelated photo-history match with `Shopping list
  prepared` / `Vegetable soup · Today 09:15` and a minimal-summary disclosure.
