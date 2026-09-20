---
title: "Kitchen K01 iteration 1 generation prompts"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, mockups, context-rooms, kitchen, prompts]
related:
  - ../visual-bible.md
  - ../../../../context-room-starter-catalog.md
---

# Kitchen K01 — generation prompts

All prompts use the built-in image generator, one call per image. Each prompt
inherits the complete [visual bible](../visual-bible.md). No text is intended
inside any asset. Review notes and actual technical properties are added after
each saved output is inspected.

## K-M01 room mark

```text
Use case: logo-brand
Asset type: Context Room room-mark raster study, intended 1024×1024 transparent PNG
Primary request: Kitchen K01 Morning Pantry, K-M01 Open cupboard mark: a rounded doorway/cupboard silhouette containing exactly one broad shelf and one simple bowl
Style/medium: original vector-friendly flat editorial emblem, one solid Harbour Blue-compatible dark ink color, bold rounded silhouette, one clear negative-space/internal idea
Composition/framing: single centered mark, square canvas, generous even padding, readable at 64px and 96px
Constraints: genuinely transparent background and preserved alpha; no text; no letters; no extra shelves; no miniature pantry detail; no app badge; no restaurant branding; no gradients; no shadows; no 3D; no logo; no watermark
```

## K01 room portrait

```text
Use case: stylized-concept
Asset type: outside Context Room portrait, intended 1600×1200 4:3 opaque PNG
Primary request: Kitchen K01 Morning Pantry outside portrait: an open pantry threshold with one sunlit shelf and broad recognizable kitchen shapes
Scene/backdrop: warm Linen-compatible wall and rounded pantry opening; one shelf with one bowl and restrained pantry forms; no labels or packaging text
Style/medium: soft matte adult editorial illustration, broad rounded forms, simplified perspective, restrained tactile ceramic, pale wood and linen
Composition/framing: compact threshold vignette with a bold readable silhouette at 192px; calm negative space; no miniature floor plan
Lighting/mood: diffuse quiet morning daylight, quietly optimistic, soft broad shadows
Color palette: Linen and warm neutral base with restrained sage/herb accent; compatible with Harbour Blue shell; recognition must not depend on color
Constraints: no people, faces, text, numbers, logos, controls, notifications, AI effects, gradients, glass, watermark, focal knife, flames, alcohol or culturally specific cuisine
```

## K01 interior backdrop

```text
Use case: stylized-concept
Asset type: Context Room interior backdrop, intended 2560×1600 16:10 opaque PNG
Primary request: Kitchen K01 Morning Pantry interior: warm-neutral kitchen, clear counter, soft morning window and a quiet central reading field
Scene/backdrop: simplified matte kitchen with pale wood, warm-white plaster, one morning window and minimal edge objects
Style/medium: soft matte adult editorial illustration, broad rounded architectural forms, low detail, consistent with the Morning Pantry portrait
Composition/framing: wide 16:10, slightly elevated adult eye-level; middle 60% deliberately quiet and low contrast; important objects only near outer edges; no object beneath likely composer, content column or Stop areas; portrait-safe crop remains recognizable
Lighting/mood: diffuse natural morning light from one plausible direction, soft broad shadows, calm and practical
Color palette: Linen/warm neutral base, light wood, ceramic and restrained sage; Harbour Blue remains reserved for UI
Constraints: no people, text, controls, fake documents, packaging, logos, notifications, focal knives, flames, dirty dishes, gradients, glow, glass effects or watermark
```

## K01 transparent decor cluster

```text
Use case: stylized-concept
Asset type: removable Context Room decor cluster, intended 1400×1000 transparent PNG
Primary request: Kitchen K01 Morning Pantry decor: exactly three coordinated objects—one small herb pot, one rounded jar holding wooden spoons and one folded linen cloth
Style/medium: soft matte adult editorial illustration matching Morning Pantry, broad simplified shapes, tactile ceramic, pale wood and woven linen
Composition/framing: one restrained edge-ready cluster, objects clearly separated but visually balanced, generous transparent margin
Lighting/mood: diffuse morning light, minimal soft object shading
Color palette: warm neutral, restrained herb sage and pale wood; compatible with Linen and Harbour Blue
Constraints: genuinely transparent background and preserved alpha; no cast shadow that assumes a fixed surface; no text, labels, logos, people, extra objects, knife, food packaging, gradients, glow or watermark
```

## K01 surface motif

```text
Use case: stylized-concept
Asset type: subtle Context Room surface motif, intended 1024×1024 square PNG tile
Primary request: Kitchen K01 Morning Pantry faint woven-linen grain made from broad sparse interlaced strokes
Style/medium: flat matte editorial surface pattern, seamless, extremely low contrast, no focal element
Composition/framing: square repeat with seamless edges, broad scale, generous quiet areas, safe behind empty margins but not required for meaning
Color palette: two very close Linen-compatible warm-neutral tones; no Harbour Blue semantic color
Constraints: no text, objects, room scene, border, high-frequency noise, depth, shadow, gradient, logo or watermark; must be safe to remove entirely
```

## K01 transparent empty-state illustration

```text
Use case: stylized-concept
Asset type: Context Room empty-state illustration, intended 1200×900 transparent PNG
Primary request: Kitchen K01 Morning Pantry empty-state still life: one closed blank recipe notebook resting beside one empty broad ceramic bowl
Style/medium: soft matte adult editorial illustration matching Morning Pantry, broad rounded forms, tactile paper and ceramic, quietly inviting
Composition/framing: centered low still life with generous open transparent space and a clean silhouette; no implied completed task
Lighting/mood: diffuse morning light, restrained soft object shading
Color palette: warm neutral and Linen-compatible ceramic with a tiny restrained sage accent; compatible with Harbour Blue shell
Constraints: genuinely transparent background and preserved alpha; notebook cover and pages completely blank; no text, marks, fake files, food, utensils, people, logos, notifications, cast shadow tied to a surface, gradient, glow or watermark
```

## Collection symbol — Recipes

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Recipes symbol: a closed blank recipe notebook with one simple page-tab notch, organizing saved recipes without suggesting an action
Style/medium: original one-color vector-friendly flat symbol matching K-M01; bold rounded silhouette, consistent fill/stroke balance, one internal idea
Composition/framing: centered square, generous even padding, readable at 96px
Constraints: genuinely transparent background and preserved alpha; no text, letters, food, checkmark, plus, play, timer, app badge, gradients, shadows, 3D, logo or watermark
```

## Collection symbol — Shopping lists

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Shopping lists symbol: one blank rounded list sheet with three broad horizontal slots and no marks, cart or purchase cue
Style/medium: original one-color vector-friendly flat symbol matching K-M01; bold rounded silhouette and consistent visual weight
Composition/framing: centered square, generous even padding, readable at 96px
Constraints: genuinely transparent background and preserved alpha; no text, letters, numbers, checkmarks, cart, bag, currency, plus, arrow, app badge, gradients, shadows, 3D, logo or watermark
```

## Collection symbol — Meal plans

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Meal plans symbol: a simple divided plate beside one broad calendar-like page shape, clearly an organization category rather than a timer or start action
Style/medium: original one-color vector-friendly flat symbol matching K-M01; rounded bold forms, consistent fill/stroke balance
Composition/framing: centered square, two shapes unified into one compact silhouette, generous padding, readable at 96px
Constraints: genuinely transparent background and preserved alpha; no text, dates, numbers, clock, play, checkmark, plus, app badge, gradients, shadows, 3D, logo or watermark
```

## Collection symbol — Favorites

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Favorites symbol: one broad bookmark ribbon nested inside a shallow bowl silhouette, denoting a saved category without status or completion
Style/medium: original one-color vector-friendly flat symbol matching K-M01; bold rounded silhouette and one simple internal idea
Composition/framing: centered square, generous even padding, readable at 96px
Constraints: genuinely transparent background and preserved alpha; no heart, star, checkmark, plus, text, app badge, gradients, shadows, 3D, logo or watermark
```

## Collection symbol — Recently used

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Recently used symbol: two gently overlapping blank recipe cards with one subtle receding edge, expressing recency through layering rather than a clock or status badge
Style/medium: original one-color vector-friendly flat symbol matching K-M01; bold rounded forms and consistent visual weight
Composition/framing: centered square, generous padding, readable at 96px
Constraints: genuinely transparent background and preserved alpha; no text, dates, clock, history arrow, checkmark, notification dot, app badge, gradients, shadows, 3D, logo or watermark
```

## Collection symbol — Appliance notes

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Appliance notes symbol: a simple rounded countertop appliance silhouette beside one blank note card, clearly reference material and not an on/off control
Style/medium: original one-color vector-friendly flat symbol matching K-M01; bold safe forms, consistent fill/stroke balance
Composition/framing: centered square, unified compact silhouette, generous padding, readable at 96px
Constraints: genuinely transparent background and preserved alpha; no brand, text, power symbol, button, plug action, warning, checkmark, plus, app badge, gradients, shadows, 3D, logo or watermark
```

## Collection symbol — Ingredients

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Ingredients symbol: one broad bowl holding exactly three simple ingredient shapes—a leaf, a round form and a small grain mound—reduced to a strong category silhouette
Style/medium: original one-color vector-friendly flat symbol matching K-M01; bold rounded forms and consistent visual weight
Composition/framing: centered square, generous even padding, readable at 96px and in grayscale
Constraints: genuinely transparent background and preserved alpha; no specific cuisine, packaging, labels, shopping cue, knife, flame, checkmark, plus, app badge, gradients, shadows, 3D, logo or watermark
```

## Collection symbol — Unfiled

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, intended 192×192 transparent PNG
Primary request: Unfiled symbol: one open shallow tray containing a single blank loose card at a slight angle, communicating an uncategorized collection without error or warning
Style/medium: original one-color vector-friendly flat symbol matching K-M01; bold rounded silhouette, consistent fill/stroke balance
Composition/framing: centered square, generous even padding, readable at 96px
Constraints: genuinely transparent background and preserved alpha; no question mark, exclamation, warning triangle, text, checkmark, plus, trash, app badge, gradients, shadows, 3D, logo or watermark
```

## Exact execution prompts and corrections

The role prompts above are the initial prompts used for the six scene assets.
The following text records every prompt that differed during execution. This
keeps the selected outputs reproducible without hiding the targeted retries.

### K-M01 selected retry

```text
Targeted correction of a Kitchen Context Room mark.
Use case: logo-brand
Asset type: K-M01 Open cupboard room-mark raster study, transparent PNG
Primary request: a rounded doorway/cupboard outline containing exactly one broad horizontal shelf and one simple bowl, centered as one balanced emblem
Style/medium: extremely clean vector-friendly flat emblem; every visible pixel of the emblem uses one perfectly uniform solid color #2E2D32; hard clean antialiased edges only
Composition/framing: square transparent canvas, generous even padding, strong silhouette readable at 64px and 96px
Critical correction: remove all gradients, lighting, highlights, texture, shading, shadows and color variation; uniform flat fill only
Constraints: genuinely transparent background and preserved alpha; no text, letters, extra shelves, miniature pantry detail, app badge, restaurant styling, 3D, commercial logo or watermark
```

The retry improved the construction but retained faint tonal shading. It is a
raster study awaiting Simon's direction, not a production mark master.

### K01 portrait selected retry

```text
Targeted correction for Kitchen K01 Morning Pantry outside portrait.
Use case: stylized-concept
Asset type: 4:3 outside Context Room portrait, opaque raster illustration
Primary request: a simple rounded pantry threshold with exactly one broad sunlit shelf, one large ceramic bowl, one plain lidded jar and one small herb pot; the threshold itself is the dominant readable silhouette
Style/medium: unmistakably hand-painted 2D matte editorial illustration with gouache-like flat color fields, simplified broad rounded forms, subtle paper texture, limited detail; NOT photography, NOT 3D rendering, NOT interior-design visualization
Composition/framing: straight-on compact threshold vignette, large shapes readable at 192px, generous Linen-colored negative space, no miniature room, no extra wall shelves, no framed art, no foreground countertops
Lighting/mood: quiet diffuse morning light expressed with two or three broad flat tonal shapes, no dramatic rays
Color palette: Linen #FBF6EE, warm cream, pale wood, restrained sage; tiny Harbour Blue-compatible note only if needed; recognition independent of color
Constraints: no people, faces, text, labels, packaging, logos, controls, notifications, photorealism, luxury staging, gradients, glossy surfaces, watermark, knife, flames, alcohol or specific cuisine
```

### Recipes symbol

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Recipes symbol: a closed blank recipe notebook with one simple page-tab notch, organizing saved recipes without suggesting an action.
Composition/framing: one centered symbol on a square transparent canvas, generous even padding, readable at 64px and 96px.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no text, letters, food, checkmark, plus, play, timer, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

### Shopping lists symbol

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Shopping lists symbol: one blank rounded list sheet with exactly three broad horizontal empty slots, with no marks, cart or purchase cue.
Composition/framing: one centered symbol on a square transparent canvas, generous even padding, readable at 64px and 96px.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no text, letters, numbers, checkmarks, cart, bag, currency, plus, arrow, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

### Meal plans symbol

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Meal plans symbol: one simple divided plate beside one broad blank calendar-like page shape, clearly an organization category rather than a timer or start action.
Composition/framing: two shapes unified into one compact centered symbol on a square transparent canvas, generous padding, readable at 64px and 96px.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no text, dates, numbers, clock, play, checkmark, plus, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

### Favorites symbol

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Favorites symbol: one broad bookmark ribbon nested inside a shallow bowl silhouette, denoting a saved category without status or completion.
Composition/framing: one compact centered symbol on a square transparent canvas, generous even padding, readable at 64px and 96px.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no heart, star, checkmark, plus, text, letters, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

### Recently used symbol — rejected first attempt

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Recently used symbol: exactly two gently overlapping blank recipe cards with one subtle receding edge, expressing recency through layering rather than a clock or status badge.
Composition/framing: one compact centered symbol on a square transparent canvas, generous even padding, readable at 64px and 96px.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no text, dates, clock, history arrow, checkmark, notification dot, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

The first attempt added internal lines that could read as baked text. It is
retained under `rejected/` and excluded from the selected manifest.

### Recently used symbol — selected retry

```text
Targeted correction of a Kitchen collection symbol.
Use case: logo-brand
Asset type: Recently used category symbol, transparent PNG
Primary request: exactly two completely blank rounded rectangular recipe cards, offset and gently overlapping; only their outer silhouettes and overlap convey recency.
Style: original vector-friendly emblem, uniform solid Ink #2E2D32 with transparent negative space; bold rounded construction matching the Kitchen open-cupboard mark.
Composition: compact centered square, generous padding, readable at 64px and 96px.
Critical correction: both cards must be entirely blank inside—absolutely no horizontal lines, writing marks, slots, dates, icons or decoration. No clock or history arrow. No gradient, shading, lighting, texture, shadow, 3D, logo or watermark. Genuine transparent background and preserved alpha.
```

### Appliance notes symbol

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Appliance notes symbol: one simple rounded countertop appliance silhouette beside one completely blank note card, clearly reference material and not an on/off control.
Composition/framing: two forms unified into one compact centered symbol on a square transparent canvas, generous padding, readable at 64px and 96px.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no brand, text, writing lines, power symbol, button, plug action, warning, checkmark, plus, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

### Ingredients symbol

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Ingredients symbol: one broad shallow bowl holding exactly three simple abstract ingredient shapes—a single leaf, a single round form and one small grain mound—reduced to a strong category silhouette.
Composition/framing: one compact centered symbol on a square transparent canvas, generous even padding, readable at 64px and 96px and in grayscale.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no specific cuisine, packaging, labels, shopping cue, knife, flame, checkmark, plus, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

### Unfiled symbol

```text
Use case: logo-brand
Asset type: Kitchen direct-browse collection-symbol raster study, transparent PNG
Shared visual bible: adult, calm, original, vector-friendly symbol for Granny's Harbour Blue system; bold rounded silhouette, clean antialiased edges, consistent visual weight with a rounded open-cupboard room mark; every visible symbol pixel should use one uniform solid Ink color #2E2D32.
Primary request: Unfiled symbol: one open shallow in-tray containing a single completely blank loose card at a slight angle, communicating an uncategorized collection without error or warning.
Composition/framing: one compact centered symbol on a square transparent canvas, generous even padding, readable at 64px and 96px.
Critical constraints: genuinely transparent background with preserved alpha; flat one-color form only; no question mark, exclamation, warning triangle, text, writing lines, checkmark, plus, trash, app badge, gradients, lighting, texture, shadows, 3D, commercial logo or watermark.
```

## Saved-output review

| Role | Selected file | Actual dimensions | Alpha | Review note |
|---|---|---:|---|---|
| Room mark K-M01 | `room-kitchen-k01-mark-i01.png` | 1254×1254 | Yes | Clear at 64px and 96px; unwanted faint tonal shading remains. |
| Outside portrait | `room-kitchen-k01-portrait-i01.png` | 1448×1086 | No | Rounded pantry threshold reads at small scale; broad lower quiet field. |
| Interior backdrop | `room-kitchen-k01-backdrop-i01.png` | 1586×992 | No | Central content field is quiet; more spatial/detail realism than the portrait. |
| Decor cluster | `room-kitchen-k01-decor-i01.png` | 1484×1060 | Yes | Correct three-object cluster; edges and transparent margin are intact. |
| Surface motif | `room-kitchen-k01-motif-i01.png` | 1254×1254 | No | Appropriately faint; seamless repeat has not been technically proven. |
| Empty state | `room-kitchen-k01-empty-i01.png` | 1448×1086 | Yes | Blank notebook and empty bowl; no completion cue or baked copy. |
| Recipes | `symbols/room-kitchen-symbol-recipes-i01.png` | 1254×1254 | Yes | Legible, but could be mistaken for a folder without its written label. |
| Shopping lists | `symbols/room-kitchen-symbol-shopping-lists-i01.png` | 1254×1254 | Yes | Three empty slots remain legible at 96px. |
| Meal plans | `symbols/room-kitchen-symbol-meal-plans-i01.png` | 1254×1254 | Yes | Recognizable but materially more complex than the rest of the family. |
| Favorites | `symbols/room-kitchen-symbol-favorites-i01.png` | 1254×1254 | Yes | Bookmark and bowl are clear with the required written label. |
| Recently used | `symbols/room-kitchen-symbol-recently-used-i01.png` | 1254×1254 | Yes | Selected retry removes text-like internal lines. |
| Appliance notes | `symbols/room-kitchen-symbol-appliance-notes-i01.png` | 1254×1254 | Yes | Reads as mixer plus blank card; label remains essential. |
| Ingredients | `symbols/room-kitchen-symbol-ingredients-i01.png` | 1254×1254 | Yes | Strong bowl silhouette; three ingredient forms remain distinct. |
| Unfiled | `symbols/room-kitchen-symbol-unfiled-i01.png` | 1254×1254 | Yes | Tray plus blank card is direct and avoids warning/error language. |

All selected transparent files were confirmed as non-opaque RGBA PNGs. The
symbol family and mark were visually checked on a Linen field at 96px; the
mark was also checked at 64px. Written collection labels remain mandatory.
