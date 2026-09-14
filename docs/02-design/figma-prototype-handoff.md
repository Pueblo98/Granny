---
title: "T-102 low-fidelity Figma handoff and quota stop"
status: draft
owner: Simon
last_updated: 2026-09-14
tags: [design, handoff]
related:
  - figma.md
  - product-design-spec.md
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - ../01-product/user-journeys.md
  - ../10-execution/task-packets.md
  - ../10-execution/development-readiness.md
---

# T-102 low-fidelity Figma handoff

## Status and authority

Simon supplied and authorized edits to the existing [Stage 1 exploration file](https://www.figma.com/design/ZNT7zmXHjiPhXaCfafjM4g/Granny-Stage-1-Exploration). He subsequently confirmed continuing within its three-page limit. Source baseline: Git `1dbd04a`; design remains proposed. This is a **partial authoring handoff, not a completed interactive prototype**.

On 2026-09-14 the official authoring server returned: “You've reached the Figma MCP tool call limit on the Starter plan.” No reset time was supplied. Three successful wrapper batches preceded the refusal. The next batch did not report any created IDs; inspect the canvas before resuming rather than assuming atomic rollback. No attempt was made to bypass the quota, upgrade the account, or use another account.

The user seeing delayed renders does not establish restored authoring access. No additional canvas writes were attempted after the quota refusal. Local documentation can proceed independently. GATE-05 remains open; all product/device/human evals remain unrun.

## Actual file contents

| Page | Actual ID | Contents |
|---|---|---|
| 00 Overview & foundations | `0:1` | Overview frame `3:181`, repaired text reflow and screenshot inspected |
| 01 MVP interactive flows | `3:179` | Home `6:129` and 24 confirmed empty wrappers |
| 02 State & accessibility review | `3:180` | Empty; no accessibility review frames yet |

[Home](https://www.figma.com/design/ZNT7zmXHjiPhXaCfafjM4g/Granny-Stage-1-Exploration?node-id=6-129) is a native editable 600 × 960 auto-layout frame, not a screenshot. It has three text nodes and five imported SDS button instances. The screenshot was inspected: text and controls were legible and not overlapping at the rendered default size. This is not a device or scale-compliance test.

Home copy:

- Status: “GRANNY · Microphone off”
- Heading: “What would you like to do?”
- Body: “Tell me what you need, or choose below. You stay in control.”

| Control | Actual instance ID | Intended destination; connection not authored |
|---|---|---|
| Talk | `6:133` | listen |
| Type a request | `6:141` | type |
| Find family photos | `6:149` | photo |
| Draft a message | `6:155` | message |
| More things I can help with | `6:161` | more |

All five labels currently have an incorrect `CMP-003` layer-name prefix. Rename them to `CMP-007` on resume; the canonical component contract is unchanged. They are ordinary controls, not consequence previews. No prototype reactions or presentation starting points were authored. Do not describe the Home buttons as clickable navigation yet.

Confirmed empty wrappers:

| Local frame key | Actual ID | State |
|---|---|---|
| more | `8:17` | Empty wrapper; not connected |
| listen | `8:18` | Empty wrapper; not connected |
| type | `8:19` | Empty wrapper; not connected |
| message | `8:20` | Empty wrapper; not connected |
| edit | `8:21` | Empty wrapper; not connected |
| edited | `8:22` | Empty wrapper; not connected |
| person | `8:23` | Empty wrapper; not connected |
| otherPerson | `8:24` | Empty wrapper; not connected |
| editedPerson | `8:25` | Empty wrapper; not connected |
| channel | `8:26` | Empty wrapper; not connected |
| preview | `8:27` | Empty wrapper; not connected |
| editedPreview | `8:28` | Empty wrapper; not connected |
| draft | `8:29` | Empty wrapper; not connected |
| editedDraft | `8:30` | Empty wrapper; not connected |
| expired | `8:31` | Empty wrapper; not connected |
| sendPreview | `8:32` | Empty wrapper; not connected |
| sending | `8:33` | Empty wrapper; not connected |
| verifying | `8:34` | Empty wrapper; not connected |
| sent | `8:35` | Empty wrapper; not connected |
| unknown | `8:36` | Empty wrapper; not connected |
| cancelled | `8:37` | Empty wrapper; not connected |
| photo | `8:38` | Empty wrapper; not connected |
| photoScope | `8:39` | Empty wrapper; not connected |
| photoSearch | `8:40` | Empty wrapper; not connected |

Empty wrappers retain the in-progress shimmer; remove it only after content is populated and reviewed. Do not delete or duplicate them casually. No other journey frame creation is confirmed. The full design brief, not these wrapper names, defines required coverage.

## Provisional visual treatment

Roboto Regular/Bold is a stand-in for Android system sans, not an accepted brand typeface. Home uses a 36/44 heading, 24/36 body, 18/27 status and 20/28 button labels; controls are 64 units high with 20-unit vertical gaps and 24-unit horizontal insets. Imported SDS button fill/border/radius bindings remain linked; larger typography and dimensions are deliberate prototype overrides. No production tokens, library publication or Code Connect mapping was created.

Overview text originally overlapped because fixed heights survived resize. The repair set height auto-resize and vertical hug after sizing. Its readback height became 775; a second screenshot showed separated paragraphs. Apply this ordering to later text and inspect screenshots rather than relying on successful API return values.

## Behavior and annotation contract for resume

[T-102 A–F](../10-execution/task-packets.md#t-102-packet) remains the delivery contract; [journeys](../01-product/user-journeys.md), [screens](product-design-spec.md), [components](design-system.md), [voice](voice-ux.md) and [accessibility](accessibility.md) own behavior. Home traces to J-007 / SCR-003, PRD-FR-001/002/003, PRD-ACC-001–003 and EVAL-005/007. The other MVP journeys are J-001/002/003/005/006; no V1 calls/helper access or Stage 2/3 work is authorized by this prototype.

For Home: entry is setup skip/completion or a finished/stopped task; session state is idle, with microphone off. Focus begins at the heading, then controls in displayed order; controls require button semantics and full-label accessible names in Android. Touch alternatives must not require microphone permission. Spoken feedback must have visible equivalents. No personal data is displayed. Default portrait inspection is complete; narrow/landscape, 130/200% system scale, combined app scale, keyboard, switch and TalkBack checks are not complete.

For every remaining frame, add the task packet's full annotation payload before handoff: entry/exit, focus, state owner, fictional/private regions, exact consequence, escape, timeout/invalidation, voice/touch equivalence and variants. Do not infer full annotation coverage from a named empty frame.

## Next bounded authoring batch

1. When access is available, inspect exact existing nodes and the page child list. The failed batch may require reconciliation. Do not repeatedly consume calls checking an unchanged quota.
2. Correct Home's layer prefixes and overview's premature “press Present” instruction. Add a visible partial-build notice; this could not be done after the quota stop.
3. Fill `8:20` → `8:23` → `8:26` → `8:27` → `8:29`: heard request, person, channel, exact draft preview, draft-opened/not-sent result. Include correction and cancellation before connecting Home.
4. Use fictional David labels and an Example Messages placeholder. Default MVP path is handoff; any simulated admitted-send branch must be clearly separate. Unknown-after-dispatch must never offer blind resend.
5. Add actual prototype connections, inspect their destinations and render each section. Then complete photos, screen explanation/recovery, media, Granny-only text size and setup.
6. Populate page 02 with state/access review and native-device evidence gaps. Review all required scales and negative paths. Only then describe the package as an interactive prototype ready for formative review.

If the free authoring quota remains unavailable, Simon can choose manual Figma editing or explicitly authorize a different prototype format. No migration, extra account, paid plan, local app implementation or dependency installation is implied.

## Checks and limitations

Confirmed from successful tool returns: three page IDs, overview and Home IDs, 24 wrapper IDs, Home control IDs and screenshot repair. After the quota response there was no final full-canvas readback. No user research, real microphone capture, app control, messages, photos, playback, permissions or persistent memory were exercised.

Repository checks on 2026-09-14: `python3 scripts/validate-docs.py` returned PASS (0 errors): 78 Markdown documents, 1,408 local links, 48 requirements, 42 MVP requirements and four preserved source hashes. External URLs were not fetched by this check. An initial staged whitespace check identified one extra blank line at EOF in this handoff; it was removed before push. Structural documentation checks do not validate Figma interactions or user comprehension.
