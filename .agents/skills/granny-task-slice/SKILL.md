---
name: granny-task-slice
description: "Prepare or implement one bounded Granny engineering task using its readiness gates, interface contract and evals. Implement only when the user requests code; planning or review requests remain non-implementing."
metadata:
  owner: Simon
  status: proposed
  last_updated: "2026-09-14"
---

# Granny bounded engineering slice

Read [AGENTS](../../../AGENTS.md), [milestone](../../../docs/10-execution/current-milestone.md), the selected [backlog task](../../../docs/10-execution/backlog.md) and its [packet](../../../docs/10-execution/task-packets.md). Confirm whether the user asked to prepare, review or implement. A packet, goal, passed gate or “keep going” does not broaden the current task or external authority.

Apply [Definition of Ready](../../../docs/10-execution/development-readiness.md): outcome/PRD/UC/J, screen or interface, data/permission/access implications, oracle/evals, assumptions, exclusions, dependencies and rollback. Missing brand/device choices need not block an offline fake slice; missing real-device safety/route evidence does block device actuation.

For executor/agent work, read [tool contracts](../../../docs/03-agent/tool-contracts.md), [execution protocol](../../../docs/03-agent/execution-protocol.md), [device control](../../../docs/03-agent/device-control.md), [action policy](../../../docs/05-safety-privacy/action-policy.md) and [capability admission](../../../docs/04-architecture/capability-admission.md). For other tasks read only their owning interfaces and policies.

If code is requested, inspect existing tools/worktree, choose the smallest reversible setup and test the required invariant. Do not install dependencies without authority. T-103 means fake ports/clock/ledger only: no Android service, network/provider call, personal account, unrestricted shell tool or production scaffold. Keep expected values separate from an independent observed-effect oracle.

Run normal and adverse cases: changed/replayed approval, stale target, Stop races, unknown effect, restart, permission/version loss and privacy sinks as applicable. Do not loosen postconditions to make tests pass. New coding discoveries update canonical contracts and evals with proposal/decision status intact.

Use [evidence protocol](../../../docs/06-evals/evidence-protocol.md) and WF-04/06 in [workflows](../../../docs/10-execution/operating-workflows.md). Link actual code/test artifacts only after they exist. Complete only the selected task, never adjacent device integration because a fake test passed. Report exact commands, limits, Git state and next bounded work.
