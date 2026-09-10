---
title: Device Control and Recovery
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - agent
  - android
  - device-control
related:
  - agent-behavior.md
  - tool-contracts.md
  - ../04-architecture/system-overview.md
---

# Device Control and Recovery

## Action priority

1. Supported native/system/app API.
2. Semantic Android accessibility action.
3. Structured UI automation using inspectable state.
4. Vision interpretation plus coordinate interaction as a bounded fallback.

Each step down reduces reliability and should lower the acceptable consequence level. Raw coordinate interaction must not be the normal contract.

## Execution contract

For each step, capture relevant starting state, validate tool preconditions and authorization, perform one bounded action, wait for a defined state change, inspect the result, and either continue, re-plan, or stop. Set maximum steps/time/retries per task. User interaction invalidates stale plans and triggers re-observation.

## Conceptual primitives

`get_screen`, `get_elements`, `open_app`, `activate_element`, `enter_text`, `scroll`, `back`, `home`, `wait_for_state`, `capture_screenshot`, `set_volume`, `set_brightness`, and `get_notifications` are candidate capabilities—not implemented APIs. Tool contracts must use semantic identifiers/preconditions, permission scopes, consequence classification, result evidence, and explicit errors.

## Recovery classes

- app absent or signed out;
- permission missing;
- network unavailable;
- content/entity not found or ambiguous;
- accessibility tree incomplete;
- UI changed or unexpected dialog;
- authentication/security boundary;
- user interruption or manual state change;
- no state change / repeated-action loop.

Recovery should explain the concrete condition, preserve safe progress, offer the smallest next step, and stop before guessing through a consequential boundary.

## Feasibility questions

Validate these on the reference tablet: accessibility-tree quality across candidate apps, restrictions on screenshots/background activity, device-owner/managed-device capabilities, app-specific anti-automation behavior, notification access, OEM differences, reliable post-action evidence, and secure provisioning.
