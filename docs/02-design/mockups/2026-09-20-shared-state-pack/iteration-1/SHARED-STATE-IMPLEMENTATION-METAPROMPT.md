---
title: "Metaprompt — Implement the shared conversation state surfaces"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [design, implementation, metaprompt, conversation, states]
related:
  - README.md
  - ../../../shared-conversation-state-surfaces.md
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
  - ../../2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md
  - ../../../browser-prototype.md
  - ../../../product-design-spec.md
  - ../../../design-system.md
  - ../../../accessibility.md
---

# Metaprompt — Implement the shared conversation state surfaces

Simon authorized this implementation handoff on 2026-09-20 for the frontend
session already building the Granny UI. Paste the prompt below into that active
session. It adds the shared conversation states to the existing implementation;
it does not ask the session to restart the project or rebuild unrelated Rooms.

```text
Continue the active Granny frontend implementation in your existing authorized
checkout, worktree and task branch. Do not return another plan or metaprompt.
Inspect the work already completed in this session, then implement the seven
shared conversation state surfaces described below.

Repository:

  /home/lgtw/Work/granny

Your current working checkout may be a task worktree rather than that primary
path. Confirm `pwd`, repository root, branch, HEAD and `git status` first. Keep
using the current implementation branch if it is valid. Do not discard,
overwrite, reset, stash or duplicate the work already in progress.

## What Simon is asking for

The seven raster images are approved UX/UI state references. They show the
important hierarchy, wording, controls and Harbour Blue treatment for common
conversation states.

They are NOT seven new pages and they are NOT instructions to replace the
whole Home or Room with a generic white screen.

The core implementation rule is:

  Home or current Room remains the underlying place.
  The stable bottom conversation area changes state.
  Listening/transcript normally expand from the Round composer.
  Clarification, preview, activity and results appear as one temporary task
  surface directly above or connected to that composer.

Example: if Talk starts inside Kitchen, Kitchen remains the current visible and
semantic context. Keep the Kitchen name, atmosphere and useful room content
visible where space permits. Expand the bottom composer upward to show
Listening and Heard so far. When listening ends or is cancelled, collapse the
surface and restore the same Kitchen scroll/focus state. Do not navigate to a
new Listening route.

At large text, narrow widths, constrained height or with the keyboard open, a
state may temporarily occupy most of the viewport and scroll. That is the
responsive form of the same temporary state, not a separate product page.
Decorative room art may be covered or removed before essential text is shrunk.

An “overlay” here means an in-app compositional layer inside Granny. Do not
claim or build a universal Android overlay over other apps.

## Use the repository workflows

Use these workflows if available:

1. `$granny-session-lifecycle` for continuity, exact changed paths and handoff.
2. `$granny-design-handoff` for SCR/CMP, copy, semantics and access authority.
3. `$granny-task-slice` in implementation mode for the bounded frontend change.
4. `$granny-ui-craft` in Harden mode for hierarchy, responsive behavior and
   anti-template review.

If this Astra session is already acting as an orchestrator, continue doing so.
Use up to three Terra sub-agents in parallel for bounded, non-overlapping work
when useful: one read-only state-model/code audit, one visual/accessibility
audit and one test audit. The lead agent must personally read the authority
documents, reconcile findings, own shared source-file edits and inspect every
sub-agent diff. Do not let multiple agents edit the same app files. Sub-agents
must not change scope, publish or merge independently.

## Ensure the new design sources are available

The accepted state-surface contract and images are on `origin/main`. Read these
before editing:

1. `AGENTS.md`
2. `docs/02-design/shared-conversation-state-surfaces.md`
3. `docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/README.md`
4. `docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/manifest.json`
5. `docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md`
6. `docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md`
7. `docs/02-design/product-design-spec.md`, SCR-003 through SCR-008 and SCR-017
8. `docs/02-design/design-system.md`, CMP-001 through CMP-007 and CMP-011
9. `docs/02-design/accessibility.md`
10. `docs/02-design/voice-ux.md`
11. `docs/05-safety-privacy/action-policy.md`
12. `prototypes/stage-1/README.md` and the actual frontend source and tests

If the active implementation branch predates these files, fetch and inspect
`origin/main`. Integrate current main only when that is safe for the active
branch. If a merge would overwrite in-progress work, use read-only `git show`
and temporary inspection files instead of copying files between worktrees or
silently recreating the contract. Record the dependency in the session note.

Visually inspect every image at original detail before coding:

- `01-listening.png`
- `02-editable-transcript.png`
- `03-which-david.png`
- `04-exact-draft-preview.png`
- `05-active-task-stop.png`
- `06-prepared-not-sent.png`
- `07-unknown-outcome.png`
- `comparison.png` for family-level consistency only

All are under:

  docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/

The individual images control detail. The comparison sheet is a resampled
review aid.

## Inspect the current implementation before changing it

This session has already been building the UI. Run the current frontend and
inspect its rendered Home, at least one decorated Room, composer, Talk path,
message path, Stop behavior and responsive states. Map:

- the current place/navigation state (`Home`, `Room`, selected room);
- the conversation/task state;
- composer rendering and focus ownership;
- current modal, sheet, panel or overlay primitives;
- scripted fixture transitions and timing;
- existing state tests and browser checks;
- which current code is useful, which needs adaptation and which obsolete UI
  can be safely removed.

Keep place state and temporary conversation-surface state separate. Do not
encode Listening, Preview or Result as a replacement Room route. Prefer one
reusable renderer/component family shared by Home and all Rooms rather than
seven copied layouts per Room.

Reuse correct existing behavior and tests. Adapt or replace visually poor or
structurally incompatible UI after tracing its callers. Deleting obsolete
in-scope UI is acceptable when necessary, but do not remove existing safety,
scripted-workflow, local-only, CSP or regression behavior merely to simplify
the redesign.

## Shared implementation model

Use the existing architecture where possible, but preserve an equivalent of:

- underlying place: Home or one Room;
- surface state: idle, listening, transcript review, clarification, exact
  preview, active task, prepared result or unknown result;
- one temporary task surface at a time;
- originating focus and scroll position for restoration;
- exact task fixture data separate from layout;
- active cancellation state separate from ordinary composer submission.

Typed requests do not have to pass through Listening or transcript review.
Prepared and Unknown are alternative outcomes, not consecutive screens. Do not
turn the examples into a forced seven-step wizard.

The state surface may temporarily contain keyboard/focus while it needs a
decision. Preserving the Room means preserving its identity, state and return
position; it does not mean every obscured background control remains active
through a modal consequence review.

Switching Rooms, going Home or opening another destination while listening or
acting must first use the appropriate Cancel, Stop or interruption behavior.
Never allow an active state to follow silently into another Room.

## Implement each reference

### 01 — Listening

Reference: `01-listening.png`

Implement this as the Round composer expanding upward from its stable bottom
position. Keep the underlying Home/Room visible above it.

Required visible content:

- `Listening`
- `Say what you would like to do.`
- persistent label `Heard so far`
- provisional transcript and visible caret
- `Done listening`
- `Cancel`
- `Type instead`

Important behavior:

- entry occurs only after explicit Talk activation;
- transcript text is visibly and semantically provisional;
- do not announce every streaming token;
- Done listening advances to editable transcript review;
- Type instead ends simulated capture and opens typing in the same place;
- Cancel exits without using the words;
- do not show Send or active-task Stop in this state;
- browser behavior remains explicitly simulated unless the current authorized
  implementation already has a separately accepted microphone contract.

### 02 — Editable transcript

Reference: `02-editable-transcript.png`

Keep the expanded composer in the same bottom-connected position.

Required visible content:

- `Check what I heard`
- persistent field label `Request`
- editable final transcript with visible caret
- `This asks Granny to understand the request. It does not send anything.`
- `Use this request`
- `Listen again`
- `Cancel`

Important behavior:

- the transcript must be a real editable field, not decorative text;
- Use this request requests interpretation only and cannot approve an external
  effect;
- Listen again returns to explicit simulated listening;
- Cancel leaves the request unused;
- no generic Continue, Send paper-plane or automatic approval.

### 03 — Clarification / Which David?

Reference: `03-which-david.png`

Render one temporary choice surface above the compact composer. Keep the
current Home/Room identity visible.

Use the fictional fixture shown in the reference for deterministic coverage:

- heading `Which David?`
- instruction `Choose the person you mean.`
- retained request `Tell David I’ll call after dinner.`
- row 1: `David` / `Brother` / `Example Messages`
- row 2: `David` / `Gardening group` / `Example Mail`
- `None of these`
- `Edit request`
- `Cancel`
- compact answer composer with `Type your answer`, free-text invitation, Talk
  and Send

Important behavior:

- each whole row is one semantic and pointer target;
- do not use avatars, color or position as the differentiator;
- do not preselect or guess a person;
- typing/talking an answer remains an equivalent route;
- the current request stays visible so the person does not rely on memory.

### 04 — Exact draft preview

Reference: `04-exact-draft-preview.png`

Render one rectangular consequence-review surface above the compact composer.
It must be visually distinct from the speech-balloon composer. It may become a
larger focused sheet for long content or large text without becoming a new
navigation destination.

Required visible content for the fixture:

- `Check the draft`
- `Nothing has been opened or sent yet.`
- disclosure that this opens a fictional unsent draft and does not send
- target `David`
- differentiator `Brother`
- destination `Example Messages`
- exact message `I’ll call after dinner.`
- consequence `A fictional unsent draft opens`
- `Open this draft`
- `Change it`
- `Cancel`
- `Repeat`

Important behavior:

- consequence appears before approval controls;
- primary action label is specific, never Yes or Continue;
- no approval is preselected or triggered by a custom generic-Enter shortcut;
  Enter/Space or assistive activation remains valid when the specific approval
  control is deliberately focused;
- composer Send may submit a change request but cannot approve the preview;
- editing material content invalidates the prior preview/authority;
- treat message content as a private region;
- this browser slice remains fictional and must not send or open a real app.

### 05 — Active task + Stop

Reference: `05-active-task-stop.png`

Show one activity surface above the stable composer. Change the composer to the
active treatment. Stop replaces Send in the same stable control region; do not
display both.

Required visible content:

- concrete heading such as `Opening the draft`
- `Goal`
- `Latest verified step`
- `Current step`
- plain waiting reason when applicable
- `Take over`
- `Repeat status`
- written `Stop` with the stop-square symbol

Important behavior:

- Stop uses reserved `#962F43`, is never icon-only and is always reachable;
- Stop acts on local state immediately before waiting for simulated/runtime
  acknowledgment;
- do not show an invented percentage, chain of thought or fake completion;
- Take over follows the existing Stop/takeover contract;
- updates announce meaningful state once without stealing reading position;
- the underlying Room stays the current place.

### 06 — Prepared — not sent

Reference: `06-prepared-not-sent.png`

Restore the normal composer and place one compact outcome surface above it.
This is a result within the current conversation, not a success page.

Required visible content:

- concrete result heading such as `Draft opened`
- unmistakable outcome `Prepared — not sent`
- `What Granny verified`
- `What Granny did not do`
- `Next step`
- `Continue manually`
- `Done`

Important behavior:

- never imply sent, delivered or externally completed;
- do not use success green or a checkmark as the only meaning;
- Continue manually is a handoff, not evidence of a later send;
- Done dismisses/collapses the surface and never repeats the action;
- preserve the same Home/Room and restore sensible focus.

### 07 — Unknown outcome

Reference: `07-unknown-outcome.png`

Use the same result position as 06, with candid uncertainty instead of a red
error page. Keep the normal composer available for a genuinely new request.

Required visible content:

- `I can’t confirm whether it sent`
- `Unknown outcome`
- `Known`
- `Unknown`
- `Next step`
- `Granny will not retry this message automatically.`
- `Review status`
- `Open app yourself`
- `Done`

Important behavior:

- do not offer Retry unless existing independent executor state marks retry
  safe; this fixture must not offer it;
- do not translate uncertainty into success or ordinary failure;
- Review status cannot re-execute the effect;
- the ordinary composer can begin a new request but cannot silently repeat the
  uncertain action;
- no toast-only error, technical log or automatic progress.

## Visual system

Preserve the selected Harbour Blue roles:

- Canvas `#FBF6EE`
- Surface `#FFFFFF`
- Ink `#2E2D32`
- Accent `#2C5981`
- Outline `#597DA0`
- Send `#165D9C`
- Focus ring `#4930A1`, separated and focus-only
- Stop/danger `#962F43`, only for Stop or genuine destruction
- On-colour `#FFFFFF`

Preserve the Round white speech-balloon composer with lower-left tail. Use the
repository's actual Bricolage Grotesque 600 and DM Sans 400/600 only if the
files are present; otherwise retain an honest fallback and record it.

Keep the result adult, calm, spacious and direct. Do not add gradients, glass,
glow, deep shadows, AI sparkles, animated orbs, avatars, celebratory effects,
feature tiles, bottom tabs or repeated floating cards. The temporary surface
should feel connected to the conversation area rather than like a generic
dashboard widget.

## Responsive and accessibility behavior

- Keep a simple reading and DOM order: underlying place heading/context, state
  heading, state content, decision/escape actions, composer as applicable.
- When a modal consequence surface owns focus, contain focus within it until
  approval, change or cancel, then restore the originating control.
- Listening/transcript state changes should use appropriate live semantics but
  must not announce every partial token.
- Give each choice row one accessible name containing its differentiator and
  destination.
- Preserve written labels for Talk, Send, Stop, Cancel and important outcomes;
  never rely on icon or color alone.
- Maintain implementation targets of at least 56dp equivalents and 64dp for
  primary, Stop and consequential actions.
- At 200% text and constrained height, stack controls and let the state region
  scroll before shrinking text or clipping controls.
- Room decoration is expendable; room name, state meaning and navigation are
  not.
- Preserve visible focus-ring space without layout movement or clipping.
- Respect reduced motion; do not use movement to communicate state.

## Minimum functional proof

Implement the state family once and prove it in at least both contexts:

1. Home → Talk → Listening → Editable transcript → Clarification → Preview →
   Active task → Prepared result.
2. Kitchen (or the first implemented decorated Room) → the same state renderer
   while Kitchen remains the underlying place and returns unchanged.
3. Active task → Unknown outcome as an alternative result branch.
4. Cancel/Type instead/Change it/Stop/Done restore the correct underlying
   place, scroll and focus.

After the reusable proof works, wire the same shared renderer into every other
already-implemented Room. Do not create room-specific copies or change Room
identity/art to implement these states.

Use only fictional fixture data. Do not activate a microphone, call a provider,
open or send through a real external app, store personal content, install a
dependency or change frameworks.

## Testing and review

Add deterministic coverage for:

- every allowed state transition and escape path;
- typed entry bypassing listening/transcript review;
- Prepared and Unknown as alternative branches;
- Stop replacing Send and remaining reachable;
- exact preview fields and no incidental approval;
- no automatic retry after Unknown;
- Home/Room identity, scroll and focus restoration;
- one-surface-at-a-time rendering;
- keyboard traversal and modal focus containment where used;
- narrow/constrained height, keyboard-open and 200% text behavior;
- no horizontal clipping or hidden essential action;
- existing scripted workflows, CSP/local-only behavior and egress assertions.

Run the repository's existing model, scheduler, cloud, server, browser and
runtime-browser checks that apply to the files changed. Render and inspect the
states at representative landscape tablet size, narrow width, constrained
height and enlarged text. Compare the individual reference images at original
detail, but judge implementation fidelity by hierarchy and behavior rather
than literal pixel coordinates.

Do not claim that browser checks prove Android, TalkBack, switch access,
microphone behavior, external overlay feasibility, Stop effectiveness against
another app, outcome verification or older-adult comprehension.

## Stop point and report

Stop after the seven shared state surfaces are implemented, integrated with
Home and the existing Rooms, and covered by the relevant deterministic checks.
Do not use this task to redesign Home, reopen Harbour Blue, invent new Rooms,
add a backend, implement Android, add real speech or broaden external actions.

Report:

- exact files changed;
- current component/state architecture and how place state remains separate;
- what existing code was reused, adapted, replaced or removed;
- how each of the seven images maps to the implementation;
- proof from Home and one Room, plus how all Rooms share it;
- tests and rendered viewport checks run;
- visual/accessibility mismatches and unrun evidence;
- branch, commits and handoff path.
```
