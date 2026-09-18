---
title: "Authorize documentation integration to main"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, session, git, documentation]
related:
  - ../git-workflow.md
  - ../cockpit-guide.md
  - ../../../AGENTS.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex documentation-integration policy session
branch: docs/main-integration-policy-2026-09-17
next_action: Apply the standing documentation-only PR/merge/vault workflow to future completed documentation tasks; leave mixed/code integration separately authorized.
changed_paths:
  - AGENTS.md
  - .agents/skills/granny-session-lifecycle/SKILL.md
  - .agents/skills/granny-spec-change/SKILL.md
  - docs/10-execution/git-workflow.md
  - docs/10-execution/cockpit-guide.md
  - docs/10-execution/operating-workflows.md
  - docs/README.md
---

# Authorize documentation integration to main

## Scope and authority

Simon asked on 2026-09-17 to update the rules so documentation is written to `main`, after observing that a merged handoff could be visible inconsistently while the primary vault had concurrent work. This session records standing documentation-only integration authority while retaining worktree isolation and dirty-work protection.

## What changed

Completed documentation-only change tasks now proceed through a scoped branch and PR, required checks, normal merge to remote `main`, and safe fast-forward of the primary checkout without repeated approval. Direct commits to `main` remain disallowed. Mixed executable/config/dependency changes retain their own integration authority. A dirty primary checkout can block local vault synchronization but not the already-reviewed remote-main merge; overlapping local work is preserved and reported, never stashed, reset or overwritten.

AGENTS, the canonical Git workflow, cockpit guidance, delivery workflow and lifecycle/spec skills now state the same rule. Review-only requests remain read-only, and the change does not authorize releases, dependencies, unrelated PRs, branch deletion, Figma writes or private vault changes.

## Evidence

Repository documentation validation, skill packaging, cockpit freshness, handoff coverage, documentation-tool tests and whitespace checks are run before publication. This is an operating-policy change, not product/runtime evidence.

## Handoff

Future documentation sessions should finish on `main` and attempt primary-vault synchronization. When incoming documentation overlaps dirty primary paths, report remote merge success plus the exact local blocker and wait for the owner of that work; do not manufacture visibility by copying files.
