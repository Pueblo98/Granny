---
title: "Run the Stage 1 browser design prototype"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [prototype, design]
related:
  - ../../docs/02-design/browser-prototype.md
  - ../../docs/02-design/product-design-spec.md
---

# Stage 1 browser design prototype

A dependency-free browser frontend for the selected Explicit Scroll Row Home, six fictional Context Rooms and Granny's five scripted MVP workflows, with a separate opt-in connected local demo-draft mode. This is **not the Android application, production agent, persistent room system or T-103 runtime**. `Granny` remains a codename/placeholder marker. Scripted external actions/results are fictional fixtures; the connected backend can create real local demo drafts for fictional contacts, never send messages. Never enter personal data.

Current connected runtime: [versioned local backend/MCP contract](../../docs/04-architecture/conversation-runtime-contract.md). Scripted remains default; local demo uses a stub model with actual MCP/store operations. Explicit live synthetic consent is available only when the backend enables it; the one live proposal check failed, so model reliability is not established.

## Run

### Current visual cleanup (20 September)

Simon's follow-up places unchanged transparent decor objects on Home, with
portraits in the Home continuation and cropped/faded room conversations. The
later Rooms-system references restore portraits to the dedicated library.
Overview backdrops now fill more of the outer corner;
the separate corner decor/motif overlays have been removed. Artwork still
disappears at narrow/large-text sizes without removing any room controls.

The brighter mockup-inspired browser outline/action blue is `#0066DD` (an
implementation match, not an exact sampled raster colour). Normal text stays
Ink; Menu, Previous/Next, See all rooms and All collections have written dark
labels and blue outlines. Violet focus and burgundy Stop remain unchanged.
Body text is now 22 CSS px with stronger weight and tighter room spacing;
CSS pixels do not establish Android dp geometry. System-font fallback remains
in use, so exact Bricolage/DM Sans fidelity is not claimed.

The Home scrollbar chrome is hidden, not its real scrolling mechanism or
written controls. [Cleanup evidence](../../docs/02-design/mockups/2026-09-20-context-rooms-cleanup/README.md)
records this revision separately from the earlier checkpoint.

### Local server

Follow-up layout repair: room atmosphere now fills its content-sized hero with
responsive edge masks, rather than a fixed-height inset crop. Chat portraits
retain their natural aspect ratio without `cover` cropping. Room composers
stay in normal flow with a text-relative gap; Home keeps its selected bottom
composition. Hiding Home continuation centers the remaining room region.
The bubble body and pointer are one SVG contour, measured from the real form;
the separated focus contour uses the same geometry. No overlay hides a seam.
Run `node prototypes/stage-1/room-layout-browser-check.mjs` for the new
143-assertion layout/continuation regression suite and reproducible screenshots.
See [repair evidence](../../docs/02-design/mockups/2026-09-20-room-layout-repair/README.md).

Latest [footprint refinement](../../docs/02-design/mockups/2026-09-20-room-footprint-refinement/README.md)
supersedes the repair's art bounds: the hero is now anchored to the outer page
shell, not the padded room section. Artwork scale and fade are separate; the
chat portrait occupies 60% of the shell instead of 27%. Hide removes the
remaining 64rem width cap and fits three complete entries across the available
page width, with gap-aware sizing and a reset scroll position. Narrow/large-text
layouts still use a direct vertical list.

The subsequent [content/art separation pass](../../docs/02-design/mockups/2026-09-20-room-content-separation/README.md)
keeps those image sizes but ends the overview fade at the measured collection
symbol region. Room chat uses a 3:2 content/art grid; the art remains transparent
through the actual reading-column edge. Resize observation updates these
boundaries after reflow; no screenshot-specific nudges are used. Source actions
wrap beneath source text, and narrow/large-text chat returns to one full-width
column with artwork removed.

Use the existing Node runtime (validated with Node 26.8.1):

```bash
node prototypes/stage-1/serve.mjs
```

Open **http://127.0.0.1:4173** on the same computer. Keep the terminal running; Ctrl+C stops it. An optional second argument selects another port if 4173 is occupied. There is no install/build step, account, cloud service or paid design tool.

The server binds only 127.0.0.1 and serves an exact allowlist of runtime scripts/styles and local assets, including 84 unchanged selected room PNGs. Test files, source manifests and repository files are excluded. This is a local preview server, not a backend. Do not bind to 0.0.0.0, deploy publicly or add uploads/analytics.

## Review

### Shared conversation surfaces (20 September)

Talk now expands the existing Round composer into **Listening**, then an
editable **Check what I heard** state. Use this request interprets only; typed
requests bypass these speech states. The fictional David rows explicitly show
both person and destination. Exact preview, activity, Prepared and Unknown use
one task renderer above the composer, in Home and every Room. Rooms stay mounted
with their current collection/item state; Cancel/Done restore origin focus and
scroll. Stop replaces Send while acting; an offscreen fallback keeps Stop
reachable on long/large-text pages. No microphone or speech service is called.

The [shared-state review](../../docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/README.md)
maps all seven images to code, captures Home/Kitchen and records intentional
adaptations. Preview remains inline/nonmodal; interruption dialogs retain
native focus containment. Navigation resolves work before switching place;
leaving a result requires Done and leave. Secondary settings expire preview
authority while retaining unsaved edits. Prepared and Unknown are alternative
fixture outcomes; manual handoff/review never opens a real app or retries.

Run `node prototypes/stage-1/shared-state-browser-check.mjs` for the new
state/return/reflow regression family and
`node prototypes/stage-1/shared-state-review.mjs` to reproduce screenshots.
The old Talk dialog was removed; existing model/scheduler and connected-demo
authority were reused, not replaced by a separate seven-step wizard.

- Start on Home: review the Round writing surface, optional Kitchen continuation, and open six-room row. When the rendered row overflows, written Previous/Next controls move it; when everything fits they disappear. **See all rooms** provides a direct vertical fallback.
- Type a goal or open **Talk (simulated)** without choosing a Room. Supported requests need no category selection. Talk never uses a microphone or speech API.
- Open Kitchen, Fitness, Trips, Garden, Reading or Projects. Each overview has four labelled symbols and an explicit route to all eight collections. Select a collection, search, open a fictional item, then **Ask Granny about this**. Review the prefilled question and Send. **View source** reopens the item; **Stop using this source** excludes it from later replies while earlier answers remain labelled as history. Returning Home clears current-room priority.
- Rooms provides **Search all rooms**, **All items**, **Unfiled**, **Archived rooms** and **Create a room**. Create/edit uses one temporary required-name/purpose form with an explicit save action. New rooms and all organization changes remain in tab memory; Reset everything or reload restores the fixture. No inferred creation, account, real history, real document or production storage is involved.
- Try “Tell David I’ll call after dinner.” Resolve the person/channel, edit the exact preview, then choose **Open this draft**. Default outcome is a fictional **unsent** draft.
- Try “Show me the photos Sophie sent yesterday.”, “What am I looking at?”, “Play some Nina Simone.” and “Make this easier to read.” Results and controls appear in the same conversation. Screen help asks for a supplied fictional screen; no actual screen is observed.
- Demonstration progression is automatic, normally 650 ms per stage. These are scripted timings, not measured model/Android latency. Stop, edits, reset and task replacement invalidate pending callbacks.
- Menu reveals the secondary settings/help/privacy/history functions. Scripted data lives in this tab's memory; no browser persistence or account exists. Connected mode has separate server-side synthetic state, described below. Do not enter personal data.
- Open **http://127.0.0.1:4173/?review=1** for separate reviewer controls. Participant mode never inserts these controls into its DOM/focus order. Reviewer choices expose continuation hidden, no/one/all-fit/overflow/image-failure Home fixtures plus workflow outcomes, timing/expiry and enlarged text; hypothetical sends are explicitly simulations.

Start with the [review script and coverage/gaps](../../docs/02-design/browser-prototype.md). Harbour Blue and the Round/Explicit Scroll Row composition are the selected browser checkpoint, not final brand acceptance or a public name. Reviewed local Bricolage Grotesque and DM Sans files are not present, so the implementation uses a documented system-sans fallback and does not claim exact type fidelity.

## Context Rooms implementation and artwork

### Rooms-system checkpoint

[Rooms review evidence](../../docs/02-design/mockups/2026-09-20-rooms-system/frontend-checkpoint-1/README.md)
maps the 17 reference states. [rooms-store.js](rooms-store.js) owns stable rooms,
canonical fictional items and independent room/collection memberships. Add,
move and remove produce a persistent before/after receipt with exact Undo.
Later mutations retire stale receipts. Archive/restore keeps identity and
items; Delete room only removes organization, while the separate inspected
item-deletion action removes only selected in-memory items. Item deletion is
explicitly not undoable; Reset/reload restores the starting fixture.

**Room details** opens rename/purpose and a separate management route. Native
dialogs contain keyboard focus, cancel with Escape, and restore their invoking
control. The library/search/All items/Unfiled places share the normal-flow
composer. Required names reject blank and duplicate-like values without
rewriting entered text. Custom rooms use an honest plain appearance and begin
empty; the old template/theme wizard is removed.

In Kitchen, type **What should I pack for cooking on a trip?** for the exact
Trips/Weekend packing list cross-room source fixture. View source keeps Kitchen
current; Exclude changes only the response's local source use. Type **Can you
help me plan some easy meals for our weekend trip?** for the denied Passport
details fixture. Only its safe label is available; Review access grants nothing.
These are deterministic examples, not retrieval, policy enforcement or model
answers. Private source content does not exist in the fixture.

Reviewer URLs `/?review=1&roomsFixture=empty`, `loading`, `offline` or
`missing-art` select adverse library fixtures; then choose Rooms. Loading has a
bounded local completion action; offline retry makes no request. Search only
matches already loaded fictional data. Reviewer controls are absent without
`review=1`. All changes disappear on reload; no browser storage is used.

New organization surfaces use canonical Harbour Blue outline `#597DA0` and
primary `#165D9C`. Existing approved Home/Room shell cleanup keeps its brighter
outline variant; the new slice does not silently recolor that reviewed shell.
No fonts or artwork were fetched or generated. System-font and Android/human
evidence limits below still apply.

See the [six-room screenshot review](../../docs/02-design/mockups/2026-09-20-context-rooms-frontend/README.md)
for all 48 labels, the five-frame mapping and visual limitations.

The five Kitchen vertical-slice frames map to the retained Home; reusable room
overview; collection browser; item detail; and source-aware fictional
conversation in [room-ui.js](room-ui.js). The shared Round composer, safety
model, Stop and five workflows are retained. Only unsupported local requests
use room fixture replies; recognized requests still use the existing model.
No room data is sent to the optional connected backend. Rooms are disabled
while connected mode is active; return to scripted mode through Menu first.

Selected packs: Kitchen **K01 / K-M01**, Fitness **F01 / F-M01**, Trips **T01 /
T-M01**, Garden **G01 / G-M04**, Reading **R01 / R-M07**, Projects **P01 / P-M01**.
[Room fixtures](room-fixtures.js) contain the 48 dossier-defined collections,
small fictional items and scripted source-aware example answers.
[Asset manifest](assets/context-rooms/asset-manifest.json) maps every runtime
copy to its unchanged primary design source path, SHA-256 and dimensions.
Sources were read from `docs/02-design/mockups/context-rooms/iteration-1/` in
the dirty primary checkout; that design work remains separately owned and
unmodified. Runtime copies preserve PNG alpha. No art was regenerated.

Portraits have mixed aspect ratios and opaque Linen-like margins, unlike the
transparent objects in the Home reference. Runtime uses contain sizing,
unboxed targets and reserved image slots. Backdrops are cropped/dimmed only
within a protected edge zone; transparent decor remains separate. Motifs are
single faint margin crops, not assumed seamless tiles. Custom rooms use a
clearly labelled plain appearance, not newly generated art.

At narrow widths and large text, decoration is reduced, collection controls
stack, detail columns become one sequence and the composer flows with the
document. Reviewer-only **Room artwork → Artwork disabled** removes decoration
without removing labels or controls. CSS target sizes are at least 56px, with
64px primary/Stop intent; this does not prove Android dp sizes, TalkBack,
switch access, physical usability or older-adult comprehension. All remain
unrun. The selected palette is retained rather than claiming all internal
contrast targets are met.

## Connected local demo (separate opt-in)

**Menu → Demo connection → Connect to local demo** explicitly consents to fictional-data use. The static server above deliberately has no API, so this option requires the backend session's same-origin loopback runtime server serving these current frontend assets. Its canonical interface is [granny.conversation.v1 at the agreed checkpoint](https://github.com/Pueblo98/Granny/blob/aea7f442021347aab0130fcbe220ab5a1ab53b1b/docs/04-architecture/conversation-runtime-contract.md); frontend does not own or duplicate that runtime. See the [frontend coordination record](../../docs/10-execution/sessions/2026-09-15-ui-backend-frontend.md) for exact integrated commits and evidence before claiming a runnable combined build.

The connected slice prepares an unsent message for a fictional person: request, required clarification, exact person/channel/body/effect preview, explicit **Create this unsent demo draft**, creating/checking, and a verified **not sent** result. Editing message words creates a fresh preview; changing person/destination returns to a new natural request because backend-approved identity choices must not be invented by the frontend. An expired approval keeps the readable draft and offers review again. Typed “yes” is not confirmation.

Connected state comes only from ordered runtime events. No scripted timing, model prose or browser timer manufactures completion. Stop disables approval immediately and waits for backend acknowledgment. Connection loss disables action controls and recovers events read-only; it does not retry a confirmation. Unknown effect blocks another connected draft/session in this tab and remains disclosed even after leaving the connected view. Returning to scripted mode requests cancellation first where needed; browser reset is not deletion of the backend's synthetic store.

Text size and unfinished composer/editor content are preserved across secondary navigation. Scripted aliases, music and activity remain separate from backend contacts/execution. Connected mode currently exposes only the local demo, not a live/cloud-provider selector. No key is sent to the browser, no runtime calls occur before opting in, and CSP permits same-origin connections only. The default five-workflow scripted experience is unchanged.

## Supported rule-based grammar

The router recognizes bounded English forms, not general natural-language understanding. Message words are preserved; leading/trailing request whitespace and optional command words are not part of the draft. Use fictional content only.

| Goal | Representative forms and slots |
|---|---|
| Message | `Tell David …`, `Text Sophie …`, `Write a message to David Brother … via Example Mail`; person, optional differentiator/channel and exact remaining body. Explicit aliases also work with tell/message/text. |
| Photos | `Show me the photos Sophie sent yesterday`, `Show Sophie's photos from yesterday`, `Find photos from Sophie Book club on 12 September`; missing person/date is clarified. Fixed clock: 14 September 2026. |
| Screen | `What am I looking at?`, `Explain this screen`; choose supplied fictional context, then `Explain more simply` or `return` when known. |
| Media | `Play some Nina Simone`, `Listen to Sinnerman`; choose between ambiguous tracks, then `pause` / `resume`. No audio is produced. |
| Readability | `Make this easier to read`, `Make Granny text larger`, `Set external text normal`; clarify scope, preview/apply locally or give external guidance only. |

Clarification accepts the displayed choice label as a typed reply. `Change the message to …` edits the current message; photo follow-ups accept the displayed person and supported date forms. Unsupported input stays unsupported and invites another typed request. Typed `yes` never grants consequential approval. Arbitrary dates, providers, people, music and phrasing are not a functioning AI capability.

## Checks

```bash
node prototypes/stage-1/model.test.mjs
node prototypes/stage-1/scheduler.test.mjs
node prototypes/stage-1/cloud.test.mjs
node prototypes/stage-1/serve.test.mjs
node prototypes/stage-1/rooms-store.test.mjs
node prototypes/stage-1/rooms-system-browser-check.mjs
node prototypes/stage-1/rooms-system-review.mjs
node prototypes/stage-1/home-browser-check.mjs
node prototypes/stage-1/rooms-browser-check.mjs
node prototypes/stage-1/rooms-review.mjs
node prototypes/stage-1/browser-check.mjs
node prototypes/stage-1/runtime-browser-check.mjs
python3 scripts/validate-docs.py
python3 scripts/cockpit.py --check
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/check_handoff.py --base origin/main --head HEAD
git diff --check
```

The browser check uses an already installed Chromium at /usr/bin/chromium and Node's built-in WebSocket/CDP transport. Set GRANNY_CHROMIUM to an existing executable if needed; do not install dependencies implicitly. It launches an isolated temporary browser profile and ephemeral loopback server, closes them afterward, and reports a temporary directory containing synthetic screenshots/results. No user browser profile is read. Sandbox environments may require permission to launch Chromium and listen locally.

The model test can also run under node --test, but this environment's runner summarized the test file as one test. Direct execution prints each individual assertion case and its total. No test result here passes a canonical device or human EVAL.

cloud.test.mjs and runtime-browser-check.mjs use fake-fetch/wire fixtures: they test the frontend, **not real MCP or server-side enforcement**. Actual integrated backend tests must run separately. The browser driver accepts an optional exact existing loopback origin via browser({baseURL}); it never starts or terminates someone else's server in that mode.

Against a combined frontend/backend checkout already served by its owner, run `node prototypes/stage-1/runtime-integration-check.mjs http://127.0.0.1:4180` (substitute its verified port). This creates one fictional local demo draft through the browser and real runtime/MCP, checks exact edits, clarification, unsent verification, chat, Stop, layout and egress, then closes only its isolated browser. It neither starts nor stops the supplied server. Check the session record for the actual served commit/port and results.

Observed combined review endpoint: **http://127.0.0.1:4181/**, served from /tmp/granny-mcp-backend-integration at combined checkpoint 4d175f6. Start there with `node prototypes/conversation-runtime/server.mjs 4181`; do not replace an occupied preview process. Frontend's real integration check passed 13 assertions there; the backend's 22 runtime/provider/HTTP tests also passed. Latest integrated source and server availability are checkpoints, not a background-service guarantee. The static 4173 preview still cannot create a real demo draft.

## Source ownership

| File | Role |
|---|---|
| [index.html](index.html) | Accessible app/reviewer shell, restrictive content policy |
| [styles.css](styles.css) | Responsive Harbour Blue Home, conversation, large-text and focus treatment |
| [fixtures.js](fixtures.js) | Fictional contacts, photo provenance, supplied screens and media metadata |
| [room-fixtures.js](room-fixtures.js) | Six room packs, 48 collection labels and fictional local item/source data |
| [room-ui.js](room-ui.js) | One reusable overview, collection, detail and source-aware conversation system |
| [room-library.js](room-library.js) | Direct room entry, global local search, All items and Unfiled |
| [room-create.js](room-create.js) | Shared required-name/purpose create/edit form |
| [rooms-store.js](rooms-store.js) | Canonical items, independent memberships, reversible organization and source boundaries |
| [room-dialog.js](room-dialog.js) | Single native temporary dialog, focus containment and restoration |
| [rooms-browser-check.mjs](rooms-browser-check.mjs) | Six-room routes, symbols, source exclusion, creation, focus, reflow and no-egress checks |
| [intent.js](intent.js) | Modest documented rule-based request/slot interpretation; no general AI |
| [model.js](model.js) | In-memory conversation/task transitions, approval versions, local preferences |
| [scheduler.js](scheduler.js) | Cancellable bounded demonstration delays and preview expiry |
| [cloud.js](cloud.js) | Same-origin v1 client: event fencing, exact confirmation, Stop and read-only recovery; no provider key/model calls |
| [app.js](app.js) | Reusable native controls, exact proposed copy and view composition |
| [serve.mjs](serve.mjs) | Local-only allowlisted static server |
| [model.test.mjs](model.test.mjs) | Deterministic simulation regression cases |
| [scheduler.test.mjs](scheduler.test.mjs) | Controlled-clock stale callback, Stop/reset/edit and expiry cases |
| [cloud.test.mjs](cloud.test.mjs) | Deterministic frontend transport/event/approval regressions, not backend evidence |
| [serve.test.mjs](serve.test.mjs) | Exact allowlist, methods, traversal and response-header checks |
| [home-browser-check.mjs](home-browser-check.mjs) | Selected Home copy, routes, real overflow, focus, fixture, responsive, storage and microphone checks |
| [browser-check.mjs](browser-check.mjs) | Real browser clicks, layout, focus, storage and request checks |
| [runtime-browser-check.mjs](runtime-browser-check.mjs) | Connected rendering with explicit wire fixtures; not MCP integration evidence |
| [runtime-integration-check.mjs](runtime-integration-check.mjs) | Real browser-to-local-runtime draft path against an explicitly supplied loopback server |
| [browser-driver.mjs](browser-driver.mjs) | Test-only CDP helper; importing/running the helper alone is not a test |

Do not copy this simplified state model into the product runtime as a safety implementation. Production authority, verification and permission boundaries belong in the canonical agent/architecture/safety docs. No package manager, framework or vendor has been selected for the product.

Design changes update the canonical behavior owner if behavior changes, then the prototype, coverage manifest and regression tests. Use the task worktree and Git publication workflow. Rollback is removing/reverting only this isolated prototype directory and its documentation links in a reviewed change; no production integration exists.


## Delegated live synthetic conversation entry — 2026-09-15

Under Simon's backend integration mission and frontend's published FE006 file-scoped handoff, Menu → Demo connection now offers **Check live model availability**. Only an explicitly enabled backend with liveAvailable exposes **Review live conversation consent**. Separate consent names synthetic conversation egress to OpenRouter/Qwen; cancel makes no session, and confirming creates a mode-bound session without a model call. Text submission starts interpretation. Default remains scripted; connected demo remains stub-only. Keys never enter the browser. No recording, account access, real sending, new capabilities or increased caps.

Live-mode snapshots must match the explicitly consented mode. Mode labels and privacy text disclose provider egress, while exact draft confirmation and backend verification stay unchanged. Unknown/Stop/replay fences remain in force. Client/wire and actual live-mode HTTP/MCP tests use a stub provider, not paid model evidence. The backend's single live Qwen check failed to propose a structured draft; the mode entry does not imply reliable language interpretation. Existing interaction layout/style/other component behavior is unchanged by this delegated extension.
