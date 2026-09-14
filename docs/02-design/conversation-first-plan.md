---
title: "Conversation-first redesign plan"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [design, interaction, review]
related:
  - product-design-spec.md
  - design-system.md
  - voice-ux.md
  - accessibility.md
  - browser-prototype.md
  - ../10-execution/messages/2026-09-14-conversation-first.md
---

# Conversation-first redesign plan

## Direction and authority

**Confirmed direction:** Simon rejected the feature-button browser Home on 2026-09-14 and requested a minimal chatbot-like experience with less visible interface and more functionality inside the conversation. **Requested sequence:** development cockpit first, then this plan for discussion. No UI code changes in this task.

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

The wireframe is a layout proposal, not a final visual identity. “Ask” means submit an intent to Granny, never send a message to someone else. It appears only when there is text to submit; input is always visibly available without granting a microphone permission. Talk uses a large labeled control, not an unlabeled microphone icon.

After an intent, the initial invitation collapses into a conversation. Latest request and response are primary; no permanent feature grid, left chat-history sidebar, top navigation bar of tasks or suggested-prompt chip wall. A quiet labeled Menu reveals history/settings/help and an optional “What can I ask?” guide. Returning from it restores context/focus, never resumes an external task silently. Settings/privacy access must remain discoverable, including by a typed request.

A concise text status stays beside the current turn. During work, a stable touch **Stop** is visible without scrolling, independent of voice and the model. System navigation and external-app handoff remain honest Android boundaries.

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

The preview should feel like part of the conversation but remain a structured safety component. It expands into an accessible full-screen reading view when required by length/scale. This proposes changing CMP-003's default presentation, **not** its enforcement, semantics or exact-content requirement. Resolve that proposal before implementation.

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

This plan does not authorize storing full chat history, screenshots, audio or inferred personal memories. Existing minimal task history and explicit memory rules remain. A long-lived ChatGPT-style sidebar/history is specifically not implied. A new request while acting offers/executes the existing safe interruption semantics before changing goals; it never quietly queues a second consequential action.

## Visual direction, still proposed

Aim for a generous reading area, strong readable type, calm spacing and a single stable input region. Use subtle conversational grouping, not dozens of cards or alternating colored bubble rows. Essential controls remain large and labeled. Results can be richer—photos, a music player, a message preview—without turning Home into a dashboard.

First review the interaction in neutral styling; then compare the existing identity territories on this same composition. No new logo, public name, palette or typeface is selected. A chat-like visual convention is inspiration, not a claim that ChatGPT's full UI is appropriate for this audience.

## Options and recommendation

| Option | Advantage | Main cost | Recommendation |
|---|---|---|---|
| Keep feature Home, hide some tiles | Small code change; visible discoverability | Retains the feature-selection burden Simon rejected | Do not pursue |
| Pure voice / empty chat | Few visible controls | Speech/privacy/access barriers; users must guess capabilities and commands | Do not pursue as default |
| Conversation plus contextual task controls | Intent-led entry, integrated outcomes, strong touch and safety path | Requires careful conversation state/focus and discoverability testing | Recommended |
| Free-form model-designed screens on every turn | Very adaptive in theory | Unstable layout, safety/semantic enforcement and testing complexity | Not this MVP |

## Bounded execution after Simon reviews the plan

1. **Revise the owned interaction contract.** Update SCR-003/004/005/006/007/008, CMP-001–007, voice wording and affected J flows; retain stable IDs. Confirm inline-versus-expanded preview and transcript friction decisions. No changes to accepted five-workflow scope.
2. **Build one conversation slice first:** Home/composer → message clarification → exact draft preview → handoff/unknown/Stop. Reuse current fictional model fixtures; remove mandatory category selection. Prototype routing uses an explicit documented fixture grammar/sample set, not fake general NLU or live AI. Unmatched input asks a truthful clarification instead of routing arbitrarily.
3. **Review before expanding.** Simon walks through typed entry, ambiguity, correction, expiry and Stop. Product review checks separation of simulator controls from the product; reviewer stepping moves into a dedicated review-only mode outside the participant view. Keep the user-supplied task at the center.
4. **Add the other four integrated responses** once the conversation slice is coherent. Text-size changes apply across the thread/composer; photo and playback controls stay within the relevant turn.
5. **Run access and comprehension checks:** no microphone, enlarged text, narrow/landscape, long message/keyboard open, focus/scroll retention, screen-reader and switch walkthrough. Actual participant studies remain RES-03/06 with approved protocol, not inferred from owner preference.
6. Only then compare identity territories and consider device/agent integration under existing feasibility/safety gates.

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

**Decision for Simon now:** Does the one-conversation + contextual controls direction match the intent? If yes, the next requested implementation should be only the message slice above, followed by review—not another five-workflow rewrite in one go.
