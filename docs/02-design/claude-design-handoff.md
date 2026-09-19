---
title: "Claude Design handoff — app experience using the prepared system"
status: proposed
owner: Simon
last_updated: 2026-09-18
tags: [design, handoff, interaction]
related:
  - claude-design-frontend-metaprompt.md
  - product-design-spec.md
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - ../10-execution/brainstorming-alignment.md
---

# Claude Design: app experience

## Assignment and entry conditions

Design the app experience using the prepared design system. This is a separate later session from design-system construction. Do not rebuild the palette, typography or component library here, and do not run a Figma library-authoring task.

The prerequisite now exists: `@granny/design-system@0.1.0` was built on branch `feature/design-system-build` at `17658b0` and synced to Claude Design project [Granny Design System (proposed)](https://claude.ai/design/p/4148cba1-baa4-4241-b893-6c54188897ff). Review its proposed-versus-accepted status and known gaps before composing. The [frontend build metaprompt](claude-design-frontend-metaprompt.md) is the current copy-ready execution brief.

The synced package predates the selected Round conversation composer and ADR-0014/CMP-010 Home-panel decision. Use the package for its implemented components and tokens, apply the later accepted decisions as explicit deltas, and return missing component work to the design-system owner rather than silently adding one-off app tokens.

Simon settled the brainstorming interaction conflicts before this app-design session. Read the [resolved OQ-14 alignment brief](../10-execution/brainstorming-alignment.md). [ADR-0013](../09-decisions/ADR-0013-bounded-interface-composition.md) accepts bounded semantic composition, and [ADR-0014](../09-decisions/ADR-0014-stable-home-context-panel.md) accepts a stable conversation Home with zero or one optional context panel. Registered components and typed slots/actions retain renderer-owned focus/reflow and stable control anchors; arbitrary generated executable controls are excluded. Do not reopen a widget dashboard or infer visual approval from an old prototype.

## Product and design direction

**Selected composer shape, Simon, 2026-09-17:** carry [Round conversation](brand-and-visual-identity.md#accepted-shape-direction--round-conversation) through compact, normal and expanded app compositions. The canonical note embeds the selected image and records the favicon direction. This visual approval preserves the Home and interaction contracts; remaining visual values stay provisional.

The product is a stock-Android tablet app for older adults with varied access needs. Granny is a temporary codename. Simon rejected the existing browser UI as too button-heavy and generically AI-styled. Its behavior fixtures are useful evidence; its appearance is not an accepted reference.

The intended experience lets a person express an everyday goal, understand the consequence, stay in control and receive a truthful result. Keep it calm, capable and adult. Use the supplied system's type, colors and components. Keep product content central and make each visible control earn its place.

Avoid capability grids, prompt-chip walls, generic AI gradients/sparkles, repeated floating cards and tiny icon-only actions. Fewer visible controls must preserve the complete touch path, exact approval, stable Stop and discoverable privacy/settings access.

## Paste into Claude Design

Use the full [Claude Design frontend build metaprompt](claude-design-frontend-metaprompt.md). It replaces the earlier short exploration prompt now that the design system is synced, Home is settled and the Round conversation shape is selected. It asks Claude Design to build the editable zero-panel Home and complete fictional message slice first, then extend the same interaction language to the other MVP flows and supporting states. It does not reopen the structural Home decision or request three unrelated concepts.

## Canonical inputs

Read [scope](../01-product/scope-and-roadmap.md), [PRD](../01-product/prd.md), [journeys](../01-product/user-journeys.md), [screen contracts](product-design-spec.md), [components](design-system.md), [voice](voice-ux.md), [accessibility](accessibility.md), [action policy](../05-safety-privacy/action-policy.md) and [privacy](../05-safety-privacy/safety-and-privacy.md).

MVP covers photos, explain/recover, message preparation/approval, media and in-app readability, with supporting setup/privacy/history. These are outcomes, not a requirement for five Home buttons. Consequential effects require exact fresh approval. App V1 automatic important-fact memory and bounded communication adaptation follow [ADR-0012](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md); they do not silently expand MVP.

## Work sequence

1. Confirm the supplied system and resolved product choices.
2. Explore three different structures for one fictional message task using the same content and component semantics.
3. Review composition with Simon, including what appears at rest versus during a task.
4. Develop the selected direction through clarification, preview/edit, activity/Stop, result and recovery before extending to the other MVP flows.
5. Review narrow/tablet, portrait/landscape, long content, keyboard-open, 200% and combined 300% text scenarios, silent/touch-only use and focus restoration.

Exact fixture: “Tell David I'll call after dinner.” Clarify only if identity/channel is unresolved. Show exact recipient, channel, message and effect before approval. A local-demo result must say saved locally and not sent; Android handoff and verified sending are separate states. Unknown effect never offers a blind resend.

System-owned permission/authentication screens are annotated placeholders until device evidence. Do not claim a universal external Stop overlay works.

## Deliverables and review

Return actual editable app-design references, state/flow coverage, source-system version, focus/semantics annotations, responsive variants and remaining product questions. Trace surfaces to existing J/SCR/CMP IDs. Record required system changes as proposals for its owner rather than silently introducing one-off colors or components.

Assess hierarchy, amount of visible interface, consequence comprehension, Stop reachability and readability before visual polish. Report missing states and unrun native/user studies. Design approval does not pass Android feasibility, accessibility or release gates.
