---
title: "Cockpit ownership, refresh and session handoffs"
status: proposed
owner: Simon
last_updated: 2026-09-15
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

The browser and cockpit were integrated through [PR #3](https://github.com/Pueblo98/Granny/pull/3), merge 70af0dbffaad52c259b173ccad4d72f722521fe5, on 2026-09-14. The primary checkout was fast-forwarded and switched to main with existing user edits preserved. Use its normal docs/ vault. Later task branches remain invisible there until separately reviewed integration and local synchronization; do not copy notes between worktrees or create a second knowledge store.

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

New handoffs also list `changed_paths`: exact repository-relative paths covered by that session (including deletions), without globs. The record itself and generated snapshot are implicitly covered. Several changed records may jointly cover a PR. Historical records need no retroactive migration. A final record must not remain `active`; use `review`, `complete`, `blocked` or `revision-requested` honestly.

## Refresh and check

Editorial dates use **Europe/Madrid**, Simon's working time zone. CI sets this same time zone so a local edit after midnight is not falsely rejected while the UTC runner is still on the previous day. Future-date validation remains strict; this is not a grace period or a check bypass. Run local maintenance in that time zone when working elsewhere.

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

Bases indexes property changes without regeneration. Plain Markdown snapshot refresh is explicit, not background automation; no scheduler/hook is installed. A source fingerprint makes stale snapshots detectable by the check, not by merely opening the note. The PR workflow checks consistency but does not synchronize GitHub issues or CI results into the vault. The canonical backlog remains the work tracker.

## Automated maintenance contract

[Session lifecycle skill](../../.agents/skills/granny-session-lifecycle/SKILL.md) routes new sessions here. [Repository maintenance workflow](../../.github/workflows/repository-maintenance.yml) runs docs validation, cockpit freshness, tooling tests and [handoff coverage](../../scripts/check_handoff.py) on every PR and push to main. It has read-only repository permissions, no secrets, immutable action references and full history for the existing source baseline. It installs pinned PyYAML only in its disposable runner; no local installation or background task is implied.

Before committing, after a separately authorized fetch:

```bash
python3 scripts/check_handoff.py --base origin/main
```

This includes staged, unstaged and untracked nonignored files. After committing, repeat with `--head HEAD`. CI uses the event's base SHA and checked-out commit, not mutable branch text or executable PR descriptions. The comparison starts at merge-base, so unrelated work added to main does not need a new handoff. All changed nongenerated paths need coverage by records changed in the same PR. This prevents omission, not dishonesty: a reviewer must still verify scope, meaningful evidence and canonical updates. Proposed changes to check scripts/workflows themselves require particular scrutiny.

**Small-change exemption:** only README.md and/or docs/README.md, at most 20 total added/deleted lines, may omit a session record when a commit in the change range contains `Handoff-Exempt: meaningful reason` (at least ten characters). Use only for spelling/navigation corrections, not changed product or operating rules. The check verifies paths/size/reason, while human review verifies triviality. Code, policies, workflow/skill changes and all other docs require a record. A failed check is fixed or transparently reviewed, never disabled just to merge.

An existing workflow is not a required merge gate until GitHub branch protection is configured and read back. GitHub permits required status checks; see [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches). The chosen [PR event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request) tests the PR merge reference and avoids privileged pull_request_target execution. Sources: GitHub, accessed 2026-09-14; these establish platform behavior, not proof this repository is protected. Require the exact job name `Repository maintenance` only after a successful live run, preserving existing rules and obtaining current authority for settings changes. Record actual remote configuration in the session handoff.

## Verify post-merge vault visibility

After an authorized merge and safe fast-forward of the primary checkout, run from a worktree containing the script, substituting the inspected merge SHA:

```bash
python3 scripts/check_vault.py --checkout /home/lgtw/Work/granny --expected-commit MERGE_SHA --path docs/10-execution/cockpit-guide.md
```

[The verifier](../../scripts/check_vault.py) requires the expected repository origin, main branch, HEAD equal to locally fetched origin/main, ancestry containing the expected merge, and tracked dashboard artifacts plus explicit delivered paths. It does not fetch, switch, pull, stash, copy files, read private .obsidian files, or write anything. Ref freshness needs a separate fetch. Missing refs/files, altered target artifacts, unexpected checkout or divergence fail closed. Unrelated dirty files are permitted and preserved. A user-edited Canvas yields `NEEDS REVIEW`, not permission to discard their layout; inspect it and report merged ancestry separately. Passing filesystem checks does not prove Obsidian rendered or selected the right vault. Ask Simon to open Cockpit if in-app visibility remains uncertain.

## Fresh-session acceptance and maintenance owner

Simon owns workflow direction; each change session owns its handoff and scope. When lifecycle instructions or checks change, validate packaging plus the regression suite and repeat a fresh-context read-only scenario: a new session should find the current task, distinguish review from implementation, locate handoff/check commands, preserve dirty/private state and distinguish pushed/merged/vault-visible. Record inputs, observed behavior and limits in that task's session record. Do not equate reading an explicit skill path with host auto-discovery; test discovery in a new Codex session separately if it is absent. The [official skill guide](https://learn.chatgpt.com/docs/build-skills) documents repository-local skills (OpenAI, accessed 2026-09-14); another host can follow AGENTS and the linked file manually.

## Agent board and concurrent work

See [board rules](agent-board.md). This is a durable asynchronous bulletin board, not IPC or a hosted chat. A posted message does not wake an agent. An active agent receives tool messages only when that environment actually supplies them; none are configured here.

Each sender creates its own message file with unique ID; replies are separate files with `in_reply_to`. Check unresolved messages at start and checkpoint. If a branch is unmerged, share the branch/path through the actual session channel; others may read the exact worktree/ref after inspection, not edit it. The main vault sees merged records only. Avoid a shared append-only mega-file that creates merge conflicts.

## Limits and rollback

No installed plugin, private state edits, automatic Git operations, live agent supervision or product code changes. Structural checks do not establish Obsidian rendering or usability. Human in-app review remains explicit. The cockpit is removable without losing canonical tasks/gates; preserve session/message records as history if changing its visual layout.
