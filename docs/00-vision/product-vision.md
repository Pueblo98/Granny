---
title: Product Vision
status: draft
owner: Simon
last_updated: 2026-09-10
tags:
  - vision
  - product
related:
  - dream-book.pdf
  - product-principles.md
  - ../01-product/prd.md
  - ../01-product/scope-and-roadmap.md
---

# Product Vision

## Definition

**One line:** Granny is an AI-first personal computer for older adults that can talk, remember, understand the screen, and operate the device on the user's behalf.

**Core thesis:** The user should not need to learn how to operate the computer. The computer should learn how to operate itself for the user.

Granny combines a senior-first tablet interface, conversational companion, permissioned device-operating agent, persistent and correctable personal memory, life-story creation, trusted family support, and—eventually—purpose-built tablet-and-dock hardware. A person should be able to express an intent such as “show me the photos Sophie sent yesterday”; Granny should resolve the context, use the relevant app, verify the result, recover from changed screens, and ask before consequential actions.

## Problem

Modern computing assumes users will learn application boundaries, interface conventions, credentials, alerts, settings, and recovery paths. Many older adults want the outcomes technology enables without making technology itself a hobby. Granny moves this interface burden from the person to the system while preserving direct touch control.

## Intended end state

The full vision has six product layers:

1. a calm senior-first launcher and touch interface;
2. a natural voice companion with visible listening/acting states;
3. broad, reliable operation of Android and third-party apps;
4. consent-aware relationship, preference, routine, and life-story memory;
5. narrow, transparent family/caregiver assistance;
6. an appliance-like tablet and dock with strong audio and physical privacy controls.

## Differentiation

The defensible product is the integrated system—not a particular model: senior-first experience, reliable device control, relationship memory, life-story artifacts, permissioned family support, safety/confirmation logic, and eventually dedicated hardware. General voice capability is expected to become commonplace.

## Scope boundaries

- **Vision:** the complete long-term product described above and in the [Dream Book](dream-book.pdf).
- **V1:** the first coherent product suitable for real independent older-adult users. Its exact feature boundary is not accepted yet.
- **MVP:** the smallest experiment that tests whether natural intent plus safe device operation materially reduces interface burden. Its exact task set is not accepted yet.

See [scope and roadmap](../01-product/scope-and-roadmap.md) for current proposals and [open questions](../10-execution/open-questions.md) for decisions needed.

## Current phase

Product definition, design-system foundations, and documentation. Figma exploration and controlled technical feasibility tests come next; substantial implementation does not.

## Constraints

- Android is the initial platform and stock Android comes before any AOSP fork.
- Semantic/API-driven control precedes vision and coordinate interaction.
- Consequential action is permissioned and visible.
- Touch remains usable when voice fails or is unwanted.
- Family support must not become surveillance.
- Granny is not currently defined as a medical device, emergency service, diagnostic system, or medication-management system.

## Open questions

- Which primary persona and initial setting should V1 target?
- Which 3–5 workflows best test the MVP thesis?
- What minimum reliability makes delegated device operation trustworthy?
- What memory and family features, if any, enter MVP or V1?
- Which stock-Android limitations appear on the actual reference device?
