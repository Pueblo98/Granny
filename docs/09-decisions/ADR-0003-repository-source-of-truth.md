---
title: ADR-0003 — Repository as Source of Truth
status: accepted
owner: Simon
last_updated: 2026-09-10
tags: [decision, documentation]
related:
  - ../README.md
---

# ADR-0003 — Repository as Source of Truth

## Context

Product, design, agent, safety, architecture, evaluation, and implementation knowledge must remain traceable across people and agents.

## Decision

This Git repository is canonical. Figma contains visual artifacts; chats and external tools may generate input, but accepted reasoning, requirements, behavior, contracts, and decisions are reflected here.

## Consequences

Behavior changes include documentation updates. Duplicate note stores and chat-only decisions are invalid working practice.

## Alternatives

Separate wiki or Figma/chat as canonical—rejected because it fragments context and version history.
