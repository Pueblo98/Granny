---
title: "Session lifecycle and automated cockpit maintenance"
status: review
owner: Simon
last_updated: 2026-09-14
tags: [execution, session, maintenance]
related:
  - ../cockpit-guide.md
  - ../backlog.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: chore/session-maintenance
next_action: Review the conversation-first design plan; PR 4 owns the final integration result.
changed_paths:
  - AGENTS.md
  - .agents/skills/granny-session-lifecycle/SKILL.md
  - .agents/skills/granny-session-lifecycle/agents/openai.yaml
  - .github/workflows/repository-maintenance.yml
  - scripts/check_handoff.py
  - scripts/check_vault.py
  - scripts/test_session_checks.py
  - docs/README.md
  - docs/_templates/session-record.md
  - docs/10-execution/cockpit-guide.md
  - docs/10-execution/operating-workflows.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/backlog.md
  - docs/10-execution/git-workflow.md
---

# Session maintenance handoff

## Scope and authority

Simon approved the recommended lifecycle skill, automated PR maintenance checks, post-merge visibility check and fresh-session smoke test. [T-115](../backlog.md#t-115) is repository tooling, not product implementation. Skill Creator informed concise instruction-only routing and packaging; the task-slice workflow keeps this change bounded. No product behavior, design acceptance, participant evidence or Android capability changes.

## What changed

[Lifecycle skill](../../../.agents/skills/granny-session-lifecycle/SKILL.md), [CI](../../../.github/workflows/repository-maintenance.yml), [coverage checker](../../../scripts/check_handoff.py), [vault verifier](../../../scripts/check_vault.py) and [tests](../../../scripts/test_session_checks.py). [Guide](../cockpit-guide.md) owns the maintenance contract; AGENTS/navigation/template route to it. Stale pre-PR-3 startup wording was corrected while historical evidence remains labeled.

## Evidence

Local checks on 2026-09-14: `python3 scripts/validate-docs.py` exited 0 with zero errors (96 Markdown documents, five skills, 1,635 local links, four preserved source hashes); `python3 scripts/cockpit.py --check` exited 0 with eight records, 12 nodes/three edges and three Base views; the lifecycle skill passed Skill Creator's `quick_validate.py` with exit 0. `python3 -m unittest discover -s scripts -p 'test_*.py'` passed all 46 tests, including deleted-record migration; the invalid-ref negative test deliberately exercises Git's error path. `python3 scripts/check_handoff.py --base origin/main` and `git diff --check` exited 0. These are repository-tooling checks, not Android/user evidence.

The independent follow-up re-read confirmed that old-branch and dirty-checkout ambiguities were resolved. It found one remaining generic backlog instruction that could be read as requiring coding during review; that sentence now explicitly applies only to implementation sessions. This final wording correction was root-reviewed, not a new independent full-session run.

Fresh-context read-only smoke test: an independent agent with no conversation history was asked what to work on next, how to record build work and how to verify normal-vault visibility. It followed AGENTS to the lifecycle skill, selected the conversation-first plan for review rather than implementation, identified separate T-103 authority, explained changed_paths and checks, and correctly distinguished publication/integration/local visibility. It made no edits or external calls. It identified old Git-workflow startup advice; that advice was corrected, and dirty-checkout integration now requires explicit update authority, proven nonoverlap and preservation checks. This demonstrates repository navigation and one realistic behavior scenario, not automatic Codex host discovery or a guarantee of future compliance.

The actual primary-vault verifier against PR #3's 70af0db returned `NEEDS REVIEW`: expected ancestry and local origin/main matched, but Simon's Canvas layout is modified. The fresh-context reviewer also confirmed this task's session record is absent from the primary vault before integration. No file was repaired or discarded to make this check green. Obsidian rendering remains human evidence.

PR #3 is merged at 70af0db; this task starts there in an isolated worktree. Initial GitHub inspection on 2026-09-14 found main unprotected and no repository rulesets. Simon subsequently explicitly approved this task's PR/merge after passing checks, primary-checkout update, and making the maintenance check required while preserving existing rules.

## Live CI and enforcement — 2026-09-14

[PR #4](https://github.com/Pueblo98/Granny/pull/4) integrates this task. Its [first GitHub Actions run](https://github.com/Pueblo98/Granny/actions/runs/34896799161) passed all maintenance steps on head 6e1e278db9954e2f827d667e298efcf4bfad1f5a; GitGuardian also passed. Local validation was repeated: 46 tooling tests, zero documentation errors, fresh cockpit, handoff coverage and whitespace checks all passed. This evidence update triggers another CI run; the merge must use the latest passing head, not rely on the earlier run alone.

GitHub protection was enabled and read back through the API: main requires `Repository maintenance`, bound to GitHub Actions app 15368; strict up-to-date checks and administrator enforcement are enabled; force pushes and branch deletion are disallowed. There were no existing protections/rulesets to replace. No reviewer-count rule or bypass was added. The first API attempt rejected an incompatible contexts-plus-checks payload (422, no mutation); the checks-only retry succeeded and GET confirmed the exact setting. Live settings can later change; re-inspect before relying on them.

The tooling task is complete; PR #4 is the authoritative merge-state/commit record. At this pre-merge checkpoint, local vault synchronization is still to be performed after the final checks and authorized merge. This record does not manufacture a future merge hash or claim that filesystem checks prove Obsidian rendering.

## Handoff

Worktree: /home/lgtw/Work/granny-worktrees/session-maintenance; branch chore/session-maintenance; base 70af0dbffaad52c259b173ccad4d72f722521fe5. Initial publication was verified at remote SHA 6e1e278db9954e2f827d667e298efcf4bfad1f5a; this evidence follow-up is located through file/PR history. Primary checkout contains user edits to action-policy.md and Development.canvas; private Obsidian JSON also remains outside this task. Preserve them and the separate UI-skills/Figma worktrees. No global skill/plugin installation or automatic synchronization is introduced. Product work next remains review of the conversation-first plan, not another documentation-expansion pass.
