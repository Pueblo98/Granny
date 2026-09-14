---
title: "Granny — Stage 1 stock-Android app"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [navigation]
related:
  - docs/README.md
  - docs/10-execution/development-readiness.md
  - AGENTS.md
---

# Granny

## Try the browser design prototype

From this checkout, run:

```bash
node prototypes/stage-1/serve.mjs
```

Open **http://127.0.0.1:4173** on the same computer. No dependencies need installing. This is a clickable, fictional-data design sandbox for the five MVP workflows, not the Android app. Nothing records or sends. [Run, review and test instructions](prototypes/stage-1/README.md); [design handoff and remaining gaps](docs/02-design/browser-prototype.md).

Granny is a temporary project codename for an AI-first computer experience for older adults. The thesis: **the user should not need to learn to operate the computer; the computer should learn to operate itself for the user.**

Only **Stage 1, an installable stock-Android tablet app**, is active. Stage 2 OS/AOSP and Stage 3 custom hardware are dormant vision context. No final public name, visual identity, vendor, launch market/date or price is accepted.

## Start in two minutes

Read the [documentation map](docs/README.md) → [current milestone](docs/10-execution/current-milestone.md) → [development-readiness gates](docs/10-execution/development-readiness.md). Agents also follow [AGENTS.md](AGENTS.md).

The Stage 1 specification package is written: [PRD](docs/01-product/prd.md), [product design](docs/02-design/product-design-spec.md), [agent contracts](docs/03-agent/tool-contracts.md), [system architecture](ARCHITECTURE.md), [action/privacy policy](docs/05-safety-privacy/action-policy.md), [evals](docs/06-evals/canonical-tasks.md) and [traceability](docs/01-product/traceability.md). These are proposals and unrun test specifications, not a built product.

Accepted experiment scope ([ADR-0009](docs/09-decisions/ADR-0009-mvp-and-control-posture.md)): family photos, screen explanation/recovery, exact message draft/confirmation, requested media and Granny text adjustment. Final release feasibility and detailed requirements remain evidence-gated/proposed. V1 proposes validated calls/reminders/selected documents, explicit facts and optional helper configuration proposals. At least two useful external delegated workflows must be verified to support the thesis. [Android policy/feasibility](docs/08-research/android-stage-1-feasibility.md) constrains how: a broad dynamic AccessibilityService public assistant is not a viable Play assumption.

## Review and next work

Change sessions use an isolated task worktree, validate and commit scoped work, then push and verify the GitHub branch under Simon's standing authorization. Read the [Git delivery workflow](docs/10-execution/git-workflow.md); main merges remain separately authorized. The workflow was integrated into main at ce3f32f; start new independent tasks from current origin/main.

[Delivery workflows and four repository skills](docs/10-execution/operating-workflows.md) explain how to refine specs, prepare design, implement bounded slices and review evidence. [First task packets](docs/10-execution/task-packets.md) give concrete inputs, outputs, adverse cases and stop boundaries for T-101/102/103/108. No global skills/plugins, scheduled jobs or external workflows are installed.

[Brand territories](docs/02-design/brand-and-visual-identity.md), [81-name exploration](docs/02-design/naming-exploration.md) and [local static identity boards](docs/02-design/identity-review.html) provide concrete choices. Open Day is the proposed visual direction; Daykind, Handspan and Clearfold are uncleared naming finalists. A partial Figma file exists but is paused. The [browser prototype](docs/02-design/browser-prototype.md) is now the active interaction artifact; final identity is still undecided.

[Backlog T-103](docs/10-execution/backlog.md#t-103) is the first safe agent-contract coding slice: offline fake-adapter confirmation/cancel/verify replay, no device permission or personal data. Reference inventory and route evidence T-101 can proceed independently with device access. MVP implementation and a real-user pilot remain gated. The browser prototype is design-only code; no production Android app, agent runtime or backend is implemented.

## Repository and Obsidian

Open **docs/** as the Obsidian vault; the whole repository remains the source of truth. No community plugin is required. Local docs/.obsidian JSON is ignored user state; do not rewrite or commit it. [Vault notes](docs/.obsidian/README.md) explain the boundary.

docs/ owns knowledge, preserved sources and decisions; design-tokens/ owns token handoff; existing android/, agent/, backend/ and evals/ directory notes are future implementation placeholders, not active code. hardware/ is dormant Stage 3 context. [Reference tablet](docs/07-hardware/reference-hardware.md) records supplied provenance; exact physical model/OS/app matrix is still unknown.

Documentation checks: `python3 scripts/validate-docs.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'` and `git diff --check`. The unit tests validate documentation tooling, not product behavior. No production build/test command exists yet. See the [validation record](docs/10-execution/development-readiness.md) for actual results and limitations.
