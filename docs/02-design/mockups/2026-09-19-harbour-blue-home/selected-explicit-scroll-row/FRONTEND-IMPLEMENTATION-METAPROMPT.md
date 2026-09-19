---
title: "Metaprompt — Implement the selected Explicit Scroll Row Home"
status: accepted
owner: Simon
last_updated: 2026-09-19
tags: [design, implementation, metaprompt, home, context-rooms]
related:
  - README.md
  - explicit-scroll-row-selected.png
  - ../../2026-09-19-style-boards/final-harbour-blue/README.md
  - ../../../browser-prototype.md
  - ../../../product-design-spec.md
  - ../../../design-system.md
  - ../../../accessibility.md
  - ../../../../09-decisions/ADR-0016-explicit-home-room-row.md
  - ../../../../10-execution/task-packets.md
---

# Metaprompt — Implement the selected Explicit Scroll Row Home

Simon authorized this bounded implementation handoff on 2026-09-19 after
selecting the Explicit Scroll Row Home. Copy the prompt below into a fresh
development session. It directs that session to inspect the design and existing
prototype, then implement the selected Home rather than return another plan.

```text
You are starting a bounded Granny Stage 1 frontend implementation session for:

  /home/lgtw/Work/granny

Your job is to implement Simon's selected Explicit Scroll Row Home in the
existing dependency-free browser prototype under `prototypes/stage-1/`.
Understand the selected design visually and the existing frontend technically,
then make the UI work. Do not respond with another metaprompt or a plan instead
of implementation.

This prompt records Simon's authority for the selected Home implementation
checkpoint only. It does not authorize the full Rooms library, Kitchen/Fitness
interiors, persistence, a production backend, Android code, Figma authoring,
provider/network access or real personal data.

Use these repository workflows if available:

1. `$granny-session-lifecycle` for task isolation, session record and handoff.
2. `$granny-design-handoff` for SCR/CMP/accessibility authority.
3. `$granny-task-slice` in implement mode for a bounded T-119 Home slice.
4. `$granny-ui-craft` in Build mode for visual fidelity and anti-template
   review, without changing accepted behavior.

Do not use image generation in this checkpoint. Room artwork and a future logo
may use honest local placeholders as specified below.

## Orchestrate with Terra sub-agents

Act as the lead/orchestrator rather than doing every investigation serially.
After the lead agent has personally read the effective instructions and the
selected skill files, use up to three parallel Terra sub-agents
(`gpt-5.6-terra`, when that model override is available) for bounded work.
Give each agent the selected-design paths, exact scope and a non-overlapping
assignment. Do not delegate product authority or final judgment.

Recommended first wave:

1. **Legacy UI audit — read-only:** run and inspect the existing mock frontend,
   trace its rendering/state boundaries and return a `keep / adapt / replace /
   remove` inventory with file/function references.
2. **Visual and accessibility audit — read-only:** compare the selected Home
   PNG and Harbour Blue board with SCR-003/CMP-010–012/accessibility, then return
   a concise fidelity and responsive-state checklist.
3. **Test and interaction audit — read-only:** inspect the current browser
   driver/checks and propose deterministic coverage for overflow, focus,
   keyboard, fixture states and regression risks.

Run these audits in parallel. The lead agent then reconciles their findings,
chooses the implementation shape and owns all shared production-file edits.
Do not let multiple agents concurrently edit `index.html`, `styles.css`,
`app.js` or `fixtures.js`. If a later sub-agent is given write access, give it
one explicitly exclusive file or evidence artifact, tell every other agent not
to touch that path, and inspect its complete diff before integration.

After implementation, use a second parallel read-only review wave where useful:
one Terra agent for visual comparison, one for accessibility/interaction
semantics and one for regression/test review. The lead agent resolves findings,
runs the authoritative checks and writes the final handoff. Sub-agents must not
spawn further agents, publish branches, merge, change product scope or mark the
task complete. Report their assignments and useful findings in the session
record rather than pasting unreviewed agent output.

## Repository and Git boundary

- Read the effective `AGENTS.md` before acting.
- Inspect `git status --short --branch`, current worktrees, branches and remote.
- This is executable prototype work, so the mockup-only primary-checkout
  exception does not apply. Use the normal dedicated worktree and short-lived
  task-branch workflow. Preserve the dirty primary checkout and every unrelated
  local edit; do not stash, reset, clean, overwrite or copy user-owned changes.
- Start from a freshly inspected `origin/main` unless a required selected-design
  dependency is only present in the primary checkout. In that case, read the
  exact primary files below as read-only design references and report the
  dependency honestly. Do not smuggle unrelated primary-checkout changes into
  the implementation branch. If the accepted behavior contracts themselves are
  absent from the task checkout, stop before inventing replacements and report
  the integration dependency.
- Do not install packages or change frameworks. The prototype intentionally has
  no dependency install/build step.
- Push the completed scoped task branch under the standing workflow after
  validation, but do not merge a mixed code task without current authority.
- Never modify `docs/.obsidian/*.json` or other private Obsidian settings.

## Read and inspect before editing

Read these sources in order:

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/10-execution/current-milestone.md`
4. `docs/10-execution/development-readiness.md`
5. `docs/10-execution/backlog.md`, T-119
6. `docs/10-execution/task-packets.md`, T-119 packet
7. `docs/09-decisions/ADR-0016-explicit-home-room-row.md`
8. `docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md`
9. `docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/README.md`
10. `docs/02-design/product-design-spec.md`, especially SCR-003, SCR-016 and
    SCR-017
11. `docs/02-design/design-system.md`, especially CMP-007 and CMP-010–012
12. `docs/02-design/accessibility.md`
13. `docs/02-design/browser-prototype.md`
14. `prototypes/stage-1/README.md`
15. `prototypes/stage-1/index.html`, `styles.css`, `app.js`, `fixtures.js`,
    `model.js`, `browser-driver.mjs` and `browser-check.mjs`

Visually inspect both of these PNGs at original detail before editing:

- `docs/02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/explicit-scroll-row-selected.png`
- `docs/02-design/mockups/2026-09-19-style-boards/final-harbour-blue/harbour-blue-final.png`

Use earlier Home rounds only as decision history. Do not reopen the palette,
composer shape or room-row choice. The selected mockup is a visual composition
reference, not literal CSS geometry.

## First inspect the current frontend technically

There is already a substantial mock UI in `prototypes/stage-1/`. Its functional
foundation may be valuable, but its visual result was reviewed as poor and is
not the target to preserve. Before editing, actually run it locally, view the
idle Home at expanded and narrow sizes, open Menu, exercise the composer/Talk
simulation and walk through at least one existing scripted request. Capture a
temporary baseline screenshot or use the existing browser-check artifacts so
the implementation decision is based on what is rendered, not only source
inspection.

Treat the old mock as recoverable source material:

- reuse sound state, safety, accessibility, local-server and workflow code;
- adapt components whose semantics are correct but whose composition or styling
  conflicts with the selected Home;
- replace the rejected Home structure, cramped geometry, generic visual
  styling or obsolete visual-territory machinery when it blocks Harbour Blue;
- remove obsolete in-scope UI code when keeping it would create duplicate CSS,
  unreachable markup, conflicting states or needless complexity.

Deletion of obsolete, version-controlled frontend code is authorized within
this bounded implementation after its callers, fixtures and tests have been
mapped. Do not delete scripted workflows, safety behavior, connected-demo
contracts or regression coverage merely to simplify the redesign. Do not
preserve a visibly poor structure solely because it already exists, and do not
perform a wholesale rewrite when a smaller clean refactor preserves proven
behavior. Record the final `reused / adapted / replaced / removed` inventory in
the session note with reasons and affected tests.

Before changing code, identify and briefly record in the session note:

- where empty Home, conversation/thread and secondary Menu views are rendered;
- how the composer, simulated Talk, submission, Stop and focus return currently
  work;
- how state is kept in memory and reset;
- how reviewer mode changes viewport/text scale/fixtures;
- how the restrictive CSP and local-only server prevent outside assets/egress;
- which current browser checks protect the five scripted workflows;
- which parts of the old mock are reusable foundations versus rejected visual
  presentation;
- the smallest coherent refactor that can deliver the selected Home without
  breaking the state model or connected-demo behavior.

Do not replace the existing application with a static screenshot or a separate
demo page. Integrate the selected Home into the current shell and preserve the
five scripted conversation workflows.

## Product truth to preserve

Granny is a temporary codename for a calm, adult, capable and candid AI-first
stock-Android tablet experience. The browser artifact is a design prototype,
not the Android application or production agent.

Home remains the universal starting point. A person can type or explicitly
start Talk without choosing a Room. Rooms are optional recognizable spaces
around the same Granny assistant, not separate personalities or apps. Direct
touch browsing supplements conversation; it does not replace it.

On the idle/empty Home, visual priority is:

1. invitation and writing surface;
2. Talk and Send inside the composer;
3. quiet written Menu;
4. one compact continuation when eligible;
5. the open room portrait row and written See all rooms route.

Idle Home must not show Stop. Active-task Stop keeps the existing stable
meaning and reachability. Do not hide privacy, accessibility or reset functions
that already exist in Menu.

## Selected visual language

Implement the Harbour Blue roles exactly:

- Canvas: `#FBF6EE`
- Surface: `#FFFFFF`
- Ink: `#2E2D32`
- Accent: `#2C5981`
- Outline: `#597DA0`
- Send: `#165D9C`
- Focus ring: `#4930A1`, as a separated outer ring rather than a normal border
- Stop/danger: `#962F43`, only for Stop or genuine destructive treatment
- On-colour: `#FFFFFF`

Typography intent is Bricolage Grotesque 600 for large display headings and DM
Sans 400/600 for body/controls. Do not fetch fonts from a CDN. If reviewed local
font files are unavailable, use a documented system-sans fallback and state the
fidelity limit in the implementation README. Do not claim exact font fidelity.

Keep the Linen canvas spacious. Do not make the page zoomed-in or cramped.
Preserve generous outer margins, readable measure, breathing room around the
continuation and portraits, and a representative expanded 16:10 composition.
The interface must still reflow on smaller windows and at large text.

Do not add gradients, glow, glass, depth shadows, AI sparkles, animated orbs,
robot imagery, a bottom navigation bar, a left rail, prompt chips, weather,
clock, news, scores, streaks, alerts or notification counts.

## Implement the selected Home composition

Use this visible fictional fixture on expanded Home:

- product marker: `Granny` with no final-logo claim;
- invitation: `What would you like to do?`;
- support: `Ask in your own words. You can type or talk.`;
- compact continuation: `Continue in Kitchen`, `Vegetable soup`,
  `Kitchen · Recipes and cooking plans`, `Open Kitchen`, `Hide`;
- room section: `Other rooms`, `Previous`, `Next`, `See all rooms`;
- rooms:
  - `Fitness` — `Movement and routines`
  - `Trips` — `Plans and packing`
  - `Reading` — `Books and saved articles`
- composer: `Type a request`, `Ask me anything…`, `Talk`, `Send`.

All fixture content is fictional. Do not imply it came from a real person's
history. Keep the existing prototype notice that the experience uses fictional
data and no recording, accounts, device access or sending.

### Round composer

Implement the selected Round conversation composer as a large white speech
balloon with a smooth rounded boundary, short lower-left tail and Harbour Blue
outline. It must be a real labeled text-entry form with visible editable/caret
area, not decorative artwork or a thin phone-style footer.

- Keep it near the bottom of expanded idle Home so it feels continuously
  available, but let it enter normal document flow at constrained height,
  narrow width or large text.
- Use the persistent label `Type a request` and placeholder/invitation
  `Ask me anything…`.
- Keep written `Talk` and written `Send`. The Send action includes a blue
  circular paper-plane symbol plus the separate word; the symbol is decorative
  to the already named control.
- Talk remains explicitly simulated and must not access a microphone.
- Preserve the current safe submission behavior and scripted workflows. Empty
  submission must not start work and must be explained accessibly.
- Do not put essential text inside generated or decorative imagery.

### Compact continuation

Use one restrained rectangular CMP-010 continuation surface. It may have a
subtle Harbour Blue outline, but it must stay visibly smaller and quieter than
the writing region. `Open Kitchen` is the one clear contextual action; `Hide`
is secondary. Hide removes the panel for the current in-memory session without
persistence and returns focus sensibly. Do not add multiple recent cards.

For this checkpoint, `Open Kitchen` may open a clearly labeled fictional
placeholder surface that says the Kitchen interior belongs to the next T-119
slice. It must have a working `Back to Home` action and must not pretend a room
interior, saved soup or persistent data exists.

### Explicit room portrait row

Implement CMP-012 as an open, borderless row on the Linen canvas:

- Portraits are unframed artwork/placeholder atmosphere, not tiles, floating
  cards, circular badges, app icons or a boxed carousel shelf.
- Each portrait, live written room name and live written purpose is one broad
  native semantic target. The room label must not be baked into art.
- Use simple local placeholder portraits or existing reviewed local assets only.
  No remote image URL, tracking request or new generated art. Mark placeholder
  art in code/docs. A missing/broken portrait removes decoration without
  removing the name, purpose, target or room availability.
- `Previous` and `Next` are real written controls. Compute overflow and current
  position from the rendered row; do not hard-code controls that merely look
  enabled. At an end, expose truthful disabled state and an accessible reason,
  or suppress movement that cannot occur.
- When every room fits, do not imply false overflow. The all-fit state must be
  visually honest.
- A control activation moves a useful viewport/page of rooms without losing
  the activating control's focus. Announce the newly foregrounded range once in
  a polite live region; do not narrate every pixel or autofocus a room.
- Touch/pointer drag, wheel/trackpad and swipe may work naturally, but are
  supplementary. Written controls and `See all rooms` must provide a complete
  non-gesture path.
- No automatic rotation, timed movement, dot-only pagination, scroll-jacking or
  artwork behind labels.
- Preserve source order and logical keyboard order. Use native buttons/links
  and ordinary browser scrolling where practical rather than recreating input
  semantics with pointer-only JavaScript.
- Keep enough focus-ring clearance that the separated `#4930A1` outline is not
  clipped by the scroll container.

For this Home-only checkpoint, a room target and `See all rooms` may open a
calm, clearly labeled fictional placeholder destination with a working return
to Home. `See all rooms` should show a simple vertical list of the fixture
rooms, because that is the accessible fallback, but do not build the complete
SCR-016 library, creation, search, management or room interiors yet.

## Responsive and state behavior

Expanded landscape should follow the selected screenshot's hierarchy without
copying its raster dimensions literally. Validate at least 360, 600, 840 and
representative 16:10 expanded widths, plus constrained height.

At narrow width, 200% app text or combined 300% review/app scaling:

- use one simple vertical reading sequence;
- place continuation and Rooms after the input region as SCR-003 specifies;
- turn the room row into a direct vertical/list treatment before shrinking
  labels or requiring essential horizontal scrolling;
- keep composer, Menu, Talk, Send and any active Stop reachable;
- allow the page to scroll vertically without page-level horizontal overflow.

Implement and make reviewable these bounded Home fixture states without adding
production persistence:

- continuation visible and hidden;
- no rooms;
- one room;
- all rooms fit;
- true overflow;
- portrait missing/failure;
- narrow/large-text fallback;
- focus, pressed and disabled controls.

Use the existing reviewer-only mode or similarly isolated fixture controls to
select these states; never insert reviewer controls into participant DOM/focus
order. No model call, account, storage or external network is needed.

## Accessibility acceptance for this browser checkpoint

- Essential text and controls remain high contrast on Linen/white.
- Controls are large enough to map to the internal 56dp intent; primary and
  Stop preserve the 64dp intent. Record that CSS pixels do not prove Android
  dp sizes.
- All meaning survives grayscale and portrait removal.
- Keyboard users can reach and activate Menu, composer, Talk, Send,
  continuation, Previous/Next, room targets and See all rooms in a logical
  order.
- Focus is visible, separated, unclipped and restored after Home placeholder
  destinations and after hiding continuation.
- Reduced-motion mode has no essential animation.
- Home still clearly allows an ordinary request without choosing a Room.
- Do not claim the browser proves TalkBack, switch access, native Android
  reflow, physical target size or older-adult comprehension. Record them as
  unrun.

## Preserve existing behavior and security limits

- Keep the five scripted workflows and the optional connected local-demo path
  behaviorally intact.
- Keep the local-only allowlisted server, CSP and no-third-party-request checks.
- Do not add localStorage, IndexedDB, cookies, service workers, analytics,
  uploads or remote assets.
- Do not turn fictional continuation/rooms into model context or backend data.
- Keep `Granny` visibly a codename/placeholder in documentation. A final logo
  is out of scope; use the written wordmark or a plainly documented neutral
  placeholder mark.
- Do not add a production framework, package manager, asset pipeline or Android
  scaffold.

## Implementation outputs

Make the smallest coherent change, expected to remain mainly within:

- `prototypes/stage-1/index.html`
- `prototypes/stage-1/styles.css`
- `prototypes/stage-1/app.js`
- `prototypes/stage-1/fixtures.js` if a fixture belongs there
- existing or narrowly added tests under `prototypes/stage-1/`
- `prototypes/stage-1/README.md`
- `docs/02-design/browser-prototype.md`
- one contemporaneous session record under `docs/10-execution/sessions/`

Save implementation review evidence in a new checkpoint folder, not in the
selected source folder:

  docs/02-design/mockups/2026-09-19-harbour-blue-home/frontend-checkpoint-1/

Include:

- `home-expanded.png`
- `home-narrow-large-text.png`
- `README.md` with local embeds, inspected commit, fixture state, visual
  comparison notes, placeholder inventory, exact checks and known limits.

Do not overwrite the selected source PNG or any previous mockup round.

## Tests and review

Extend the existing test style rather than bringing in a test framework. Add
deterministic browser assertions for at least:

- idle Home copy and absence of Stop;
- the composer accepting keyboard input and preserving existing submission;
- continuation Hide and focus return;
- room targets and placeholder return to Home;
- real overflow detection and truthful first/middle/last Previous/Next states;
- all-fit state without false movement affordance;
- one-room/no-room/image-failure states;
- keyboard activation and focus retention after row movement;
- one live-region announcement per discrete movement;
- no participant-mode reviewer controls;
- 360/600/840/expanded layout and combined 300% text without page-level
  horizontal overflow or unreachable core controls;
- zero third-party requests, persistence or microphone use;
- all pre-existing scripted workflow assertions still passing.

Run the repository's actual checks, including:

```bash
node prototypes/stage-1/model.test.mjs
node prototypes/stage-1/scheduler.test.mjs
node prototypes/stage-1/cloud.test.mjs
node prototypes/stage-1/serve.test.mjs
node prototypes/stage-1/browser-check.mjs
node prototypes/stage-1/runtime-browser-check.mjs
python3 scripts/cockpit.py --write
python3 scripts/cockpit.py --check
python3 scripts/validate-docs.py
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/check_handoff.py --base origin/main --head HEAD
git diff --check
```

Do not run the real combined backend integration unless its owner separately
provides an exact running loopback endpoint and current authority. No network or
device evidence is needed for this UI checkpoint.

Inspect the implementation at full expanded size, narrow width and combined
large text. Compare screenshots beside the selected PNG and Harbour Blue board.
Review visual breathing room, composer priority, continuation restraint, open
portrait treatment, focus-ring clipping, truthful overflow and whether Rooms
look optional rather than like an app launcher.

## Stop point and report

Stop when the selected Home, its in-memory review states, working placeholder
destinations, regression tests and two screenshot artifacts are complete.

Do not continue into full SCR-016 room creation/search/management, SCR-017
Kitchen/Fitness interiors, context retrieval, persistence, Android or backend
integration.

Report:

- exact changed paths and implementation worktree/branch;
- how the existing frontend is structured and how the Home was integrated;
- the reviewed `reused / adapted / replaced / removed` inventory for the old
  mock UI, including any deleted code and why deletion was safe;
- Terra sub-agent assignments, useful findings and how the lead reconciled
  them;
- exact behavior of room overflow, controls, keyboard/focus and responsive
  fallback;
- which logo/room/destination elements remain explicit placeholders;
- exact commands/results, screenshots and visual mismatches;
- unrun Android, assistive-technology and human checks;
- commit and verified remote branch SHA if publication succeeds;
- the next bounded task, without claiming the full T-119 slice is complete.
```

## Handoff boundary

This metaprompt deliberately separates the first frontend checkpoint from the
larger T-119 packet. Placeholder destinations must be functional and truthful,
not dead controls or fake completed product areas. The later slice may replace
them with the calm Rooms library and one room interior while retaining the exact
selected Home hierarchy, Harbour Blue system and Round composer.
