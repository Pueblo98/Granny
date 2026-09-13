---
title: "Stage 1 dependency-ordered backlog"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [execution]
related:
  - development-readiness.md
  - current-milestone.md
  - ../01-product/traceability.md
  - ../06-evals/canonical-tasks.md
---

# Dependency-ordered Stage 1 backlog

Planning package complete for review; product choices and runtime evidence remain open. These are **planned tasks, not implemented work**. [Readiness](development-readiness.md) owns gates and Definition of Ready. [Traceability](../01-product/traceability.md) supplies exact requirement links. P0 = kill-risk/foundation, P1 = controlled prototype, P2 = MVP/pilot, P3 = V1 after learning. No task includes permission to push, install dependencies or modify external services.

Order: T-100/101 decision/evidence + T-102/108 interaction/research; independently T-103 fake contract replay → admitted T-104/105/106 + local T-107 → T-109 integrated evidence → T-110 gated MVP/pilot → T-111 V1. T-112 stays deferred. Product/visual decisions need not block fake safety tests; missing route evidence does block real external automation.

<a id="t-100"></a>
## T-100 — Review MVP/control decision brief

- **Priority / discipline:** P0 / Simon/product; Simon owns acceptance.
- **Dependencies / entry:** None; specification package.
- **Trace / contract:** ADR-0009 plus PRD-FR-006/009/010 and OUT-001; UC-002/004/006, J-001/003/005.
- **Bounded deliverable:** Choose proposed five-workflow scope and candidate-vs-lab boundary; retain at least two useful external delegation bar; state alternatives if route fails.
- **Acceptance / evidence:** Recorded Simon decision, unresolved evidence conditions and GATE-02 state; no acceptance inferred.
- **Excluded / rollback:** No code, public submission or name lock. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

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
## T-102 — Prototype neutral Home/input/permission and access interaction

- **Priority / discipline:** P0 / Design/Android; Simon owns acceptance.
- **Dependencies / entry:** Contract portion can start now; device shell requires DoR and T-101 environment; no final brand needed.
- **Trace / contract:** PRD-FR-001/002/003/011; ACC-001–003; OUT-002; UC-007/013/014/022, J-006/007; SCR-001–004/011; CMP-002/007/008/009; EVAL-005/007.
- **Bounded deliverable:** First low-fi frames including denied mic and typed path; next bounded own-app shell, transcript fixture and reversible text preview, no external automation.
- **Acceptance / evidence:** 100/130/200% reflow and local semantics tests; explicit scope labels; design review then device accessibility evidence.
- **Excluded / rollback:** No real model, mic/background capture without separate task, or global settings mutation. Neutral tokens proposed. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

<a id="t-103"></a>
## T-103 — Build offline authorization/cancellation/verification contract replay

- **Priority / discipline:** P0 — first safe coding slice / Agent/safety engineer; Simon owns acceptance.
- **Dependencies / entry:** Read PRD/tool/policy/DoR; GATE-01 editorial coherence; synthetic-only contract scope. No device/provider or brand decision needed.
- **Trace / contract:** PRD-SAF-001–005, FR-004/012/013/016, NFR-001/003/004, DST-004; UC-003/006/011/019/025; J-002/003; EVAL-006/009/010.
- **Bounded deliverable:** Implement minimal pure typed intent/prepared action/permit/receipt/evidence state machine using fake registry/observer/planner/executor/clock/ledger. One synthetic message effect and one reversible navigation. Exact recipient/content bound; deny wrong/stale/replayed/changed approvals. Stop prevents post-latch dispatch; crash restart quarantines unknown; action success without postcondition cannot complete.
- **Acceptance / evidence:** Deterministic tests for valid once-only effect, 60s expiry, >2s stale observation, malformed/forged tool, screen injection, late model, cancel races, budget/loop cutoff, unknown outcome/no resend and provider swap. No actual network/files from model. Record tests and limitations; contract replay is not GATE-03/07 device evidence.
- **Excluded / rollback:** No Android service, SDK/framework lock, backend/model calls, coordinates, personal data, credentials or production scaffold. Choose smallest reversible language/test setup available after environment inspection; no dependency installation without authority. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
- **Status:** planned; no code, test result or assigned staffed team claimed.

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
- **Bounded deliverable:** Build exact Figma package when external write authorized; test consequence/Stop/partial understanding and access; compare four territories and spoken finalists; incorporate Simon love/interesting/neutral/dislike/never responses.
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
- **Bounded deliverable:** Separate bounded call, reminder, document, explicit fact-rights and helper-config proposal tasks; each gets adapter/screen/failure/detail and DoR before code.
- **Acceptance / evidence:** Per-extension independent success/rights/access evidence; no remote screen/control inheritance; V1 decision based on actual MVP learning.
- **Excluded / rollback:** Not ready as one large implementation task; no medical reminders promise or passive personal memory. Keep capability disabled by default until gate passes; fake work remains separable/deletable. No implicit rollout.
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

## Task handoff rule

Each next session selects **one bounded slice**, reads its PRD/UC/J, canonical interface/screen and policy, checks current gates and Git, then writes tests and implementation together. Add actual source/test links to traceability only when they exist. If feasibility changes the intended outcome, amend canonical behavior and gate decision before widening code. Do not turn an unsuccessful integration into silent Stage 2 work.
