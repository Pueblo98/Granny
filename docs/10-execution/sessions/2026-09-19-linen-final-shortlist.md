---
title: "Linen selection and iteration 5 action-color shortlist"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [design, execution]
related:
  - ../../02-design/brand-and-visual-identity.md
  - ../../02-design/mockups/2026-09-19-style-boards/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: main
next_action: Simon chooses the main board from iteration 5; recommend 02, with 03 as challenger, then consolidate that choice.
changed_paths:
  - design-tokens/README.md
  - docs/README.md
  - docs/02-design/brand-and-visual-identity.md
  - docs/02-design/mockups/README.md
  - docs/02-design/mockups/2026-09-19-style-boards/README.md
  - docs/02-design/mockups/2026-09-19-style-boards/iteration-4/README.md
  - docs/02-design/mockups/2026-09-19-style-boards/iteration-5/README.md
  - docs/02-design/mockups/2026-09-19-style-boards/iteration-5/prompts.md
  - docs/02-design/mockups/2026-09-19-style-boards/iteration-5/01-plum-iris.png
  - docs/02-design/mockups/2026-09-19-style-boards/iteration-5/02-plum-cobalt.png
  - docs/02-design/mockups/2026-09-19-style-boards/iteration-5/03-periwinkle-cobalt.png
  - docs/02-design/mockups/2026-09-19-style-boards/iteration-5/04-harbour-blue.png
  - docs/10-execution/current-milestone.md
  - docs/10-execution/open-questions.md
---

# Linen final shortlist

Simon selects Linen canvas, retaining white surface and dark ink. Soft Plum remains the accepted direction/baseline accent, while current explicit authority permits blue accent alternatives. His chat and iteration 4 notebook feedback match: clearer blue-ish Send, visible harmonious composer outline, distinct focus/Stop. Do not treat the older rejection of blue identity palettes as a ban on this newly requested exploration.

Four built-in image edits hold the Linen composition and content fixed. Compare the prior violet Send against cobalt, then plum against two blue accent families. Focus gains an offset heavier ring to distinguish it from default blue-family borders without relying only on hue. This is a palette/state-treatment study, not new behavior or implementation. Final main-board selection remains Simon's next decision.

Work directly in primary main under the mockup-only exception. Preserve notes, all earlier boards and concurrent work. No branches, commits, PRs, app code or external design-file writes.

## Delivery and design review

Four 1536×1024 built-in image-model edits saved under iteration-5 with exact prompts and local gallery embeds: Plum + Iris, Plum + Cobalt, Periwinkle + Cobalt, Harbour Blue. All use the inspected iteration 4 Linen image as the edit target. No discarded/replacement asset overwrites.

Visual review confirms fixed content/layout and Linen/white foundation, labeled touch/voice controls, ordinary outlines, offset double-outline focus and red Stop. Generated hue, font weight and exact line/gap geometry remain approximate. Text is not a final font specimen; fills should be flat in eventual implementation.

UI-craft/design-handoff deliberately held composition and behavior constant for the requested color comparison. Recommend 02 Plum + Cobalt for separation of Send from warm plum accents; 03 Periwinkle + Cobalt is the blue-led challenger. This recommendation does not choose the main board for Simon. No universal action-color association, observed usability improvement or participant evidence claimed.

The brand owner records selected Linen/surface/ink values and proposed action/outline values with calculated sRGB contrast. White accent text exceeds the internal 7:1 target; dark Send labels stay outside icon circles, whose contrast is evaluated as non-text. OQ-07 and token-maturity/navigation notes now reflect the selected foundation and remaining main-board choice. No production token export or executable behavior changed.

## Checks and handoff

- File audit: all 35 mockup PNGs have valid signatures and resolving local embeds; exactly four new 1536×1024 boards.
- Documentation validator: only the two pre-existing missing-frontmatter errors in Simon's style-board notebook and docs/Notes.md; no authored artifact/link error reported. Both notebooks untouched.
- Documentation-tool regression suite: 47 tests passed. git diff --check passed. Cockpit refreshed and freshness checked at handoff.
- Feedback notebook reread before handoff; iteration 4 matches this request, with no new conflicting feedback.
- Browser/Android/runtime tests not applicable to bitmap-only changes. Rendered-Obsidian, device, TalkBack, maximum text scaling and participant evidence remain unrun.

Saved locally in primary main; no Git publication/integration operations. Concurrent unrelated work and earlier rounds preserved. Next bounded action is Simon's numbered main-board choice, followed by consolidation rather than another broad palette exploration.
