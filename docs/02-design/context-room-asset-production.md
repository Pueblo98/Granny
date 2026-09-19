---
title: "Context Room asset generation and UI handoff"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, context, rooms, assets, handoff]
related:
  - context-room-visual-system.md
  - context-room-starter-catalog.md
  - context-room-iteration-1-metaprompt.md
  - context-rooms.md
  - browser-prototype.md
  - accessibility.md
---

# Context Room asset generation and UI handoff

## Deliverable

Produce a reviewed starter catalog that a deterministic prototype can load by
`pack_id`. The image model creates candidate artwork; it does not decide which
candidate is approved, write UI text, change room behavior or run inside the
product.

The full idea inventory is 48 packs across six room archetypes: Kitchen,
Fitness, Trips, Garden, Reading and Projects. Each dossier also defines eight
room marks and an eight-symbol direct-browse kit. This is a choice space, not a
request to render hundreds of final assets immediately. To avoid polishing
rejected directions, generate and review in the stages below.

## Production sequence

### Batch 1 — concept contact sheets

Generate twelve labeled review sheets outside the final assets: one eight-mark
sheet and one eight-pack environment sheet for each of the six room dossiers.
Every environment tile uses the same layout and shows:

1. its paired room mark beside a written room name;
2. the outside room portrait;
3. a wide interior crop with an empty protected reading field;
4. its decor cluster and motif sample;
5. its empty-state still life;
6. the authored pack ID and name added by the review document, not by the
   image model.

Review silhouette difference, room recognition, dignity, detail density and
whether the directions are meaningfully distinct. A color-only difference is
not enough.

### Batch 2 — one UI-ready identity per room

Fully generate K01, F01, T01, G01, R01 and P01 first. These neutral candidates
give the UI one complete identity for every defined room. Export the mark,
portrait, backdrop, decor, motif, empty state and room-specific symbol kit.
Use them to build the Rooms library, creation recommendation, change-look
chooser, populated room, empty state and image-failure fallback. Home may show
only the one selected room/context region allowed by its contract.

### Batch 3 — expressive alternatives

After the first in-UI review, fully generate K02, F02, T02, G02, R02 and P02 as
the more expressive comparison set. Review whole-pack selection and mark
recognition before exposing independent mark changes.

### Batch 4 — catalog expansion

Revise or generate the remaining `03`–`08` directions only after the first two
per room are useful. Do not keep an option merely to reach eight. Replace
duplicate, confusing or inaccessible directions while retaining stable IDs in
review history; approved asset versions receive explicit version suffixes.

## Prompt frame

Each generation request should name one pack and one asset role. Use this
shared frame, then append the exact row from the starter catalog:

> Create a calm, adult, accessible visual asset for a tablet application's
> Context Room. It belongs to the **[room archetype] — [pack name]** reviewed
> preset. Render **[asset role and required dimensions]**. Use broad readable
> shapes, restrained detail, soft natural depth and a clear focal hierarchy.
> Preserve the specified quiet UI safe zones. No text, numbers, logos, people,
> faces, app controls, notifications, metrics, gradients associated with AI,
> medical cues or childish illustration. The result must remain recognizable
> when cropped and when optional decor is removed.

Role-specific additions:

- **Room mark:** one strong one-color doorplate emblem; recognizable at 64px;
  no letters, emoji, tiny scene, app-badge treatment or separate-agent mascot.
- **Portrait:** one threshold or compact vignette; bold silhouette; readable
  at 192px; no miniature room floor plan.
- **Backdrop:** 16:10 adaptive scene; low detail through the middle 60%; keep
  important objects outside both left and right content-safe zones.
- **Decor:** transparent background; two to four objects; clean edge; no cast
  shadow that assumes a fixed UI surface.
- **Motif:** seamless, very low contrast, broad scale; verify it can disappear
  without changing meaning.
- **Empty state:** transparent still life with generous empty space; no fake
  content or implied task completion.
- **Collection symbols:** eight matching labeled concepts as separate SVG-like
  masters; each organizes content and must not look like an action/status.

Do not request the style of a living artist or copy a recognizable commercial
interior. Reference composition, material, light and emotional posture instead.

## File and manifest convention

Proposed source location after assets are actually generated:

```text
docs/02-design/mockups/context-rooms/
  contact-sheets/
  kitchen/k01-morning-pantry/
  fitness/f01-morning-stretch/
  trips/t01-light-packing/
  garden/g01-morning-allotment/
  reading/r01-window-seat/
  projects/p01-open-worktable/
  manifest.json
  README.md
```

Master naming:

```text
room-kitchen-k01-portrait-v01.webp
room-kitchen-k01-mark-v01.svg
room-kitchen-k01-backdrop-v01.webp
room-kitchen-k01-decor-v01.png
room-kitchen-k01-motif-v01.webp
room-kitchen-k01-empty-v01.png
room-kitchen-symbol-recipes-v01.svg
```

The manifest records pack ID, display name, room type, asset paths, intrinsic
dimensions, focal point, safe crops, dominant/lightness tags, compatibility,
generation source/version, review status, reviewer/date and known limits.
It must not contain private prompts, credentials, personal images or invented
accessibility results.

## Export matrix

| Role | Required master | Prototype derivatives | Alpha | Initial loading rule |
|---|---|---|---|---|
| Room mark | 1024×1024 SVG + review PNG | 192×192, 96×96, 64×64 | Yes | Load with written room label; hide on failure without losing target |
| Portrait | 1600×1200 | 800×600, 400×300, 384×384 crop | No | Eager only for visible library rows; preserve written label on failure |
| Backdrop | 2560×1600 | 1600×1000 and 960×1200 safe crop | No | Load after room entry; neutral color appears first |
| Decor | 1400×1000 | 700×500 | Yes | Lazy; omit at large text or constrained width |
| Motif | 1024×1024 seamless | 512×512 | As needed | CSS/UI opacity capped by reviewed preset |
| Empty state | 1200×900 | 600×450 | Yes | Load only when the room has no items/recent work |
| Collection symbols | Eight 96×96 SVGs per room | 192×192 review PNGs | Yes | Load only beside written category labels; neutral generic symbol on failure |

WebP is preferred for opaque raster art and PNG for transparent review assets.
Do not upscale weak generations. Retain lossless source masters outside the
runtime bundle if the generation tool provides them. Production Android format
and compression remain a later implementation decision.

## Review checklist

### Visual and product review

- The room type is recognizable without its color and without tiny details.
- The eight directions differ in material, silhouette, light and object
  grouping, rather than only hue.
- The scene supports one assistant and the existing conversation shell; it
  does not resemble a separate game, app launcher or specialist agent.
- No decorative object looks tappable unless the UI deliberately gives it a
  semantic control.
- No fake files, counts, progress, health metrics, timers or notifications
  appear inside artwork.
- The neutral fallback feels complete rather than broken.

### Accessibility review

- Inspect mark recognition at 64/96px and portrait recognition at 192px,
  grayscale and common color-vision simulations; retain the text label in
  every case.
- Test the actual UI overlay at default, 200% text and combined 300% scaling.
- Check opaque reading surfaces and actual rendered contrast; do not calculate
  contrast from prompt colors alone.
- Hide each decorative layer and confirm that room identity, navigation and
  task understanding remain.
- Verify keyboard focus, TalkBack order and pointer targets in UI code; an
  image review cannot establish these.
- Confirm reduced-motion mode has no missing information. The starter assets
  are static.

### Technical review

- Exact dimensions, format, alpha, file size, crop and focal metadata match the
  manifest.
- No embedded text, watermark, logo, EXIF location or private generation data.
- Missing/corrupt asset and offline behavior falls back locally without moving
  controls or preventing entry.
- Catalog lookup accepts only known pack and asset IDs; user/model strings are
  never treated as file paths.
- Every accepted revision is visually inspected in the target prototype, not
  only as a source image.

## First UI handoff

The first frontend checkpoint needs:

1. six written room rows in the Rooms library with K01/F01/T01/G01/R01/P01
   marks and portraits; Home still shows no grid and at most one selected row;
2. one recommendation preview per room in the creation flow;
3. one complete backdrop/decor/empty-state set per room;
4. one eight-symbol direct-browse kit per room, always with written labels;
5. **Change look** using four large labeled pack previews per page;
6. a plain neutral fallback plus simulated mark, portrait and backdrop failure;
7. annotations showing safe zones, crop behavior and decorative semantics.

This handoff prepares visual assets only. It does not implement persistent
rooms, real personal content, runtime image generation, a new model tool or a
production Android resource pipeline.

The copy-ready [iteration-1 metaprompt](context-room-iteration-1-metaprompt.md)
turns the first identity for all six rooms into 84 separately generated and
reviewed image files. It deliberately avoids contact-sheet composites and
pack-02–08 generation.
