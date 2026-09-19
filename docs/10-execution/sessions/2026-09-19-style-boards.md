---
title: "Style boards and Obsidian image filing"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, execution]
related:
  - ../../02-design/mockups/2026-09-19-style-boards/README.md
  - ../../02-design/mockups/README.md
  - ../../02-design/brand-and-visual-identity.md
  - ../git-workflow.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: main
next_action: Simon reviews palette and font pairing before the next Home compositions.
changed_paths:
  - AGENTS.md
  - docs/README.md
  - docs/02-design/brand-and-visual-identity.md
  - docs/02-design/mockups/README.md
  - docs/02-design/mockups/2026-09-17-chat-entry/README.md
  - docs/02-design/mockups/2026-09-19-style-boards/README.md
  - docs/02-design/mockups/2026-09-19-style-boards/prompts.md
  - docs/02-design/mockups/2026-09-19-style-boards/01-open-day.png
  - docs/02-design/mockups/2026-09-19-style-boards/02-bright-signal.png
  - docs/02-design/mockups/2026-09-19-style-boards/03-living-pages.png
  - docs/02-design/mockups/2026-09-19-style-boards/04-everyday-spark.png
  - docs/02-design/mockups/2026-09-17-chat-entry/01-the-pebble.png
  - docs/02-design/mockups/2026-09-17-chat-entry/02-the-open-page.png
  - docs/02-design/mockups/2026-09-17-chat-entry/03-the-shoreline.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-2/a-one-clear-next-step.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-2/b-the-shared-table.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-2/c-conversation-working-page.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-3/01-correspondence.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-3/02-margin.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-3/03-soft-terminal.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-4/01-conversation-bubble.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-4/02-soft-ticket.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-4/03-folded-ribbon.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-5/02-tucked-tail.png
  - docs/02-design/mockups/2026-09-17-chat-entry/round-5/03-cushion-bubble.png
  - docs/10-execution/git-workflow.md
  - docs/10-execution/current-milestone.md
---

# Style boards and image filing

## Scope and authority

Simon requested image-model font/color foundation boards before further Home/widget variation, and correct image filing/embedding in Obsidian. This bounded T-102/T-108 design-artifact task preserves the selected Round conversation shape and SCR-003/CMP-010 Home contract. Palette/type remain proposed.

Work began in /tmp/granny-style-boards-2026-09-19 from origin/main 557befb under the previous worktree policy. During the session Simon approved integration and then explicitly directed all mockup-only work to occur in the root/main checkout without GitHub ceremony. The final artifacts are therefore delivered directly to the primary vault, /home/lgtw/Work/granny/docs, under the [new scoped workflow exception](../git-workflow.md#mockup-only-local-work--2026-09-19). No task commit, PR, push or Git merge is claimed. The temporary worktree has only a superseded active draft record; no final deliverable depends on it.

## What changed

- [Four style tiles](../../02-design/mockups/2026-09-19-style-boards/README.md): Open Day, Bright Signal, Living Pages, Everyday Spark. Built-in image generation, followed by readable-background revisions and targeted type corrections. Exact prompts preserved beside the images.
- [Image gallery and filing guide](../../02-design/mockups/README.md) plus [15-image earlier-round gallery](../../02-design/mockups/2026-09-17-chat-entry/README.md). Existing historical PNGs remain at their established paths. The selected Round conversation PNG, initially absent locally, is present and matches its Git reference; no replacement image was generated.
- Canonical brand owner adds proposed shade ramps and 20 calculated contrast checks. Essential labels use primary ink; secondary ink on three new tints falls below the internal essential-text target.
- Root instructions and Git workflow record Simon's mockup-only main/root exception. Documentation map and milestone link the actual artifacts.

Design handoff/UI craft preserved the accepted composer direction, adult tone, voice/touch labels and one optional context panel. This is styling exploration, not three structural Home variations or accepted production tokens. Gallery review notes identify remaining generated-text, type-weight, exact shape and state-strip inaccuracies. Built-in generation only; no API fallback, dependency, external font loading, Figma edits or private Obsidian settings.

## Evidence

Initial primary documentation baseline passed with 0 errors before this edit set. Generated images and all prior-round images were visually inspected; the first dark-shaded generation was rejected and revised.

| Check | Observed result and limit |
|---|---|
| Local image audit using Node filesystem reads | 19 valid PNG signatures/dimensions; all 19 appear in existing relative local Markdown embeds. Four new boards are 1536×1024. |
| sRGB contrast arithmetic | 20 new role-pair ratios calculated; values and limits in the brand owner. Not a rendered-pixel audit. |
| python3 scripts/cockpit.py --write / --check | Fresh snapshot; 38 records, 12 Canvas nodes/3 edges, 3 Base views. |
| python3 -m unittest discover -s scripts -p 'test_*.py' | 47 tests passed. |
| python3 scripts/validate-docs.py | No errors reported for authored artifacts/links; latest full-vault run reports two newly present local notes without frontmatter: docs/Untitled.md and docs/02-design/mockups/2026-09-19-style-boards/Notes - style boards.md. Both are untouched. |
| git diff --check | Passed. |
| Obsidian URI open of the exact gallery path | Application returned Processed URI. CLI rendering inspection unavailable because the user's CLI setting is disabled; no settings changed. This proves the file was opened by URI, not a visual in-app rendering pass. |

No Android, TalkBack, participant or production-gate evidence is claimed. Browser model/runtime checks are not applicable because no executable prototype source changed. Handoff coverage/publication checks are not meaningful as a PR gate during the explicitly local-only mockup phase; no unrelated changes were staged.

## Handoff

Final location: primary root checkout, main, under the existing docs vault. No remote publication requested after the local-only override. Preserve the user's Development.canvas edit and .claude directory. Earlier unrelated dirty tracked files observed at startup returned to their tracked state outside this task before final edits; this session did not reset or stash them.

Next: choose a palette/type direction, then explore three bounded Home compositions and the optional panel's absent/present states. User review, exact font rendering and interaction evidence remain open.
