---
title: Seed Use Cases
status: draft
owner: Simon
last_updated: 2026-09-10
tags:
  - product
  - use-cases
related:
  - prd.md
  - user-journeys.md
  - ../06-evals/canonical-tasks.md
---

# Seed Use Cases

Stable IDs connect product behavior, journeys, design flows, implementation, and evals. Wording may evolve; IDs are never reused. This is a representative seed set, not a promise to implement all cases or inflate the list to 100 before research.

| ID | Intent | Domain | Consequence note |
|---|---|---|---|
| UC-001 | “Call Sophie.” | Communication | Resolve identity; confirm before initiating by default. |
| UC-002 | “Show me the photos Sophie sent yesterday.” | Photos/messages | Read-only navigation; clarify wrong-person/date ambiguity. |
| UC-003 | “I don't know what this screen means.” | Device help | Observe, explain, offer a safe next step. |
| UC-004 | “Play some Frank Sinatra.” | Media | Reversible; report chosen service/content if ambiguous. |
| UC-005 | “I want to tell you how I met Robert.” | Life story | Obtain recording/retention consent; private by default. |
| UC-006 | “Tell David I'll call after dinner.” | Messaging | Draft visibly; send only after confirmation. |
| UC-007 | “Make this bigger.” | Accessibility | Prefer supported display/app controls and verify result. |
| UC-008 | “Remind me tomorrow to call the dentist.” | Reminders | Confirm interpreted time and created reminder. |
| UC-009 | “Why isn't the internet working?” | Device help | Diagnose within permission; avoid exposing credentials. |
| UC-010 | “What do you remember about Sophie?” | Memory | Show source/scope; allow correction and deletion. |
| UC-011 | “Take me back to what I was reading.” | Recovery | Use recent device context; clarify if multiple candidates. |
| UC-012 | Trusted family member starts remote help. | Family support | User approval, limited scope, persistent banner, automatic end. |

## Use-case contract

Each expanded use case should define actor, desired outcome, preconditions, trigger, happy path, alternatives/failures, data used, autonomy level, confirmation, privacy/accessibility needs, requirements, journey, and eval IDs. Use the [use-case template](../_templates/use-case.md).

## Prioritization questions

- Which 3–5 cases are frequent and painful enough to validate the thesis?
- Which can be tested reliably on the reference tablet without premature infrastructure?
- Which expose the highest-risk entity, confirmation, and recovery failures?
