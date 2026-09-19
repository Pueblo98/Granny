---
title: "Stage 1 dependency-ordered backlog"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution]
related:
  - development-readiness.md
  - current-milestone.md
  - ../01-product/traceability.md
  - ../06-evals/canonical-tasks.md
---

# Dependency-ordered Stage 1 backlog

Planning package complete for review; T-100's experiment/control decision is accepted, while other product choices and runtime evidence remain open. T-113 covers documentation/workflow refinement; other tasks remain **planned, not implemented work** unless individually marked. [Readiness](development-readiness.md) owns gates and Definition of Ready. [Traceability](../01-product/traceability.md) supplies exact requirement links. P0 = kill-risk/foundation, P1 = controlled prototype, P2 = MVP/pilot, P3 = V1 after learning. Change-task commits are pushed under the [Git workflow's standing authority](git-workflow.md). Dependency installation, main merges and other external-service changes are not implied.

Order: T-100/101 decision/evidence + T-102/108 interaction/research; T-119 is the next fictional Context Rooms experience/contract slice; independently T-103 fake contract replay → admitted T-104/105/106 + local T-107 → T-109 integrated evidence → T-110 gated MVP/pilot → T-111 V1. T-112 stays deferred. Product/visual decisions need not block fake safety tests; missing route evidence does block real external automation.

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
- **Status:** planned; no code, test result or assigned staffed team claimed.

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
- **Status:** planned; no code, test result or assigned staffed team claimed.

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
- **Status:** review — complete local demo slice and live-consent wiring implemented; 127 deterministic tests, 17 actual browser/MCP assertions, 10 live-mode/stub-provider assertions, 37 wire-browser and 130 scripted-browser assertions passed. One paid Qwen proposal check failed (chat instead of fields), so live model quality remains unproven. [Session](sessions/2026-09-15-mcp-backend-integration.md) owns exact checks and limitations. No product gate promotion.
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

- **Scope / authority:** Simon adopted Context Rooms as the active experience direction and asked the notebook/future plan to align on 2026-09-19. This task prepares one bounded fictional-data design/contract slice; implementation begins only when separately requested.
- **Trace / owner:** PRD-FR-022; UC-026/J-009; SCR-003/016/017; CMP-007/009/011; CAP-15; ADR-0015; EVAL-008/012; design + agent/context + privacy owners.
- **Dependencies / entry:** Preserve ADR-0014 Home and the Round conversation shell; reuse registered components; no real storage/provider/device route. Read the [task packet](task-packets.md#t-119-packet), [Context Rooms](../02-design/context-rooms.md) and action/privacy policy.
- **Deliverables:** Editable/reviewable global Home → Rooms → Kitchen slice; deterministic fictional room/item fixture; direct browse/search with model unavailable; current-room/cross-room/global context envelope and visible provenance; membership diff/receipt/Undo; archive and delete-room inventory/result; accessibility/responsive annotations and exact unrun evidence.
- **Acceptance:** Same assistant/personality and control anchors; no room grid on Home; item findable without conversation; whole-room context never loaded; material cross-room source visible and excludable; deletion preserves canonical items and invalidates room-scoped authority; EVAL-008/012 fixture assertions and relevant browser/doc checks pass.
- **Status:** planned — specification and packet ready; no Context Rooms prototype, human study or persistent implementation exists.
- **Excluded / rollback:** No personal data, browser/device persistence, provider egress, sharing/helper access, production database, Android automation, separate room agents, cognitive/dementia benefit claim or MVP expansion. Disable/remove the fictional route without changing global Home if the model fails review.

## Session handoff

Each implementation session selects **one bounded slice**, reads its PRD/UC/J, canonical interface/screen and policy, checks current gates and Git, then writes tests and implementation together. Review-only sessions remain read-only. Add actual source/test links to traceability only when they exist. If feasibility changes the intended outcome, amend canonical behavior and gate decision before widening code. Do not turn an unsuccessful integration into silent Stage 2 work.
