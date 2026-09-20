---
title: "Navigation and supporting surfaces frontend"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, prototype, navigation]
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex lead with Terra audits
branch: feature/explicit-scroll-row-home
next_action: Review the supporting surfaces after authorized integration
related:
  - ../backlog.md
  - ../../../prototypes/stage-1/README.md
changed_paths:
  - docs/02-design/browser-prototype.md
  - docs/10-execution/sessions/2026-09-20-navigation-support-frontend.md
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/assets/context-rooms/asset-manifest.json
  - prototypes/stage-1/browser-check.mjs
  - prototypes/stage-1/home-browser-check.mjs
  - prototypes/stage-1/index.html
  - prototypes/stage-1/model.js
  - prototypes/stage-1/model.test.mjs
  - prototypes/stage-1/room-fixtures.js
  - prototypes/stage-1/room-ui.js
  - prototypes/stage-1/runtime-browser-check.mjs
  - prototypes/stage-1/runtime-integration-check.mjs
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/shared-state-browser-check.mjs
  - prototypes/stage-1/styles.css
  - prototypes/stage-1/support-browser-check.mjs
  - prototypes/stage-1/support-review.mjs
  - prototypes/stage-1/support-state.js
  - prototypes/stage-1/support-state.test.mjs
  - prototypes/stage-1/support-ui.js
---

# Navigation and supporting surfaces

## Authority and continuity

Simon requested thirteen supporting surfaces, continuing the dedicated
`explicit-scroll-row-home` worktree at `dedaa27`. The task branch is clean at
entry. Freshly fetched main is `89f766d`. The selected navigation pack is still
untracked in the dirty primary checkout, not on main: its exact README,
manifest, prompts and thirteen individual PNGs were inspected read-only.
No source assets or unrelated changes are copied between worktrees. This
dependency must be integrated by its owner separately. Simon subsequently
explicitly requested merging all completed implementation work and a clean
repository. That authorizes this mixed branch's integration after checks, not
discarding unrelated primary-checkout edits or publishing unreviewed assets.

Handoff-time fetch found that the design owner has now integrated the exact
reference pack in main (`5a092bb`, PR 43). The earlier read-only dependency is
resolved by normal Git integration, not cross-worktree copying. Main also has
separately authored native changes, retained without modification by this task.

Lifecycle, design-handoff, task-slice (implementation) and UI-craft (Harden)
guide continuity, semantic authority, bounded fixtures and responsive review.
No new platform, data access, storage, service or dependency is authorized.

## Initial keep / adapt / replace / remove

- Keep Home/Room place state, room membership store, Round composer, all five
  workflows, shared conversation/outcome renderers, task epochs/versions and
  scheduler cancellation. Keep optional connected-demo consent and isolation.
- Adapt support navigation to retain origin place, draft, scroll and focus;
  retain native modal containment and exact confirmation patterns.
- Replace the old inline Menu button panel and generic history/help/privacy
  presentation with the approved sheet and a shared readable support shell.
- Retain alias and demo-connection behavior as secondary Settings routes.
  Remove superseded support renderers only after callers/tests are migrated.
- Preference state remains in memory; Today indexes only safe summaries and
  never private thread or outcome content. Browser Back cannot execute effects.

Baseline: model 67 assertions and browser 137 assertions pass. Rendered Home
and old inline Menu captured under `/tmp/granny-conversation-review-yPFkyG/`.
Three Terra read-only audits cover navigation/state, visual/accessibility and
test dependencies. Lead owns shared source edits and final judgment.

## Evidence and handoff

The reusable support-state model owns staged/applied preferences, safe minimal
history, admitted local search and setup state. The support-ui shell owns
destination history, return focus/scroll and one native focus-owning overlay.
Existing Home/Room and conversation models remain separate. Existing native
confirmation and message-result components are reused, including Stop-first
interruption and versioned task cancellation. Old inline support renderers were
removed; aliases and connected-demo controls remain under Settings. Search
opens the existing room/item implementation, not competing detail screens.

### Reference mapping

| Reference | Implementation |
| --- | --- |
| 01 Menu | Native right sheet, grouped broad rows, inert background, Escape/Back/Close |
| 02 Today | Safe three-row fixture, summary, exact clear preview, empty and failed-read |
| 03 Settings | Shared route rows with current state summaries |
| 04 Privacy | Separate simulated access reviews, history clear and local-reset previews |
| 05 Accessibility | Staged sample and choices, explicit Apply and last-applied restoration |
| 06 Help | Plain noninteractive examples; Ask preserves and focuses existing draft |
| 07 New conversation | Exact scope confirmation; preserves rooms, preferences and history |
| 08 App return | Existing message result variant; unknown send status, no retry or real launch |
| 09 Search | Four soup fixture matches, explicit source labels, owning destinations and return |
| 10 No matches | Dedicated local-empty state; editable phrase handoff, no external search |
| 11 Welcome | Temporary-name disclosure, setup or skip without account/access |
| 12 Preferences | Staged choices, Back preservation, explicit Continue, silent sample |
| 13 Access | Three separate simulated reviews; Continue without access; no grants |

All thirteen are functional fictional browser states, not production services.
Search indexes an explicit small fixture subset, room metadata, settings and
safe summary fields, never private message bodies or external content. Today is
deterministic fixture history, not a real transcript recorder. Speech sample is
silent simulation. Optional runtime integration remains separately consented.

### Parallel work and review

Three Terra agents audited code/state, visuals/accessibility and tests. After
the read-only wave they received exclusive new-file/test assignments: support
state/model tests, supporting browser checks and screenshot review script.
The lead inspected their complete diffs and owned shared application integration.
Findings led to explicit summary retention on fresh conversation, search-source
return, native confirmation callback locking, preview focus-race correction and
truthful external-return rendering. No agent published or merged independently.

### Browser evidence and checks

Baseline: model 67 and browser 137 passed. Final executable checks:

| Command under prototypes/stage-1 (node) | Assertions/checks |
| --- | --- |
| model.test.mjs | 67 |
| support-state.test.mjs | 31 |
| support-browser-check.mjs | 68 |
| outcomes.test.mjs | 11 |
| outcomes-browser-check.mjs | 140 |
| shared-state-browser-check.mjs | 129 |
| room-layout-browser-check.mjs | 143 |
| scheduler.test.mjs | 7 |
| cloud.test.mjs | 27 |
| serve.test.mjs | 1 |
| rooms-store.test.mjs | 58 |
| rooms-system-browser-check.mjs | 61 |
| home-browser-check.mjs | 158 |
| rooms-browser-check.mjs | 350 |
| browser-check.mjs | 137 |
| runtime-browser-check.mjs | 37 |

Logs: `/tmp/granny-nav-validation-eJcafA`. The full run exposed a Home test
focus race: it activated the library route before room-heading focus settled.
The corrected check waits for that existing transition without weakening its
return-focus assertion; rerun passed (`/tmp/granny-home-final.log`). Supporting
checks reran successfully after final return-state fixes
(`/tmp/granny-support-final.log`). The outcomes reading-cancel focus race found
during development was fixed in the application, not hidden by an assertion.
Final visual audit also found enlarged-text confirmation arriving mid-scroll;
confirmation now focuses its non-action heading and resets its own scroll on
open. This preserves consequence-before-approval reading order.

Repository checks: cockpit write/check passed; validate-docs passed with zero
errors; documentation-tool unit tests passed (47); scoped handoff coverage and
`git diff --check` passed. Cockpit snapshot is generated, not a product change.
Final whole-branch whitespace review found and removed one trailing empty line
in the earlier room asset manifest; no asset metadata changed.

Publication: implementation commit `652bfeb`; current-main integration commit
`98d574c` was pushed and its remote SHA verified. PR 44 gathers this authorized
frontend branch and its prior scoped deliveries. Simon's current instruction
authorizes normal merge after CI. The primary checkout now has only unrelated
untracked `.claude/`, `.playwright-mcp/`, `docs/Notes.md` and
`docs/To do table features.md`; retain them during safe fast-forward. The task
worktree remains live for the localhost server and is not removed.

`support-review.mjs` captured 39 states (13 each at 1440×900, 360×640 and
840×600 with 200% review text), 42 geometry checks and zero script errors.
Temporary evidence: `/tmp/granny-conversation-review-ocGj7e`. Browser tests also
cover the final confirmation fix in a second 39-capture run at
`/tmp/granny-conversation-review-N6cnin`. The final support (68), baseline
browser (137) and mocked runtime (37) suites passed again. Browser tests also
cover combined 300% text, short viewport, keyboard/focus, no storage and no
third-party requests. Supporting screenshots were compared with the individual
primary-checkout references. Existing outcome, Rooms-system and Rooms review
scripts also ran; captures are under `/tmp/granny-conversation-review-mBSFuM`,
`/tmp/granny-conversation-review-RTf3Xn` and
`/tmp/granny-conversation-review-Kjd5hW`. Temporary evidence is reproducible via
the committed scripts but is not durable repository artwork.

Live `runtime-integration-check.mjs` is unrun: the separately authorized runtime
endpoint on port 4180 is unavailable. The mocked runtime browser suite passes;
no backend/provider was started to manufacture integration evidence.

### Deliberate differences and limits

The support shell uses normal document scrolling, rather than fitting all raster
content into one fixed-height screen. Large-text rows/actions wrap and dialogs
scroll. Four existing canonical text choices remain (including Comfortable),
instead of deleting one to match the three-choice image. Current values reflect
actual applied state rather than forcing the raster's Large example. Font
fallback remains honestly system-sans. Existing brighter Home/Room outlines
retain Simon's earlier explicit visual direction; new support surfaces use the
Harbour Blue role tokens. No canonical behavior was changed to match a raster.

Browser focus containment, target CSS sizes and reflow are not Android dp/sp,
TalkBack, switch-access, physical IME/device, real permissions, external outcomes
or older-adult comprehension evidence. Those remain unrun. No private data,
storage, capture, real speech, app launch or production deletion was added.

Review question: does this feel like one quiet support system around the same
conversation, and which surface, if any, still feels too much like a conventional
settings dashboard?
