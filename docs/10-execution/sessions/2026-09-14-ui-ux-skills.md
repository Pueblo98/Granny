---
title: "Session — install reviewed UI/UX skills"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [execution, session, skills, design]
related:
  - ../ui-ux-skills.md
  - ../backlog.md
  - ../../02-design/conversation-first-plan.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: chore/ui-ux-skills
next_action: "Review the published skill package and integrate the task branch only if accepted"
---

# Install reviewed UI/UX skills

## Scope and authority

Simon explicitly requested downloading and setting up the recommended UI/UX skills. T-115 installs reviewed repository-local guidance only. It does not authorize global Codex changes, an Android project/dependencies, browser redesign implementation, Figma mutation, product acceptance, device testing or a main merge.

The task starts from `origin/main` commit `70af0dbffaad52c259b173ccad4d72f722521fe5` in `/tmp/granny-ui-skills.SrLzMi`. Existing user edits to `docs/05-safety-privacy/action-policy.md` and `docs/Development.canvas` remain in the original checkout and are excluded.

## What changed

- Downloaded Impeccable, mobile-design and three official Android skill candidates to temporary storage and recorded exact upstream HEADs.
- Added the original [granny-ui-craft](../../../.agents/skills/granny-ui-craft/SKILL.md) skill, focused on structural variation, conversation-first hierarchy, accessibility, critique and hardening without upstream executables or duplicate knowledge stores.
- Vendored Google's `adaptive`, `edge-to-edge` and `testing-setup` packages with referenced documentation/licenses, adding explicit local authority guardrails and discovery metadata.
- Added [setup/provenance and update rules](../ui-ux-skills.md) and routed the design workflow through the new craft layer.

## Evidence

The skill-creator packaging validator passed for all five changed entrypoints. Repository validation passed with eight skills and 16 bundled reference manuals checked; all 28 documentation-tool tests passed; `git diff --check` passed. The official Android packages contain Markdown guidance, YAML discovery metadata and the Apache-2.0 license only; no upstream executable, hook or binary was admitted. Cockpit refresh/check and final scoped Git review are part of the closing pass.

No browser, Android, device, TalkBack, Figma or participant eval was run. Fresh-session automatic triggering remains unproven until a new session uses the installed files.

## Handoff

The requested repository-local setup is complete for review. The final handoff must report the task commit, matching remote SHA and branch URL after publication. Main integration remains a separate review action.
