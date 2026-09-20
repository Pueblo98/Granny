---
title: "Profile and accessibility adaptations — iteration 1"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, design, mockups, accessibility]
related:
  - ../../02-design/mockups/2026-09-20-profile-accessibility/iteration-1/README.md
  - ../../02-design/mockups/README.md
  - ../current-milestone.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex Profile and accessibility mockup session
branch: main
base_commit: 89f766d3f932dbe8787ede4f31ab32052b2acbfd
next_action: Simon reviews the proposed Profile boundary and whether the nine adaptation patterns preserve one calm product before canonical propagation or frontend implementation instructions.
changed_paths:
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/01-profile.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/02-home-200-percent-text.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/03-kitchen-narrow-window.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/04-keyboard-open-layout.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/05-keyboard-focus.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/06-reduced-motion.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/07-no-microphone.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/08-artwork-disabled.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/09-long-copy.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/10-screen-reader-reading-order.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/README.md
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/comparison.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/manifest.json
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/prompts.md
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/rejected/02-home-200-percent-device-frame-rejected.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/rejected/10-screen-reader-wrong-date-rejected.png
  - docs/02-design/mockups/2026-09-20-profile-accessibility/iteration-1/rejected/README.md
  - docs/02-design/mockups/README.md
  - docs/10-execution/current-milestone.md
---

# Scope and authority

Simon requested a final mockup batch containing a Profile UI and nine named
accessibility states. This session creates raster review references only under
the repository's mockup exception in the primary checkout. It does not alter
canonical behavior, implement frontend/native code, create an account or
personal-data store, request permissions or claim accessibility conformance.

# What changed

Ten selected 16:10 mockups apply Harbour Blue to a local non-account Profile
and representative adaptation states. A derived comparison, embedded gallery,
prompt record, manifest and rejected-generation history make the batch
reviewable inside the docs vault.

The round explicitly distinguishes representative pattern references from the
future full matrix across Home, Rooms, conversations, outcome modules,
supporting destinations, confirmation/recovery and onboarding.

# Evidence

- Every selected 1586 × 992 PNG and the 1632 × 3065 comparison was inspected
  for copy, crop, style, private data, watermark and material mismatch.
- Two failures were corrected: an unwanted device bezel on 200% Home and an
  invented October 2024 label on the reading-order sheet.
- All selected fixtures are fictional. Profile explicitly denies online/public
  account semantics.
- Manifest JSON parsing and `git diff --check` passed.
- `python3 scripts/cockpit.py --write` refreshed the derived snapshot;
  `python3 scripts/cockpit.py --check` passed with 87 session records, 13
  Canvas nodes / five edges and three Base views / embeds.
- `python3 scripts/validate-docs.py` checked 253 Markdown files and 3,070 local
  links. It reported only the two pre-existing untracked personal notes,
  `docs/Notes.md` and `docs/To do table features.md`, which lack frontmatter;
  this session did not modify them.
- `python3 scripts/check_handoff.py --base origin/main` remained non-green
  because the dirty primary checkout also contains unrelated untracked
  `.claude`, `.playwright-mcp`, Context Room asset/mockup and personal-note
  paths. This session preserved and did not claim those paths.
- An `obsidian <README path>` open attempt reported that Obsidian's command-line
  interface is disabled. Private vault settings were not changed; the local
  embeds remain available through the normal vault navigation.
- Android dp/sp, real scaling/reflow, IME insets, keyboard traversal, reduced
  motion, permission reads, TalkBack, switch access and comprehension remain
  unrun.

# Handoff

Simon should review whether Profile earns a separate route and whether these
nine adaptation patterns still feel like the same product. Canonical changes,
an implementation metaprompt and exhaustive per-surface variants wait for that
feedback.
