---
title: Proto-personas, problems, and jobs
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [product, stage-1]
related:
  - prd.md
---

# Proto-personas, problems, and jobs

These are design hypotheses drawn from the [Dream Book](../00-vision/dream-book.pdf) and [captured planning](../08-research/source-material/planning-conversation.md), not participants or validated segments. Names in fixtures are synthetic. Age is neither a diagnosis nor evidence of preference.

## Problem register and jobs

| Problem / evidence status | Job | Outcome sought | Risky assumption / research |
|---|---|---|---|
| PROB-01 — knowing an outcome does not imply knowing the app/menu; hypothesis | JOB-01 — when I want something, help me reach it without learning a navigation sequence | Verified useful task with less assistance | Frequency and willingness to delegate unknown; RES-01, RES-07 |
| PROB-02 — changed screens can interrupt independent use; hypothesis | JOB-02 — when I am lost, explain where I am and help me continue | Recovery without blame or lost work | Explanation alone may be preferred; RES-01, RES-03 |
| PROB-03 — small targets, speech-only feedback, time pressure and hard-to-recognize organization can exclude people; access mechanisms established, prevalence here unknown | JOB-03 — let me choose how to see, hear, control and find this task or material | Equal outcomes through preferred access method and recognizable organization | Profiles and the Context Rooms hypothesis must be tested separately; RES-03/06 |
| PROB-04 — uncertainty about what an assistant did can undermine trust; hypothesis | JOB-04 — let me know what will happen, stop it, and check what happened | Accurate understanding and control | Confirmation may be too burdensome; RES-03 |
| PROB-05 — recurring explanation and family support can expose private context; hypothesis | JOB-05 — keep only context I choose and let me get help on my terms | Continuity without surveillance | Value of memory/helper access unknown; RES-08 |

Research IDs resolve in the [research plan](../08-research/research-plan.md). Requirements are in the [PRD](prd.md).

## P-01 — independent, uncomfortable with changing technology

**Context:** own/shared household tablet; familiar apps; wants ordinary communication and leisure. No age band, country, income, living arrangement, or impairment is asserted as fact.
**Capabilities:** makes own decisions, knows whom to contact, can express desired outcomes. Reading and speaking preferences vary.
**Goals:** see family photos, send the intended message, recover without waiting for support.
**Frustrations to investigate:** unfamiliar icons, app changes, authentication, uncertainty after pressing Send.
**Workarounds to observe:** repeat learned routes, leave an app open, phone a friend, abandon a task. These are interview prompts, not findings.
**Boundary:** assistance is optional; no hidden monitoring or automatic family authority.
**Access:** offer large text, touch entry, captions and adjustable speech without labeling a special senior mode.
**Highest-risk assumptions:** wants an agent rather than guidance; owns a compatible tablet; accepts narrowly disclosed cloud processing; tasks frequent enough to justify a new app.
**Jobs:** JOB-01, JOB-02, JOB-04. Proposed primary MVP segment.

## P-02 — cognitively independent, with access needs

**Context:** vision, hearing, or dexterity access needs considered separately and in combinations, not a single disability persona.
**Capabilities:** directs own affairs and chooses assistive tools; may be expert with TalkBack or a switch.
**Goals:** same tasks as P-01 with an effective input/output route; avoid forced voice, tiny precision controls, timed decisions.
**Frustrations/workarounds to investigate:** zoom, external keyboard, system accessibility tools, captions, headphones, repeated taps.
**Boundary:** do not infer health status from a setting, slower speech, or corrected input.
**Access:** screen reader focus, switch traversal, 200% text, no audio, reduced motion, stable targets.
**Highest-risk assumptions:** voice helps motor access in realistic noise; Granny coexists with existing accessibility services; supporting this persona makes the product eligible for a Play exception. The last claim is explicitly unestablished.
**Jobs:** JOB-01–JOB-04. Include in MVP research; claim support only for profiles that pass evals.

## P-03 — trusted helper, optional buyer

**Context:** relative, friend, or chosen supporter, sometimes at a distance. Buyer and device user may differ.
**Capabilities:** can help with installation or explain account setup; cannot grant consent on the adult's behalf.
**Goals:** fewer repeated interface-support tasks while preserving ordinary personal contact.
**Frustrations/workarounds to investigate:** verbal descriptions of screens, in-person setup, unsuitable remote support tools.
**Boundary:** purchase conveys no access rights. MVP help is co-present, on the user's screen. V1 permits user-reviewed configuration proposals only; remote screen/control is later App.
**Access:** invitation and revocation must also work for the primary user's access profile.
**Highest-risk assumptions:** user wants this person's help; interests align; device health reveals no sensitive routines.
**Jobs:** JOB-05 plus support for JOB-02. Interview separately from P-01/P-02.

## P-04 — higher-assistance context, excluded from MVP

**Context:** substitute decision-making, inability to give ongoing informed consent, institutional care, medical or safeguarding dependence.
**Goals:** may overlap with the product, but consent and duty-of-care models differ materially.
**Boundary:** no monitoring, emergency response, diagnosis, medication decisions, or surrogate consent model is defined. Do not recruit dependent users into an independent-adult pilot by assuming a family signature resolves this.
**Future research:** specialist protocol and explicit scope decision first; not a Stage 1 MVP requirement.

## Stakeholders and recruitment

Simon owns release decisions; product/research leads validate need; Android/agent engineers demonstrate feasibility; design/accessibility leads validate interaction; safety/privacy reviewer gates real data. These are discipline assignments, not claims that staff are hired. Recruitment should include people who decline voice or delegation and people without a nearby helper. Do not use only relatives of the team.
