---
title: "Simon class brainstorming alignment"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, planning, brainstorming]
related:
  - ../08-research/source-material/2026-09-17-class-brainstorming.md
  - ../01-product/scope-and-roadmap.md
  - ../02-design/conversation-first-plan.md
  - open-questions.md
  - backlog.md
  - ../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md
---

# Simon class brainstorming alignment

## Context Rooms follow-up — 2026-09-19

Simon later replaced the unresolved “background/widgets/shelf” space with the accepted [Context Rooms](../02-design/context-rooms.md) direction. This does not reopen the stable Home choice below: Home remains the universal conversation anchor with at most one context panel. Rooms are a secondary direct organization layer around the same assistant. [ADR-0015](../09-decisions/ADR-0015-context-rooms.md), PRD-FR-022 and T-119 now own the active plan; the earlier shelf/dashboard comparisons below remain decision history.

## Authority and use

This note compares [Simon's class brainstorming session](../08-research/source-material/2026-09-17-class-brainstorming.md) with the current Stage 1 plan after repository reconciliation. Simon resolved all six OQ-14 product conflicts on 2026-09-17; the accepted ADRs and canonical owners linked below carry the resulting behavior. This note does not silently supersede confirmation policy, memory boundaries or release horizons.

## Compatible inputs incorporated now

| Brainstorm input | Current fit and use |
|---|---|
| Minimal conversation-led entry | Reinforces T-102's implemented conversation-first direction and rejection of the feature-grid Home. |
| Rich content/modules | Use task-aware photo, playback, message, guidance and settings components in the conversation; this does not imply a persistent dashboard. |
| Person-chosen background | Treat as an explicit local visual preference with a neutral accessible default and contrast/reflow testing. No inferred personalization. |
| Computer-use tutorial | Add optional concise guidance based on verified goal, current step and evidence. Default status stays short; detail appears on request. |
| Arrows/highlights/annotations | Explore predefined, semantically anchored cues during guidance or manual handoff. No coordinate-only, protected-screen or universal-overlay claim. |
| Android-first build | Confirms the shipped product target. The Git-backed browser remains the active design prototype only. |
| Orchestrator posture | Fits API/integration-led adapters and the separation of planner, local policy, executor and verifier. A platform assistant is admitted only through a bounded versioned route with independent outcome evidence. |
| MCP question | T-117 demonstrates MCP as a bounded local transport behind fixed tools; MCP is not the product authority or a requirement for every adapter. |
| On-device speech aspiration | Route to T-101/RES-06 measurement. Tap-to-talk/editable transcript remains the current proposal; local availability is not assumed. |
| Projects/artifacts/history | Minimal content-free history is MVP; selected documents are V1; generated artifacts remain a later bounded capability. |

## Brainstorm phases mapped to current work

| Brainstorm phase | Current owner / disposition |
|---|---|
| P1 rough chatbot | T-102 conversation experience and T-117 bounded conversation runtime exist for review. |
| P2 dashboard/modules | Contextual modules fit T-102; persistent customizable dashboard conflicts with the confirmed conversation-first direction. |
| P3 computer use | T-101 route evidence + T-103 authority replay + T-104–106 admitted vertical slices + T-102 guidance/Stop presentation. |
| P4 knowledge | T-107 covers explicit MVP aliases/preferences; ADR-0012 and T-111 now own automatic allowed important facts with rights in App V1. |
| P5 memory + action | Later integration after T-107 and admitted external routes; typed boundaries already separate memory, planner, policy and executor. |
| P6 personality | ADR-0012 accepts setup-selected communication baseline plus bounded silent optimization in App V1; voice/gender presentation and protected identity remain explicit. |
| P7 artifacts/files | Selected documents route to T-111; generated artifacts/files need a later task, typed operations and data policy. |
| P8 follow-ups | Basic reminder is V1; proactive routines remain T-112/later and medication-critical guarantees are excluded. |
| P9 dictation | Editable tap-to-talk is proposed; advanced local dictation/spoken editing needs a new bounded evidence/task packet. |

## OQ-14 decision status

| Conflict | Current direction | Brainstorm alternative | Simon's 2026-09-17 direction |
|---|---|---|---|
| Home model | One conversation with contextual task controls and quiet Menu | Persistent customizable dashboard with widgets/app shortcuts | **Choose the recommended stable anchor plus one context layer:** zero or one optional registered panel, fixed core controls and no grid/carousel/widget stack. See [ADR-0014](../09-decisions/ADR-0014-stable-home-context-panel.md). |
| Consequential action | Low-risk steps avoid repetitive prompts; external consequences require exact fresh approval | Agent acts first, then explains or asks at the end | **Retain current policy:** action-first remains appropriate only for admitted low-risk/reversible steps. |
| Memory capture | Explicit aliases/preferences in MVP; user-confirmed facts in V1; no passive extraction | Model decides which semantic facts are important and saves them | **Choose automatic App V1 capture:** minimize user effort; quiet receipt/Undo and review rights replace per-fact confirmation. See [ADR-0012](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md). |
| Personality | Respectful stable voice plus explicit preferences | Silent adaptation of jokes, diction, gender presentation and question frequency | **Choose a combination:** explicit setup preference, then bounded silent optimization over time. Voice/gender presentation remains explicit. See ADR-0012. |
| Generated interface | Stable predefined semantic components | Agent creates/rearranges buttons, modules or widgets | **Choose bounded composition:** the agent automatically composes registered semantic components through typed plans; it cannot invent executable controls or action semantics. See [ADR-0013](../09-decisions/ADR-0013-bounded-interface-composition.md). |
| Initiative and completion boundary | Basic reminders in V1; artifacts/proactive routines later; MVP validates five experiments | P1–P9 are all required before Stage 1 is complete, including scheduled proactive messages | **Retain the current MVP/App V1/later split.** |

## Conflict 1 — what is Home?

This decision is about the stable place the person sees when no task is active. It is not merely a visual choice.

| Model | What launch looks like | What stays between sessions | Main benefit | Main risk |
|---|---|---|---|---|
| Conversation canvas | Greeting/recent exchange, Talk/Type and a few contextual suggestions; photos, drafts or guidance appear only when relevant | Conversation/history and explicit preferences; no permanent widget surface | One obvious place to start, low navigation and predictable focus | Calendar/weather/favorite actions are less glanceable; the person must ask or open Menu |
| Persistent dashboard | Calendar, weather, shortcuts, past work and conversation entry coexist as movable modules | Module selection, positions and agent-created shortcuts | Fast glance access and a more OS-like personal surface | More objects to understand; layout drift can feel like the tablet changed itself; conversation competes with widgets |
| Stable conversation plus a small pinned shelf | Conversation remains the primary focus; a fixed “Today” or “Pinned” area holds a small number of user-chosen modules | Only explicitly pinned modules and stable positions; task results remain contextual | Preserves one starting point while providing glanceable value | Requires a strict limit and clear ownership or it gradually becomes the rejected feature grid |

Concrete example: after “Show me Sophie's photos,” all three models may display the same photo strip. The difference appears tomorrow. The conversation model removes it with the task; the dashboard may retain or rearrange it; the pinned-shelf model retains it only if the person pins “Family photos.” Questions for Simon are what should dominate the first screen, which information deserves to persist without a request, and whether the agent may change that persistent surface without being asked.

## Conflict 5 — bounded composition accepted

This decision controls the agent's design vocabulary wherever Home lands.

| Model | Agent freedom | Example | Main benefit | Main risk |
|---|---|---|---|---|
| Fixed components | Select content for predefined photo, message, media, guidance, memory and settings components; control labels/actions are fixed | Fill a reviewed message-preview card with David and the exact draft | Strong accessibility, policy mapping and repeatable testing | Novel tasks may feel constrained and less personal |
| Free-form generated UI | Invent controls, labels, layouts and module behavior from the current conversation | Create a new “Send to David” button and place it anywhere | Maximum flexibility and visible customization | A generated control may obscure consequence, move unexpectedly, lose accessibility semantics or escape testing |
| **Bounded composition — accepted** | Choose and combine registered semantic components; generate text/content inside typed slots; persistent placement follows the still-open Home rule | Compose contact choice + exact draft + approved Send component; suggest or place a recurring photo view only as Home later permits | Flexible task-specific UI while controls retain known semantics and policy | Component registry and proposal rules require product work; some ideas still need a new reviewed component |

The Home decision says **where and when** modules persist. ADR-0013 now answers what the agent may construct: registered components and typed slots, with renderer-owned semantics and policy-owned actions. Temporary task composition may happen automatically. Home still decides whether any module survives the task and how much persistent change happens without asking.

All six rows now have explicit direction. Context Rooms subsequently answered how longer-lived domain material can stay recognizable without returning to a widget dashboard. The remaining work is T-119 visual/contract design and access/comprehension evidence, not another Home-model decision.

## Additional low-clutter Home directions

These are design hypotheses for review, not findings about all older adults. W3C's [older-user overview](https://www.w3.org/WAI/older-users/) notes wide variation in ability and experience, while distraction and concentration can affect some older users. Its [literature review](https://www.w3.org/TR/wai-age-literature/) emphasizes heterogeneity, clear labeling, simplified interfaces for newer users and the tradeoff between navigation assistance and page clutter. [Consistent navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation) supports keeping repeated controls in predictable positions.

| Direction | Idle Home | How useful information appears | Clutter control | Main tradeoff |
|---|---|---|---|---|
| Quiet anchor | Greeting, Talk/Type and Menu only | The conversation supplies everything after a request | No persistent modules | Lowest clutter, but no glanceable daily value |
| One glance panel | Stable conversation plus one large verified item such as “Reminder at 3” or “Continue your recipe” | System chooses one timely item; More opens a separate page | Exactly one panel; no carousel; absent when nothing earns the space | Relevance mistakes can displace what the person expected |
| Closed Today drawer | Quiet conversation with a clearly labeled Today control | Opening it shows a short vertical list of calendar/reminder/recent items | Information is one action away and never competes with the composer | Adds a navigation step and can hide value from someone who never opens it |
| Resume-first Home | Stable conversation plus one “Continue…” row only when work is unfinished or recently used | The row returns to the exact artifact/task; completed work leaves Home | One conditional row with clear expiry | Less useful for passive glance information such as weather/calendar |
| User-selected calm mode | Setup chooses Quiet or Glanceable; agent still uses bounded composition inside either | Quiet uses no panel; Glanceable uses one panel/drawer | Person controls baseline and can reset | Adds one setup choice and may be hard to judge before real use |

### Accepted current direction: stable anchor plus one context layer

Keep Talk/Type, conversation, Menu and active-task Stop in fixed locations. Permit at most one large optional context panel below the invitation, only for verified, timely information that has a clear next action. Never use a carousel, tiled widget grid, advertising-like cards or automatic movement while the screen is open. If more items exist, a labeled Today page holds a short vertical list. The panel disappears when irrelevant; the person can Keep here, Hide and Reset Home. The agent may select its registered component automatically, but persistent placement follows a stable rule and never moves core controls.

Simon accepted this current direction on 2026-09-17 “for now,” so [ADR-0014](../09-decisions/ADR-0014-stable-home-context-panel.md) records it as reversible after evidence rather than final visual approval. It keeps a recognizable Home while testing whether one glanceable item provides value without overload. Compare it with the pure quiet anchor using actual older adults across different experience, vision, dexterity and cognitive-access needs; age alone does not select a layout.
