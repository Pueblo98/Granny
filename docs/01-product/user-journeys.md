---
title: Seed User Journeys
status: draft
owner: Simon
last_updated: 2026-09-10
tags:
  - product
  - journeys
related:
  - use-cases.md
  - ../02-design/voice-ux.md
  - ../06-evals/canonical-tasks.md
---

# Seed User Journeys

These journeys turn representative intents into end-to-end experience hypotheses for product review and Figma. They do not imply implemented capabilities.

## J-001 — Find recent family photos

**Use case:** UC-002
**Start:** Barbara is on Granny Home and asks, “Show me the photos Sophie sent yesterday.”

1. Granny visibly acknowledges the request: “I'm looking for Sophie's recent photos.”
2. It resolves Sophie from relationship context; if ambiguous, it asks rather than choosing.
3. It selects the likely approved communication app and inspects the current state.
4. It navigates semantically to Sophie's conversation and the relevant time window.
5. It opens candidate photos without sending, sharing, or changing content.
6. It verifies the person, date, and content; at low confidence it asks, “Are these the ones?”
7. Barbara browses by touch. A save/share follow-up remains separate and permissioned.

Recovery states to design: app logged out, no semantic image data, multiple Sophies, date mismatch, no photos, network unavailable, user interrupt.

## J-002 — Recover from a confusing screen

**Use case:** UC-003 / UC-011
**Start:** Barbara is inside an unfamiliar app state and says, “I don't know what I did.”

1. Granny identifies the app, visible controls, and recent task context.
2. It explains plainly: “You're in YouTube settings.”
3. It offers one concrete recovery: “You were watching a gardening video. I can take you back.”
4. On agreement, it performs safe navigation and verifies the expected content appears.
5. If it cannot understand the screen safely, it stops and offers guided touch or family help rather than guessing.

## J-003 — Draft and send a family message

**Use case:** UC-006
**Start:** “Tell David I'll call after dinner.”

1. Granny resolves David and the usual approved channel, asking if identity is ambiguous.
2. It drafts but does not send: “I'll call tonight after dinner.”
3. It displays/reads the recipient, channel, and message with **Send**, **Change it**, and **Cancel**.
4. Only after explicit confirmation does it send.
5. It verifies the app reports success and says what happened. Failure leaves the draft unsent and explains the next option.

## J-004 — Permissioned remote assistance

**Use case:** UC-012
**Start:** Barbara asks Alice for help with connectivity.

1. Granny diagnoses accessible device/network state locally and explains it.
2. It requests Barbara's approval for a narrowly scoped support session.
3. The screen continuously displays “Alice is helping,” scope, and a large **Stop** action.
4. Alice sees only the relevant allowed surface, not private conversations or arbitrary history.
5. The session expires or ends after the task and records a user-readable summary.

This journey is long-term/proposed and requires threat modeling before implementation.

## Figma priority

Prototype J-001 and J-002 first after the MVP task set and accessibility baselines are reviewed. They test the differentiated “ask, don't navigate” and recovery promises without requiring high-risk transactions.
