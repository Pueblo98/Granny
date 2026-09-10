---
title: Granny Project
status: draft
owner: Simon
last_updated: 2026-09-10
tags:
  - project
  - navigation
related:
  - docs/README.md
  - docs/00-vision/product-vision.md
  - docs/10-execution/current-milestone.md
---

# Granny

Granny is an AI-first personal computer for older adults that can talk, remember, understand the screen, and operate the device on the user's behalf.

> The user should not need to learn how to operate the computer. The computer should learn how to operate itself for the user.

The project is currently in product definition, experience design, and documentation foundation. It is not yet in substantial product implementation.

## Start here

- [Documentation map](docs/README.md) — the canonical knowledge-base index.
- [Product vision](docs/00-vision/product-vision.md) — what Granny is and the boundaries between Vision, V1, and MVP.
- [Product requirements](docs/01-product/prd.md) — known requirements and unresolved product choices.
- [Agent behavior](docs/03-agent/agent-behavior.md) — the intended agent loop and behavioral contract.
- [Safety and privacy](docs/05-safety-privacy/safety-and-privacy.md) — current boundaries for trust, consent, and family access.
- [Conceptual architecture](ARCHITECTURE.md) — the proposed system boundaries.
- [Current milestone](docs/10-execution/current-milestone.md) and [backlog](docs/10-execution/backlog.md) — what to do now and next.
- [Agent instructions](AGENTS.md) — mandatory working rules for coding agents.

## Use this repository as an Obsidian vault

Open this repository's root directory in Obsidian: `/home/lgtw/Work/granny`. The Markdown remains portable and uses relative standard links. No community plugins are required. Recommended built-in features are backlinks, outgoing links, properties, templates, search, and local graph. Set `docs/_templates` as the Templates folder if you want template insertion in the UI.

The repository is the single source of truth; Obsidian is a view over it, not a second notes store. Local layout/workspace state is ignored by Git. See [.obsidian/README.md](.obsidian/README.md).

## Repository layout

```text
docs/           Product knowledge base and source material
design-tokens/  Proposed cross-platform token schema; no final brand values
android/        Future Android client and senior shell
agent/          Future planner/runtime and model adapters
backend/        Future remote services
evals/          Future executable evaluation fixtures and harnesses
hardware/       Future industrial, electrical, and mechanical artifacts
```

The initial Android reference device is a used Samsung Galaxy Tab A11+, purchased for approximately $140. The exact model/region/specification still needs physical verification before device-dependent engineering.

## Current state

The current milestone is to establish enough product and design definition to begin Figma exploration and controlled technical feasibility work. Do not start an AOSP fork, select permanent infrastructure vendors, or represent proposed visual values as approved.
