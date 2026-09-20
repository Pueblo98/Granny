---
title: "Session — shared conversation surfaces"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, prototype]
related:
  - ../backlog.md
  - ../../02-design/shared-conversation-state-surfaces.md
  - ../../02-design/browser-prototype.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/explicit-scroll-row-home
next_action: "Simon reviews the shared-state checkpoint; mixed-code main integration requires separate authority."
changed_paths:
  - prototypes/stage-1/app.js
  - prototypes/stage-1/index.html
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/fixtures.js
  - prototypes/stage-1/shared-state-browser-check.mjs
  - prototypes/stage-1/shared-state-review.mjs
  - prototypes/stage-1/browser-check.mjs
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/rooms-browser-check.mjs
  - prototypes/stage-1/runtime-browser-check.mjs
  - prototypes/stage-1/README.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/README.md
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/home-01-listening.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/home-02-transcript.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/home-03-clarification.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/home-04-preview.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/home-05-active.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/home-06-prepared.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/home-07-unknown.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-01-listening.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-02-transcript.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-03-clarification.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-04-preview.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-05-active.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-06-prepared.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-07-unknown.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-narrow-200.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-narrow-200-actions.png
  - docs/02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/kitchen-constrained-height.png
---

# Shared state frontend checkpoint

## Scope and continuity

Simon authorized the seven-state fictional browser implementation. Continued
the clean dedicated worktree `explicit-scroll-row-home` on its existing branch
from `541f353`; inspected origin/main and safely merged its accepted references
at `9224d38`. The only conflict was the generated cockpit snapshot, regenerated
instead of hand-edited. Incoming native/experiment work is outside this task.
Primary edits and private Obsidian state remain untouched.

Lead personally inspected the seven original PNGs and comparison, accepted
surface contract, screen/component/access/voice/safety owners and current
frontend. Baseline Chromium renders included Home, Kitchen, old Talk dialog,
exact draft and narrow Stop, under `/tmp/granny-conversation-review-JQRbvw`.

## Reuse and implementation inventory

- Reuse model.js exact version/signature approval, epoch cancellation and
  scheduler guards, five workflows, connected runtime separation, loopback
  allowlist/CSP, reviewer fixtures, native controls and single SVG composer
  body/tail/focus contour.
- Retain place authority `homeView` and mounted roomUI state. Do not call
  roomUI.enter/globalConversation to show a temporary task.
- Adapt app.js task rendering into one message-state family; preserve generic
  non-message and connected rendering. Add UI-owned speech state and origin
  focus/scroll independently of model task stages.
- Replace the native Talk modal (which obscured Kitchen and combined capture
  with editable review) with two intrinsic composer expansions.
- Replace repeated message-preview cards in active/results with one surface.
  Move Stop into the composer Send slot; retain an offscreen fallback for
  long-page/large-text reachability.
- Navigation must resolve listening/unfinished action before changing place.
  Unknown after dispatch remains available for explicit review, never retry.

Terra audits ran in parallel: state-model audit confirmed reusable guards and
found unguarded room switching; visual/access audit identified separate top
Stop and full-page raster interpretation risks; test audit mapped existing
selectors and passed 67 model / 7 scheduler baseline cases. Test agent owns
only the new shared-state browser-check file. Lead owns shared production
edits and reviews the complete test diff. No agents publish or change scope.

## Evidence boundary

Implementation and bounded browser verification are complete. No microphone, provider,
external application, persistent personal data or native Android work is
authorized. Browser fixtures cannot prove real cancellation, verification,
TalkBack/switch, Android dp/IME or human comprehension. System sans remains
the honest local font fallback.

## Review findings resolved

Lead reconciled both audit waves. Result navigation now requires explicit
Done and leave rather than silently hiding Prepared/Unknown. Settings expire
preview authority while preserving unsaved edits, maintaining the existing
settings regression. A delayed speech focus/scroll callback could undo a new
scroll at large text; entry focus is now synchronous. Native dialog Tab could
cycle through browser chrome/body, so explicit first/last containment now
supplements the modal. Test migration initially dropped a scroll-to-extremes
operation; lead caught it in the complete diff and required its restoration.
No assertion or scripted workflow was removed to make the redesign pass.

The lead implemented production changes; Terra agents owned two exclusive
test files (`browser-check.mjs`, `shared-state-browser-check.mjs`) and otherwise
remained read-only. All diffs were inspected and the authoritative checks
rerun by the lead. Lifecycle maintained branch/session coverage; design-handoff
kept SCR/CMP/access authority; task-slice bounded implementation to fictional
frontend states; UI-craft Harden guided reflow and the retained-place review.

## Validation and evidence

Passing commands for this checkpoint:

- `node prototypes/stage-1/model.test.mjs`: 67 tests.
- `node prototypes/stage-1/scheduler.test.mjs`: 7 tests.
- `node prototypes/stage-1/cloud.test.mjs`: 27 tests.
- `node prototypes/stage-1/serve.test.mjs`: 1 allowlist/security test.
- `node prototypes/stage-1/shared-state-browser-check.mjs`: 129 assertions.
- `node prototypes/stage-1/browser-check.mjs`: 137 workflow assertions.
- `node prototypes/stage-1/home-browser-check.mjs`: 158 assertions.
- `node prototypes/stage-1/rooms-browser-check.mjs`: 357 assertions.
- `node prototypes/stage-1/room-layout-browser-check.mjs`: 143 assertions.
- `node prototypes/stage-1/runtime-browser-check.mjs`: 37 wire-fixture assertions.
- `node prototypes/stage-1/shared-state-review.mjs`: 17 review captures, no browser exceptions.
- `python3 scripts/cockpit.py --write` / `--check`: fresh 86-record snapshot.
- `python3 scripts/validate-docs.py`: zero errors.
- `python3 -m unittest discover -s scripts -p 'test_*.py'`: 47 tests.
- `git diff --check`: clean.

Browser proof covers Home and Kitchen end-to-end, six Room identities, typed
bypass, exact edit/stale-approval rejection, no incidental approval, alternative
results, read-only Unknown recovery, native modal focus containment, normal
keyboard traversal, one surface at a time, origin item/scroll/focus restoration,
no microphone/storage/third-party requests. All seven surfaces run at 360×480
and 840×600 with 200% text; 1440×900 enlarged listening, 840×320 keyboard-like
pressure, 300% Stop at both scroll extremes, reduced motion and existing room
360/600/840/landscape layout checks also pass. This is Chromium fixture evidence,
not real keyboard-open Android geometry or independent external verification.

The [17 screenshots and reference mapping](../../02-design/mockups/2026-09-20-shared-state-pack/frontend-checkpoint-1/README.md)
record deliberate differences: retained place instead of blank pages, inline
nonmodal preview, grouped actions, honest unknown evidence, system fonts and
canonical blue on new state surfaces while approved idle Home/Room remains.
No known failing checks remain; early failures were migration expectations or
the repaired issues above, not pre-existing failures being waived.

## Handoff

Worktree: `/home/lgtw/Work/granny-worktrees/explicit-scroll-row-home`.
Branch: `feature/explicit-scroll-row-home`; source integration commit `9224d38`.
The scoped delivery commit is this record's Git commit. Publish only that task
branch and verify remote HEAD; do not merge this mixed-code task to main.
The loopback preview is running at `http://127.0.0.1:4173` from this worktree.
Next bounded action is Simon's review of whether the expanded composer stays
visibly connected to the Room while exact consequences remain easy to inspect.
