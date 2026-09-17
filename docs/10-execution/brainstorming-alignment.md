---
title: "Simon class brainstorming alignment"
status: proposed
owner: Simon
last_updated: 2026-09-17
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

## Authority and use

This note compares [Simon's class brainstorming session](../08-research/source-material/2026-09-17-class-brainstorming.md) with the current Stage 1 plan after repository reconciliation. Compatible ideas may refine an existing proposal. Conflicts stay unresolved under OQ-14 until Simon chooses; this note does not silently supersede accepted ADRs, confirmation policy, memory boundaries or release horizons.

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
| Home model | One conversation with contextual task controls and quiet Menu | Persistent customizable dashboard with widgets/app shortcuts | **Open:** elaborate and discuss before changing the Home contract. |
| Consequential action | Low-risk steps avoid repetitive prompts; external consequences require exact fresh approval | Agent acts first, then explains or asks at the end | **Retain current policy:** action-first remains appropriate only for admitted low-risk/reversible steps. |
| Memory capture | Explicit aliases/preferences in MVP; user-confirmed facts in V1; no passive extraction | Model decides which semantic facts are important and saves them | **Choose automatic App V1 capture:** minimize user effort; quiet receipt/Undo and review rights replace per-fact confirmation. See [ADR-0012](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md). |
| Personality | Respectful stable voice plus explicit preferences | Silent adaptation of jokes, diction, gender presentation and question frequency | **Choose a combination:** explicit setup preference, then bounded silent optimization over time. Voice/gender presentation remains explicit. See ADR-0012. |
| Generated interface | Stable predefined semantic components | Agent creates/rearranges buttons, modules or widgets | **Open:** elaborate and discuss with the Home model because persistence and composition are coupled. |
| Initiative and completion boundary | Basic reminders in V1; artifacts/proactive routines later; MVP validates five experiments | P1–P9 are all required before Stage 1 is complete, including scheduled proactive messages | **Retain the current MVP/App V1/later split.** |

## Conflict 1 — what is Home?

This decision is about the stable place the person sees when no task is active. It is not merely a visual choice.

| Model | What launch looks like | What stays between sessions | Main benefit | Main risk |
|---|---|---|---|---|
| Conversation canvas | Greeting/recent exchange, Talk/Type and a few contextual suggestions; photos, drafts or guidance appear only when relevant | Conversation/history and explicit preferences; no permanent widget surface | One obvious place to start, low navigation and predictable focus | Calendar/weather/favorite actions are less glanceable; the person must ask or open Menu |
| Persistent dashboard | Calendar, weather, shortcuts, past work and conversation entry coexist as movable modules | Module selection, positions and agent-created shortcuts | Fast glance access and a more OS-like personal surface | More objects to understand; layout drift can feel like the tablet changed itself; conversation competes with widgets |
| Stable conversation plus a small pinned shelf | Conversation remains the primary focus; a fixed “Today” or “Pinned” area holds a small number of user-chosen modules | Only explicitly pinned modules and stable positions; task results remain contextual | Preserves one starting point while providing glanceable value | Requires a strict limit and clear ownership or it gradually becomes the rejected feature grid |

Concrete example: after “Show me Sophie's photos,” all three models may display the same photo strip. The difference appears tomorrow. The conversation model removes it with the task; the dashboard may retain or rearrange it; the pinned-shelf model retains it only if the person pins “Family photos.” Questions for Simon are what should dominate the first screen, which information deserves to persist without a request, and whether the agent may change that persistent surface without being asked.

## Conflict 5 — how much interface may the agent generate?

This decision controls the agent's design vocabulary wherever Home lands.

| Model | Agent freedom | Example | Main benefit | Main risk |
|---|---|---|---|---|
| Fixed components | Select content for predefined photo, message, media, guidance, memory and settings components; control labels/actions are fixed | Fill a reviewed message-preview card with David and the exact draft | Strong accessibility, policy mapping and repeatable testing | Novel tasks may feel constrained and less personal |
| Free-form generated UI | Invent controls, labels, layouts and module behavior from the current conversation | Create a new “Send to David” button and place it anywhere | Maximum flexibility and visible customization | A generated control may obscure consequence, move unexpectedly, lose accessibility semantics or escape testing |
| Bounded composition | Choose and combine registered semantic components; generate text/content inside typed slots; propose persistent pin/reorder changes, but never silently apply them | Compose contact choice + exact draft + approved Send component; suggest pinning a recurring photo view | Flexible task-specific UI while controls retain known semantics and policy | Component registry and proposal rules require product work; some ideas still need a new reviewed component |

The Home decision says **where and when** modules persist. The generated-interface decision says **what the agent is allowed to construct**. A coherent hybrid would use a stable conversation, registered contextual components and a small user-owned pinned shelf. The agent could silently choose temporary components for the current task, while persistent additions or rearrangements remain user-owned layout changes.

Rows 2, 3, 4 and 6 now have explicit direction. Rows 1 and 5 remain open; no Home or component contract changes until Simon chooses them.
