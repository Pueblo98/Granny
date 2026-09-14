---
title: "Stage 1 browser prototype and design handoff"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [design, prototype, handoff]
related:
  - product-design-spec.md
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - figma.md
  - ../../prototypes/stage-1/README.md
  - ../01-product/user-journeys.md
  - ../01-product/traceability.md
  - ../10-execution/task-packets.md
  - ../10-execution/development-readiness.md
---

# Browser-first interaction design

## Decision, authority and scope

**Confirmed direction — Simon, 2026-09-14:** move from the quota-blocked Figma authoring workflow to in-browser design, continue the MVP prototype and update documentation. The active artifact is [prototypes/stage-1](../../prototypes/stage-1/README.md). This is a reversible design-tool choice, not a change from the stock-Android product to a web app, nor acceptance of every interaction or visual choice.

Why: local HTML/CSS/JavaScript permits direct editing, versioning and repeatable interaction checks without the connected service's authoring quota. Tradeoff: the browser lacks Figma's visual canvas/component collaboration and does not reproduce native Android semantics. Staying with free Figma was workable for page organization but not the observed MCP quota. Penpot remains an unselected alternative, not a new dependency. No new ADR is needed for this reversible prototype-medium choice; accepted platform/scope ADRs remain unchanged.

The earlier [Figma file](https://www.figma.com/design/ZNT7zmXHjiPhXaCfafjM4g/Granny-Stage-1-Exploration) is **paused, partial and not synchronized**: overview, Home, 24 confirmed empty wrappers, no authored prototype connections. Its [exact-node handoff](https://github.com/Pueblo98/Granny/blob/docs/figma-mvp-prototype/docs/02-design/figma-prototype-handoff.md) remains on the preserved earlier branch. Browser work starts from main ce3f32f and does not merge that branch or delete external content.

**Editorial/visual status:** proposed. **Initial executable design slice:** ready for Simon's review with the gaps below. **T-102 overall:** review, not fully accepted. No participant study, device control, native accessibility, distribution or release gate is passed.

## Run and workflow

[Run instructions and tests](../../prototypes/stage-1/README.md) are the command owner. Start the local preview with Node, then open http://127.0.0.1:4173 on the same computer. No dependency installation is needed. The loopback server exposes only the prototype assets, not the repository, personal files or APIs.

1. Start with a named J/SCR/CMP and test question from the [task packet](../10-execution/task-packets.md#t-102-packet).
2. Edit the relevant view in app.js, state transition in model.js and semantic CSS only as needed. Product behavior stays canonical in the PRD/journeys/design/policy, not only in JavaScript.
3. Review keyboard/touch, correction, Stop, truthful partial results and negative variants before styling.
4. Run model checks, browser checks, doc validation and whitespace checks. Inspect screenshots at representative widths/scales. Record scope and gaps; a green script is not user research.
5. Record accepted visual decisions in Git only with Simon's exact approval. Identity comparisons can be built as browser variants later; no Figma subscription or automatic re-entry is required.
6. Commit/push the scoped task branch and verify remote SHA. Do not deploy the prototype, merge main, install tools or add real providers/device actions without separate authority.

## Boundary and Definition of Ready

| Dimension | This authorized slice |
|---|---|
| User-visible outcome | Five recognizable workflows plus setup, corrections, confirmations, Stop/recovery and local preferences can be explored |
| Requirements | PRD-FR-001/002/003/005–013/015–017; PRD-SAF-002; PRD-ACC-001–004; PRD-PRV-001–004/006; exact journey mapping below |
| Components | SCR-001–012/014/015; CMP-001–009 represented to the limited fidelity described below; SCR-013 helper UI excluded |
| State owner | Browser tab's finite model; 57 declared view keys with J/SCR/state metadata. No model-generated instructions or capability executor |
| Data | Fictional people, titles, dates and drawings; edited words only in memory; minimal category/outcome history, capped at 20 |
| Permissions/network | No capture, audio, provider, persistent browser storage, authentication, telemetry or upload. CSP blocks connections; preview response disables microphone/camera/geolocation |
| Test oracle | Model transition assertions and browser-visible content/state/geometry. External success is explicitly reviewer-selected fiction, not an independent app oracle |
| Prototype clock | Manually advanced, with 60-second preview and machine-budget examples; no claim of measured latency, real ASR timers or full production budget accounting |
| Assumptions | English prototype only; reference browser tested, not support policy; neutral grayscale/system sans proposed |
| Dependencies | Existing Node and installed Chromium for checks; no package manager/framework/library install |
| Rollback | Isolated prototypes/stage-1; no Android/backend integration or deployment. Keep production capability gates unchanged |

Screen content and user input render as data via text nodes, not commands or HTML. The few inline SVG icons/drawings are fixed source-owned vector markup, not user-controlled strings. Application network requests consist only of local static asset loading. No downloaded font/image packages or real photos are used.

<a id="journey-and-component-coverage"></a>
## Journey and component coverage

Exact copy lives in the view renderer and remains proposed implementation of [canonical journey/voice copy](voice-ux.md). View keys below appear in Review tools alongside J/SCR metadata; keys are not new PRD requirements. The model's META map is the complete declared view inventory.

| Journey / linked job | Implemented route and important variants | PRD / planned eval, not passed by this prototype |
|---|---|---|
| J-001 / UC-002 family photos | photoPerson → photoDate → photoConsent → planning/acting/waiting/verifying → photos → photoDetail; both people and dates retained; mark-read disclosure, no match, permission loss, Stop | FR-006/007/012, PRV-001; EVAL-001/006/009 |
| J-002 / UC-003/009/011/019/024/025 screen help | screen → explain sample → explanation/options → backArticle → verified article result; unknown previous context, auth/protection/failure/manual | FR-005/012/013/016; EVAL-002/006/009/010 |
| J-003 / UC-006/015/016 communications | entry → heard → person → channel → preview → acting/waiting/verifying → result; both Davids/channels, real text edit, expiry/renewal/cancel; separate hypothetical send → Stop/outage → unknown, no resend | FR-007/008/009, SAF-001/002; EVAL-003/010/012 |
| J-005 / UC-004/017 media | music → named performer → progress → player → pause/resume; paywall/offline, app-open-only partial; playing remains reachable from Home | FR-010, NFR-002; EVAL-004/009 |
| J-006 / UC-007/022 access | sizeScope → size preview 100/115/130/150% → apply → sizeResult → restore; applies throughout tab; external-size route is manual placeholder | FR-011, ACC-001–004; EVAL-007 |
| J-007 / UC-010/013/014/018/020/021/022 onboarding/control | setup/preferences → mic education/Android placeholder → decline → separate online/screen education → Home; history/privacy/deletion/aliases/help/diagnostics | FR-001/002/003/015/017, PRV-001–004/006, DST-004; EVAL-005/007/008/012 |

Generic Type a request → request → intent lets the reviewer enter a request and explicitly choose one of the five task categories. It is a **manual stand-in for understanding**, not a functioning natural-language classifier. Message body entry is separately labeled; no inferred recipient, promise or extracted message text is silently approved. Talk uses a sample transcript and reaches the same task-category selection; no ASR/TTS or real listening exists.

| Component contract | Browser realization / limit |
|---|---|
| CMP-001 Stop/Cancel/Take over | Local transition before further simulated progress; active sticky Stop; post-dispatch unknown; Escape cancels/interrupts. External overlay/touch detection unimplemented |
| CMP-002 input/transcript | Editable labeled textarea, sample listening, explicit Use; microphone-off text. Real capture, pronunciation and speech replay absent |
| CMP-003 preview | Full recipient/differentiator/channel/endpoint/body/effect, Change/Cancel before commit in DOM order, expiry preserves copy. No generic Enter-to-send |
| CMP-004 activity | Four explicit stages, reason and Stop/manual path. Reviewer advances fixtures; no indefinite autonomous process or fabricated percentage |
| CMP-005 choices | Distinct person/source/performer labels with whole native buttons; values retained |
| CMP-006 results | Known stopped, cancelled, failed, draft-opened, sent fixture, unknown, media partial and verified fixture outcomes remain distinct |
| CMP-007 controls | Native buttons/textarea/select; visible focus, wrapping labels and ≥56 CSS-pixel targets in tested app screens |
| CMP-008 education | Separate grants and online terms; Android UI labeled placeholder, no imitation permission dialog |
| CMP-009 settings/lists/media | Tab-only scale/history/alias CRUD and simulated player; no persistence across reload, real export or remote helper |

## Shared per-view annotations

Every view inherits these annotations; exact exceptions and controls are in app.js and META:

- Entry: explicit Home shortcut, preceding named control or reviewer scenario; heading receives focus, no commit autofocus. Result entry after simulated verification only.
- Exit: goal-specific labeled controls; Home cancels pending authority; active Home/Stop first exposes reconciliation. Unknown requires explicit acknowledgement/manual continuation, never blind resend. History/Settings disable during active/unknown states so they cannot silently hide work.
- State/data owner: local tab model. People/metadata are fixtures; draft and alias are potentially sensitive if the user ignores the fictional-only instruction. Nothing is logged outside tab memory; no private body in history.
- Feedback: all instructions visible, one polite state announcement; no audio dependence. Decorative icons are hidden from assistive technology; drawings have fictional-image descriptions.
- Adaptation: document scrolls vertically; labels/preview text wrap; grids collapse at narrow widths or combined large text. No font shrinking to force fit. CSS em/px are prototype units, not native sp/dp.
- Timeout/invalidation: edits/mode changes/expiry clear preview permit; stale rendered button revision cannot dispatch. Time is a reviewer-controlled fixture. Confirmation contents remain available after expiry.
- External boundary: example apps, Android prompts, capture and sign-in are text placeholders. Successful messages/photos/music/navigation are explicitly fictional, never real evidence.
- Open question: can representative users understand the consequence and identify the safe escape without coaching? No current design appearance answers this.

Return to invoking-control focus is **not yet implemented**: transitions currently focus headings. No full mobile IME, switch or screen-reader conformance is claimed. These are tracked design gaps, not accepted deviations from the canonical accessibility requirements.

## Neutral visual system

The stylesheet is the single executable owner of proposed review values: white paper, #EDEDEB canvas, #F5F5F5 panels, #202020 primary ink/action, #4B4B4B secondary text, #777777 borders, #86242B destructive action and #343434 focus. This deliberately grayscale low-fi exception differs from the earlier colored neutral fixture; it does not replace the four brand territories or select final identity.

System sans; base app text 20 CSS pixels, headings 1.8em (1.6em narrow), supporting/navigation text .9em; app scale multiplies base and reviewer scale adds the system-scale approximation. Normal targets are at least 56 CSS pixels; primary/Stop controls at least 64. No external fonts, gradients, mascot or final logo. Candidate values remain proposed even after geometry/contrast checks.

## Review script for Simon

1. On Home, explain what Talk and Type will do. Try a typed request and choose a task.
2. Draft a message to the second David using Example Mail. Change its words, renew an expired preview, then open it. Ask: **has this been sent?**
3. Enable the hypothetical send review, approve a sample, then Stop during acting. Ask: **what do we know, and is trying again safe?**
4. Find photos from the second Sophie on 12 September; check that source/date remain visible. Inject No matching photos in a new search.
5. Explain the sample settings screen and return to the named article. Inject authentication or unknown prior context; verify no credential/capture action.
6. Play the second performer, pause, return Home and find the player again. Compare app-open-only against verified playback fiction.
7. Preview Largest without applying, then apply and restore. Try narrow width and 200% review scale; inspect the full confirmation, not only Home.
8. Decline microphone, online help and screen access in setup. Correct/delete an alias and clear activity.
9. Record specific control, view key, expectation and observed confusion. Name/brand preference is a separate review; do not infer age-based taste.

This is a formative review script, not participant-research authorization. T-108 still requires its consent/recruitment/data protocol. Do not upload personal interview notes through the prototype.

## Review outcome and next design artifact

Simon rejected the feature-button interaction direction after reviewing this prototype on 2026-09-14. The [conversation-first redesign plan](conversation-first-plan.md) is now the next review artifact. The old prototype remains intact as fixture/test and failure-path reference. Passing checks below remain valid historical mock evidence, not UI acceptance. Do not polish the tile Home or implement a replacement without the requested plan review.

## Actual validation and remaining evidence

Final checks on 2026-09-14 used existing Node 26.8.1 and Chromium 151.0.7922.173, with no installed dependencies:

| Command | Observed result | Evidence boundary |
|---|---|---|
| `node prototypes/stage-1/model.test.mjs` | 36 tests passed, 0 failed | In-memory design transitions and mock confirmation invariants only |
| `node prototypes/stage-1/browser-check.mjs` | 57 assertions passed, no browser errors | Five happy paths, typed entry, edits, expiration, Stop unknown/no resend, setup decline, alias deletion, heading focus/Escape, no storage/third-party app requests, loopback file allowlist, Home/confirmation geometry at 360/600/840 including combined 300% text |
| `python3 scripts/validate-docs.py` | PASS, 0 errors; 80 Markdown files, 1,461 local links, 4 preserved source hashes | Local metadata, links, stable IDs, tables and source integrity; 97 external links not fetched |
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | 19 tests passed | Documentation-validator regressions, not product tests |
| `git diff --check` | Exit 0 | Patch whitespace only |

Home at 1200 and confirmation at 360/840 were screenshot-inspected. Generated screenshots and the isolated browser profile remain temporary local review artifacts, not committed product assets. Browser checks can be reproduced from the source; exact temporary paths are printed per run.

Canonical EVAL-001–017, physical Android tests and human studies remain unrun. This is a design-state mock, not an independent action verifier, production authorization core or proof of the product thesis.

Before accepting T-102/GATE-05, address:

- Return-focus restoration, real screen-reader/switch walkthrough, keyboard coverage beyond tested Escape and native roles, mobile IME, all-screen and landscape/large-text coverage.
- No-speech/ASR error and full voice sample selection/replay; actual voice remains a separately scoped feasibility task.
- Unsaved-work decision, uncertain photo-date evidence, all unexpected app dialogs and richer safe recovery variants.
- Real permission rechecks, actual external Stop/return, authentication isolation and permitted integrations: T-101/103–107, not browser additions.
- Identity comparison on matched Home/confirmation structure, Simon's naming/territory decisions, and representative-user comprehension evidence.
- Full independent runtime budget/journal/crash/idempotency/policy enforcement: T-103 remains unimplemented. Do not treat this model's simplified permit/clock as that implementation.

Next bounded task: Simon's walkthrough and prioritized interaction corrections in this browser artifact, followed by the remaining T-102 access/state variants. No need to recreate the Figma file or reopen quota checks.
