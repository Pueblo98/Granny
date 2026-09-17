---
title: "ADR-0013 — Bounded semantic interface composition"
status: accepted
owner: Simon
last_updated: 2026-09-17
tags: [adr, design, agent, accessibility]
related:
  - README.md
  - ../02-design/design-system.md
  - ../03-agent/agent-behavior.md
  - ../10-execution/brainstorming-alignment.md
---

# ADR-0013 — Bounded semantic interface composition

## Context and authority

The class brainstorm proposed an agent that can create or rearrange buttons, modules and widgets. The current system instead defines stable semantic components. Simon reviewed fixed components, free-form generated UI and bounded composition, then explicitly accepted bounded composition on 2026-09-17 as “the perfect option.” [ADR-0014](ADR-0014-stable-home-context-panel.md) subsequently fixed Home to a stable conversation anchor with at most one context panel.

## Options considered

| Option | Benefit | Cost / risk |
|---|---|---|
| Fixed compositions only | Predictable and easy to test | New tasks feel rigid and require a handcrafted screen for every combination |
| Free-form model-generated controls/layouts | Maximum visible flexibility | Unstable semantics, accessibility, consequence wording, focus order and test coverage |
| Bounded semantic composition | Flexible task-specific presentation from reviewed parts | Requires a versioned component registry and explicit composition validation |

## Decision

The agent may select, fill and order registered semantic components through a typed composition plan. Each component owns its allowed slots, states, actions, focus semantics, reflow rules and policy bindings. Generated text, media and ordering remain data inside those constraints. Unknown component types, arbitrary executable UI, model-defined event handlers and schema-invalid action labels fail closed.

The renderer and local policy remain authoritative. Rendering a control never grants an action. Consequential controls use the registered preview/approval component and exact bound action; the agent cannot disguise Send, Delete, Share, Purchase or permission changes behind a novel label or generic button. Stop, Talk/Type and the current task status keep stable app-owned positions and cannot be moved or removed by a composition plan.

Temporary task composition may happen automatically without asking the person to design the screen. On Home, ADR-0014 permits zero or one eligible registered context panel and forbids automatic movement of the core controls or a multi-widget surface. A new component family requires design/accessibility/policy review and versioned tests before registry admission.

## Consequences and validation

The design system owns component schemas and the UI shell validates composition plans. Agent and provider output is untrusted until schema validation; tool execution remains independently typed and policy checked. EVAL-010 adds unknown component, misleading label, hidden consequence, duplicate action and focus-order attacks. EVAL-007/012 still require reflow, assistive-technology and comprehension evidence.

No current browser composition is accepted by this ADR. It authorizes a design boundary, not Figma authoring, Android implementation, model-downloaded UI code, final Home layout, brand values or a product gate.

## Decision authority and history

**Accepted by Simon on 2026-09-17.** After reviewing the three alternatives, Simon said he “completely agree[s] with bounded composition as the perfect option.”
