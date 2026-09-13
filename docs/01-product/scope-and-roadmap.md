---
title: Stage 1 scope and product progression
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [product, stage-1]
related:
  - prd.md
---

# Stage 1 scope and product progression

**Confirmed:** only the stock-Android app is active under [ADR-0007](../09-decisions/ADR-0007-three-stage-product-strategy.md). **Proposed:** the release boundaries below; acceptance belongs to Simon through [ADR-0009](../09-decisions/ADR-0009-mvp-and-control-posture.md). The [PRD](prd.md) owns testable behavior; execution gates live in [development readiness](../10-execution/development-readiness.md).

## Separate products and releases

| Horizon | Definition | Evidence needed |
|---|---|---|
| Vision | A personal computer experience that understands intent, acts, remembers appropriately and supports human connection | Long-term direction; not a checklist |
| Stage 1 App MVP | A supervised, bounded thesis experiment on inventoried stock tablets: five workflows, explicit activation, touch parity, local enforcement and truthful recovery | Task value, control and distribution evidence before real-user pilot |
| Stage 1 App V1 | Maintainable release for independent adults in a selected market, with tested app/device support, support operations and correctable explicit memory | MVP evidence plus localization, retention, reliability and support gates |
| Later Stage 1 | Wider apps, stories, cross-app search, optional remote help and bounded routines | Separate task evidence and decisions |
| Stage 2 OS | future-stage context: OS ownership | Dormant; Simon must activate |
| Stage 3 hardware | future-stage context: integrated tablet/base | Dormant; Simon must activate |

## MVP — In / Out / Why

| Area | In | Out | Why |
|---|---|---|---|
| Signature jobs | UC-002 photos; UC-003/011 explain/recover; UC-006 draft/confirm message; UC-004 media; UC-007 accessible adjustment | Calls, reminders, broad search as release promises | Cover observation, entity resolution, navigation, consequence, verification, recovery and immediate benefit |
| Apps | One versioned communication candidate and one media candidate, approved per capability | Every installed app; blanket compatibility | Bounded reproducible evidence |
| Agent | API capabilities; fixed human-authored recipes only if policy validation supports them; dynamic planner in synthetic lab only | General autonomous AccessibilityService in a public general-assistant build | Policy materially constrains the distribution model |
| Communications | Exact draft and fresh approval for external handoff; executor send only with a supported, independently verifiable integration admitted at gates | SMS inbox/telephony assumption; silent send; claiming delivered from a click | Tablet may have no telephony; intents do not prove delivery |
| Observation | User-started, scoped semantic inspection where permitted; selected screenshot for explanation | Continuous screen/audio recording; secure-window bypass; coordinate commit | Minimize exposure and test semantics |
| Memory | Local UI preferences and user-entered contact aliases; current session context | Automatic autobiographical extraction, transcript archive, cloud sync | Test continuity without a life archive |
| Help | User-led co-present setup, privacy-safe diagnostics preview/export | Remote family console, screen/control access | Avoid creating surveillance/account infrastructure |
| Voice | Tap to talk; explicit listening window; Stop touch control; typed intent | Always-on/wake-word, ambient initiation, physical privacy indicator | Stock app lifecycle and home noise remain untested |
| Installation | Synthetic lab build first; supervised pilot route selected at GATE-04 | Public store launch, bypassing restricted settings | Feasibility is not distribution approval |

## App V1 — In / Out / Why

| Area | In (after evidence) | Out | Why |
|---|---|---|---|
| Core | Reliable MVP flows plus known-person call, basic reminders, selected document opening, read-aloud and in-app history | Arbitrary delegated tasks | Coherent daily value with supportable boundaries |
| People/memory | Explicit preferences, relationship aliases and important dates with provenance, correction, deletion and export | Inferred health, passive personal graph, recorded stories | Continuity with understandable control |
| Family | Optional authenticated helper proposes contact/accessibility changes; adult reviews locally | Private content access, remote operation or surveillance | Support without overriding primary user |
| Platform | Published tested device/OS/app/locale matrix and regression process | “All Android tablets” | App versions and OEM behavior vary |
| Service | Account only if selected integration requires it; scoped provider consent and support/runbooks | Mandatory family account, ads, engagement optimization | Keep ownership and dependencies clear |

## Capability map

M = MVP, V = App V1, L = later App; a proposed inclusion is conditional on its gates.

| Capability | M | V | L | Stage 2 / Stage 3 |
|---|---|---|---|---|
| Home, voice/touch, visible state, stop, verification | Must | Maintain | Maintain | future-stage context only |
| Recent message photos, explain/recover, message preparation, media, in-app text adjustment | Must | Extend tested support | Wider apps | No dependency |
| Sending through supported integration | Conditional; handoff otherwise | Tested route required for claimed send support | More channels | No dependency |
| Calls, reminders, documents, read-aloud | Out | Must for selected supported routes | Extend | No dependency |
| Explicit private memory, export | Preferences/aliases only | Must | Richer classes | No dependency |
| Helper proposals | Co-present only | Should | Extend | No dependency |
| Story capture/derived artifacts; remote help; proactive routines | Out | Out | Could after new safety/eval gates | No current OS/hardware requirement |
| Persistent OS-wide ownership; far-field dock | Out | Out | Out | Dormant Stage 2 / Stage 3 respectively |

## Why these five workflows

Proposed 1–5 judgment scores (not research); higher is better. Feasibility is uncertainty-adjusted, not a measurement.

| Workflow | Value | Thesis coverage | Feasibility | Bounded safety | Differentiation | Evalability | Choice |
|---|---|---|---|---|---|---|---|
| Photos from known person | 5 | 5 | 2 | 4 | 5 | 4 | MVP; strongest feasibility risk |
| Explain/recover screen | 5 | 5 | 3 | 4 | 5 | 5 | MVP; separate explanation from action |
| Draft/confirm message | 5 | 5 | 3 | 3 | 4 | 5 | MVP; commit/handoff evidence explicit |
| Media | 4 | 4 | 3 | 4 | 3 | 5 | MVP; reversible delegated outcome |
| In-app text adjustment | 4 | 3 | 5 | 5 | 3 | 5 | MVP; reliable access benefit |
| Known-person call | 5 | 4 | 2 | 3 | 3 | 4 | V1; tablet calling route unknown |
| Story archive | 3 | 2 | 3 | 2 | 5 | 3 | Later App; privacy/research burden |

If photos cannot be verified in a permitted route, report a scope failure and ask Simon to replace/defer that workflow; do not quietly redefine “photos Sophie sent” as arbitrary gallery images. A handoff counts as successful preparation, never delegated task completion. MVP thesis gate requires at least two useful externally verified delegated workflows; in-app resizing alone cannot validate the thesis.

Roadmap sequence: foundation → device/policy spikes and interaction/identity prototypes → controlled technical prototype → MVP → pilot → App V1. Exact entry/exit conditions and dependency ordering are in [readiness](../10-execution/development-readiness.md) and [backlog](../10-execution/backlog.md).
