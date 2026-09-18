---
name: granny-session-lifecycle
description: "Start or hand off a Granny change session, maintain its cockpit record, check PR handoff coverage, or verify merged work is visible in the primary vault. Review-only requests stay read-only."
metadata:
  owner: Simon
  status: proposed
  last_updated: "2026-09-17"
---

# Granny session lifecycle

Read [AGENTS](../../../AGENTS.md), [Cockpit](../../../docs/Cockpit.md), [milestone](../../../docs/10-execution/current-milestone.md) and open [agent messages](../../../docs/10-execution/agent-board.md). Use [cockpit stewardship](../../../docs/10-execution/cockpit-guide.md) as the canonical procedure, not a second tracker here.

At start, identify the requested mode and bounded task. Inspect Git and applicable instructions. Change work uses its own worktree and one contemporaneous [session record](../../../docs/_templates/session-record.md); review and status questions do not authorize record edits. Product-specific work also uses the relevant skill in the [workflow map](../../../docs/10-execution/operating-workflows.md).

At handoff, update the canonical owners actually affected, then your record with exact changed_paths, checks, unrun gaps and next action. Route unresolved issues through separate linked messages only when useful. Regenerate the derived snapshot and run the maintenance commands in the guide. A green check establishes structural consistency, not truthful research, design acceptance or product readiness.

Follow [Git publication and integration](../../../docs/10-execution/git-workflow.md). A task-branch push is not a main merge, and a GitHub merge is not a local vault update. Completed documentation-only tasks have Simon's standing authority to create the scoped PR, wait for required checks, merge normally to `main`, and safely synchronize the primary vault; mixed/code tasks retain their own integration boundary. After integration, run the read-only vault check against the exact merge commit and actual primary checkout. Report an out-of-date or dirty overlapping target; never fix it by copying notes, stashing, resetting or overwriting user work.

No plugin, scheduler, cross-worktree synchronization or live agent messaging is implied. Do not touch private Obsidian configuration. Neither this skill nor a board message grants new external authority.
