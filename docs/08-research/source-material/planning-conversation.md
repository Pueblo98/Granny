---
title: Previous Planning Conversation — Structured Capture
status: draft
owner: Simon
last_updated: 2026-09-10
tags:
  - source-material
  - planning
related:
  - ../README.md
  - ../../00-vision/product-vision.md
---

# Previous Planning Conversation — Structured Capture

## Provenance

Supplied by Simon in the initialization chat on 2026-09-10 after the file was not present in Downloads. This is a structured capture of the supplied planning text, not an accepted specification. The initialization handoff and current user direction take precedence.

## Repository proposal

The conversation proposed the repository itself as the source of truth, with Figma containing visual design and code implementing repository specifications. It proposed root `README.md`, concise `AGENTS.md`, `ARCHITECTURE.md`, numbered documentation areas from vision through execution, Git-backed design tokens, and future implementation roots for Android, backend, agent, evals, and hardware. It explicitly warned that the full tree should prevent later chaos but should not all be filled immediately.

The recommended first set was: root README and AGENTS; docs index; product vision and principles; PRD; personas; use cases; user journeys; design system; accessibility; voice UX; agent behavior; autonomy model; system overview; plus the preserved TeX/PDF Dream Book.

## Product and process proposals

- Keep Vision (end state), V1 (first real product), and MVP (smallest thesis test) distinct.
- Use an independently living, technologically uncomfortable but cognitively independent older adult as the leading proto-persona; include access-needs and trusted-family variants; leave more advanced cognitive support outside MVP unless explicitly chosen.
- Define jobs around accomplishing outcomes without learning interfaces, natural-language intent, family connection, continuity, and reducing family tech-support burden.
- Grow use cases toward broad coverage only over time; give each a stable `UC-###` identifier and connect it to product requirements and agent evals.
- Turn high-priority cases into carefully designed end-to-end journeys and Figma flows.
- Favor principles including ask/don't navigate, AI safely does the work, no blame/infantilization, preserved control, visible consequential action, familiar apps, calmness, and relationships over engagement.

## Design proposals

- Define semantic roles before final visual values and explore several warm, calm directions in Figma rather than defaulting to clinical blue or “AI” styling.
- Keep design tokens in Git so Figma and implementation share concepts.
- Treat accessibility as a first-class specification covering vision, hearing, dexterity, cognitive load, memory, language, timing, recovery, voice/touch alternatives, semantics, contrast, and motion.
- Candidate internal—not platform—values mentioned were controls at least 56 dp, primary actions around 64–80 dp, body text around 20 sp, important text around 24–32 sp, and headings around 32–48 sp. These require verification and user testing.
- Voice should be warm, concise, plain, interruptible, visible, and honest about uncertainty; progress language should describe the user's task rather than model processing.
- Never shrink text merely to fit a screen; simplify the screen instead.

## Agent and safety proposals

- Use autonomy levels: observe; safe navigation; prepare/reversible; confirmed consequential; explicitly delegated routine; restricted/high risk.
- Opening/searching may be unconfirmed; drafting may be prepared; sending, deleting, calling, and sharing require confirmation; purchases and security/credential work require stronger restriction/design.
- Distinguish conversation context, preferences, relationships, events, routines, stories, media/documents, calendar knowledge, sensitive data, and derived assumptions in memory. Define visibility, confidence, correction, expiry, sharing, and prohibitions.
- Use Observe → Understand → Plan → Act → Verify → Recover and prefer native API → semantic accessibility → structured automation → vision/coordinates.
- Candidate primitives included screen/elements inspection, app open, click/activate, tap, type, scroll, back/home, wait, screenshot, volume/brightness, and notifications.

## Evaluation and research proposals

- Turn important use cases into automated or semi-automated evals with starting state, success, failure conditions, and step limits.
- Track perception, intent, planning, wrong element/entity, unexpected dialog, authentication, UI changes, network/permission, unsafe blocking, user interruption, and repeated loops as distinct failures.
- Benchmark current Gemini/assistant behavior periodically against the same Granny target tasks. No example comparison or success percentage in the conversation was an observed result.
- Use short ADRs for consequential decisions and keep hardware specifications separate from future CAD artifacts.

## Items intentionally not adopted as decisions

Exact accessibility numbers, final color/type values, precise V1/MVP scope, cloud-first inference, Figma as an exclusive design source, a full 100+ use-case catalog, tool APIs, model/database vendors, and detailed hardware specifications remain proposals or open questions.
