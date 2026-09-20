---
title: "Stage 1 dependency-ordered backlog"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution]
related:
  - development-readiness.md
  - current-milestone.md
  - ../01-product/traceability.md
  - ../06-evals/canonical-tasks.md
---

# Dependency-ordered Stage 1 backlog

Planning package complete for review; T-100's experiment/control decision is accepted, while other product choices and runtime evidence remain open. T-113 covers documentation/workflow refinement; other tasks remain **planned, not implemented work** unless individually marked. [Readiness](development-readiness.md) owns gates and Definition of Ready. [Traceability](../01-product/traceability.md) supplies exact requirement links. P0 = kill-risk/foundation, P1 = controlled prototype, P2 = MVP/pilot, P3 = V1 after learning. Change-task commits are pushed under the [Git workflow's standing authority](git-workflow.md). Dependency installation, main merges and other external-service changes are not implied.

Order: T-100/103 are complete for their bounded decision/fake scopes; T-102/T-119 fictional browser iterations are integrated and owner-reviewed, while T-108 representative research remains open. T-101 route/device evidence continues before admitted T-104/105/106; local T-107 needs its storage/privacy packet; then T-109 integrated evidence → T-110 gated MVP/pilot → T-111 V1. T-112 stays deferred. Product/visual decisions need not block fake safety tests; missing route evidence does block real external automation.

[Task packets](task-packets.md) now detail T-101/102/103/108/119; [delivery workflows](operating-workflows.md) own preparation, implementation, review and evidence procedures. T-113 records the documentation/workflow refinement, not execution of those downstream tasks.

<a id="t-100"></a>
## T-100 — Review MVP/control decision brief

- **Priority / discipline:** P0 / Simon/product; Simon owns acceptance.
- **Dependencies / entry:** None; specification package.
- **Trace / contract:** ADR-0009 plus PRD-FR-006/009/010 and OUT-001; UC-002/004/006, J-001/003/005.
- **Bounded deliverable:** Choose proposed five-workflow scope and candidate-vs-lab boundary; retain at least two useful external delegation bar; state alternatives if route fails.
- **Acceptance / evidence:** Simon explicitly accepted [ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md) on 2026-09-14 after review; GATE-02 passed for experiment scope only. Device/distribution/release evidence remains outstanding.
- **Excluded / rollback:** No code, public submission or name lock. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** complete — decision recorded 2026-09-14; no implementation or runtime test result claimed.

<a id="t-101"></a>
## T-101 — Inventory tablet and map permitted capability routes

- **Priority / discipline:** P0 / Android/policy; Simon owns acceptance.
- **Dependencies / entry:** T-100 direction useful; read-only inventory and desk checks can start before scope acceptance.
- **Trace / contract:** PRD-DST-001–004/NFR-005; UC-014/020, J-007; EVAL-005/009/011; RES-02/04.
- **Bounded deliverable:** Record anonymous exact tablet/OS/apps, supported APIs/permissions/verification needs, visible Stop candidates and build/distribution matrix; use synthetic accounts only in subsequent approved device spike.
- **Acceptance / evidence:** Dated device worksheet and per-flow go/conditional/no-go evidence; no inferred telephony or accessibility exception; GATE-03/04 gaps precise.
- **Excluded / rollback:** No root/AOSP/device-owner, personal account inspection or store submission. Gate actual actuation separately. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** in progress — [Step A routes and Step B/C worksheets](../08-research/2026-09-19-t101-route-inventory.md), a [partial manual `TBL-01` inventory](../08-research/2026-09-19-t101-physical-inventory.md) and a bounded [C2 device ledger](../08-research/2026-09-19-t101-c2-device-evidence.md) exist. Four device runs now close the synthetic protected-frame and ordered task-removal stale-result regressions and provide positive bounded Stop, lock, resize and task-removal cleanup observations. The merged [C2 local safety repair](sessions/2026-09-20-android-c2-local-safety-sprint.md) passes 49 host cases; its additional source changes remain unrun on Android. The [narrow identity/retention/egress packet](t101-c2-identity-retention-egress-packet.md) now freezes the missing claims and prerequisites: the current API/artifact cannot prove selected-package identity, while durable-retention and per-UID egress procedures need reviewed harnesses before device authority. C2 is not admitted. Current Spotify policy also makes the named voice-control route a no-go for Granny; no replacement named media route is ready. T-101 is not complete; GATE-03/04/06 device conditions remain open.

C5 now has a bounded [native text-size source slice](sessions/2026-09-20-c5-native-text-scale.md)
and [tablet verification packet](t101-c5-tablet-verification.md). Device layout,
preference durability and accessibility remain unrun; this does not count as
an admitted external workflow or finish T-101.

<a id="t-102"></a>
## T-102 — Prototype conversation/input/permission and access interaction

- **Priority / discipline:** P0 / Design/Android; Simon owns acceptance.
- **Dependencies / entry:** Contract portion can start now; device shell requires DoR and T-101 environment; no final brand needed. Simon authorized the local browser prototype on 2026-09-14; Figma quota no longer blocks design. Native Android shell and device integration remain separately gated.
- **Trace / contract:** PRD-FR-001/002/003/011; ACC-001–003; OUT-002; UC-007/013/014/022, J-006/007; SCR-001–004/011; CMP-002/007/008/009; EVAL-005/007.
- **Bounded deliverable:** First low-fi frames including denied mic and typed path; next bounded own-app shell, transcript fixture and reversible text preview, no external automation.
- **Acceptance / evidence:** 100/130/200% reflow and local semantics tests; explicit scope labels; design review then device accessibility evidence.
- **Excluded / rollback:** No real model, mic/background capture without separate task, or global settings mutation. Neutral tokens proposed. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** browser revision delivered for design review — Simon authorized the [conversation-first build](../02-design/conversation-first-plan.md) on 2026-09-14 and continued its working message checkpoint on 2026-09-15. [Session evidence](sessions/2026-09-14-conversation-build.md) tracks five integrated browser simulations, separate reviewer tools and access/safety checks. T-102 design acceptance and human/device evidence remain open; no Android shell or GATE-05 pass.

<a id="t-103"></a>
## T-103 — Build offline authorization/cancellation/verification contract replay

- **Priority / discipline:** P0 — first safe coding slice / Agent/safety engineer; Simon owns acceptance.
- **Dependencies / entry:** Read PRD/tool/policy/DoR; GATE-01 editorial coherence; synthetic-only contract scope. No device/provider or brand decision needed.
- **Execution packet:** [T-103](task-packets.md#t-103-packet), 20 deterministic cases; [execution protocol](../03-agent/execution-protocol.md) and [admission contract](../04-architecture/capability-admission.md) resolve operation/journal/Stop boundaries. [Implementation](../../prototypes/t103-authority-core/README.md) and [C01-C20 evidence](../../prototypes/t103-authority-core/EVIDENCE.md) were accepted by Simon on 2026-09-19 for this bounded task.
- **Trace / contract:** PRD-SAF-001–005, FR-004/012/013/016, NFR-001/003/004, DST-004; UC-003/006/011/019/025; J-002/003; EVAL-006/009/010.
- **Bounded deliverable:** Implement minimal pure typed intent/prepared action/permit/receipt/evidence state machine using fake registry/observer/planner/executor/clock/ledger. One synthetic message effect and one reversible navigation. Exact recipient/content bound; deny wrong/stale/replayed/changed approvals. Stop prevents post-latch dispatch; crash restart quarantines unknown; action success without postcondition cannot complete.
- **Acceptance / evidence:** Deterministic tests for valid once-only effect, 60s expiry, >2s stale observation, malformed/forged tool, screen injection, late model, cancel races, budget/loop cutoff, unknown outcome/no resend and provider swap. No actual network/files from model. Record tests and limitations; contract replay is not GATE-03/07 device evidence.
- **Excluded / rollback:** No Android service, SDK/framework lock, backend/model calls, coordinates, personal data, credentials or production scaffold. Choose smallest reversible language/test setup available after environment inspection; no dependency installation without authority. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** complete — Simon accepted the five bounded review points on 2026-09-19 after units A-D passed C01-C20 with 20/20 tests and 147 explicit assertions on fixture `t103-fixture-v1`. Completion is limited to the pure offline authority core; no Android, provider, network, MCP, real account/message or broader gate evidence is claimed.

<a id="t-104"></a>
## T-104 — Prove sent-photo route as a vertical slice

- **Priority / discipline:** P1 / Android/agent; Simon owns acceptance.
- **Dependencies / entry:** T-101 route evidence + T-103; GATE-06 synthetic device safety; candidate mode respects GATE-04 posture.
- **Trace / contract:** PRD-FR-006/OUT-001; UC-002/J-001; SCR-006/008; CAP photo/read route; EVAL-001.
- **Bounded deliverable:** One exact synthetic communication app/account/date/channel; resolve two Sophies; navigate approved adapter; verify person/date/attachment oracle and any mark-read effect; present truthful result.
- **Acceptance / evidence:** 20 nominal trials on recorded config plus all EVAL-001 variants; measured Stop and no unauthorized effect; route-specific pass/blocked record.
- **Excluded / rollback:** No gallery substitution, face identity inference, broad chat crawl, family monitoring, vision tap fallback or production support claim. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-105"></a>
## T-105 — Prove exact draft/handoff and conditional commit slice

- **Priority / discipline:** P1 / Android/agent/safety; Simon owns acceptance.
- **Dependencies / entry:** T-103 + T-101 admitted route, reviewed SCR-007; actual external send only with route/safety gate evidence.
- **Trace / contract:** PRD-FR-007/008/009/SAF-002; UC-006/015/016/J-003; CMP-003; EVAL-003/010.
- **Bounded deliverable:** Start local synthetic draft and two Davids, edit and bind preview, then independently gated external draft handoff. Add send adapter only when admitted; independent ledger/second endpoint verifies once.
- **Acceptance / evidence:** No wrong/duplicate/unconfirmed effect; handoff never labeled sent; expiry/touch/restart/outage variants pass; exact confirmation comprehension remains human evidence gap.
- **Excluded / rollback:** No generic text injection, silent draft sync, real recipients, unknown-outcome resend or implied delivery. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-106"></a>
## T-106 — Prove requested media and dependency behavior slice

- **Priority / discipline:** P1 / Android/voice; Simon owns acceptance.
- **Dependencies / entry:** T-101/T-103 and supported integration; synthetic/privacy-safe catalog.
- **Trace / contract:** PRD-FR-010/NFR-002; UC-004/017/J-005; SCR-005/008; EVAL-004/009.
- **Bounded deliverable:** Resolve title/service, play via admitted route, independently verify metadata/state, Pause, handle ad/paywall/auth/offline; instrument cold/warm response and task time.
- **Acceptance / evidence:** 20 nominal + adverse variants; no purchase and no false playing claim; actual latency/cost recorded only if provider used with authority.
- **Excluded / rollback:** No subscription acceptance, ambient mic or unsupported app-general control. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** blocked pending route decision — Spotify's current developer policy prohibits the accepted voice-assistant control behavior. Apple MusicKit is a desk lead only; its Android SDK currency, distribution/commercial terms, privacy/security and voice compatibility are unreviewed. Do not start dependency, account or device work until Simon selects a policy-compatible route or explicitly revises the outcome.

<a id="t-107"></a>
## T-107 — Implement local privacy/memory/audit rights slice

- **Priority / discipline:** P1 / Android/privacy; Simon owns acceptance.
- **Dependencies / entry:** T-103 event schema; local storage DoR with backup/key boundary; GATE-06 real data still closed.
- **Trace / contract:** PRD-PRV-001/002/004/006; FR-014/015/017; UC-010/018/020/021/J-007; SCR-009/010/012/015; EVAL-008.
- **Bounded deliverable:** Synthetic explicit alias/preferences, bounded audit, retention clock, correction/derivative deletion, export preview, denied helper and no-egress tests.
- **Acceptance / evidence:** Canary inspection of storage/cache/log/export; restart/expiry/backup-restore negatives; no raw private fields, no data resurrection; user-understood copy tested later.
- **Excluded / rollback:** No passive extraction, provider upload, cloud sync/helper backend or permanent personal facts. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-108"></a>
## T-108 — Run low-fi comprehension, access, naming and identity rounds

- **Priority / discipline:** P0 research / P1 integrated / Design/research/brand; Simon owns acceptance.
- **Dependencies / entry:** RES-01/03 consent/protocol; low-fi T-102 before territory preference; Simon iteration kit before finalist expansion.
- **Trace / contract:** PRD-OUT-002/003/ACC-004; UC-016/019 and five signatures; EVAL-007/012; RES-03/06/09.
- **Bounded deliverable:** Use the browser prototype and its coverage manifest; optional Figma writes require separate authority; test consequence/Stop/partial understanding and access; compare four territories and spoken finalists; incorporate Simon love/interesting/neutral/dislike/never responses.
- **Acceptance / evidence:** Document actual n, comprehension/error observations and revisions; GATE-05 decision/evidence explicitly separated. Trademark/language reviews before public name.
- **Excluded / rollback:** No fake Figma URL, final logo promotion, fabricated participants or age-stereotype preference. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-109"></a>
## T-109 — Integrate controlled synthetic prototype and paired baseline

- **Priority / discipline:** P1 after slices / Product/Android/agent/research; Simon owns acceptance.
- **Dependencies / entry:** T-102–108 necessary slices; GATE-03/04 posture/06; no real-user live send yet.
- **Trace / contract:** MVP PRD rows via traceability; five signatures; EVAL-001–012; RES-07.
- **Bounded deliverable:** Join one task state UI with admitted adapters; ≥2 externally delegated useful workflows, failure recovery/Stop; run versioned controlled eval matrix and ethical comparative prototype study.
- **Acceptance / evidence:** GATE-07 metrics with exact n/config/failures; no unsafe bypass, ≥80% proposed verified task target and comprehension evidence; propose MVP build tasks.
- **Excluded / rollback:** No unsupported configurations, production marketing or cloud personal data without separate gate. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-110"></a>
## T-110 — Specify and validate MVP build/pilot operations

- **Priority / discipline:** P2 / Product/safety/Android/support; Simon owns acceptance.
- **Dependencies / entry:** GATE-08 after T-109 and accepted scope; provider/market/support choices resolved.
- **Trace / contract:** All MVP Must requirements; EVAL-001–012; pilot GATE-09.
- **Bounded deliverable:** Turn validated slices into installation/update/rollback/support/capability-disable build with consent/deletion drills; recruit only after privacy/safety review.
- **Acceptance / evidence:** Pilot evidence: proposed ≥90% verified task success, 0 observed unauthorized consequences with uncertainty reported, no critical/high defects, access and withdrawal/support drills; Simon explicitly approves pilot.
- **Excluded / rollback:** No general release, unsupported scale, pricing/date promise or bypass failed tests. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-111"></a>
## T-111 — Refine App V1 extension slices after MVP evidence

- **Priority / discipline:** P3 conditional / Product/Android/privacy; Simon owns acceptance.
- **Dependencies / entry:** MVP/pilot learning; explicit V1 scope and updated route/privacy decisions.
- **Trace / contract:** PRD-FR-018/019/020; PRV-003/005; UC-001/008/010/023/024; J-008/007/004 subset; EVAL-013–017.
- **Bounded deliverable:** Separate bounded call, reminder, document, automatic important-fact/adaptive-communication and helper-config proposal tasks; each gets adapter/screen/failure/detail and DoR before code. The memory slice implements ADR-0012's typed local admission, quiet receipt/Undo, setup baseline, pause/reset and durable rights without per-fact confirmation.
- **Acceptance / evidence:** Per-extension independent success/rights/access evidence; EVAL-017 covers capture precision, prohibited-source denial, later recall, correction/deletion and style drift; no remote screen/control inheritance; V1 decision based on actual MVP learning.
- **Excluded / rollback:** Not ready as one large implementation task; no medical reminders promise, transcript archive, external-content mining or cloud memory sync. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-112"></a>
## T-112 — Hold later-App ideas without activating them

- **Priority / discipline:** Deferred / Simon/product; Simon owns acceptance.
- **Dependencies / entry:** New explicit scope/ADR and evidence; none scheduled.
- **Trace / contract:** PRD-FR-021; UC-005/012; J-004 deferred remote aspect; EVAL-016/017 denial coverage.
- **Bounded deliverable:** Keep stories, remote assistance and proactive routines absent; record future evidence questions only if Stage 1 learning warrants.
- **Acceptance / evidence:** MVP/V1 deny tests pass; any activation requires own safety/consent/DoR and acceptance.
- **Excluded / rollback:** No OS/AOSP/hardware; no preparatory backend or surveillance infrastructure. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-113"></a>
## T-113 — Refine delivery contracts, repository skills and task handoffs

- **Scope / authority:** Simon requested a holistic documentation, skills and workflow refinement before actual design/development on 2026-09-14; no product runtime code in this task.
- **Trace / contract:** PRD-SAF-001–005/FR-012/013/NFR-003/DST-002–004; UC-003/006/011/019/025; J-002/003. [Execution protocol](../03-agent/execution-protocol.md), [admission](../04-architecture/capability-admission.md), [task packets](task-packets.md), [delivery workflows](operating-workflows.md), [evidence](../06-evals/evidence-protocol.md) and [research protocols](../08-research/research-protocols.md).
- **Deliverables:** Four repo-local instruction-only skills, concrete T-101/102/103/108 packets, 20 unrun T-103 cases, design/gate/task templates, maintained ownership/navigation and regression-tested documentation validation.
- **Acceptance:** Canonical links/status/IDs and skills validate; documentation-tool tests pass; no source/private Obsidian/unrelated edit included; accepted scope intact; remaining design/device/runtime evidence explicit. EVAL-006/008/009/010 coverage refined but remains unrun.
- **Status:** complete — documentation and four skills written, 19 documentation-tool tests and structural validation passed on 2026-09-14; see readiness validation. This does not complete T-103 or pass a runtime gate.
- **Excluded:** App/backend/runtime implementation, participant contact, Figma mutation, global installs/config, external publication and Stage 2/3.

<a id="t-114"></a>
## T-114 — Build development cockpit and session review board

- **Scope / authority:** Simon requested a development cockpit before a UI redesign plan on 2026-09-14. Developer tooling only, not the older adult's product UI.
- **Trace / owner:** [Cockpit](../Cockpit.md), [guide](cockpit-guide.md), [agent board](agent-board.md); operational visibility supports PRD-NFR-005's documentation/support preparation, not a new product requirement.
- **Deliverable:** Native Obsidian Bases/Canvas views, canonical-derived backlog/gate snapshot, evidence-linked session records, asynchronous message protocol, plugin assessment and regression checks.
- **Acceptance:** Local links/metadata and source integrity pass; snapshot freshness and asset structure pass; no fabricated session timing/live presence, automatic merge, private settings edit or plugin installation. Obsidian in-app render and Simon's layout review remain pending.
- **Status:** complete — Simon approved the development cockpit on 2026-09-14: “move cockpit to complete it looks great.” Owner review is complete; not a product gate pass or approval of the app redesign.
- **Excluded:** Live inter-agent transport, GitHub/CI synchronization, plugin downloads, automatic Git operations, UI redesign implementation, Android/agent runtime and Stage 2/3.

<a id="t-115"></a>
## T-115 — Enforce session handoffs and verify cockpit integration

- **Scope / authority:** Simon approved lifecycle skill, maintenance checks, vault visibility verification and fresh-session testing on 2026-09-14. Repository tooling only; PR/merge and remote protection changes require current authority.
- **Dependencies / owner:** T-114 artifacts integrated through PR #3; [cockpit stewardship](cockpit-guide.md), [Git workflow](git-workflow.md), [session evidence](sessions/2026-09-14-session-maintenance.md). Operational support of PRD-NFR-005, no product behavior change or runtime EVAL claim.
- **Deliverables:** Fifth repo-local skill, read-only coverage/visibility scripts, adverse regression cases, least-privilege CI and updated routing/template.
- **Acceptance:** Missing/unrelated handoffs and stale snapshots rejected; explicit small README exemption constrained; wrong/stale/dirty vault artifacts reported without writes; fresh-context navigation evaluated; actual CI/protection/integration state distinguished from local checks.
- **Status:** complete — tooling validated with 46 passing tests, successful live CI and verified required-check enforcement; PR #4 owns final integration state. No product gate passed.
- **Excluded / rollback:** No app redesign, Android work, plugin/private-state changes, auto-merge or scheduled supervisor. Revert scoped tooling through reviewed Git change if needed; preserve session history and user-owned Canvas layout.

<a id="t-117"></a>
## T-117 — Connect conversation UI to bounded local backend and MCP

- **Scope / authority:** Simon requested one complete implementation slice on 2026-09-15: natural conversation to specifically confirmed unsent demo draft, with actual MCP transport/store/readback. Separate from the Qwen proposal-only experiment, T-103 and Android actuation.
- **Owner / dependencies:** Backend owns [runtime contract](../04-architecture/conversation-runtime-contract.md), provider/policy/MCP/runtime/tests; frontend owns presentation/transport. Published frontend checkpoint 7e919ae integrated with both histories preserved; older Qwen UI is not transplanted. Board topic ui-backend-integration records agreement. SDK dependency installation explicitly approved.
- **Trace / DoR:** PRD-FR-002/003/008/013, PRD-SAF-001/002/003, PRD-PRV-001; UC-006/J-003; SCR-003/007, CMP-001/003; EVAL-003/006/008/009/010 themes. Input/output/fixture/oracle/budgets/Stop/privacy/rollback defined in the runtime contract and tests before broader integration. Real file readback is independent of the write acknowledgment.
- **Deliverable / acceptance:** [Source/startup](../../prototypes/conversation-runtime/README.md), three allowlisted MCP tools, exact-content preview binding and expiry, clarification, cancellation/unknown fencing, deterministic backend/provider/HTTP and integrated browser tests. Live Qwen evidence separately bounded; no paid CI calls.
- **Status:** review — complete local demo slice and live-consent wiring implemented. The 2026-09-20 bounded extension carries the same backend session across Home and all six fictional Rooms, validates at most three current-Room sources, keeps each source receipt with the answer that used it, and preserves the existing draft authority boundary. New conversation snapshots the prior transcript in tab memory for a distinct Today detail and reconnects a fresh backend session in the selected mode; fictional sample rows are separately labelled. One separately run live synthetic Room question returned a grounded answer with the expected source binding and no draft write. [Original session](sessions/2026-09-15-mcp-backend-integration.md) and [Room extension](sessions/2026-09-20-room-chat-openrouter.md) own exact checks and limitations. This single success does not prove general live-model quality or promote a product gate.
- **Excluded / rollback:** No external send/account, personal files/data, Android, root, remote server install, shell/network tool or broad capability expansion. Stop server to disable; graceful shutdown removes its synthetic temporary store; no pending action restored on restart. Revert scoped branch through normal reviewed Git if needed.

<a id="t-118"></a>
## T-118 — Install reviewed UI/UX and Android skills

- **Scope / authority:** Simon explicitly requested the recommended UI/UX skills be downloaded and set up on 2026-09-14. Repository-local skill/tooling change only.
- **Trace / owner:** [Skill setup and provenance](ui-ux-skills.md), [delivery workflows](operating-workflows.md), [conversation-first plan](../02-design/conversation-first-plan.md) and repository `AGENTS.md`; no product requirement or gate is implemented by an instruction package.
- **Deliverables:** `granny-ui-craft` for product-specific structural variation/critique; pinned Google `adaptive`, `edge-to-edge` and `testing-setup` skills with local guardrails, licenses and discovery metadata; exact upstream provenance and update procedure.
- **Acceptance:** Each skill passes the packaging validators; repository/cockpit/documentation checks and documentation-tool tests pass; only reviewed resources enter Git; no executable third-party launcher/hook, global configuration, dependency install, product UI change or unrelated user edit is included.
- **Status:** complete — reviewed packages and provenance are integrated; five changed skill entrypoints and repository documentation validate. Current documentation-tool regressions pass after integration. This is tooling setup, not design implementation or a gate pass.
- **Excluded:** Browser redesign implementation, Android scaffold/build/device action, Figma mutation, product or brand acceptance, automatic upstream updates, main integration and Stage 2/3.

<a id="t-119"></a>
## T-119 — Prototype Context Rooms experience and typed context contract

- **Scope / authority:** Simon adopted Context Rooms on 2026-09-19 and separately authorized the selected Home frontend. During that implementation he explicitly extended the fictional browser checkpoint to six starter rooms, all 48 collection symbols, direct library/search/detail, source-aware fixture replies and bounded explicit room creation, using the Kitchen vertical-slice mockups. [Current session](sessions/2026-09-19-context-rooms-frontend.md) owns this extension; persistence, production context and archive/delete contracts are not admitted.
- **Trace / owner:** PRD-FR-022; UC-026/J-009; SCR-003/016/017; CMP-007/009/011/012; CAP-15; ADR-0015/0016; EVAL-008/012; design + agent/context + privacy owners.
- **Dependencies / entry:** Preserve ADR-0016's selected Explicit Scroll Row and the Round conversation shell; reuse registered components; no real storage/device route. The only provider route is the separately consented, synthetic, server-keyed extension recorded on 2026-09-20. Read the [selected Home reference](../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md), [task packet](task-packets.md#t-119-packet), [Context Rooms](../02-design/context-rooms.md), [reviewed-pack visual system](../02-design/context-room-visual-system.md) and action/privacy policy.
- **Deliverables:** Editable/reviewable selected global Home → Rooms → Kitchen slice; deterministic fictional room/item fixture; CMP-012 no-room/one-room/all-fit/overflow and large-text fallback states; direct browse/search with model unavailable; current-room/cross-room/global context envelope and visible provenance; membership diff/receipt/Undo; archive and delete-room inventory/result; reviewed local pack or neutral asset fallback; accessibility/responsive annotations and exact unrun evidence.
- **Acceptance:** Same assistant/personality and control anchors; selected open portrait row rather than a tile grid; written Previous/Next and See all rooms remain reachable without gesture; item findable without conversation; whole-room context never loaded; material cross-room source visible and excludable; deletion preserves canonical items and invalidates room-scoped authority; EVAL-008/012 fixture assertions and relevant browser/doc checks pass.
- **Status:** in progress — the selected Home, six-room frontend, in-memory membership receipts/Undo, archive/restore, separated deletion scopes, degraded states and supporting navigation are integrated on `main` through PR #44. Simon then requested the local OpenRouter chat extension on 2026-09-20; its task branch adds one Home/Rooms assistant, strict current-Room context, answer-owned source receipts and tab-memory conversation transcripts with deterministic and one-call live evidence. Full T-119 remains incomplete: production typed-context/privacy enforcement, real cross-room admission, persistence and representative human/device evidence remain unrun. No persistent room implementation exists.
- **Excluded / rollback:** No personal data, browser/device persistence, provider egress beyond the explicitly consented bounded synthetic Room context, sharing/helper access, production database, Android automation, separate room agents, cognitive/dementia benefit claim or MVP expansion. Disable live mode or revert the task branch without changing scripted Home/Rooms if the model fails review.

<a id="t-120"></a>
## T-120 — Integrate native on-device voice capture and conservative cleanup

- **Scope / authority:** Simon accepted [ADR-0011](../09-decisions/ADR-0011-explicit-activation-and-access.md) and explicitly requested the bounded native integration on 2026-09-20. This authorizes an own-app Android shell, host tests and preparation of an exact-device voice matrix; it does not authorize ambient capture, cloud speech, a cleanup language model, participant recording or unrelated external automation.
- **Trace / owner:** PRD-FR-001/003/013/016, PRD-ACC-003, PRD-PRV-001; UC-013/014/015/017/022; J-007; SCR-004; CMP-002; Android shell/voice/privacy boundaries; EVAL-005/006/007/009 and RES-06.
- **Dependencies / entry:** Latest committed conversation Home is the design dependency; current `origin/main` supplies the verified API 36/AGP 9.4/Gradle 9.6/JDK 17 toolchain. The exact reference tablet runs Android 16, while on-device recognizer/locale/formatting behavior remains unmeasured. No final brand or planner/model is required.
- **Deliverables:** Platform-only Android shell under `android/stage1`; runtime microphone request only from Talk; availability-gated `createOnDeviceSpeechRecognizer`; visible idle/requesting/listening/stopping/final/error states; provisional and editable final transcript; Done listening, Stop and typed fallback; formatted/raw hypothesis selection; conservative deterministic cleanup; generation-based stale-callback rejection; no network permission, raw-audio store, transcript archive or model dependency.
- **Acceptance:** Clean host unit tests cover state transitions, Stop/session replacement, stale callbacks, hypothesis selection and cleanup idempotence/safety; assemble and lint pass. A later exact-device run records recognizer/locale/configuration, permission denial/revoke, partial/final behavior, offline use, quiet/noisy speech, names/numbers/dates, lifecycle Stop and correction effort without retaining raw voice. Host checks cannot pass RES-06 or GATE-05/06/07.
- **Status:** review — the native shell and continuity repair are integrated on `main`; 138 combined native host tests, debug assembly and lint pass, the runtime dependency graph is empty and the APK declares only `RECORD_AUDIO`. Simon's [follow-up tablet smoke report](../08-research/2026-09-20-native-tablet-followup-feedback.md) is positive for the repaired interaction flow and requested permission/accessibility paths. Exact recognizer/locale/network configuration, phrases, repetitions, timings, correction effort and full quiet/noisy/lifecycle matrix remain unreported, so EVAL-005/006/007/009 and RES-06 are not complete.
- **Excluded / rollback:** No wake word, background service, generic remote recognizer fallback, Whisper/bundled ASR, small cleanup LLM, cloud/realtime audio, message send or external app action. T-121 owns separately requested spoken output. Remove/disable the voice adapter and retain Type as the complete fallback if the route fails evidence.

<a id="t-121"></a>
## T-121 — Implement explicit spoken readback and speech controls

- **Scope / authority:** Simon explicitly requested the first recommended standalone tablet feature, spoken readback and speech controls, on 2026-09-20. This authorizes an own-app Android TTS adapter, local speech settings, host tests and preparation of an exact-device matrix; it does not authorize automatic/private-content speech, network TTS, document ingestion, background audio or device operation.
- **Trace / owner:** PRD-FR-013/016, PRD-ACC-003; UC-017/022; J-007; SCR-004; CMP-001/007/009; voice/session/privacy boundaries; CAP-11/12; EVAL-007/009 and RES-06.
- **Dependencies / entry:** Published C5 branch supplies the T-120 shell and persistent local text preferences. Android platform `TextToSpeech`, existing Views/manual injection and JUnit 4 are sufficient; no runtime dependency or Internet permission is needed. Installed offline voice availability and behavior remain device evidence.
- **Deliverables:** Explicit Read request aloud, Stop speaking, Repeat and Sound off/on controls; an adapter that selects an installed voice whose `Voice.isNetworkConnectionRequired()` is false; exact-text/revision binding; generation-based stale callback rejection; four closed speech-rate choices with completed preview before apply; versioned local setting readback; lifecycle cleanup; no automatic speech or audio file.
- **Acceptance:** Host tests cover explicit start, exact text, Stop and replacement races, stale callbacks, changed-revision Repeat denial, rate-preview binding, setting persistence/conflict/corruption/unknown outcomes and Sound off. Assemble/lint, dependency/manifest/data scans and docs checks pass. A later exact-device run records engine/voice/locale, offline behavior, rate support, Stop latency, audio focus, speaker/headphone behavior, lifecycle and access. Host evidence cannot pass RES-06 or GATE-05/06/07.
- **Status:** review — explicit readback, Stop/Repeat/Sound controls, offline-voice selection and previewed speech-rate settings are integrated on `main` with the native shell. Simon's [follow-up tablet smoke report](../08-research/2026-09-20-native-tablet-followup-feedback.md) says the repaired flow and access checks work, while voice quality is only slightly better and remains unsatisfactory. Exact engine/voice/locale/network state, rate fidelity, Stop timing, audio focus, repetitions and privacy/egress observations remain incomplete; no cloud or alternate voice route is selected.
- **Excluded / rollback:** No autoplay, synthesized-audio storage, generic/network-required voice fallback, provider/model SDK, document reading, private-content classifier, voice cloning, background service, external action or claim that the selected engine cannot egress. Remove the speech adapter and controls while retaining all written interaction if device evidence fails.

The [native integration follow-up](sessions/2026-09-20-native-conversation-integration.md)
combines T-120, C5 and T-121 in one source-reviewed shell with shared
conversation authority and Stop. It is integrated on `main`; T-120/T-121 remain
in review because the self-reported smoke checks do not supply the complete
versioned device matrix or representative-human evidence. No T-101 completion
or gate promotion.

T-120/T-121 follow-up: [reported smoke feedback](../08-research/2026-09-20-native-tablet-smoke-feedback.md)
identified draft loss, premature end of input and unacceptable readback quality.
The [continuity repair](sessions/2026-09-20-native-voice-continuity.md) preserves
completed text and bounds sentence continuation; eligible offline voice ranking
is improved. Simon's later [follow-up report](../08-research/2026-09-20-native-tablet-followup-feedback.md)
is positive for the repaired flow and requested access checks, but readback is
only slightly better and still below the desired naturalness. A different local
or cloud voice remains a separately scoped dependency/privacy/product decision.

## Session handoff

Each implementation session selects **one bounded slice**, reads its PRD/UC/J, canonical interface/screen and policy, checks current gates and Git, then writes tests and implementation together. Review-only sessions remain read-only. Add actual source/test links to traceability only when they exist. If feasibility changes the intended outcome, amend canonical behavior and gate decision before widening code. Do not turn an unsuccessful integration into silent Stage 2 work.
