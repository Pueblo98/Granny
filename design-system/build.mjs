// Bundles the component source into dist/ and concatenates the stylesheet.
// The token CSS is generated first by design-tokens/build-tokens.mjs, so no
// colour, size or duration can enter here except through the token source.
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, 'dist');
mkdirSync(dist, { recursive: true });

await esbuild.build({
  entryPoints: [join(here, 'src', 'index.ts')],
  bundle: true,
  format: 'esm',
  target: 'es2020',
  jsx: 'automatic',
  outfile: join(dist, 'index.js'),
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  loader: { '.css': 'empty' },
  logLevel: 'info',
});

// One stylesheet: fonts, then tokens, then component styles. Order matters —
// component rules read the custom properties the token layer defines.
const parts = [
  'fonts/fonts.css',
  'src/styles/tokens.css',
  'src/styles/base.css',
  'src/styles/components.css',
];
const css = parts
  .map((p) => `/* ---- ${p} ---- */\n` + readFileSync(join(here, p), 'utf8'))
  .join('\n\n');
writeFileSync(join(dist, 'index.css'), css);
console.log(`wrote dist/index.css (${css.length} bytes from ${parts.length} sources)`);

// The @font-face rules use `url("./<file>.ttf")`, which resolves relative to
// the stylesheet. Copying the faces beside it keeps the built dist
// self-contained — no remote font dependency, at any consumer.
let copied = 0;
for (const f of readdirSync(join(here, 'fonts'))) {
  if (f.endsWith('.ttf')) {
    copyFileSync(join(here, 'fonts', f), join(dist, f));
    copied++;
  }
}
console.log(`copied ${copied} font files beside dist/index.css`);
