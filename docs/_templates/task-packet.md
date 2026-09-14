---
title: "Bounded work packet template"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [template]
related:
  - ../10-execution/task-packets.md
  - ../10-execution/development-readiness.md
---

# Work packet — existing T-ID

Copy only for a task that needs a durable execution packet. Set actual metadata/related paths and remove these prompts. Backlog owns status; packet owns execution detail, not duplicated behavior.

## Requested mode and outcome

Prepare, review or implement; user-visible outcome; PRD/UC/J and release/build mode. Identify current authority, proposed assumptions and exact exclusions. Link task, interface/SCR/CMP, action/privacy/access policy and owning EVALs.

## Entry and boundary

Apply canonical Definition of Ready by reference. List available environment/tools and missing evidence. Distinguish no-device fake work from device/cloud/participant/external-design work. Name dependencies, sensitive-data boundary and rollback.

## Fixture and procedure

Controlled initial state; private-data classification; expected value and independent observed-effect oracle; bounded units; happy/negative/Stop/restart variants; exact success/no-effect/partial/unknown behavior. Numeric bounds come from their canonical owner, not copied guesses.

## Evidence and handoff

Actual commands/results only after execution; unrun cases and reason; real artifact references after creation; affected docs/trace/gates; reviewer and authority needed. Complete only this task; one next bounded action. For change work, include worktree, base, commit, remote branch and matching SHA under the [Git workflow](../10-execution/git-workflow.md), or report publication blocked. No automatic installation, main merge, product publication or adjacent task.
