---
title: "Metaprompt — Implement navigation and supporting surfaces"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [design, implementation, metaprompt, navigation, settings, onboarding, frontend]
related:
  - README.md
  - manifest.json
  - prompts.md
  - ../../2026-09-20-core-outcome-modules/iteration-1/CORE-OUTCOME-MODULES-IMPLEMENTATION-METAPROMPT.md
  - ../../2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md
  - ../../../shared-conversation-state-surfaces.md
  - ../../../browser-prototype.md
  - ../../../product-design-spec.md
  - ../../../design-system.md
  - ../../../accessibility.md
  - ../../../voice-ux.md
  - ../../../../05-safety-privacy/action-policy.md
  - ../../../../10-execution/sessions/2026-09-20-navigation-supporting-surfaces-implementation-metaprompt.md
---

# Metaprompt — Implement navigation and supporting surfaces

Simon authorized this implementation handoff on 2026-09-20 after reviewing the
thirteen navigation and supporting-surface mockups. Paste the prompt below into
the Astra session already implementing the Granny frontend. It specifies the
purpose, content, behavior and implementation boundary of every image; it does
not require literal raster geometry.

```text
Continue the active Granny frontend implementation in your existing authorized
checkout, worktree and task branch.

Repository:

  /home/lgtw/Work/granny

Do not return another plan or rewrite this metaprompt. Inspect the current UI
and source, then implement all thirteen approved navigation and supporting-
surface references described below. Run the app and its tests before and after
the change.

Reuse correct existing code. Refactor structurally incompatible code and
remove obsolete in-scope mock UI when necessary, but first trace its callers,
state transitions and tests. Do not restart the project merely because an
earlier mock implementation looks weak. Preserve unrelated work and all
existing fictional-data, local-only, CSP, Stop and regression behavior.

This remains a fictional-data browser prototype. It is not production Android,
real permission management, durable personal-data storage, external-app
integration, or proof that an external action completed.

## Use the repository workflows

Use these skills when available:

1. `$granny-session-lifecycle` for repository continuity and exact handoff.
2. `$granny-design-handoff` for state, copy, semantics and accessibility.
3. `$granny-task-slice` in implementation mode for this bounded frontend work.
4. `$granny-ui-craft` in Harden mode for responsive and anti-dashboard review.

The lead Astra agent acts as orchestrator. After personally reading the
authority sources and inspecting the running app, use up to three Terra
sub-agents in parallel when useful:

1. a read-only audit of current navigation, view state and reusable components;
2. a read-only visual/accessibility comparison against all thirteen references;
3. a read-only test audit of focus, transitions, reset, search and onboarding.

Give each agent a bounded, non-overlapping assignment. The lead owns product
interpretation, shared-file edits, integration and final verification. Do not
let two agents edit the same frontend files. Inspect every delegated diff
before keeping it. Sub-agents must not publish, merge or alter scope.

## Repository and Git boundary

- Confirm `pwd`, repository root, branch, HEAD, worktrees and
  `git status --short --branch` before editing.
- Continue the current implementation branch if valid. Never reset, clean,
  stash, overwrite or discard existing work.
- If the branch predates this handoff, fetch and integrate `origin/main` only
  when safe. Do not copy files between worktrees as fake integration.
- Do not install dependencies, change frameworks or add a design-system
  library. Use the repository-native HTML, CSS and JavaScript architecture.
- Do not edit private `docs/.obsidian/*.json` settings.
- Push and prepare the scoped handoff after checks. Because this is mixed
  code/documentation work, stop at the reviewed branch/PR boundary unless
  Simon separately authorizes integration.

## Read and inspect before editing

Read these sources in order:

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/10-execution/current-milestone.md`
4. `docs/10-execution/development-readiness.md`
5. `docs/02-design/conversation-first-plan.md`
6. `docs/02-design/shared-conversation-state-surfaces.md`
7. `docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/README.md`
8. `docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/manifest.json`
9. `docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/prompts.md`
10. `docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/README.md`
11. `docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/README.md`
12. `docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md`
13. `docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md`
14. `docs/02-design/product-design-spec.md`, especially SCR-001–SCR-003,
    SCR-008–SCR-012, SCR-014–SCR-017
15. `docs/02-design/design-system.md`, especially CMP-001, CMP-003,
    CMP-006–CMP-009 and its transient-surface rules
16. `docs/02-design/accessibility.md`
17. `docs/02-design/voice-ux.md`
18. `docs/05-safety-privacy/action-policy.md`
19. `docs/02-design/browser-prototype.md`
20. `prototypes/stage-1/README.md`
21. the current frontend source and tests

Visually inspect every selected source image at original detail before coding:

- `01-menu.png`
- `02-today-minimal-history.png`
- `03-settings-overview.png`
- `04-privacy-and-data.png`
- `05-accessibility-preferences.png`
- `06-help-what-can-i-ask.png`
- `07-new-conversation.png`
- `08-return-from-external-app.png`
- `09-global-search-results.png`
- `10-global-search-no-results.png`
- `11-onboarding-welcome.png`
- `12-onboarding-preferences.png`
- `13-onboarding-optional-access.png`

They live under:

  docs/02-design/mockups/2026-09-20-navigation-supporting-surfaces/iteration-1/

Use `comparison.png` only for family consistency because it is resampled. Do
not use files in `rejected/`; they contain known semantic mistakes. Never place
the raster images into the app as fake interactive UI.

## Inspect the existing implementation first

Run the current frontend and record a concise keep/adapt/replace/remove
inventory covering:

- Home, current Room, Rooms library and stable composer;
- Menu and all existing support routes;
- current view/router/history state and browser Back behavior;
- shared dialog, sheet, row, field, segmented-choice and result components;
- conversation, task, room, preference and fictional fixture state;
- focus containment, focus restoration and scroll restoration;
- active task and Stop behavior when navigation is requested;
- current local storage, URL state, network calls and permission simulations;
- existing onboarding, reset, history and search behavior;
- browser/model tests that already protect useful behavior.

Preserve good primitives. Avoid thirteen unrelated page implementations. Use a
small typed destination model, reusable settings/list rows, one dialog/sheet
system and deterministic fixture data. Keep underlying place, conversation,
active task, temporary overlay, supporting destination and onboarding state
separate.

## What the pictures mean—and what they do not mean

The mockups approve the visual hierarchy, written labels, content model and
interaction posture. They are not fixed pixel templates and do not require
every state to be a separate URL or full page.

Classify surfaces by behavior:

- Menu is a temporary focus-owning layer over the current place.
- Start new conversation is a short focused confirmation over the current
  conversation.
- Today, Settings, Privacy, Accessibility, Help and Search are readable support
  destinations with a written return route.
- Return from an external app is an inline conversation result/recovery state,
  not a settings page.
- Onboarding is a skippable first-run sequence outside the normal composer.

On narrow screens, enlarged text or a short viewport, a destination may occupy
the viewport and scroll. That is responsive presentation, not a different
information architecture. Preserve semantic order and origin state. Stack
controls before shrinking text. Decorative icons may disappear; labels,
sources, current states, consequences and safe exits may not.

Do not add a bottom tab bar, permanent sidebar, app grid, notification centre,
capability dashboard, prompt-chip wall or duplicated Home/Rooms/Menu controls.
Do not turn every row into a floating card. Use the Linen canvas, typography,
spacing and light rules to let the interface breathe.

## Shared state and routing contract

Adapt the existing architecture while preserving an equivalent of:

  place: Home | Rooms | current Room
  conversation: current visible thread and composer draft
  task: idle | active | awaiting decision | reconciled outcome
  overlay: none | Menu | new-conversation confirmation | short preview
  destination: none | Today | Settings | Privacy | Accessibility | Help | Search
  onboarding: not needed | step 1 | step 2 | step 3 | skipped | complete
  preferences: staged values plus last-applied values
  returnState: origin route, focus target and scroll position

Rules:

- A support destination never changes the current Room or conversation merely
  by opening.
- Closing Menu or a short confirmation restores focus to its invoker.
- Returning from a destination restores a sensible route, scroll and focus.
- Browser Back follows the same hierarchy as the written Back action and must
  not silently approve, send, delete, retry or resume work.
- If a task is actively executing, a navigation/reset request first uses the
  existing Stop/interruption contract. Never hide or bypass active Stop.
- Only one focus-owning overlay exists at a time. Do not stack dialogs/sheets.
- All prototype data is deterministic and fictional. Do not persist a full
  transcript, message body, photo, audio or observed screen.
- Registered event handlers own actions. Visible/model text never becomes
  executable instructions.

## Shared visual and accessibility contract

Preserve Harbour Blue exactly:

- Canvas `#FBF6EE`
- Surface `#FFFFFF`
- Ink `#2E2D32`
- Accent `#2C5981`
- Outline `#597DA0`
- Send `#165D9C`
- separated focus ring `#4930A1`
- Stop/danger only `#962F43`
- On-colour `#FFFFFF`

Use existing repository tokens rather than scattering values. Preserve
Bricolage Grotesque 600 display intent and DM Sans 400/600 body/control intent
where supported. The generated font appearance is not exact CSS geometry.

- Every essential destination and action has a written label.
- One row is one semantic target; do not nest competing buttons inside it.
- Current values and On/Off states are written, not color-only.
- Controls support at least 56dp-equivalent targets; primary and Stop controls
  support at least 64dp equivalents.
- Focus uses the separated purple ring with unclipped space.
- At 200% text, order remains heading → explanation → content/rows → actions →
  composer when present.
- Status changes are announced once, not on every render.
- Dialogs/sheets contain focus, expose an escape and restore focus on close.
- No autofocus on a destructive or consequential control.

## Implement every reference

### 01 — Menu

Reference: `01-menu.png`

Purpose: expose secondary destinations without turning Home into a dashboard or
adding persistent navigation chrome.

Entry and exit:

- Written `Menu` from Home or a Room opens a right-side focus-owning sheet over
  the unchanged underlying place.
- `Close`, browser Back or Escape closes it and restores focus to `Menu`.
- Choosing a destination closes the sheet and opens that destination while
  retaining its origin for return.

Visible structure and copy:

- heading `Menu`
- control `Close`
- group `Go to`: `Today`, `Search`, `Rooms`
- group `Preferences`: `Settings`, `Accessibility`, `Privacy and data`
- group `Support`: `What can I ask?`, `Start a new conversation`

Implementation rules:

- The underlying conversation/composer remains visually recognizable but is
  inert to pointer, keyboard and assistive focus while the sheet owns focus.
- Each labeled row is one broad target. An icon may reinforce a row but never
  replace its label.
- Keep the grouping and order; do not add duplicate top or bottom navigation.
- At narrow width or high text scale the sheet may become a full-width
  temporary layer, retaining the same grouping, Close and focus behavior.

### 02 — Today / minimal task history

Reference: `02-today-minimal-history.png`

Purpose: show a short local record of outcomes and unresolved states without
becoming a transcript archive, surveillance log or calendar dashboard.

Entry/exit: Menu `Today` → Today; `Back to Home` and browser Back restore the
origin. Opening a row reveals only a minimal summary using the existing outcome
component; it does not reconstruct private content or rerun the task.

Visible content:

- heading `Today`
- explanation `A short record of what happened. Message words and photos are
  not saved here.`
- newest-first fictional rows:
  - `Draft opened` / `Prepared — not sent` / `10:42` / `Example Messages`
  - `Photos from Sophie` / `No photos found` / `09:15` / `Example Messages`
  - `Text size changed` / `Large · restored available` / `08:30` / `Granny`
- row action/accessible name `Open summary`
- `Clear history`
- `Back to Home`

Each record stores/displays only task type, time, truthful result state and
source/evidence class. It must not store or reveal message words, image pixels,
audio, transcript, observed-screen content or guessed success. `Clear history`
opens an exact destructive preview; it never clears immediately. Add a true
empty state (`No saved task history`) and failed-read state without fabricated
entries. A row cannot approve or repeat its historical action.

### 03 — Settings overview

Reference: `03-settings-overview.png`

Purpose: orient the person with current-value summaries before asking them to
open a category. It is a route list, not a dense switch dashboard.

Entry/exit: Menu `Settings` → Settings; a row opens its destination; written
Back/browser Back returns to the origin without changing values.

Rows and summaries:

- `Accessibility` — `Text size Large · Reduced motion On`
- `Talk and voice` — `Speech speed Normal · Private content Not spoken`
- `Privacy and data` — `Cloud processing Off · Minimal task history`
- `Conversation` — `Clear and brief · New conversation`
- `About Granny` — `App information and limits`

Use one whole labeled row per destination. Summaries must derive from the same
prototype state as their detail views so they cannot drift. Do not put toggles
on this overview. `Granny` remains marked as a codename where app identity is
explained; do not invent a final logo or name.

### 04 — Privacy and data

Reference: `04-privacy-and-data.png`

Purpose: state what is active, what stays local and what each action affects
before offering permission, history or deletion controls.

Visible rows:

- `Cloud processing` / `Off` / requests stay on the tablet in this prototype /
  `Review`
- `Android permissions` / `Microphone: Ask when you tap Talk` /
  `Manage permissions`
- `Task history` / `Minimal results only — no message words, photos or audio` /
  `Clear history`
- `Local Granny data` / `Preferences, aliases and saved room organization` /
  `Review deletion`
- statement `Helpers do not have access in this version.`

The browser prototype must not imitate an Android system dialog or claim it
changed a real grant. Permission review explains the handoff and returns to a
fixture state; actual native permission ownership remains Android's. Keep task-
history clearing separate from local-data deletion. Both require exact previews
naming affected categories, retained items and external limits. `Review` is not
consent, deletion or enabling. Do not add a privacy score or bundled consent.

### 05 — Accessibility preferences

Reference: `05-accessibility-preferences.png`

Purpose: let a person preview and explicitly apply reversible presentation and
speech choices without requiring a diagnosis or inferred identity.

Visible content:

- preview sentence `Your next appointment is on Tuesday at 10:30.`
- `Text size` / `Current: Large` / `Smaller`, `Large`, `Larger`
- `Speech speed` / `Current: Normal` / `Hear sample`
- `Reduced motion` / `Current: On` / written `On`, `Off`
- `Captions` / `Current: On` / written `On`, `Off`
- `These choices change Granny only.`
- `Apply changes`, `Restore previous choices`, `Back to Settings`

Maintain staged preview values separately from last-applied values. Text size
changes the preview first; `Apply changes` commits prototype state and updates
Settings summaries. `Restore previous choices` returns to the last applied
set, not arbitrary defaults. `Hear sample` must have an equally informative
silent path and must not capture audio. Selected values use text plus state
semantics, not color alone. Horizontal choices stack at narrow width. The app
must remain usable while previewing the largest option.

### 06 — Help / What can I ask?

Reference: `06-help-what-can-i-ask.png`

Purpose: teach the conversation model and safety posture without presenting a
feature dashboard or making example prompts look mandatory.

Visible content:

- heading `What can I ask?`
- `Ask in your own words. You do not need to choose a feature first.`
- plain examples:
  - `Show me photos Sophie sent yesterday.`
  - `Explain what is on this screen.`
  - `Prepare a message to David.`
  - `Play Sinnerman by Nina Simone.`
  - `Make Granny’s text larger.`
- `What Granny will tell you`
  - when a choice is needed
  - before a consequential action
  - when a result is uncertain or unavailable
- `You can always type. Talk is optional.`
- `Ask Granny`, `Back to Menu`

Render examples as explanatory text, not tappable prompt chips, cards or
automatic requests. `Ask Granny` returns to the existing conversation and
focuses the text composer; it does not insert or submit an example. Preserve
the person's current draft if one already exists. Full diagnostics/reporting
may remain in the canonical Help route if already implemented, but do not let
them overwhelm this first explanatory view.

### 07 — Start a new conversation

Reference: `07-new-conversation.png`

Purpose: distinguish a fresh visible conversation from deletion, sign-out or
removal of content in Rooms and external apps.

Entry/exit: Menu `Start a new conversation` opens one focused confirmation over
the current conversation. `Keep this conversation`, `Cancel`, browser Back or
Escape close it and restore focus. The affirmative action resets only after its
described effect is applied.

Exact content:

- `Start a new conversation?`
- `This clears the current conversation from the screen and returns Home to a
  fresh start.`
- `What stays`
  - Rooms and saved items
  - accessibility preferences
  - minimal task history
- `Nothing is deleted from another app.`
- `Start new conversation`, `Keep this conversation`, `Cancel`

Starting fresh clears the visible thread and temporary task/module state,
returns to global Home and preserves Rooms, saved items, preferences and
minimal outcome history. It must not claim deletion of data outside that scope.
If the conversation is truly empty, avoid unnecessary confirmation or explain
why it still appears. If work is active, route through the existing Stop/
interruption contract before reset; the idle reference intentionally has no
Stop. Do not autofocus the affirmative control.

### 08 — Return from an external app

Reference: `08-return-from-external-app.png`

Purpose: restore the exact originating conversation and candidly reconcile an
outcome the browser prototype cannot verify.

Fictional visible content:

- original request `Tell David I’ll call after dinner.`
- response `Welcome back. I can’t confirm whether the message sent.`
- module heading `Back from Example Messages`
- outcome `Send status unknown`
- `Known`: `A fictional draft was opened for David — Brother.`
- `Unknown`: whether anyone tapped Send in Example Messages
- `Before trying again`: check the conversation to avoid a duplicate
- controls `Review status`, `Open app yourself`, `Done`
- receipt `Returned to this conversation · position restored`

Returning restores the prior place, thread, scroll position and a sensible
focus target. Elapsed time, app return or a handoff event is never proof that a
message sent. Do not auto-retry. `Review status` may only use admitted fixture
evidence; if status remains unknown, say so. `Open app yourself` is a clearly
labeled simulated/manual route and cannot claim a real launch in the browser.
`Done` dismisses the result without changing the unknown outcome.

### 09 — Global search: results

Reference: `09-global-search-results.png`

Purpose: provide one direct search over admitted local Granny content without
silently searching external apps, the web or private transcript bodies.

Visible content:

- heading `Search Granny`
- scope `Saved items, Rooms, settings and minimal task summaries`
- labeled query field containing `soup`
- four deterministic results:
  - `Vegetable soup` / `Recipe · Kitchen`
  - `Soup shopping list` / `List · Unfiled`
  - `Kitchen` / `Recipes, lists and cooking plans`
  - `Shopping list prepared` / `Vegetable soup · Today 09:15`
- disclosure for the Today match: `Minimal task summary — no message or item
  content stored.`
- `Search does not look inside external apps.`
- `Back to Menu`

Search indexes only the explicit fictional local fixture fields. Group or label
each result by type/source; never infer provenance from artwork. A result row is
one semantic target and opens its owning local destination while preserving
search query/position for Back. The Today result exposes only the minimal
summary. Search text must not become a model instruction or network request.
Keep the stable composer only if it already belongs to the supporting-
destination shell; distinguish composer submission from search submission.

### 10 — Global search: no results

Reference: `10-global-search-no-results.png`

Purpose: explain a true empty local result and offer bounded recovery without
pretending to have searched elsewhere.

Visible content:

- query `train tickets`
- heading `No saved matches`
- explanation: no match in saved items, Rooms, settings or minimal task
  summaries
- `Ask Granny instead`, `Search another phrase`, `Back to Menu`
- note that asking Granny starts a new request and does not search an external
  app automatically

No-result is distinct from loading, offline, permission denial and failed
index reads. `Search another phrase` focuses and selects the query field without
submitting. `Ask Granny instead` transfers the phrase to the conversation as an
editable draft or otherwise makes the transition explicit; it must not execute
an external search. Preserve a direct typed route.

### 11 — Onboarding welcome

Reference: `11-onboarding-welcome.png`

Purpose: explain the conversation and control model briefly, without sign-in,
age framing, marketing promises or blocking immediate typed use.

Visible content:

- `Granny` with `Temporary name`
- `Step 1 of 3`
- `Skip for now`
- heading `A simpler place to ask for help`
- explain that the person can ask naturally, review important actions before
  they happen, and use Stop or take over
- state that setup uses fictional examples and requires no account
- `Set up Granny`, `Skip for now`

`Set up Granny` advances to step 2. Either Skip route enters Home without
granting access or fabricating preferences. Typed Home remains complete after a
skip. Do not use mascots, assistant faces, celebratory animation or an account
gate. Progress is written; dots may not be the sole indicator.

### 12 — Onboarding preferences

Reference: `12-onboarding-preferences.png`

Purpose: establish a small reversible comfort baseline, not profile a person's
age, disability, health or personality.

Visible content:

- `Step 2 of 3`, `Skip for now`
- `Make Granny comfortable to use`
- preview `What would you like to do?`
- `Text size`: `Normal`, `Large` selected, `Larger`
- `How Granny explains`: `Clear and brief` selected, `More detail`
- `Speech speed`: `Slower`, `Normal` selected, `Faster`
- `Hear sample`
- note that no disability or medical condition is inferred
- `Back`, `Continue`, `Skip for now`

Choices update only the preview/staged setup state until Continue. Back returns
to step 1 without losing the staged choices. Skip enters Home with documented
defaults and no inference. Every choice remains editable later in Settings.
`Hear sample` is optional and has a silent equivalent. Choice groups expose
their names and selected values semantically and stack under large text.

### 13 — Onboarding optional access

Reference: `13-onboarding-optional-access.png`

Purpose: explain optional capabilities separately so setup completion is not
mistaken for bundled consent or an Android permission grant.

Visible content:

- `Step 3 of 3`
- `Choose what Granny can use`
- explanation that choices are separate, setup can continue without them and
  they can be changed later
- `Microphone` / `Not enabled` / used only after `Talk` /
  `Review microphone`
- `Screen help` / `Not enabled` / only a screen the person chooses/shares or an
  Android-approved scope / `Review screen help`
- `Cloud processing` / `Off` / some requests may be unavailable /
  `Review cloud processing`
- `Android owns permission decisions. Granny cannot grant access itself.`
- `Continue without these`, `Back`, `Review later in Settings`

All three choices begin unselected. Each Review action opens a separate
purpose/data/destination/decline disclosure. In the browser it remains an
explicit simulation and must not imitate or claim an Android grant. Returning
from a native handoff in future must re-read actual state rather than infer
success. `Continue without these` completes setup and enters fully usable typed
Home. Never combine the three reviews into one Accept button or preselection.

## Required cross-surface journeys

Implement and test at least these deterministic journeys:

1. Home → Menu → destination → Back returns to Home and restores focus.
2. Room → Menu → Settings → Back returns to the same Room, not global Home.
3. Menu → Today → summary → Back preserves list position; history never reruns.
4. Settings → Accessibility → preview → Apply → Settings summary updates.
5. Accessibility preview → Restore returns the last applied values.
6. Help → Ask Granny returns to and focuses the existing composer without
   submitting or replacing a non-empty draft.
7. New conversation → Keep/Cancel preserves the thread; Start clears only the
   stated scope and returns Home.
8. Active task → request new conversation/navigation → Stop/interruption first;
   no silent continuation or stale callback.
9. External-app return restores the origin and remains `unknown` until genuine
   admitted evidence changes it.
10. Search `soup` returns the four correct local fixtures and source labels.
11. Search `train tickets` produces the dedicated no-result state; offline and
    failed-read states remain distinct.
12. Onboarding can be completed, backed through or skipped at every step with
    no permission silently enabled.
13. Refresh/re-entry uses an explicit deterministic prototype start state; do
    not accidentally persist sensitive thread or fixture content.

## Responsive, accessibility and safety verification

Verify keyboard-only operation, visible focus, logical source order, overlay
containment, focus restoration and no hidden essential horizontal scroll.
Exercise representative landscape tablet, narrow portrait-like width, short
height and 200% text. Long labels and descriptions must wrap without clipping;
actions stack before copy shrinks. Menu rows and all controls keep broad target
sizes. Search results and history rows expose complete accessible names without
nested interactive ambiguity.

Verify that:

- reduced motion changes transitions without removing state feedback;
- Talk remains optional and every route is usable silently;
- no action is distinguished only by color, icon, position or animation;
- red is reserved for Stop or a real destructive preview;
- no support screen hides an active Stop;
- no full transcript, image, audio or message body enters Today/search storage;
- clearing history and deleting local data remain separate exact previews;
- browser permission demonstrations use simulation labels;
- no network request, real app launch, clipboard write or OS permission request
  occurs from these fixtures;
- no fixture uses private data or asserts user research.

## Tests and checks

Extend existing model and browser tests rather than replacing them. Add
coverage for the thirteen surfaces, the journeys above, duplicate-action
locking, stale transition cancellation, origin/focus restoration, search
scope, minimal-history fields, reset scope and onboarding skip/access rules.

At minimum run the repository-prescribed prototype checks from
`prototypes/stage-1/README.md`, documentation validation for changed docs,
`python3 scripts/cockpit.py --write`, `python3 scripts/cockpit.py --check` and
`git diff --check`. Inspect every implemented surface in the running browser at
normal size, narrow width and enlarged text. Record exact commands and results.
Do not convert browser checks into claims about Android, TalkBack, IME, device
permissions, external-app outcomes or older-adult comprehension.

## Explicit exclusions

Do not implement native Android, real microphone/capture permissions, cloud
processing, helper access, analytics, sign-in, external-app search, durable
personal data, a transcript archive, actual data deletion, real app launching,
background task resumption, notification counts, final branding, a bottom nav,
permanent rail, capability dashboard or new Room/outcome-module designs.

Do not silently change canonical product, policy or accessibility contracts to
match a raster. If a genuine conflict appears, preserve the canonical contract,
document the visual mismatch and ask Simon only when a material product choice
cannot be resolved safely.

## Completion report

Report:

- branch, worktree, commit and pushed remote SHA;
- exact files changed;
- keep/adapt/replace/remove decisions from the existing UI;
- which routes, overlays, state transitions and reusable components were added;
- implementation mapping for all thirteen references;
- responsive, keyboard, focus and browser evidence;
- exact checks and results;
- known visual differences and unrun Android/human evidence;
- any conflict with canonical specifications;
- one review question: does the implementation feel like one quiet support
  system around the same conversation, and which surface—if any—still feels
  too much like a conventional settings dashboard?

Stop after the bounded frontend handoff. Do not merge this mixed task, start
native Android work or expand product scope without separate authority.
```

## Handoff boundary

This metaprompt records Simon's approval to implement the reviewed navigation
direction in the existing fictional-data browser prototype. It does not promote
the raster geometry to production measurements, accept new permissions or data
behavior, merge mixed code work, or establish Android/device/human evidence.
