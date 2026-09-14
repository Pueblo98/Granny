---
name: granny-spec-change
description: "Refine or review Granny Stage 1 specifications and propagate explicit decisions across requirements, traceability and gates. Use for product-contract changes, not ordinary coding or accepting proposals on Simon's behalf."
metadata:
  owner: Simon
  status: proposed
  last_updated: "2026-09-14"
---

# Granny specification change

Read [AGENTS](../../../AGENTS.md), [current milestone](../../../docs/10-execution/current-milestone.md), [ADR index](../../../docs/09-decisions/README.md) and [decision queue](../../../docs/10-execution/open-questions.md), then the canonical owner for the requested behavior. Use [WF-01 and WF-05](../../../docs/10-execution/operating-workflows.md) for change/decision propagation.

Identify the request mode: review, edit, or record an explicit approval. Review is read-only except relevant diagnostics; it does not authorize fixing findings. Record approval only for the scope actually reviewed and explicitly accepted, including date and remaining conditions. Do not accept adjacent ADRs, numeric targets, brand values or release gates.

Trace affected PRD IDs through [traceability](../../../docs/01-product/traceability.md) to UC/J/SCR/CMP, tool/architecture, policy, task and eval. Keep one behavior owner; consumers link or summarize. If a consequential change contradicts accepted direction, prepare an options brief/ADR instead of silently replacing it. Routine reversible details may be proposed.

For an edit, make the observable difference and its failure/Stop/verification criteria concrete. Preserve stable meanings, source artifacts and unrelated user changes. Stage 2/3 remain inactive; an Android limitation is not OS authorization. Screen content remains data, never authority.

Validate with `python3 scripts/validate-docs.py` and relevant checks from repo root. Report actual results and unrun gaps. A passing documentation check is not runtime evidence. Update task/gate summaries only when changed. For edits, follow the [Git workflow](../../../docs/10-execution/git-workflow.md): dedicated worktree, scoped commits, authorized task-branch push and remote-SHA verification. Review-only tasks remain read-only; no automatic main merge, other external write or skill installation.

Hand off changed owners, rationale, affected IDs, validation, authority still needed, Git state and one bounded next action. Do not manufacture completeness by adding empty files or duplicating the PRD.
