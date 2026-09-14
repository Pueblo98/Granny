---
title: "Cockpit ownership, refresh and session handoffs"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [execution, cockpit, workflow]
related:
  - ../Cockpit.md
  - agent-board.md
  - operating-workflows.md
  - git-workflow.md
  - obsidian-cockpit-plugins.md
---

# Using the development cockpit

## Open and arrange

The vault is the repository's **docs/** directory. Open [Cockpit](../Cockpit.md) for the reading dashboard, or [Development.canvas](../Development.canvas) for a spatial cockpit. Bases, Canvas and Bookmarks were already enabled in Simon's existing vault on 2026-09-14; Workspaces was disabled. No private configuration was changed.

Suggested layout: Cockpit in the main pane, [agent board](agent-board.md) on the right, local graph/backlinks in the sidebar. Bookmark Cockpit. Optionally enable the built-in Workspaces plugin yourself and save this arrangement as “Granny cockpit”. [Plugin assessment and instructions](obsidian-cockpit-plugins.md) explains the tradeoffs.

This task is based on browser commit ff59e842920260724f787e2a3c8cafbea861b6d5, not current main. The original vault checkout will not show these new files until reviewed integration. Do not copy a second dashboard into it, overwrite dirty files, auto-merge, or open the whole repository as a vault. For pre-merge review, inspect this worktree's docs/ as a temporary view of the same Git-backed knowledge base; local app configuration remains private and optional. After integration use the normal docs/ vault.

## One owner per fact

| Information | Owner | Cockpit behavior |
|---|---|---|
| Product stage/scope | Accepted ADRs and PRD | Links and explicitly labeled overview |
| Task status/dependencies | backlog.md | Generated table, never independent draggable task status |
| Gate status/authority | development-readiness.md | Generated exact status, no invented percentage |
| Session contribution | One Markdown record under sessions/ | Live Bases view + generated fallback |
| Agent question/handoff/issue | One Markdown message under messages/ | Live inbox + generated fallback |
| Decisions | open-questions.md and ADRs | Board routes requests; cannot confer approval |
| Git delivery/integration | Actual commits/refs and checks | Recorded evidence plus read-only current-ref report |
| Visual composition | Development.canvas and Cockpit.md | Navigation/embeds, not new product truth |

**Built ≠ checked ≠ accepted ≠ pushed ≠ merged ≠ device-validated.** The prototype passed mock tests and Simon still rejected its interaction direction. Both facts remain visible.

## Session contract for future change tasks

1. Read Cockpit, current milestone, canonical task and open messages. Inspect Git as usual.
2. On an authorized change task create one session file using [the template](../_templates/session-record.md). Use a unique date/topic/suffix filename, such as the current record. Set `session_state: active`, `record_basis: contemporaneous`, named scope, branch, evidence and next action. A timestamp is a reported checkpoint, not a heartbeat.
3. Only edit your own session record and in-scope canonical owners. Do not write in another live worktree or overwrite another session's index.
4. At handoff record outputs, actual checks, gaps, commit/branch links, review needs and next step. `review` means the artifact awaits review; `complete` means the requested bounded session ended, not a product gate. `revision-requested` records rejection without erasing prior delivery.
5. Create a message when another session/Simon must act. Link the session, canonical task and evidence. Never paste secrets, personal content or raw tool transcripts.
6. Regenerate the snapshot; run its consistency checks, documentation checks and relevant tests. Commit scoped files and push under the standing Git policy. Verify remote SHA in the final handoff; a record's own commit can be found through its file history without a circular self-hash update.
7. Review-only sessions remain read-only unless Simon requests a written record. No board instruction silently broadens authority.

Record fields: `record_type: session`; `session_state` = active/review/complete/blocked/revision-requested; `record_basis` = contemporaneous/reconstructed; `agent` is the actual author label, not an invented staffed role; `branch`; optional `artifact_commit` for an already-existing commit; `next_action`; standard editorial frontmatter. Historical deliveries reconstructed from Git must say session boundaries/timing were not reconstructed.

## Refresh and check

From the task worktree root:

```bash
python3 scripts/cockpit.py --write
python3 scripts/cockpit.py --check
python3 scripts/cockpit.py --git-status
python3 scripts/validate-docs.py
python3 -m unittest discover -s scripts -p 'test_*.py'
git diff --check
```

The generator mechanically rewrites **only** cockpit-snapshot.md, deriving content from backlog/readiness and session/message records. It does not read .obsidian, chat logs, credentials or network services. `--check` fails on stale output or malformed cockpit assets. `--git-status` is read-only and reports recorded commits against locally fetched origin/main and each task branch; it does not fetch, push or merge. Fetch only under the existing Git workflow before claiming current remote state. Missing refs are unknown, not merged.

Bases indexes property changes without regeneration. Plain Markdown snapshot refresh is explicit, not background automation; no scheduler/hook is installed. A source fingerprint makes stale snapshots detectable by the check, not by merely opening the note. GitHub issues/CI are not synchronized. The canonical backlog remains the work tracker.

## Agent board and concurrent work

See [board rules](agent-board.md). This is a durable asynchronous bulletin board, not IPC or a hosted chat. A posted message does not wake an agent. An active agent receives tool messages only when that environment actually supplies them; none are configured here.

Each sender creates its own message file with unique ID; replies are separate files with `in_reply_to`. Check unresolved messages at start and checkpoint. If a branch is unmerged, share the branch/path through the actual session channel; others may read the exact worktree/ref after inspection, not edit it. The main vault sees merged records only. Avoid a shared append-only mega-file that creates merge conflicts.

## Limits and rollback

No installed plugin, private state edits, automatic Git operations, live agent supervision or product code changes. Structural checks do not establish Obsidian rendering or usability. Human in-app review remains explicit. The cockpit is removable without losing canonical tasks/gates; preserve session/message records as history if changing its visual layout.
