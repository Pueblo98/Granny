---
title: "Claude design-session handoff and Figma library manifest"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [design, handoff, figma]
related:
  - design-system.md
  - product-design-spec.md
  - accessibility.md
  - voice-ux.md
  - figma.md
  - ../10-execution/brainstorming-alignment.md
  - ../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md
  - ../10-execution/sessions/2026-09-17-vault-design-handoff.md
---

# Claude design-session handoff

## Read this first

Simon rejected the current browser UI on 2026-09-17: too many buttons and a generic AI appearance. He wants to settle product questions first, then work on design in a separate Claude session. The prototype demonstrates bounded interactions and test fixtures; its visual composition is not approved and must not become the design system by copying its CSS.

Audience: older adults using an ordinary stock-Android tablet app. Goal: express an everyday intention, understand what will happen, retain control and receive a truthful result with little configuration. Emotional posture: calm, capable and adult. Granny remains a temporary codename. No final font, name, palette or logo is selected.

Source baseline: product-decision commit e573547, merged by a200395 on 2026-09-17, plus this handoff's current feedback. This file is an exportable entry point into the existing knowledge base; linked canonical owners remain authoritative. Check for later decisions before starting the Claude session.

## Artifact status and target

Authorized target: [Simon's Figma design file](https://www.figma.com/design/lyfsTF7BrZ0Ywv36fhRXHp/Untitled). MCP authentication and page 0:1 metadata access succeeded. That page was empty. Library discovery succeeded, but component/token search failed with the Starter-plan MCP call-limit response. **No design-system objects have been created or visually verified in this file.** This is the preparation manifest, not a delivered Figma library.

Figma authoring remains authorized in this file once access is restored. Inspect current contents again before changes. Do not mutate the historical exploration file, publish a library or create Code Connect mappings as part of this task. No browser UI changes are included.

## Product decisions before composition

Read the [alignment brief](../10-execution/brainstorming-alignment.md) and [decision queue](../10-execution/open-questions.md).

| Status | Direction | Design consequence |
|---|---|---|
| Accepted experiment scope | Five MVP experiments: photos, explain/recover, message preparation/approval, media and in-app readability | Design reusable task content; do not turn five experiments into five Home buttons |
| Retained approval policy | Admitted reversible steps can proceed with low friction; consequential effects require specific fresh approval | Preserve exact target/content/effect and reachable Change/Cancel; simplify surrounding chrome |
| Retained release split | MVP, App V1 and later App remain separate | Future features must not populate the MVP interface by default |
| Accepted App V1 direction | Automatic admitted important facts and bounded communication adaptation after setup preference; ADR-0012 | V1-only quiet receipt/Undo, review, pause/reset and correction; no transcript archive or new action authority |
| Open: Home | Conversation canvas, persistent dashboard, or conversation with a small user-owned pinned shelf | Do not freeze navigation, persistence or pinning in the foundation library |
| Accepted: generated interface | [ADR-0013 bounded composition](../09-decisions/ADR-0013-bounded-interface-composition.md): agent selects/fills/orders registered semantic components through typed plans | Explore flexible compositions without arbitrary controls, event handlers, consequence labels or movement of stable anchors |
| Open: visual identity | Name, typeface, territory, dark-mode values and final assets | Use provisional review values; no implied brand acceptance |

Home controls what persists and where. ADR-0013 controls what the agent may construct. Review the accepted composition boundary inside each Home direction without reopening arbitrary generated controls.

## Design-session starting prompt

> Work with me on the design of a stock-Android tablet assistant for older adults. Read this handoff and its canonical sources before proposing visuals. I rejected the prototype because it has too many buttons and looks generically AI-generated. Help me settle Home/persistence while preserving accepted bounded composition: the agent may compose registered semantic components through typed plans, never invent executable controls or action semantics. Do not treat Home recommendations or old prototype behavior as my acceptance. Then explore three structurally different Home directions using the same fictional message task, exact consequence, Stop behavior and accessibility requirements. Include the stable-anchor-plus-one-context-layer hypothesis. Explain what each visible control earns. Favor readable content, stable placement and direct language; avoid capability grids, prompt-chip walls, decorative AI sparkles, generic gradients, repeated floating cards and hidden icon-only actions. Keep necessary safety controls and complete touch access. Show neutral composition before brand treatments. Do not implement the application, change action policy or promote product gates without my separate request. Return editable references, component/state coverage, provisional tokens, accessibility annotations and remaining decisions.

## Canonical source map

| Question | Owner |
|---|---|
| Release boundaries and outcomes | [Scope](../01-product/scope-and-roadmap.md), [PRD](../01-product/prd.md), [journeys](../01-product/user-journeys.md) |
| Accepted decisions | [ADR index](../09-decisions/README.md), [MVP/control](../09-decisions/ADR-0009-mvp-and-control-posture.md), [V1 memory/adaptation](../09-decisions/ADR-0012-automatic-memory-and-adaptive-communication.md) |
| Open choices | [OQ-14 alternatives](../10-execution/brainstorming-alignment.md), [decision queue](../10-execution/open-questions.md) |
| Screens and transitions | [Product design](product-design-spec.md), [conversation plan](conversation-first-plan.md) |
| Reusable behavior and dimensions | [Design system](design-system.md) |
| Contrast, scaling and input equivalence | [Accessibility](accessibility.md) |
| Tone, capture and exact copy | [Voice](voice-ux.md) |
| Consequences and private data | [Action policy](../05-safety-privacy/action-policy.md), [privacy](../05-safety-privacy/safety-and-privacy.md) |
| Tokens and candidate identity | [Token boundary](../../design-tokens/README.md), [brand](brand-and-visual-identity.md), [naming](naming-exploration.md) |
| Figma conventions | [Figma contract](figma.md) |

## Foundation manifest — provisional

These are review starting points from existing owners, not new accepted tokens. Before creation, resolve font availability and conflicting library values. Figma reference geometry is not measured Android dp/sp compliance.

| Foundation | Manifest |
|---|---|
| Semantic colors | Background, surface, raised surface, primary/secondary text, border, primary action/on-primary, decorative accent, success/warning/danger, focus and disabled. Alias semantics to primitives. Status includes words or symbols. |
| Neutral fixture | White canvas; #152522 text; #123B36 primary; #982D35 danger; #5C32A3 focus, from the token README. Measure every actual foreground/background combination. Other role values remain to be specified; this is not a complete palette. |
| Type size/line-height | Display 32/40sp; heading 28/36; body 20/30; body-large 24/34; button/status 20/28; supporting 18/26. Regular body and semibold labels; exact family/metrics pending review. |
| Spacing | 4/8/12/16/24/32/48dp; screen inset 24, narrow 16; distinct primary targets separated by 12; internal label/icon gap 8. |
| Targets | At least 56dp; primary/Stop/consequential controls at least 64dp high. Labels wrap and targets grow. Fewer buttons never means smaller targets. |
| Shape/elevation | Small/control/container/dialog roles; radii remain candidates. Flat layout; spacing/borders group content. No required shadow or depth-only meaning. |
| Focus/motion | Proposed 3dp ring with 2dp separation; at least 3:1 distinction. Press/state/panel 120/180/240ms; reduced motion uses immediate static equivalents. |
| Scaling | 360/600/840 reference widths, both orientations, 100/130/200% system-font scenarios plus combined 200% system and 1.5 app scale. Never clip exact previews or hide Stop. |

No dark palette is accepted. Record missing coverage until actual pairs and tests exist. Every eventual token needs name/value/unit/mode/maturity/source, scope and code syntax. No production Android mapping is claimed.

## Component library manifest

Build atoms before composites; retain canonical CMP identity. Use `Granny/<role>` names, meaningful state properties, editable text, auto-layout and token bindings. This catalog is not a screen displaying every control at once.

| Contract | Required specimens | Essential annotations |
|---|---|---|
| CMP-007 controls | Primary/secondary/destructive buttons, labeled field, On/Off switch, adjustment with +/− | Enabled/focus/pressed/disabled-with-reason/loading/error where applicable; one primary per decision region |
| CMP-001 escape | Stop, Cancel, Take over and reconciliation | Stable reachable location while active; Stop never disables; distinguish no effect from unknown in-flight effect |
| CMP-002 input | Talk, listening, partial/final transcript, typed alternative, capture error | Explicit capture state; intent submission is not consequence approval; no ambient microphone |
| CMP-003 preview | Ready/editing/expired/invalidated/long-content variants and separate deletion preview | Exact recipient/channel/content/effect; named approval, Change/Cancel; no autofocus approval or historical-turn execution |
| CMP-004 activity | Planning/waiting/verifying with goal/current/last-verified step | No guessed percentage or model reasoning; 5s dependency text, 15s manual-route proposal; include Stop |
| CMP-005 choice | Normal/selected/focused/no-match/more-results; duplicate-name fixture | One question, actual differentiator, stable entity identity, whole-row target, up to five results |
| CMP-006 outcome | Verified complete, prepared/handoff, partial, unknown, interrupted, cancelled, safely failed | Words and evidence; no generic success toast or automatic retry after unknown effect |
| CMP-008 guidance | Inline obstacle; data/grant disclosure; decline/denied/revoked; system-handoff placeholder | Data/purpose/destination/decline effect; annotate system-owned UI as device dependent |
| CMP-009 content/settings | Photo result, media row, history row, preference preview/restore and empty states | Labeled state; no autoplay or history message body; preserve focus/list position |

V1 memory/adaptation controls belong on a separately labeled future-release review page under ADR-0012. They do not add an always-visible MVP toolbar. Validate applicable states; do not invent irrelevant Cartesian combinations.

## Planned Figma structure and verification

1. Read me: source commit, latest feedback, open decisions, maturity and change log.
2. Foundations: variables, type, spacing, targets, focus, contrast and units.
3. Components: one page per family or related group, variants and usage/accessibility notes.
4. Review cases: exact message, ambiguous person, Stop/unknown outcome, long text and enlarged text. Final Home composition awaits Simon's choices.
5. Handoff: actual node URLs, coverage/gaps, token maturity, revision and Claude prompt.

Complete discovery before authoring: inspect local assets, enumerate libraries, search components/tokens, record code-versus-Figma gaps and lock the v1 inventory. Then create foundations, build and validate one component family at a time, and audit bindings, names, contrast, targets and reflow. Capture and inspect actual screenshots. Never report wrappers or a manifest as completed components.

Use fictional David/Sophie fixtures. Exact example: “I'll call after dinner.” A local demo result says the draft was saved locally and not sent; Android handoff is a separate proposed route. Unknown send status must not become success to simplify a screen.

## Acceptance and next work

Ask Simon to assess structure and visible interface before polishing. Each retained control serves entry, current task, exact approval, recovery or essential navigation. A calm surface may have few controls at rest and more when a real decision requires them.

Figma delivery requires completed discovery, actual bound variables/styles/components, verified declared variants, inspected screenshots, exact node references and review exports. MCP quota is currently the blocker. Device/TalkBack/switch/user studies remain unrun; neither Figma review nor a component catalog passes a production gate.
