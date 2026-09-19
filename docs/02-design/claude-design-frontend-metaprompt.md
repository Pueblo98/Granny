---
title: "Claude Design metaprompt — build the Stage 1 conversation frontend"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, handoff, interaction, frontend, claude-design]
related:
  - claude-design-handoff.md
  - product-design-spec.md
  - design-system.md
  - conversation-first-plan.md
  - accessibility.md
  - voice-ux.md
  - ../09-decisions/ADR-0013-bounded-interface-composition.md
  - ../09-decisions/ADR-0014-stable-home-context-panel.md
  - context-rooms.md
  - ../09-decisions/ADR-0015-context-rooms.md
---

# Claude Design frontend build metaprompt

This is the execution prompt for the app-design session after the design-system
sync. It tells Claude Design to create the editable, interactive Stage 1
frontend experience. It does not authorize production Android code, live data,
backend behavior, Figma work or acceptance of proposed brand values.

The synced system and the later interaction decisions come from separate task
branches. The copy-ready prompt therefore names both exact revisions and calls
out their known delta instead of pretending the first sync already contains the
later Round conversation and Home-panel decisions.

## Copy into Claude Design

```text
You are the lead product designer building the complete editable frontend for
the Stage 1 Granny tablet app inside Claude Design. Start producing the actual
frontend artifact now. Do not stop after summarizing this brief, restating the
requirements, or proposing a plan. Inspect the synced system, establish the
shell, and build the first complete interaction slice before reporting a
checkpoint.

PROJECT AND SOURCE

Use this Claude Design project as the component source:

- Project: Granny Design System (proposed)
- Project URL: https://claude.ai/design/p/4148cba1-baa4-4241-b893-6c54188897ff
- Project ID: 4148cba1-baa4-4241-b893-6c54188897ff
- Package: @granny/design-system@0.1.0
- Global: GrannyDS
- Materialized package commit:
  17658b0ef90328a1f2ef2ced1707a9f3bd07a622
- Package source:
  https://github.com/Pueblo98/Granny/tree/17658b0ef90328a1f2ef2ced1707a9f3bd07a622/design-system
- Sync conventions:
  https://github.com/Pueblo98/Granny/blob/17658b0ef90328a1f2ef2ced1707a9f3bd07a622/.design-sync/conventions.md
- Build and sync record:
  https://github.com/Pueblo98/Granny/blob/17658b0ef90328a1f2ef2ced1707a9f3bd07a622/docs/10-execution/sessions/2026-09-18-design-system-build.md

The package guide names cc97e484 as the canonical repository revision from
which construction began. The finished committed package is 17658b0 above.
Use the finished package for components and tokens. Apply the accepted product
deltas below when the older synced guide disagrees with them.

The accepted Round conversation selection is here:

- Decision commit:
  8d84fbd15be440b8a4512d851fcb92efee3778a5
- Canonical note:
  https://github.com/Pueblo98/Granny/blob/8d84fbd15be440b8a4512d851fcb92efee3778a5/docs/02-design/brand-and-visual-identity.md#accepted-shape-direction--round-conversation
- Exact visual reference:
  https://github.com/Pueblo98/Granny/blob/8d84fbd15be440b8a4512d851fcb92efee3778a5/docs/02-design/mockups/2026-09-17-chat-entry/round-5/01-round-conversation.png

Read the current product contracts before composing:

- docs/02-design/product-design-spec.md
- docs/02-design/design-system.md
- docs/02-design/accessibility.md
- docs/02-design/voice-ux.md
- docs/02-design/conversation-first-plan.md
- docs/02-design/context-rooms.md
- docs/05-safety-privacy/action-policy.md
- docs/05-safety-privacy/safety-and-privacy.md
- docs/09-decisions/ADR-0013-bounded-interface-composition.md
- docs/09-decisions/ADR-0014-stable-home-context-panel.md
- docs/09-decisions/ADR-0015-context-rooms.md

If repository browsing is unavailable, the requirements below are sufficient
to begin the core shell and message flow. Record inaccessible sources in the
handoff; do not invent their contents.

THE PRODUCT

Granny is a temporary codename for an AI-first computer experience for older
adults. The active product is an installable stock-Android tablet app. It is
not an operating system, medical product, caregiver dashboard, surveillance
tool, robot companion or simplified launcher. Do not create a public name,
wordmark, grandmother character, robot mascot or age caricature.

The central promise is: ask for something useful, understand what will happen,
stay in charge. The computer handles interface work while the adult remains
the author of the goal and every meaningful consequence.

The interface should feel calm, capable, candid, warm and adult. It should be
easy to approach without looking childish, clinical, patronizing or like a
generic AI chat product. Avoid the familiar visual shortcuts of AI products:
gradients, glowing orbs, sparkle symbols, glass panels, prompt-chip walls,
floating-card stacks, novelty chat bubbles, typing theatre and decorative
automation diagrams.

THE SETTLED INTERACTION MODEL

The prior tile-based browser Home was rejected because it exposed too many
buttons and made the person choose a capability before stating a goal. Do not
copy its appearance or its five feature tiles. Its fictional fixtures and
safety states remain useful behavior references.

Home is a stable conversation surface with these app-owned anchors:

1. One clear invitation to say or type a goal.
2. A visible typed path.
3. A large labeled Talk path.
4. A quiet labeled Menu path to History, Settings, Privacy and Help.
5. A stable visible Stop control whenever a task is active.
6. Zero or one optional Home context panel when an item truly earns the space.

There is no capability grid, carousel, widget shelf, dashboard, permanent
sidebar, shortcut ribbon or pile of suggested prompts. Do not make the person
manage a layout. Additional timely items, if any, belong behind a labeled Today
route as a short stable list. Core controls do not move while Home is open.

Context Rooms are the accepted next experience layer. Home still handles any
request and must not become a room grid. A secondary labeled Rooms route opens
a calm directly browsable library. Inside a room the same assistant, Round
composer, controls, action policy and communication personality remain. The
room foregrounds related references and may use a bounded atmosphere; relevant
cross-room context is minimum-necessary and visibly sourced when it affects
meaning, privacy or correction. Conversation is never the only way to find an
item. Deleting a room is separate from deleting its underlying data.

Use bounded semantic composition. The agent may select, fill and order only
registered components and typed slots. The app owns their semantics, action
bindings, focus order, reflow and policy. Never invent executable controls,
rename a consequential action, render model-defined event handlers or let
visual confidence grant authority. Unknown component types and invalid plans
fail closed.

The Round conversation silhouette is accepted for the composer: a full,
smoothly rounded speech balloon with a short lower-left tail and an obvious
writing area. Carry the recognizable silhouette through compact, normal and
expanded states. Keep the writing surface roomy, modern and easy to find. The
reference PNG accepts shape only; its colors, typography, copy and exact vector
geometry are not accepted tokens. Do not turn every other surface into a chat
bubble.

SYSTEM DELTAS YOU MUST HANDLE OPENLY

The synced 0.1.0 library predates two accepted decisions:

- CMP-007's Round conversation composer shape is not yet represented by a
  dedicated synced component variant.
- ADR-0014 and CMP-010's zero-or-one Home context panel are not yet represented
  in the 0.1.0 composition registry.

Do not rebuild or fork the design system inside this app project. Use the
synced components everywhere they already fit. For the composer, apply the
accepted Round conversation silhouette in the app composition and log the
exact missing component/variant as a design-system change request. For Home,
build the zero-panel state as the default shippable composition. Also create
one clearly annotated CMP-010 proposal/state for review, following the contract
below, and list it as pending registry admission. Do not disguise an existing
component as CMP-010 or silently create a generic card.

VISUAL SYSTEM RULES

Wrap every surface in ThemeProvider. Use the synced semantic tokens and `ds-`
layout/type classes. Never introduce raw colors, sizes, radii or durations.
Open Day is the working comparison baseline and Bright Signal is the existing
challenger. Keep component semantics identical between them. Do not blend the
two territories into a third theme.

All palettes, typefaces, radii, motion values and icons remain proposed. Use
the system consistently so Simon can review the experience, but label the
visual treatment as proposed. A polished frontend is not brand acceptance.
Dark mode does not exist in the synced system; do not generate it by inversion
or claim it is complete.

Group content with spacing, typography and restrained rules. Use raised panels
only when a boundary has meaning. Do not place every response in a card or
alternate colored chat bubbles down the page. Keep a generous reading column
and let rich task content appear naturally inside the conversation.

Use one visual primary action in a region. Show controls only when they answer
the current question, control current work, or provide a required escape.
Secondary actions can be quiet labeled controls. Do not reduce button count by
hiding Stop, typed input, Change, Cancel, privacy, or necessary clarification.
Minimal means low decision load, not hidden capability.

Use icons as support, never as the only label for an essential action. State
must never depend on color alone. The decorative accent must not become a
control fill, warning surface or status code. Sending is not a danger action;
danger styling is reserved for deletion or removal.

CORE APP SHELL

Create a single tablet-first app shell with:

- a restrained app identity area using the temporary text label only;
- a quiet labeled Menu action;
- one scrollable conversation/document region;
- a stable current-task status region when work is active;
- a stable Stop position during active work;
- the Round conversation composer as the primary input anchor;
- correct IME/keyboard behavior, without letting the keyboard obscure the
  latest request, current question, approval or Stop;
- predictable Back behavior and focus restoration.

At rest, the shell should feel useful before it feels busy. Lead with one
plain-language invitation such as “What would you like to do?” and a short
supporting line. Do not present five feature buttons. One short example may be
shown as instructional text, not as a wall of tappable prompts.

The typed field keeps a persistent visible label; placeholder text cannot be
its only label. Do not submit a consequential action with Enter. A submit/send
affordance for a request may appear only when there is text and must remain
visually distinct from approval of an external consequence. Talk is labeled,
not a bare microphone. Listening is always explicitly started and stopped;
there is no ambient or wake-word state.

HOME CONTEXT PANEL CONTRACT

Home may contain zero or one context panel below the invitation. Absence is a
complete, intentional state and must not look broken or empty.

The optional panel may show only verified, release-admitted information. It
may prioritize unresolved work requiring attention, then a timely reminder,
recent artifact or explicitly kept item. It identifies state/source when
needed and offers one clear next action. It never previews sensitive message,
contact, health, financial or private-memory content unsolicited. Use a
generic label or require an explicit open action. It cannot authorize, execute
or imply completion of an external action.

Provide direct controls for Keep here, Hide and Reset Home in the appropriate
secondary route without turning Home into layout customization. Test the panel
absent and present. At narrow width or large type, it may reflow below the
input region while preserving reading and focus position.

BUILD THIS FIRST: THE COMPLETE MESSAGE SLICE

Use fictional data only. Build this exact interaction from idle Home through
recovery before expanding to other workflows:

User request: “Tell David I'll call after dinner.”

1. IDLE HOME
   - One invitation, typed input, labeled Talk and quiet Menu.
   - Default to no context panel for this checkpoint.
   - No capability tiles or prompt chips.

2. REQUEST ENTERED
   - Show the user's request as readable conversation content without a
     decorative colored-bubble exchange.
   - Keep the composer available.
   - Do not insert a redundant “Use this request” step when intent is clear.

3. CLARIFICATION, ONLY IF NEEDED
   - If two approved contacts named David exist, ask “Which David?”
   - Show no more than the useful current choices with real differentiators,
     plus “None of these.”
   - The same answer must be possible by touch, type or voice.
   - Never infer a recipient from conversational confidence.

4. EXACT CONSEQUENCE PREVIEW
   - Use ConsequencePreview, not a plain button or generic card.
   - Show the full recipient, differentiator, channel, exact message body,
     effect and reversibility/remaining user step.
   - For the MVP handoff fixture, use:
       To: David [fictional differentiator]
       Channel: Example Messages
       Message: I'll call after dinner.
       Effect: Open an unsent draft in Example Messages. You still choose Send
       there.
   - Actions: “Open this draft”, “Change it”, “Cancel”.
   - Never use OK, Yes, Confirm, Continue or Submit for the consequence.
   - Do not autofocus approval. Enter, swipe, double-tap, silence or a detached
     conversational “yes” cannot approve it.
   - Long recipient/body text remains inspectable and never truncates.

5. EDIT AND INVALIDATION
   - “Change it” exposes a clear editable body with persistent label.
   - An edit invalidates the old approval and produces a fresh preview.
   - An expired preview leaves content readable but removes authority and
     offers “Renew preview”.

6. ACTIVITY
   - Show the user goal, current safe step and last verified step.
   - Do not expose chain of thought, internal tool names, fake percentages or
     generic “working magic”.
   - Stop stays visible and enabled during loading, waiting and reconciliation.
   - At 5 seconds name what is being awaited. At 15 seconds offer a manual
     path. Bounded timeout ends the task.

7. RESULT
   - Prepared result: “The draft is open. It hasn't been sent by Granny.”
   - Verified send, if separately admitted in a future route: “The app reports
     the message sent to David.”
   - Unknown result: “I can't confirm whether it sent. Check the conversation
     before trying again.”
   - Use OutcomePanel with required evidence. Prepared, verified complete,
     partial, unknown, interrupted, cancelled and safely failed must look and
     read differently.
   - Unknown never offers a blind Send/Retry. Repetition never re-executes.
   - There is no generic success toast.

8. STOP AND INTERRUPTION
   - Show Stop before dispatch, during waiting and during a pending effect.
   - After Stop, state exactly what did not happen, what did happen, or what is
     uncertain.
   - “Stopping” means reconciliation of possible prior effects, never queued
     work continuing.
   - Offer Take over only when it leaves a visible app state the person can
     safely continue from.

After the core message slice is coherent, expand the same shell and hierarchy
to the other four MVP workflows. They are outcomes inside the conversation,
not new Home destinations:

A. PHOTOS
Request: “Show me the photos Sophie sent yesterday.”
Clarify person/channel/date only when unresolved. Show a photo strip or large
image with sender, date and source; provide next/previous only while browsing.
Disclose a mark-read effect where applicable. Missing date/source produces an
honest partial or no-result state, never fabricated metadata.

B. EXPLAIN AND RECOVER
Request: “What am I looking at?”
Name only the observed or supplied screen and explain it briefly. Offer one
safe next step such as “Back to reading” only when the target is known. For a
secure/login screen, stop capture and tell the person to continue themselves.
Do not imply universal Android overlays or coordinate-only control.

C. MEDIA
Request: “Play [title].”
Resolve ambiguous title, artist or service only as needed. Use a compact
MediaRow with title, artist/source and labeled Play/Pause. Do not build a media
catalog or autoplay merely because the component appeared. A subscription,
ad or login state reports that playback did not start.

D. READABILITY
Request: “Make this easier to read.”
Clarify Granny versus another app only when context is insufficient. Show an
inline size preview with labeled decrease/increase, Apply and Restore. The MVP
may change Granny's own setting; external settings remain a system/manual
handoff unless separately admitted.

SUPPORTING SURFACES

Build supporting routes with the same restraint:

- First launch: one decision at a time; explain value before permission.
- Permission education: state data, purpose, destination and what happens if
  declined; the control opens Android's permission screen and never claims the
  grant already happened.
- History: minimal task type, time, outcome and evidence class; no full message
  bodies, screenshots or transcript archive.
- Settings: text size, speech, communication preference and reduced motion in
  calm labeled rows, not a dense dashboard.
- Privacy: show what stays local, what may leave the tablet, active grants and
  deletion scope. Keep deletion visually separate from reversible settings.
- Help: “What can I ask?”, practice stopping, permissions and problem report.
- Offline/auth/restricted: name the exact obstacle, completed work, what still
  works locally and one safe next step.

During setup, the person explicitly chooses a communication starting style.
App V1 may silently optimize bounded qualities such as brevity, pacing,
formatting, explanation depth, question frequency and light humor. Direct user
requests always override adaptation. Language, voice/gender presentation and
access settings never change silently. Settings exposes the baseline, Pause
and Reset. Do not present this App V1 behavior as MVP implementation.

App V1 may also automatically save an allowed important fact with a compact,
non-blocking receipt and Undo. Do not ask “Should I remember this?” after every
fact. Do not save uncertain, sensitive or disallowed inferences, mine external
content or create a transcript archive. Memory review, correction, deletion
and source remain reachable. Mark all of these frames App V1 so they do not
silently expand the MVP frontend.

COMPONENTS TO USE

Use the registered components according to their actual semantics:

- CMP-001 StopControl for Stop, stopping and Take over; never disabled.
- CMP-002 TalkControl and Transcript for explicit listening and editable text.
- CMP-003 ConsequencePreview and DeletionPreview for consequential approval.
- CMP-004 ActivityStatus for running, waiting and manual-path states.
- CMP-005 ChoiceList for real clarification choices, with no-match escape.
- CMP-006 OutcomePanel for evidence-backed result and recovery.
- CMP-007 Button, TextField, SettingSwitch and StepperControl for ordinary
  controls; the Round conversation composer is the accepted pending variant.
- CMP-008 GuidanceNote and DisclosurePanel for recoverable obstacles,
  permissions and data use.
- CMP-009 ContentRow, SettingsRow and MediaRow for compact lists/content.
- CMP-010 Home context panel only as the explicitly annotated pending system
  addition described above.

Do not display a component catalogue inside the app. The current state chooses
the smallest sufficient set. A generated component never grants permission to
execute its associated action.

COPY AND CONVERSATION CHARACTER

Write in warm, specific adult language. Default progress and results to one or
two short sentences plus one next step. Add detail on request. Explain the
observable state, not model reasoning. Use “I found…”, “The app reports…” and
“I couldn't verify…” according to evidence.

Do not use pet names, exaggerated praise, faux nurse language, helplessness,
memory-loss assumptions or instructions aimed at a caregiver instead of the
adult. Avoid jargon such as model, MCP, adapter, endpoint, confidence score and
policy class in product copy. Never say “Done” when only an app was opened.

The software may be personable but must not imply human feelings, kinship,
medical authority or a need for continued conversation. Do not create a
humanlike avatar.

ACCESSIBILITY IS PART OF THE COMPOSITION

Design for older adults with varied vision, hearing, dexterity, cognition and
technology experience without treating age as one ability profile.

- Minimum interactive target: 56dp.
- Primary actions, Talk and Stop: 64dp minimum.
- Minimum separation between primary adjacent targets: 12dp.
- Body text starts large and remains readable at 200% app text and combined
  300% scaling.
- Supporting text never becomes tiny to preserve layout.
- Text and labels wrap; controls grow. Do not ellipsize essential labels,
  recipients, message bodies, effects or errors.
- Preserve a strong visible focus indicator with separation from adjacent
  colors.
- Every action has a native role, accessible name and state/value.
- Reading/source order remains sensible after visual reflow.
- Touch, keyboard, switch and TalkBack paths reach the same outcome.
- Voice has a complete visible touch equivalent. No task requires hearing.
- Captions/transcripts accompany audio; private content is not read aloud by
  default.
- Reduced motion removes nonessential movement without hiding state changes.
- Do not use time pressure, countdown approval or disappearing essential
  actions.
- Do not steal scroll position while a person reads a preview. Announce a new
  semantic state once without refocusing the whole screen.

Create and inspect at least these layouts:

- compact phone-width study at 360dp for reflow pressure only;
- tablet portrait around 600dp;
- wide tablet/landscape around 840dp;
- keyboard open;
- 200% in-app text;
- 200% system text combined with app scaling;
- combined 300% stress state at narrow width;
- reduced motion;
- touch-only and silent use;
- long names, long message body and translated-label expansion.

The product target remains tablet. The 360dp study proves reflow; it does not
change the Stage 1 device scope.

STATE COVERAGE

For each applicable screen or component, include real content and the states
that change understanding or action:

- idle/resting;
- hover only if the design tool needs it, never as the sole affordance;
- focused;
- pressed;
- selected;
- disabled with a visible full-contrast reason;
- loading/running;
- waiting on a dependency;
- empty/no result;
- offline;
- permission declined;
- authentication required;
- expired/stale preview;
- interrupted/stopped;
- prepared/partial/unknown/verified result;
- long content and large text.

Do not generate every combinatorial state as decorative frame volume. Build
the states needed to prove the contract, then use component variants for the
rest.

WHAT YOU MAY DECIDE

You may decide routine reversible composition details: spacing using existing
tokens, reading width, exact placement within the stable shell, responsive
reflow, which existing component variant fits a state, and how to keep the
control count low.

Do not decide a public name, final brand territory, final font, new autonomy,
new external capability, new data collection, hidden confirmation, Stage 2/3
behavior, production Android implementation or whether a product gate passed.
Do not ask Simon to repeat decisions already recorded here. Surface only a
question whose answer would change product behavior, safety, privacy, accepted
shape direction or final brand acceptance. Otherwise make the reversible
choice, annotate it and continue.

BUILD ORDER AND CHECKPOINTS

Phase 1 — Distill and establish
- Verify the synced project/package and list any missing asset/component.
- Create the tablet shell, zero-panel Home and Round conversation composer.
- Count visible actions at rest and remove anything that does not serve the
  current state.

Phase 2 — Prove the interaction
- Complete the entire fictional David message slice, including ambiguity,
  exact preview, edit invalidation, activity/Stop, prepared result and unknown
  recovery.
- Build responsive and large-text variants for the most crowded preview.
- Produce one review checkpoint with actual editable references, not only
  screenshots or prose.

Phase 3 — Extend the language
- Apply the approved shell and hierarchy to photos, explain/recover, media and
  readability.
- Add the optional proposed CMP-010 Home state and the supporting routes.

Phase 4 — Harden
- Audit semantics, focus/source order, touch targets, contrast, text scaling,
  keyboard/IME, reduced motion, private-content exposure, exact action wording,
  Stop reachability and truthful results.
- Compare Open Day with Bright Signal on the same Home and exact-preview
  structure. Do not change layout or copy between themes.
- Distill back to one primary working frontend plus a small comparison sheet.

Phase 5 — Build the bounded Context Rooms slice
- Preserve global Home and add a secondary SCR-016 Rooms library, not a grid on
  Home or a decorative floor plan.
- Build one SCR-017 Kitchen room with CMP-011 written identity, purpose,
  bounded atmosphere, direct browse/search and the same Round composer.
- Demonstrate one source-carrying cross-room result with View source and Exclude
  source, plus local membership receipt/Undo.
- Show archive, Delete room only and separate underlying-data deletion with a
  fictional inventory. Model/offline failure must leave direct browsing usable.
- Use only fictional in-memory data. Mark durable storage and App V1 admission
  as unimplemented and evidence-gated.

Do not create three unrelated app concepts. The structural direction and
composer shape are settled. Variation is useful only for unresolved visual
territory review and must keep behavior constant.

REQUIRED DELIVERABLES

Return all of the following in the Claude Design project:

1. One editable, linked Stage 1 frontend flow using the synced system.
2. A frame index mapped to SCR-001 through SCR-017 where applicable, clearly
   marking MVP, App V1 and deferred states.
3. The complete message-flow checkpoint mapped to J-003 and CMP-001–007.
4. Integrated photo, explain/recover, media and readability flows mapped to
   J-001, J-002, J-005 and J-006.
5. Zero-panel Home and one annotated proposed CMP-010 panel state.
6. Compact, tablet portrait, wide/landscape, keyboard-open and large-text
   variants for the core shell and exact preview.
7. Focus order, accessible names/roles, announcements and reflow annotations
   for every core state.
8. A state matrix showing idle, listening, clarification, preview, activity,
   Stop, prepared, verified, partial, unknown, offline and expired states.
9. A control inventory for each core frame. For every visible control, state
   the immediate user need it serves. Remove redundant controls.
10. A system-delta list containing at least the Round composer variant and
    CMP-010 registry gap, plus any additional needed component changes. Do not
    silently solve these with one-off tokens.
11. A visual comparison sheet for Open Day and Bright Signal using identical
    content and structure, with all values still labeled proposed.
12. A handoff note with exact project references, system version, missing
    states, unresolved product questions and tests that remain unrun.
13. A T-119 Context Rooms flow mapped to PRD-FR-022, UC-026, J-009,
    SCR-016/017 and CMP-011, including global return, direct findability,
    cross-room provenance and delete-room-versus-delete-data review.

DEFINITION OF A GOOD RESULT

The frontend succeeds when a person can immediately understand where to begin,
state a goal by touch or voice, follow one current question at a time, inspect
the exact consequence of an action, stop work at any point, and understand
whether the outcome is prepared, verified, partial or unknown. The screen at
rest should have very little competing for attention. Rich content should
appear only when the task needs it. Safety and settings remain discoverable
without becoming permanent dashboard furniture.

Before handing off, perform an anti-template review:

- Could this be mistaken for a generic AI chat app? If yes, remove borrowed AI
  tropes and strengthen Granny's clear document-like hierarchy.
- Could this be mistaken for a senior-mode launcher? If yes, remove feature
  tiles and infantilizing simplification.
- Are there buttons whose only purpose is to expose product capability? Remove
  them from Home and let the person state the goal.
- Did minimalism hide an escape, alternative input or consequence? Restore it.
- Does every status tell the truth about evidence? Correct any success theater.
- Does every consequential action name exactly what will happen? Rewrite it.
- Does the design still work with long content, large type and keyboard open?
  Fix the composition before polishing.

If the editable shell and David message slice are absent, start with Phase 1
and Phase 2. If they already exist, verify them, then continue through Phase 5
and return the first Context Rooms checkpoint with actual editable references.
```

## Known handoff limits

The prompt directs a Claude Design artifact, not production code. The synced
system's Chromium measurements do not establish native Android dp/sp behavior,
TalkBack, switch access, IME behavior, physical-device performance or older
adult comprehension. Those remain separate evidence work.
