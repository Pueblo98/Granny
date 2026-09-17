---
title: "UI/UX skill setup and upstream provenance"
status: proposed
owner: Simon
last_updated: 2026-09-17
tags: [execution, skills, design, android]
related:
  - operating-workflows.md
  - backlog.md
  - ../02-design/conversation-first-plan.md
  - ../../.agents/skills/granny-ui-craft/SKILL.md
---

# UI/UX skill setup

## Installed project-local package

T-118 adds four discoverable skills under `.agents/skills/`. They are repository tooling, not product behavior, dependencies or evidence.

| Skill | Intended use now | Boundary |
|---|---|---|
| [granny-ui-craft](../../.agents/skills/granny-ui-craft/SKILL.md) | Shape, vary, distill, critique and harden the conversation-first browser design | Canonical J/SCR/CMP/accessibility/voice/safety owners win; no implementation or acceptance follows |
| [adaptive](../../.agents/skills/adaptive/SKILL.md) | Later review/implementation of an existing authorized Compose surface across window sizes and inputs | No Android scaffold, Navigation migration, experimental API or dependency choice is authorized by installation |
| [edge-to-edge](../../.agents/skills/edge-to-edge/SKILL.md) | Later Compose system-bar, navigation-bar and IME inset work | Requires an actual project/task/SDK; no manifest or SDK mutation from a review request |
| [testing-setup](../../.agents/skills/testing-setup/SKILL.md) | Later read-only test-stack assessment or explicitly authorized Android test infrastructure | No dependency/framework install or device evidence claim without the owning task and DoR |

Use [granny-design-handoff](../../.agents/skills/granny-design-handoff/SKILL.md) first for product-specific frame/state/accessibility authority. `granny-ui-craft` supplies the anti-repetition and critique layer. The three Android skills remain dormant until an actual native Compose task matches their narrow descriptions.

## Upstream review and provenance

Sources were downloaded to a temporary inspection directory before admission. Only the files listed below entered the repository; no installer, hook, global configuration or private state was added.

| Source reviewed | Pinned upstream HEAD | Admission decision |
|---|---|---|
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `2149fcce39a90bb409df5f16515f316a76dc6199` | Not installed verbatim. Its shape/distill/clarify/adapt/critique concepts informed the original, smaller `granny-ui-craft`; launcher, downloaded binary path, hook, browser bundle, subagent requirement and `PRODUCT.md`/`DESIGN.md` store were excluded. Upstream is Apache-2.0. |
| [RubenGlez/mobile-design](https://github.com/RubenGlez/mobile-design) | `97474ed9b969d0c7f8a2acf712e30eeb0b9078d1` | Not installed verbatim. Its Android/accessibility/adaptivity review concerns informed `granny-ui-craft`; React Native/Expo defaults, nested AGENTS/CLAUDE files and extra project documents were excluded. Upstream is MIT. |
| [android/skills](https://github.com/android/skills) | `bac232fd02b0855df9275281a2a7a47643768719` | Vendored `jetpack-compose/adaptive`, `system/edge-to-edge` and `testing/testing-setup` with their referenced documentation and Apache-2.0 license. Local frontmatter, discovery metadata and prominent Granny authority guardrails were added. |

The pinned hashes record reviewed source, not an automatic update channel. Updates require a new change task: fetch a candidate to temporary storage, inspect its instructions/resources/license and diff against the pinned version, preserve Granny guardrails, validate, and record the new SHA. Do not run upstream installers or `--all`; those would add unreviewed skills and possibly host configuration.

## Recommended design sequence

1. Read the current design request, [conversation-first plan](../02-design/conversation-first-plan.md) and selected J/SCR/CMP owners through `granny-design-handoff`.
2. Use `granny-ui-craft` to shape or compare three structurally different directions with behavior/copy/access requirements held constant.
3. Implement only the authorized browser slice, using fictional fixtures and explicit simulation labels.
4. Use `granny-ui-craft` critique/hardening against source plus rendered compact/medium/expanded views; run existing model/browser/document checks.
5. After a separately authorized native project exists, invoke only the applicable official Android skill and verify on the named build/device configuration.

## Validation record

Completed locally on 2026-09-14:

| Check | Result | Limit |
|---|---|---|
| Skill-creator `quick_validate.py` | Exit 0 for `granny-ui-craft`, modified `granny-design-handoff`, `adaptive`, `edge-to-edge` and `testing-setup` | Packaging/frontmatter only |
| `python3 scripts/validate-docs.py` | Exit 0; eight skills and 16 bundled skill references checked with 0 errors | External URLs and skill behavior are not executed |
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | Exit 0; 28 tests passed, including the skill-reference classification regression | Documentation tooling, not product/browser/Android evals |
| `git diff --check` | Exit 0 | Whitespace only |

Skill packaging and documentation validation establish discoverability structure, not fresh-session triggering, design quality, Android compatibility, TalkBack conformance or human comprehension. No product gate changes from this setup.
