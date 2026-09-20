---
title: "Metaprompt — Implement the Rooms system iteration"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [design, implementation, metaprompt, context-rooms, frontend]
related:
  - README.md
  - manifest.json
  - ../../../context-rooms.md
  - ../../../shared-conversation-state-surfaces.md
  - ../../../browser-prototype.md
  - ../../../product-design-spec.md
  - ../../../design-system.md
  - ../../../accessibility.md
  - ../../2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
  - ../../../../10-execution/task-packets.md
---

# Metaprompt — Implement the Rooms system iteration

Simon authorized this implementation handoff on 2026-09-20 after reviewing the
first Rooms-system mockup round. Paste the prompt below into the Astra session
already implementing the Granny frontend. It tells that session to inspect its
current code and then implement the Rooms system rather than return another plan.

```text
Continue the active Granny frontend implementation in your existing authorized
checkout, worktree and task branch.

Repository:

  /home/lgtw/Work/granny

Do not return another plan or rewrite this metaprompt. Inspect the implementation
already present in your session, then implement the Rooms-system slice described
below. Reuse correct existing code, refactor structurally incompatible code and
remove obsolete in-scope mock UI when necessary after tracing its callers and
tests. Do not restart the project merely because earlier UI work is imperfect.

This is a browser-prototype implementation using fictional in-memory data. It is
not production Android, a backend, real persistence, a model retrieval system or
permission to handle personal data.

## Use the repository workflows

Use these skills when available:

1. `$granny-session-lifecycle` for continuity, isolation and exact handoff.
2. `$granny-design-handoff` for SCR/CMP/copy/accessibility authority.
3. `$granny-task-slice` in implementation mode for the bounded T-119 slice.
4. `$granny-ui-craft` in Harden mode for fidelity, responsive behavior and
   anti-template review.

The lead Astra agent acts as the orchestrator. After personally reading the
authority sources, use up to three Terra sub-agents in parallel when useful:

1. a read-only current-code/state-model audit;
2. a read-only visual/accessibility comparison against the 17 references;
3. a read-only test and adverse-state coverage audit.

Give them bounded, non-overlapping assignments. The lead agent owns product
interpretation, shared-file edits, integration and final verification. Do not
allow two agents to edit the same frontend files, and do not let sub-agents
publish, merge, change scope or declare completion independently. Inspect every
delegated diff before retaining it.

## Repository and Git boundary

- Confirm `pwd`, repository root, branch, HEAD, worktrees and
  `git status --short --branch` before editing.
- Continue the current implementation branch if it is valid. Do not throw away
  work already completed by this session.
- Preserve unrelated edits. Never stash, reset, clean, overwrite or silently
  copy changes between worktrees.
- If the active branch predates the design files below, fetch `origin/main` and
  integrate it only when safe. If current code conflicts with main, inspect the
  references through read-only Git commands and record the dependency rather
  than overwriting active work.
- Do not install packages or switch frameworks. The current browser prototype
  intentionally uses repository-native HTML, CSS and JavaScript.
- Do not edit private `docs/.obsidian/*.json` settings.
- Push the completed scoped task branch and prepare its handoff after checks.
  This mixed code/documentation task is not authorized to merge itself to main;
  stop at the reviewed branch/PR boundary unless Simon separately authorizes
  integration.

## Read before editing

Read these sources in order:

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/10-execution/current-milestone.md`
4. `docs/10-execution/development-readiness.md`
5. `docs/10-execution/backlog.md`, T-119
6. `docs/10-execution/task-packets.md`, T-119 packet
7. `docs/09-decisions/ADR-0015-context-rooms.md`
8. `docs/09-decisions/ADR-0016-explicit-home-room-row.md`
9. `docs/02-design/context-rooms.md`
10. `docs/02-design/shared-conversation-state-surfaces.md`
11. `docs/02-design/context-room-visual-system.md`
12. `docs/02-design/context-room-starter-catalog.md`
13. `docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/README.md`
14. `docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/manifest.json`
15. `docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md`
16. `docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md`
17. `docs/02-design/product-design-spec.md`, especially SCR-003, SCR-016 and
    SCR-017
18. `docs/02-design/design-system.md`, especially CMP-007 and CMP-010–012
19. `docs/02-design/accessibility.md`
20. `docs/02-design/voice-ux.md`
21. `docs/02-design/browser-prototype.md`
22. `prototypes/stage-1/README.md` and the actual current frontend source/tests

Visually inspect every individual mockup at original detail before coding:

- `01-full-rooms-library.png`
- `02-search-all-rooms.png`
- `03-all-items-and-unfiled.png`
- `04-create-room.png`
- `05-rename-and-purpose.png`
- `06-organize-item.png`
- `07-move-item-undo.png`
- `08-archive-room.png`
- `09-restore-room.png`
- `10-delete-room-only.png`
- `11-delete-underlying-items.png`
- `12-cross-room-source.png`
- `13-sensitive-source-denied.png`
- `14-empty-library.png`
- `15-loading.png`
- `16-offline.png`
- `17-missing-artwork.png`

They are under:

  docs/02-design/mockups/2026-09-20-rooms-system/iteration-1/

Use `comparison.png` only for family-level review because it is resampled. The
individual images control detail. Do not use the rejected cross-room image as a
target. Do not place screenshots into the app as fake UI.

Also inspect the selected Home, at least one implemented/decorated Room and all
shared conversation states in the running frontend. This new Rooms work must
join that system rather than overwrite it.

## Audit the implementation before changing it

Run the frontend and inspect it at expanded tablet, constrained-height, narrow
and enlarged-text sizes. Exercise Home, the room portrait row, one room, direct
browse, composer/Talk, Menu and any shared state surfaces already implemented.
Map and record:

- where place/navigation state and temporary conversation state live;
- the current room, item and fixture representations;
- route/view rendering and history/focus restoration;
- modal, sheet, panel, banner and receipt primitives;
- current artwork loading/fallback behavior;
- simulated loading/offline/error controls;
- browser checks and state-model tests;
- useful code to keep, code to adapt, obsolete UI to replace and dead code that
  can be safely removed.

Do not preserve weak UI solely because it exists. Do not perform a wholesale
rewrite if a smaller coherent refactor retains proven conversation, safety,
local-only, CSP and connected-demo behavior. Record a `keep / adapt / replace /
remove` inventory in the session note.

## Product and scope truth

Granny is a temporary codename for a calm, adult, capable AI-first stock-Android
tablet experience. This browser artifact is a design prototype.

Home can handle ordinary requests without choosing a Room. Rooms are optional,
directly browsable spaces around one global Granny assistant. They are not apps,
folders that trap content, separate agents or permission boundaries by
themselves. Entering a Room changes foreground context and visual atmosphere;
it does not change assistant identity, action policy or stable controls.

The selected Explicit Scroll Row remains Home. Implementing the full Rooms
library does not turn Home into a six-room grid. `See all rooms` opens the
library. Home keeps its compact continuation, open horizontal portrait row and
Round composer.

All data in this slice is deterministic and fictional. State may live in memory
for the current tab/session only. A Reset fixture action may restore the initial
state in reviewer mode. Do not add LocalStorage, IndexedDB, accounts, file
access, network calls or backend writes unless a separate accepted contract and
explicit authority already exist for that exact integration. The normal static
prototype must remain fully usable without the model/runtime connection.

## Selected visual system

Preserve the Harbour Blue roles:

- Canvas: `#FBF6EE`
- Surface: `#FFFFFF`
- Ink: `#2E2D32`
- Accent: `#2C5981`
- Outline: `#597DA0`
- Send: `#165D9C`
- Focus ring: `#4930A1`, separated from the ordinary border
- Stop/danger: `#962F43`, only for Stop or genuinely destructive actions
- On-colour: `#FFFFFF`

Use Bricolage Grotesque 600 intent for display headings and DM Sans 400/600 for
body/controls. Do not fetch fonts remotely. Use documented system fallbacks if
reviewed local fonts are unavailable.

Preserve the large Round conversation composer, written Home/Rooms/Menu and the
same Talk/Send meanings. Avoid gradients, glow, glass, deep shadows, AI
sparkles, generic dashboards, repeated floating cards, tiny chips, icon-only
essential actions, bottom tabs, left rails and ornamental room floor plans.

Room portraits should flow from the Linen canvas. Artwork reinforces the live
written room name and purpose; it never owns navigation or status. Prefer the
reviewed local room assets already present in the active implementation branch.
If a required asset is unavailable there, use an honest local placeholder and
record it. Do not copy uncommitted assets from another checkout, fetch remote
art or claim placeholder art is production-ready.

## Implement one reusable Rooms model

Do not hard-code 17 disconnected screenshot pages. Extend the existing state
architecture with an equivalent of:

- `rooms`: stable ID, live name, purpose, visual-pack/asset key, archived state
  and artwork availability;
- `items`: stable canonical ID, title, type, source/provenance and fictional
  sensitivity metadata;
- `memberships`: which Rooms reference an item, separate from the canonical
  item itself;
- `currentPlace`: Home, Rooms library, archived library, All items, search,
  one Room, collection or item;
- `temporarySurface`: create/edit/organize/archive/delete/source/access state;
- `organizationReceipt`: exact before/after membership and Undo availability;
- `availabilityFixture`: normal, empty, loading, offline or missing artwork;
- `sourceUse`: current Room, other Room, reason used, allowed/denied and
  reversible exclusion state.

Use names appropriate to the existing codebase rather than forcing these
literal identifiers. Keep fixtures separate from render functions. One item can
appear in multiple Rooms without duplication. Moving or removing membership
must not silently delete the canonical item.

Keep navigation/place state separate from shared conversation-surface state.
Listening, clarification, preview, active Stop and result surfaces must continue
to layer over Home or the current Room as specified by the accepted shared-state
contract.

## Fictional starter fixture

Use the six room identities consistently:

- `Kitchen` — `Recipes, lists and cooking plans`
- `Fitness` — `Movement and routines`
- `Trips` — `Plans and packing`
- `Garden` — `Plants and seasonal plans`
- `Reading` — `Books and saved articles`
- `Projects` — `Notes, materials and things to do`

Use the mockup items as deterministic examples, including Vegetable soup,
Weekend packing list, Tomato soup notes, Soup shopping list, Soup photo, New
note and Appliance note. Mark fictional examples where needed. Do not imply
they were retrieved from or saved by a real person.

## Implement the reference families

### A. Full Rooms library

Implement `Rooms` as a real destination from Home's `See all rooms` route.

- Show the six open portrait targets with live name and purpose.
- The portrait, name and purpose form one broad semantic target.
- Expose written `Search all rooms`, `All items`, `Unfiled` and `Create a room`.
- Do not wrap every entry in a floating card or add internal Open buttons.
- Preserve generous space at expanded tablet size.
- At narrow width or large text, become one calm vertical list before shrinking
  labels or forcing essential two-dimensional navigation.
- Keep the Round composer available in normal flow without pinning it over
  content.

### B. Search all rooms

Implement a real local search over the fictional in-memory fixture.

- Use one labelled search input and a written Clear action.
- Update results from actual fixture matching, not a static screenshot.
- Each result is one broad text-first row with title, item type and written Room
  source. A result without a Room says `Not in a room`.
- Preserve keyboard entry, Escape/clear behavior where conventional, result
  count announcement and focus after clearing.
- Empty query and no-results are complete states. Do not invent suggestions or
  use prompt chips.

### C. All items and Unfiled

- `All items` shows every canonical fictional item independent of membership.
- `Unfiled` shows items with no Room membership.
- Both are direct, written destinations and work without conversation/model use.
- Opening an item preserves a return path and list position.
- Room removal updates membership and Unfiled truthfully without deleting the
  item.

### D. Create room

Implement a bounded create sheet/dialog over the library using real form fields.

- Required fields are Room name and Purpose.
- The fictional example may begin as Music / Albums, playlists and listening
  notes, but creation must use the entered values.
- Offer one suggested reviewed/local visual pack and a `Change look` route only
  if the current asset chooser can remain simple and accessible. Otherwise show
  a clearly labelled placeholder choice; do not invent a large theme editor.
- `Create room` adds the room to in-memory state and returns to a visible,
  focusable new room entry.
- Cancel makes no change and restores focus to the invoking control.
- Validate blank/duplicate-like names accessibly without silently rewriting the
  person's words.

### E. Rename and change purpose

- Reuse the create/edit form family with current values populated.
- Saving changes updates every live written occurrence by stable Room ID.
- State plainly that this does not move or delete anything.
- Archive/delete remains a separate secondary route, not an accidental adjacent
  destructive button.
- Cancel restores the prior values and invoking focus.

### F. Add, move or remove an item

Implement one organization surface for an opened item.

- `Add to another room` adds a membership while retaining current memberships.
- `Move to another room` adds the destination and removes the chosen source
  membership as one reversible transaction.
- `Remove from Kitchen` removes only that membership; the canonical item stays
  in All items and becomes Unfiled if it has no remaining room.
- Destination selection uses broad written Room rows; do not use icon-only room
  pickers or a dense checkbox grid.
- Show the consequence before committing each operation.

### G. Persistent Undo receipt

- Every successful organization change produces one inspectable receipt with
  item name, exact before/after Rooms, `Undo` and `Dismiss`.
- Use an in-page surface above the composer or equivalent accessible region, not
  a transient toast as the only recovery route.
- Announce the receipt once. Do not steal focus automatically.
- Undo restores the exact prior membership state and updates all current views.
- A later conflicting change must retire or replace the stale receipt honestly.

### H. Archive and restore

- Archive confirmation explains that the Room leaves Home/library while its
  items remain available in All items.
- Archive is reversible organization, so it uses ordinary Harbour Blue rather
  than danger red.
- Provide a direct `Archived rooms` destination with written room identity,
  purpose, status and `Restore` action.
- Restoring returns the same stable Room and memberships to the library.
- Empty Archived rooms is a complete state with Back to Rooms.

### I. Delete room without deleting items

- Use a focused destructive confirmation with exact Room name.
- Explain before the action that Room organization will be removed while items
  remain in All items.
- Use danger red only for the specific `Delete room only` control.
- Offer `Archive instead` and `Cancel`.
- Deleting removes the Room and its membership references in memory; canonical
  items remain and become Unfiled when they have no other Room membership.
- Do not call this `Delete everything` and do not combine it with item deletion.

### J. Separate underlying-data deletion

- Enter through a visibly separate `Delete underlying items…` path.
- Show an inspectable list of the exact selected fictional items, types and
  provenance boundary before confirmation.
- State that listed items will be removed from Granny and that originals in
  external apps/files are not included unless explicitly listed.
- Use one specific danger action such as `Delete 3 items` and Cancel.
- In this prototype, either support an honest in-memory undo route or state the
  fixture's non-undo behavior before confirmation. Never silently promise OS or
  external-app deletion.
- Large text/narrow layouts use a full-page focused surface rather than
  compressing the scope list.

### K. Cross-room source disclosure

Implement one deterministic Kitchen conversation fixture where a Trips item
materially influences the answer.

- Kitchen remains visibly and semantically current.
- The cue names `Trips`, `Weekend packing list` and why it was used: `It
  mentions the portable blender.`
- Provide `View source` and `Exclude this source`.
- View source opens the fictional item with a clear return to the Kitchen
  conversation.
- Excluding removes that source from the current response/context fixture and
  produces an understandable updated state. It is not a global permission or
  destructive delete.
- Never let Trips scenery replace Kitchen atmosphere merely because a Trips
  source was used.

### L. Sensitive or denied cross-room source

Implement a separate deterministic denied branch:

- show `Trips source not used`;
- explain that fictional `Passport details` was not used because the source is
  private;
- reveal no protected content or metadata beyond the fixture's safe label;
- provide `Continue without it` and `Review access`;
- Review access may open a clearly labelled, local simulation of the policy
  explanation. It must not grant access, change real permissions or imply a
  production private-room model exists.

### M. Empty, loading, offline and missing artwork

Expose deterministic reviewer fixtures or query-controlled test states without
putting reviewer-only controls in the participant DOM/focus order.

- Empty: `No rooms yet`; conversation and All items remain available; Create a
  room is optional.
- Loading: written `Loading rooms…`; neutral inert placeholders; no fake
  percentage or endless shimmer; conversation remains available.
- Offline: state what saved content can be browsed and qualify search/cross-room
  limitations; do not claim unsupported offline abilities. `Try again` performs
  a deterministic fixture transition.
- Missing artwork: the Room keeps its written name, purpose and broad target;
  substitute a neutral mark/status, not a browser broken-image glyph.
- Removing all decorative art must leave navigation and room identity complete.

## Surface and navigation behavior

- Use proper routes/history or the prototype's existing equivalent for durable
  places: Home, Rooms, archived Rooms, All items, search, one Room and one item.
- Use a dialog/sheet/temporary surface for create, edit, organize, archive and
  deletion review. Do not create a new app route for every transient choice.
- Focused destructive dialogs contain focus, support Escape/Back cancel where
  safe, name their heading and restore invoking focus.
- Never stack dialogs. Close or resolve one surface before opening another.
- Preserve scroll and focus when returning from an item/source where practical.
- The stable top navigation and composer must not jump unpredictably between
  equivalent states.
- Active-task Stop continues to win over ordinary Send. Idle Rooms must not
  show Stop.

## Accessibility and adaptive requirements

- Use semantic headings, landmarks, labels, descriptions and native controls.
- Essential controls retain written labels; no color-, position-, artwork- or
  icon-only meaning.
- Broad controls must be capable of at least 56dp-equivalent targets; primary
  and Stop controls at least 64dp-equivalent where the existing system requires.
- Use the separated focus ring with enough unclipped space.
- Keep DOM and keyboard order aligned with the visual reading order.
- Announce route headings, search-result counts, persistent receipts and
  consequential outcomes once; do not create noisy live regions.
- Test 200% text and the repository's combined-scale target. Art disappears
  first, columns and portrait fields stack, and dialogs become scrollable/full
  page before text or controls shrink.
- Test keyboard-only operation, focus restoration, no-image behavior,
  reduced-motion preference and high-contrast/grayscale comprehension.
- Ordinary direct browse/search must work when scripted conversation/model
  interpretation is unavailable.

Do not claim the browser implementation proves Android dp/sp, TalkBack, switch
access, device performance, offline production support or older-adult
comprehension.

## Testing and deterministic evidence

Extend the smallest appropriate existing model and browser suites. At minimum,
cover:

1. Home `See all rooms` opens the full library and Back restores focus.
2. Six room identities and purposes remain available without images.
3. Search finds fictional items and names their source Rooms.
4. All items and Unfiled update from actual membership state.
5. Create, rename and purpose changes use entered values and cancel safely.
6. Add, move and remove membership preserve canonical item data.
7. Undo restores exact prior membership and stale Undo cannot corrupt later
   state.
8. Archive hides a Room, keeps its items and Restore returns it.
9. Delete room only preserves items; separate item deletion removes only the
   exact listed in-memory items.
10. Cross-room source View/Exclude works while Kitchen stays current.
11. Denied source reveals no protected fixture content and grants nothing.
12. Empty, loading, offline and missing-art fixtures remain navigable and
    truthful.
13. Dialog focus containment, Escape/Cancel and invoking-focus restoration.
14. Keyboard-only traversal, enlarged text, narrow/short viewport, no-image and
    composer non-overlap.
15. Existing five conversation workflows, shared state surfaces, CSP/local-only
    behavior and connected-demo boundaries do not regress.

Run all checks named by the current `prototypes/stage-1/README.md`, including
model, scheduler, cloud, server and browser checks where present. Also run:

  python3 scripts/cockpit.py --write
  python3 scripts/cockpit.py --check
  python3 scripts/validate-docs.py
  python3 scripts/check_handoff.py --base origin/main --head HEAD
  git diff --check

Do not weaken existing assertions, broaden fixtures or convert unknown behavior
into success just to make checks pass. Inspect the rendered UI after tests at
expanded tablet, narrow and enlarged-text sizes. Compare each implemented state
against its individual reference and record deliberate differences.

## Documentation and stop point

Update the prototype README/coverage only for behavior actually implemented.
Create one scoped contemporaneous session record with exact changed paths,
commands/results, code reuse inventory, screenshots or temporary evidence,
accessibility checks and known limits. Keep the canonical PRD/design system as
authority; if implementation reveals a true contract conflict, record it for
Simon rather than silently changing product behavior.

Stop when the complete fictional Rooms-system slice and its deterministic tests
are implemented on the task branch. Do not continue into persistence, backend
retrieval, real microphone, real files/accounts, native Android, Figma, arbitrary
room-art generation or production migration.

Report:

- branch, commit and PR or pushed-branch URL;
- exact code/docs changed;
- what was reused, adapted, replaced or removed;
- which reference states are complete, partial or intentionally simulated;
- tests run and exact results;
- visual/accessibility mismatches and remaining evidence limits;
- one focused question for Simon if a visual or interaction choice still needs
  selection.
```
