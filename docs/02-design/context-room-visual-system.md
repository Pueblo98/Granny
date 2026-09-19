---
title: "Context Room visual asset system"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, context, rooms, assets, accessibility]
related:
  - context-rooms.md
  - context-room-starter-catalog.md
  - context-room-asset-production.md
  - product-design-spec.md
  - design-system.md
  - accessibility.md
---

# Context Room visual asset system

## Purpose

This brief defines the visual pieces needed to make a Context Room recognizable
before entry and atmospheric after entry. It gives image-generation and UI
sessions one bounded asset model instead of asking them to invent a new room
from scratch.

The starter set covers **Kitchen** and **Fitness** with eight proposed visual
packs for each. These are examples and catalog entries, not default rooms every
person must have. The functional T-119 fixture may still use Trips for its
cross-room provenance case.

## Design read

- **Audience and context:** adults with varied vision, motor, language and
  technology experience using a tablet at home.
- **Present goal:** recognize a room quickly, enter it confidently and feel a
  modest change in atmosphere without relearning the product.
- **Emotional posture:** familiar, capable and calm; never clinical, childish,
  gamified or based on nostalgia assumed from age.
- **Active medium:** reviewed, pre-generated browser-prototype assets with
  fictional content.
- **Eventual platform:** adaptive stock-Android UI where text, controls,
  semantics and safety remain native product layers.

## Recommended selection model

The first implementation should use **curated visual packs**, not arbitrary
mix-and-match generation. One pack contains compatible art for every room
surface. During room creation Granny may recommend the best matching reviewed
pack from the local catalog. The person can accept it without another setup
form, choose **Change look**, or use the neutral appearance.

This recommendation is a presentation proposal, not an action permission or a
claim about the person's taste. The assistant does not generate or download
new art at runtime. Trusted UI code filters the catalog for the room type,
accessibility profile, asset availability and current token compatibility,
then renders only a known `pack_id`. A failed or missing asset falls back to
the neutral room without blocking creation.

Start with whole-pack selection. Later testing may permit swapping a backdrop
or decor layer only when their compatibility tags match. Free mixing creates
too many clashing combinations, makes contrast difficult to verify and gives
the model unnecessary visual authority.

## Asset families

Every complete pack has five required masters. Text, buttons and live content
are rendered by the UI and must never be baked into these images.

| Asset role | Where it appears | Master specification | Composition rule |
|---|---|---|---|
| `room_portrait` | The representation seen outside the room in the Rooms library and creation review | 1600×1200, 4:3, WebP or PNG; supply 4:3 and square focal metadata | One clear threshold, facade or symbolic room vignette; readable at small size; no written label inside the art |
| `interior_backdrop` | Behind the room shell after entry | 2560×1600, 16:10, WebP; author with 4:3 and portrait-safe crops | Low-detail central reading field, detail near edges, no important object under the composer, Stop or content column |
| `decor_cluster` | Optional edge or corner reinforcement inside the room | 1400×1000 transparent PNG/WebP | One restrained group of two to four objects; removable without losing room identity |
| `surface_motif` | Very low-contrast texture, divider or empty margin | 1024×1024 seamless tile or scalable SVG when genuinely vector-safe | No high-frequency noise, faux depth behind text or pattern needed to understand the room |
| `empty_state_illustration` | Empty room before content is added | 1200×900 transparent PNG/WebP | Inviting room-related still life; no fake files, metrics, notifications or instructions |

Derived thumbnails and responsive crops come from these masters; they are not
independent designs. Optional motion, sound, weather, people, personal photos
and generated portraits are outside the starter set. If later admitted,
motion must be nonessential and disabled by reduced-motion settings.

## What may vary and what stays fixed

| May vary by pack | Fixed across every room |
|---|---|
| Room portrait, backdrop, removable decor, subtle motif and nonsemantic room accent | Granny identity and voice |
| Warmth, material cues, time-of-day suggestion and amount of decorative detail within reviewed bounds | Round conversation composer, Talk, Type, Menu, Stop and confirmation placement/meaning |
| A room-specific empty illustration | Live text, room name, purpose, item names, counts, source cues and status |
| Decorative cropping for compact, medium and expanded layouts | Action, danger, success, warning and focus semantics |
| Neutral, quiet or standard art intensity | Reading/focus order, accessible names, minimum targets and text scaling |

Private task content, exact action previews, deletion reviews and error states
use opaque product surfaces. They never sit directly on decorative artwork.
At 200% text, combined 300% display scaling, high contrast or screen-reader
simplification, the UI may reduce or remove decor while retaining the large
room name and plain-language scope.

## Room creation behavior

1. The person names a room or describes its purpose.
2. Granny proposes a plain-language purpose and one reviewed visual pack, for
   example: **“I made this Kitchen warm and bright. You can change the look
   anytime.”**
3. The review shows the room name, purpose and a labeled preview. **Create
   room**, **Change look** and **Use plain room** are available by touch,
   keyboard and voice.
4. If the person chooses **Change look**, show no more than four large previews
   at once, followed by **More looks**. Each preview has a written name and
   short mood description; artwork alone is never the label.
5. The selected `pack_id` is saved as room presentation metadata. Changing it
   does not move content, change retrieval scope or create assistant memory
   about the person's personality.

The assistant should usually make the initial recommendation so setup remains
small. It may use the requested room purpose and explicit visual preferences.
It must not infer age, diagnosis, gender, culture, fitness level, wealth or
ability from the room name.

## Catalog contract

Each reviewed entry needs machine-readable metadata equivalent to:

```json
{
  "pack_id": "kitchen-k01-morning-pantry",
  "room_type": "kitchen",
  "display_name": "Morning Pantry",
  "mood": ["bright", "familiar", "quiet"],
  "asset_status": "proposed",
  "assets": {
    "room_portrait": "...",
    "interior_backdrop": "...",
    "decor_cluster": "...",
    "surface_motif": "...",
    "empty_state_illustration": "..."
  },
  "safe_crops": ["4:3", "1:1", "portrait"],
  "decorative_alt": "",
  "compatibility": ["neutral-shell", "large-text", "reduced-motion"],
  "avoid": ["baked-text", "people", "brand-logos", "fake-status"]
}
```

The UI supplies the visible and spoken room label. Purely atmospheric images
use empty alt text; a preview chooser exposes the pack's written name and mood
as the semantic label. Asset metadata is not model-authored at render time.

## Accessibility and dignity gates

- Room and pack names remain readable when images fail or are hidden.
- Portraits differ in silhouette and object grouping as well as color.
- Backgrounds preserve an opaque or sufficiently protected reading surface;
  contrast is measured on the actual rendered composition.
- No pack relies on tiny shelves, detailed floor plans or precise spatial
  memory to locate the room.
- Kitchen art avoids compulsory domestic-role stereotypes. Fitness art avoids
  weight-loss messaging, body judgment, medical rehabilitation cues and
  competitive performance claims.
- People are omitted from the starter asset masters so the system does not
  guess age, body, ethnicity, household or ability. Later human imagery needs
  a separately reviewed representation and rights brief.
- No room looks locked, monitored or clinically assigned. A privacy setting
  is communicated with explicit UI, never a dark door or lock illustration.
- Decorative removal, grayscale and low-bandwidth fallbacks preserve room
  identity and every task.

## Review states

Asset review must cover: library portrait, creation recommendation, selected
and unselected preview, room entry, populated room, empty room, image failure,
offline/model unavailable, 200% text, combined 300% scaling, high contrast,
reduced motion, keyboard focus and decorative-image removal. A beautiful
contact sheet is not enough to admit a pack into the UI catalog.

The [starter catalog](context-room-starter-catalog.md) defines the first 16
packs. The [production brief](context-room-asset-production.md) defines how to
generate, name, inspect and hand them to the prototype.
