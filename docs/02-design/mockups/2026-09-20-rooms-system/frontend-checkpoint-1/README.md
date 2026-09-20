---
title: "Rooms-system fictional frontend checkpoint"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [design, prototype, evidence]
related:
  - ../iteration-1/README.md
  - ../../../browser-prototype.md
  - ../../../../10-execution/sessions/2026-09-20-rooms-system-frontend.md
---

# Rooms-system frontend checkpoint

Fictional in-memory implementation, not Android, real retrieval, private data,
production permissions or persistence. Inspected baseline commit
`67abdb2108a7b2a06cf812fd48b4e925c130de3a`, plus this scoped implementation's
working-tree changes on `feature/explicit-scroll-row-home`. The containing
delivery commit records the reviewed source and images together. The
[session](../../../../10-execution/sessions/2026-09-20-rooms-system-frontend.md)
records exact changed paths, checks and publication boundary.

## Composition and state mapping

All 17 reference families are implemented as local fixtures, not 17 pages.
Durable library/search/item places reuse the app's place owner; one native
temporary dialog handles create/edit/organization/archive/delete reviews.
The shared conversation/task state remains separate, with the existing Talk,
approval, Stop and results. Canonical items are independent of memberships.

| Reference | Executable behavior and deliberate adaptation |
|---|---|
| 01 Library | Six unboxed portrait targets; Home remains its separate scroll row. Library composer flows after content rather than fitting six rooms into a fixed screenshot. |
| 02 Search | Actual local title/type/room/summary matching, count, Clear and empty query. |
| 03 All items / Unfiled | Separate destinations from the same canonical store; no duplicated items for multiple memberships. Private source payloads are absent and not offered for browsing. |
| 04 Create | Required name/purpose sheet; a plainly labelled appearance placeholder instead of a theme editor. Explicit create returns to the new library target. |
| 05 Details | Same populated form; stable ID updates live name/purpose. Management is a separate route within the dialog. |
| 06 Organization | Consequence-labelled full-width options, destination choice, then exact confirmation. Canonical item never deleted by organization. |
| 07 Receipt | Persistent before/after surface above composer, Undo and Dismiss. No toast-only recovery or automatic focus steal. |
| 08 Archive | Ordinary blue confirmation, not red. Items and memberships remain. |
| 09 Restore | Direct Archived rooms list, same stable identity, explicit Restore. |
| 10 Room deletion | Specific danger action; items retained; Archive instead. |
| 11 Item deletion | Separate exact checkbox scope, type/provenance and non-undo disclosure before commit. Six Kitchen examples rather than the raster's three. Long scope scrolls before approval. No external original is included. |
| 12 Cross-room | Kitchen stays current; Trips / Weekend packing list / portable-blender reason, View source and reversible exclusion. |
| 13 Denied source | Safe Passport details label only; Review access explains simulation and cannot grant anything. |
| 14 Empty | No rooms yet; conversation, All items and optional creation remain. |
| 15 Loading | Written inert placeholders, bounded Show local rooms fixture transition; no shimmer or fake percentage. |
| 16 Offline | Explicit simulation; only already-loaded tab fixtures browsable/searchable. Try again makes no network request. |
| 17 Missing artwork | Garden retains name/purpose/target with neutral written fallback; broken-image glyph removed. |

The existing transparent Home objects, room atmosphere and six packs are reused
unchanged. Library portraits use contain sizing, a reserved slot and a lower
edge mask; image dimensions are independent of the mask. Native text remains
outside art. Mixed portrait ratios and opaque side margins remain visible in
some packs; these are not newly generated transparent cutouts. Custom rooms
have no new artwork. System sans is an honest fallback, not exact Bricolage/DM
Sans. New state surfaces use canonical outline/Send roles; existing reviewed
Home/Room shell retains Simon's brighter outline cleanup. No brand acceptance
is implied.

## Reproduction and limits

Run `node prototypes/stage-1/rooms-system-review.mjs` from the repository root.
It starts an isolated loopback server and writes temporary screenshots only.
Normal captures use participant mode; adverse captures use documented reviewer
queries and hide the reviewer panel only for capture. Nonmodal images are
full-page; dialogs show their real scrollable viewport. Main captures use
1440×1000, plus 360×780, 840×1000 at 200%, 600×1000 at combined 300%, and
840×480. The separate room-layout suite covers 16:10 1440×900 and short rooms.

The pure store suite checks 58 invariants; the new browser suite checks 61
transitions/rendering conditions. Existing Home, six-room, shared-state,
five-workflow, runtime-wire, model, scheduler, cloud and server checks remain
required; exact final results are in the session record. Scope selection,
Escape/focus return, tab containment, wide/narrow/large-text layout, artwork
failure and local-only requests are browser evidence only. No Android dp/sp,
TalkBack, switch hardware, real offline capability, microphone, provider,
external-app Stop/outcomes or older-adult comprehension is established.

Review question for Simon: does the wide unboxed portrait field feel calm
enough, or should the dedicated library use the same one-room-per-row treatment
already used at narrow sizes? Home's explicit scroll row is unchanged.

## Captures

![Full library](01-full-rooms-library.png)
![Search](02-search-all-rooms.png)
![All items](03-all-items-and-unfiled.png)
![Create](04-create-room.png)
![Rename and purpose](05-rename-and-purpose.png)
![Organize](06-organize-item.png)
![Move and Undo](07-move-item-undo.png)
![Archive](08-archive-room.png)
![Restore](09-restore-room.png)
![Delete room only](10-delete-room-only.png)
![Delete selected underlying items](11-delete-underlying-items.png)
![Cross-room source](12-cross-room-source.png)
![Denied source](13-sensitive-source-denied.png)
![Empty](14-empty-library.png)
![Loading](15-loading.png)
![Offline](16-offline.png)
![Missing art](17-missing-artwork.png)
![Narrow library](18-narrow.png)
![200 percent library](19-large-text.png)
![Combined 300 percent library](20-combined-scale.png)
![Short create sheet](21-short.png)
![Artwork disabled](22-art-disabled.png)
![Unfiled](23-unfiled.png)
