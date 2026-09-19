---
title: "Stage 1 conversation browser prototype and handoff"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, prototype, handoff]
related:
  - conversation-first-plan.md
  - product-design-spec.md
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - ../../prototypes/stage-1/README.md
  - ../01-product/user-journeys.md
  - ../01-product/traceability.md
  - ../10-execution/sessions/2026-09-14-conversation-build.md
---

# Conversation-first browser experience

## Planned Context Rooms extension

The current executable prototype still covers the conversation shell and five scripted workflows described below. Simon adopted [Context Rooms](context-rooms.md) as the next experience direction on 2026-09-19. [T-119](../10-execution/backlog.md#t-119) will add a fictional-data global Home → Rooms library → Kitchen slice, direct browse/search, one disclosed cross-room source and safe room deletion. Until that task is separately implemented and tested, this page must not imply those screens already exist.

Current connected runtime: [versioned local backend/MCP contract](../04-architecture/conversation-runtime-contract.md). Scripted remains default; local demo uses a stub model with actual MCP/store operations. Explicit live synthetic consent is available only when the backend enables it; the one live proposal check failed, so model reliability is not established.

## Authority, artifact and limits

Simon authorized the local conversation-first build on 2026-09-14 and asked to continue its working message checkpoint direction on 2026-09-15. The [direction and authority record](conversation-first-plan.md) distinguishes exploration from final interaction/brand acceptance. The [session handoff](../10-execution/sessions/2026-09-14-conversation-build.md) owns actual integrated checks, reviewer findings and publication.

The default prototype is a rule-based, fictional-data browser simulation of the planned stock-Android tablet experience. The five scripted workflows have no backend. Simon separately authorized frontend coordination with a local backend/MCP demo on 2026-09-15; its explicit connected mode uses the same conversation, not a replacement UI. Neither mode has authentication, capture, audio, real account action, analytics or browser persistence. It is not T-103, a device verifier or an Android capability demonstration. Figma remains paused; [historical contract](figma.md) is optional context, not a dependency.

[Run and test commands](../../prototypes/stage-1/README.md): serve the intended checkout on loopback, normally http://127.0.0.1:4173/. Reviewer mode is **?review=1**; its controls are not inserted in participant mode. A running server serves its worktree, not automatically main. Restart only a server owned by this task after server-allowlist changes. There are no dependency installs or build steps.

## Interaction contract and implementation

One invitation, one readable thread, persistent labeled composer/Talk and quiet Menu. Supported input proceeds directly; necessary clarification, results and specific previews appear in the current turn. No feature-grid Home, sidebar or mandatory task-category picker. Unmatched requests ask for a useful clarification and accept another typed response.

[Intent grammar](../../prototypes/stage-1/intent.js) and [fictional fixtures](../../prototypes/stage-1/fixtures.js) are separate from [task transitions](../../prototypes/stage-1/model.js), [cancellable scheduling](../../prototypes/stage-1/scheduler.js) and [rendering/reviewer controls](../../prototypes/stage-1/app.js). There is no generic agent framework. Fixed date interpretation uses **14 September 2026**; “yesterday” means 13 September, regardless of the computer date.

Normal progression uses 650 ms demonstration stages, configurable to bounded shorter/longer delays in reviewer mode. These are design timings, not measured AI/Android latency. Every scheduled callback binds to epoch/task/version/stage. Stop, editing, reset and replacement revoke stale work. Preview expiry revokes authority after 60 seconds without discarding the draft or creating countdown pressure. These simplified frontend checks do not implement production authorization/journaling.

A new consequential request never queues behind old work. The interface resolves unfinished-draft/input loss before replacement. Chat submission and incidental “yes” cannot approve an external consequence. The active preview binds person, channel, full content and effect; historical controls cannot approve a newer task. Unknown effect has no blind retry. Default messaging ends at a fictional unsent draft; hypothetical admitted-send review remains explicitly separate.

<a id="journey-and-component-coverage"></a>
## Journey and component coverage

| Journey / stable owners | Current conversation route | Required adverse/recovery review |
|---|---|---|
| J-003; SCR-003/004/006/007/005/008; CMP-001/002/003/005/007 | Tell/message/text → person/channel only if unresolved → exact editable preview → specific approval → automatic unsent handoff | Wrong/ambiguous person, exact body, changed/stale/expired approval, editing, Stop, unknown, recovery without resend |
| J-001; SCR-004/006/007/005/008; CMP-005/009 | Person/date request → local fixture filter → inline illustrated collection → individual viewer and return | Alias deletion/ambiguity, date correction/no matches, uncertain source date, permission loss, mark-read disclosure for message-source route |
| J-002; SCR-002/004/005/008/014; CMP-006/008 | Request explanation → explicitly supplied fictional screen → plain explanation → simpler or known return target | Unknown context, sign-in/protected surface, failed/partial return; no actual browser/Android observation |
| J-005; SCR-004/006/005/008/014; CMP-006/009 | Artist/title request → ambiguity if needed → silent inline player → pause/resume | Offline, unavailable/paywall, app-open-only partial; opening an app is not playback |
| J-006; SCR-006/011/008; CMP-007/009 | Scope clarification → real local size preview → Apply → Restore | External-app guidance only, pending composer/draft retained, full-thread/menu/confirmation scaling |
| J-007; SCR-001/002/009/010/011/012/015; CMP-002/007/008/009 | Brief introduction and no-microphone entry; Menu/settings/help/people/privacy/history | Explicit preference and alias correction/deletion, minimal-history deletion, reset/new-session distinction, focus return |

The corresponding PRD/UC/EVAL routes remain in [traceability](../01-product/traceability.md). Code/test links cover the browser simulation only. No canonical EVAL-001–017 or production T-103–109/T-119 task is passed by this artifact.

CMP-003 now uses a persistent exact inline preview with an expanded reading/editing surface where needed; it never truncates the consequence. CMP-001 Stop remains reachable during work. CMP-004 announces meaningful state once without displaying internal planning. CMP-005 choices use stable fixture identity and visible differentiators. CMP-006 distinguishes prepared/opened/sent/partial/unknown/stopped, and CMP-009 embeds actual local content/state.

## Data, access and rendering

All scripted runtime data is tab memory. The working thread is ephemeral; recent activity retains at most 20 task-kind/outcome summaries without message bodies or people. Preferences and aliases require explicit actions. Clear conversation, clear history, alias deletion and full reset have distinct scopes; reload clears scripted state. Connected demo requests and synthetic drafts additionally belong to the loopback runtime's session/store: a browser reset does not delete or undo them. No IndexedDB, local/session storage, service worker, external fonts/images/scripts, browser provider connection or telemetry is added.

Photo assets are three original local SVG illustrations, explicitly fictional, with sender/source/date fixture metadata. They are not photographs of real people. Song titles/performers are metadata for a silent simulated player, not streaming. Screen context is chosen fiction, never captured. Passwords, permissions and accounts remain explanation-only boundaries.

User text is rendered as text, never executable HTML/instructions. CSP allows only same-origin connections and blocks media/fonts; response headers disable microphone/camera/geolocation. The scripted loopback server has an exact runtime-file allowlist and rejects other files and write methods, including all API routes; [server tests](../../prototypes/stage-1/serve.test.mjs) enforce it. Connected mode requires the separately owned runtime server on the same origin.

## Connected demo-draft extension

The [frontend coordination record](../10-execution/sessions/2026-09-15-ui-backend-frontend.md) records this separate authority, branch checkpoints and evidence. Backend owns [granny.conversation.v1 at the technically agreed checkpoint](https://github.com/Pueblo98/Granny/blob/aea7f442021347aab0130fcbe220ab5a1ab53b1b/docs/04-architecture/conversation-runtime-contract.md), runtime/MCP/provider execution and server-side verification; frontend owns its client/rendering/browser checks. Technical agreement does not confer product acceptance.

J-003's connected route is **Menu → Demo connection → explicit local-demo consent → natural message request → necessary identity/channel clarification → exact preview → specific create-unsent-draft confirmation → creating → verifying → verified local demo draft, not sent**. This real local draft effect is distinct from the default scripted fictional app-open outcome. Message body edits invalidate approval and request a new exact preview. Person/destination corrections use a new natural request and backend-approved clarification; no parallel frontend contact API is invented.

Only backend events can advance connected work. The frontend fences version/session/epoch/sequence, disables confirmation on editing, Stop or transport loss, and never retries a consequential command on reconnect. A cancellation acknowledgment is required to claim stopped. Unknown effect provides no new-draft/retry action and keeps an in-tab warning after mode changes. Backend session/store retention is disclosed separately from temporary browser state. Local text size spans both views; scripted aliases/activity and remaining workflows stay separate. Reviewer fixture controls do not advance connected execution.

The [run guide](../../prototypes/stage-1/README.md) distinguishes static and connected serving and frontend wire-fixture tests from actual backend/MCP evidence. No live-provider selector, browser key, actual messaging, account action or Android control is added by this frontend slice.

Actual combined browser review on 2026-09-15 passed 13 assertions against backend checkpoint 4d175f6 at loopback 4181: selected identity/channel, exact revised words, verified unsent local demo draft, chat and Stop, with no browser egress/persistence. The frontend separately ran all 22 backend/provider/HTTP tests. Exact source/test/screenshot records and remaining scope are in the frontend session; these are local demo/MCP observations, not production or live-model evidence.

Focus remains with the reader/composer on status changes. Dialogs contain keyboard focus and restore the invoking control; returning from a photo restores position. Status updates do not force scrolling away from older content. Controls have visible labels/focus, large targets and no audio/color-only meaning. Browser CSS geometry is an approximation, not native dp/sp or assistive-tech evidence.

## Proposed visual comparison

Neutral is the initial interaction baseline. Reviewer-only Open Day and Bright Signal apply the [documented territory values](brand-and-visual-identity.md) to the same content, layout and controls. System sans is used without downloads. No public name, logo, production font/palette or token promotion is implied. [Stylesheet](../../prototypes/stage-1/styles.css) owns executable proposed values; [design system](design-system.md) owns semantic roles.

## Short walkthrough

1. Type “Tell David I’ll call after dinner.” Choose the person/channel, change the message, inspect the exact effect, and open the unsent draft. Check whether its result is unmistakably unsent.
2. Type “Show me the photos Sophie sent yesterday.” Open an illustration, browse and return. Change person/date; compare the source and mark-read variant.
3. Type “What am I looking at?” Choose a fictional display-settings screen, simplify the explanation and return to the known article. Compare unknown/protected cases.
4. Type “Play some Nina Simone.” Choose a track, pause it, visit settings and return. Compare playback with an app-open-only result.
5. Type “Make this easier to read.” Preview, apply and restore Granny text; compare external-app guidance.
6. Through Menu, try an alias correction/deletion, history clear, no-microphone Talk path and a new conversation while input is unfinished.
7. In reviewer mode compare neutral/Open Day/Bright Signal on the same request, inject failures/expiry/unknown and inspect large text.

Record where the next action or consequence feels unclear. Final visual preference and representative-user comprehension remain separate from browser pass/fail.

## Current evidence and remaining work

[Current session evidence](../10-execution/sessions/2026-09-14-conversation-build.md) lists actual integrated commands/counts, screenshots, independent review and precise remaining issues. [Browser tests](../../prototypes/stage-1/browser-check.mjs) exercise real Chromium controls; [model](../../prototypes/stage-1/model.test.mjs) and [scheduler](../../prototypes/stage-1/scheduler.test.mjs) tests cover deterministic transitions/timer races. The test-only browser driver does not run a suite by itself.

Unrun: physical Android/IME/permission/route/Stop tests, real voice, TalkBack/screen-reader/switch tests, representative human comprehension and final branding. T-101/103–109 and production gates retain their existing evidence requirements. Simon's checkpoint continuation is not a participant study or blanket acceptance.

## Historical initial-prototype evidence

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


## Delegated live synthetic conversation entry — 2026-09-15

Under Simon's backend integration mission and frontend's published FE006 file-scoped handoff, Menu → Demo connection now offers **Check live model availability**. Only an explicitly enabled backend with liveAvailable exposes **Review live conversation consent**. Separate consent names synthetic conversation egress to OpenRouter/Qwen; cancel makes no session, and confirming creates a mode-bound session without a model call. Text submission starts interpretation. Default remains scripted; connected demo remains stub-only. Keys never enter the browser. No recording, account access, real sending, new capabilities or increased caps.

Live-mode snapshots must match the explicitly consented mode. Mode labels and privacy text disclose provider egress, while exact draft confirmation and backend verification stay unchanged. Unknown/Stop/replay fences remain in force. Client/wire and actual live-mode HTTP/MCP tests use a stub provider, not paid model evidence. The backend's single live Qwen check failed to propose a structured draft; the mode entry does not imply reliable language interpretation. Existing interaction layout/style/other component behavior is unchanged by this delegated extension.
