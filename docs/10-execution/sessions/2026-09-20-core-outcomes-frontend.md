---
title: "Core outcomes fictional frontend slice"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, prototype, outcomes]
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex lead with Terra audits
branch: feature/explicit-scroll-row-home
next_action: Simon accepted the integrated outcome modules as cohesive for now; external capability evidence remains separate
related:
  - ../backlog.md
  - ../../../prototypes/stage-1/README.md
changed_paths:
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/01-photos-found.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/02-photos-no-result.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/03-screen-explanation.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/04-screen-guidance.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/05-message-draft-review.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/06-message-prepared-unsent.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/07-media-playing.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/08-media-unavailable.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/09-reading-preview.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/10-reading-applied.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/11-guidance-narrow.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/12-draft-short-200.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/13-reading-preview-300.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/14-kitchen-outcome.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/15-art-disabled.png
  - docs/02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/README.md
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/browser-check.mjs
  - prototypes/stage-1/fixtures.js
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/index.html
  - prototypes/stage-1/intent.js
  - prototypes/stage-1/model.js
  - prototypes/stage-1/model.test.mjs
  - prototypes/stage-1/outcome-ui.js
  - prototypes/stage-1/outcomes-browser-check.mjs
  - prototypes/stage-1/outcomes-review.mjs
  - prototypes/stage-1/outcomes.test.mjs
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/shared-state-browser-check.mjs
  - prototypes/stage-1/styles.css
---

# Core outcomes frontend

## Continuity and authority

Simon's ten-state implementation request continues the existing dedicated
worktree `/home/lgtw/Work/granny-worktrees/explicit-scroll-row-home`, initially
clean at `8c282ca`. Fetched main `89f766d` supplied the new design-only pack;
merge `9e768aa` retained implementation and regenerated the sole conflict,
the generated cockpit snapshot. No primary-checkout or private settings edits.
Mixed-code publication is authorized; main integration is not.

The lead read the lifecycle, design-handoff, task-slice and UI-craft skills,
authority documents and all ten individual references at original detail.
Harden mode prioritizes reflow, truthful outcomes and focus over raster geometry.

## Initial keep / adapt / replace / remove audit

- Keep `homeView`/`roomUI` place state, room collection/item navigation,
  Round composer, simulated speech, native dialogs and origin focus/scroll.
- Keep `model.js` task IDs/version/epoch, exact message and photo mark-read
  permits, scheduler guards, explicit verification fixtures, Stop and connected
  runtime boundaries. No new outcome is a route or a model response.
- Adapt existing photo/screen/media/reading fixtures and typed transitions;
  retain protected/unknown screens and partial/paywall/unavailable distinctions.
- Reuse messageSurface for exact review and prepared-not-sent. Replace the
  other four generic result renderings with one inline outcome family.
- Remove the old multi-photo gallery and cyclic viewer once replacement tests
  pass; remove duplicated archived interactive modules, not conversation text.
- Reviewer controls alone own fault/delay/text/art fixtures. CSP, exact static
  server allowlist, blocked capture/media and no storage remain unchanged.

Baseline rendered Home, Kitchen and Listening evidence:
`/tmp/granny-conversation-review-lQrxcR/`. Existing five workflows and shared
surfaces have deterministic model/browser suites; new checks will extend them.

## Parallel audit assignments and reconciled findings

Terra code audit mapped model/state/rendering reuse; visual audit inspected all
ten originals and reflow/semantics; test audit mapped exact legacy assertions.
All were read-only. Useful findings: preserve photo mark-read approval, prior
player isolation on unavailable requests and exact previous-scale restore;
replace cyclic photo navigation; do not replay effects on Done. Screen guidance
must make its written position match its actual supplied row order. Canonical
closed scale values remain unchanged despite raster label approximations.

## Validation and handoff

The [review gallery](../../02-design/mockups/2026-09-20-core-outcome-modules/frontend-checkpoint-1/README.md)
contains all ten states plus narrow, short/200%, combined300%, Kitchen and
art-disabled evidence. It records each raster mapping and deliberate difference.

One `outcome-ui.js` renderer owns photos, supplied screens, media and reading;
message preview/prepared reuse `messageSurface`. Place remains in homeView and
roomUI; outcomes remain typed task results with epoch/id/version, not routes.
Registered actions and detached-DOM version checks cannot authorize effects.
Origin focus/scroll is retained; one native full-size photo dialog owns focus
only while open. The composer now participates in outcome document flow.

The old cyclic photo viewer, multi-photo gallery, archived interactive result
copies and obsolete reading-preview control branch were removed after mapping
their tests. Version-controlled history retains them. Protected/unknown/partial
fallbacks, aliases, mark-read previews, Stop and connected contracts were kept.
Updated legacy assertions test the single-photo replacement rather than the
rejected two-image gallery; no safety assertion was removed. New source script
is added to the exact server and browser asset allowlists only.

After read-only audits, Terra agents received separate exclusive test artifacts:
outcomes.test.mjs, outcomes-browser-check.mjs and outcomes-review.mjs. The lead
inspected each complete file, integrated it and owned all production edits.
The expanded scroll check initially measured before restoration completed;
capturing the actual submit origin and waiting through the animation frame
resolved the test error without relaxing its exact-position assertion.

Executed from the task worktree (all pass):

| Command under `node prototypes/stage-1/` | Exact result |
|---|---|
| `model.test.mjs` | 67 tests |
| `outcomes.test.mjs` | 11 tests |
| `scheduler.test.mjs` | 7 tests |
| `cloud.test.mjs` | 27 tests |
| `serve.test.mjs` | 1 test |
| `rooms-store.test.mjs` | 58 assertions |
| `browser-check.mjs` | 137 checks |
| `outcomes-browser-check.mjs` | 140 checks |
| `shared-state-browser-check.mjs` | 129 checks |
| `runtime-browser-check.mjs` | 37 checks; wire fixtures, not real MCP |
| `home-browser-check.mjs` | 158 checks |
| `room-layout-browser-check.mjs` | 143 checks |
| `rooms-browser-check.mjs` | 350 checks |
| `rooms-system-browser-check.mjs` | 61 checks |
| `outcomes-review.mjs` | 15 captures; zero failures/browser exceptions |
| `rooms-review.mjs` | Completed temporary screenshot review |
| `rooms-system-review.mjs` | 23 captures; zero failures/browser exceptions |

`shared-state-review.mjs` also passed; it regenerates old tracked evidence, so
only those test-generated changes were restored to their previously clean HEAD
versions. No earlier selected/reference PNG was changed. New evidence is in its
own checkpoint directory. Final outcome browser artifacts:
`/tmp/granny-conversation-review-AeY6KC`; capture source:
`/tmp/granny-conversation-review-04NHtR`.

Repository checks: `python3 scripts/cockpit.py --write`, `--check`,
`python3 scripts/validate-docs.py`,
`python3 scripts/check_handoff.py --base origin/main` and `git diff --check`.
All passed: cockpit 90 records; documentation zero errors; handoff coverage PASS;
diff whitespace clean. Documentation tooling did not
change, so its unit suite is not required by this slice. No dependencies installed.

## Limits and handoff

All ten states are implemented as local simulations, with these explicit bounds:
photo artwork is existing SVG illustration, not personal photos; media produces
no audio and its alternative-source chooser honestly has no other provider;
screen rows are inert fictional HTML; message handoff stays unsent and local;
reading sizes use the existing canonical closed choices rather than raster
Normal/Large labels. Existing photo mark-read consent cannot be omitted for
visual matching. System-sans fallback remains; exact requested font fidelity is
not claimed. No production gate, brand/logo or new outcome authority is accepted.

Keyboard viewer/escape/focus, one photo announcement, artwork error fallback,
Kitchen Recipes retention, Stop/new-request stale callbacks, 360px narrow,
840px short, 200% and combined 300% no-overlap/overflow checks passed. CSS pixels
do not prove Android dp/sp. Native IME, TalkBack, switch access, real devices,
external services, device Stop and older-adult comprehension remain unrun.
Browser egress is loopback-only; participant controls add no storage or reviewer
UI. The existing optional connected path was tested with wire fixtures only.

The verified task-owned preview was restarted after its old allowlist rejected
the new script: http://127.0.0.1:4173/ now serves this worktree. No other server,
primary checkout or private Obsidian settings were changed. Branch publication
does not update main or the primary vault. Delivery commit and verified remote
SHA are reported in the final handoff; this record is included in that commit.

Review question: Do these five outcomes feel like useful parts of one
conversation, or does any module still feel like a separate mini-app?
