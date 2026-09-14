---
title: "Conversation-first browser experience build"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [execution, prototype, design]
related:
  - ../backlog.md
  - ../../02-design/conversation-first-plan.md
  - ../../02-design/browser-prototype.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: GPT-6 Astra with GPT-5.6 Sol and Terra workers
branch: feature/conversation-first
artifact_commit: a8d770cb47fe4a9bc60ad7f48968ea169a716d64
next_action: Simon reviews the integrated conversation and proposed visual treatments; main remains unmerged
changed_paths:
  - .github/workflows/repository-maintenance.yml
  - docs/10-execution/cockpit-guide.md
  - AGENTS.md
  - README.md
  - design-tokens/README.md
  - docs/01-product/traceability.md
  - docs/01-product/user-journeys.md
  - docs/02-design/accessibility.md
  - docs/02-design/browser-prototype.md
  - docs/02-design/conversation-first-plan.md
  - docs/02-design/design-system.md
  - docs/02-design/product-design-spec.md
  - docs/02-design/voice-ux.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/messages/2026-09-14-conversation-first.md
  - docs/10-execution/open-questions.md
  - docs/10-execution/task-packets.md
  - docs/Cockpit.md
  - docs/README.md
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/assets/garden.svg
  - prototypes/stage-1/assets/meal.svg
  - prototypes/stage-1/assets/seaside.svg
  - prototypes/stage-1/browser-check.mjs
  - prototypes/stage-1/browser-driver.mjs
  - prototypes/stage-1/fixtures.js
  - prototypes/stage-1/index.html
  - prototypes/stage-1/intent.js
  - prototypes/stage-1/model.js
  - prototypes/stage-1/model.test.mjs
  - prototypes/stage-1/scheduler.js
  - prototypes/stage-1/scheduler.test.mjs
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/serve.test.mjs
  - prototypes/stage-1/styles.css
---

# Conversation-first browser experience build

## Scope and authority

Simon explicitly requested implementation on 2026-09-14. This T-102 revision covers one conversation surface, five scripted MVP workflows, onboarding/local settings/privacy/history/recovery, cancellable demonstration timing and separate reviewer controls. Proposed neutral/Open Day/Bright Signal styling is reversible exploration, not final identity. J-001/002/003/005/006/007; SCR-001–012/014/015; CMP-001–009; PRD-FR-001/002/004/006–017, PRD-ACC-001–004, PRD-SAF-002 and PRD-PRV-001/002/004 remain the owning contracts. No T-103, Android/backend, external action/capture/network/persistence, dependency installation or production gate acceptance.

## Execution and readiness

Base: current fetched origin/main 5ffa589. Parent feature/conversation-first; isolated workers feature/conversation-model (Sol: fixtures, intent and task transitions/tests) and feature/conversation-ui (Terra: shell, renderer and styling). Parent owns integration, scheduling, server, browser checks and canonical documentation. No concurrent writes to a worktree or shared file. The separate reviewer was independent of implementation.

1. Message spine: direct typed request, person/channel clarification, exact editable preview, bound approval, automatic unsent-draft handoff, Stop/expiry/unknown. Share preview before widening.
2. Same shell: photos, supplied-screen explanation, simulated media, Granny-only readability.
3. Secondary onboarding/preferences/aliases/history/reset, focus/scroll/reflow, matched visual comparison.
4. Independent review, integrated browser/model/doc checks, scoped commits and verified task-branch publication.

Fixtures are fictional contacts and local illustration assets, with fixed 2026-09-14 date interpretation. Unit oracles assert deterministic task/approval state and forbidden callbacks; browser checks exercise rendered controls, wrapping, focus, storage and request boundaries. These are design-simulation evidence, not independent Android verification. No real permissions/data are required. Rollback is a reviewed revert of scoped prototype/docs commits; no production data or integration exists.

## Implemented result and independent review

The message checkpoint preceded expansion: typed request → necessary clarification → exact editable preview → bound approval → automatic fictional unsent-draft handoff. The same shell now hosts photo filtering/viewing, supplied-screen explanations, a silent player and reversible text size. Explicit alias correction/deletion changes routing. Previous content stays readable without historical approval controls. A short skippable introduction and no-microphone route work without capture. Menu and bounded typed navigation expose settings/privacy/help/history.

Stop, version-bound expiry and replacement cancel stale callbacks. Unsent-draft and mark-read handoffs quarantine post-dispatch uncertainty; no blind resend. A failed requested track cannot acquire an older verified player's status. Local-only waiting work stops without inventing an external effect. Conversation/history/alias deletion/full reset have distinct scopes; all runtime data is in memory, with activity capped at 20 task/outcome summaries.

Actual isolated workers used gpt-5.6-sol and gpt-5.6-terra; a separate gpt-5.6-sol reviewer did not author implementation. Parent inspected scoped diffs, cherry-picked the relevant commits and took final UI ownership explicitly. No recursive team or shared-index writing. Parent worktree is /tmp/granny-conversation-first; workers remain preserved at /tmp/granny-conversation-model and /tmp/granny-conversation-ui.

Repository lifecycle/task-slice/design-handoff/spec-change/evidence-review skills guided scoped ownership, canonical updates and evidence boundaries. Unmerged UI-craft guidance was inspected read-only and informed contrast/reflow critique; it was not installed or merged. Figma was not used.

Independent review drove fixes for Talk Stop, task-wide interruption protection, alias correction, reviewer fixture wiring, unverified media controls, effect-specific outcomes, contrast, overflow and Stop occlusion. One review run was initially mislabeled 300%; root audited the script and required correction because only 200% had actually applied. The final independent rerun asserts computed body font **60px** (150% app × 200% review) at 360×480 and 840×900: Stop was fully visible at top/bottom and first in center hit tests. A hidden oversized skip link had intercepted it; size-independent hiding fixed that. No remaining blocker in that bounded rerun.

## Actual validation

Node 26.8.1; Chromium 151.0.7922.173; no dependency installation.

| Command / review | Observed result | Evidence boundary |
|---|---|---|
| node prototypes/stage-1/model.test.mjs | 67 passed, 0 failed | Grammar/slots/approval/unknown/privacy and five-workflow state |
| node prototypes/stage-1/scheduler.test.mjs | 7 passed, 0 failed | Controlled-clock Stop/reset/edit/stale-callback/expiry |
| node prototypes/stage-1/serve.test.mjs | 1 subtest passed, 0 failed | Exact assets/methods/traversal/headers; loopback only |
| node prototypes/stage-1/browser-check.mjs | 124 assertions passed; no runtime exceptions or external requests | Actual Chromium workflows, keyboard/Escape, aliases/history/reset, failures, protected screen, mark-read, dialog Stop and matched visual treatments |
| python3 scripts/validate-docs.py | PASS, 0 errors | Local metadata/links/IDs/source integrity; external URLs not fetched |
| python3 -m unittest discover -s scripts -p 'test_*.py' | 46 passed | Documentation/cockpit/handoff tooling; an expected invalid-ref test prints a Git diagnostic |
| Cockpit freshness / committed handoff / whitespace | PASS on committed delivery and publication update | Repository maintenance, not product/device evidence |

Full-browser artifacts: /tmp/granny-conversation-review-xmp0eb/ contains results.json, workflow screenshots, responsive layouts and matched message comparisons. Root visually inspected Home, message preview, Open Day photos, Bright Signal, landscape and enlarged text. Tests include 840×1100, 1200×800, 600×960, 360×720 and constrained 360×480; combined 300% also exercises 840×900 and 600×520. A measured-height fallback puts the composer in document flow when a sticky composer would consume too much space.

Corrected independent Stop artifacts: /tmp/granny-conversation-review-gL4tTP/. These are temporary local browser evidence, not committed personal images or device observations. Static contrast arithmetic informed proposed tokens; essential notice/preview labels use the main foreground. This is not a native conformance audit.

## Handoff, publication and visibility

On 2026-09-15 Simon answered “Continue this direction” after the message checkpoint and authorized a draft PR after integrated checks. Main integration remains unauthorized. The prototype source is committed at **a8d770c**.

Preview is running at **http://127.0.0.1:4173/** from **/tmp/granny-conversation-first**, branch **feature/conversation-first**. Reviewer mode: **http://127.0.0.1:4173/?review=1**. From that worktree, start it with: node prototypes/stage-1/serve.mjs 4173. The task-owned server was restarted after exact-allowlist changes; unrelated servers/worktrees were not stopped/deleted.

Published task branch at 2653eb6, then 856d428, with remote SHAs independently matched. Authorized [draft PR #6](https://github.com/Pueblo98/Granny/pull/6) is open; main remains unmerged. Initial CI caught a calendar mismatch: Madrid was already 15 September while the UTC runner still saw 14 September. The scoped workflow now uses the documented Europe/Madrid editorial calendar; strict future-date validation remains enabled. [Repository maintenance passed](https://github.com/Pueblo98/Granny/actions/runs/34906239403/job/104183444720) in 9 seconds on 856d428, and GitGuardian Security Checks passed. This final documentation-only evidence update stays on the same draft PR; current head/checks are available there and through file history without a circular self-hash record.

Primary main is 5ffa589 with user-owned docs/Development.canvas and docs/05-safety-privacy/action-policy.md edits excluded from this task. No private Obsidian settings were changed. Unmerged task-branch work is **not visible in the primary docs/ vault**; no post-merge visibility claim is made.

## Remaining design decisions and evidence

The final read-only primary-checkout inspection also found a new untracked user note, docs/To DO.md. It was left untouched and is not part of this branch. A SHA-256 comparison of the live port-4173 app.js response and the task-worktree file matched exactly.

The modest English grammar, fixed 14 September 2026 fixture clock, local illustrated photos and silent player deliberately limit the experiment. There is no general AI, real permission/account access, device observation, sending, streaming or persistence. Normal messaging ends at an **unsent** draft; hypothetical admitted-send is reviewer-only fiction.

Unrun: representative human usability/comprehension, screen-reader/TalkBack/switch, physical Android/IME/permissions/Stop/device verification, real voice and production outcomes. Final name/palette/font, T-101/103–109, distribution and production gates remain open. Next product decision: does the shared clarification/preview/result rhythm feel natural, and which proposed territory supports it? This is not another broad documentation initiative.
