---
title: "Stage 1 Figma execution and handoff contract"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [design]
related:
  - product-design-spec.md
  - brand-and-visual-identity.md
  - naming-exploration.md
  - ../../design-tokens/README.md
---

# Figma execution and handoff contract

No Figma file has been created by this specification mission. The [local identity board](identity-review.html) is an exploratory repository artifact, not an interactive product prototype or final asset. [Product design](product-design-spec.md) owns behavior; [identity](brand-and-visual-identity.md) owns candidate styling; [naming](naming-exploration.md) owns candidate words.

## First package: interaction before styling

Create one Stage 1 design file only after authorization to write to Figma. Owner Simon; designer maintains components. File description links this repository and source commit. Pages in order:

| Page / sections | Exact deliverable | Gate |
|---|---|---|
| 00 Read me / decisions | Source commit, proposed status, device assumptions, linked PRD/UC/J/SCR IDs, outstanding choices, change log | No implicit approval by polished appearance |
| 01 Foundations / neutral | Layout grid, scale, focus, targets, status semantics, neutral provisional colors | Measured accessibility before reuse |
| 02 Components / neutral | CMP-001–009 with every applicable state and keyboard/TalkBack notes | Design-system contract |
| 03 Interaction / MVP | J-001/002/003/005/006 plus J-007 setup; low-fidelity grayscale | Interaction review before identity preference |
| 04 Identity comparison | Four territories, identical SCR-003 Home and SCR-007 confirmation at 600dp portrait; SCR-004 listening and SCR-008 failure for each | No different copy/layout confounding style comparison |
| 05 Identity production | Finalist wordmarks, symbols, responsive lockups and application tests, still proposed | Simon selects direction, specialist checks name |
| 06 Prototype tests | Named flows below, participant-safe fictional content | Research consent, no real account data |
| 07 V1 and deferred | J-008 call and J-004 helper proposal only; visibly out of MVP; remote help not designed as shippable | V1 gate |
| 08 Handoff | Approved-versus-proposed coverage, assets, tokens, redlines, unresolved behavior and acceptance checklist | Git record before implementation |

### Required first interaction frames

Frame convention: `J-003/SCR-007/confirm-draft/portrait-600/font-100/proposed`. Use stable IDs, not “Screen 12 final”. The journey documents enumerate screen sequences; these minimum variants cannot be dropped:

| Journey | Required frames and transitions |
|---|---|
| J-001 photos | Home → transcript → two-person choice → channel/date clarification → activity → matching results; no matches, unknown date, revoked access, inaccessible tree, mark-read consequence, offline, Stop |
| J-002 explanation/recovery | Explicit screen selection → scope/privacy notice → bounded explanation → offered recovery → verification; secure view unavailable, injected instructions ignored, permission/auth loss, failed recovery, unknown result |
| J-003 message | Request → duplicate David → exact recipient/channel/text preview → Change it → fresh preview → explicit handoff confirmation → external-app representation → “Draft opened; tap Send”; separately admitted send and verified sent, expired approval, cancel/in-flight unknown |
| J-005 media | Intent → title/artist/service choice → progress → verified playback; search-only partial, paywall, ads, signed out, pause, network loss |
| J-006 text size | Scope clarification → in-app size preview → Apply → verified new layout → Restore; external-app scope explained, 200% layout, no-speech alternative |
| J-007 foundation | First launch/value → each optional disclosure → Android-owned grant placeholder → recheck result → Home; denied mic/screen/cloud, typed-only setup, history empty/result/delete, memory alias review/correction/delete, privacy controls, support export preview |
| Global task states | SCR-005 + SCR-008 + SCR-014: all 19 states in state table, including partial, interrupted, cancelled, recovering, permission lost, authentication, unsupported; disabled/loading controls and timeout without disappearing preview |

System app screens use annotated neutral placeholders: “Android-owned; exact layout device dependent”. Do not imply Granny can restyle grants, secure windows, call screens or another app. Include external-app Stop/return surface alternatives tagged **feasibility unknown**, never a decorative overlay assumed to work.

## Components and responsive contract

CMP-001 Stop/Take over, 002 microphone/transcript, 003 consequence preview, 004 activity, 005 choices, 006 outcome, 007 buttons/forms, 008 guidance/permissions, 009 lists/media/settings compose all screens. Component names `Granny/Confirmation/prepare`, properties `state`, `inputMode`, `consequence`, `sizeProfile`, `themeCandidate`; identity name is a property, not four forked behavior libraries.

Use auto-layout with wrapping text; no fixed-height text containers, truncation of recipients or scrolling-hidden Stop. Layout constraints: 360/600/840dp logical widths; portrait and landscape; 100/130/200% font scenarios. These are design reference units, not proof of Android reflow. Touch bounds ≥56dp, main/Stop ≥64dp, 12dp gaps. Annotate nonvisual label/role/state, focus order, status live announcements, switch/keyboard route, focus restoration, reduced-motion equivalent and sensitive regions.

Each screen annotation includes entry/preconditions, state owner, permission/data provenance, allowed actions/exit, invalidation, timeout, empty/loading/error/cancel variants, exact copy, requirement links, eval IDs, and unresolved assumptions. Focus indicators, pressed/selected/loading/disabled/error/success variants must exist. Disabled controls state why; no disabled Cancel while processing.

## Prototype test connections

Start links: “Find Sophie's photos”, “Explain this screen”, “Draft for David”, “Play chosen music”, “Make my text bigger”, “Set up without voice”. Each has happy and failure route. Add adversarial operator switches for duplicate person, changed draft after approval, unknown send, revoked permission and user takeover. Wizard-of-Oz behavior must be disclosed in research; no participant believes prototype can send.

Test tasks in [EVAL-012](../06-evals/canonical-tasks.md#eval-012) and [RES-03](../08-research/research-plan.md#res-03): find entry without coaching, correct mistaken intent, explain consequence before confirming, stop, distinguish partial from complete, return after manual action. Record hesitations/interpretations rather than “liked it” alone. Counterbalance identity order; compare naming spoken separately from logos. Family feedback does not override adult consent or preference.

## Identity production package

Produce each of three finalist wordmarks with at least two symbol families (not three near-identical badges), using all four territories only on the comparable exploration screens. After Simon narrows, deepen one direction with a challenger; no requirement to finalize name to test layout. Test horizontal/stacked/mark-only, monochrome/reverse, small app-icon masks, light/dark/high-contrast, clear space and 24/48dp mark recognition. Minimum sizes remain evidence-needed until measured.

Applications: first launch, Home, listening, confirmation, failure, app-store icon/listing mock, one simple product announcement. Avoid clinic/robot/grandmother imagery and meaningless AI sparkles. Gather confusion and name/mark recall with older adults and helpers. Reject if confirmation loses hierarchy or essential contrast, not only on taste.

## Review and Git handoff

GATE-05 requires: all MVP flow states reviewable; 200% and nonvoice paths complete; no critical result conveyed only by color/audio; representative comprehension evidence; Simon records name/territory choice or explicitly permits provisional name for a bounded prototype. Public identity additionally needs professional trademark/linguistic checks. No fake clearance.

Designer exports source-owned SVG (clean paths, no remote fonts/scripts) for symbols, PNG at required raster sizes, PDF review sheets and editable Figma source reference. Naming: `identity/<direction>/<candidate>/<asset>-<variant>.<ext>`; do not export “final-final”. Keep private participant research out of design files and Git. Font packages require exact version, license and glyph coverage before embedding.

Workflow: brand foundation → four territories → Simon/evidence → selected proposed direction → validated semantic token map/assets → Figma components/prototypes → explicit accepted decision + Git-backed tokens → Android implementation. [Token README](../../design-tokens/README.md) owns export policy. Submit focused diff with source version, contrast report, component coverage, changed requirements and migration notes. A Figma visual change cannot silently change action policy, scope or confirmation. Simon alone accepts product/identity decisions; engineer verifies implementation against the same IDs.
