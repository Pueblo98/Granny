---
title: Granny Documentation Map
status: draft
owner: Simon
last_updated: 2026-09-13
tags:
  - documentation
  - navigation
related:
  - 10-execution/current-milestone.md
  - 09-decisions/ADR-0007-three-stage-product-strategy.md
---

# Granny Documentation Map

This `docs/` directory is the Granny Obsidian vault. The surrounding Git
repository remains the single source of truth for both documentation and future
implementation. Navigate intentionally from this page; the graph view is
supplementary.

> [!IMPORTANT]
> **Stage 1—the stock-Android tablet app—is the only active stage.** Stage 2
> Granny OS and Stage 3 hardware material preserve the long-term vision but
> must not drive current requirements or work unless Simon explicitly activates
> a later stage.

## Canonical map

| Area | Canonical entry point | Question answered |
|---|---|---|
| Vision | [Product vision](00-vision/product-vision.md) | What could Granny ultimately become? |
| Principles | [Product principles](00-vision/product-principles.md) | What values guide trade-offs? |
| Product | [PRD](01-product/prd.md) | What is required, for whom, and at what scope? |
| Users and outcomes | [Personas and JTBD](01-product/personas.md) | Whose problems and outcomes matter? |
| Workflows | [Use cases](01-product/use-cases.md) and [journeys](01-product/user-journeys.md) | What should users be able to accomplish? |
| Scope | [Scope and roadmap](01-product/scope-and-roadmap.md) | What are Vision, V1, MVP, and non-goals? |
| Design | [Design system](02-design/design-system.md) | What should the experience feel like? |
| Voice/accessibility | [Voice UX](02-design/voice-ux.md) and [accessibility](02-design/accessibility.md) | How should it communicate and remain usable? |
| Figma | [Figma handoff](02-design/figma.md) | How do visual artifacts relate to specifications? |
| Agent | [Agent behavior](03-agent/agent-behavior.md) | How does the agent reason and act? |
| Autonomy | [Autonomy model](03-agent/autonomy-model.md) | What may it do, and when must it ask? |
| Device control | [Device control and recovery](03-agent/device-control.md) | How does it operate and recover? |
| Memory | [Memory and proactivity](03-agent/memory-system.md) | What may it remember or initiate? |
| Architecture | [System overview](04-architecture/system-overview.md) | Where are system boundaries and unknowns? |
| Safety/privacy | [Safety and privacy](05-safety-privacy/safety-and-privacy.md) | What trust boundaries constrain the product? |
| Evaluation | [Eval strategy](06-evals/eval-strategy.md) | How will quality and safety be measured? |
| Hardware | [Reference hardware](07-hardware/reference-hardware.md) | Which tablet supports Stage 1 testing? Stage 3 dock material is context only. |
| Research | [Research register](08-research/README.md) | What evidence exists, and what still needs verification? |
| Decisions | [ADR index](09-decisions/README.md) | Which consequential choices are accepted or proposed? |
| Execution | [Current milestone](10-execution/current-milestone.md) | What is the team doing now? |

The next high-value planning session should use the
[Astra Stage 1 development-readiness metaprompt](10-execution/astra-stage-1-planning-metaprompt.md).

## Knowledge-base conventions

- Every substantive Markdown document has YAML frontmatter with `title`, `status`, `owner`, `last_updated`, `tags`, and `related`.
- Allowed statuses are `draft`, `proposed`, `review`, `accepted`, and `deprecated`.
- `accepted` means reviewed project direction, not merely “a file exists.”
- Put authoritative statements in one canonical document and link to them elsewhere.
- Prefix explicit uncertainty with **Assumption**, **Hypothesis**, or **Open question**.
- Use stable IDs for use cases (`UC-###`), requirements (`REQ-###`), evaluation cases (`EVAL-###`), and ADRs (`ADR-####`). Never recycle an ID.
- When changing behavior, update related product, safety, architecture, and evaluation documents in the same change.
- Use relative standard Markdown links so files work in GitHub, editors, and Obsidian.

## Source register

The preserved Dream Book is available as [TeX](00-vision/dream-book.tex) and [PDF](00-vision/dream-book.pdf). The initialization handoff is preserved under [source material](08-research/source-material/initialization-handoff.md). Source status and checksums are in the [research register](08-research/README.md).

## Templates

Use the concise templates in [`_templates`](_templates/): spec, ADR, use case,
user journey, research note, and eval. Templates prompt for evidence and open
questions without forcing filler.
