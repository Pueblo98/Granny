---
title: "Conversation-first redesign plan"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, interaction, review]
related:
  - context-rooms.md
  - product-design-spec.md
  - design-system.md
  - voice-ux.md
  - accessibility.md
  - browser-prototype.md
  - ../10-execution/messages/2026-09-14-conversation-first.md
  - ../10-execution/brainstorming-alignment.md
---

# Conversation-first redesign plan

## Direction and authority

**Selected shape, Simon, 2026-09-17:** [Round conversation](brand-and-visual-identity.md#accepted-shape-direction--round-conversation) is the accepted composer direction moving forward, in compact/normal/expanded sizes, with the same silhouette to explore for a favicon. This resolves the shape choice without accepting the rejected browser composition, changing behavior or authorizing implementation in this documentation session.

**Active extension, Simon, 2026-09-19:** [Context Rooms](context-rooms.md) now extend this shell as the active next design direction. Home remains the universal low-clutter entry. T-119 adds a direct Rooms library and one room using the same assistant, personality, composer and safety controls, with fictional data before persistent implementation.

**Latest feedback, Simon, 2026-09-17:** the implemented UI remains too button-heavy and generically AI-styled. Simon wants a separate Claude design session after settling product questions. [The handoff](claude-design-handoff.md) prepares that session and the requested system. This supersedes earlier positive checkpoint feedback as the current visual review disposition. Do not extend or polish the current composition under the old build request. Semantic safety/accessibility contracts remain; [ADR-0013](../09-decisions/ADR-0013-bounded-interface-composition.md) accepts bounded composition and [ADR-0014](../09-decisions/ADR-0014-stable-home-context-panel.md) now selects a stable conversation Home with zero or one optional context panel.

**Confirmed direction:** Simon rejected the feature-button browser Home on 2026-09-14 and requested a minimal chatbot-like experience with less visible interface and more functionality inside the conversation. The cockpit-first planning task is complete.

**Implementation authority, Simon, 2026-09-14:** the Conversation-First Experience Build mission explicitly authorizes implementing this proposed interaction in the existing local browser prototype. Build the message slice first, surface a working checkpoint, then expand the shared interaction to the other four MVP workflows and supporting local settings/recovery. Continue independent reversible work while feedback is pending; adjust before expanding if Simon rejects the checkpoint. This supersedes this document's earlier implementation-wait language. It authorizes exploration, including inline exact previews and neutral then Open Day/Bright Signal comparisons, not final design/brand acceptance or any production gate. [Current execution record](../10-execution/sessions/2026-09-14-conversation-build.md) records scope, tests and handoff.

All data is fictional and in memory. No backend/model calls, audio/capture, real external actions, device automation, dependencies, public/LAN deployment, private Obsidian edits or main merge is authorized by this scope. Task-branch publication is authorized; PR/main integration retains separate authority.

**Checkpoint feedback, Simon, 2026-09-15:** “Continue this direction” after the working message slice and screenshot. He separately authorized creating a draft PR after integrated checks. Main remains unmerged. The feedback supports expanding the interaction and does not imply final design acceptance.

**Proposed solution:** one calm conversation surface that can talk, show content, ask a necessary question and present a specific action for approval. The person describes the goal; the software handles the workflow. This is a revision of the interaction model, not just removal of borders or smaller buttons.

We should not turn Simon's product feedback into a demographic research claim. Some people may prefer visible choices to composing a request; others cannot or do not want to speak. Test those differences. Minimal does not mean blank, voice-only, hidden safety or tiny controls.

## What was wrong with the first prototype?

The browser Home made the user select an app capability from five tiles plus entry/navigation controls. Typed input then required another category selection. Each task moved through separate form-like pages. Reviewer simulation controls were visible near the product, adding a second mental model. These are observable design choices, not proof of user failure.

Keep the useful work: fixture data, exact-person/message checks, failure scenarios, invalidation/Stop tests and large-text fixtures. Rework composition and transitions. Do not preserve the tile navigation merely because tests encode it.

## Recommended experience — one conversation with task-aware content

Initial view:

```text
Granny                                                   Menu
-------------------------------------------------------------
What would you like to do?

You can ask in your own words.
For example: “Show me Sophie's photos.”

                    [ Talk to me ]

[ Type a request…                                  Ask ]
```

The wireframe is a layout proposal, not a final visual identity. The implemented browser uses a persistent **Continue** control for typed intent submission, never external approval; empty submission does nothing. Input is always visibly available without granting a microphone permission. Talk uses a large labeled control, not an unlabeled microphone icon.

After an intent, the initial invitation collapses into a conversation. Latest request and response are primary; no permanent feature grid, left chat-history sidebar, top navigation bar of tasks or suggested-prompt chip wall. A quiet labeled Menu reveals history/settings/help and an optional “What can I ask?” guide. Returning from it restores context/focus, never resumes an external task silently. Settings/privacy access must remain discoverable, including by a typed request.

A concise text status stays beside the current turn. The browser keeps Stop in a top-of-document sticky dock ahead of scalable headers, and allows the composer to enter normal document flow when a narrow/short or enlarged-text viewport cannot accommodate a sticky composer. During work, a stable touch **Stop** is visible without scrolling, independent of voice and the model. System navigation and external-app handoff remain honest Android boundaries.

### How the five workflows appear

| Intent | Conversation behavior | Built-in result/control |
|---|---|---|
| “Show me the photos Sophie sent yesterday.” | Extract person/date; clarify only unresolved identity/channel; disclose mark-read effect when applicable | Photo strip or large image inside the response, sender/date/source, next/previous while browsing; not another Photos dashboard |
| “What am I looking at?” | Name only the observed or supplied screen; explain in one short response | Optional “Take me back” when the target is known; one contextual choice if needed, not a generic feature page |
| “Tell David I'll call after dinner.” | Draft exact words; ask which David only if ambiguous; resolve channel without inventing it | Persistent exact-recipient/channel/content/action preview; named approval, Change and Cancel |
| “Play [title].” | Resolve ambiguous title/artist/service only where necessary | Compact now-playing card with title/source and Pause; no library/catalog screen as the default |
| “Make this easier to read.” | Clarify Granny versus another app if context does not resolve scope | Inline size preview; Apply/Restore while adjusting, then return to the conversation with retained setting |

These preserve J-001/002/003/005/006 and their existing task outcomes. “Built-in” means the conversation hosts the response and relevant controls; it does **not** imply newly available Android integrations or autonomous permissions.

## A concrete message exchange

1. User types or explicitly starts Talk: “Tell David I'll call after dinner.”
2. Granny, if two approved contacts match: “Which David?” Two large labeled options with existing differentiators, plus a way to say neither. User can answer by text/voice or tap.
3. Granny resolves the approved channel; if unknown, ask once. Do not hide wrong-recipient risk behind conversational confidence.
4. Present a clearly bounded preview in the current turn:

   **To:** David [actual differentiator] · [actual channel]

   **Message:** I'll call after dinner.

   **Effect:** Open an unsent draft in [app]. You still choose Send there.

   **Actions:** Open this draft · Change it · Cancel.

5. Only after specific approval, show concise status and Stop. A mock response is labeled as a simulation in the prototype.
6. Result: “The draft is open. It hasn't been sent by Granny.” Keep it distinct from an admitted-and-verified send.
7. User continues naturally: “Actually, make it tomorrow.” Edit creates a new version/preview and revokes old authority. It cannot silently edit an already-sent external message.
8. On unknown outcome: “I can't confirm whether it sent. Check the conversation before trying again.” No new Send/Retry button for a blind retry.

The preview should feel like part of the conversation but remain a structured safety component. In the browser, it reflows into a full-width, vertically scrollable reading/editing surface for long content or large text; it never truncates the exact consequence. CMP-003's inline presentation is now authorized for browser exploration, preserving its enforcement, semantics and exact-content requirement. This is not acceptance of a final production design.

## Interaction rules to review

| Situation | Proposed composition and control rule | What must not disappear |
|---|---|---|
| Idle | One invitation, stable composer, labeled Talk, quiet Menu; no feature-grid choices | Visible typed path and microphone-off state |
| Listening | Transcript in the current turn; Done listening and Cancel/Stop replace idle microphone controls | Explicit capture state; no always-on listening |
| Interpreted request | Continue when intent is sufficient; don't require “Use this request” after every low-risk turn | Editable transcript; material correction invalidates prior plan/approval |
| Clarification | One question; only useful choices now; free-text answer also works | None-of-these, accessibility labels and exact entity binding |
| Planning/acting/waiting/verifying | One current-status line; show details only on request | Fixed reachable Stop, truthful waiting reason and timeout/manual fallback |
| Confirmation | One exact action preview; specific approval plus Change/Cancel | No generic Enter-to-send; no incidental “yes” detached from an active bound preview |
| Success | Concise evidence-backed result, reusable content in-thread | Prepared, opened, sent, partial and unknown stay distinct |
| Failure/offline | Explain what remains possible; one useful recovery or manual path | No false progress, background retry or queued consequence |
| Settings/history | Secondary labeled menu or natural request | Full touch-only navigation; privacy/deletion never hidden behind a model response |

“Fewer controls” is a prioritization rule, not a numeric cap on necessary safety choices. Buttons appear when they help answer the present question or control the present action. Adults must not need to recall magic phrases to find essential features.

## Conversation continuity and privacy

Use a short-lived in-memory working conversation for the next mock. Completed tasks can collapse into readable summaries without losing current context. Scroll position stays under user control: new status must not pull someone away from a preview they are reading. Announce meaningful changes once; do not refocus the whole screen on every token.

This plan does not authorize storing full chat history, screenshots or audio. MVP keeps minimal task history and explicit aliases/preferences. App V1 may use ADR-0012's typed automatic important-fact memory and adaptive communication, without a transcript archive or external-content mining. A long-lived ChatGPT-style sidebar/history is specifically not implied. A new request while acting offers/executes the existing safe interruption semantics before changing goals; it never quietly queues a second consequential action.

## Visual direction, still proposed

Aim for a generous reading area, strong readable type, calm spacing and a single stable input region. Use subtle conversational grouping, not dozens of cards or alternating colored bubble rows. Essential controls remain large and labeled. Results can be richer—photos, a music player, a message preview—without turning Home into a dashboard.

First review the interaction in neutral styling; then compare the existing identity territories on this same composition. No new logo, public name, palette or typeface is selected. A chat-like visual convention is inspiration, not a claim that ChatGPT's full UI is appropriate for this audience.

Simon's 2026-09-17 class brainstorm adds two compatible explorations. First, a person may explicitly choose a calm background or visual atmosphere, with a neutral accessible default and no inferred taste; content and controls must retain contrast, legibility and focus clarity. Second, computer-use guidance may use predefined arrows, highlights or importance markers tied to a freshly resolved semantic element or supplied screen region. Guidance names the observable goal, current step and reason, with detail on request. It does not reveal model reasoning, authorize coordinate-only action, cover protected/authentication screens or imply that a universal Android overlay already works.

Contextual result components may feel like modules—a photo strip, playback control, exact draft, guidance panel or preference preview—while remaining part of the current conversation. Under ADR-0013 the agent may automatically compose registered semantic components for the current task, while the renderer owns semantics/reflow and policy owns actions. Arbitrary model-created controls remain unavailable. Under ADR-0014, idle Home may contain only one CMP-010 context panel; no grid, carousel, widget stack or automatic movement of core controls is permitted.

[Context Rooms](context-rooms.md), accepted in [ADR-0015](../09-decisions/ADR-0015-context-rooms.md), extend this direction as an optional secondary organization layer rather than a new Home. The same assistant and stable conversation shell operate globally and inside a room; entering a room foregrounds related references and a bounded atmosphere while policy-scoped cross-room retrieval remains possible. T-119 is the active next fictional-data design/contract slice; production persistence and final navigation remain separately gated.

## Options and recommendation

| Option | Advantage | Main cost | Recommendation |
|---|---|---|---|
| Keep feature Home, hide some tiles | Small code change; visible discoverability | Retains the feature-selection burden Simon rejected | Do not pursue |
| Pure voice / empty chat | Few visible controls | Speech/privacy/access barriers; users must guess capabilities and commands | Do not pursue as default |
| Conversation plus contextual task controls | Intent-led entry, integrated outcomes, strong touch and safety path | Requires careful conversation state/focus and discoverability testing | Recommended |
| Free-form model-designed screens on every turn | Very adaptive in theory | Unstable layout, safety/semantic enforcement and testing complexity | Not this MVP |

## Authorized bounded execution

1. **Revise the owned interaction contract.** Update SCR-003/004/005/006/007/008, CMP-001–007, voice wording and affected J flows; retain stable IDs. Confirm inline-versus-expanded preview and transcript friction decisions. No changes to accepted five-workflow scope.
2. **Build one conversation slice first:** Home/composer → message clarification → exact draft preview → handoff/unknown/Stop. Reuse current fictional model fixtures; remove mandatory category selection. Prototype routing uses an explicit documented fixture grammar/sample set, not fake general NLU or live AI. Unmatched input asks a truthful clarification instead of routing arbitrarily.
3. **Review before expanding.** Simon walks through typed entry, ambiguity, correction, expiry and Stop. Product review checks separation of simulator controls from the product; reviewer stepping moves into a dedicated review-only mode outside the participant view. Keep the user-supplied task at the center.
4. **Add the other four integrated responses** once the conversation slice is coherent. Text-size changes apply across the thread/composer; photo and playback controls stay within the relevant turn.
5. **Run access and comprehension checks:** no microphone, enlarged text, narrow/landscape, long message/keyboard open, focus/scroll retention, screen-reader and switch walkthrough. Actual participant studies remain RES-03/06 with approved protocol, not inferred from owner preference.
6. Only then compare identity territories and consider device/agent integration under existing feasibility/safety gates.
7. **Prototype T-119 Context Rooms:** preserve global Home, add SCR-016 Rooms and one SCR-017 Kitchen room, direct browse/search, one disclosed cross-room source, membership receipt/Undo and archive/delete-room review. Use only fictional in-memory data and CMP-011; do not add a room grid to Home or separate agent identities.

No production AI calls, live mic capture, external message sends, package installation or vendor/framework changes are part of the proposed first slice.

## Trace and acceptance plan

| Contract | Proposed change | Evidence required |
|---|---|---|
| PRD-FR-001/002; UC-013; J-007; SCR-003/004; CMP-002/007 | Voice/text converge on one conversation, no mandatory feature category | EVAL-005/012 plus new browser checks: enter a sample goal directly with mic denied |
| PRD-FR-007/008/009; PRD-SAF-002; UC-006; J-003; SCR-006/007; CMP-003/005 | Clarification and structured approval in-thread | EVAL-003/010; exact person/body/channel, expiry, edit invalidation, no incidental approval or blind resend |
| PRD-FR-004/012/013; UC-019/025; SCR-005/008; CMP-001/004/006 | One activity/status region and stable Stop | EVAL-006/009; interruption races remain mock tests until runtime/device proof |
| PRD-ACC-001–004; UC-022; J-006; SCR-011; CMP-009 | Minimal layout without removing accessible control | EVAL-007/012; focus/large text/keyboard/voice-off coverage and comprehension, not screenshot approval alone |
| PRD-PRV-001/002/004; J-007; SCR-009/010/012 | Ephemeral thread, secondary privacy/history navigation | EVAL-008; no new stored conversation or family visibility |

Pass criteria for the first browser revision: no five-feature tile Home; no post-input category picker for supported samples; visible talk/type paths; exact active approval and Stop; no lost draft on expiry; correct focus/scroll behavior; simulator controls absent from the participant view; no regression in safety tests. A target like fewer visible controls is not substituted for user comprehension.

**Next design review:** Try the working message checkpoint, then the integrated five-workflow experience. Review whether the conversation makes the next action and its consequence clear. Browser test results do not replace Simon's design judgment or participant/device evidence.
