---
title: Safety and Privacy Foundation
status: proposed
owner: Simon
last_updated: 2026-09-10
tags:
  - safety
  - privacy
related:
  - ../03-agent/autonomy-model.md
  - ../03-agent/memory-system.md
  - ../01-product/prd.md
---

# Safety and Privacy Foundation

## Product boundary

Granny is not currently a medical device, emergency service, diagnostic system, medication-management system, financial agent, or legal agent. Future movement into those domains requires explicit product, legal, safety, and architecture decisions.

## Principles

- Store or expose data only for a clear, understandable purpose.
- Treat companion conversations, personal memory, family-shared content, device administration, and safety-relevant events as distinct scopes.
- Make microphone and remote-access state obvious and persistent.
- Use least privilege and make permissions understandable, revocable, and time/scope bounded.
- Require specific confirmation for consequential actions; restrict high-risk actions until designed.
- Surface uncertainty, verify outcomes, and prefer safe stopping to confident guessing.
- Support user inspection, correction, deletion, export, and sharing control for retained memory.
- Do not infer cognitive/medical diagnoses or silently broaden caregiver visibility.

## Family/caregiver boundary

Allowed only with explicit grants: managing trusted contacts, adding user-visible appointments/content, device health, accessibility configuration, account connection help, or a visible bounded support session.

Not automatically visible: private conversations, message contents, browsing history, private stories, microphone history, arbitrary live screens, credentials, financial data, or inferred sensitive facts. User approval is not replaced by a family relationship.

## Threats to model before implementation

Wrong-person actions; prompt/instruction injection from screen content; malicious messages or links; impersonated helpers; coercive consent; remote-session overreach; credential leakage; screenshot/audio overcollection; model/provider data exposure; memory poisoning; unauthorized sharing; repeated-action loops; stolen devices; insecure updates; unclear deletion; and unsafe fallback from semantics to coordinates.

## Required follow-on artifacts

Before real-user data or consequential tools: data-flow inventory, permission/action matrix, threat model, retention schedule, incident and account-recovery plan, consent/confirmation UX, helper role model, and evals for denied/ambiguous/expired approvals.

## Open questions

Legal jurisdictions and target markets, age/consent/account model, data residency, encryption/key ownership, audit retention, emergency language, abuse/coercion protections, and policy for user requests involving high-risk domains.
