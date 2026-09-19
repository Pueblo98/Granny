---
title: "Stage 1 delivery workflows and documentation stewardship"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, workflow]
related:
  - development-readiness.md
  - task-packets.md
  - ../06-evals/evidence-protocol.md
  - ../README.md
---

# Delivery operating system

Current design medium: local browser prototype, explicitly authorized by Simon on 2026-09-14. Context Rooms are the active next experience direction; use T-119 only after an implementation request. Build native HTML/CSS interactions in prototypes/stage-1, keep reviewer controls separate, use only fictional fixtures and preserve the no-capture/no-egress boundary. Do not re-enter Figma merely because a skill or historical frame inventory mentions it. The [browser handoff](../02-design/browser-prototype.md) owns run/check/review instructions; this is not authorization for a web product, Android actuation or production agent code.

This document owns **how work moves**, not what the product does. [AGENTS](../../AGENTS.md) owns agent instructions; [readiness](development-readiness.md) owns gate status and Definition of Ready; [backlog](backlog.md) owns T-ID status. The accepted experiment scope is ADR-0009. Detailed contracts remain proposed until specifically accepted; no workflow auto-approves a product choice or external action.

## Choose the work lane

| Request | Entry information | Work product | Stop boundary |
|---|---|---|---|
| Explain, review or diagnose | Named question, affected canonical owner, available evidence | Findings with consequence, source and recommendation | Do not implement or mutate external systems from a review request |
| Refine a specification | Behavior to clarify, release, current authority | Canonical edit plus affected trace/design/policy/eval links | New consequential direction needs a proposed ADR or Simon decision |
| Record a decision | Simon's exact reviewed scope and explicit approval | ADR authority/date, gate/task/question propagation | Do not accept adjacent proposals or mark evidence passed |
| Prepare a design package | J/SCR/CMP IDs, fidelity, name/token maturity, test question | Frame/variant/annotation manifest and review protocol | Actual Figma writes need current authority; mock screens do not prove Android controls |
| Collect evidence | Hypothesis, configuration, approved method/data, oracle | Dated evidence record with failures and limitations | No personal data, participant contact, installation or app actuation inferred from desk research |
| Implement a slice | Explicit coding request and task-level DoR | Small tested change + evidence + handoff | Stop at task acceptance; do not expand into adjacent capabilities |
| Review release admission | Exact build/capability/matrix and complete evidence pack | Pass/conditional/reject recommendation with residual risks | Only named approver changes release/gate authority |

A session can finish a bounded lane while a larger milestone remains blocked. “Keep going” supports persistence within the requested lane; it does not remove permission, privacy or release gates.

## Work-item lifecycle

Use a task's existing T-ID. Substeps use labels such as T-103/A in its packet, not independent backlog IDs or fake tickets. Backlog task statuses are **planned, ready, active, review, complete, blocked, deferred**; these are not document frontmatter statuses. An assigned discipline is not a staffed person.

- Planned → ready: task-level DoR satisfied for the precise execution mode; assumptions and evidence gaps named.
- Ready → active: current user request authorizes the task and required access is available.
- Active → review: deliverable and relevant checks exist; record exact commit/artifact and limitations.
- Review → complete: requested task acceptance met. Documentation can be complete without runtime implementation; an implementation task cannot be complete on a specification alone.
- Any state → blocked: an essential dependency or authority is absent; record what unblocks it and independent work still possible. Do not delete unfinished work or mark the whole product blocked for one device.
- Deferred: outside currently admitted scope. Reactivation requires the relevant scope decision.
- A regression reopens the affected task or a new linked defect task; never rewrite an earlier evidence run as if it passed.

For pure local maintenance, the agent can report checks and task completion; it cannot provide Simon's product, identity, distribution or pilot acceptance. With no independent reviewer available, label review self-review and record that limitation. Do not invent a team sign-off.

## Six repeatable workflows

### WF-01 — Specification change

Read the canonical owner and trace for the affected IDs. Describe the observable difference and why it matters. Determine whether it changes accepted intent, a proposal, an implementation detail or evidence only. Change one owner, then update consumers using the impact matrix below. Retain IDs when meaning is the same; new distinct behavior receives a new ID, retired definitions retain a migration pointer. Validate that an engineer can distinguish no effect, known effect and unknown effect from the text.

Exit: changed behavior has testable criteria, known safety disposition and design/interface destinations. No isolated “idea accepted” in a chat summary. A broad rewrite does not reset previously accepted scope.

### WF-02 — Design handoff and critique

Use the [browser-first design contract](../02-design/browser-prototype.md) and the T-102/108/119 [packets](task-packets.md). For Context Rooms, preserve global Home and run the named direct-findability/source/deletion cases before visual atmosphere. The Figma contract applies only when separate Figma work is requested. Fix interaction flow before territory styling. Review negative paths on the same copy/layout; test voice and touch separately. Annotate Android-owned UI and unproven Stop surfaces rather than making them look guaranteed.

Exit: designer can enumerate required frames/components and the engineer can identify which values are neutral, proposed or accepted. A visual preference does not change confirmation class, timing semantics or recipient preview. Capture missing coverage as a specific frame or contract issue, not “make it simpler”.

### WF-03 — Evidence collection and capability admission

Use [evidence protocol](../06-evals/evidence-protocol.md) and [capability admission](../04-architecture/capability-admission.md). Freeze question, source/configuration, procedure and success predicate before observing. Record attempted as well as excluded/aborted runs. Separate platform facts, measurements, interpretation and recommendations.

Exit: evidence has a narrow claim and expiry/retest trigger. A paper, static mock or fake executor can inform a gate but cannot stand in for physical device, user or store evidence. Never claim a capability supported because its permission can be enabled.

### WF-04 — Bounded implementation

Read task packet, canonical interface, action/data policies and affected evals. Verify current tools and choose a reversible setup within the allowed task; no provider/framework lock by convenience. Write the failing acceptance case or deterministic fixture first where practical. Implement only the slice, test cancellation/failure as part of it, then update real code/test links in traceability. An execution request is necessary before T-103 code; this refinement mission only prepares it.

Exit: acceptance evidence, changed-doc list, rollback and unsupported behavior are explicit. If a postcondition cannot be observed, report partial/unknown and disable the claim rather than weakening the oracle.

### WF-05 — Decision and gate update

Record options, recommendation, tradeoffs, precise authority/date and unresolved evidence conditions. On approval, update ADR index, affected scope summaries, OQ disposition, T status, readiness and current milestone together. Preserve other proposal statuses. GATE-02 passes on Simon's scope acceptance; it does not pass GATE-03/04/07.

A gate record names configuration, approving person/role, evidence, exceptions, expiry/retest triggers and unlocked work. Use Ready with proposed assumptions only for the explicitly bounded work; never as a synonym for production-safe.

### WF-06 — Regression, recovery and handoff

Freeze the failing configuration; stop only affected admission where possible. Record expected/actual outcome, severity and privacy-safe reproduction. Add an adversarial case to the owning EVAL before re-enabling. Preserve the user's unrelated work; inspect dirty paths before staging specific files.

Handoff contains: requested task and scope; actual changes; commands and exit/results; unrun tests and reasons; accepted/proposed/evidence distinctions; remaining risks; branch/commit/worktree and verified remote SHA; next bounded action. No raw research data or real message content. Change tasks follow the [Git workflow](git-workflow.md): isolated worktree, scoped commits and task-branch pushes under Simon's standing authorization. Completed documentation-only tasks continue through scoped PR, passing checks, normal `main` merge and safe primary-vault synchronization under his 2026-09-17 direction. Review-only work remains read-only; mixed/code integration and product publication retain separate authority.

## Change-impact routing

| Changed owner | Required consumers to inspect | Regression focus |
|---|---|---|
| PRD scope/outcome | UC/J, design, tool/architecture admission, action/privacy policy, trace/backlog/gates | Positive outcome and excluded-action tests |
| Screen/component/copy | Voice/access/Figma, corresponding J/EVAL, tokens if actual values change | Focus/scale/input parity; consequence and partial-result comprehension |
| Tool/schema/protocol | Planner, executor/verifier, registry, architecture, safety/threats, task packet | Old-version rejection, malformed proposals, fresh approval, Stop/crash/replay |
| Permissions/route/app support | Admission manifest, feasibility, onboarding, PRD-DST, EVAL-005/009/011 | Revocation, unknown versions, disclosure, no lower-route bypass |
| Memory/retention/egress | Privacy, memory contract, threat model, UX rights, provider boundary | Derivative deletion, restore, export canaries, revoked access |
| Eval method/result | Evidence record, metrics/trace, affected gate/task | Denominator integrity, missing data, narrow claim, reproducibility |
| Brand/name/tokens | Naming/identity decision, Figma/components/access, exports | Contrast, glyph/license/name risks; no implied acceptance |
| Repo skill/validator | This workflow, AGENTS routing, skill metadata/tests | Trigger precision, permission preservation, broken-link/ID detection |

“Inspect” need not mean edit every consumer. Record no-impact rationale when a linked area is unchanged. Avoid noisy date-only edits.

## Repository skills and portability

Six Granny instruction-only skills route to these canonical workflows:

| Skill | Use it for | Do not use it to |
|---|---|---|
| [granny-session-lifecycle](../../.agents/skills/granny-session-lifecycle/SKILL.md) | Start/handoff change work, maintain cockpit records, complete authorized docs-main integration and check vault visibility | Edit from review-only requests, bypass checks/dirty-work protection or modify private vault settings |
| [granny-spec-change](../../.agents/skills/granny-spec-change/SKILL.md) | Change or review product specs and propagate actual decisions | Approve a proposal, rewrite historical sources or implement from a review request |
| [granny-task-slice](../../.agents/skills/granny-task-slice/SKILL.md) | Prepare or execute one explicitly requested, gate-bounded engineering slice | Start a broad app build or infer device/network permission |
| [granny-design-handoff](../../.agents/skills/granny-design-handoff/SKILL.md) | Prepare/review frames, states, components and design evidence | Invent a Figma file or silently finalize identity |
| [granny-ui-craft](../../.agents/skills/granny-ui-craft/SKILL.md) | Shape, vary, distill, critique and harden product-specific conversation-first UI | Override behavior/safety/access owners, implement from a review or create a second design-system authority |
| [granny-evidence-review](../../.agents/skills/granny-evidence-review/SKILL.md) | Design an eval/evidence packet or review a claimed result | Treat a fixture as device proof or a review as approval |

Three modified upstream Google skills provide narrow native implementation guidance: [adaptive](../../.agents/skills/adaptive/SKILL.md), [edge-to-edge](../../.agents/skills/edge-to-edge/SKILL.md) and [testing-setup](../../.agents/skills/testing-setup/SKILL.md). They are dormant until a matching authorized Compose task exists and remain subordinate to DoR, dependency authority and evidence rules. [Setup/provenance](ui-ux-skills.md) records pinned sources, local changes and the manual update procedure.

Skills live in the repository's .agents/skills, not a global personal installation. Product knowledge stays in docs/. SKILL.md uses the required name/description schema with maintenance metadata under metadata; this is a packaging exception to canonical document frontmatter, not another product source. Claude or other tools can read the linked SKILL.md manually if automatic discovery is unavailable; no host-specific installation is assumed.

OpenAI's [Build skills documentation](https://learn.chatgpt.com/docs/build-skills), accessed 2026-09-14, documents repo-local discovery, name/description frontmatter and optional UI metadata. Host discovery and realistic agent behavior must still be checked in a fresh session; file validation alone does not establish either. No global settings, scheduled jobs, hooks, plugins or external integrations are installed by this package.

## Cockpit stewardship

Use [Cockpit](../Cockpit.md) and its [guide](cockpit-guide.md) for delivery records and coordination. New authorized change tasks create one session record and read open [agent messages](agent-board.md). Record the difference between code built, checks passed, owner accepted and Git integrated. Link canonical tasks/gates; do not duplicate their editable status in a second tracker. Regenerate/check the derived snapshot before handoff. Cross-worktree records require explicit branch awareness; no live chat, agent wake-up or auto-sync is implied.

## Documentation maintenance and completion

Keep ownership small: behavior in canonical specs, execution detail in packets, reusable procedures here, evidence in dated records only when collected. Templates are forms, not completed artifacts. Use relative standard Markdown links; keep private Obsidian state ignored. Run the repo checker and its regression tests before committing documentation-tool changes; external links are reviewed by source relevance, not silently declared current by an offline checker.

Stop this refinement pass when a fresh designer can start T-119 and an engineer can start the fake T-103 slice without guessing interfaces, oracle, scope or authority. Missing real-world evidence must remain visible; writing more planning prose cannot remove it.
