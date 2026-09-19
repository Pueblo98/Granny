---
title: "Metaprompt — Harbour Blue Home and Context Rooms mockup exploration"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, mockups, metaprompt, home, context-rooms]
related:
  - mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - mockups/2026-09-19-style-boards/final-harbour-blue/README.md
  - brand-and-visual-identity.md
  - conversation-first-plan.md
  - context-rooms.md
  - context-room-visual-system.md
  - product-design-spec.md
  - design-system.md
---

# Metaprompt — Harbour Blue Home and Context Rooms mockup exploration

> [!warning] Historical execution prompt — do not rerun as the current brief
> This prompt produced the initial comparison rounds. Simon subsequently
> selected [Explicit Scroll Row](mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md)
> under [ADR-0016](../09-decisions/ADR-0016-explicit-home-room-row.md). Future
> sessions must start from that selected structure rather than regenerate the
> four-way Home exploration or follow the older zero-or-one-region constraint.

Copy the prompt below into a fresh design/image-generation session. It is an
execution prompt: the session should inspect the references, generate and file
the first mockup batch, update its review README and stop at the named visual
checkpoint. It should not return another plan instead of making the mockups.

```text
You are starting a bounded Granny Stage 1 UI mockup session in:

  /home/lgtw/Work/granny

Your immediate job is to generate the first full-screen Home-load composition
variations using Simon's selected Harbour Blue visual system. Begin with Home.
Do not implement frontend code, build Android, create Figma frames or generate
the full room catalog in this first checkpoint.

Use these skills/workflows if available:

1. $granny-session-lifecycle for repository/vault continuity.
2. $granny-design-handoff for product, state and accessibility authority.
3. $granny-ui-craft in Explore mode for structurally different compositions.
4. $imagegen for the actual raster mockups.

This is mockup-only work. Follow the current AGENTS.md mockup exception: work
in the primary root checkout, preserve all unrelated local edits, save assets
inside the existing docs vault, and do not create a worktree, task branch, PR
or merge ceremony for this round. Do not modify private Obsidian settings.

## Read and inspect before generating

Read these exact sources in order:

- AGENTS.md
- docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md
- docs/02-design/brand-and-visual-identity.md
- docs/02-design/conversation-first-plan.md
- docs/02-design/context-rooms.md
- docs/02-design/context-room-visual-system.md
- docs/02-design/context-room-starter-catalog.md
- docs/02-design/product-design-spec.md, especially SCR-003, SCR-016 and SCR-017
- docs/02-design/design-system.md, especially CMP-007, CMP-010 and CMP-011
- docs/02-design/accessibility.md

Visually inspect this selected reference at original detail before prompting:

  docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/harbour-blue-final.png

Do not use earlier Soft Plum, Linen-shortlist or identity boards as competing
directions. Harbour Blue is Simon's current selected system. Earlier boards are
history only.

## Product understanding to preserve

Granny is a temporary codename for an AI-first stock-Android tablet app that
helps a person get useful outcomes without navigating a maze of apps. The
product should feel calm, adult, capable, warm and candid. It is intended to be
usable by older adults and people with varied access needs without looking
clinical, childish, patronizing or “made for old people.”

Home is a conversation-first starting point. The person can type or explicitly
start Talk. The app may show useful contextual content, but Home is not a
feature dashboard. Context Rooms are optional recognizable spaces around the
same assistant. They organize related material and narrow context without
creating separate Kitchen/Fitness personalities.

The design must make these truths visible:

- Home can handle any ordinary request; selecting a room is never mandatory.
- It is the same Granny inside and outside rooms.
- Rooms are directly navigable by touch and do not trap content behind chat.
- Home may show zero or one room/context region, never a room grid, shelf,
  carousel or pile of widgets.
- Talk, Type, Menu and active-task Stop keep stable meanings and locations.
- Idle Home does not show Stop because no task is running.
- Essential navigation is written and recognizable; never icon-only.
- The interface uses few controls because each visible control earns its
  place, not because navigation or safety has been hidden.

## Lock the selected visual language

Use the selected Harbour Blue roles exactly as written:

- Canvas: #FBF6EE — Linen off-white page background.
- Surface: #FFFFFF — composer and context surfaces.
- Ink: #2E2D32 — primary copy and control labels.
- Accent: #2C5981 — primary contextual action.
- Outline: #597DA0 — ordinary composer, panel and room-entry boundary.
- Send: #165D9C — circular Send control with white paper-plane symbol.
- Focus ring: #4930A1 — separated outer ring; do not use as ordinary border.
- Stop/danger: #962F43 — only for Stop or genuine destructive treatment.
- On-colour: #FFFFFF.

Typography intent:

- Bricolage Grotesque 600 for large display headings.
- DM Sans 400 for body/input and 600 for controls.
- If exact font files are unavailable, approximate honestly and record that in
  the README. Do not silently claim exact font fidelity.

Use the selected Round conversation composer: a long, smoothly rounded white
speech balloon with a short lower-left tail and Harbour Blue outline. It must
look unmistakably like a place to write, not like a decorative chat bubble.
Every variation must show:

- persistent small label: “Type a request”;
- a visible writing line/caret area;
- invitation text: “What would you like to do?” or “Ask me anything…”;
- outlined microphone plus written “Talk”;
- blue circular paper-plane control plus written “Send”.

Keep the composer near the bottom of Home so it feels continuously available.
It may sit in normal document flow when scaling requires it. Do not turn it
into a thin phone-style input bar, floating glass capsule or generic chatbot
footer. Do not add gradients, glow, glass, shadows for depth, AI sparkles,
animated orbs or decorative robot imagery.

## First checkpoint: four Home-load directions

Generate four meaningfully different full-screen landscape tablet mockups.
Use the same visual system, copy scale, fictional content and control semantics
in every direction. Vary information sequence, use of space, relationship
between Home and one room, and the first thing that receives attention. Do not
make four color skins of one layout.

Use a representative 16:10 tablet composition. Treat the mockup as a design
reference, not accepted Android pixel geometry. Keep generous margins, large
text, broad touch targets and enough room for 200% text reflow.

### Direction A — Open Canvas

The most minimal Home:

- small “Granny” codename or quiet Home identity at upper left;
- one written Menu action at upper right;
- a generous central welcome: “What would you like to do?”;
- one short supporting line explaining that the person can ask naturally;
- a quiet written Rooms route that is discoverable but visually secondary;
- the large Round conversation composer anchored near the bottom;
- no context panel and no room artwork.

This direction tests whether strong writing affordance plus one Rooms route is
enough. It must not feel blank, unfinished or voice-only.

### Direction B — One Familiar Room

Home with one recognizable room entry:

- the same stable Home identity, Menu and bottom composer;
- one large but restrained Kitchen entry using a room portrait or threshold;
- written label “Kitchen” and purpose “Recipes, lists and cooking plans”;
- the whole labeled room surface is the target; do not add an extra Open
  button unless the structure truly needs one;
- a separate quiet Rooms route makes the full library discoverable;
- no second room, no room strip and no carousel.

This direction tests whether one visual room strengthens recognition without
turning Home into a launcher.

### Direction C — Continue Something Useful

Home with one CMP-010 continuation panel rather than a general room shortcut:

- the same stable Home identity, Menu and bottom composer;
- one context panel: “Continue in Kitchen” with “Vegetable soup” as fictional
  recent work;
- one clear contextual action such as “Open Kitchen” and a secondary “Hide”;
- room source/purpose visible in plain language;
- the panel must look like useful context, not a permanent widget or ad;
- no other tiles, suggestions, recent items or prompt chips.

This direction tests task continuity. Use only fictional data and do not imply
the soup was actually saved or recently used by a real person.

### Direction D — Room at the Edge

An expanded-tablet composition with one room presence at the side:

- a visually asymmetric layout rather than a centered stack;
- invitation and writing composer remain the primary action region;
- one restrained Kitchen threshold/portrait occupies an edge zone and carries
  its written name and purpose;
- the room art never sits behind input text and never moves the stable
  composer controls;
- annotate in the README that this side-by-side structure must stack into one
  vertical sequence on narrow screens or at large text;
- no second room and no decorative floor plan.

This direction tests whether Home can hint at spatial rooms while remaining a
conversation surface.

## Common fixture and visible copy

Hold this content constant unless a direction requires the named variation:

- Product marker: “Granny” (codename; do not design a final logo).
- Main invitation: “What would you like to do?”
- Supporting line: “Ask in your own words. You can type or talk.”
- Composer label: “Type a request”
- Composer invitation: “Ask me anything…”
- Controls: “Talk”, “Send”, “Menu”, “Rooms”
- Room: “Kitchen”
- Room purpose: “Recipes, lists and cooking plans”
- Continuation only: “Continue in Kitchen” / “Vegetable soup” / “Open Kitchen” / “Hide”

Do not add weather, clock, news, health scores, streaks, family alerts,
notification counts, fake memories, suggested-prompt chips or a bottom app
navigation bar. Do not use “Good morning” unless it is explicitly presented as
fictional/time-dependent in the review notes; the neutral invitation is safer.

## Navigation and low-button rules

At idle, prioritize only:

1. the writing surface;
2. Talk and Send inside the composer;
3. quiet Menu;
4. Rooms or the one room/context surface.

Prefer one large semantic target with a clear written label over a card plus
several internal buttons. Do not create icon-only Menu/Rooms controls. Do not
repeat Home, Rooms and Menu in several navigation regions. Avoid persistent
bottom tabs, left rails, app grids and button rows across the top.

“Few buttons” does not allow hiding privacy, accessibility, direct browsing or
Stop behind model-only phrases. Those paths belong in the wider product even
if the idle mockup keeps them quiet.

## Accessibility and visual review requirements

Each mockup must visibly support:

- essential text at high contrast on Linen or white surfaces;
- room identity through written name plus visual reinforcement;
- controls large enough to become at least 56dp equivalents in implementation;
- primary/Stop controls capable of at least 64dp equivalents;
- no color-only meaning;
- no essential text baked into generated room art;
- obvious focus-ring space without clipping;
- a reading order that becomes a simple vertical sequence;
- decor that can be removed without losing navigation or meaning.

Do not claim the raster image proves contrast, Android dp sizes, TalkBack,
keyboard order or older-adult comprehension. Record those as unrun checks.

## Generate, file and document the artifacts

Create this folder:

  docs/02-design/mockups/2026-09-19-harbour-blue-home/round-1/

Save four individual images with stable names:

  01-open-canvas.png
  02-one-familiar-room.png
  03-continue-something-useful.png
  04-room-at-the-edge.png

Also create:

- `comparison.png` — the four directions on one review sheet with labels
  outside the product screenshots;
- `README.md` — local embeds, exact generation prompts, source reference,
  structural thesis, deliberate omissions, fidelity limits and a review table;
- a scoped contemporaneous session record under
  `docs/10-execution/sessions/` following the repository template.

Update `docs/02-design/mockups/README.md`, the style-board/index note if it is
the appropriate navigation owner, and the current milestone only as needed to
make the new round discoverable. Preserve the selected Harbour Blue final
folder unchanged.

Keep prompts and labels in Markdown. Generated images must contain no private
data, real names, watermarks, credentials or fake research claims. The room and
recent-work content is fictional.

After writing the files:

- run `python3 scripts/cockpit.py --write`;
- run `python3 scripts/cockpit.py --check`;
- run `python3 scripts/validate-docs.py` and distinguish any pre-existing local
  note errors from errors introduced by this session;
- run `git diff --check`;
- inspect every image at full size and as an Obsidian embed;
- open the comparison or README in the primary Obsidian vault.

## Stop point and report

Stop after the four Home directions and comparison sheet. Do not select a
winner on Simon's behalf and do not continue into a full Rooms library,
Kitchen interior, Fitness interior or production frontend yet.

Report:

- exact artifact paths;
- one-sentence thesis and main sacrifice for A, B, C and D;
- any image-generation errors or visual mismatches;
- checks run and known limits;
- the single review question: which Home direction should be refined, or which
  parts should be combined without creating a busier fifth design?

After Simon selects a direction, the next mockup round may extend that exact
Home structure to a calm Rooms library, one Kitchen room, one Fitness room,
direct browse/search and room creation. Preserve Harbour Blue and the same
composer instead of reopening palette or input-shape exploration.
```

## Expected outcome

The prompt deliberately separates **Home composition selection** from later
room illustration and frontend implementation. The first batch compares four
structures against one visual system and one content fixture. This prevents a
more detailed room scene from winning merely because it is more decorative.
