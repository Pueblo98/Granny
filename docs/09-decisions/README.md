---
title: Architecture Decision Records
status: accepted
owner: Simon
last_updated: 2026-09-10
tags:
  - decisions
  - adr
related:
  - ../_templates/adr.md
  - ../10-execution/open-questions.md
---

# Architecture Decision Records

ADRs capture consequential, cross-cutting, or hard-to-reverse product/technical choices. `accepted` means current direction; `proposed` remains undecided. Supersede rather than rewrite an accepted decision's meaning.

| ADR | Status | Decision |
|---|---|---|
| [ADR-0001](ADR-0001-stock-android-first.md) | accepted | Start on stock Android; no AOSP fork yet. |
| [ADR-0002](ADR-0002-android-primary-platform.md) | accepted | Android is the initial primary platform. |
| [ADR-0003](ADR-0003-repository-source-of-truth.md) | accepted | This Git repository is the project source of truth. |
| [ADR-0004](ADR-0004-repository-root-obsidian-vault.md) | accepted | The repository root is also the Obsidian vault. |
| [ADR-0005](ADR-0005-semantic-control-before-vision.md) | accepted | Prefer semantic control before vision/coordinates. |
| [ADR-0006](ADR-0006-reference-hardware.md) | accepted | Use the supplied Samsung tablet as initial reference hardware, pending exact inventory. |

Create new records from the [ADR template](../_templates/adr.md). Never recycle an ADR number.
