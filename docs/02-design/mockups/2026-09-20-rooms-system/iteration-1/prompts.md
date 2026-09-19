---
title: "Rooms system iteration 1 — generation specifications"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, mockups, prompts, context-rooms]
related:
  - README.md
  - manifest.json
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
  - ../../2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
---

# Rooms system iteration 1 — generation specifications

Each numbered image was generated separately with the built-in image tool. The
selected Harbour Blue board, Explicit Scroll Row Home, Kitchen vertical slice
and iteration-1 room art were supplied as local references where relevant.
These prompts are reproducible design specifications; image-model lettering and
geometry remain approximate.

## Common prompt foundation

> Create one polished full-screen 16:10 landscape tablet UI mockup for Granny.
> Preserve the selected Harbour Blue system: Linen `#FBF6EE`, white bounded
> surfaces, Ink `#2E2D32`, Accent `#2C5981`, Outline `#597DA0`, Send `#165D9C`,
> focus-ring space for `#4930A1`, and danger `#962F43` only for destructive
> actions. Use adult readable typography approximating Bricolage Grotesque 600
> and DM Sans 400/600, broad semantic targets and generous whitespace. Keep
> written Home, Rooms and Menu; preserve the large Round bottom composer where
> the current task does not temporarily contain focus. No device bezel,
> gradients, glow, glass, deep shadows, AI decoration, people, real data,
> icon-only essential actions, bottom tabs or watermarks. Essential labels are
> live UI copy outside artwork. The reading order must reflow vertically.

## Frame-specific prompts

### 01 — Full Rooms library

> Heading “Rooms”; support “Choose a room, search everything, or browse without
> a room.” Expose Search all rooms, All items, Unfiled and Create a room as quiet
> written routes. Show six open, borderless portrait targets on Linen, not boxed
> cards: Kitchen / Recipes, lists and cooking plans; Fitness / Movement and
> routines; Trips / Plans and packing; Garden / Plants and seasonal plans;
> Reading / Books and saved articles; Projects / Notes, materials and things to
> do. Keep abundant space and the Round composer with Type a request, Ask me
> anything…, Talk and Send.

### 02 — Search all rooms

> Heading “Search all rooms”; support “Find an item without choosing a room
> first.” Large search field with fictional query “soup” and Clear. Show “3
> fictional results” as plain broad rows: Vegetable soup / Recipe · Kitchen;
> Soup shopping list / Shopping list · Kitchen; Tomato soup notes / Garden
> journal · Garden. Add Back to Rooms. No filter chips or thumbnails.

### 03 — All items and Unfiled

> Heading “All items”; support “Everything stays available even when it is not
> in a room.” Show written All items selected and Unfiled / 2 fictional items,
> plus Search all items. Sections In rooms and Unfiled contain Vegetable soup /
> Recipe · Kitchen, Weekend packing list / Packing list · Trips, Soup photo /
> Not in a room and New note / Not in a room. Use plain rows, not cards.

### 04 — Create room

> Keep Rooms visible behind a calm right-side sheet. Heading “Create a room”;
> support “Give this space a name and a simple purpose.” Fields Room name / Music
> and Purpose / Albums, playlists and listening notes. Show one Suggested room
> look with Change look, then “You can change the name, purpose or look later.”
> Actions Create room and Cancel. Do not show template or pack grids.

### 05 — Rename and purpose

> Keep Kitchen visible behind a right-side Room details sheet. Fields Kitchen and
> Recipes, lists and cooking plans; a small written preview; statement “Changing
> these details does not move or delete anything.” Actions Save changes, Cancel,
> and a visually separated Archive or delete room route.

### 06 — Organize item

> Over Vegetable soup, show “Organize Vegetable soup” and “Currently in
> Kitchen”. Three large consequence-first rows: Add to another room / Keep it in
> Kitchen too; Move to another room / Remove it from Kitchen after adding it
> elsewhere; Remove from Kitchen / The recipe stays in All items. State that
> organizing changes where the item is found and does not delete it. Cancel.

### 07 — Move item with Undo

> On All items, Vegetable soup is Recipe · Garden. Above the composer, show a
> persistent white outlined receipt: “Vegetable soup moved”; “Moved from Kitchen
> to Garden.”; written Undo and Dismiss. Include both written room names and
> small marks. Do not use an ephemeral toast or color-only success.

### 08 — Archive room

> Over the Rooms library show “Archive Trips?” with Trips / Plans and packing.
> Explain that Trips will be hidden from Home and Rooms, its items remain in All
> items and it can be restored. Actions Archive room and Cancel. State “Nothing
> will be deleted.” Use ordinary Harbour Blue, not danger red.

### 09 — Restore room

> Heading “Archived rooms”; explain archived rooms are hidden from Home but
> their items stay available. Show Back to Rooms, one open Trips row with status
> Archived and written Restore Trips, “No other archived rooms”, Browse All
> items, and the composer.

### 10 — Delete room only

> Over Kitchen show “Delete Kitchen room?” Explain that room organization will
> be removed while recipes, lists and notes remain in All items. Actions: danger
> Delete room only, Archive instead, Cancel. Show a separated Delete underlying
> items… route. Never combine the two scopes.

### 11 — Delete underlying items

> On a separate large surface show eyebrow “Separate data deletion” and heading
> “Delete Kitchen items?” Explain this removes selected items, not just the room.
> List Vegetable soup / Recipe, Soup shopping list / Shopping list and Appliance
> note / Note. State “3 items will be deleted from Granny. Originals in other
> apps or files are not included unless listed here.” Add Review where these
> items came from, danger Delete 3 items, Cancel, and “This cannot be undone in
> this mockup.”

### 12 — Cross-room source

> Keep Kitchen unmistakably current with Kitchen pantry/worktop atmosphere and
> no Trips scenery. User asks “What should I pack for cooking on a trip?” Granny
> answers “The portable blender is already on your packing list, so I’d keep the
> soup plan simple.” Add one compact cue: Also used from Trips; Weekend packing
> list; It mentions the portable blender; View source; Exclude this source.

### 13 — Sensitive source denied

> In Kitchen, show a fictional trip-food request and answer “I can help with the
> Kitchen information I have.” Add one ordinary outlined panel: “Trips source
> not used”; “Granny did not use ‘Passport details’ from Trips because that
> source is private.” Actions Continue without it and Review access. Reveal no
> protected content and do not imply access was granted.

### 14 — Empty library

> Heading “Rooms”; empty heading “No rooms yet”; copy “You can still ask Granny
> anything. Create a room when it would help organize something.” Show a
> removable quiet doorway illustration, Create a room, Browse All items and the
> universal composer. No template suggestions or empty grid.

### 15 — Loading

> Heading Rooms with explicit status “Loading rooms…” and “Your conversation is
> still available.” Show three neutral portrait and text placeholders directly
> on Linen, without shimmer or progress percentage. Keep usable written utility
> routes and the composer without implying loading has completed.

### 16 — Offline

> Persistent in-page band: “You’re offline”; “You can browse saved room items.
> Search and cross-room updates may be limited.” Actions Browse saved items and
> Try again. Show Kitchen, Trips and Reading with “Saved on this tablet”. In the
> composer show “Some requests may need a connection.” Do not claim that every
> function is available.

### 17 — Missing artwork

> Repeat the full library but give Garden no portrait. In the same open portrait
> area show a neutral outlined room mark and “Artwork unavailable”; preserve live
> Garden and Plants and seasonal plans beneath it. The whole entry remains as
> navigable as the other rooms. Do not use a broken-image browser glyph.

## Targeted correction

The first cross-room source output put suitcase and travel scenery around the
Kitchen conversation. It is preserved as
`rejected/12-cross-room-source-trips-scenery-rejected.png`. The selected retry
added the explicit prohibition on Trips scenery and used Kitchen backdrop as a
reference; only the compact source cue now represents Trips.
