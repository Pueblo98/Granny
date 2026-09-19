---
title: "Git worktrees, publication and review workflow"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, git, workflow]
related:
  - ../../AGENTS.md
  - operating-workflows.md
  - current-milestone.md
  - development-readiness.md
---

# Git delivery workflow

This is the canonical owner for task isolation, commits, GitHub publication and integration. Product readiness and external product actions remain governed by their existing gates.

## Authority and scope

### Mockup-only local work — 2026-09-19

Simon explicitly directed: “from now on since we will only be working on mockups only work in main / the root folder no need for a bunch of github stuff”. For this mockup-only phase, edit the primary checkout directly on main, keep assets and gallery notes in the existing docs vault, and preserve unrelated user edits. New worktrees, task branches, commits, pushes and GitHub PR/merge steps are not required for these local iterations. Finish with actual saved artifact paths and validation, not a fabricated publication claim. This overrides the isolation/publication defaults below only for mockups and their necessary filing/handoff documentation; executable app work and other change classes retain their usual authority boundaries.

### General change workflow

**Confirmed direction, Simon, 2026-09-14:** push completed work to the existing GitHub repository and make future change sessions use worktrees and push their work. This is standing authorization for ordinary, non-force task-branch pushes to **Pueblo98/Granny**, unless a later instruction says local-only or narrows that authority.

**Confirmed documentation integration direction, Simon, 2026-09-17:** completed documentation-only changes should be written through to `main`, rather than left only on a task branch. For the bounded documentation-only class below, standing authority includes creating the scoped PR, waiting for required checks, merging it normally into `main`, fetching, and safely fast-forwarding the primary checkout so `docs/` becomes visible in the Obsidian vault. No repeated integration confirmation is needed.

- Review/explanation requests remain read-only: no manufactured edits, commits or pushes.
- Change requests include validation, scoped commits and verified task-branch publication before handoff. Do not repeatedly ask Simon whether to push; request sandbox/network approval when the tool requires it.
- Documentation-only standing integration covers changes whose reviewed tracked paths are limited to `docs/**`, repository instruction Markdown such as `AGENTS.md`/`CLAUDE.md`, and repository-skill Markdown/resources. It may include intentionally requested documentation review assets under `docs/`, but never private Obsidian state, secrets or unreviewed personal/research data.
- A task containing executable product/prototype code, scripts, workflows, dependency/lockfile changes, generated application assets or non-document configuration is mixed work and does not inherit documentation-only PR/merge authority. Use its explicit task authority.
- Standing documentation integration does not authorize force-pushes, direct main commits/pushes, releases, deployment, repository settings changes, dependency installation, Figma writes, participant/data uploads, unrelated PR merges or branch deletion.
- Use the existing origin only after confirming it resolves to Pueblo98/Granny. An unexpected remote, credential issue or visibility change needs investigation, not remote replacement or credentials in chat.
- Never publish secrets, signing material, personal research data, raw support logs, private Obsidian JSON or unrelated user work. Publication permission is not permission to expose sensitive files.

## Start: one task, one branch, one worktree

1. Inspect `git status --short --branch`, `git diff`, `git branch -vv`, `git worktree list` and `git remote -v`. Read effective instructions. Inventory user-owned changes; leave them in their original worktree. Do not auto-stash, reset, clean or copy them into the task.
2. Fetch origin. Normally choose current origin/main as base. For dependent work, explicitly name the unmerged parent branch/commit and dependency in the handoff. Do not use an outdated local main merely because it is convenient.
3. Use a dedicated worktree and short-lived feature/topic, fix/topic, docs/topic or chore/topic branch. A clean existing worktree dedicated to the same task is reusable; do not create one per tool call or split a single task unnecessarily. Reuse a host-created isolated worktree when suitable; attach detached work to a unique branch before committing/pushing.
4. Prefer a sibling directory outside the repository, for example `/home/lgtw/Work/granny-worktrees/docs-topic`. This is a local convention, not a portable required absolute path. Check the exact destination and branch are unused, and request filesystem approval if needed. Do not nest worktrees inside docs/ or share one mutable branch between sessions.
5. Run subsequent commands with the task worktree as working directory. Read its own AGENTS/skills; they may differ from the starting checkout. Parallel agents, when separately authorized, need distinct branches/worktrees for independent writes; worktree policy does not itself authorize delegation.

Example for a **new, independent** task after verifying the names and base:

```bash
git fetch origin
git worktree add -b docs/example-topic /home/lgtw/Work/granny-worktrees/docs-example-topic origin/main
```

Historical transition: readiness and Git-workflow history was integrated through PR #2, followed by browser/cockpit PR #3 (70af0db, 2026-09-14). Start independent tasks from freshly fetched origin/main. The separate partial-Figma branch remains preserved; inspect actual ancestry before claiming it integrated. Do not cherry-pick or duplicate already merged history.

Worktrees isolate checkout files and index, **not** shared refs/config, external accounts, device state or databases. Avoid concurrent branch mutation and global Git configuration. No host worktree settings are changed by this document. OpenAI's [worktree documentation](https://learn.chatgpt.com/docs/environments/git-worktrees), accessed 2026-09-14, describes independent chats and the one-branch-per-worktree restriction; the sibling layout above is our proposed convention, not a Codex requirement.

## Validate and commit

- Keep changes within the requested scope and update canonical owners/trace/gates when affected. Review the complete diff, including newly added files, and compare against the intended base.
- Run `python3 scripts/validate-docs.py`, relevant executable tests, and `git diff --check`. For this documentation package, also run `python3 -m unittest discover -s scripts -p 'test_*.py'`; validate changed skill packaging when applicable. Report missing dependencies instead of silently installing them. Runtime evidence is still separate.
- Stage explicit paths or reviewed hunks; do not use blanket add/commit-all in a shared or dirty checkout. Inspect `git diff --cached --stat`, `git diff --cached` and `git diff --cached --check` for private data, unrelated changes and whitespace before committing.
- Use focused imperative commits. Do not amend/rebase published history; use follow-up commits. Failed required checks prevent a completion claim; report blockers. A requested WIP checkpoint can be published only after scope/privacy review, clearly labeled incomplete with failing checks.
- No task changes means no empty commit or redundant push. Preserve unrelated dirty files and report them separately from the task's clean/published status.

## Push and verify before handoff

From the task worktree, replace the example with the inspected branch:

```bash
git push --set-upstream origin docs/example-topic
git rev-parse HEAD
git ls-remote --exit-code origin refs/heads/docs/example-topic
git status --short --branch
```

The remote branch SHA must equal the committed task HEAD. A local commit, an upstream label or a successful command launch alone is not proof of publication. Record commit, remote SHA and branch URL. If a network/authentication failure prevents verification, report **committed locally; publication blocked/unverified**, retain the worktree and give the precise next step. Retry transient errors in a bounded way; do not loop indefinitely, change remotes or bypass permissions. On non-fast-forward rejection, fetch and inspect divergence; preserve both histories and stop for coordination rather than force-push.

## Review, integration and cleanup

Publication is not integration. For mixed/code tasks, hand off a GitHub compare link and summary/check results; create or merge a PR only under that task's authority. For completed documentation-only tasks, inspect existing PRs, create/update only the scoped task PR with base/head, scope, linked requirements/tasks, checks, unrun evidence, risks and exclusions, and continue through required-check success and normal merge under the 2026-09-17 standing authority. Use a draft when documentation review is incomplete and do not merge until the requested artifact is complete.

Main is protected by **repository convention** until remote protection is actually configured and verified. [Maintenance CI](cockpit-guide.md#automated-maintenance-contract) supplies a workflow, not proof of required enforcement; [T-115 evidence](sessions/2026-09-14-session-maintenance.md) records the inspected state. No GitHub automatic-merge queue or release automation is installed. Merge only within current authority, after reviewing the exact diff and required checks. Prefer a non-rewriting normal merge: the validator references historical baseline ddaacf1, which must remain reachable in fresh clones. A squash requires deliberately replacing that baseline with an equivalent preserved reference and validating a fresh clone first.

After a documentation-only merge, fetch and update a clean main checkout fast-forward-only under the same standing authority. A dirty primary checkout is not permission to stash, reset or replace user files: compare incoming paths with dirty/untracked paths first. If all incoming paths are nonoverlapping, fast-forward while preserving local edits and verify their before/after hashes. If any overlap or uncertainty exists, remote `main` remains the integrated source of truth but local vault synchronization is blocked: leave the primary untouched, report exact overlapping paths and retry only after that work is committed/moved by its owner. Never copy the merged notes into the dirty checkout as a substitute. Run the [read-only vault check](cockpit-guide.md#verify-post-merge-vault-visibility) against the merge SHA and delivered paths; report user-modified artifacts for manual review rather than resetting them to obtain a pass.

Remove an exact task worktree only after confirming no tracked, untracked or ignored valuable local state, no live session using it, and merged/preserved history; obtain cleanup authority. Use `git worktree remove` without force, not recursive filesystem deletion. Delete branches with safe Git checks only when authorized; never delete remote branches implicitly. Report what was removed and where its commits remain recoverable.

## Required finish evidence

Handoff names: worktree path; task branch and base/dependency; scoped commits; exact validation results and unrun gaps; remote branch URL and matching SHA (or explicit blocker); remaining user changes; PR/integration status; next bounded action. Agents reading this revision must follow this workflow. Older checkouts do not acquire new rules until synchronized with a branch containing them; Markdown policy is not a technical guarantee of every future agent's behavior.
