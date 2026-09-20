---
title: "Core outcomes frontend checkpoint"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [design, prototype, outcomes, review]
related:
  - ../iteration-1/README.md
  - ../../../browser-prototype.md
  - ../../../../10-execution/sessions/2026-09-20-core-outcomes-frontend.md
---

# Core outcomes frontend review

Inspected base commit `9e768aa` plus the scoped implementation recorded in the
[session](../../../../10-execution/sessions/2026-09-20-core-outcomes-frontend.md).
The delivery commit is discoverable from this file's Git history. These are
browser screenshots, not production device evidence or new design authority.

## Capture and comparison

`node prototypes/stage-1/outcomes-review.mjs` produced 15 captures, zero capture
failures and zero browser exceptions. Original temporary directory:
`/tmp/granny-conversation-review-04NHtR`. The ten individual
[approved references](../iteration-1/README.md) were inspected at original detail;
the lead compared their hierarchy against these full-page captures.

Frames 01–10 use 1440 × 900 viewport, ordinary text unless the applied preference
changes it. Full-page images include vertical scroll extent, not a claim that
every control fits one physical tablet screen. Frame 11 uses 360 × 780;
12 uses 840 × 480 with 200% review text; 13 uses 600 × 900 with actual
150% Granny × 200% review scale (300%); 14 preserves Kitchen Recipes; 15
disables artwork. Tests also cover 360 × 480 and 840 × 320 reduced-height layouts.

| Reference | Implemented mapping and deliberate difference |
|---|---|
| 01 Photos found | One dominant local illustration, adjacent provenance, bounded position and focused same-image viewer. Existing mark-read approval stays before this result. |
| 02 No photos | Written searched person/date/source, no Retry, date/person clarification. Neutral text replaces the raster's decorative empty-image glyph. |
| 03 Screen explanation | One module with inert semantic supplied-screen rows and separate explanations; no bitmap-dependent text or actual capture. |
| 04 Guidance | Purple annotation plus numbered written target; Text size is actually second, after Screen zoom. Nothing is selected or changed. |
| 05 Exact draft | Existing shared consequence renderer, private exact fields and specific version-bound approval. No second confirmation mechanism. |
| 06 Prepared | Same shared result enum/renderer; verified fictional draft, explicit not-sent, manual simulation and Done. |
| 07 Playing | Exact metadata, static simulated time and Pause/Resume. Optional cover art omitted; no audio. |
| 08 Unavailable | Preserved requested track/source, no player or retry. Source-choice branch honestly has no other provider fixture; manual handoff opens nothing. |
| 09 Text preview | Real closed-size controls and isolated proposal. Canonical Standard/Larger/Larger still/Largest replace approximate Normal/Large. |
| 10 Applied/restore | Current/previous state read from memory; exact prior-size restore, unchanged external settings. Not an OS preference. |

Home or the complete selected Room subview remains above the outcome, unlike a
raster cropped tightly around one result. The composer remains below in normal
flow; dense screens intentionally scroll. Multi-column samples/illustrations
stack before shrinking labels. Menu/Home/Rooms retain the earlier approved
brighter outline refinement; new modules use the specified Harbour Blue roles
without reopening that shell.

## Placeholder inventory and limits

The three photo examples reuse local seaside/garden/meal SVG illustrations.
No generated photo, assistant avatar, cover image or new logo was added.
Missing images leave description, source, position and controls. Screen settings
are supplied fictional HTML, never executable device controls. Existing system
font fallback remains; no exact Bricolage/DM Sans claim.

The default Sophie alias remains Daughter. Explicit Book club wording reaches
the three-image reference without silently changing existing aliases.
Unavailable media has an honest empty alternative-source choice, not invented
provider support. The source disclosure says supplied/captured-for-request in
the fixture and explicitly states no screen was actually captured.

## Checks and evidence limits

The [session](../../../../10-execution/sessions/2026-09-20-core-outcomes-frontend.md)
lists exact commands/counts. Outcome browser checks exercise all ten states,
bounded navigation, native viewer keyboard/Escape/focus, one photo announcement,
art error handling, Kitchen subview/scroll return, stale callbacks, Stop and
narrow/enlarged non-overlap. Existing Home/Rooms/shared-state/connected-wire
regressions remain passing. No third-party requests or storage were added.

CSS target sizes and browser keyboard tests do not prove Android dp/sp,
TalkBack, switch access, physical tablet/IME behavior, older-adult comprehension,
real screen access, real media playback or external action outcomes. Reduced
viewport height is an IME approximation, not native keyboard evidence.

## Captures

### 01-photos-found

![01-photos-found](01-photos-found.png)

### 02-photos-no-result

![02-photos-no-result](02-photos-no-result.png)

### 03-screen-explanation

![03-screen-explanation](03-screen-explanation.png)

### 04-screen-guidance

![04-screen-guidance](04-screen-guidance.png)

### 05-message-draft-review

![05-message-draft-review](05-message-draft-review.png)

### 06-message-prepared-unsent

![06-message-prepared-unsent](06-message-prepared-unsent.png)

### 07-media-playing

![07-media-playing](07-media-playing.png)

### 08-media-unavailable

![08-media-unavailable](08-media-unavailable.png)

### 09-reading-preview

![09-reading-preview](09-reading-preview.png)

### 10-reading-applied

![10-reading-applied](10-reading-applied.png)

### 11-guidance-narrow

![11-guidance-narrow](11-guidance-narrow.png)

### 12-draft-short-200

![12-draft-short-200](12-draft-short-200.png)

### 13-reading-preview-300

![13-reading-preview-300](13-reading-preview-300.png)

### 14-kitchen-outcome

![14-kitchen-outcome](14-kitchen-outcome.png)

### 15-art-disabled

![15-art-disabled](15-art-disabled.png)
