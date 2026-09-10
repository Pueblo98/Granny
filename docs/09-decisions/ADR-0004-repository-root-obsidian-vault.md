---
title: ADR-0004 — Repository Root as Obsidian Vault
status: accepted
owner: Simon
last_updated: 2026-09-10
tags: [decision, obsidian]
related:
  - ../../.obsidian/README.md
  - ../README.md
---

# ADR-0004 — Repository Root as Obsidian Vault

## Context

Obsidian can improve navigation and linking, but a second notes repository would conflict with the source-of-truth decision.

## Decision

Open the repository root directly as the Obsidian vault. Use portable Markdown, frontmatter, intentional indexes, no required community plugins, and no committed machine-specific workspace state.

## Consequences

Documentation links naturally to code and root guidance. Shared settings must remain portable and verified before commit.
