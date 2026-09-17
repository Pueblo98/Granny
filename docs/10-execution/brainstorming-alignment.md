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
| P4 knowledge | T-107 covers explicit aliases/preferences; V1 may add confirmed facts with rights. Automatic importance selection conflicts with current memory policy. |
| P5 memory + action | Later integration after T-107 and admitted external routes; typed boundaries already separate memory, planner, policy and executor. |
| P6 personality | New decision. Respectful baseline exists; silent adaptation is not current scope. |
| P7 artifacts/files | Selected documents route to T-111; generated artifacts/files need a later task, typed operations and data policy. |
| P8 follow-ups | Basic reminder is V1; proactive routines remain T-112/later and medication-critical guarantees are excluded. |
| P9 dictation | Editable tap-to-talk is proposed; advanced local dictation/spoken editing needs a new bounded evidence/task packet. |

## OQ-14 decision packet — keep or replace

| Conflict | Current direction | Brainstorm alternative | Recommended disposition pending Simon |
|---|---|---|---|
| Home model | One conversation with contextual task controls and quiet Menu | Persistent customizable dashboard with widgets/app shortcuts | Keep conversation Home; allow explicit background and contextual modules without restoring the feature grid. |
| Consequential action | Low-risk steps avoid repetitive prompts; external consequences require exact fresh approval | Agent acts first, then explains or asks at the end | Keep consequence-based policy. Use action-first only for admitted low-risk/reversible steps. |
| Memory capture | Explicit aliases/preferences in MVP; user-confirmed facts in V1; no passive extraction | Model decides which semantic facts are important and saves them | Permit a future “Would you like me to remember this?” proposal, but save only after explicit review. |
| Personality | Respectful stable voice plus explicit preferences | Silent adaptation of jokes, diction, gender presentation and question frequency | Start with explicit controls; study optional adaptation later without inferred gender or hidden profile changes. |
| Generated interface | Stable predefined semantic components | Agent creates/rearranges buttons, modules or widgets | Keep schema-bound components; consider user-approved layout preferences after access testing. |
| Initiative and completion boundary | Basic reminders in V1; artifacts/proactive routines later; MVP validates five experiments | P1–P9 are all required before Stage 1 is complete, including scheduled proactive messages | Keep MVP/V1/later separation unless Simon explicitly redefines Stage 1 and accepts the larger safety/data program. |

No conflicting canonical owner is changed until Simon decides these rows. A chosen change may require an ADR and propagation through PRD, design, agent/tool, policy/privacy, eval, trace and gate owners.
