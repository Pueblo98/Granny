---
title: "Design system built and synced to Claude Design"
status: proposed
owner: Simon
last_updated: 2026-09-18
tags: [execution, session, design, tokens, brand]
related:
  - ../../02-design/claude-code-design-system-handoff.md
  - ../../02-design/design-system.md
  - ../../02-design/brand-and-visual-identity.md
  - ../../02-design/accessibility.md
  - ../../../design-tokens/README.md
  - ../../09-decisions/ADR-0013-bounded-interface-composition.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Claude Code design-system construction session
branch: feature/design-system-build
base_commit: cc97e484
next_action: Simon reviews the gallery and the synced project, then chooses a territory, a typeface and the OQ-14 Home direction. The app-design session consumes this system; it must not reconstruct the palette or typography.
changed_paths:
  - design-tokens/
  - design-system/
  - .design-sync/
  - docs/02-design/claude-code-design-system-handoff.md
  - docs/02-design/design-system.md
  - docs/10-execution/current-milestone.md
  - .gitignore
---

# Scope and result

Executed the [system-construction brief](../../02-design/claude-code-design-system-handoff.md):
a versioned token source, reusable React component source, authored specimens,
a runnable local gallery, a source-linked brand guide, and an import into
Claude Design via `/design-sync`.

**Everything produced is proposed.** No territory, typeface, radius, motion
value or icon is accepted. No app screen was designed, no Home composition was
fixed, no Android code was written and Figma was not used.

## What exists now

| Deliverable | Path |
|---|---|
| Token source of truth | `design-tokens/tokens.json` (49 semantic roles, 43 component references, 2 themes) |
| Token generator and Android mapping | `design-tokens/build-tokens.mjs` → `design-system/src/styles/tokens.css`, `design-tokens/build/` |
| Contrast measurement | `design-tokens/validate-contrast.mjs` → `build/contrast-report.json` |
| CSS custom-property guard | `design-tokens/validate-css-vars.mjs` |
| Review verdicts | `design-tokens/review-grades.mjs` (87 cells, with per-cell notes) |
| React package | `design-system/` — 28 components, `@granny/design-system@0.1.0` |
| Composition registry | `design-system/src/registry.ts` (ADR-0013, with a fail-closed validator) |
| Authored specimens | `.design-sync/previews/*.tsx` — 28 files, 87 cells |
| Local gallery | `design-system/gallery/` |
| Browser checks | `design-system/scripts/check-specimens.mjs` → `build/specimen-checks.json` |
| Brand guide | `design-system/docs/guides/brand-guide.md` |
| Per-component usage docs | `design-system/docs/*.md` (28) |
| Conventions header for the design agent | `.design-sync/conventions.md` |
| Sync inputs and gotchas | `.design-sync/config.json`, `.design-sync/NOTES.md` |

Run the gallery:

```sh
npm --prefix design-system install
npm --prefix design-system run build
node design-system/scripts/build-gallery.mjs
node design-system/scripts/serve-gallery.mjs     # http://127.0.0.1:5177/
```

It has controls for theme, in-app text scale, simulated system text size,
viewport width and reduced motion.

## Theme and typography

Open Day is the **proposed working baseline**, following the brand document's
recommendation; Bright Signal is rendered as a challenger on identical
specimens. Living Pages and Everyday Spark remain documented alternatives and
were deliberately not blended in. Role names are identical across themes, so
swapping territory edits no component. **Dark mode is recorded as out of scope
for v1** and is not derived.

Three OFL families are bundled, so there is no remote font dependency.
Verified from the binaries rather than their metadata
(`design-system/fonts/font-inspection.json`):

| Family | Weight axis | Codepoints | Coverage |
|---|---|---|---|
| Atkinson Hyperlegible Next | 200–800 | 362 | **Latin only** — no Cyrillic, Greek, Arabic, Devanagari or CJK |
| Manrope | 200–800 | 678 | Latin, partial Greek and Cyrillic |
| Source Sans 3 | 200–900 | 1615 | Latin, partial Greek and Cyrillic |

Atkinson's Latin-only coverage is a real constraint on the working theme: any
non-Latin locale falls back to platform Noto faces with different metrics.
Locale and market selection must precede any language promise.

## Measured evidence

**Contrast — 96 pairs across both themes, 0 failures.** 44 of them are states
this build proposed (hover, pressed, selected, disabled, borders, focus
separation) and were measured directly; none inherited a result from the brand
document. Flattened composites are included. sRGB arithmetic only — not a
device or user test.

Two design decisions came out of measurement rather than preceding it, and
both are recorded so they are not later "tidied" away:

- **Status blocks carry a coloured rule, not a tinted fill.** Every tint dark
  enough to read as a block pushed the status word below the 7:1 essential
  target (measured 6.48–6.92:1). On the panel the words hold 7.6–8.6:1.
- **A pressed secondary button inverts rather than tinting.** The tinted
  alternative measured 5.93:1 for the label.

**Browser checks — 30 checks, 0 failures**
(`design-tokens/build/specimen-checks.json`). Computed geometry and colour in
Chromium: the 56dp floor and 64dp primary/Stop minimum, 12dp target
separation, focus ring 3px with 2px separation and no clipping ancestor,
keyboard reachability of 163 controls, Stop never disabled across 7 instances,
no Enter-to-send, no autofocused approval, switch state in words, and reflow
with no horizontal overflow or clipped label at 360/840 widths, 200% system
text, 200%+1.5 combined, and 300%+1.5 at 360 width.

**Render check — 28/28 previews render cleanly**, 0 bad, 0 thin, 0 identical
variants, 0 floor cards. All 87 cells were graded from per-cell screenshots.

## Defects found and fixed during the build

Recorded because each was caught by a check or by looking, not by intent:

1. **23 CSS declarations read undefined custom properties.** `--ds-space-1`…`7`
   were referenced by component styles but never emitted, so button padding
   and several gaps silently resolved to nothing. Caught by the converter's
   `[TOKENS_MISSING]`. `design-tokens/validate-css-vars.mjs` now fails the
   build on this class of bug.
2. **An exact preview collapsed to one character per line** at the largest
   text scale, because its facts used a two-column grid whose label column
   took `max-content`. Facts now stack. A width check was added.
3. **A disabled text field and a disabled switch rendered identically to their
   enabled states** — the only difference was that they did not respond. Found
   by reading the review sheets, not by any automated check. Both now have
   explicit disabled treatment with measured contrast.
4. Horizontal overflow at extreme text scales in five places (nested theme
   roots double-applying the screen inset, non-shrinkable flex children,
   a grid column with a hard minimum).

## Sync record

| Field | Value |
|---|---|
| Destination | Claude Design project **Granny Design System (proposed)** |
| Project id | `4148cba1-baa4-4241-b893-6c54188897ff` |
| URL | https://claude.ai/design/p/4148cba1-baa4-4241-b893-6c54188897ff |
| Source commit | `cc97e484` (worktree `feature/design-system-build`) |
| Package | `@granny/design-system@0.1.0`, global `GrannyDS` |
| Files uploaded | 154 (112 component files, 28 previews, 4 fonts, 2 guidelines, 2 vendor, 6 root) |
| Validator | `package-validate.mjs` exited clean, no warnings |

A **new** project was created. The three pre-existing projects on the account
(`Lumora Design System` and two named `Design System`) were not read, written
or modified. No organisation-wide default or publication setting was changed.

Verified by reading files back from the destination, not from write counts:
`styles.css` resolves its import closure; `fonts/fonts.css` carries three
`@font-face` rules whose URLs resolve to the uploaded `.ttf` files;
`ConsequencePreview.d.ts` carries the full props contract including the
prohibition documentation; all 28 preview cards carry their `@dsCard`
registration marker across 8 groups.

## Explicit gaps

- **Nothing is accepted.** Territory, typeface, radii, motion, icons and
  component anatomy are all proposed and await Simon's decision.
- **Dark mode does not exist** and is not derivable by inversion.
- **Android conformance is unverified.** CSS pixels are not dp or sp. The
  `design-tokens/build/android-mapping.md` table is a naming proposal; no
  Android resource or Compose code exists.
- **Unrun:** TalkBack, switch access, physical dexterity, native font and IME
  behaviour, any physical tablet, and any participant study. Browser evidence
  is reported separately above and is not an accessibility-conformance claim.
- **Home and OQ-14 remain open.** This system fixes no Home composition and
  does not decide persistence.
- **Font provenance is pinned by SHA-256, not a lockfile.** Upstream
  `google/fonts` `main` moves; re-verify digests after any refetch.
- ADR-0012 memory/adaptation stays out of MVP; specimen annotations keep the
  MVP and App V1 distinction.

## Authority used

Simon authorised, in this session: npm dependency installation (gitignored),
fetching the three OFL font families from upstream, and the Claude Design
sync, and ran `/design-login` himself. Dependency installation is a separate
authority boundary under [AGENTS](../../../AGENTS.md); it was requested and
granted before anything was installed.
