---
title: "Session — install reviewed UI/UX skills"
status: proposed
owner: Simon
last_updated: 2026-09-17
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
changed_paths:
  - .agents/skills/adaptive/LICENSE.txt
  - .agents/skills/adaptive/SKILL.md
  - .agents/skills/adaptive/agents/openai.yaml
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/flexbox/container-behavior.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/flexbox/get-started.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/flexbox/index.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/flexbox/item-behavior.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/grid/container-properties.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/grid/get-started.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/grid/index.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/grid/item-properties.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/layouts/adaptive/mediaquery/index.md
  - .agents/skills/adaptive/references/android/develop/ui/compose/tooling/debug.md
  - .agents/skills/adaptive/references/android/guide/navigation/navigation-3/recipes/material-listdetail.md
  - .agents/skills/edge-to-edge/LICENSE.txt
  - .agents/skills/edge-to-edge/SKILL.md
  - .agents/skills/edge-to-edge/agents/openai.yaml
  - .agents/skills/granny-design-handoff/SKILL.md
  - .agents/skills/granny-ui-craft/SKILL.md
  - .agents/skills/granny-ui-craft/agents/openai.yaml
  - .agents/skills/granny-ui-craft/references/critique-and-hardening.md
  - .agents/skills/granny-ui-craft/references/direction-and-variation.md
  - .agents/skills/testing-setup/LICENSE.txt
  - .agents/skills/testing-setup/SKILL.md
  - .agents/skills/testing-setup/agents/openai.yaml
  - .agents/skills/testing-setup/references/android/develop/ui/compose/testing/common-patterns.md
  - .agents/skills/testing-setup/references/android/studio/preview/compose-screenshot-testing.md
  - .agents/skills/testing-setup/references/android/training/dependency-injection/hilt-testing.md
  - AGENTS.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/operating-workflows.md
  - docs/10-execution/ui-ux-skills.md
  - docs/README.md
  - scripts/doc_checks.py
  - scripts/test_doc_checks.py
  - scripts/validate-docs.py
---

# Install reviewed UI/UX skills

## Scope and authority

Simon explicitly requested downloading and setting up the recommended UI/UX skills. T-118 installs reviewed repository-local guidance only. It does not authorize global Codex changes, an Android project/dependencies, browser redesign implementation, Figma mutation, product acceptance, device testing or a main merge.

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
