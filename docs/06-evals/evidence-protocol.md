---
title: "Evidence records, gate review and regression protocol"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [evals, evidence, quality]
related:
  - canonical-tasks.md
  - eval-strategy.md
  - ../08-research/research-plan.md
  - ../10-execution/development-readiness.md
---

# Evidence protocol

This document owns evidence packaging and review. [Canonical evals](canonical-tasks.md) own required cases, [metrics](eval-strategy.md) own numerators/denominators/targets, [research](../08-research/research-plan.md) owns hypotheses and methods, [readiness](../10-execution/development-readiness.md) owns gate status. A passing documentation check, accepted ADR or convincing demo is not a passing runtime eval.

## Evidence layers and allowed claims

| Layer | Can establish | Cannot establish |
|---|---|---|
| Source/desk | What an identified source says on a dated access; documented API/policy constraint | App compatibility, legal clearance, user preference or store approval |
| Static artifact | Schema/link/contrast/manifest properties actually inspected or computed | Device focus, voice recognition, real task success |
| Offline fixture | Logical behavior of implemented code with controlled fake ports | Android cancellation timing, third-party app effect or network privacy |
| Synthetic device/integration | Actual behavior on recorded tablet/app/account-fixture/permission versions | All Android devices, all apps, older-adult comprehension or public-route approval |
| Human formative | Observed behavior/interpretation from consenting participants under protocol | Market prevalence, rare-event safety or clinical benefit |
| Pilot/operations | Bounded supported use and operational drills in approved context | General availability beyond scope or guaranteed reliability |
| Authority decision | Explicit approver's selected scope/exception on a date | New technical measurements |

Keep separate evidence records when methods/configurations materially differ. One record can link several EVAL IDs if it actually ran their cases, but a composite label must not hide an unrun portion.

## Record structure

Use [research-note template](../_templates/research-note.md) for actual evidence under docs/08-research/. Stable record IDs may use EVD-### once records exist; do not create blank evidence files to fill a matrix. Source artifacts and personal participant records stay in their existing approved locations; Git contains only permitted deidentified/synthetic evidence.

| Field | Required content |
|---|---|
| Identity and status | Record ID, actual date, author/discipline, document status; execution status unrun/partial/completed separate from pass/fail/inconclusive |
| Claim and decision | One falsifiable claim, linked PRD/UC/J/EVAL/RES/task/gate; what it would and would not unlock |
| Artifact/configuration | Source commit or build digest, fixture/oracle versions, code/test paths that exist, device/API/OEM/app versions where relevant |
| Scope | Control/distribution/build mode, locale, timezone, input/access profile, grants/auth/network state, provider/recipe/policy versions |
| Procedure | Exact reproducible steps/command, seeded schedule, start and teardown criteria; any deviations explained |
| Data | Synthetic/deidentified classification, authorized sinks/retention/deletion; no identifying source values in Git |
| Result | Actual observed outputs, intended and unintended effects, numerator/denominator, latency sample units and missing data |
| Failure/uncertainty | Case IDs, taxonomy/severity, excluded runs, cancelled/aborted states, disagreements and residual risk |
| Interpretation | Source fact vs observation vs inference vs recommendation; no changed success threshold after results |
| Review and lifespan | Reviewer or self-review label, approver needed, applicable gate, invalidation/retest triggers and next task |

Never include account emails, serials, personal transcripts, screenshots, real contact names, access tokens or participant contact details. A redacted export still needs review; hashes of private low-entropy content are not automatically anonymous.

## Case result and denominator rules

Each attempt receives a unique local run/case identifier and exactly one terminal classification: verified complete, safe partial, safe refusal, user cancelled, failed safely, unsafe, unknown or not executed. “Not executed” requires a reason and is not a passed case. A run can complete execution with failing results. An unrun case has no numerator.

Report at least:
- all attempted supported tasks and verified outcomes;
- unsupported/excluded requests and rationale;
- cancellations and human interventions;
- unsafe/wrong-entity/duplicate/unconfirmed effects as absolute counts and relevant denominators;
- missing or conflicting evidence;
- per-workflow/configuration/access profile results before any aggregate.

Do not average percentages across unequal samples without weighting/denominators. Do not remove timeout or recovery attempts because they are inconvenient. For a human-stopped task, preserve both intended-outcome and cancellation-safety measures. Safe refusal is valuable but not completed delegation.

## Reviewer checklist

1. Is the starting state controlled and named? Could the expected answer have leaked into the observed result?
2. Is the postcondition independent of model/executor assertions? Does it match the exact account/person/content/effect?
3. Are unauthorized effects and privacy sinks inspected, not only happy-path output?
4. Are stale/replayed/changed approvals, lost grants, process death, unknown effects and Stop races covered as relevant?
5. Are all internal reads/actions/retries and machine waits counted under the canonical budget?
6. Are target thresholds prospective and distinct from observed baselines? Are n and exclusions shown?
7. Does the test layer justify the claim? A fake clock proves no physical p95.
8. Does evidence use the same configuration/build/policy as the proposed admission?
9. Are private data, assumptions, reviewer identity and outstanding decisions handled honestly?
10. Can another session reproduce the result without chat history, credentials or guessed setup?

Unmet items are concrete findings with evidence location, consequence and required follow-up, not generic “needs more testing”.

## Gate recommendation record

For a gate review, include gate ID; capability/configuration/release scope; current prerequisite states; evidence links and dates; evaluated criteria with pass/fail/not evaluated; unresolved severity; approver required; recommendation; exact work unlocked; exclusions and retest triggers.

The reviewer may recommend Ready, Ready with proposed assumptions, Needs evidence, Needs Simon decision, Blocked or Not applicable. Only the gate's named authority records acceptance. Self-review cannot become an independent safety review by assigning itself another role.

GATE-02 already passed from Simon's ADR-0009 approval. It does not need a fabricated EVD runtime record. GATE-03/04/07 require different evidence, and GATE-06's offline fixture allowance is not real-data/device safety acceptance.

## Regression and incident handling

Severity proposal:
- Critical: unauthorized consequential effect, wrong-person send, protected/credential/private-content exposure, dispatch after Stop latch, or hidden continued control.
- High: repeatable unsafe uncertainty handling, missing essential accessible Stop/confirmation, permission bypass, data resurrection or uncontained capability mismatch.
- Medium: recoverable wrong nonconsequential result, excessive clarification, stale display with honest recovery, accessibility defect with a usable alternative.
- Low: cosmetic/copy inconsistency that does not change meaning, access or authority.

Assess actual consequence, not only these examples. A high-risk near miss can block admission even if the external effect was prevented by chance.

On a material failure: disable affected automation, keep manual use, preserve minimal permitted evidence, create a synthetic reproducer, update the owning EVAL and fix task, rerun invariants and affected workflows, then obtain required re-admission review. Do not restore by changing a threshold or hiding the failure. Raw personal incident evidence requires approved restricted handling; no automatic Git attachment or support upload.

## Documentation and skill tests

Documentation tooling has its own evidence category. Run the validator and its regression tests; report exactly which parser/schema/link/ID checks they cover. Structural checks cannot prove skill selection or agent behavior. A manual scenario walkthrough is labeled as such, not an independent agent test. A fresh-session skill smoke test is separate: verify discovery, selected canonical reads, proper mutation boundary and honest handoff on realistic positive/negative prompts.

Skills must not declare gates passed, install dependencies or push merely because a workflow reaches its last step. Their behavior is evaluated against the requested task, not exact wording. Add narrowly scoped corrections for demonstrated failures instead of making every skill a giant global instruction set.
