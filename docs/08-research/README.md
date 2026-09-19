---
title: "Research and source register"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [research]
related:
  - research-plan.md
  - android-stage-1-feasibility.md
  - 2026-09-19-t101-route-inventory.md
  - source-material/initialization-handoff.md
  - source-material/planning-conversation.md
  - source-material/2026-09-17-class-brainstorming.md
---

# Research and source register

[Execution protocols](research-protocols.md) supply moderator prompts, consent/worksheet boundaries and deidentified synthesis for the planned studies. [Evidence protocol](../06-evals/evidence-protocol.md) defines how actual results are recorded and reviewed. No new participant/device evidence was collected during workflow refinement.

Workflow-tool source, accessed 2026-09-14: OpenAI [Build skills](https://learn.chatgpt.com/docs/build-skills) documents repo-local .agents/skills discovery, SKILL.md name/description metadata and optional UI settings. This establishes the packaging convention, not successful discovery or behavioral reliability in a fresh session. Repository skills are instruction-only and do not install global plugins/configuration.

[Research plan](research-plan.md) owns hypotheses, methods, ethics and evidence gates. No completed user/device study is implied by a specification. [Android feasibility](android-stage-1-feasibility.md) owns platform/policy conclusions; the [2026-09-19 T-101 route inventory](2026-09-19-t101-route-inventory.md) records the five-workflow source recheck and synthetic worksheets, while the [partial manual physical inventory](2026-09-19-t101-physical-inventory.md) records non-identifying Settings observations. [Naming](../02-design/naming-exploration.md) owns preliminary candidate screening. Store future dated observations using the [research template](../_templates/research-note.md), not by editing source history.

## Preserved inputs

| Source | Role / limits | Preservation |
|---|---|---|
| [Initialization handoff](source-material/initialization-handoff.md) | Governing initialization source; current user and accepted decisions take precedence | SHA-256 80f9a4a56824ed9639d09292d4faf089b51fb4e6eccc55f467734288cf628d1d |
| [Dream Book TeX](../00-vision/dream-book.tex) | Long-term vision, mixed stages; not Stage 1 requirements | SHA-256 6e6623afdfa857e997ed2e7cb5e8cafb66e49fd4632002c7ef800026dac373cf |
| [Dream Book PDF](../00-vision/dream-book.pdf) | Rendered vision; future-stage context separated by canonical specs | SHA-256 6524a06676c0926e78853769bc7fd6dd595bdd1fdf0d86a2683f52f23dbae7f4 |
| [Planning conversation](source-material/planning-conversation.md) | Captured historical proposals, not approval/research results | SHA-256 d1d4edd3419123df3a3470720d2fda1932c68ba38fdd40df62c9a8aa003106d5 |
| [Simon's class brainstorming](source-material/2026-09-17-class-brainstorming.md) | Structured capture of Simon-authored ideas and proposed P1–P9 sequence; source note records the original supplied-file hash; conflicts require a current decision | SHA-256 93ca1ef2e43610771588b3642a27693d9433e1c63555babf8509022566ee1f35 |

## Current primary-source desk evidence — accessed 2026-09-13 and rechecked 2026-09-19

| Publisher / source | Establishes | Limits / canonical analysis |
|---|---|---|
| Google Play, [AccessibilityService policy](https://support.google.com/googleplay/android-developer/answer/10964491?hl=en) | General autonomous initiation/planning/execution restrictions, static rule distinction, accessibility-tool criteria and disclosure | Not approval for Granny; [feasibility](android-stage-1-feasibility.md) and [T-101](2026-09-19-t101-route-inventory.md) map routes |
| Google Play, [sensitive permissions](https://support.google.com/googleplay/android-developer/answer/16558241?hl=en), [User Data](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en) | Permission and data/disclosure obligations | App/market-specific review still needed; no broad legal conclusion |
| Android Developers, [accessibility services](https://developer.android.com/guide/topics/ui/accessibility/service), [AccessibilityService reference](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService) | User-granted observation/action APIs and lifecycle | Does not establish target-app semantic quality or store permission |
| Android Developers, [MediaProjection](https://developer.android.com/media/grow/media-projection), [foreground-service restrictions](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start) | Capture grant/lifecycle and background limits | Secure windows/OEM/versions require tests |
| Android Developers, [common intents](https://developer.android.com/guide/components/intents-common), [package visibility](https://developer.android.com/training/package-visibility) | Supported intents are scoped integrations, app-query restrictions | App launch is not task verification |
| Android Developers, [Media3 controller/session](https://developer.android.com/media/media3/session/connect-to-media-app); Spotify, [Android SDK](https://developer.spotify.com/documentation/android) | Owner-exposed media sessions can accept controllers; Spotify's beta SDK documents authorized playback and PlayerState | Conditional named-route lead only; app/account/version/terms/device evidence remains unrun |
| Android Developers, [DataStore](https://developer.android.com/topic/libraries/architecture/datastore), [scalable content](https://developer.android.com/develop/ui/compose/accessibility/scalable-content) | Current app-local preference storage and own-content scaling guidance | Does not select a framework or prove layout/accessibility on the tablet |
| Android Developers, [accessible apps](https://developer.android.com/guide/topics/ui/accessibility/apps); W3C [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Platform target/contrast/semantics guidance and web criteria | [Accessibility spec](../02-design/accessibility.md) separates native internal targets from external minimums; no compliance certification |
| Official foundries/repositories linked in [identity](../02-design/brand-and-visual-identity.md) | Candidate typeface provenance and licenses | Exact version, glyph coverage and performance untested; no fonts installed |
| Primary company/app pages and CIPO linked in [naming](../02-design/naming-exploration.md) | Observable competing uses and specific trademark lead | Discovery screening only; unknown markets and unsearched classes; no clearance |

Desk-source dates are access dates, not publication/effective dates unless source explicitly says so. Recheck unstable API/policy/provider/competitor facts before implementing affected capability or distribution submission. Record changed source and resulting ADR/spec impact, not just replace URL.

Evidence confidence: official documentation supports a platform/policy statement; physical experiment supports only the measured configuration; small formative study supports observed themes, not market demand. An inference and a proposed target must be labeled. Specialist legal/privacy/accessibility/trademark review is not replaced by this register.
