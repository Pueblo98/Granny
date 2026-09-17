---
title: "Simon's class brainstorming session — structured capture"
status: draft
owner: Simon
last_updated: 2026-09-17
tags: [source-material, brainstorming, product, design]
related:
  - ../README.md
  - ../../02-design/conversation-first-plan.md
  - ../../10-execution/brainstorming-alignment.md
---

# Simon's class brainstorming session — structured capture

## Provenance and authority

Simon authored these notes during a class brainstorming session and supplied `granny_os_brainstorming_notes.md` on 2026-09-17. Original file SHA-256: `bf60773f6496eb555f062e3833fc0b809f6b0aa3cacbf4b2a5c0d3222495f62f`.

This is a structured capture of Simon's ideas, questions and proposed build sequence. It is not user research, technical evidence, a replacement PRD or automatic acceptance of ideas that conflict with accepted/current direction. [The alignment brief](../../10-execution/brainstorming-alignment.md) routes compatible inputs and holds conflicts for Simon's explicit choice.

## Product and experience thesis

- Keep the visible interface extremely small and make the main experience a conversation rather than a menu of features.
- Let the person reach prior work and conversations without recreating a conventional dense chat sidebar.
- Use a generous main canvas with an optional person-chosen background.
- Let useful content appear in that canvas: contextual modules, widgets or shortcuts where they help the present task.
- Explore a distinctive interaction model rather than copying the standard empty-background chat box used by current assistants.
- Preserve the person's autonomy while reducing navigation burden. During computer use, the system should help the person understand what it is doing and how to take over.
- Treat Android as the implementation target. A browser prototype is a design/testing medium, not the shipped product.

## Backend and control questions

The session identified three possible ways to understand or control another interface:

1. semantic accessibility information and actions;
2. structured page/site information such as HTML where legitimately available;
3. images or screenshots when structured information is insufficient.

It asked whether the product runtime needs MCP. It also grouped the system into three broad areas:

- **Computer use:** observations/annotations, skills or tutorials, action and explanation.
- **Conversation application:** history, layout and the language model.
- **Knowledge:** user-entered information about people/apps and reusable projects or artifacts.

The session proposed keeping WhisperFlow-like speech/dictation as local as feasible for offline value. This was an aspiration, not measured reference-tablet capability.

## Personalization and platform strategy

- Personalize the app, the assistant's communication style and user-specific workflows.
- Understand relevant user knowledge and which apps/connectors the person actually uses.
- Consider the assistant an orchestrator of supported platform or service capabilities rather than requiring its own agent to perform every low-level action.
- Revisit differentiation as Google, Apple and other platform assistants gain computer-use features.

No platform integration, provider API, adaptive-personality rule or local-model feasibility was established by the session.

## Conversation and computer-use presentation

The notes proposed:

- a customizable load-in screen with optional contextual items such as calendar or weather;
- focused exploration of the actual user/assistant conversation rhythm;
- a clear visual transition from conversation into computer-use mode;
- a border, status treatment or comparable persistent signal while computer use is active;
- concise tutorial-style explanation of what the system is doing and why;
- arrows, highlights, exclamation marks or other friendly annotation elements over relevant information or a control the person should press;
- a path that either confirms the final consequential action or hands control to the person for completion.

The annotations were envisioned as an intermediate or top layer over the current app. The session did not establish Android overlay feasibility, semantic anchoring, protected-screen behavior, policy eligibility or accessibility compatibility.

## Screens and information spaces raised

- conversation-led landing/load-in experience;
- general and task-specific conversation;
- computer-use progress and on-page guidance;
- knowledge or relationship view;
- projects, history and artifacts, including finding a story or recipe created through conversation.

## Proposed build sequence from the session

| Phase | Brainstormed goal and success idea |
|---|---|
| P1 | Rough conversational assistant incorporating the redesign; person can use the chatbot. |
| P2 | Dashboard/load-in wireframe, default modules, prior conversations and file/project access; assistant can add or rearrange modules. |
| P3 | Conversation-to-computer-use transition, app identification/opening, intuitive explanation and an app operation. P3.1 proposed action before explanation; P3.2 adds step explanation; P3.3 confirms or hands control to the person and can annotate the page. |
| P4 | Knowledge and personalization that recognizes potentially useful facts such as a daughter's name, hobbies or passions and recalls them in a later session. |
| P5 | Combine memory with computer use; the session questioned whether a memory/internal agent should prepare context for a separate computer-use agent. |
| P6 | Personality adapts over time, including output form, humor, gender presentation and how many questions it asks. |
| P7 | Create and organize documents/artifacts from a conversation, message or screenshot. |
| P8 | Follow-ups and notifications, including entertainment reminders and medication prompts, using scheduled wake-up work. |
| P9 | Dictation with punctuation and spoken editing/deletion. |

The session proposed P1–P9 together as Stage 1 completion. The current repository uses separate MVP, App V1 and later-App horizons, so that release-boundary proposal remains an explicit decision rather than an imported requirement.
