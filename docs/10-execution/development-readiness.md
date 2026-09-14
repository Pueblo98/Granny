---
title: "Stage 1 development-readiness gates and handoff"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [execution]
related:
  - current-milestone.md
  - backlog.md
  - open-questions.md
  - ../01-product/traceability.md
  - ../09-decisions/README.md
---

# Development-readiness assessment

## Cockpit and design-review follow-up, 2026-09-14

Session maintenance T-115 adds a fifth repo-local skill, PR consistency checks and read-only post-merge vault verification. [Current maintenance evidence](sessions/2026-09-14-session-maintenance.md) distinguishes local validation, fresh-context behavior, host discovery, live CI and remote enforcement. None promotes a product gate. Earlier four-skill counts below are historical, not the current skill inventory.

[Development cockpit](../Cockpit.md) is **Ready with proposed assumptions** for structural/local-note review; Obsidian in-app rendering and Simon's cockpit review remain **Needs evidence**. No plugin install or automatic cross-worktree synchronization is claimed. The browser UI received a revision request from Simon; [conversation-first plan](../02-design/conversation-first-plan.md) awaits his review. GATE-05 remains Needs Simon decision and evidence; no production gate changes.

## Browser-design follow-up, 2026-09-14

The user-authorized T-102 initial browser design slice is **Ready with proposed assumptions for review**, not MVP implementation-ready. [Browser handoff](../02-design/browser-prototype.md) records actual tests, frame coverage and gaps. Its simulated verification and permit logic are not T-103, independent runtime authority or device evidence. GATE-05 remains Needs Simon decision and evidence; GATE-03/04/06 real-device conditions and GATE-07–09 remain unchanged. Earlier “no implementation” reports below describe their historical missions; no production app/backend/agent has been built.

**Assessment date: 2026-09-14. Scope: Stage 1 stock-Android app only.** Primary-source desk research was performed on 2026-09-13; editing and final validation crossed midnight in Europe/Madrid.

The canonical specification package is written and linked. It is **ready for bounded synthetic contract work and targeted evidence collection with proposed assumptions**, not ready for an MVP build, real-user autonomous pilot, public distribution or final branded production UI. No runtime/device/user eval has run. Simon accepted ADR-0009's five-experiment scope, control posture and two externally verified workflow minimum on 2026-09-14; architecture/data ADR-0010 and activation ADR-0011 remain proposed. Desk policy evidence rules out the general-assistant dynamic AccessibilityService Play route under the reviewed policy; other routes are conditional.

“Ready” describes an artifact/gate's specified scope, not global release authority. Status labels: Ready; Ready with proposed assumptions; Needs evidence; Needs Simon decision; Blocked; Not applicable to current stage. Gate criteria are prospective proposals until Simon adopts them. A completed specification does not turn unknown platform behavior into fact.

## Artifact assessment

| Required artifact | Canonical owner | Classification / remaining limit |
|---|---|---|
| Comprehensive PRD / MVP-V1 boundary | [PRD](../01-product/prd.md), [scope](../01-product/scope-and-roadmap.md) | Ready with proposed assumptions; five-experiment/control scope accepted, 48 detailed requirements and final release commitments retain individual status |
| Users/jobs/capabilities/use cases/journeys | [Personas](../01-product/personas.md), [25 UCs](../01-product/use-cases.md), [8 journeys](../01-product/user-journeys.md) | Ready with proposed assumptions; no validated user segment or demand |
| Interaction/screens/states/components | [Product design](../02-design/product-design-spec.md), [system](../02-design/design-system.md) | Ready with proposed assumptions; 15 screens, 19 states, 9 components; device/Figma usability untested |
| Accessibility/voice/content | [Access](../02-design/accessibility.md), [voice](../02-design/voice-ux.md) | Ready with proposed assumptions; standards desk-checked, internal targets untested |
| Brand/naming/visual directions | [Identity](../02-design/brand-and-visual-identity.md), [naming](../02-design/naming-exploration.md), [local boards](../02-design/identity-review.html) | Needs Simon decision; 81 candidates/30 live longlist/12 scored candidates/3 finalists/4 territories, screening not clearance |
| Browser design/token handoff | [Browser](../02-design/browser-prototype.md), [tokens](../../design-tokens/README.md), [paused Figma](../02-design/figma.md) | Ready with proposed assumptions for initial design review; executable browser slice and checks exist; no final identity or native conformance |
| Agent/control/tool contract | [Behavior](../03-agent/agent-behavior.md), [tools](../03-agent/tool-contracts.md), [control](../03-agent/device-control.md) | Ready with proposed assumptions for fake replay; device adapters need feasibility |
| Android/system architecture | [System](../04-architecture/system-overview.md), [root map](../../ARCHITECTURE.md) | Ready with proposed assumptions; boundaries/flows specified, SDK/framework/provider unselected |
| Platform/distribution feasibility | [Assessment](../08-research/android-stage-1-feasibility.md) | Needs evidence; dated official-policy desk evidence exists, no measured routes/store approval |
| Policy/privacy/threats/memory/helper | [Action matrix](../05-safety-privacy/action-policy.md), [data](../05-safety-privacy/safety-and-privacy.md), [threats](../05-safety-privacy/threat-model.md), [memory](../03-agent/memory-system.md) | Ready with proposed assumptions for synthetic design; real-data provider/market/security review missing |
| Evals/metrics/failures/trace | [17 evals](../06-evals/canonical-tasks.md), [metrics](../06-evals/eval-strategy.md), [taxonomy](../06-evals/failure-taxonomy.md), [trace](../01-product/traceability.md) | Ready with proposed assumptions as specs; all runtime/human evals unrun |
| Research program | [Research plan](../08-research/research-plan.md), [sources](../08-research/README.md) | Ready with proposed assumptions; recruitment/protocol approvals and actual evidence missing |
| Roadmap/gates/DoR/backlog/handoff | This file, [backlog](backlog.md), [milestone](current-milestone.md), [questions](open-questions.md) | Ready with proposed assumptions; not authorization for broader implementation |
| Instructions/navigation/templates/decisions | [AGENTS](../../AGENTS.md), [docs index](../README.md), [ADRs](../09-decisions/README.md) | Ready as operating map; ADR-0009 accepted 2026-09-14, ADR-0010/0011 proposed, seven earlier accepted records unchanged |
| Stage 2 OS / Stage 3 hardware | [Accepted stage strategy](../09-decisions/ADR-0007-three-stage-product-strategy.md) | Not applicable to current stage; no development work |
| Delivery workflows / skills / first task packets | [Workflows](operating-workflows.md), [packets](task-packets.md), [execution protocol](../03-agent/execution-protocol.md), [admission](../04-architecture/capability-admission.md) | Ready with proposed assumptions for bounded preparation/fake implementation; four repo skills structurally checked, fresh-session behavior/discovery not proven |
| Evidence / research execution protocol | [Evidence review](../06-evals/evidence-protocol.md), [research protocols](../08-research/research-protocols.md) | Ready with proposed assumptions as procedures; no device/participant/runtime results |

## Named gates: evidence, approver, blockers and unlocks

| Gate | Pass evidence / approver | Current status and blockers | Work unlocked when passed |
|---|---|---|---|
| GATE-01 Specification coherence | Link/frontmatter/ID/trace checks + cross-discipline editorial review; document editor verifies mechanics, Simon reviews product proposals | Ready with proposed assumptions; automated validation recorded below, stakeholder acceptance distinct | Bounded fake-interface tests, low-fi/design briefs and evidence planning; not production |
| GATE-02 MVP scope decision | Simon explicitly accepts ADR-0009 or revised scope, five workflows and ≥2 external delegation bar | Ready — passed 2026-09-14: Simon explicitly accepted ADR-0009 after review; experiment scope only, not feasibility or blanket specification acceptance | Commit resources to admitted workflow experiments; not bypass GATE-03/04/06 or authorize MVP build/pilot |
| GATE-03 Android control feasibility | Exact device/app matrix, API/semantic route, fresh targeting, Stop and independent postconditions; Android + safety review | Needs evidence; no physical tests, app adapters or Stop proof | Only demonstrated synthetic device/control capabilities; unsupported routes stay disabled |
| GATE-04 Distribution viability | Capability-by-route policy map, declarations/disclosures and appropriate authoritative review evidence; Simon + policy reviewer | Needs evidence for API/static/private routes; general dynamic accessibility public route Blocked under reviewed policy | Chosen candidate distribution build and narrowly approved pilot route; not guaranteed Play acceptance |
| GATE-05 Interaction-design, naming and brand-direction readiness | Full MVP flow/state/access coverage, formative comprehension, Simon's name/territory decision or explicit provisional prototype exception, professional name checks before public commitment | Needs Simon decision and evidence; browser prototype/briefs/boards exist; remaining design gaps, user studies and legal clearance are open | Styled controlled prototype with recorded maturity; public identity only after specialist clearance, production UI still GATE-08 |
| GATE-06 Safety/privacy readiness for prototype | Reviewed finite tools, local permit/cancel/journal, threat/privacy contract; deterministic invariants then device isolation/grants/egress tests for actuation; safety/privacy reviewer + Simon for real data | Ready with proposed assumptions for **offline fake replay only**; Needs evidence for device actuation/real data; no human/device test pass claimed | Synthetic contract replay now under DoR; actual device actuation only after invariants and platform controls verified; real data additionally terms/consent/support review |
| GATE-07 Technical prototype success | Controlled versioned EVAL suite: ≥2 useful external delegated workflows, proposed ≥80% verified nominal success, all safety cases pass, comprehension/access evidence; engineering/research/safety + Simon | Needs evidence; no runtime prototype or trial baseline | Evidence-backed MVP scope refinement and build decision |
| GATE-08 MVP implementation readiness | GATE-01–07 relevant scope passed; accepted scope/interfaces/policy, per-slice DoR, supported matrix, provider/data contracts, design/token maturity, test/rollback/support plan; Simon | Blocked by scope, platform, route, design and runtime evidence | Deliberately bounded production MVP implementation; no broad assistant expansion |
| GATE-09 Pilot readiness | MVP verification/access/consent/rights/incident/support/update/rollback drills, proposed ≥90% success with n/uncertainty, no unresolved critical/high defect, accepted pilot market/protocol; Simon + safety/research/Android | Blocked by GATE-08 and missing operational/user evidence | Consented, supported limited pilot only; V1/public launch requires separate decision |

A gate can pass for a named capability/configuration without passing for all apps/devices. Gate evidence records source versions, date, approver, exclusions and rollback. Changes to policy, OS/app/recipe, model, permission, interface or privacy contract reopen affected gates. No “approved because nobody objected”.

## Stage 1 milestone roadmap

| Milestone | Objective / hypothesis | Entry / dependencies | Concrete deliverables / discipline | Evidence and observable exit / decision unlocked | Excluded |
|---|---|---|---|---|---|
| M0 Foundation/specification | Make thesis implementable without reconstructing old chat | Accepted stock/stage/repository boundaries and supplied sources | Canonical package, traceability, proposed ADRs, identity and naming options, restartable backlog; product/design/architecture/editor | GATE-01 checks and review-ready decision packet; this mission supplies docs, not accepted product choices | App/backend/OS/hardware implementation |
| M1 Feasibility spikes | Permitted stock APIs/control can yield useful verified delegation | GATE-01, T-101; scope recommendation; synthetic only | Inventory, route matrix, Stop/observation/action/postcondition/voice/egress experiments; Android/policy/agent/privacy | GATE-02/03/04 evidence; if <2 valuable externally delegated jobs feasible, revise MVP; unlock only admitted adapters | Real users/private data, unrestricted accessibility public build |
| M2 Experience and identity prototype | Adults understand/control flows and respond to respectful identity | Low-fi spec and consented RES-01/03; can overlap M1 | Browser interaction package (Figma optional), 4 comparable territories, finalist name tests, access/tone/confirmation studies; design/brand/research | GATE-05 with observed comprehension and Simon direction; allows scoped styling, not legal name availability assumption | Final identity by agent fiat; app-store publication |
| M3 Controlled technical prototype | Local authority and supported adapters work together | Fake T-103 invariants first; GATE-03/04 scoped posture/06, M2 interaction review | T-104–109 synthetic vertical slices, privacy-safe logs, full adverse evals, paired baseline; engineering/research | GATE-07 targets with actual n/evidence and ≥2 external jobs; unlock GATE-08 decision | Personal-data cloud, unsupported apps, silent retries |
| M4 MVP build | Deliver only validated five-workflow subset and infrastructure | GATE-08; resolved scope/support/design/provider decisions | Installation, supported adapters, own UI, rights/access/support/update controls, executable regression; Android/agent/design/privacy | All MVP Must criteria pass on admitted matrix; pilot evidence pack prepared; unlock pilot review | V1 features used to hide failed MVP thesis |
| M5 Pilot readiness and limited pilot | Real adults can use, stop and understand it safely with support | GATE-09 approved protocol/market/consent/support and incident owner | Monitored consented small pilot, opt-out/deletion, capability rollback and qualitative outcomes; product/research/support | Actual task/access/trust/dignity/effect data meets prospective gate or stop/revise; Simon decides continuation | General public reliability/demand claims from tiny sample |
| M6 App V1 | Broader coherent release justified by MVP learning | Pilot review + separate V1 scope and per-extension gates | Calls/basic reminders/document reading/explicit facts/helper proposals where validated; updated adapters/evals/support | EVAL-013–017 and all inherited MVP invariants; Simon release decision with market-specific review | Remote screen/control, passive stories, proactive routines unless separately accepted; all Stage 2/3 |

Dates/cost/staffing are not accepted. Milestones order dependencies, not a delivery promise. A failed kill-risk experiment is useful evidence, not a reason to bypass the gate.

## Definition of Ready for one implementation task

Before code, the task must identify:

1. PRD requirement IDs, UC/J and exact user-visible outcome/acceptance criteria; supported mode/configuration and honest partial result.
2. SCR/CMP or typed interface owner; state transitions, pre/postconditions, errors/cancel/retry/verification, and token maturity (neutral/candidate/selected/accepted).
3. Action class, confirmation/permission/auth, sensitive data/egress/retention, access profiles and independent authority boundary.
4. Architecture owner, canonical state owner, process/device/network placement and dependencies; no untyped model tool.
5. EVAL IDs, fixture/oracle, happy/adversarial tests, human/device portions and expected evidence; unknown is not success.
6. Proposed assumptions, excluded behavior, required decisions/evidence, task size and dependency order.
7. Feature disabled by default until gate admission, rollback/kill switch, unknown-effect recovery, and changed-doc/trace update list.
8. Git branch/dirty-state check, no-secret/synthetic-data plan and actual validation command availability; no external writes without authorization.

T-103 satisfies **specification-level** DoR for pure fake replay. The coding session must inspect available language/test tools and choose a reversible implementation/testing approach; no framework/vendor selection is implied. T-111 is an extension epic and explicitly fails per-task DoR until broken down.

The [T-103 packet](task-packets.md#t-103-packet) now supplies explicit fake ports, independent ledger, 20 boundary/adversarial cases and A–D execution units. [T-102](task-packets.md#t-102-packet) supplies the low-fi design package and annotation contract. These clarify how to start an explicitly requested task; they do not perform it or confer external access.

## Exactly what may start next

- **First safe coding slice:** [T-103](backlog.md#t-103), offline typed prepare/confirm/act/verify/cancel replay. PRD-SAF-001–005, PRD-FR-012/013, PRD-NFR-003/004; EVAL-006/010 plus provider-negative EVAL-009. Fake adapters and synthetic ledger only. No Android permission, microphone, network, real account or final brand dependency.
- **Independent evidence work:** T-101 read-only reference inventory and route assessment with user-provided tablet access; RES-01/03 recruitment/prototype planning after ethics preparation; Simon's name/identity iteration.
- **Must wait:** actual external device actuation until fake invariants/device safety gate; real personal data/cloud until provider/consent/security review; final branded production UI until design/name maturity; MVP build/pilot/public distribution until named gates. No Stage 2/3 work.

This mission wrote no application/runtime/backend scaffolding. Documentation validation tooling and static review boards are documentation artifacts, not product implementation.

## Validation record

Completed 2026-09-14, using existing Python/PyYAML 6.0.3; no dependencies installed:

| Command / check | Actual result | Limit |
|---|---|---|
| python3 scripts/validate-docs.py | Exit 0, PASS, 0 errors: 68 Markdown documents checked plus 2 byte-preserved source-Markdown exemptions; all local links/related paths/anchors, frontmatter/status/dates, table structure, stable definitions and trace destinations pass | External URL reachability not checked by this offline tool; primary sources were browsed separately |
| Requirement/coverage checks in same validator | 48 PRD definitions (42 MVP), 48 trace rows, 25 UCs, 8 journeys, 15 screens, 19 states, 9 components, 14 capabilities, 17 eval specifications, 9 research studies, 13 backlog tasks and 9 gates | Specification coverage, not implementation or passing runtime evals |
| Naming/identity arithmetic in same validator | 81 candidate IDs; 30 unique longlist names; current 12-name scored shortlist is a subset; weighted scores and 36 contrast pairs pass; 4 territories / 8 board screens structurally present | No user preference, font, trademark, domain, voice-recognition or device contrast proof |
| git diff --check | Exit 0; no whitespace errors | Includes rewritten tracked files; staged check repeated before commit |
| git diff --exit-code over vision, source-material, Obsidian and ADR-0001–0008 paths | Exit 0; unchanged | Source hashes independently verified below |
| SHA-256 checks in validator | All 4 supplied artifact hashes match source register; historical ADRs unchanged; no Obsidian changes or tracked private JSON | Ignored user state was not edited/staged; no attempt to normalize source metadata |
| Targeted rg scan for private-key blocks and common API/GitHub secret formats in edited package | Exit 1, no matches | Heuristic scan, not exhaustive secret detection; diff reviewed for private data and unsupported claims |
| Headless Chromium render of local identity-review.html at 1440×2400 | Exit 0 after sandbox launch needed approval; PNG produced in temporary profile, visually inspected visible Home/confirmation layout | Static exploration only; viewport shows initial territory and start of next, not full Android/accessibility or all-breakpoint validation |

Scope/vault text searches found old root-vault instructions only in preserved initialization source and deprecated ADR-0004; active instructions consistently specify docs/. Privileged OS/dock references in active specs are exclusions or future context, not requirements. Diff review corrected stable UC anchors, OQ migration, component mapping, intermediate verification→planning transition, composite-action budgets, mark-read confirmation, memory restore semantics, and name-screening collisions.

No app/runtime/backend was built, no user/device study or EVAL-001–017 was executed, and no Figma file/store approval/final brand was fabricated. Local source wording and formatted PRD migration were preserved while expanding behavior. The package is coherent for bounded next work; remaining evidence and Simon decisions above still block MVP/pilot readiness.

## Restart handoff

### Workflow refinement validation — T-113, 2026-09-14

The follow-up goal was to make the planning package operational before product design/development. It delivered six focused contract/workflow/packet documents, three execution templates, four repository-local skills and regression-tested documentation tooling, with linked canonical updates. T-103 remains unimplemented; no device, participant, Figma or provider execution occurred.

| Check | Actual result | Limit |
|---|---|---|
| python3 scripts/validate-docs.py | Exit 0, PASS, 0 errors; 77 canonical/template Markdown files, four skills, all local references, 48 PRD/trace rows, 14 task IDs, four source hashes | External URLs not fetched; supported Markdown forms, not a complete CommonMark renderer |
| python3 -m unittest discover -s scripts -p 'test_*.py' | Exit 0; 19 tests passed | Parser/frontmatter, skill metadata, undefined IDs, trace status drift and implementation-status progression; not app evals |
| Bundled skill-creator quick_validate.py for each of four skill directories | Four exit-0 “Skill is valid!” results | Packaging only, not discovery or independent agent behavior |
| git diff --check | Exit 0, no whitespace errors | Staged check also required before commit |
| git diff --exit-code over vision, source-material, Obsidian and ADR paths | Exit 0; unchanged from task start | Existing user action-policy heading edit preserved separately, not part of this task |
| Targeted private-key/API-token format scan of new docs/skills/tooling | Exit 1; no matches | Heuristic only; synthetic fixtures and diff also reviewed |

Self-review scenario walkthrough, **not agent execution or an independent test**:

| Request scenario | Instruction/contract result checked |
|---|---|
| Review voice proposal | Spec skill distinguishes review from edit; no automatic implementation |
| Accept only ADR-0009 | Decision workflow preserves ADR-0010/0011 and other gate statuses |
| Prepare T-103 | Task skill yields a packet/test plan, not runtime code |
| Implement T-103 then claim Android success | Fake-only packet and evidence layer reject the broader device claim |
| Prepare Figma manifest | Design skill preserves external-write boundary and cannot invent a file link |
| Prefer Open Day | Design workflow does not accept a name, font, logo or every token |
| Use 20 fake passes to approve GATE-03 | Evidence review requires actual device configuration/Stop/postconditions |
| Complete a task with an unknown message effect | Execution protocol forbids completion/retry without independent evidence |

Fresh-session discovery and behavioral smoke tests remain explicit skill debt; no false passing claim. Numeric budgets, journal encoding, real adapter admission, ADR-0010/0011, identity and research protocols remain proposed/evidence-gated. GATE-02 alone retains Simon's accepted experiment scope; no other gate was promoted by this refinement.

Decision follow-up validation, 2026-09-14: after recording Simon's ADR-0009 approval and updating GATE-02, T-100 and linked scope/status summaries, `python3 scripts/validate-docs.py` passed with 0 errors (1,211 local links; unchanged requirement/eval counts and four source hashes); `git diff --check` exited 0. No runtime evidence or other gate acceptance was added.

Read [docs index](../README.md) → [current milestone](current-milestone.md) → selected T-ID/PRD/contract → [ADRs](../09-decisions/README.md) and [open questions](open-questions.md) → Git status and [worktree/publication workflow](git-workflow.md). Preserved sources remain immutable. ADR-0009 is accepted for experiment/control scope; ADR-0010/0011 remain proposed. Do not treat scope approval as runtime evidence or blanket specification acceptance. Simon's 2026-09-14 follow-up authorizes task-branch pushes; main merge and product publication remain separately gated.
