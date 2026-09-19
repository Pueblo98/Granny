---
title: "Stage 1 Figma execution and handoff contract"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design]
related:
  - product-design-spec.md
  - brand-and-visual-identity.md
  - naming-exploration.md
  - ../../design-tokens/README.md
---

# Figma execution and handoff contract

## Authorized design-system handoff — 2026-09-17

Simon requested a reviewable design system in [this exact file](https://www.figma.com/design/lyfsTF7BrZ0Ywv36fhRXHp/Untitled), aligned with Obsidian and portable to a separate Claude design session. This authorized scoped foundation/component authoring there; historical paused-medium language below did not prohibit that task. After the quota block, Simon requested separate Claude Code system-construction and Claude Design app-composition briefs. Those superseded briefs were retired from the working tree after the browser prototype became the active design medium; their delivery records and Git history remain. They did not depend on Figma or authorize copying the rejected button-heavy composition or accepting final brand values.

Official MCP authentication, page 0:1 metadata and library discovery succeeded on 2026-09-17. The page returned empty. Component/token search then failed with the Starter-plan MCP tool-call limit. No Figma objects were created or visually verified. Restore quota before resuming discovery and native authoring; do not add duplicate connections or infer authoring access from login success.

## Paused medium — browser-first from 2026-09-14

**Confirmed direction from Simon:** continue designing in a local browser prototype and update the documentation. [Browser design/handoff](browser-prototype.md) supersedes this file as the active execution contract. This change does not select a web product architecture or accept brand values. The detailed Figma package below is retained for optional future use, not a prerequisite, current backlog instruction or request to reconnect/upgrade.

The existing [Stage 1 exploration file](https://www.figma.com/design/ZNT7zmXHjiPhXaCfafjM4g/Granny-Stage-1-Exploration) contains an overview, Home and 24 confirmed empty wrappers across three pages. Its last authoring run stopped at the Starter MCP quota. [Historical exact-node handoff](https://github.com/Pueblo98/Granny/blob/docs/figma-mvp-prototype/docs/02-design/figma-prototype-handoff.md) is preserved on the earlier branch. No complete Figma prototype or synchronization with the browser is claimed. No Figma edits were made during the browser task.

The original specification mission created no Figma file; subsequent partial authoring is recorded above. The [local identity board](identity-review.html) is an exploratory repository artifact, not an interactive product prototype or final asset. [Product design](product-design-spec.md) owns behavior; [identity](brand-and-visual-identity.md) owns candidate styling; [naming](naming-exploration.md) owns candidate words.

## Official Figma MCP connection

The official remote Figma MCP connection was verified from Codex on
2026-09-14. Authentication succeeded; no Figma file was created or changed.
Account identifiers and OAuth credentials are deliberately not stored in the
repository. The current authenticated seat reports Starter/View. Figma's
current documentation says Starter and View/Collab seats on paid plans can be
limited to six MCP tool calls per month, so confirm the live plan/limits before
a substantial design run and use exact node-scoped calls.

Preferred connection path:

1. In Codex, open **Plugins**, find **Figma**, install/connect it, and complete
   Figma OAuth. The existing host connection already passed this step.
2. Restart Codex if the tool list does not refresh; use `/mcp` in the Codex TUI
   or MCP settings in the desktop/IDE client to confirm the server is active.
3. Verify authentication with the Figma identity/account check before
   diagnosing file access. Do not record returned email, team IDs or tokens.
4. If the plugin is unavailable, configure the official remote URL as a
   user-level MCP connection and run OAuth:

   ```text
   codex mcp add figma --url https://mcp.figma.com/mcp
   codex mcp login figma
   ```

5. Use Figma's desktop MCP at `http://127.0.0.1:3845/mcp` only for an
   organization-specific need. It requires the Figma desktop app, an open
   design file, Dev Mode, and the local MCP toggle; the remote server is the
   default for Granny.

Codex can scope MCP servers in `.codex/config.toml` for trusted projects, but
Granny intentionally does not duplicate the working official plugin
connection. Never commit bearer tokens, OAuth credentials or static
authorization headers. See the current [Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp)
and [Figma's Codex setup guide](https://help.figma.com/hc/en-us/articles/39888629089175-Codex-and-Figma-Set-up-the-MCP-server).

## MCP authorization and source-of-truth boundary

Connection does not grant blanket permission to mutate Figma. Use these rules:

| Operation | Default for a scoped design/development task | Required context |
|---|---|---|
| Verify connection/account | Read-only | No account identifiers committed |
| Read metadata, variables, components or screenshot | Allowed when needed for an authorized shared design | Exact file/node URL and purpose |
| Create a Granny Figma file | Ask for/confirm current external-write authority | Destination team/project, file name and initial pages |
| Add or update frames/components | Requires authorized target and bounded manifest | Existing file/page, J/SCR/CMP IDs and expected changes |
| Publish library or modify Code Connect | Separate explicit authorization | Version, mappings, affected code/components and rollback |
| Delete/archive/move files or broad content | Never infer authorization | Exact targets and explicit confirmation |

Git owns accepted product behavior, requirements, action policy, accessibility
contracts, stable IDs and machine-readable tokens. Figma owns editable visual
composition, component/variable application and prototype connections. When a
review changes behavior, update Git's canonical owner first or in the same
change. When Simon accepts visual values, record the real Figma file/node and
version references in this document and promote the corresponding Git tokens.

## MCP design-to-development loop

### Repository to Figma

1. Select one bounded task packet, normally T-102 or T-108, and prepare its
   frame/variant annotation manifest before canvas mutation.
2. Load the official Figma authoring skills. Search the target design system and
   libraries before creating components. For Android/non-web UI, use native
   Figma authoring rather than a browser screenshot as the editable source.
3. Create or update only the authorized pages/frames. Name them with the stable
   J/SCR/CMP convention below and annotate source commit, fidelity and status.
4. Return actual file/frame URLs to this handoff contract. Never invent a URL or
   call a generated frame accepted.

### Figma to Android code

1. Start from an exact Figma frame/component URL, linked PRD/J/SCR/CMP IDs and
   an implementation task that meets Definition of Ready.
2. Load the official Figma design-to-code skill, then retrieve structured design
   context as the primary input and a screenshot as the visual reference.
3. Map Figma variables/components to the Git-backed semantic token and Compose
   component owners. Reuse existing code; do not copy generated framework code
   blindly or create one-off raw values.
4. Implement responsive behavior for the supported Android width, orientation,
   font-scale and input profiles. Preserve TalkBack semantics, focus, Stop,
   confirmation and truthful-result behavior even when absent from a single
   reference frame.
5. Compare the implementation against the reference at named configurations,
   run component/accessibility tests, and record known deviations. A screenshot
   match is not an accessibility, policy or device-feasibility pass.
6. Add Code Connect mappings only after both sides are stable and that external
   metadata write is explicitly authorized.

### Call-budget discipline

- Share exact frame/node URLs rather than asking the agent to explore an entire
  file.
- Group related component/variable/context reads into one design task.
- Cache decisions in Git-backed specs and tokens; do not re-fetch unchanged
  Figma data to rediscover product behavior.
- Use screenshots for targeted visual verification, not as a substitute for
  structured component/variable context.
- Check the current seat and server limits before T-102/T-108; if the limit is
  too low, prepare manifests locally and reserve calls for create/readback and
  implementation-critical nodes.

## First package: interaction before styling

Create one Stage 1 design file only after authorization to write to Figma. Owner Simon; designer maintains components. File description links this repository and source commit. Pages in order:

| Page / sections | Exact deliverable | Gate |
|---|---|---|
| 00 Read me / decisions | Source commit, proposed status, device assumptions, linked PRD/UC/J/SCR IDs, outstanding choices, change log | No implicit approval by polished appearance |
| 01 Foundations / neutral | Layout grid, scale, focus, targets, status semantics, neutral provisional colors | Measured accessibility before reuse |
| 02 Components / neutral | CMP-001–010 with every applicable state and keyboard/TalkBack notes | Design-system contract |
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

### Handoff manifest and review separation

Use the [design-handoff template](../_templates/design-handoff.md) and [T-102 packet](../10-execution/task-packets.md#t-102-packet) to prepare the first package. The manifest may exist in Markdown before Figma access; it must not contain invented file/node URLs. When frames are actually created, record their real references and source commit in the handoff.

Worked annotation example (proposed, not an existing frame): `J-003/SCR-007/confirm-draft/portrait-600/font-100/proposed`. Entry: resolved fictional endpoint/channel and locally prepared exact text. State: ready to confirm, local coordinator owner. Content: recipient, channel, exact message, “Open this draft in [app]”; no sent/delivered claim. Controls: Change it, Open draft, Cancel; no default approval. Readable preview first, then actions in visual order; focus never automatically activates Open draft. Expiry keeps text visible but requires refreshed approval. Correction returns to a new preview revision; Cancel returns to stopped/no-effect; admitted handoff leads to draft-opened partial, while unknown effect leads to honest recovery. Data is private transient preview, not diagnostic content. Links: PRD-FR-008/009, SAF-002, EVAL-003/010/012, CMP-003. Android's draft screen is a separate device-dependent placeholder. This example illustrates annotation shape; product design and policy remain the behavior owners.

Separate reviews: interaction coverage first, accessible component behavior second, identity preference third, implementation fidelity after actual code exists. A reviewer records precise missing frame/variant or contradictory behavior. Simon's identity selection does not approve an unreviewed workflow; engineering acceptance of layout does not confer name clearance. Research preparation and actual collection follow [research protocols](../08-research/research-protocols.md).

CMP-001 Stop/Take over, 002 microphone/transcript, 003 consequence preview, 004 activity, 005 choices, 006 outcome, 007 buttons/forms, 008 guidance/permissions, 009 lists/media/settings, 010 Home context panel and 011 Context Room identity/entry/source cue compose all screens. Component names `Granny/Confirmation/prepare`, properties `state`, `inputMode`, `consequence`, `sizeProfile`, `themeCandidate`; identity name is a property, not four forked behavior libraries.

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
