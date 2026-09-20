---
title: "Metaprompt — Implement the core outcome modules"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [design, implementation, metaprompt, conversation, outcomes, frontend]
related:
  - README.md
  - manifest.json
  - prompts.md
  - ../../2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md
  - ../../2026-09-20-rooms-system/iteration-1/ROOMS-SYSTEM-IMPLEMENTATION-METAPROMPT.md
  - ../../../shared-conversation-state-surfaces.md
  - ../../../browser-prototype.md
  - ../../../product-design-spec.md
  - ../../../design-system.md
  - ../../../accessibility.md
  - ../../../voice-ux.md
  - ../../../../05-safety-privacy/action-policy.md
---

# Metaprompt — Implement the core outcome modules

Simon authorized this implementation handoff on 2026-09-20 after reviewing the
ten core-outcome mockups. Paste the prompt below into the Astra session already
implementing the Granny frontend. It explains every reference in depth and asks
that session to extend its current UI rather than create another plan.

```text
Continue the active Granny frontend implementation in your existing authorized
checkout, worktree and task branch.

Repository:

  /home/lgtw/Work/granny

Do not return another plan or rewrite this metaprompt. Inspect the UI and code
already built in this session, then implement the five core outcome-module
families and all ten reference states described below.

Reuse correct existing code. Refactor structurally incompatible code and remove
obsolete in-scope mock UI when necessary, but only after tracing its callers,
state transitions and tests. Do not restart the project simply because an
earlier mock implementation looks weak. Preserve unrelated work and all
existing safety, local-only, CSP, Stop, fictional-data and regression behavior.

This is a fictional-data browser prototype. It is not production Android, an
external-app integration, real screen observation, real photo/message/media
access, or evidence that any depicted action can run on a device.

## Use the repository workflows

Use these skills when available:

1. `$granny-session-lifecycle` for repository continuity and exact handoff.
2. `$granny-design-handoff` for state, copy, semantics and accessibility.
3. `$granny-task-slice` in implementation mode for this bounded frontend work.
4. `$granny-ui-craft` in Harden mode for fidelity, responsive behavior and
   anti-dashboard review.

The lead Astra agent acts as orchestrator. After personally reading the
authority sources and inspecting the running app, use up to three Terra
sub-agents in parallel when useful:

1. a read-only audit of current routes, state model and reusable components;
2. a read-only visual/accessibility comparison against all ten references;
3. a read-only test audit covering transitions, failures and responsive states.

Give each agent a bounded, non-overlapping assignment. The lead owns product
interpretation, shared-file edits, integration and final verification. Do not
let two agents edit the same frontend files. Sub-agents must not change scope,
publish, merge or claim completion independently. Inspect every delegated diff
before keeping it.

## Repository and Git boundary

- Confirm `pwd`, repository root, branch, HEAD, worktrees and
  `git status --short --branch` before editing.
- Continue the current implementation branch if it is valid. Never discard,
  reset, clean, stash or overwrite work already in progress.
- If the branch predates these mockups, fetch `origin/main` and integrate it
  only when safe. If integration would collide with current work, inspect the
  references using read-only Git commands and record the dependency.
- Do not copy files between worktrees as a substitute for integration.
- Do not install packages, switch frameworks or add a design-system library.
  The current prototype is repository-native HTML, CSS and JavaScript.
- Do not edit private `docs/.obsidian/*.json` settings.
- Push the completed scoped task branch and prepare its handoff after checks.
  This mixed code/documentation task must stop at the reviewed branch/PR
  boundary unless Simon separately authorizes integration.

## Read and inspect before editing

Read these sources in order:

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/10-execution/current-milestone.md`
4. `docs/10-execution/development-readiness.md`
5. `docs/02-design/conversation-first-plan.md`
6. `docs/02-design/shared-conversation-state-surfaces.md`
7. `docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/README.md`
8. `docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/manifest.json`
9. `docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/prompts.md`
10. `docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/README.md`
11. `docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md`
12. `docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md`
13. `docs/02-design/product-design-spec.md`, especially SCR-003 and
    SCR-005–SCR-011
14. `docs/02-design/design-system.md`, especially CMP-001–CMP-009 and the
    existing Home/Room components
15. `docs/02-design/accessibility.md`
16. `docs/02-design/voice-ux.md`
17. `docs/05-safety-privacy/action-policy.md`
18. `docs/02-design/browser-prototype.md`
19. `prototypes/stage-1/README.md`
20. the actual current frontend source and tests

Visually inspect every source image at original detail before coding:

- `01-photos-found.png`
- `02-photos-no-result.png`
- `03-screen-explanation.png`
- `04-guidance-highlight.png`
- `05-message-draft-review.png`
- `06-message-prepared-unsent.png`
- `07-media-playing.png`
- `08-media-unavailable.png`
- `09-reading-text-preview.png`
- `10-reading-applied-restore.png`

They are under:

  docs/02-design/mockups/2026-09-20-core-outcome-modules/iteration-1/

Use `comparison.png` only to judge family consistency because it is resampled.
The ten individual PNGs control visual detail. Do not use the two files in
`rejected/`; they contain an unapproved assistant avatar. Do not place any
screenshot into the app as fake interactive UI.

## Inspect the existing implementation first

Run the current frontend. Inspect Home, one decorated Room, the stable
composer, shared listening/transcript/preview/activity/result surfaces, the
existing five scripted workflows, Menu, Stop, responsive layouts and all
current browser checks.

Record a concise keep/adapt/replace/remove inventory covering:

- place/navigation state: Home, Rooms library and current Room;
- conversation turns and temporary task-surface state;
- existing photo, screen, message, media and readability fixtures;
- outcome/result rendering and source disclosure;
- reusable module, panel, dialog, choice-row and composer primitives;
- focus ownership and return-focus behavior;
- state-transition scheduling, cancellation and stale-callback protection;
- current empty/error/offline simulations;
- browser and model tests that already protect useful behavior.

Keep underlying place state separate from outcome-module state. Do not model
Photos, Screen explanation, Message drafting, Media or Reading assistance as
top-level navigation destinations. Prefer one reusable contextual-module shell
and small typed variants over five copied mini-app implementations.

## What the images mean—and what they do not mean

The images are approved UX/UI direction for hierarchy, copy, controls and
Harbour Blue treatment. They are not literal page templates or fixed pixel
geometry.

The required compositional rule is:

  Home or the current Room remains the place.
  The conversation remains visible.
  One relevant outcome module appears inline with that conversation.
  The Round composer remains available below it unless a focused decision
  surface legitimately owns input.

Each rectangle is a semantic grouping for one result or decision. It is not a
dashboard card, application window, nested route or independent product area.
Do not add tabs, side navigation, card grids, queues, recommendation rails or
toolbars to make a module look more “complete.”

On short screens, narrow windows, enlarged text or while the IME is open, the
module may fill most of the viewport and scroll. That is the responsive form of
the same inline module, not a new page. Preserve the originating Home/Room,
return focus and scroll state. Stack content vertically before shrinking text.
Remove decorative imagery before removing provenance, state, controls or safe
return routes.

The references contain written Home, Rooms and Menu only to show the stable
shell. This task does not redesign those destinations or add the later
“Navigation and supporting surfaces” batch.

## Shared implementation model

Adapt the current architecture, but preserve an equivalent of:

- underlying place: Home or one Room;
- conversation history: user request and Granny response;
- active outcome family: photos, screen explanation, message, media or reading;
- outcome state within that family;
- deterministic fictional fixture data separate from DOM/layout code;
- source/provenance data separate from decorative artwork;
- one contextual outcome module at a time;
- origin focus and scroll position for safe restoration;
- task generation/version so stale simulated callbacks cannot alter a newer
  request;
- active task/Stop state separate from ordinary module actions;
- explicit known, unavailable, no-result, prepared and applied states rather
  than truth inferred from missing content.

Suggested conceptual state—not a required code shape:

  place
  conversation
  outcome: {
    kind,
    state,
    fixtureId,
    source,
    returnTarget,
    generation
  }

Use registered action handlers or equivalent typed transitions. Never derive
an executable action from image text or model prose. Dismiss/repeat must not
re-execute an effect. Changing a request invalidates the old outcome generation.

## Shared visual system

Preserve the selected Harbour Blue roles:

- Canvas: `#FBF6EE`
- Surface: `#FFFFFF`
- Ink: `#2E2D32`
- Accent: `#2C5981`
- Outline: `#597DA0`
- Send: `#165D9C`
- separated focus ring: `#4930A1`
- Stop/danger only: `#962F43`
- On-colour: `#FFFFFF`

Use the repository's existing tokens when they express these roles; do not
scatter hard-coded duplicates. Preserve Bricolage Grotesque 600 display intent
and DM Sans 400/600 body/control intent where existing font assets support it.
Do not claim the generator's approximate font rendering as exact CSS geometry.

One module uses a white surface and ordinary outline. Avoid nested floating
cards for every datum. Group information with type, spacing and light rules.
No gradients, glass, glow, AI sparkle, decorative assistant avatar, final logo,
deep shadow, icon-only essential action or color-only meaning.

Controls need visible focus and broad targets capable of at least 56dp
equivalents; primary and Stop controls must support at least 64dp equivalents.
Reserve purple for separated focus/guidance treatment, not ordinary borders.
Reserve red for Stop or genuinely destructive actions, not unavailable media
or an ordinary no-result state.

## Implement every reference

### 01 — Photos: found

Reference: `01-photos-found.png`

User job: inspect a small, attributable fictional photo result without leaving
the conversation or entering a gallery dashboard.

Fixture and visible content:

- request: `Show me the photos Sophie sent yesterday.`
- response: `I found 3 fictional photos from Sophie.`
- heading: `Photos from Sophie`
- sender and differentiator: `Sophie · Book club`
- date: `Yesterday · 13 September 2026`
- source: `Example Messages`
- description: `Seaside path and blue water`
- position: `Photo 1 of 3`
- controls: `Previous photo`, `Next photo`, `Open full size`, `Done`

Structure:

- make one large photo the dominant module content;
- a narrow partial next image may reinforce horizontal sequence, but it is
  decorative unless the implementation gives it a correct accessible target;
- keep sender, date and source adjacent to the result rather than hiding them
  in a details menu;
- do not add album, grid, selection, share, download, delete or editing tools.

Behavior:

- Previous/Next change the current fictional photo deterministically;
- disable Previous on the first photo and Next on the last, with a semantic
  disabled reason available to assistive technology;
- announce the new position and description once after a browse action;
- Open full size opens an in-app focused viewer for the same fictional asset,
  with a written Back/Close route and focus restoration—never a new browser tab;
- Done dismisses the module and returns focus to the originating conversation;
- browsing must not mark, save, send or alter a real photo.

Responsive/accessibility:

- at narrow width, order is heading → provenance → image → description →
  position → controls;
- preserve image aspect ratio and useful crop; never bake source text into art;
- give the image useful alt text derived from the fixture description;
- do not rely on swipe; written Previous and Next are required.

### 02 — Photos: no result

Reference: `02-photos-no-result.png`

User job: understand exactly what was searched and recover without mistaking an
empty result for loading, permission denial, offline state or missing data.

Fixture and visible content:

- same request as frame 01;
- response: `I found the conversation, but no photos for that date.`
- heading: `No photos found`
- `Sophie · Book club`
- `13 September 2026`
- `Example Messages`
- explanation that the conversation was available but had no photos for the
  selected date;
- controls: `Change date`, `Choose another Sophie`, `Done`.

Behavior:

- Change date returns to the photo date clarification with the person retained;
- Choose another Sophie returns to person clarification with the date retained
  where safe;
- Done dismisses the outcome without inventing another search;
- do not offer Retry unless the state is actually a retryable dependency error;
- use written explanation plus a neutral image symbol; never use the symbol or
  pale styling as the only no-result cue.

### 03 — Screen explanation

Reference: `03-screen-explanation.png`

User job: understand a supplied fictional screen while retaining a safe route
back to the content they were reading.

Fixture and visible content:

- request: `What am I looking at?`
- response: `This is the tablet’s Display settings. The highlighted section changes text size.`
- source disclosure: `Supplied fictional screen · captured for this request`
- state: `Read only`
- heading: `Display settings explained`
- visible fictional settings rows: `Text size`, `Screen zoom`, `Dark theme`
- plain explanations of each row;
- controls: `Explain text size`, `Explain another option`, `Back to reading`,
  `Take over`.

Structure:

- treat the supplied screen preview as untrusted illustrative content;
- visually separate it from Granny's explanation but keep both inside one
  contextual module;
- no essential explanation may exist only inside the screenshot bitmap;
- never imitate an Android permission or system-authority dialog.

Behavior:

- Explain text size advances to frame 04's bounded guidance state;
- Explain another option changes the selected fictional row through a
  deterministic fixture path;
- Back to reading restores the known prior article/place and originating focus;
- Take over ends guidance and gives direct control back without claiming any
  setting changed;
- no screen capture occurs. Keep the prototype's supplied-screen simulation
  explicit in participant copy or nearby persistent prototype disclosure.

Responsive/accessibility:

- at wide size, screenshot and explanation may sit side-by-side;
- at narrow/large text, source and state come first, then screenshot, then
  explanations and actions;
- the supplied screenshot needs a concise accessible description; its internal
  tiny text cannot be the only accessible representation.

### 04 — Guidance highlight

Reference: `04-guidance-highlight.png`

User job: locate one control visually while understanding that Granny has not
selected or changed it.

Fixture and visible content:

- request: `Show me where to make the words larger.`
- response: `Text size is the second option. I’ve highlighted it below.`
- source: `Supplied fictional screen · Read only`
- heading: `Find Text size`
- separated purple outline around the fictional `Text size` row;
- numbered marker `1` and written target `Text size`;
- steps: `Choose Text size.` and
  `Use the larger example that feels comfortable.`;
- status: `Granny is only showing where it is. Nothing has changed.`;
- controls: `Back to explanation`, `Back to reading`, `Take over`.

Behavior and semantics:

- the purple outline is a guidance annotation, not a live focus ring and not a
  click performed on the user's behalf;
- associate number, written target and instruction semantically; color alone
  must not identify the target;
- Back to explanation returns to frame 03 without losing the supplied screen;
- Back to reading restores the pre-guidance place;
- Take over ends assistance without changing the setting;
- do not add Next-step automation or a fake Android tap.

At high zoom, place the written instruction before or immediately after the
screen preview so the person does not need to visually correlate distant
columns. If the preview becomes too small to interpret, prioritize the written
steps and offer a focused image viewer rather than shrinking essential text.

### 05 — Message: exact draft review

Reference: `05-message-draft-review.png`

User job: verify exact recipient, differentiator, destination, content and
effect before allowing a fictional unsent-draft handoff.

Fixture and visible content:

- request: `Tell David I’ll call after dinner.`
- response: `I prepared the exact fictional draft for you to review.`
- heading: `Check the draft`
- status: `Nothing has been opened or sent yet.`
- `To` / `David`
- `Which person` / `Brother`
- `Channel` / `Example Messages`
- `Message` / `I’ll call after dinner.`
- `What happens` / `A fictional unsent draft opens`
- `This does not send the message.`
- controls: `Open this draft`, `Change it`, `Cancel`, `Repeat`.

Behavior:

- render this through the same consequence-preview semantics already required
  by SCR-007/CMP-003 and the shared-state pack; do not build a conflicting
  second confirmation component;
- place consequence and not-sent disclosure before approval controls;
- Open this draft is the only approval and is specific to this exact version;
- Change it returns to editable content and invalidates the old preview digest
  or equivalent authority version;
- Cancel dismisses without opening anything;
- Repeat restates the preview and cannot execute it;
- composer Send may submit an edit request but cannot approve the preview;
- typed `yes` or generic Enter must never bypass deliberate focus on the
  specific approval control;
- treat recipient and message body as a private region even though this fixture
  is fictional.

Do not show delivery, sent or success language. The browser simulation may
transition to a fictional opened-draft outcome only through its controlled
fixture/state model.

### 06 — Message: prepared, not sent

Reference: `06-message-prepared-unsent.png`

User job: know what Granny verified, what it did not do and what the person
must do next.

Fixture and visible content:

- response: `The fictional draft is ready.`
- heading: `Draft opened`
- strong state: `Prepared — not sent`
- section `What Granny verified`:
  `A fictional unsent draft opened for David — Brother in Example Messages.`
- section `What Granny did not do`:
  `Granny did not send the message.`
- section `Next step`:
  `Review the draft there and tap Send yourself if it looks right.`
- controls: `Continue manually`, `Done`.

Behavior:

- enter only from a deterministic verified prepared/opened result;
- never infer this state from elapsed time, a spinner ending or model prose;
- Continue manually performs only the prototype's existing fictional handoff;
  do not open or control a real app;
- Done returns to the originating conversation/place;
- dismissing or repeating the result cannot reopen the draft;
- do not use a sent checkmark, delivery tick, green success color or confetti.

If the implementation already has prepared, partial or unknown result types,
reuse that result enum and renderer. Prepared and sent must remain distinct.

### 07 — Media: playing

Reference: `07-media-playing.png`

User job: see exactly what the fictional service says is playing and pause it
without entering a music dashboard.

Fixture and visible content:

- request: `Play Sinnerman by Nina Simone.`
- response: `Sinnerman by Nina Simone is playing in Example Music.`
- heading: `Now playing`
- title: `Sinnerman`
- artist: `Nina Simone`
- source: `Example Music`
- state: `Playing`
- elapsed/duration: `0:42` / `10:22`
- controls: `Pause`, `Done`
- output state: `Sound on`.

Structure:

- use restrained fictional/nonbranded cover art as optional reinforcement;
- metadata and written state remain sufficient if artwork is missing;
- do not add queue, recommendations, album browsing, shuffle, favorite, volume
  slider, lyrics or transport controls that the fixture does not support.

Behavior:

- this state appears only after the scripted result says playback started;
- Pause changes the written state to Paused and its control to Play/Resume in
  the same stable position; Play/Pause must never be icon-only;
- no autoplay occurs when rendering, returning or opening the module;
- progress may be deterministic simulated state, not claimed measured audio;
- Done collapses the module without silently changing the documented playback
  state;
- Stop for an active Granny task and Pause for media are different controls and
  must never be conflated.

### 08 — Media: service unavailable

Reference: `08-media-unavailable.png`

User job: understand that nothing started, which source failed and what safe
alternatives remain.

Fixture and visible content:

- same request as frame 07;
- response: `Example Music isn’t available on this tablet.`
- heading: `Music not started`
- `Title` / `Sinnerman`
- `Artist` / `Nina Simone`
- `Requested source` / `Example Music`
- `Status` / `Service unavailable`
- explanation: `No music was started. You can choose another available source or open your music apps yourself.`
- controls: `Choose another source`, `Open apps`, `Done`.

Behavior:

- Choose another source enters explicit source choice; do not silently select a
  provider or retry the unavailable one;
- Open apps is a fictional/manual handoff in this prototype and cannot claim a
  service opened unless the fixture independently verifies it;
- Done returns without queueing work for later reconnect;
- do not show Pause, progress, Retry loop, technical code or danger red;
- preserve requested title/artist so recovery does not depend on memory.

### 09 — Reading assistance: text-size preview

Reference: `09-reading-text-preview.png`

User job: compare the current and proposed Granny text sizes before applying a
local reversible preference.

Fixture and visible content:

- request: `Make Granny’s text larger.`
- response: `Here is a preview. Nothing has changed yet.`
- heading: `Preview larger text`
- current label: `Current — Normal`
- preview label: `Preview — Large`
- identical sample in both regions:
  `Your next appointment is on Tuesday at 10:30.`
- size controls: `Smaller`, current proposed value `Large`, `Larger`
- scope: `This changes Granny’s text only.`
- controls: `Apply`, `Cancel`, `Restore default`.

Behavior:

- preview changes only the comparison sample and proposed value; it must not
  mutate the live app preference before Apply;
- Smaller/Larger move through the repository's existing closed size choices;
  expose the value in text and semantics, not visual scale alone;
- Apply commits the selected Granny-local preference and enters frame 10;
- Cancel restores the exact prior preference and originating focus;
- Restore default changes the proposed preview to the default and still
  requires Apply unless the canonical existing contract says otherwise;
- no external app or tablet setting changes.

Responsive/accessibility:

- the normal and preview examples may sit side-by-side only while each remains
  readable;
- stack Current then Preview at narrow width or enlarged text;
- use buttons or an accessible control with explicit −/+ alternatives and
  current value; do not require dragging a slider;
- prevent the preview sample from causing the controls or composer to clip.

### 10 — Reading assistance: applied with restore

Reference: `10-reading-applied-restore.png`

User job: verify the local change and reverse it immediately if desired.

Fixture and visible content:

- response: `Granny’s text is larger.`
- heading: `Larger text applied`
- `Changed — Granny’s text`
- `Previous size — Normal`
- `Current size — Large`
- same appointment sample displayed at the current size;
- `Other apps and tablet settings were not changed.`
- `You can restore this from Menu later.`
- controls: `Restore previous size`, `Done`.

Behavior:

- enter only after the local preference write/readback succeeds according to
  the existing prototype state model;
- Restore previous size returns to the exact stored previous value, not always
  an assumed Normal value, and updates the whole Granny UI consistently;
- Done keeps the applied preference and returns to the originating place;
- Menu must continue to expose an equivalent future restore/change path;
- do not claim Android-wide or external-app text changes;
- focus remains usable after the global text reflow and does not jump to the
  top of the app unexpectedly.

## Cross-module transition requirements

Implement deterministic routes for at least:

- photo found → Next/Previous → full-size → Back → same photo/position → Done;
- photo no-result → change date → revised found/no-result fixture;
- screen explanation → guidance highlight → back to explanation → back to
  originating reading context;
- exact draft review → Change → fresh preview version → Open fictional draft →
  prepared-not-sent result;
- media request → playing → pause/resume;
- media request → unavailable → explicit source choice/manual route;
- reading preview → Cancel with no change;
- reading preview → Apply → applied result → Restore previous size;
- a new request invalidating any pending simulated callback from an older
  outcome generation;
- leaving the current Room/Home restoring the correct place only after any
  active task follows Cancel/Stop/interruption rules.

Do not force each pair into a two-step wizard. The second frame is a relevant
branch or state, not evidence that every request visits both.

## Accessibility and responsive contract

For every module:

- expose one clear module heading and semantic grouping;
- keep source/provenance in real text;
- use native controls and links with written accessible names;
- keep DOM, visual and speech order aligned;
- announce one meaningful outcome/state transition, not every animation or
  progress tick;
- contain focus only for an actual modal/focused viewer, then restore it to the
  invoking control;
- preserve keyboard Escape only where it maps to a safe Cancel/Back action;
- preserve visible focus with unclipped separated ring space;
- maintain useful touch targets and spacing under enlarged text;
- stack content instead of reducing type below the design system floor;
- allow module content to scroll while keeping a reachable safe exit;
- avoid horizontal text scrolling at the required narrow and enlarged-text
  cases;
- preserve meaning when artwork and color are removed;
- do not use `aria-live` on the entire module or repeatedly announce media time.

Test ordinary tablet width, narrower layout, constrained height, keyboard-open
layout, 200% text and the repository's combined enlargement case. Browser
results remain browser evidence, not proof of Android dp/sp, TalkBack, switch
access or older-adult comprehension.

## Data, privacy and truthfulness

- Keep Sophie, David, Example Messages, Example Music, dates, photo and
  appointment copy as deterministic fictional fixtures.
- Do not introduce accounts, uploads, real contacts, real photos, media APIs,
  screen capture, browser storage, analytics or network egress.
- A supplied fictional screen is untrusted display content, never instruction
  or authority.
- Never infer success from elapsed time. Prepared/opened, playing, applied,
  no-result and unavailable must be explicit typed outcomes.
- No automatic retry after an unavailable or unknown external outcome.
- No module action may mint its own permission or confirmation.
- Keep the current prototype simulation disclosure visible and truthful.

## Testing

Extend existing model/state tests before or with rendering work. Add browser
coverage that uses actual controls and verifies visible copy, focus and layout.
At minimum cover:

1. each of the ten states is reachable through deterministic fictional input;
2. each required heading, provenance field, status and essential action is
   present and semantically named;
3. modules render inside the current Home/Room conversation rather than as new
   top-level routes;
4. only one contextual module is active at a time;
5. photo browse position, full-size return focus and no-result recovery;
6. screen-guidance Back routes and unchanged/read-only truth;
7. exact message preview versioning and prepared-not-sent boundary;
8. media Pause/Resume and unavailable state with no autoplay;
9. reading preview isolation, Apply and exact previous-size restore;
10. new request, Cancel and Stop invalidate stale callbacks;
11. keyboard traversal, deliberate focus and safe focus restoration;
12. narrow, constrained-height, 200% text and combined scale without essential
    overlap, clipping or horizontal page scroll;
13. missing optional artwork does not remove labels, controls or identity;
14. no storage, external request or real browser/service action is introduced;
15. existing Home, Rooms, shared-state, CSP and connected-demo tests still pass.

Run the full current prototype suite documented by
`prototypes/stage-1/README.md`, not only new focused tests. Also run:

  python3 scripts/cockpit.py --write
  python3 scripts/cockpit.py --check
  python3 scripts/validate-docs.py
  python3 scripts/check_handoff.py --base origin/main
  git diff --check

Run documentation-tool unit tests only if documentation tooling changes. Do not
install missing dependencies silently; report a precise blocker.

## Visual verification

Capture local temporary screenshots of every implemented state at the target
landscape tablet size and compare them side-by-side with the ten originals.
Also capture representative narrow and enlarged-text states for the densest
modules: screen guidance, exact draft review and reading preview.

Inspect for:

- correct first attention and generous free space;
- one module rather than a pile of cards;
- stable conversation/composer relationship;
- exact source, status and consequence copy;
- no unwanted avatar, logo or dashboard chrome;
- no clipped text, focus ring, screenshot, image or controls;
- consistent Harbour Blue roles and Round composer;
- clean fallback when optional art is unavailable.

Pixel-perfect duplication is not the goal. Behavioral hierarchy, state truth,
readability and family consistency outrank generator-specific spacing. Record
intentional deviations and why they improve actual responsive implementation.

## Exact exclusions

Do not:

- design the later navigation/supporting-surface batch;
- create five top-level tabs or mini-app dashboards;
- implement production Android or Compose;
- connect real photo, messaging, media or screen APIs;
- add persistence, uploads, analytics, accounts or personal data;
- add automatic screen capture or accessibility-service automation;
- change the accepted Home room-row composition or Room system;
- reopen palette, font, logo or composer selection;
- add unrelated prompts, widgets, weather, news, notifications or AI decor;
- claim TalkBack, device, human, service or production evidence from browser
  tests or screenshots;
- merge this mixed implementation to main without separate authority.

## Stop point and report

Stop after the five module families and all ten reference states are integrated,
tested and visually inspected in the existing browser prototype. Do not continue
into the unspecified navigation/supporting surfaces or production Android.

Report:

- current branch/worktree and exact changed files;
- the keep/adapt/replace/remove inventory from the initial audit;
- implemented state model and reusable component boundaries;
- a screen-by-screen fidelity summary for all ten references;
- deliberate responsive deviations from the raster images;
- exact tests and assertion counts;
- screenshot inspection paths or report artifacts;
- known accessibility, device, integration and comprehension limits;
- any existing tests or behavior that prevented a requested visual treatment;
- commit and verified remote branch SHA;
- the single next review question:
  “Do these five outcomes feel like useful parts of one conversation, or does
  any module still feel like a separate mini-app?”
```
