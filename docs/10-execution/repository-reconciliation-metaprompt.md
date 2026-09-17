---
title: "Metaprompt — reconcile Granny branches, PRs and primary vault"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, git, prompt]
related:
  - git-workflow.md
  - cockpit-guide.md
  - sessions/2026-09-17-repository-reconciliation.md
---

# Repository reconciliation metaprompt

Use this prompt when the Granny repository has accumulated task branches, open pull requests or a stale primary Obsidian checkout. It authorizes review and reconciliation only when Simon's current instruction also authorizes the required PR merges or closures.

> Reconcile the Granny repository before starting product or documentation changes.
>
> Read `AGENTS.md`, `docs/10-execution/git-workflow.md`, the session-lifecycle skill, current milestone, readiness, agent board and open questions. Fetch the verified `Pueblo98/Granny` origin. Inspect the primary checkout status, every remote branch not contained in `origin/main`, every open PR, worktree registrations, ancestry, unique commits, changed paths, checks, session handoffs and canonical status claims.
>
> Preserve all dirty or untracked primary-checkout work. Do not stash, reset, clean, copy over, force-push or rewrite published history. Work in a new branch and isolated worktree from freshly fetched `origin/main`.
>
> Classify each outstanding branch or PR as: already integrated; current work to integrate; superseded by a named branch/commit; intentionally preserved historical work; or blocked pending a product/authority decision. Do not merge branches merely because they exist. Prefer the newest consolidated branch when it contains both histories and validated follow-up work. Keep intentionally paused Figma history and failed/superseded experiments available without importing stale implementations into main.
>
> Merge each approved, non-superseded branch into the integration branch without rewriting history. Resolve conflicts by preserving current canonical product/runtime state and adding only the other branch's still-valid scoped material. Preserve stable IDs; if two branches independently used the same ID, keep the integrated canonical meaning and assign a new unused ID to the other task. Regenerate derived cockpit artifacts rather than hand-editing their content.
>
> Run repository documentation validation, documentation-tool tests, cockpit freshness, handoff coverage and whitespace checks. Run all executable tests affected by the integrated branches, including loopback/browser/MCP checks with their documented dependencies and sandbox permissions. Record missing dependencies as environment gaps; restore only already authorized lockfile-pinned dependencies. Do not weaken tests or product constraints to obtain a pass.
>
> Publish the integration branch, verify the remote SHA, create a reviewable PR, and merge only under current explicit authority with required checks satisfied. Close superseded PRs with a concise pointer to the replacement merge; do not delete their branches unless separately authorized. Fetch after integration and verify `origin/main` contains the merge.
>
> Finally run the read-only primary-vault visibility check against the exact merge commit and delivered paths. If the primary checkout is dirty or stale, report it and stop; do not update it by stashing, copying or overwriting user work. Hand off the exact merged SHA, branch/PR disposition, checks, preserved branches, dirty primary paths and next bounded task.

This metaprompt does not itself authorize merges, PR closure, branch deletion, dependency installation, product changes or primary-checkout mutation. Current user authority and the Git workflow still govern those actions.
