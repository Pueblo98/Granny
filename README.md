---
title: Granny Project
status: draft
owner: Simon
last_updated: 2026-09-11
tags:
  - project
  - navigation
related:
  - docs/README.md
  - docs/00-vision/product-vision.md
  - docs/10-execution/current-milestone.md
  - docs/09-decisions/ADR-0007-three-stage-product-strategy.md
---

# Granny

Granny is an AI-first personal computer for older adults that can talk, remember, understand the screen, and operate the device on the user's behalf.

> The user should not need to learn how to operate the computer. The computer should learn how to operate itself for the user.

Granny is a three-stage project. **Only Stage 1 is active.** The current work is
product definition, research, experience design, safety, architecture, and
evaluation planning for the Android tablet app—not substantial implementation.

| Stage | Product | Status |
|---|---|---|
| 1 | Installable application for stock Android tablets | **Active and exclusive current scope** |
| 2 | Granny-controlled Android/AOSP operating system | Future; context only |
| 3 | Dedicated tablet plus voice dock/base hardware | Future; context only |

## Start here

- [Documentation map](docs/README.md) — the canonical knowledge-base index.
- [Product vision](docs/00-vision/product-vision.md) — what Granny is and the boundaries between Vision, V1, and MVP.
- [Product requirements](docs/01-product/prd.md) — known requirements and unresolved product choices.
- [Agent behavior](docs/03-agent/agent-behavior.md) — the intended agent loop and behavioral contract.
- [Safety and privacy](docs/05-safety-privacy/safety-and-privacy.md) — current boundaries for trust, consent, and family access.
- [Conceptual architecture](ARCHITECTURE.md) — the proposed system boundaries.
- [Current milestone](docs/10-execution/current-milestone.md) and [backlog](docs/10-execution/backlog.md) — what to do now and next.
- [Agent instructions](AGENTS.md) — mandatory working rules for coding agents.

## Open the documentation in Obsidian

Open `/home/lgtw/Work/granny/docs` as the Obsidian vault. This keeps the
knowledge experience focused on product documentation while code and build
files remain outside the vault. The Markdown remains portable and uses relative
standard links. No community plugins are required. Set `_templates` as the
Templates folder if you want template insertion in the UI.

The whole Git repository remains the project source of truth; `docs/` is its
Obsidian knowledge surface, not an independent notes store. Local
layout/workspace state is ignored by Git. See the
[vault notes](docs/.obsidian/README.md).

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

The current milestone is to make the Stage 1 app precise enough for research,
Figma exploration, and controlled stock-Android feasibility work. Agents must
not plan or implement Stage 2 OS or Stage 3 hardware work unless Simon
explicitly changes the active stage.
