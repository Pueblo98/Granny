---
title: "Metaprompt — Context Room assets iteration 1"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, context, rooms, assets, image-generation, metaprompt]
related:
  - context-room-starter-catalog.md
  - context-room-visual-system.md
  - context-room-asset-production.md
  - context-rooms.md
  - mockups/2026-09-19-style-boards/final-harbour-blue/README.md
---

# Metaprompt — Context Room assets iteration 1

Copy the prompt below into a fresh Codex session. It deliberately points the
session to the detailed room files instead of repeating their contents here.
Iteration 1 means the first complete visual identity for each of the six rooms,
with one generated image per actual asset.

```text
Work in the Granny repository at:

  /home/lgtw/Work/granny

Generate Context Room assets iteration 1. Execute the generation work and file
the results; do not return another plan or rewrite this metaprompt.

Use these repository workflows when available:

1. $granny-session-lifecycle
2. $granny-design-handoff
3. $granny-ui-craft in Refine mode
4. $imagegen for every raster asset

This is mockup-only work. Follow the current AGENTS.md exception: work directly
in the primary checkout, preserve unrelated edits, keep everything inside the
existing docs vault, and do not create a worktree, branch, commit, PR or Figma
artifact. Do not edit private Obsidian settings.

## Read before generating

Read these files in order:

- AGENTS.md
- docs/02-design/context-rooms.md
- docs/02-design/context-room-visual-system.md
- docs/02-design/context-room-starter-catalog.md
- docs/02-design/context-room-asset-production.md
- docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md
- docs/02-design/accessibility.md

Visually inspect the selected Harbour Blue reference at original detail:

  docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/harbour-blue-final.png

Then work through these dossiers one at a time. Read the current dossier again
immediately before generating that room:

- docs/02-design/context-room-catalog/kitchen.md
- docs/02-design/context-room-catalog/fitness.md
- docs/02-design/context-room-catalog/trips.md
- docs/02-design/context-room-catalog/garden.md
- docs/02-design/context-room-catalog/reading.md
- docs/02-design/context-room-catalog/projects.md

The dossier owns the exact subject, objects and avoid rules. Do not improvise a
different pack when a row already defines it.

## Exact scope

Generate only the first complete pack for each room:

- Kitchen: K01 Morning Pantry with K-M01
- Fitness / Movement: F01 Morning Stretch with F-M01
- Trips: T01 Light Packing with T-M01
- Garden: G01 Morning Allotment with G-M04
- Reading: R01 Window Seat with R-M07
- Projects / Hobbies: P01 Open Worktable with P-M01

For every room, generate these as separate image files:

1. one room mark;
2. one outside room portrait;
3. one interior backdrop;
4. one transparent decor cluster;
5. one subtle surface motif;
6. one transparent empty-state illustration;
7. each of the dossier's eight collection symbols as eight separate images.

That is 14 images per room and 84 images total. One image-generation call must
produce one asset. Do not combine assets into contact sheets, sprite sheets,
collages or multi-panel images. Do not generate pack 02–08 in this session.

The marks and symbols are iteration-1 transparent raster studies with a clean,
vector-friendly appearance. Do not claim they are SVG masters.

## Shared art narrative

Treat all six rooms as spaces in one calm, carefully kept world illustrated by
one artist. The family should feel adult, familiar, quietly optimistic and
ready to use. Use soft matte editorial illustration, broad rounded forms,
restrained tactile materials, diffuse natural light and generous empty space.
Keep perspective, edge softness, object simplification, shadow strength and
level of detail consistent across every room.

Harbour Blue remains the product shell: Linen #FBF6EE, white surfaces, Ink
#2E2D32, Accent #2C5981 and Outline #597DA0. Room artwork may add one restrained
nonsemantic accent family appropriate to the room, but it must remain compatible
with the Linen canvas and may never redefine Send, focus, Stop, warning or
confirmation colors.

Every room must still be recognizable without color. Distinguish rooms through
silhouette, threshold shape, key objects and material cues. Marks and collection
symbols share the same bold silhouette language, corner character, visual weight
and fill/stroke balance. Portraits and backdrops share the same camera height,
lighting logic and illustration finish. Decor and empty states must look as if
they came from their room, not from a separate clip-art library.

No people, faces, mascots, separate room assistants, emoji, childish cartoon
styling, luxury staging, clinical cues, AI glow, gradients, glass effects,
commercial logos, watermarks or baked text. Do not imitate a living artist.
Artwork must never contain buttons, counts, notifications, completion states,
real documents or personal information.

## Work one asset at a time

Before the first image, create:

  docs/02-design/mockups/context-rooms/iteration-1/visual-bible.md

Record the shared art narrative, palette relationship, materials, lighting,
perspective, mark/icon construction and avoid rules there. Apply that same
visual bible to every prompt. Do not change the common style halfway through
because one room suggests a different aesthetic.

For each room:

1. read its dossier;
2. extract the exact pack-01 row and eight collection-symbol names;
3. build each prompt from the shared visual bible, the role requirements in
   context-room-asset-production.md and the exact dossier description;
4. call the built-in image-generation tool separately for each asset;
5. move or copy the project-bound output into the iteration folder immediately;
6. inspect it at original detail for subject, crop, text, watermark, style drift,
   safe space and transparency where required;
7. if it clearly fails, regenerate only that asset with one targeted correction;
8. record the final prompt, path, dimensions, alpha state and review note before
   continuing to the next asset.

Do not ask Simon to supervise each room. Continue through all six unless the
image tool is unavailable or a repository conflict prevents safe filing. If the
built-in tool fails, report the blocker; do not silently switch to an API/CLI
workflow that needs credentials.

## Filing

Use this structure:

  docs/02-design/mockups/context-rooms/iteration-1/
    README.md
    visual-bible.md
    manifest.json
    kitchen/
      prompts.md
      room-kitchen-k01-mark-i01.png
      room-kitchen-k01-portrait-i01.png
      room-kitchen-k01-backdrop-i01.png
      room-kitchen-k01-decor-i01.png
      room-kitchen-k01-motif-i01.png
      room-kitchen-k01-empty-i01.png
      symbols/
    fitness/
    trips/
    garden/
    reading/
    projects/

Apply the same naming pattern in every room and give every symbol its own file,
for example `room-kitchen-symbol-recipes-i01.png`. Never overwrite a prior
iteration. Keep rejected retries only when they provide useful review history;
label them clearly and keep them out of the manifest's selected path.

The README should embed all assets by room, state the selected pack/mark IDs,
link the source dossier, summarize consistency and room recognition, and list
honest limits. Use Markdown embeds as the review gallery; do not create an extra
contact-sheet image. The manifest should record one entry per image with room,
pack, mark or symbol ID, role, file path, actual dimensions, alpha state,
prompt-log path and review status.

Add the iteration to `docs/02-design/mockups/README.md`, create a contemporaneous
session record and update the current milestone only enough to make the work
discoverable. Preserve earlier asset briefs and Home/style-board iterations.

## Review and finish

After all 84 assets exist:

- compare the six marks together at 64px and 96px without changing their files;
- inspect portraits at small Home/library scale;
- confirm backdrops leave a quiet central content region;
- confirm decor and empty-state assets have real transparency;
- confirm all 48 symbols remain distinct and understandable beside written
  labels;
- check that removing every decorative asset leaves room identity and UI
  navigation understandable;
- record any failed or uncertain item honestly in the manifest/README.

Run:

  python3 scripts/cockpit.py --write
  python3 scripts/cockpit.py --check
  python3 scripts/validate-docs.py
  git diff --check

Inspect every saved file and the README embeds, then open the iteration README
in the primary Obsidian vault. Stop after iteration 1. Do not select final
production art, generate variants 02–08, implement the UI, add persistent room
data or claim accessibility/user validation.

Report the folder, generated/failed asset counts, any regenerated assets,
validation results and the strongest consistency or recognition concerns for
Simon to review.
```
