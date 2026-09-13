---
title: ADR-0008 — Documentation Directory as Obsidian Vault
status: accepted
owner: Simon
last_updated: 2026-09-11
tags: [decision, documentation, obsidian]
related:
  - ADR-0004-repository-root-obsidian-vault.md
  - ../README.md
  - ../.obsidian/README.md
---

# ADR-0008 — Documentation Directory as Obsidian Vault

## Context

The repository will eventually contain Android code, tests, build files, agent
components, and other engineering artifacts. Opening the entire repository in
Obsidian adds implementation clutter to a product knowledge workflow. Simon
already opened `docs/` as the vault and found that model more intuitive.

## Decision

Use `/home/lgtw/Work/granny/docs` as the Granny Obsidian vault. Keep the entire
Git repository as the project source of truth: documentation lives in the
vault, while code and build artifacts remain in their normal repository paths.

Obsidian-generated JSON, workspace state, plugins, themes, cache, and trash are
local and ignored. No community plugin is required. Standard relative Markdown
links and frontmatter remain canonical.

## Consequences

- Obsidian shows the knowledge base rather than implementation trees.
- Root files such as `AGENTS.md`, `CLAUDE.md`, and `ARCHITECTURE.md` remain
  agent/engineering entry points outside the vault and may link into it.
- Documentation must not depend on Obsidian-only syntax or plugins.
- Code-to-document traceability uses repository-relative paths, IDs, and links
  from engineering tools; code does not need to appear inside Obsidian.

## Alternatives considered

- Repository-root vault: superseded because it creates unnecessary code/build
  navigation noise for the user.
- Separate copied documentation repository: rejected because it would create a
  competing source of truth.
