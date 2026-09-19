---
title: "Decision records and authority"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [decisions]
related:
  - ../_templates/adr.md
  - ../10-execution/open-questions.md
  - ../10-execution/development-readiness.md
---

# Decision records and authority

ADRs record consequential scope, distribution, authority/data, platform and interaction choices with real alternatives. Only Simon's explicit approval or already accepted source authority can make a decision accepted. An agent may propose and recommend, not accept on Simon's behalf. Editorial document status is distinct from individual decision status.

| ADR | Status | Decision |
|---|---|---|
| [ADR-0001](ADR-0001-stock-android-first.md) | accepted | Stock Android first, no current AOSP |
| [ADR-0002](ADR-0002-android-primary-platform.md) | accepted | Android initial platform |
| [ADR-0003](ADR-0003-repository-source-of-truth.md) | accepted | Git repository source of truth |
| [ADR-0004](ADR-0004-repository-root-obsidian-vault.md) | deprecated | Historical root vault, superseded by ADR-0008 |
| [ADR-0005](ADR-0005-semantic-control-before-vision.md) | accepted | Semantic before vision/coordinates |
| [ADR-0006](ADR-0006-reference-hardware.md) | accepted | Supplied Samsung reference tablet, exact inventory pending |
| [ADR-0007](ADR-0007-three-stage-product-strategy.md) | accepted | Stage 1 exclusively active |
| [ADR-0008](ADR-0008-docs-obsidian-vault.md) | accepted | docs/ is Obsidian vault; repository remains full source of truth |
| [ADR-0009](ADR-0009-mvp-and-control-posture.md) | accepted | Five MVP experiments; policy-bounded candidate vs synthetic dynamic lab; Simon approved 2026-09-14, feasibility/release gates remain open |
| [ADR-0010](ADR-0010-local-authority-and-data.md) | proposed | Local independent authority and minimized replaceable cloud; App V1 memory behavior is separately accepted in ADR-0012 |
| [ADR-0011](ADR-0011-explicit-activation-and-access.md) | proposed | Tap-to-talk/full touch, stronger measurable access baseline |
| [ADR-0012](ADR-0012-automatic-memory-and-adaptive-communication.md) | accepted | App V1 automatically saves allowed important facts; setup preference anchors bounded silent communication adaptation |
| [ADR-0013](ADR-0013-bounded-interface-composition.md) | accepted | Agent composes registered semantic components through typed plans; arbitrary generated controls remain unavailable |
| [ADR-0014](ADR-0014-stable-home-context-panel.md) | accepted | Home keeps stable conversation controls and may show zero or one optional registered context panel |
| [ADR-0015](ADR-0015-context-rooms.md) | accepted | Context Rooms are the active M2 design direction and proposed App V1 organization layer around one assistant; direct access and scoped cross-room context remain required |

Accepted history remains unchanged. Routine copy/file layout does not need an ADR. Do not recycle IDs. New proposal links affected requirements, architecture, policy, eval and gate; specify options, recommendation, reversibility, evidence and approver. Acceptance records date/authority and unresolved evidence conditions without pretending tests passed. If an accepted decision changes, add superseding record and mark prior record deprecated with forward link; preserve historical reasoning.

Use [ADR template](../_templates/adr.md). [Open questions](../10-execution/open-questions.md) owns Simon's decision queue; [readiness](../10-execution/development-readiness.md) owns gate authorization. This expanded index is editorially proposed; it does not demote or promote the unchanged indexed decisions.
