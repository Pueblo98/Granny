# design-sync notes — @granny/design-system

Repo-specific gotchas for future syncs. Read this before re-running anything.

## Layout of this repo

- The design system package is `design-system/`, **not** the repo root. The
  converter therefore needs `--node-modules design-system/node_modules` and
  `--entry ./design-system/dist/index.js`.
- `.design-sync/` and `.ds-sync/` sit at the **repo root**, one level above the
  package. `cssEntry`, `docsDir`, `guidelinesGlob` and `extraFonts` in
  `config.json` are all package-relative.
- The token source of truth is `design-tokens/tokens.json` at the repo root.
  `design-system/src/styles/tokens.css` and `design-system/src/generated/*.ts`
  are **generated** — never hand-edit them; edit the JSON and re-run
  `node design-tokens/build-tokens.mjs`.

## Build order (all of it is in `npm --prefix design-system run build`)

1. `design-tokens/build-tokens.mjs` — token JSON → `tokens.css` + generated TS
2. `design-system/build.mjs` — esbuild → `dist/index.js`, concatenates the
   stylesheet, and **copies the .ttf files beside `dist/index.css`** (the
   `@font-face` rules use `url("./<file>.ttf")`, resolved relative to the
   stylesheet)
3. `tsc` — emits the `.d.ts` tree the converter reads for prop extraction

## Chromium

There is no `~/.cache/ms-playwright` browser on this machine and none was
installed. The system binary is used instead:

```sh
DS_CHROMIUM_PATH=/usr/bin/chromium node .ds-sync/package-validate.mjs ./ds-bundle
```

Both `package-validate.mjs` and `package-capture.mjs` honour `DS_CHROMIUM_PATH`.
Only the `playwright` npm package is installed in `.ds-sync/`, not its browsers.

## Gotchas already paid for

- **esbuild postinstall is gated by npm.** `npm warn install-scripts` appears on
  install; the binary still worked here. If esbuild fails to run after a fresh
  clone, that gate is the first thing to check.
- **The authored previews live outside the package** (`.design-sync/previews/`),
  so node cannot resolve `react` from there. The gallery build passes
  `nodePaths: [design-system/node_modules]`. Anything else that compiles those
  files needs the same.
- **Undefined CSS custom properties fail silently.** A first build shipped 23
  declarations reading `--ds-space-1` … `--ds-space-7`, which the token layer
  never emitted; buttons rendered with no padding and nothing errored. The
  converter's `[TOKENS_MISSING]` caught it. `design-tokens/validate-css-vars.mjs`
  now fails the build on this — run it after any token rename.
- **Colour primitives are deliberately NOT emitted to CSS**, only the dimension
  and duration scale. A colour may only reach a component through a semantic
  role. If a component needs a colour that has no role, add the role.

## Known render warns

None outstanding. Two were resolved rather than recorded:

- `[RENDER_THIN] SpacingFoundation — variants render identically`: the two
  exports genuinely were the same, because the spacing scale does not vary by
  theme. The second export was rewritten to show the scale applied to a
  composition instead. If a future preview trips this, check whether the
  variants are actually meant to differ before recording it as benign.
- `[TOKENS_MISSING]`: a real defect, see above. Never record this one as benign.

## Re-sync risks

- **Font provenance is pinned by SHA-256, not by a lockfile.** The three
  families were fetched from `github.com/google/fonts` `main` on 2026-09-17 and
  their digests recorded in `design-system/fonts/font-inspection.json`. Upstream
  `main` moves. Re-run `node design-system/scripts/inspect-fonts.mjs` after any
  refetch and compare digests before trusting the axis and coverage claims.
- **Atkinson Hyperlegible Next is Latin-only** (362 codepoints, no Cyrillic,
  Arabic, Devanagari or CJK). This is fine for the proposed English prototype
  and is a blocker for any non-Latin locale. Do not let a future sync quietly
  present it as a complete face.
- **The conventions header names ~40 custom properties and 16 classes.** They
  were verified against the built CSS at sync time. Re-validate after any token
  or class rename — a name that stops resolving makes the design agent emit
  silently unstyled output.
- **The contrast report is generated, not hand-written.** Component styles must
  not introduce a colour pair the report does not cover. If you add a semantic
  colour role, add its pairs to `design-tokens/validate-contrast.mjs` — the
  report is the accessibility evidence and a gap in it is an unmeasured claim.
- **Two design decisions came out of measurement and will look arbitrary
  later**: status blocks carry a rule rather than a tinted fill, and a pressed
  secondary button inverts rather than tinting. Both exist because the
  alternatives measured below the 7:1 essential-text target (6.5–6.9:1 and
  5.93:1 respectively). Do not "tidy" them back.
- **Everything is proposed.** No theme, font, radius or motion value is
  accepted by Simon. A future sync must not promote any of it to accepted
  without his explicit decision recorded in the repository.
