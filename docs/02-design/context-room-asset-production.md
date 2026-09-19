---
title: "Context Room asset generation and UI handoff"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, context, rooms, assets, handoff]
related:
  - context-room-visual-system.md
  - context-room-starter-catalog.md
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

The full starter inventory is 16 packs: eight Kitchen and eight Fitness. Each
complete pack contains five masters, for a maximum of 80 reviewed masters plus
derived crops. To avoid spending time polishing rejected directions, generate
and review in the stages below.

## Production sequence

### Batch 1 — concept contact sheets

Generate two labeled review sheets outside the final assets: one with all eight
Kitchen directions and one with all eight Fitness directions. Every tile uses
the same layout and shows:

1. the outside room portrait;
2. a wide interior crop with an empty protected reading field;
3. its decor cluster and motif sample;
4. its empty-state still life;
5. the authored pack ID and name added by the review document, not by the
   image model.

Review silhouette difference, room recognition, dignity, detail density and
whether the directions are meaningfully distinct. A color-only difference is
not enough.

### Batch 2 — first UI-ready packs

Fully generate K01, K02, F01 and F02 first. These four cover a neutral and a
more expressive direction for each room. Export every required master and its
responsive crops. Use them to build the library preview, creation recommendation,
change-look chooser, populated room, empty state and image-failure fallback.

### Batch 3 — catalog expansion

After the first UI review, revise or generate K03–K08 and F03–F08. Do not keep
an option merely to reach eight. Replace duplicate, confusing or inaccessible
directions while retaining stable IDs in review history; approved asset
versions receive explicit version suffixes.

## Prompt frame

Each generation request should name one pack and one asset role. Use this
shared frame, then append the exact row from the starter catalog:

> Create a calm, adult, accessible visual asset for a tablet application's
> Context Room. It belongs to the **[Kitchen/Fitness] — [pack name]** reviewed
> preset. Render **[asset role and required dimensions]**. Use broad readable
> shapes, restrained detail, soft natural depth and a clear focal hierarchy.
> Preserve the specified quiet UI safe zones. No text, numbers, logos, people,
> faces, app controls, notifications, metrics, gradients associated with AI,
> medical cues or childish illustration. The result must remain recognizable
> when cropped and when optional decor is removed.

Role-specific additions:

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

Do not request the style of a living artist or copy a recognizable commercial
interior. Reference composition, material, light and emotional posture instead.

## File and manifest convention

Proposed source location after assets are actually generated:

```text
docs/02-design/mockups/context-rooms/
  contact-sheets/
  kitchen/k01-morning-pantry/
  fitness/f01-morning-stretch/
  manifest.json
  README.md
```

Master naming:

```text
room-kitchen-k01-portrait-v01.webp
room-kitchen-k01-backdrop-v01.webp
room-kitchen-k01-decor-v01.png
room-kitchen-k01-motif-v01.webp
room-kitchen-k01-empty-v01.png
```

The manifest records pack ID, display name, room type, asset paths, intrinsic
dimensions, focal point, safe crops, dominant/lightness tags, compatibility,
generation source/version, review status, reviewer/date and known limits.
It must not contain private prompts, credentials, personal images or invented
accessibility results.

## Export matrix

| Role | Required master | Prototype derivatives | Alpha | Initial loading rule |
|---|---|---|---|---|
| Portrait | 1600×1200 | 800×600, 400×300, 384×384 crop | No | Eager only for visible library rows; preserve written label on failure |
| Backdrop | 2560×1600 | 1600×1000 and 960×1200 safe crop | No | Load after room entry; neutral color appears first |
| Decor | 1400×1000 | 700×500 | Yes | Lazy; omit at large text or constrained width |
| Motif | 1024×1024 seamless | 512×512 | As needed | CSS/UI opacity capped by reviewed preset |
| Empty state | 1200×900 | 600×450 | Yes | Load only when the room has no items/recent work |

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

- Inspect portrait recognition at 192px, grayscale and common color-vision
  simulations; retain the text label in every case.
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

1. one Kitchen and one Fitness portrait in the Rooms library;
2. K01 and F01 recommendation previews in the creation flow;
3. K01 and F01 backdrops with removable decor in a populated room;
4. one empty-state asset for each;
5. **Change look** using four large labeled pack previews per page;
6. a plain neutral fallback and simulated asset-load failure;
7. annotations showing safe zones, crop behavior and decorative semantics.

This handoff prepares visual assets only. It does not implement persistent
rooms, real personal content, runtime image generation, a new model tool or a
production Android resource pipeline.
