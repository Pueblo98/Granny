---
title: Autonomy and Confirmation Model
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - agent
  - autonomy
  - safety
related:
  - agent-behavior.md
  - ../05-safety-privacy/safety-and-privacy.md
  - ../06-evals/canonical-tasks.md
---

# Autonomy and Confirmation Model

## Conceptual levels

| Level | Meaning | Examples | Default gate |
|---|---|---|---|
| 0 — Observe | Read approved state without changing it. | Explain screen, inspect connectivity. | Consent/permission for data access. |
| 1 — Safe navigation | Low-impact, easily stopped movement. | Open app, search, scroll, go back. | Execute and remain visible. |
| 2 — Prepare/reversible | Prepare a state without committing externally. | Draft message, select photos, prepare call. | Execute, show result; do not commit. |
| 3 — Consequential | Causes an external, destructive, privacy, account, or social effect. | Send, share, call, delete, create appointment. | Fresh, specific confirmation. |
| 4 — Delegated routine | Narrow repeated action explicitly delegated by user. | A future pre-authorized routine reminder/action. | Bound by scope, time, revocation, and audit. |
| Restricted | Risk exceeds current product authority. | Financial transfer, credentials, legal agreement, unknown install, security recovery. | Refuse or require a separately designed high-assurance flow. |

Levels classify effects, not UI difficulty. A one-tap send remains consequential.

## Valid confirmation

Confirmation must be specific to the action, understandable, proximate in time, and freely revocable before execution. It identifies actor/recipient, object/content, channel/destination, and meaningful consequence. Ambiguous speech, silence, prior unrelated consent, caregiver preference, or the model's confidence is not confirmation.

After confirmation, execute only the described action. Material changes require reconfirmation. Verify and report success/failure.

## Initial mappings

- Open/search/browse/change volume: Level 1, unless content exposure changes the risk.
- Draft message/prepare call/select attachment: Level 2.
- Send message/start call/share photo/delete ordinary content/create appointment: Level 3.
- Purchases, banking, passwords/account recovery, legal agreements, security settings: Restricted pending explicit design and review.

These mappings remain proposed. Before capability implementation, add the action to a maintained matrix, threat-model it, define confirmation UI/voice behavior, and add positive and negative evals.
