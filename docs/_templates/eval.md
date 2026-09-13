---
title: "Evaluation specification template"
status: draft
owner: Simon
last_updated: 2026-09-14
tags: [template]
related:
  - ../README.md
---

# EVAL-XXX — Task or invariant

Document status draft/proposed; execution status **unrun** until performed. Link PRD/UC/J/SCR/interface/policy/task and release applicability.

## Controlled setup

Fixture/oracle version, synthetic accounts/content, device model/API/OEM/app versions, locale/timezone, permission/auth/network states, model/recipe/policy, access profile. No personal identifiers.

## Procedure and variants

Happy path, ambiguity/injection/stale/replay/revocation/outage/cancel/takeover/crash variants; exact step/time/retry bounds.

## Independent evidence and failure

Postcondition oracle outside planner; absent unintended effects; safe partial/unknown distinction; severity/taxonomy, no app-open-as-complete shortcut.

## Execution and results

Automatable vs manual/human portions, privacy-safe logs, command/date/version, n and numerator/denominator, uncertainty, failures and limitations. Keep unrun if no execution. Link actual artifact only after exists; gate/approver and next regression.
