---
title: "Kitchen vertical slice iteration 1 — generation prompts"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, mockups, prompts, context-rooms, kitchen]
related:
  - README.md
  - manifest.json
  - ../../iteration-1/visual-bible.md
---

# Kitchen vertical slice iteration 1 — generation prompts

Every selected product frame used the built-in image-generation tool. Input
paths below identify style/composition references; generated files contain no
private data. The fictional content does not claim a real saved recipe or
activity.

## 01 — Home to Kitchen

References: selected explicit-scroll-row Home; selected Harbour Blue board;
Kitchen K01 portrait.

```text
Use case: ui-mockup
Asset type: first frame of a full-screen 16:10 landscape tablet interaction sequence for Granny
Input images: Image 1 is the selected Home composition and must control structure; Image 2 is the Harbour Blue style authority; Image 3 is the Kitchen portrait artwork.
Primary request: recreate the selected Home composition as a clean, realistic product UI reference at the exact moment the person is about to continue a fictional Kitchen task. Preserve the open, spacious layout and explicit room scrolling. The compact rectangular continuation panel is the primary contextual region and reads "Continue in Kitchen", "Vegetable soup", "Kitchen · Recipes, lists and cooking plans", with actions "Open Kitchen" and "Hide". Show three open unboxed room portraits to the right with written Previous and Next controls and "See all rooms". Keep the large Round conversation composer near the bottom.
Text (verbatim): "Granny", "Menu", "What would you like to do?", "Ask in your own words. You can type or talk.", "Continue in Kitchen", "Vegetable soup", "Kitchen · Recipes, lists and cooking plans", "Open Kitchen", "Hide", "Other rooms", "Previous", "Next", "Fitness", "Movement and routines", "Trips", "Plans and packing", "Reading", "Books and saved articles", "See all rooms", "Type a request", "Ask me anything…", "Talk", "Send".
Style/medium: polished but practical product UI mockup, full screen without a tablet device frame; adult and calm; Bricolage Grotesque-like display headings and DM Sans-like body/control text.
Composition/framing: representative 16:10 landscape tablet, generous outer margins and free space; do not zoom in; no cropping of controls; continuation panel compact on the left, open portraits flowing into the Linen canvas on the right, composer spanning low across the screen.
Color palette: Canvas #FBF6EE, Surface #FFFFFF, Ink #2E2D32, Accent #2C5981, Outline #597DA0, Send #165D9C, Focus ring #4930A1 only as a separated outer ring, Stop #962F43 only when active.
Constraints: preserve the selected Home direction, same global assistant, no room grid, no bottom navigation, no extra cards or prompt chips, no gradients, glass, glow, deep shadows, AI sparkles, mascots, people, private data, logos or watermark. Essential navigation must be written. Idle Home has no Stop. Artwork contains no baked text.
```

## 02 — Kitchen overview

References: selected Home; Harbour Blue board; Kitchen backdrop; K-M01 mark;
Recipes symbol.

```text
Use case: ui-mockup
Asset type: Kitchen Context Room overview, second frame of a full-screen 16:10 landscape tablet sequence
Input images: Image 1 controls the selected Granny shell and Round composer; Image 2 controls Harbour Blue colors and typography; Images 3–4 are the exact Kitchen K01 atmosphere and identity references; Image 5 controls the bold rounded one-color collection-symbol language.
Primary request: design the first screen after opening Kitchen. It must feel like stepping into a calm recognizable Kitchen while remaining clearly the same Granny interface. Keep the Linen canvas and generous free space. Put a restrained slice of the K01 illustrated kitchen atmosphere only at the far right and upper edge, never behind essential text. At upper left show a small Kitchen mark, large written "Kitchen", purpose "Recipes, lists and cooking plans", and scope cue "Kitchen brings related things closer. You can still ask Granny anything." Provide written "Home", "Rooms", and "Menu" navigation without a rail or tabs.
Main content: a compact rectangular continuation region reading "Continue" and "Vegetable soup" with a single "Open recipe" action. Beside or below it, an airy integrated "Browse Kitchen" region with four large unboxed one-color collection symbols flowing directly on the Linen background: "Recipes", "Shopping lists", "Meal plans", "Ingredients". The symbol plus label is one broad target. Add written "Previous", "Next", and "All Kitchen collections" routes only where useful. Do not put every symbol in a separate card.
Keep the same large Round conversation composer near the bottom with persistent label, caret area, Talk and Send.
Text (verbatim): "Home", "Rooms", "Menu", "Kitchen", "Recipes, lists and cooking plans", "Kitchen brings related things closer. You can still ask Granny anything.", "Continue", "Vegetable soup", "Open recipe", "Browse Kitchen", "Recipes", "Shopping lists", "Meal plans", "Ingredients", "Previous", "Next", "All Kitchen collections", "Type a request", "Ask Granny in Kitchen…", "Talk", "Send".
Style/medium: polished practical product UI mockup, adult, calm and spacious; Bricolage Grotesque-like display headings, DM Sans-like body and controls; soft matte editorial kitchen art only at the edges.
Composition/framing: full-screen 16:10 landscape tablet without device frame; generous margins and quiet center; room identity at upper left, useful content in the middle, restrained decor edge zone, composer low across the screen; no zoomed-in or cramped composition.
Color palette: Canvas #FBF6EE, Surface #FFFFFF, Ink #2E2D32, Accent #2C5981, Outline #597DA0, Send #165D9C, Focus #4930A1 only as separated ring, danger #962F43 only for Stop.
Constraints: same global assistant, no separate Kitchen personality, no dashboard grid, no sidebar, no bottom tabs, no icon-only navigation, no excessive cards, no gradients, glass, glow, deep shadows, AI decoration, people, private data, watermarks or baked text inside art. Idle room has no Stop.
```

The first result used generic cooking icons. It is retained in `rejected/`.
The selected correction was:

```text
Use case: precise-object-edit
Asset type: Kitchen Context Room UI mockup correction
Input images: Image 1 is the exact UI to preserve. Images 2–5 are the approved collection-symbol raster studies for Recipes, Shopping lists, Meal plans and Ingredients, in that order.
Primary request: replace only the four blue collection icons in the "Browse Kitchen" row with the corresponding approved Ink-colored symbols from Images 2–5. Keep each symbol centered above its existing written label, with equal visual size and generous target spacing.
Constraints: change only those four icon graphics. Preserve every word, letter, layout position, navigation label, room artwork, continuation panel, composer, colors, margins, typography, and all other pixels from Image 1. Do not alter or restyle the supplied symbols. No additional icons, text or watermark.
```

## 03 — Recipes selected

References: selected Kitchen overview; Recipes symbol; Kitchen backdrop;
Harbour Blue board.

```text
Use case: ui-mockup
Asset type: Kitchen Recipes collection screen, third frame of a full-screen 16:10 landscape tablet sequence
Input images: Image 1 is the immediately preceding Kitchen overview and controls shell, spacing, navigation, room identity and composer; Image 2 is the exact Recipes collection symbol; Image 3 is the Kitchen atmosphere reference; Image 4 controls Harbour Blue.
Primary request: show the result of selecting the labelled Recipes symbol. Preserve the same Kitchen shell and calm edge atmosphere, but reduce the large Kitchen heading into a compact persistent identity line at the top so the collection content has room. The active collection must be explicit in words, not color alone: large heading "Recipes" with a small written state "Selected collection". Place the exact Recipes symbol beside the heading.
Below, create one broad white browse surface with Harbour Blue outline, not multiple cards. At its top place a persistent search label "Search recipes" and a wide empty search field reading "Type a recipe or ingredient". Beneath it show exactly three roomy list rows separated by light lines: "Vegetable soup" with secondary text "Continue where you left off"; "Tomato pasta" with "30 minutes"; "Oat pancakes" with "Breakfast". Each complete row is a target. Vegetable soup receives a quiet "Continue" label, not a second large button.
Keep a small horizontal collection switcher above or beside the browse surface with written options "Recipes", "Shopping lists", "Meal plans", "Ingredients", and "All collections". Recipes is visibly selected with both a short outline/indicator and the words "Selected"; do not box every option.
Keep the large Round conversation composer near the bottom unchanged.
Text (verbatim): "Home", "Rooms", "Kitchen", "Recipes, lists and cooking plans", "Menu", "Recipes", "Selected collection", "Search recipes", "Type a recipe or ingredient", "Vegetable soup", "Continue where you left off", "Continue", "Tomato pasta", "30 minutes", "Oat pancakes", "Breakfast", "Shopping lists", "Meal plans", "Ingredients", "All collections", "Type a request", "Ask Granny in Kitchen…", "Talk", "Send".
Style/medium: realistic polished product UI reference, adult, calm, readable, spacious, not a generic dashboard.
Composition/framing: full-screen 16:10 landscape tablet without device frame; generous margins and free Linen canvas; compact persistent room identity at top, single browse surface in center, composer low across the screen; no zoom or cropped controls.
Color palette: exact Harbour Blue roles: Canvas #FBF6EE, Surface #FFFFFF, Ink #2E2D32, Accent #2C5981, Outline #597DA0, Send #165D9C, Focus #4930A1 only for separated focus ring.
Constraints: same Granny assistant; direct browse works without chat; no room grid, food photography, thumbnails, tile cards, sidebar, bottom navigation, icon-only controls, gradients, glass, glow, deep shadows, people, private data, watermarks or additional text. Idle state has no Stop.
```

The first result added food thumbnails and felt too dense. It is retained in
`rejected/`. The selected correction was:

```text
Use case: precise-object-edit
Asset type: Kitchen Recipes collection UI mockup refinement
Input images: Image 1 is the screen to refine; Image 2 is the exact Recipes symbol to preserve; Image 3 is Harbour Blue style authority.
Primary request: make the Recipes collection feel substantially calmer and less crammed while preserving its overall shell. Remove all three food thumbnails completely; list rows should be text-only, broad semantic rows with generous left padding and simple light dividers. Reduce the white browse surface height so Linen breathing room appears above the composer and around its sides. Keep exactly three rows: "Vegetable soup" / "Continue where you left off" / "Continue"; "Tomato pasta" / "30 minutes"; "Oat pancakes" / "Breakfast". Keep the recipe search field, but make it proportionate and not dominant.
Preserve the compact Kitchen identity and edge artwork. Keep the exact Recipes symbol by the heading. Keep the collection switcher unboxed and the large Round composer completely visible near the bottom.
Constraints: no thumbnails, food pictures, decorative item illustrations or new controls. Do not add text. Preserve every existing word and correct spelling. Keep generous margins, no zoomed-in crop, no dashboard tiles, no gradients, glass, glow, deep shadows, people, private data or watermark.
```

## 04 — Vegetable soup detail

References: selected Recipes frame; Kitchen backdrop and decor; Harbour Blue
board.

```text
Use case: ui-mockup
Asset type: Vegetable soup recipe detail in Kitchen, fourth frame of a full-screen 16:10 landscape tablet sequence
Input images: Image 1 controls the existing Kitchen shell, navigation, spacing and composer; Images 2–3 are the Kitchen atmosphere references; Image 4 controls Harbour Blue.
Primary request: show the result of opening "Vegetable soup" from the Recipes collection. Preserve the compact Kitchen identity line at the top and add a written "Back to recipes" route. Use one generous readable content composition, not a dashboard.
Make "Vegetable soup" the large main heading. Immediately below show a plain source line "Kitchen · Recipes" and a discreet label "Fictional example". Use one broad white reading surface with Harbour Blue outline. Divide it through typography and whitespace rather than separate cards:
- left section headed "Ingredients" with exactly "2 carrots", "1 onion", "2 tomatoes", "Vegetable stock";
- right section headed "Where you stopped", then "Step 3 of 5" and "Add the chopped vegetables to the pot and simmer for 20 minutes."
At the bottom of that same surface place one primary contextual action "Show all steps" and one quiet secondary written action "Ask Granny about this". Do not imply any action has been completed.
Allow a restrained crop of Kitchen decor at the far right edge or upper corner, never behind text. Keep the large Round composer near the bottom with its stable Talk and Send controls.
Text (verbatim): "Home", "Rooms", "Kitchen", "Recipes, lists and cooking plans", "Menu", "Back to recipes", "Vegetable soup", "Kitchen · Recipes", "Fictional example", "Ingredients", "2 carrots", "1 onion", "2 tomatoes", "Vegetable stock", "Where you stopped", "Step 3 of 5", "Add the chopped vegetables to the pot and simmer for 20 minutes.", "Show all steps", "Ask Granny about this", "Type a request", "Ask Granny in Kitchen…", "Talk", "Send".
Style/medium: polished practical product UI reference, adult, calm, warm and highly readable; Bricolage-like heading and DM Sans-like body/control typography.
Composition/framing: full-screen 16:10 landscape tablet without device frame; generous margins; quiet reading area and substantial Linen negative space; never zoomed or cramped; composer fully visible.
Color palette: exact Harbour Blue roles: Canvas #FBF6EE, Surface #FFFFFF, Ink #2E2D32, Accent #2C5981, Outline #597DA0, Send #165D9C, Focus #4930A1 only as separated focus ring.
Constraints: same Granny assistant; no food photograph, recipe hero image, progress ring, nutrition score, timer, checkmarks, completion state, tiles, sidebar, bottom navigation, icon-only control, gradients, glass, glow, deep shadows, people, private data, logos, watermarks or extra text. Idle state has no Stop.
```

## 05 — Ask Granny about soup

References: selected recipe detail; Kitchen backdrop and decor; Harbour Blue
board.

```text
Use case: ui-mockup
Asset type: room-aware Granny conversation about the Vegetable soup recipe, fifth frame of a full-screen 16:10 landscape tablet sequence
Input images: Image 1 controls the exact Kitchen shell, top navigation, room identity and composer; Images 2–3 are optional Kitchen edge atmosphere; Image 4 controls Harbour Blue.
Primary request: show a completed conversational follow-up from the Vegetable soup detail while staying visibly inside Kitchen and using the same global Granny assistant. Keep the compact top identity "Kitchen" and purpose. Provide a written "Back to recipe" route.
Use a spacious conversation reading area on the Linen canvas, not stacked chat bubbles. First show a small user label "You asked" and the user request "Can I make this without tomatoes?" Then show a larger response under the label "Granny": "Yes. Leave them out and add a little more vegetable stock. The soup will be lighter, but the carrots and onion will still give it flavour." Keep this as calm readable text with generous line spacing.
Directly beneath, include one restrained outlined source cue reading "Using Vegetable soup · Kitchen · Recipes" with written actions "View recipe" and "Stop using this source". The cue must explain why the recipe influenced the answer; it is not an advertisement or a separate card stack.
Add one short follow-up line "You can keep asking here, or browse Kitchen directly." Keep the large Round composer near the bottom in its normal completed-response state with Talk and Send; no Stop because no task is running.
Text (verbatim): "Home", "Rooms", "Kitchen", "Recipes, lists and cooking plans", "Menu", "Back to recipe", "You asked", "Can I make this without tomatoes?", "Granny", "Yes. Leave them out and add a little more vegetable stock. The soup will be lighter, but the carrots and onion will still give it flavour.", "Using Vegetable soup · Kitchen · Recipes", "View recipe", "Stop using this source", "You can keep asking here, or browse Kitchen directly.", "Type a request", "Ask Granny in Kitchen…", "Talk", "Send".
Style/medium: polished practical product UI reference, adult, warm, candid and highly readable; minimal conversational grouping rather than alternating message bubbles.
Composition/framing: full-screen 16:10 landscape tablet without device frame; generous margins and Linen negative space; conversation occupies a comfortable reading column; optional room decor only at an outer edge; composer fully visible near bottom; no zoom or crop.
Color palette: exact Harbour Blue roles: Canvas #FBF6EE, Surface #FFFFFF, Ink #2E2D32, Accent #2C5981, Outline #597DA0, Send #165D9C, Focus #4930A1 only as separated focus ring.
Constraints: same global Granny, no separate Kitchen persona, no chat-bubble wall, no avatar, no suggested-prompt chips, no extra cards, no source hidden behind an icon, no food image, no gradients, glass, glow, deep shadows, AI sparkles, people, private data, logos, watermark or extra text.
```

The selected output added the sentence explaining which recipe fields supported
the answer. This is recorded as a useful but unrequested copy variation for
Simon to review rather than silently treated as canonical wording.
