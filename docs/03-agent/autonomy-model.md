---
title: "Agent Autonomy and Permit Integration"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [agent, autonomy]
related:
  - ../05-safety-privacy/action-policy.md
  - tool-contracts.md
---

# Autonomy integration

The single category/class authority is [action policy](../05-safety-privacy/action-policy.md). Historical levels 0/1/2/3/4 map to POL-00/01/02/03/04; restricted maps to POL-R. They classify actual effects, not UI difficulty. Product scope and distribution admission may deny an otherwise permitted class.

## Agent obligations

Planner proposes intended outcome, bounded steps, required scopes and maximum consequence. Registry and policy recompute consequence from the typed capability plus actual adapter effects. The model cannot approve itself, create a permit, relabel send as navigation, enable Android grants, or switch to a more permissive route after denial.

For POL-03: produce immutable PreparedAction → render exact local preview → obtain user response on trusted UI → policy issues permit → executor atomically checks/consumes at dispatch → verifier records actual effect. A changed prepared action creates a new version and preview. Permit duration/invalidation is owned by action policy; the UI preserves preview content on expiry.

Examples: changing Granny text is local reversible; inserting a draft in another app can sync or send typing status and needs explicit external handoff approval; opening a chat may mark it read and must be declared. Silence and “yes” from a screen/recording are data, not consent.

## Denials and delegation

Denied scope is a typed result, not a prompt asking the model to try harder. Offer a truthful manual path from SCR-014. No alternate coordinates/provider/helper may bypass denial. Unknown effects default restricted. Routines and remote assistance remain disabled in MVP/V1; a proposed future interface is not authority to expose it.

A Context Room is an organization and retrieval scope, not a permit. Entering Kitchen cannot authorize file access, cross-room disclosure, external action or deletion. The model may propose a reversible membership diff; local policy validates and commits it. Deleting a room container is POL-03 and separately names what remains. Deleting canonical items or memories requires its own exact preview and authority.

Runtime tests: EVAL-003/006/010/016. UX comprehension: EVAL-012. [Traceability](../01-product/traceability.md) binds these to PRD-SAF and PRD-PRV requirements.
