---
title: "ADR-0015 — Optional context rooms around one global assistant"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [adr, design, context, memory, privacy]
related:
  - README.md
  - ../02-design/context-rooms.md
  - ../02-design/product-design-spec.md
  - ../03-agent/memory-system.md
  - ../05-safety-privacy/safety-and-privacy.md
  - ../10-execution/open-questions.md
---

# ADR-0015 — Optional context rooms around one global assistant

## Context and authority

ADR-0014 keeps Home as a stable conversation surface with zero or one context
panel. Simon proposed a complementary spatial organization model: recognizable
rooms such as Kitchen or Fitness can collect related material, make it easier
to resume domain work and give the assistant a useful local context. He then
clarified that quick tasks remain available through global chat, the assistant
keeps one personality, room context may interact with relevant context from
other rooms, visual identity uses large labels plus representations rather than
emoji alone, and room atmosphere remains bounded.

This is a product interaction and data-boundary decision. It does not derive a
claim about dementia, cognition or older adults from the metaphor.

## Options considered

| Option | Benefit | Cost / risk |
|---|---|---|
| Global conversation only | Lowest visible and storage complexity | Long-lived material may be difficult to browse, recognize and resume |
| Widget/dashboard Home | Many domains visible at once | Recreates feature-grid clutter and competes with the primary conversation |
| Ordinary folders | Predictable direct hierarchy | Adds organization without useful assistant context or atmosphere |
| Separate domain agents | Strong domain framing | Fragments identity, memory, policy and the person's understanding of who knows what |
| Optional context rooms with one assistant | Recognizable organization, direct browse and foregrounded context without blocking global chat | Requires explicit source/scope, cross-room privacy rules, deletion semantics and comprehension evidence |

## Decision

Granny may provide optional **Context Rooms** as a secondary organization and
context layer. Global Home remains the universal starting point and does not
become a grid, shelf or room dashboard. Entering a room foregrounds its
references and atmosphere while retaining the same assistant, personality,
communication settings, policy and stable controls.

The assistant may retrieve relevant context from other rooms and allowed
global memory. Room boundaries are organizational, not execution authority or
automatic security boundaries. Retrieval remains goal-scoped, minimum
necessary, locally policy-filtered and provenance-carrying; sensitive data,
egress and consequences retain their existing controls. The current room and
material cross-room sources are visible when needed for comprehension, privacy
or correction.

Rooms have large written names and meaningful visual reinforcement. Bounded
atmosphere may vary approved background, illustration and decorative accent;
core control positions, semantics, accessibility, action styling and Granny's
identity do not vary.

The person can create, browse, search, archive, reorganize and delete rooms by
conversation or a complete direct-touch path. Items may be referenced by more
than one room. Conversation cannot be the only retrieval path. Deleting a room
removes the organization and safely rehomes room-only references by default;
deleting underlying data is a separate exact destructive action. The model may
propose organization or deletion, while trusted local policy/storage validates
and commits it.

## Consequences and validation

[Context Rooms](../02-design/context-rooms.md) owns the detailed interaction,
context, lifecycle and staged prototype brief. The memory contract distinguishes
room membership from personal memory; privacy policy owns cross-room retrieval
and deletion. ADR-0013 continues to forbid arbitrary generated controls, and
ADR-0014 continues to limit Home to zero or one optional context panel.

Exact navigation, default rooms, terminology and real-data implementation
remain open. In a follow-up direction on 2026-09-19, Simon asked the entire
notebook and future plan to adopt Context Rooms. They are now the active M2
fictional-data design direction with proposed App V1 placement, stable IDs and
T-119 as the bounded next slice. They do not enter the five-workflow MVP or
gain persistent personal data merely from this planning decision. EVAL-008/012
and the named T-119 fixture must test the model before implementation or release
admission.

Reconsider or narrow the direction if rooms become a feature grid, people
believe they are speaking to different agents, cross-room context surprises
them, direct retrieval is worse than search, room deletion is misunderstood or
room atmosphere harms access. The safe fallback remains global conversation
plus ordinary direct lists/search.

## Decision authority and history

**Accepted by Simon on 2026-09-19.** After reviewing counterarguments, Simon
explicitly retained global chat, selected one assistant with room and cross-room
context, chose large labels with visual reinforcement and bounded atmosphere,
accepted the optional-Rooms formulation, and said the direction was settled for
a fuller write-up. Simon then directed the notebook and future plan to adopt it.
This acceptance covers the principles above and their use as the active design
plan, not final navigation/visual choices, production implementation or any
evidence gate.
