---
title: Memory and Proactivity
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - agent
  - memory
  - privacy
related:
  - agent-behavior.md
  - ../05-safety-privacy/safety-and-privacy.md
---

# Memory and Proactivity

Memory is structured, permissioned context—not a transcript archive. Proactivity uses that context only within user-controlled boundaries.

## Conceptual classes

Current conversation context; preferences; people and relationships; routines; important dates/events; stories; places; photos/documents; user corrections; inferred information; sensitive information; recent device/task context.

Every retained item should eventually carry source/provenance, stated versus inferred status, confidence, sensitivity, sharing scope, consent basis, timestamps, retention/expiry policy, and correction/deletion history.

## User rights

The experience must support understandable answers and actions for: “What do you remember about Sophie?”, “Don't remember that,” “That story is private,” and “You got Robert's birthday wrong.” Deletion and correction must propagate to derived uses as technically feasible.

## Family boundary

Family members do not automatically see private conversations, transcripts, memories, browsing/message content, microphone history, credentials, or screen activity. Shared items and device-administration facts live in explicitly different scopes.

## Proactivity

Proactivity should be quiet by default until preference research and consent design establish otherwise. A proposed spectrum is Quiet → Helpful → Proactive, configurable in natural language and settings. Quiet hours, frequency, topic sensitivity, context appropriateness, dismissal learning, and easy global pause are required design dimensions.

## Prohibitions and open questions

Do not infer medical or cognitive diagnoses during ordinary companionship. Open questions include which data requires explicit capture consent, default retention, on-device versus cloud storage, confidence display, expiry, family visibility, audio retention, export, portability, and memory conflict resolution.
