---
title: "Profile and accessibility adaptations — generation prompts"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, mockups, prompts, accessibility]
related:
  - README.md
  - manifest.json
---

# Profile and accessibility adaptations — generation prompts

Each selected mockup was generated as a separate raster with the built-in image
generation tool. The selected Harbour Blue Home, Kitchen, Menu, Settings,
active-task or exact-preview image named below was supplied as a visual
reference. Prompts consistently required Linen `#FBF6EE`, Surface `#FFFFFF`,
Ink `#2E2D32`, Accent `#2C5981`, Outline `#597DA0`, Send `#165D9C`, focus
`#4930A1` and danger/Stop `#962F43` only for its semantic role.

## Selected prompt set

1. **Profile** — Reference: Settings overview. Create a proposed Profile
   destination, explicitly not an account dashboard, with `Profile`, `Choose
   what Granny knows about how to work with you.`, `Fictional example · stays
   on this tablet`, and broad rows for `What Granny calls you / Alex / Edit`,
   `How Granny explains / Clear and brief / Change`, `People and aliases / 2
   saved names / Review`, and `Saved information / Preferences and room
   organization / Review`. Add `This is not an online account. Granny does not
   create a public profile.`, Back to Settings, Privacy and data, and the normal
   Round composer. No avatar, sign-in, email, password, cloud badge or social
   features.
2. **Home at 200% text** — Reference: selected Explicit Scroll Row Home. Create
   a flat edge-to-edge 16:10 screenshot at genuine 200% text. Reflow the main
   invitation to two lines; retain one compact Continue in Kitchen region;
   place the large Round composer before Rooms; reduce Rooms to one vertical
   Fitness entry plus See all rooms; omit art before shrinking or clipping.
3. **Narrow Kitchen** — Reference: Kitchen overview. Place one narrow flat app
   viewport on a neutral review sheet labelled `Narrow window · vertical
   reading order`. Keep Home/Rooms/Menu, written Kitchen identity and scope,
   one continuation, vertical Recipes/Shopping lists/Meal plans rows, All
   Kitchen collections and a stacked Round composer. Remove room atmosphere
   and horizontal carousel behavior.
4. **Keyboard open** — Reference: selected Home. Show a restrained light
   stock-Android-like software keyboard in the lower 38%. Keep the Round
   composer directly above it with `Help me plan dinner for Thursday`, caret,
   Close keyboard, Talk and Send. Retain only the invitation and a compact
   continuation above; let Rooms scroll out rather than cramp.
5. **Keyboard focus** — Reference: Menu. Keep Home inert behind the Menu sheet.
   Show Search as the single whole-row keyboard focus target with an offset
   `#4930A1` ring and written `Keyboard focus` review note. Keep every other
   Menu row ordinary and never use purple as the normal border.
6. **Reduced motion** — Reference: active task/Stop. Preserve `Opening the
   draft`, goal, last verified step, current step, Take over, Repeat status and
   stable red Stop. Add `Reduced motion is on`. Use static icon/text only: no
   spinner, shimmer, pulse, progress bar, percentage or moving dots.
7. **No microphone** — Reference: selected Home. Preserve complete typed input,
   Send, continuation and room row. In the stable Talk position use a
   microphone-off icon plus `Talk unavailable`. Add `Microphone is not
   available. You can keep typing.` and `Review microphone`; do not block the
   composer or imitate a real Android permission result.
8. **Artwork disabled** — Reference: Kitchen overview. Remove portrait,
   backdrop, decor, motif and all collection pictograms. Preserve written
   Kitchen name, purpose, scope, continuation, Recipes/Shopping lists/Meal
   plans/Ingredients, Previous/Next, All Kitchen collections and the Round
   composer. Add `Artwork is off. Names and controls still work.` Do not leave
   broken-image boxes.
9. **Long copy** — Reference: exact draft preview. Use conversation request
   `Tell David I’ll call after dinner and explain the timing.` and the exact
   fictional message `Hi David, I’ll call after dinner, probably around eight.
   If that is too late, send me a message and I’ll call tomorrow morning
   instead. No need to wait up.` Keep recipient, Brother differentiator,
   Example Messages channel, unsent effect, full body, `This does not send the
   message.`, Open this draft, Change it, Cancel and Repeat. Wrap in document
   flow without ellipsis or a tiny internal scroller.
10. **Screen-reader annotation** — Reference: selected Home. Produce a
    documentation sheet with a reduced Home on the left and a numbered legend
    on the right: identity; Menu; invitation; request field; Talk; Send;
    continuation; Hide; Rooms heading; Previous/Next; three room targets; See
    all rooms. Footer: `Decorative room artwork is skipped. Each room is
    announced once with its name and purpose. Order must be verified with
    TalkBack.` Use purple only for annotation marks and do not show a pass badge.

## Targeted corrections

- `02-home-200-percent-text.png`: regenerated once to remove an invented
  physical tablet bezel and keep the selected asset as a flat UI screenshot.
- `10-screen-reader-reading-order.png`: edited once to remove the invented
  metadata `16:10 | UI-mockup | October 2024`; every other annotation-sheet
  element was preserved.

The full generation intent is also transcribed beside each image in
[README.md](README.md). Generated typography and geometry remain illustrative.
