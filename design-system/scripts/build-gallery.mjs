// Bundles the local specimen gallery. React is bundled in (the gallery is a
// standalone review page), and `@granny/design-system` resolves to the built
// dist so the gallery exercises the same artefact the sync uploads.
import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..');
const out = join(pkg, 'gallery', 'build');
mkdirSync(out, { recursive: true });

await esbuild.build({
  entryPoints: [join(pkg, 'gallery', 'gallery.tsx')],
  bundle: true,
  format: 'esm',
  target: 'es2020',
  jsx: 'automatic',
  outfile: join(out, 'gallery.js'),
  alias: { '@granny/design-system': join(pkg, 'dist', 'index.js') },
  // The authored previews live at the repo root, outside this package, so
  // node's own resolution cannot find react from there. Same reason the
  // converter is given an explicit --node-modules.
  nodePaths: [join(pkg, 'node_modules')],
  logLevel: 'info',
});

copyFileSync(join(pkg, 'gallery', 'index.html'), join(out, 'index.html'));
// dist/ is copied wholesale so the stylesheet keeps its font files as
// siblings, exactly as a consumer would receive them.
cpSync(join(pkg, 'dist'), join(out, 'dist'), { recursive: true });
console.log(`gallery built at ${out}`);
