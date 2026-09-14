---
title: "Session record template"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [template]
related:
  - ../10-execution/cockpit-guide.md
---

# Session record template

Copy to docs/10-execution/sessions/DATE-topic-unique.md. Replace this frontmatter with standard metadata plus:

```yaml
record_type: session
session_state: active
record_basis: contemporaneous
agent: actual session author
branch: inspected-task-branch
next_action: precise handoff
changed_paths:
  - exact/repository-relative/path
```

Do not invent a commit before one exists. Add artifact_commit only for an inspected existing commit (full hash); otherwise branch/file history locates this record's delivery.

At handoff list every scoped changed path except this record and generated cockpit snapshot. Paths are not globs; deleted paths still count. Run the guide's handoff check. Keep exact validation and integration evidence in the sections below, not just a passing status label.

## Scope and authority

Exact request, task/PRD links, allowed work and exclusions.

## What changed

Real artifact links, result and limitations.

## Evidence

Exact command/result, evidence type, unrun checks and reviewer identity.

## Handoff

Current blocker/review, branch/push/integration facts with checked date, next bounded action. Do not claim completion of adjacent product tasks.
