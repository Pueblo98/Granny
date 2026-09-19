---
title: "Current milestone — Context Rooms and the first native voice shell"
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

# Current milestone — Context Rooms and the first native voice shell

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
evidence proves only that bounded local contract. No Android device was
attached, so exact Samsung recognizer, locale, acoustic, lifecycle, latency,
accessibility and correction-effort evidence remains unrun under RES-06 and
EVAL-005/007/009/012; no gate passes from the decision or scaffold.

The task branch starts from the latest committed Explicit Scroll Row Home and
merges current `origin/main`. The owner's later uncommitted Context Rooms work
remains untouched and is not claimed as part of T-120.

## T-101 route and partial physical inventory — 2026-09-19

The [current-source route assessment](../08-research/2026-09-19-t101-route-inventory.md) now covers all five ADR-0009 experiments and prepares the non-identifying physical inventory and smallest synthetic experiments. It finds a go route for Granny-local text, conditional routes for scoped screen explanation and named media integration, conditional honest message compose handoff but no send claim, and no ordinary candidate route for sent-photo provenance. Only screen explanation and media remain plausible external candidates; screen explanation has bounded but non-admitting device evidence and media remains unrun, so the accepted two-external-workflow kill criterion is at high risk.

Simon then manually read non-identifying Settings values from `TBL-01`: Samsung `SM-X238U` / Galaxy Tab A11+ 5G, Android 16, One UI 8.0, build/patch, English (United States), partial display/input/access state and installed-app versions. The [physical record](../08-research/2026-09-19-t101-physical-inventory.md) is user-reported and incomplete; Codex did not connect to or operate the tablet. No command, install, update, grant, account/content inspection, external-app actuation or capability experiment occurred.

T-101 remains in progress; GATE-03/04 and GATE-06 device/real-data conditions remain open. The [lab-only Android 16 scaffold](../../experiments/c2-screen-explanation/README.md) now has four bounded [C2 device runs](../08-research/2026-09-19-t101-c2-device-evidence.md). Across the repaired runs, the synthetic protected-scene and ordered stale-result regressions closed; visible Stop, lock cleanup, resize/result recovery and task-removal cleanup produced positive observations. A source-only Stop-control state repair passes 36 host cases but is unrun on Android. Selected-package identity and independent retention/egress evidence remain unresolved. Both latest-run packages were removed; debugging authorization, USB debugging and Developer options were disabled, and the cable was disconnected. T-104 still waits for actual sent-photo route and device-safety evidence.

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
creation. The task branch is not main integration or final design acceptance.
Production persistence, backend room context, archive/delete, Android, Figma
and human/device evidence remain outside this implementation checkpoint.

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

Simon authorized [conversation-first implementation](../02-design/conversation-first-plan.md) on 2026-09-14: message checkpoint first, then the five integrated MVP simulations, supporting preferences/privacy/recovery and proposed visual comparison. He asked to continue the working message direction on 2026-09-15 and authorized a draft PR after integrated checks. [Build record](sessions/2026-09-14-conversation-build.md) owns current evidence/publication. Main integration is not authorized. No backend, Android automation, capture, live media/message or production gate work is part of this mission.

T-102's conversation-first browser revision is implemented for review; the development cockpit remains approved and complete. That shell remains useful input, while T-119 is now the active next design slice. Final interaction/brand acceptance, device/participant evidence and all production gates retain their existing owners and limits.

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

The next experience implementation request should start from T-119's named fictional-data packet; T-103's offline fake replay remains independently available. No new broad specification-writing milestone is needed. Remaining real-world evidence and Simon decisions still gate production work. Skills are repo-local. No new global setting, plugin or scheduled automation was installed by this repository task; the pre-existing official Figma plugin connection is documented in the Figma contract.

The mission's documentation package is written for review. Only the stock-Android tablet app is active; no Android/runtime/backend implementation was started. Simon accepted the five MVP experiments and control posture on 2026-09-14; detailed product choices remain proposed and technical/user evals unrun. [Development readiness](development-readiness.md) is the authoritative gate/status assessment; [backlog](backlog.md) gives bounded next tasks, not another plan to write the PRD.

## Delivered in this milestone

49 stable PRD requirements; explicit MVP/V1/later boundaries; four proto-personas and five jobs; 26 use cases and nine journeys; 17 screens/19 states/12 components; voice/access/content/Figma contract; brand foundation, 81 naming candidates, 30 live longlist, 12 scored candidates, three finalists and four reproducible identity territories with local boards; finite MVP typed capabilities plus proposed CAP-15, Android/local-cloud/trust boundaries; canonical action/privacy/memory/helper/room/threat policies; 17 unrun evals, metric/failure definitions and full requirement mapping; prioritized evidence program; nine gates, roadmap, DoR and bounded T-103/T-119 synthetic slices.

[ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md) is **accepted by Simon on 2026-09-14**, completing T-100 and passing GATE-02 for experiment scope only. ADR-0010/0011 remain **proposed**. Seven earlier accepted ADRs and deprecated ADR-0004 history remain unchanged. Supplied Dream Book/handoff/conversation and local Obsidian state are preserved.

## Key constraints discovered

Current official Play policy does not permit a general-assistant AccessibilityService to autonomously initiate, plan and execute actions. The [route assessment](../08-research/android-stage-1-feasibility.md) recommends an API/integration-led candidate, static recipes only after review, and dynamic control restricted to a synthetic lab. None is a claim of store approval. At least two useful external delegated workflows must be verified to validate the thesis; handoff or in-app resize alone is insufficient.

## Proposed next milestone

Evidence-led foundation: MVP/control review T-100 and the bounded offline T-103 core are complete. T-101 Step A/C plans, partial Step B inventory and four bounded C2 device runs now exist. The Stop-control state repair passes host checks; separately plan independent selected-package, retention and egress oracles before any admission claim. Any tablet access still requires fresh exact authority. T-104 waits for sent-photo route/device evidence. Produce/test low-fi interaction and iterate naming/identity (T-102/108) within their authorization and evidence boundaries. Do not begin broad MVP implementation or personal-data automation.

Naming recommendation: Daykind / Handspan / Clearfold, all uncleared with documented concerns. Identity recommendation: test Open Day against challengers. Neither is accepted. That initial browser used provisional grayscale; the current conversation build adds reviewer-only territory comparisons. Figma remains a partial paused artifact.

## Completion versus remaining authority

GATE-02 is passed for the agreed experiment scope, not blanket acceptance of every specification or release. GATE-03 platform proof, GATE-04 route viability and GATE-05 design/brand evidence remain outstanding. GATE-06 is specified for synthetic replay; real-device/data safety remains evidence-needed. GATE-07–09 are not passed. The [readiness validation record](development-readiness.md) contains exact mechanical checks.

No push, merge, publication, dependency installation, external Figma edits,
new plugin enablement, private Obsidian edits or source-material rewrites were
performed by this MCP setup. Connection verification does not authorize future
canvas writes.
