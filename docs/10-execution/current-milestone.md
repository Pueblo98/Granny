---
title: "Current milestone — Context Rooms and native voice/readback shells"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution]
related:
  - development-readiness.md
  - backlog.md
  - open-questions.md
  - ../01-product/prd.md
---

# Current milestone — Context Rooms and native voice/readback shells

## Conversation and evidence ownership — 2026-09-20

The authorized bounded local prototype now uses a versioned backend SQLite
store for synthetic conversations, messages, source revisions, retrieval and
provider runs, future source preferences and exact message-evidence links.
Every rendered citation is queried by its assistant message ID; current Room
candidates and selected-next state cannot become historical evidence. New
conversation creates a fresh conversation/runtime session, Today opens exact
read-only IDs, and completed transcripts survive reload/backend restart.

[ADR-0017](../09-decisions/ADR-0017-local-conversation-evidence-store.md)
proposes the storage choice and the [store contract](../04-architecture/conversation-evidence-store.md)
defines schema/lifecycle. This is synthetic local evidence on an unmerged
T-117/T-119 dependency line. It does not select Android Room, admit personal
data, accept production retention/encryption/deletion or pass EVAL-008/012.

## Iteration-1 review checkpoint — 2026-09-20

Simon completed the integrated browser walkthrough after PR #44 and reported
the first frontend iteration cohesive and good for now. The Home/Rooms scrolling
and room-emphasis refinement is also accepted for this checkpoint; no frontend
revision is queued. This is owner review of the fictional browser artifact, not
representative-user comprehension evidence or a GATE-05 pass.

Simon also reported the repaired native interaction and requested tablet
accessibility smoke checks working well. [The follow-up record](../08-research/2026-09-20-native-tablet-followup-feedback.md)
captures the narrow positive observations and missing configuration/case data.
Spoken readback is slightly improved but still below the desired naturalness.
No cloud voice, alternate engine or provider/data-flow change is selected.

Simon selected setup/capability status followed by a local fictional
draft/clarification/preview as the next bounded product-app work. The draft
slice may proceed entirely offline and must stop before external handoff or
send. Production Recent activity still waits for its storage/backup/retention packet;
the synthetic browser database does not satisfy that dependency.
T-101 separately owns selected-package, retention, egress and external-route
evidence.

## Native voice continuity repair — 2026-09-20

[Simon-reported smoke feedback](../08-research/2026-09-20-native-tablet-smoke-feedback.md)
is positive for text-size cancellation, Apply/Restore and the background case,
but identifies lost voice drafts, single-sentence cutoff and robotic readback.
The [source repair](sessions/2026-09-20-native-voice-continuity.md) preserves
existing words, collects bounded successful recognizer segments until Done/Stop,
and ranks eligible offline voices by locale and declared quality. The repaired
APK is host-checked and its package update succeeded; functional retest is unreported; no quality or gate
acceptance is claimed from the original smoke run. Simon's later follow-up is
positive for the repaired interaction/access paths, while readback naturalness
remains unsatisfactory; exact configuration, trials and timings are still
missing. New device actions remain separately scoped.

## Native conversation integration — 2026-09-20

The [integration session](sessions/2026-09-20-native-conversation-integration.md)
joins T-120/C5 and T-121 source in the existing `android/stage1` app and is
integrated on `main` through the native PR sequence ending in PR #42.
One coordinator owns typed/final spoken requests, clarification, exact preview,
one-use approval, Stop and known/unknown results while Home/fictional Kitchen
remains the underlying place. Only debug C5 text size is enabled; candidate
builds and C2 screen explanation fail closed. Explicit readback and speech-rate
controls share input/output exclusion, exact rendered-text revisions, audio
focus and touch-exploration suppression. Host checks are source/fixture evidence.
Simon's later bounded smoke checks provide positive owner-reported device
observations but not the complete versioned matrix. T-101 and GATE-03/04/06
remain open; T-104 has no admitted route.

## T-121 explicit spoken readback and speech controls — 2026-09-20

Simon authorized the first standalone spoken-output tablet slice. [T-121](backlog.md#t-121)
is implemented for review on top of the published T-120/C5 Android shell. It
adds explicit Read request aloud, Stop speaking, revision-bound Repeat, Sound
off/on and four closed speech-rate choices with listen-before-Apply and
one-step Restore. Nothing is read automatically. Talk/Type stops output, the
global Stop interrupts it, editing invalidates the old utterance and late
engine callbacks cannot revive stopped speech.

The Android adapter accepts only an installed locale-compatible voice reporting
that it does not require a network connection. There is no Internet permission,
provider SDK, model, generated audio file or network fallback; the written path
remains complete whenever speech is unavailable. Speech settings use private,
versioned storage with compare-and-set and explicit readback. Host tests cover
state, stale callbacks, exact revisions and persistence failure handling, while
debug assembly and lint pass. Simon later reported the repaired flow and access
checks working on the reference tablet; audible quality is slightly improved
but still unsatisfactory. Engine/voice identity, network state, repetition
counts, audio-focus behavior, Stop latency and rate fidelity remain unreported
under EVAL-007/009 and RES-06. No gate passes from this smoke feedback.

## Profile and accessibility adaptation review — 2026-09-20

The proposed [Profile and accessibility iteration 1](../02-design/mockups/2026-09-20-profile-accessibility/iteration-1/README.md)
adds one local Profile support destination and nine representative Harbour Blue
stress states: 200% text, narrow window, keyboard open, keyboard focus, reduced
motion, no microphone, artwork disabled, long copy and annotated screen-reader
order. The adaptations preserve the current Home/Room/conversation, written
controls and stable composer rather than creating separate accessible pages.

This is a visual-review checkpoint. Profile does not authorize an account,
public identity or new personal-data store. The accessibility frames establish
patterns to review but do not prove the complete per-screen matrix, Android
insets, TalkBack, switch access, actual permission state, runtime motion or
representative-user comprehension. Canonical propagation and an implementation
metaprompt wait for Simon's feedback.

## Navigation and supporting surfaces visual review — 2026-09-20

The proposed [navigation and supporting surfaces iteration 1](../02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/README.md)
adds 13 Harbour Blue references for Menu, minimal Today history, Settings,
Privacy/data, Accessibility, Help, new conversation, return from an external
app, global search and three-step skippable onboarding. Navigation stays a
quiet written layer around the conversation; supporting destinations use one
readable sequence rather than dashboards, and onboarding separates reversible
preferences from optional access reviews.

The rasters do not themselves implement navigation, persist history or
preferences, request Android permissions, search external apps or prove
return-state verification. Simon subsequently approved the direction for the
then-active frontend session through the bounded
[navigation/supporting-surface implementation metaprompt](../02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/NAVIGATION-SUPPORTING-SURFACES-IMPLEMENTATION-METAPROMPT.md).
The handoff defines each screen's purpose, exact fixture copy, entry/exit,
state ownership, focus and responsive behavior, cross-surface journeys and
tests. It remains fictional browser work and stops before Android, real
permissions, durable personal data or external-app claims. The implementation
is integrated through PR #44 and Simon's iteration walkthrough found the
supporting system cohesive; no immediate revision is requested.

## Core outcome modules visual review — 2026-09-20

The proposed [core outcome modules iteration 1](../02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/README.md)
applies the Harbour Blue conversation shell to Photos, screen explanation,
message drafting, media and reading assistance. Ten fictional-data frames pair
each useful state with a no-result, guidance, prepared-handoff, unavailable or
restore state. Each outcome remains one inline contextual module above the
stable Round composer; none is a separate mini-app dashboard.

The original rasters alone did not implement modules or prove external
retrieval/action. The five reusable fictional module families and navigation
support are now integrated through PR #44. Simon's iteration walkthrough found
them cohesive and requested no immediate simplification; their external
capability and human-comprehension evidence remains unrun.

Simon subsequently authorized the then-active frontend session to implement all ten
references through the bounded
[core outcome-module implementation metaprompt](../02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/CORE-OUTCOME-MODULES-IMPLEMENTATION-METAPROMPT.md).
The handoff treats them as five reusable inline module families over the
existing Home/Room conversation, specifies deterministic fictional fixtures,
state transitions, responsive/accessibility checks and full prototype
regression coverage, and stops before navigation/supporting surfaces, real
services or Android work.

## T-120 native on-device voice decision and implementation — 2026-09-20

Simon accepted [ADR-0011](../09-decisions/ADR-0011-explicit-activation-and-access.md):
Stage 1 starts with explicit tap-to-talk and Android's on-device
`SpeechRecognizer`, retains a complete typed path and defers Whisper-class,
cloud/realtime and small cleanup-model routes. Initial cleanup is limited to
Android formatted/raw hypotheses plus deterministic whitespace and punctuation
spacing; the final visible transcript remains editable and no transcript
rewriting grants action authority.

[T-120](backlog.md#t-120) is in review. Its [first own-app Android
shell](../../android/stage1/README.md) requests microphone access only from
Talk, uses only `createOnDeviceSpeechRecognizer`, fails to Type when on-device
recognition is unavailable, rejects stale callbacks after Stop/session
replacement and retains no raw audio or default transcript history. Sixteen
pure host cases pass with debug assembly and lint; the APK permission dump
contains only `RECORD_AUDIO` and its runtime dependency graph is empty. Host
evidence proves only that bounded local contract. Subsequent Simon-reported
smoke checks on the reference tablet are positive for repaired continuity,
permission/access fallbacks and accessibility paths. Exact recognizer, locale,
network/acoustic conditions, repetitions, timings and correction effort remain
unreported under RES-06 and EVAL-005/007/009/012; no gate passes from the
decision, scaffold or smoke feedback. The integrated shell and repair are now
on `main`.

## Rooms system visual review — 2026-09-20

The proposed [Rooms system iteration 1](../02-design/mockups/2026-09-20-rooms-system/iteration-1/README.md)
now covers 17 missing library and lifecycle states: full library, search, All
items/Unfiled, create/edit/organize with Undo, archive/restore, separate room and
underlying-data deletion, cross-room disclosure, sensitive-source denial, and
empty/loading/offline/missing-art fallbacks. It preserves Harbour Blue, open
room portraits, direct browse rows and the stable conversation shell.

The frames were not accepted by generation alone. The complete in-memory
fictional Rooms slice is now integrated through PR #44, and Simon's walkthrough
found the result cohesive and good for now. Production persistence,
policy-enforced retrieval and representative-user evidence remain separate.

Simon subsequently authorized the then-active frontend session to implement the
complete fictional Rooms slice from a bounded
[implementation metaprompt](../02-design/mockups/2026-09-20-rooms-system/iteration-1/ROOMS-SYSTEM-IMPLEMENTATION-METAPROMPT.md).
The handoff requires reusable in-memory Room/item/membership state, direct
browse/search, reversible organization, separated deletion scopes, disclosed or
denied cross-room sources, degraded fixtures and regression/accessibility
coverage. It does not authorize persistent personal data, backend retrieval or
Android work.

## Shared conversation state pack — 2026-09-20

The first [shared state pack](../02-design/mockups/2026-09-20-shared-state-pack/iteration-1/README.md)
applies Harbour Blue to one fictional message-draft slice: listening, editable
transcript, recipient clarification, exact consequence preview, active work
with visible Stop, verified prepared-not-sent and unknown-outcome recovery. It
is a seven-frame design reference, not implementation or evidence that every
state is linear, accessible on device or capable of acting in another app.
Review should test whether the safety detail stays clear without overwhelming
the calm conversation surface before implementation fidelity is expanded.

Simon subsequently clarified and accepted the [shared state-surface
contract](../02-design/shared-conversation-state-surfaces.md): these mockups
specify essential state hierarchy, copy and controls, not seven full-page
destinations. Home or the current Room remains underneath; the bottom composer
expands or one temporary task surface appears above it, with a larger focused
sheet allowed only when content or access needs require it.

The [shared-state implementation metaprompt](../02-design/mockups/2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md)
provided the frontend session an executable handoff for all seven references.
The integrated implementation uses reusable bottom-connected state surfaces over both Home
and Rooms, deterministic fictional fixtures, responsive/accessibility coverage
and preserved safety behavior. Simon's walkthrough requested no immediate
revision; this does not authorize backend, Android, real microphone or
external-app work.

## C5 local text-size implementation — 2026-09-20

The [C5 slice](sessions/2026-09-20-c5-native-text-scale.md) extends the existing
[native voice shell](../../android/stage1/README.md) with closed text-size
choices, isolated preview, explicit Apply, private saved-value readback and
Restore previous size. It adds no permission, dependency or network route.
Source/host evidence is supplemented by Simon's positive smoke report for the
requested persistence/restart, large-text and access paths. The report lacks
case-level configuration, repetitions and layout/traversal measurements, so the
[synthetic tablet packet](../10-execution/t101-c5-tablet-verification.md) is not
fully closed. T-101 and GATE-03/04/06 remain open.

## T-101 route and partial physical inventory — 2026-09-19

The [current-source route assessment](../08-research/2026-09-19-t101-route-inventory.md) now covers all five ADR-0009 experiments and prepares the non-identifying physical inventory and smallest synthetic experiments. It finds a go route for Granny-local text, a conditional route for scoped screen explanation, conditional honest message compose handoff but no send claim, and no ordinary candidate route for sent-photo provenance. The 2026-09-20 refresh found Spotify technically plausible but prohibited by its current policy for Granny's accepted voice-assistant control behavior. Apple MusicKit remains an unreviewed desk lead, not a selected route. The current named plan therefore reaches ADR-0009's explicit revisit point; no scope or gate changes without Simon's decision.

Simon then manually read non-identifying Settings values from `TBL-01`: Samsung `SM-X238U` / Galaxy Tab A11+ 5G, Android 16, One UI 8.0, build/patch, English (United States), partial display/input/access state and installed-app versions. The [physical record](../08-research/2026-09-19-t101-physical-inventory.md) is user-reported and incomplete; Codex did not connect to or operate the tablet. No command, install, update, grant, account/content inspection, external-app actuation or capability experiment occurred.

T-101 remains in progress; GATE-03/04 and GATE-06 device/real-data conditions remain open. The [lab-only Android 16 scaffold](../../experiments/c2-screen-explanation/README.md) now has four bounded [C2 device runs](../08-research/2026-09-19-t101-c2-device-evidence.md). Across the repaired runs, the synthetic protected-scene and ordered stale-result regressions closed; visible Stop, lock cleanup, resize/result recovery and task-removal cleanup produced positive observations. The merged [C2 local safety repair](sessions/2026-09-20-android-c2-local-safety-sprint.md) passes 49 host cases; its additional source changes remain unrun on Android. The [narrow C2 packet](t101-c2-identity-retention-egress-packet.md) now makes the blocker executable: the current observer/API cannot prove selected-package identity, and source-reviewed fixture-origin plus metadata-only retention/per-UID egress harnesses must precede another claim-bearing run. Both latest-run packages were removed; debugging authorization, USB debugging and Developer options were disabled, and the cable was disconnected. T-104 still waits for actual sent-photo route and device-safety evidence; T-106 waits for a policy-compatible named media decision.

## Active Context Rooms plan — 2026-09-19

Simon accepted [ADR-0015](../09-decisions/ADR-0015-context-rooms.md): optional
[Context Rooms](../02-design/context-rooms.md) organize related material around
the same global Granny assistant. Global conversation remains the universal
starting point; room context foregrounds local references while minimum,
policy-scoped cross-room retrieval remains possible. Rooms use large labels and
bounded atmosphere, retain direct browse/search, and separate deleting the
room from deleting underlying data.

Simon subsequently directed the entire notebook and future sessions to use
this direction. The original bounded plan was [T-119](backlog.md#t-119): extend the
conversation-first shell with global Home, a direct Rooms library, one Kitchen
room, direct browse/search, one provenance-carrying cross-room example and the
archive/delete-room distinction, all with fictional in-memory data. Stable
owners are PRD-FR-022, UC-026, J-009, SCR-016/017 and CMP-011.

The September 20 implementation checkpoint below supersedes that first-slice
selection for this browser session only: six starter rooms and reversible
same-room source examples. Cross-room retrieval and archive/delete remain
later bounded work, not implied delivery.

**Room-aware connected assistant checkpoint — 2026-09-20:** Simon explicitly
requested the existing OpenRouter-backed local runtime be joined to Home and
every fictional Room. The bounded task branch keeps one session/personality,
the private key in the loopback backend, explicit live consent and existing
draft confirmations. Home supplies no Room sources; a Room may supply at most
three deterministic non-private current-Room fixtures, with a visible source
receipt. Deterministic backend/browser checks cover all six Rooms, and one
separately invoked paid synthetic Kitchen question returned a grounded answer
with no draft write. The [session](sessions/2026-09-20-room-chat-openrouter.md)
owns exact evidence. This does not admit real personal data, cross-room
retrieval, Android integration, persistence or a production model/vendor.

Production placement is proposed for App V1 because useful Rooms depend on
durable organization and rights that the five-workflow MVP intentionally does
not provide. Exact navigation, terminology, default rooms, visual treatment
and real persistence remain evidence-gated. This plan authorizes documentation
and a separately requested fictional-data prototype; it does not authorize
personal-data storage or silently expand the MVP.

### Room visual asset preparation

The next visual-production input is now specified without generating assets or
expanding T-119. The [visual system](../02-design/context-room-visual-system.md)
defines the room mark, five removable atmosphere roles, direct-browse symbols
and a low-effort reviewed-pack chooser. The
[starter catalog](../02-design/context-room-starter-catalog.md) links complete
Kitchen, Fitness, Trips, Garden, Reading and Projects dossiers: 48 mark ideas,
48 atmosphere packs and 48 collection-symbol concepts. The
[production brief](../02-design/context-room-asset-production.md) stages twelve
contact sheets and one UI-ready identity per room before later variants, then
defines dimensions, file/manifest rules, prompts, safe zones, fallbacks and
review checks. Granny may recommend a known local pack; arbitrary runtime
generation and inferred personal taste are excluded. No image asset or
frontend implementation is claimed by these notes.

The [iteration-1 execution metaprompt](../02-design/context-room-iteration-1-metaprompt.md)
now directs a fresh session to generate the first complete identity for each
room one asset at a time: 14 files per room and 84 total, with one shared visual
bible and no contact-sheet composites or later-pack expansion.

## Font/color boards and local mockup iteration — 2026-09-19

**Final/current selection — Harbour Blue:** Simon chose iteration 5 / 04 as the design system for now. [The selected image and one-to-one written reference](../02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md) are filed together in a clearly marked final folder. [Selection record](sessions/2026-09-19-harbour-blue-selection.md) owns preservation and validation evidence. Main-board choice is resolved; implementation and access evidence remain separate. All earlier round summaries below are historical.

**Home composition selected — Explicit Scroll Row:** Simon selected [round 4 option A](../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md) as the Home direction to use and develop in future sessions because it is direct, accessible and visually strong. [ADR-0016](../09-decisions/ADR-0016-explicit-home-room-row.md) now carries the accepted composition: stable conversation anchors, one compact continuation when useful, open unframed room portraits, truthful written Previous/Next for overflow and direct See all rooms. It supersedes ADR-0014's conflicting zero-or-one-region limit for the Context Rooms App V1/T-119 extension while retaining the simpler MVP baseline. [Round 4](../02-design/mockups/2026-09-19-harbour-blue-home/round-4/README.md) and rounds 1–3 remain preserved comparison history. Selection does not prove Android geometry, access behavior or comprehension and does not authorize room interiors or frontend implementation by itself.

**Frontend implementation checkpoint:** The selected Home is implemented in
the existing browser shell. Simon then explicitly expanded the active session
from three to six fictional rooms using the new Kitchen vertical-slice
mockups. The [current session](sessions/2026-09-19-context-rooms-frontend.md)
records reusable room overviews, 48 collection controls, library/search,
fictional item details, reversible source-aware replies and explicit local
creation. The expanded Rooms system, outcomes and support surfaces are now
integrated through PR #44; Simon's walkthrough found the iteration cohesive and
requested no immediate revision. This is not final public identity or
representative-human acceptance. Production persistence, backend room context,
Android capability and participant evidence remain outside this checkpoint.

**Iteration 5 — selected Linen foundation:** Simon selected Linen canvas with the existing white surface and dark ink, keeping Soft Plum as baseline while explicitly authorizing blue Send/accent alternatives. [Four final-shortlist boards](../02-design/mockups/2026-09-19-style-boards/iteration-5/README.md) hold the composition fixed, distinguish ordinary border from offset focus ring, and preserve red Stop. The assistant recommends Plum + Cobalt; Simon's main-board choice remains next. [Canonical selection](../02-design/brand-and-visual-identity.md#selected-foundation--linen) and [session evidence](sessions/2026-09-19-linen-final-shortlist.md) separate selected foundation from proposed action values and unrun access evidence. Earlier round summaries below are historical.

**Iteration 4 — selected Soft Plum:** Simon chose [Soft Plum as the visual direction](../02-design/brand-and-visual-identity.md#selected-visual-direction--soft-plum), requesting a less grey, subtly warm off-white canvas and more positive same-family outlines. [Three narrow refinements](../02-design/mockups/2026-09-19-style-boards/iteration-4/README.md) hold layout, white surfaces and plum actions fixed. Canvas/outline shades, exact fonts and production tokens remain open; no gate changes. [Selection and delivery record](sessions/2026-09-19-soft-plum-refinement.md). Earlier iteration summaries below are historical.

**Iteration 3 — historical:** Simon rejected iteration 2's overly colored chat-box/background pairings. Four neutral-foundation presets shared a warm-grey canvas, white composer/panel and common typography, with color limited to small actions. Multiple user-selectable presets were an exploration direction, not implemented settings or an accepted default. The intermediate folder is not retained in this checkout; [iteration 3 evidence](sessions/2026-09-19-style-boards-iteration-3.md) preserves the delivery record.

**Iteration 2 — historical:** Simon's [feedback notebook](<../02-design/mockups/2026-09-19-style-boards/Notes - style boards.md>) drove the round. Four warmer font/color studies retained the rounded composer, blue focus/red state treatments and Bright Signal panel structure. Their intermediate folder is not retained in this checkout. [Iteration 1](../02-design/mockups/2026-09-19-style-boards/iteration-1/README.md) is archived intact; [the iteration-2 record](sessions/2026-09-19-style-boards-iteration-2.md) preserves file/evidence details. No palette/font or gate was accepted.

Simon requested image-model style boards before the next landing/Home and context-panel variations. [Four boards](../02-design/mockups/2026-09-19-style-boards/README.md) explore the existing identity territories with the selected rounded composer; [all prior image rounds](../02-design/mockups/2026-09-17-chat-entry/README.md) are now embedded in a gallery. Exact shade additions remain proposed in the brand owner. Simon also directed mockup-only sessions to work directly in the root/main checkout without worktree/GitHub ceremony; [the scoped exception](git-workflow.md#mockup-only-local-work--2026-09-19) records that authority. [Session evidence](sessions/2026-09-19-style-boards.md) distinguishes file/link verification from in-app, font, Android and human evidence. No identity or product gate is accepted by these boards.

## Claude Design frontend handoff — 2026-09-18

The proposed Stage 1 design system is built and synced in Claude Design project
**Granny Design System (proposed)** from `feature/design-system-build` commit
`17658b0`. Simon requested the next Claude Design session begin developing the
conversation frontend with the selected Codex-designed interaction, very few
visible buttons and the canonical product principles. The retired execution
metaprompt started with the zero-panel Home and complete fictional message
slice, then extended the same interaction language to the other MVP flows and
supporting states. Its delivery record and exact source remain available in Git
history; the browser prototype is now the active implementation medium.

The metaprompt explicitly reconciles the two later accepted design decisions
that are absent from the synced `0.1.0` registry: the Round conversation
composer and ADR-0014/CMP-010 Home context panel. It directs Claude Design to
log those as system deltas instead of silently inventing one-off app tokens.
This handoff does not itself create the frontend, accept proposed brand values,
implement Android code or move a product gate.

## Current design feedback and vault synchronization — 2026-09-17

**Composer shape selected:** Simon accepted [Round conversation](../02-design/brand-and-visual-identity.md#accepted-shape-direction--round-conversation) for compact, normal and expanded use, with a favicon direction. The selected reference is embedded in the brand note and linked from both design handoffs. Palette/type, implementation and device/user evidence remain open; [selection record](sessions/2026-09-17-round-conversation-selection.md) owns this documentation delivery.

**Historical 2026-09-17 handoff:** Simon rejected the browser UI as too button-heavy and generically AI-styled. The separate Claude Code/system and Claude Design/app briefs were prepared under ADR-0013 and the then-current ADR-0014 Home. ADR-0016 and the selected Explicit Scroll Row now supersede that Home input for future work; the old handoffs remain history rather than a current composition brief.

Before this decision task, main and the local vault included the conversation runtime, UI/UX skills, brainstorm, bounded composition and separate design handoffs through PR #14 (cc97e48). Earlier unmerged/stale statements below are historical checkpoints. [The Home decision session](sessions/2026-09-17-context-panel-home.md) records the current scoped change; product gates remain unchanged.

## Simon class brainstorming input — 2026-09-17

[Simon's class brainstorming session](../08-research/source-material/2026-09-17-class-brainstorming.md) is preserved as an attributed planning input. Compatible conversation, contextual-module, guidance/annotation, Android-target and orchestration ideas refine existing proposals without changing gates. On 2026-09-17 Simon retained consequence-based approval and the MVP/App V1/later split, accepted [automatic important-fact memory plus bounded adaptive communication](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md) for App V1, accepted ADR-0013 bounded composition, and accepted the then-current ADR-0014 one-panel Home; ADR-0016 now supersedes that final Home detail for Context Rooms. [OQ-14](open-questions.md#brainstorming-alignment-review--oq-14) is resolved for product direction; human evidence remains open.

## Local backend/MCP experiment — 2026-09-15

Simon explicitly authorized [T-117](backlog.md#t-117), a bounded conversation-first browser/backend/MCP slice with fictional contacts, specific confirmation and verified unsent demo-store writes. [Runtime contract](../04-architecture/conversation-runtime-contract.md) and [session evidence](sessions/2026-09-15-mcp-backend-integration.md) own its actual implementation/test state. Backend and frontend coordinate through published board checkpoints. Dependency installation for the official MCP SDK was explicitly approved. This is an exception to earlier no-backend prototype statements, not T-103 completion, Android integration or promotion of GATE-03/04/06/07–09. Live synthetic Qwen calls retain prior caps and consent; broader data/release gates remain open.

## T-103 offline authority core — accepted and complete

Simon requested the complete T-103 backend sprint on 2026-09-17 and accepted all five bounded review points on 2026-09-19. The [pure offline core](../../prototypes/t103-authority-core/README.md) implements units A-D with named fake ports, controlled time/generations, strict local admission, exact one-use authority, independent ledger verification, Stop/restart ordering, budgets and privacy projection. Its [C01-C20 report](../../prototypes/t103-authority-core/EVIDENCE.md) records 20/20 passing cases and 147 explicit assertions on fixture `t103-fixture-v1`; the existing 25 conversation-runtime tests also pass in the implementation worktree. T-103 is complete for this offline scope. No Android, external app, real message, live provider, MCP execution path or product-gate promotion follows from this acceptance.

## Historical milestone — conversation-first browser experience

At that historical checkpoint, Simon authorized [conversation-first implementation](../02-design/conversation-first-plan.md) on 2026-09-14: message checkpoint first, then the five integrated MVP simulations, supporting preferences/privacy/recovery and proposed visual comparison. He asked to continue the working message direction on 2026-09-15 and authorized a draft PR after integrated checks. [Build record](sessions/2026-09-14-conversation-build.md) owns that checkpoint's evidence/publication. Later integration is recorded above; no backend, Android automation, capture, live media/message or production gate work belonged to the original mission.

T-102/T-119's fictional browser revisions are integrated and owner-reviewed for the current iteration; the development cockpit remains approved and complete. Final public identity, representative participant evidence and all production gates retain their existing owners and limits.

## Previous milestone — cockpit approved; conversation-first plan prepared

Simon approved the development cockpit on 2026-09-14 and requested T-114 complete. [Approval record](sessions/2026-09-14-cockpit-approval.md) owns the exact scope and evidence. The conversation-first app redesign remains a separate review; no product gate changes.

At that previous milestone, Simon's instruction was cockpit first, then a redesign plan. [Cockpit](../Cockpit.md), [visual map](../Development.canvas), [session deliveries and agent board](agent-board.md), and [plugin assessment](obsidian-cockpit-plugins.md) now provide development oversight. Bases/Canvas/Bookmarks were already enabled; no community installation or private Obsidian JSON edits occurred. [Maintenance](cockpit-guide.md) makes records and freshness checks part of future change tasks.

The feature-button Home was rejected by Simon, despite passing mock checks. The [conversation-first plan](../02-design/conversation-first-plan.md) was prepared before the newly authorized implementation above. Browser and cockpit were merged through [PR #3](https://github.com/Pueblo98/Granny/pull/3), 70af0db, on 2026-09-14, and the primary docs/ vault checkout was synchronized. The separate Figma branch remains preserved; this is not a claim every branch was merged.

T-115 delivered [session lifecycle guidance and automated checks](cockpit-guide.md#automated-maintenance-contract), with successful live CI and GitHub-required maintenance enforcement on main. [Its handoff](sessions/2026-09-14-session-maintenance.md) records the inspected settings and validation; [PR #4](https://github.com/Pueblo98/Granny/pull/4) owns final integration state. New change sessions maintain their scoped record and run freshness/coverage checks. This operational work does not implement the conversation-first redesign or pass product gates.

T-118 adds a reviewed project-local [UI/UX skill package](ui-ux-skills.md): one Granny-specific interface-craft layer plus Google's pinned adaptive, edge-to-edge and Android testing guidance with local authority guardrails. This improves later design/development instructions only; no product behavior, native app, device evidence or gate changed.

## Previous milestone — initial browser interaction prototype

Simon switched the design medium from quota-blocked Figma to a local browser on 2026-09-14. [Run the prototype](../../prototypes/stage-1/README.md); [coverage, authority and review checklist](../02-design/browser-prototype.md). T-102's initial design slice now contains five clickable MVP workflows, onboarding, editable drafts/aliases, reversible text scale, and explicit Stop/expiry/failure/unknown scenarios. It uses fictional data, no AI/device capture or real sends. Review and refine this artifact next; T-103 and physical Android work remain separate.

The task branch starts at origin/main ce3f32f, which already includes Git-workflow PR #2. The earlier Figma task branch remains unmerged and preserved; this task does not merge it. Historical no-prototype/read-only statements below describe previous milestones. No product or release gate is passed by the browser checks.

## Workflow refinement follow-up

The following paragraphs retain historical delivery evidence. Git-workflow PR #2 and browser/cockpit PR #3 have since been merged; earlier branch-based startup advice is superseded by main and the current operating instructions.

Git workflow validation, 2026-09-14: in the isolated docs/git-workflow worktree, `python3 scripts/validate-docs.py` passed with 0 errors (78 Markdown documents, four skills, 1,403 local links, four preserved source hashes); the 19 documentation-tool unit tests passed; the changed granny-spec-change skill passed its packaging validator; `git diff --check` passed. The readiness/Figma branch was pushed and its remote HEAD independently verified as a4fc05b315494affb51c63eb979ad263ebd40115. No product eval or main merge was performed. The original checkout's user-owned action-policy heading edit remains outside the published commits. These are mechanical/self-review checks, not proof of future-agent compliance.

Simon's subsequent 2026-09-14 request authorizes GitHub publication and future task-branch pushes with worktree isolation. The [Git workflow](git-workflow.md) owns this standing authority and the validation/commit/push/remote-SHA handoff. The follow-up branch docs/git-workflow starts from a4fc05b and contains the readiness and Figma history; main integration remains pending separate review/authority. Use that branch for sessions needing the new rules until integration. No product gate changes follow from publishing documentation.

Simon's 2026-09-14 follow-up requested a holistic documentation/skills/workflow system **before actual design and development**. T-113 supplied [delivery workflows and four repository skills](operating-workflows.md), [first task packets](task-packets.md), [transaction protocol](../03-agent/execution-protocol.md), [capability admission](../04-architecture/capability-admission.md), [evidence review](../06-evals/evidence-protocol.md) and [research execution protocols](../08-research/research-protocols.md). That historical package created no application code; T-103's cases were subsequently implemented and run in the bounded offline core described above. No external Figma file or participant/device study was created. The official remote Figma MCP connection was verified read-only on 2026-09-14; no canvas mutation or credential/config file was added to the repository.

The current experience implementation is the bounded T-119/T-117 Room-aware synthetic chat extension recorded above; after review, the next product slice still requires a separately ready packet. T-103's offline fake replay remains independently available. No new broad specification-writing milestone is needed. Remaining real-world evidence and Simon decisions still gate production work. Skills are repo-local. No new global setting, plugin or scheduled automation was installed by this repository task; the pre-existing official Figma plugin connection is documented in the Figma contract.

The mission's documentation package is written for review. Only the stock-Android tablet app is active; no Android/runtime/backend implementation was started. Simon accepted the five MVP experiments and control posture on 2026-09-14; detailed product choices remain proposed and technical/user evals unrun. [Development readiness](development-readiness.md) is the authoritative gate/status assessment; [backlog](backlog.md) gives bounded next tasks, not another plan to write the PRD.

## Delivered in this milestone

49 stable PRD requirements; explicit MVP/V1/later boundaries; four proto-personas and five jobs; 26 use cases and nine journeys; 17 screens/19 states/12 components; voice/access/content/Figma contract; brand foundation, 81 naming candidates, 30 live longlist, 12 scored candidates, three finalists and four reproducible identity territories with local boards; finite MVP typed capabilities plus proposed CAP-15, Android/local-cloud/trust boundaries; canonical action/privacy/memory/helper/room/threat policies; 17 unrun evals, metric/failure definitions and full requirement mapping; prioritized evidence program; nine gates, roadmap, DoR and bounded T-103/T-119 synthetic slices.

[ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md) is **accepted by Simon on 2026-09-14**, completing T-100 and passing GATE-02 for experiment scope only. ADR-0010/0011 remain **proposed**. Seven earlier accepted ADRs and deprecated ADR-0004 history remain unchanged. Supplied Dream Book/handoff/conversation and local Obsidian state are preserved.

## Key constraints discovered

Current official Play policy does not permit a general-assistant AccessibilityService to autonomously initiate, plan and execute actions. The [route assessment](../08-research/android-stage-1-feasibility.md) recommends an API/integration-led candidate, static recipes only after review, and dynamic control restricted to a synthetic lab. None is a claim of store approval. At least two useful external delegated workflows must be verified to validate the thesis; handoff or in-app resize alone is insufficient.

## Proposed next milestone

Evidence-led foundation: MVP/control review T-100 and the bounded offline T-103 core are complete. T-101 Step A/C plans, partial Step B inventory, four bounded C2 device runs and the unrun identity/retention/egress packet now exist. Build the controlled fixture-origin and privacy-audit harnesses before another C2 claim-bearing run; any tablet access still requires fresh exact authority. Proceed with the bounded local fictional draft without external handoff/send. T-104 waits for sent-photo route/device evidence; T-106 waits for Simon's media-route decision. Do not begin broad MVP implementation or personal-data automation.

Naming recommendation: Daykind / Handspan / Clearfold, all uncleared with documented concerns. Identity recommendation: test Open Day against challengers. Neither is accepted. That initial browser used provisional grayscale; the current conversation build adds reviewer-only territory comparisons. Figma remains a partial paused artifact.

## Completion versus remaining authority

GATE-02 is passed for the agreed experiment scope, not blanket acceptance of every specification or release. GATE-03 platform proof, GATE-04 route viability and GATE-05 design/brand evidence remain outstanding. GATE-06 is specified for synthetic replay; real-device/data safety remains evidence-needed. GATE-07–09 are not passed. The [readiness validation record](development-readiness.md) contains exact mechanical checks.

No push, merge, publication, dependency installation, external Figma edits,
new plugin enablement, private Obsidian edits or source-material rewrites were
performed by this MCP setup. Connection verification does not authorize future
canvas writes.
