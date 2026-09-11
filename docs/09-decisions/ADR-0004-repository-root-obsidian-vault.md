---
title: ADR-0004 — Repository Root as Obsidian Vault
status: deprecated
owner: Simon
last_updated: 2026-09-11
tags: [decision, obsidian]
related:
  - ADR-0008-docs-obsidian-vault.md
  - ../README.md
---

# ADR-0004 — Repository Root as Obsidian Vault

> Superseded by [ADR-0008](ADR-0008-docs-obsidian-vault.md) on 2026-09-11.
> This record is preserved as decision history.

## Context

Obsidian can improve navigation and linking, but a second notes repository would conflict with the source-of-truth decision.

## Historical decision

Open the repository root directly as the Obsidian vault. Use portable Markdown,
frontmatter, intentional indexes, no required community plugins, and no
committed machine-specific workspace state.

## Consequences

Documentation links naturally to code and root guidance. Shared settings must remain portable and verified before commit.

## Supersession reason

The user naturally opened `docs/` in Obsidian and preferred a knowledge-focused
vault that does not expose future source/build trees. The repository remains the
overall source of truth while `docs/` becomes its Obsidian surface.
