---
title: "Rooms system mockups — iteration 1"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, mockups, context-rooms, harbour-blue]
related:
  - ROOMS-SYSTEM-IMPLEMENTATION-METAPROMPT.md
  - prompts.md
  - manifest.json
  - ../../../context-rooms.md
  - ../../../product-design-spec.md
  - ../../../design-system.md
  - ../../../accessibility.md
  - ../../2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
  - ../../../../10-execution/sessions/2026-09-20-rooms-system-iteration-1.md
---

# Rooms system mockups — iteration 1

This proposed first visual round extends the selected Harbour Blue shell from
Home and the Kitchen slice into the remaining Rooms-library, organization,
recovery, source-disclosure and degraded states. It contains 17 individual
landscape-tablet references plus a derived comparison sheet.

Simon has not yet selected these structures. Review the images first; only the
parts Simon accepts should later be translated into replicable PRD, screen and
component instructions. A polished raster does not change the product contract.

**Implementation handoff, Simon, 2026-09-20:** after reviewing this round,
Simon authorized the active frontend session to implement the complete
fictional Rooms-system slice. Use the bounded
[implementation metaprompt](ROOMS-SYSTEM-IMPLEMENTATION-METAPROMPT.md). This
authorizes prototype implementation of the references; it does not turn the
rasters into production evidence or authorize persistence, backend retrieval or
native Android work.

![Rooms system iteration 1 comparison sheet with labels outside the product screens](comparison.png)

## Structural thesis

Rooms should behave like calm, directly browsable places rather than a tile
dashboard. Open portraits provide recognition, plain rows provide direct access
to content, and bounded white panels appear only for focused edits or explicit
consequences. Organization changes remain reversible, deleting a room stays
separate from deleting its items, cross-room use is disclosed, and the same
conversation shell remains available throughout.

## Review gallery

### 1. Full Rooms library

![Full Rooms library with six open portraits, direct utility routes and the Round composer](01-full-rooms-library.png)

Six written room identities share one spacious Linen surface. The portraits are
recognition aids and broad targets, not framed app tiles.

### 2. Search all rooms

![Search all rooms with fictional soup results and written room sources](02-search-all-rooms.png)

Global search uses one large field and a calm result list. Every result names
its room in text rather than relying on color or art.

### 3. All items and Unfiled

![All items view with direct Unfiled route and fictional item rows](03-all-items-and-unfiled.png)

All items and Unfiled remain visible touch routes when room organization is
absent, mistaken or simply unwanted.

### 4. Create room

![Create room side sheet with name, purpose and suggested visual pack](04-create-room.png)

Creation asks only for a name and purpose, offers one changeable visual pack,
and avoids a template or personalization maze.

### 5. Rename and change purpose

![Room details side sheet for renaming Kitchen and changing its purpose](05-rename-and-purpose.png)

Ordinary metadata editing is separate from archive and delete. The sheet states
that changing details does not move or delete anything.

### 6. Add, move or remove an item

![Organize Vegetable soup sheet with add, move and remove-from-room choices](06-organize-item.png)

The three organization verbs have distinct written consequences. Removing from
Kitchen leaves the recipe in All items.

### 7. Move receipt with Undo

![All items after Vegetable soup moved from Kitchen to Garden with persistent Undo](07-move-item-undo.png)

The organization receipt is an in-page surface above the composer, not an
ephemeral toast or a color-only success message.

### 8. Archive room

![Archive Trips confirmation explaining that items remain available](08-archive-room.png)

Archive is treated as reversible organization, so it uses the ordinary primary
action color and explicitly says that nothing is deleted.

### 9. Restore room

![Archived rooms view with a broad Restore Trips action](09-restore-room.png)

Archived rooms have a direct, written destination and restore control rather
than being recoverable only through conversation.

### 10. Delete room only

![Delete Kitchen room confirmation preserving underlying items](10-delete-room-only.png)

The destructive action names the room-only scope. Archive is offered as a safer
alternative, while underlying-data deletion is a visibly separate path.

### 11. Separate underlying-data deletion

![Separate deletion preview listing three fictional Kitchen items](11-delete-underlying-items.png)

Underlying deletion gets its own inspectable scope, names the exact fictional
items and does not imply that external originals will also be removed.

### 12. Cross-room source disclosure

![Kitchen conversation with a disclosed Weekend packing list source from Trips](12-cross-room-source.png)

Kitchen remains the current room. A compact source cue names Trips, the item,
why it was used and the View/Exclude actions.

### 13. Sensitive source denied

![Kitchen conversation explaining that a private Trips source was not used](13-sensitive-source-denied.png)

The denied state discloses the boundary without revealing protected content and
offers a path to continue without it or review access.

### 14. Empty library

![Empty Rooms library preserving Create room, All items and conversation](14-empty-library.png)

An empty library is complete rather than broken: Home conversation still works,
and room creation remains optional.

### 15. Loading

![Rooms loading state with explicit status, placeholders and available composer](15-loading.png)

Written status carries meaning; neutral placeholders do not imply known rooms or
fake progress, and conversation stays available.

### 16. Offline

![Offline Rooms library with saved-room examples and qualified availability](16-offline.png)

The screen names what can still work and what may be limited. It does not claim
that every room, search result or request is available offline.

### 17. Missing artwork

![Rooms library where Garden artwork is unavailable but its name and purpose remain](17-missing-artwork.png)

The Garden target remains fully understandable and navigable without its
portrait, demonstrating that decoration is not the room identity.

## Review table

| Frame | Primary job | Main design move | Main sacrifice or question |
|---|---|---|---|
| Full library | Recognize and enter any room | Open portrait field plus direct utility routes | Six portraits approach a visual grid; does the unframed treatment stay calm enough? |
| Search | Find anything across rooms | One large field and source-labelled rows | Results are intentionally plain rather than spatial |
| All items / Unfiled | Browse outside room organization | Two written destinations and grouped rows | Showing both concepts together adds terminology |
| Create | Make a recognizable space | Short side sheet and one suggested look | Visual customization is deliberately shallow |
| Room details | Rename or repurpose | Focused edit sheet over the room | Archive/delete is only a secondary route |
| Organize item | Distinguish add, move and remove | Three consequence-first rows | The explanatory copy makes the sheet tall |
| Move + Undo | Recover an organization change | Persistent in-page receipt | The receipt uses meaningful vertical space |
| Archive | Hide a room without loss | Calm confirmation with explicit retention | Requires a separate destination for restore |
| Restore | Recover an archived room | Direct Archived rooms view | Sparse when only one room is archived |
| Delete room | Remove organization only | Room-only danger wording and safer alternative | The separate data path adds one more visible choice |
| Delete data | Remove listed items themselves | Inspectable destructive scope | Dense by design; likely needs large-text full-page treatment |
| Cross-room source | Explain external context | Compact source/reason/actions cue | Adds density to a conversation answer |
| Sensitive denied | Preserve privacy boundary | Denial without protected content | Access language needs later policy and comprehension review |
| Empty | Keep Rooms optional | One invitation plus universal composer | Decorative doorway may be unnecessary at narrow width |
| Loading | State uncertainty honestly | Text status plus inert placeholders | Placeholder shapes are illustrative, not a motion spec |
| Offline | Name partial availability | Persistent in-page status and saved labels | Exact offline capabilities remain implementation-dependent |
| Missing art | Preserve navigation without decor | Written identity plus neutral mark fallback | Generated placeholder treatment is not production asset guidance |

## Deliberate omissions and fidelity limits

- All room and item content is fictional. No real person, document, credential,
  health fact, account or research result appears.
- This round does not choose defaults, finalize private-room semantics, admit
  persistent storage, implement browser or Android code, or prove model behavior.
- The images approximate Bricolage Grotesque and DM Sans; exact font files were
  not supplied to the image model.
- The rasters suggest hierarchy and target generosity but do not prove contrast,
  dp/sp sizes, TalkBack, keyboard/switch order, focus containment, live regions,
  200% reflow, offline capability or older-adult comprehension.
- At narrow width or large text, artwork disappears first, portrait fields and
  result rows become one vertical sequence, and large consequence panels become
  full pages before controls or copy shrink.
- The original cross-room generation incorrectly let Trips scenery overtake the
  current Kitchen background. It is preserved in `rejected/`; the selected retry
  keeps Kitchen visually current and Trips confined to the source cue.

See [generation specifications](prompts.md) and the machine-readable
[manifest](manifest.json).

## Review question

Which of these structures should be carried into the canonical PRD/design
system, and which should be simplified or combined without turning Rooms into a
busier dashboard?
