---
title: "Stage 1 conversation browser prototype and handoff"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, prototype, handoff]
related:
  - conversation-first-plan.md
  - product-design-spec.md
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - ../../prototypes/stage-1/README.md
  - ../01-product/user-journeys.md
  - ../01-product/traceability.md
  - ../10-execution/sessions/2026-09-14-conversation-build.md
  - ../10-execution/sessions/2026-09-19-explicit-scroll-row-home.md
---

# Conversation-first browser experience

## Iteration-1 owner review — 2026-09-20

Simon completed a walkthrough of the integrated browser iteration after PR #44
and reported that it remains cohesive and is good for now. The Home/Rooms
scrolling and room-emphasis refinement is also accepted for this checkpoint. No
frontend revision is queued before the next product/evidence discussion.

This closes owner review of the current fictional browser iteration; it does
not convert browser fixtures into Android capability evidence, establish
representative older-adult comprehension or pass GATE-05. Future frontend
changes should start from a newly selected bounded task rather than reopen this
iteration by default.

## Navigation and supporting surfaces checkpoint

The [navigation handoff](../10-execution/sessions/2026-09-20-navigation-support-frontend.md)
implements the thirteen approved fictional supporting references: modal Menu,
Today, Settings, Privacy, Accessibility, Help, exact new-conversation review,
unknown external return, local search/results and three skippable setup steps.
One support state/renderer retains the underlying Home or Room and conversation.
New conversation preserves minimal history; history clearing and full in-memory
fixture reset are separate reviewed actions. Optional access grants nothing.
The static prototype remains usable without any model/runtime connection.

The reference pack and implementation are integrated on `main` through PR #44.
Existing room, outcome and shared-surface contracts remain authoritative.
Browser verification does not establish Android permissions, TalkBack,
external outcomes or human comprehension. The prototype README owns exact
entry routes and fixture limits.

## Inline core outcomes checkpoint

The [ten-state outcome review](mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/README.md)
adds one contextual module within the existing Home/Room conversation: photo
browsing/no-result, supplied-screen explanation/guidance, exact message review/
prepared-not-sent, silent playing/unavailable media and local text preview/
applied-restore. Message states reuse the shared consequence renderer; other
variants share `outcome-ui.js` and the existing versioned task model. They are
not new destinations. The composer stays in normal flow beneath the result.
The [session record](../10-execution/sessions/2026-09-20-core-outcomes-frontend.md)
owns exact tests and deviations. All outcomes remain explicit fictional browser
fixtures, not evidence of capture, playback, sending, Android settings or access
to another application.

## Fictional Rooms-system checkpoint

The [Rooms-system review](mockups/2026-09-20-rooms-system/frontend-checkpoint-1/README.md)
extends the existing six-room frontend with independent canonical items and
memberships, local search, All items/Unfiled, create/edit, persistent organization
Undo, archive/restore and separately scoped room/item deletion. These are
in-memory fixtures, not persistent personal data or external file operations.
One native dialog family overlays the current place; the shared conversation
renderer and active Stop contract remain unchanged. Kitchen source examples
name Trips without changing Kitchen atmosphere; denied-source review cannot
grant access. Empty/loading/offline/missing-art are deterministic review states.
The [scoped session](../10-execution/sessions/2026-09-20-rooms-system-frontend.md)
owns exact validation and browser-only limits.

## Shared temporary conversation surfaces

The [20 September shared-state checkpoint](mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/README.md)
implements the accepted [place-preserving contract](shared-conversation-state-surfaces.md)
over Home and all six existing Rooms. Listening/transcript expand the Round
composer; clarification, exact preview, activity and alternative Prepared/
Unknown outcomes use one message-surface renderer. Existing model approval
versions, cancellation, scheduler and optional connected wire behavior remain
the authority. This is not seven routes or a production speech implementation.

Stop replaces Send and a fixed fallback appears only when the composer Stop
is offscreen. Navigation resolves active work before leaving; result departure
requires Done and leave. Inline preview remains nonmodal, secondary settings
expire its approval while retaining edits, and native interruption dialogs
own focus only while open. Origins preserve Room subview, scroll and focus.
The [session record](../10-execution/sessions/2026-09-20-shared-state-frontend.md)
owns exact files/checks and limitations. No microphone, provider, external app,
new persistence, Android or real outcome evidence is introduced.

## Selected Home checkpoint

The [content/art separation refinement](mockups/2026-09-20-room-content-separation/README.md)
retains the large hero footprint while finishing its fade before collection
symbols and restricting chat to a clean left grid column. Masks follow measured
content boundaries on resize. Artwork cannot compete with browse labels or
extend behind the chat reading column; narrow/large-text reflow stays single-column.

Simon's subsequent [footprint refinement](mockups/2026-09-20-room-footprint-refinement/README.md)
removes the hidden-continuation width cap: Other rooms starts at the ordinary
page margin and sizes three complete entries within its new width. Hero art
now belongs to the outer page shell, reaches its right edge and uses a larger
viewport-scaled footprint; masks blend artwork independently of its size.
Chat portraits retain their aspect ratio at a substantially larger scale.

The [responsive room repair](mockups/2026-09-20-room-layout-repair/README.md)
replaces fixed artwork crops with a full content-sized hero layer and
uncropped chat portraits. The room composer follows content in normal flow;
its body/pointer share one continuous outline and separated focus contour.
Hide centers Home's remaining room row. Room continuations remain strictly
derived from the active room's own fixture, not Home's Kitchen continuation.

**20 September cleanup:** Simon requested object/decor artwork for Home and
library entries, portraits for continuation and room conversation, larger
fading overview atmosphere without a separate corner object, larger text and
marks, tighter room spacing and brighter mockup-blue outlines/important actions
without making ordinary text blue. The browser implements this as `#0066DD`,
with Ink text and unchanged violet focus/burgundy Stop. This is a scoped visual
revision, not final brand acceptance. Scrollbar chrome is hidden while real
overflow and explicit Previous/Next remain. See the
[separate cleanup evidence](mockups/2026-09-20-context-rooms-cleanup/README.md).

The executable prototype integrates the selected [Explicit Scroll Row Home](mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md) with the existing conversation shell and five scripted workflows. It retains Harbour Blue, the Round composer, one fictional Kitchen continuation, truthful written overflow controls and direct `See all rooms`. Six starter rooms now use unchanged selected local pack assets.

Under Simon's subsequent explicit six-room request, this [T-119](../10-execution/backlog.md#t-119) checkpoint includes Kitchen, Fitness, Trips, Garden, Reading and Projects: four-symbol overview, all eight collections, direct search, fictional item detail and reversible source-aware conversation. The Rooms library provides Search all/All items/Unfiled and retains the bounded five-step local creation flow. The [contemporaneous session](../10-execution/sessions/2026-09-19-context-rooms-frontend.md) records authority, review and exact limits. The later Rooms-system checkpoint adds in-memory membership receipts/Undo, archive/restore and separated room/item deletion. Persistent room data, policy-enforced cross-room retrieval and production context contracts remain later slices. Room fixtures never enter the scripted task model or connected backend.

The Kitchen vertical-slice references are integrated design dependencies at
`docs/02-design/mockups/context-rooms/kitchen-vertical-slice/iteration-1/`.
One reusable room renderer implements their overview → collection → detail →
conversation grammar. It preserves canonical truth where raster copy differs:
fictional stopping points are labelled as fixtures, controls use actual
overflow state, and Ask pre-fills a question but requires Send. Each sourced
answer owns its source receipt and inspection control; the receipt remains
beside that answer as the conversation grows. Source exclusion affects only
later answers, while the earlier receipt remains unchanged and says that the
source is excluded from new replies. Returning Home clears room priority; ordinary scripted requests still
work inside a room with the same task/Stop controls.

Current connected runtime: [versioned local backend/MCP contract](../04-architecture/conversation-runtime-contract.md). Scripted remains default; local demo uses a stub model with actual MCP/store operations. Explicit live synthetic consent is available only when the backend enables it. One assistant session now follows Home and all fictional Rooms; Home sends no Room sources and a Room sends at most three non-private current-Room fixtures. One paid synthetic Room question succeeded on 2026-09-20, which does not establish general model reliability.

## Authority, artifact and limits

Simon authorized the local conversation-first build on 2026-09-14 and asked to continue its working message checkpoint direction on 2026-09-15. The [direction and authority record](conversation-first-plan.md) distinguishes exploration from final interaction/brand acceptance. The [session handoff](../10-execution/sessions/2026-09-14-conversation-build.md) owns actual integrated checks, reviewer findings and publication.

The default prototype is a rule-based, fictional-data browser simulation of the planned stock-Android tablet experience. The five scripted workflows have no backend. Simon separately authorized frontend coordination with a local backend/MCP demo on 2026-09-15; its explicit connected mode uses the same assistant, not a replacement UI. Connected mode now has a bounded server-side SQLite store for synthetic conversations and exact message evidence; neither mode uses browser persistence. Neither mode has authentication, capture, audio, real account action or analytics. It is not T-103, a device verifier or an Android capability demonstration. Figma remains paused; [historical contract](figma.md) is optional context, not a dependency.

Connected history uses stable conversation IDs. Starting anew creates a new backend conversation/session and archives the prior transcript; Today opens the exact read-only ID on its row. Fixed fictional samples remain labelled and cannot alias the active conversation. Every answer renders only citations fetched for its persisted assistant message ID. Selecting or excluding a source controls future retrieval and never rewrites an earlier answer. Clear history retains the active conversation and fixed samples; Reset everything creates a fresh offline conversation after removing nonfixture conversations. [The storage contract](../04-architecture/conversation-evidence-store.md) owns the exact lifecycle and limits.

[Run and test commands](../../prototypes/stage-1/README.md): serve the intended checkout on loopback, normally http://127.0.0.1:4173/. Reviewer mode is **?review=1**; its controls are not inserted in participant mode. A running server serves its worktree, not automatically main. Restart only a server owned by this task after server-allowlist changes. There are no dependency installs or build steps.

## Interaction contract and implementation

Home presents one invitation, a persistent labelled Round composer with written Talk/Send, quiet Menu, at most one compact continuation and the open room row. A person can type or explicitly start simulated Talk without choosing a Room. Supported input proceeds directly; necessary clarification, results and specific previews appear in the current turn. No feature-grid Home, sidebar, prompt-chip wall or mandatory task-category picker. Unmatched requests ask for a useful clarification and accept another typed response.

The composer precedes continuation/Rooms in the document and narrow/large-text reading order. At expanded landscape, CSS places continuation/Rooms above the bottom-near composer to match the selected composition. The renderer measures the row's actual `scrollWidth`/`clientWidth`: Previous/Next are suppressed when all entries fit, expose accessible first/middle/last state when they do not, retain the activating control's focus and announce one newly foregrounded range per discrete movement. At narrow width or 200% app text/combined 300% review text, Rooms become a direct vertical list before labels shrink or essential horizontal scrolling is required.

[Intent grammar](../../prototypes/stage-1/intent.js) and [fictional fixtures](../../prototypes/stage-1/fixtures.js) are separate from [task transitions](../../prototypes/stage-1/model.js), [cancellable scheduling](../../prototypes/stage-1/scheduler.js) and [rendering/reviewer controls](../../prototypes/stage-1/app.js). There is no generic agent framework. Fixed date interpretation uses **14 September 2026**; “yesterday” means 13 September, regardless of the computer date.

Normal progression uses 650 ms demonstration stages, configurable to bounded shorter/longer delays in reviewer mode. These are design timings, not measured AI/Android latency. Every scheduled callback binds to epoch/task/version/stage. Stop, editing, reset and replacement revoke stale work. Preview expiry revokes authority after 60 seconds without discarding the draft or creating countdown pressure. These simplified frontend checks do not implement production authorization/journaling.

A new consequential request never queues behind old work. The interface resolves unfinished-draft/input loss before replacement. Chat submission and incidental “yes” cannot approve an external consequence. The active preview binds person, channel, full content and effect; historical controls cannot approve a newer task. Unknown effect has no blind retry. Default messaging ends at a fictional unsent draft; hypothetical admitted-send review remains explicitly separate.

<a id="journey-and-component-coverage"></a>
## Journey and component coverage

| Journey / stable owners | Current conversation route | Required adverse/recovery review |
|---|---|---|
| SCR-003/016/017; CMP-007/010/011/012 | Global Home → six-room library/overview → collection/search → item → explicit source-aware fixture question; optional local creation | All 48 labelled symbols, source inspection/exclusion, Home priority reset, continuation hidden, no/one/all-fit/overflow/image failure, narrow/large text, focus/range announcement; no room required for ordinary requests |
| J-003; SCR-003/004/006/007/005/008; CMP-001/002/003/005/007 | Tell/message/text → person/channel only if unresolved → exact editable preview → specific approval → automatic unsent handoff | Wrong/ambiguous person, exact body, changed/stale/expired approval, editing, Stop, unknown, recovery without resend |
| J-001; SCR-004/006/007/005/008; CMP-005/009 | Person/date request → local fixture filter → inline illustrated collection → individual viewer and return | Alias deletion/ambiguity, date correction/no matches, uncertain source date, permission loss, mark-read disclosure for message-source route |
| J-002; SCR-002/004/005/008/014; CMP-006/008 | Request explanation → explicitly supplied fictional screen → plain explanation → simpler or known return target | Unknown context, sign-in/protected surface, failed/partial return; no actual browser/Android observation |
| J-005; SCR-004/006/005/008/014; CMP-006/009 | Artist/title request → ambiguity if needed → silent inline player → pause/resume | Offline, unavailable/paywall, app-open-only partial; opening an app is not playback |
| J-006; SCR-006/011/008; CMP-007/009 | Scope clarification → real local size preview → Apply → Restore | External-app guidance only, pending composer/draft retained, full-thread/menu/confirmation scaling |
| J-007; SCR-001/002/009/010/011/012/015; CMP-002/007/008/009 | Brief introduction and no-microphone entry; Menu/settings/help/people/privacy/history | Explicit preference and alias correction/deletion, minimal-history deletion, reset/new-session distinction, focus return |

The corresponding PRD/UC/EVAL routes remain in [traceability](../01-product/traceability.md). Code/test links cover the browser simulation only. No canonical EVAL-001–017 or production T-103–109/T-119 task is passed by this artifact.

CMP-003 now uses a persistent exact inline preview with an expanded reading/editing surface where needed; it never truncates the consequence. CMP-001 Stop remains reachable during work. CMP-004 announces meaningful state once without displaying internal planning. CMP-005 choices use stable fixture identity and visible differentiators. CMP-006 distinguishes prepared/opened/sent/partial/unknown/stopped, and CMP-009 embeds actual local content/state.

## Data, access and rendering

All scripted runtime data is tab memory. The working thread is ephemeral; recent activity retains at most 20 task-kind/outcome summaries without message bodies or people. Preferences and aliases require explicit actions. Clear conversation, clear history, alias deletion and full reset have distinct scopes; reload clears scripted state. Connected demo requests and synthetic drafts additionally belong to the loopback runtime's session/store: a browser reset does not delete or undo them. No IndexedDB, local/session storage, service worker, external fonts/images/scripts, browser provider connection or telemetry is added.

Photo-workflow assets remain three original fictional SVG illustrations with sender/source/date fixture metadata. Six selected room packs supply 84 local PNGs, with unchanged alpha and SHA-256 source provenance in the [runtime manifest](../../prototypes/stage-1/assets/context-rooms/asset-manifest.json). Written identities and labels remain outside art; fixed image slots survive failures. No asset is personal content or a final-brand claim. Song metadata still belongs to a silent simulated player; screens are chosen fiction, never captured. Passwords, permissions and accounts remain explanation-only boundaries.

User text is rendered as text, never executable HTML/instructions. CSP allows only same-origin connections and blocks media/fonts; response headers disable microphone/camera/geolocation. The scripted loopback server has an exact runtime-file allowlist and rejects other files and write methods, including all API routes; [server tests](../../prototypes/stage-1/serve.test.mjs) enforce it. Connected mode requires the separately owned runtime server on the same origin.

## Connected demo-draft extension

The [frontend coordination record](../10-execution/sessions/2026-09-15-ui-backend-frontend.md) records this separate authority, branch checkpoints and evidence. Backend owns [granny.conversation.v1 at the technically agreed checkpoint](https://github.com/Pueblo98/Granny/blob/aea7f442021347aab0130fcbe220ab5a1ab53b1b/docs/04-architecture/conversation-runtime-contract.md), runtime/MCP/provider execution and server-side verification; frontend owns its client/rendering/browser checks. Technical agreement does not confer product acceptance.

J-003's connected route is **Menu → Settings → About Granny → Demo connection → explicit local-demo consent → natural message request → necessary identity/channel clarification → exact preview → specific create-unsent-draft confirmation → creating → verifying → verified local demo draft, not sent**. This real local draft effect is distinct from the default scripted fictional app-open outcome. Message body edits invalidate approval and request a new exact preview. Person/destination corrections use a new natural request and backend-approved clarification; no parallel frontend contact API is invented.

Only backend events can advance connected work. The frontend fences version/session/epoch/sequence, disables confirmation on editing, Stop or transport loss, and never retries a consequential command on reconnect. A cancellation acknowledgment is required to claim stopped. Unknown effect provides no new-draft/retry action and keeps an in-tab warning after mode changes. Backend session/store retention is disclosed separately from temporary browser state. Local text size spans both views; scripted aliases/activity and remaining workflows stay separate. Reviewer fixture controls do not advance connected execution.

The [run guide](../../prototypes/stage-1/README.md) distinguishes static and connected serving and frontend wire-fixture tests from actual backend/MCP evidence. No live-provider selector, browser key, actual messaging, account action or Android control is added by this frontend slice.

Actual combined browser review on 2026-09-15 passed 13 assertions against backend checkpoint 4d175f6 at loopback 4181: selected identity/channel, exact revised words, verified unsent local demo draft, chat and Stop, with no browser egress/persistence. The frontend separately ran all 22 backend/provider/HTTP tests. Exact source/test/screenshot records and remaining scope are in the frontend session; these are local demo/MCP observations, not production or live-model evidence.

Focus remains with the reader/composer on status changes. Dialogs contain keyboard focus and restore the invoking control; returning from a photo restores position. Status updates do not force scrolling away from older content. Controls have visible labels/focus, large targets and no audio/color-only meaning. Browser CSS geometry is an approximation, not native dp/sp or assistive-tech evidence.

## Selected visual checkpoint

The browser now uses the accepted Harbour Blue roles for this checkpoint: Linen canvas, white surface, dark ink, Harbour Blue accent/outline, blue Send, separated violet focus and red only for Stop/destructive treatment. Reviewer-only Neutral/Open Day/Bright Signal switching was removed because it conflicts with the selected direction. The written `Granny` marker remains a codename/placeholder, not a final logo or public-name claim.

No reviewed local Bricolage Grotesque or DM Sans files are present and the CSP forbids downloaded fonts. CSS therefore declares the intended families but falls back to the system sans stack; exact font fidelity is not claimed. [Stylesheet](../../prototypes/stage-1/styles.css) owns executable values for this artifact while [design system](design-system.md) remains the semantic owner.

## Short walkthrough

1. On Home, type an ordinary request without choosing a Room. Hide the continuation; open Kitchen, a room and `See all rooms`, then use `Back to Home` and check focus return.
2. In reviewer mode compare no/one/all-fit/forced-overflow/image-failure and combined 300% text. Use Previous/Next only in true overflow; check its first/middle/last state and one range announcement.
3. Type “Tell David I’ll call after dinner.” Choose the person/channel, change the message, inspect the exact effect, and open the unsent draft. Check whether its result is unmistakably unsent.
4. Type “Show me the photos Sophie sent yesterday.” Open an illustration, browse and return. Change person/date; compare the source and mark-read variant.
5. Type “What am I looking at?” Choose a fictional display-settings screen, simplify the explanation and return to the known article. Compare unknown/protected cases.
6. Type “Play some Nina Simone.” Choose a track, pause it, visit settings and return. Compare playback with an app-open-only result.
7. Type “Make this easier to read.” Preview, apply and restore Granny text; compare external-app guidance.
8. Through Menu, try an alias correction/deletion, history clear, no-microphone Talk path and a new conversation while input is unfinished. Inject workflow failures/expiry/unknown separately from the Home fixtures.

Record where the next action or consequence feels unclear. Final visual preference and representative-user comprehension remain separate from browser pass/fail.

## Current evidence and remaining work

The [Rooms session](../10-execution/sessions/2026-09-19-context-rooms-frontend.md)
owns the current six-room delivery and [screenshot review](mockups/2026-09-20-context-rooms-frontend/README.md). Its
[Rooms suite](../../prototypes/stage-1/rooms-browser-check.mjs) extends the
existing Home/workflow checks; [review capture](../../prototypes/stage-1/rooms-review.mjs)
reproduces the visual states. Browser evidence does not establish Android
dp/sp geometry, TalkBack/switch behavior, user comprehension or production
context/privacy correctness.

[Current Home session evidence](../10-execution/sessions/2026-09-19-explicit-scroll-row-home.md) records the implementation, current checks, screenshot comparison and precise limits; the earlier [conversation session](../10-execution/sessions/2026-09-14-conversation-build.md) retains the five-workflow history. [Home browser tests](../../prototypes/stage-1/home-browser-check.mjs) exercise real overflow, routes, focus, fixtures and responsive states; the existing [workflow browser tests](../../prototypes/stage-1/browser-check.mjs), [model](../../prototypes/stage-1/model.test.mjs) and [scheduler](../../prototypes/stage-1/scheduler.test.mjs) retain the safety and task regressions. The test-only browser driver does not run a suite by itself.

Unrun: physical Android/IME/permission/route/Stop tests, CSS-pixel-to-Android-dp target proof, real voice, TalkBack/screen-reader/switch tests, representative older-adult comprehension, and final name/logo/type/art acceptance. T-101/103–109 and production gates retain their existing evidence requirements. Simon's checkpoint authority is not a participant study or blanket acceptance.

## Historical initial-prototype evidence

Final checks on 2026-09-14 used existing Node 26.8.1 and Chromium 151.0.7922.173, with no installed dependencies:

| Command | Observed result | Evidence boundary |
|---|---|---|
| `node prototypes/stage-1/model.test.mjs` | 36 tests passed, 0 failed | In-memory design transitions and mock confirmation invariants only |
| `node prototypes/stage-1/browser-check.mjs` | 57 assertions passed, no browser errors | Five happy paths, typed entry, edits, expiration, Stop unknown/no resend, setup decline, alias deletion, heading focus/Escape, no storage/third-party app requests, loopback file allowlist, Home/confirmation geometry at 360/600/840 including combined 300% text |
| `python3 scripts/validate-docs.py` | PASS, 0 errors; 80 Markdown files, 1,461 local links, 4 preserved source hashes | Local metadata, links, stable IDs, tables and source integrity; 97 external links not fetched |
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | 19 tests passed | Documentation-validator regressions, not product tests |
| `git diff --check` | Exit 0 | Patch whitespace only |

Home at 1200 and confirmation at 360/840 were screenshot-inspected. Generated screenshots and the isolated browser profile remain temporary local review artifacts, not committed product assets. Browser checks can be reproduced from the source; exact temporary paths are printed per run.

Canonical EVAL-001–017, physical Android tests and human studies remain unrun. This is a design-state mock, not an independent action verifier, production authorization core or proof of the product thesis.


## Delegated live synthetic conversation entry — 2026-09-15

Under Simon's backend integration mission and 2026-09-20 Room extension, the first composer submission from Home, a Room or an item-level **Ask Granny** checks only the same-origin runtime configuration. If the backend reports `liveAvailable`, the submitted words remain in place while a separate consent names synthetic conversation and bounded current-Room fixture egress to OpenRouter/Qwen. Cancel makes no session or model call and preserves the question. Confirming creates a live session and sends that original question with Home/no-source or the current bounded Room source envelope; it must not fall through to a scripted Room reply. Menu → Settings → About Granny → **AI connection** remains an explicit alternate entry and exposes the clearly labelled offline fixed-response test. If no live backend is available, the existing static scripted prototype remains usable. Keys never enter the browser. No recording, account access, real sending, new capabilities or increased caps.

Live-mode snapshots must match the explicitly consented mode. Mode labels and privacy text disclose provider egress, while exact draft confirmation and backend verification stay unchanged. Unknown/Stop/replay fences remain in force. Client/wire and actual live-mode HTTP/MCP tests use a stub provider. A separate one-call paid Qwen Room smoke returned the expected grounded ingredient answer and source binding with no draft write; it does not imply reliable general interpretation. Existing interaction layout/style is unchanged apart from enabling the shared connected conversation, direct first-question entry and answer-owned source receipts inside Rooms.

For this local prototype only, **Today** now separates conversations from
minimal task activity. Starting a new connected conversation snapshots the
prior transcript in browser-tab memory, opens a fresh backend session in the
already selected mode and leaves the prior transcript readable until reload or
**Clear history**. Seeded rows are labelled **Fictional sample** and open their
own distinct transcript rather than returning to the active chat. No transcript
is written to browser storage; this does not define production retention,
backup, search or multi-session continuation.
