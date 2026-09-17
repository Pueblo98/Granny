---
title: "ADR-0012 — Automatic important-fact memory and adaptive communication"
status: accepted
owner: Simon
last_updated: 2026-09-17
tags: [adr, memory, personalization]
related:
  - README.md
  - ../01-product/prd.md
  - ../03-agent/memory-system.md
  - ../05-safety-privacy/safety-and-privacy.md
  - ../10-execution/brainstorming-alignment.md
---

# ADR-0012 — Automatic important-fact memory and adaptive communication

## Context and authority

The earlier plan required an explicit Save for each personal fact and kept communication style stable unless the person changed a setting. Simon's class brainstorm instead aims to make the person do as little configuration and repetition as possible. On 2026-09-17 Simon explicitly chose automatic saving of important facts and a combined personality model: the person chooses an initial communication preference during setup, then the assistant silently optimizes within that direction over time. He separately retained the current MVP/App V1/later split, so this decision changes the App V1 memory/personalization method without adding the whole P1–P9 sequence to MVP.

## Options considered

| Option | Benefit | Cost / risk |
|---|---|---|
| Explicit Save for every fact and preference | Every stored item is deliberate | Repeated prompts and setup burden undermine the product thesis; useful continuity depends on constant user work |
| Automatic typed important-fact capture plus bounded adaptive communication | Low effort and improving continuity; one initial preference provides a clear starting point | Incorrect or intrusive memory and unwanted style drift require visible rights, filters and evaluation |
| Broad transcript archive and unconstrained profile optimization | Maximum raw context for a model | Surveillance, poor correction semantics, hidden profiling and unclear provenance; rejected |

## Decision

Use the second option for App V1. During setup, the person chooses a plain-language communication starting point. The assistant may then silently optimize bounded presentation traits such as brevity, pacing, formatting, explanation depth, question frequency and light humor from the person's direct corrections and interaction choices. The person need not approve each adjustment. The original setup choice remains the baseline, and Settings provides review, pause and reset without requiring routine management.

The model may identify and automatically save an important fact directly stated by the person when it matches an allowed typed memory class. A local memory policy, not model confidence alone, admits the write. There is no confirmation interruption for each permitted fact. The interface gives a quiet, understandable “Remembered” receipt with Undo and keeps a reviewable Memory view with source, correction and deletion controls.

Automatic capture does not authorize a transcript archive, screen/message mining, third-party assertions, helper input becoming fact, credentials, medical or cognitive diagnosis, inferred vulnerability, financial/legal profile, face-derived relationship or protected authentication content. Those items remain rejected or require a separately accepted design. A saved fact never grants authority for an external action; person, target and consequence rules still apply.

Memory remains local by default, provenance-bearing, correctable, deletable and excluded from helper access. Conflicting values are not silently overwritten. Communication adaptation must not infer or change protected identity; voice or gender presentation stays an explicit user selection. No engagement-maximizing objective, advertising profile or cloud memory sync is accepted.

## Consequences and validation

PRD-PRV-003, the memory contract, privacy inventory, memory screen, threat model, T-111 and EVAL-017 adopt the automatic App V1 behavior. MVP retains explicit aliases/preferences and may use synthetic fixtures to prove the rights and policy machinery; automatic personal-fact capture is not added to MVP by this decision.

EVAL-017 must measure permitted important-fact capture, false/duplicate/conflicting saves, prohibited-category denial, quiet receipt/Undo, later-session recall, correction/deletion/restore, adaptation benefit and unwanted style drift. Any real-person trial needs GATE-06 privacy/data readiness and separate research authority. A high false-save, hard-to-find control, deleted-memory resurrection or material style drift blocks the feature.

## Decision authority and history

**Accepted by Simon on 2026-09-17.** Simon wrote: “let the model automatically save important facts ... make the user do as little as possible” and selected setup communication preferences followed by silent optimization over time. This acceptance does not select a storage vendor/model, authorize real personal data, accept cloud sync, pass a gate or resolve OQ-14's Home and generated-interface choices.
