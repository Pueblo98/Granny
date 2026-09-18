#!/usr/bin/env node
/**
 * Every --ds-* custom property a stylesheet READS must be DEFINED by the
 * generated token layer.
 *
 * This exists because an undefined custom property fails silently: the
 * declaration is simply dropped and the element falls back to its initial
 * value, so a button with `padding: var(--ds-space-3)` renders with no padding
 * and nothing complains. A first build of this system shipped exactly that bug
 * across 23 declarations.
 *
 *   node design-tokens/validate-css-vars.mjs
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const styles = join(here, '..', 'design-system', 'src', 'styles');

const tokensCss = readFileSync(join(styles, 'tokens.css'), 'utf8');
const consumers = ['base.css', 'components.css'].map((f) => ({
  file: f,
  css: readFileSync(join(styles, f), 'utf8'),
}));

// Definitions: `--ds-foo: value;` at the start of a declaration.
const defined = new Set([...tokensCss.matchAll(/^\s*(--ds-[\w-]+)\s*:/gm)].map((m) => m[1]));

// Properties a component sets at runtime through an inline style, which are
// legitimately absent from the stylesheet.
const RUNTIME_DEFINED = new Set(['--ds-text-scale']);

const missing = [];
for (const { file, css } of consumers) {
  for (const m of css.matchAll(/var\((\s*--ds-[\w-]+)/g)) {
    const name = m[1].trim();
    if (defined.has(name) || RUNTIME_DEFINED.has(name)) continue;
    const line = css.slice(0, m.index).split('\n').length;
    missing.push({ file, line, name });
  }
}

// Also flag a token that is defined but read by nothing — dead weight in the
// contract, and usually a rename that was only half applied.
const read = new Set();
for (const { css } of consumers) {
  for (const m of css.matchAll(/var\((\s*--ds-[\w-]+)/g)) read.add(m[1].trim());
}
const unused = [...defined].filter((d) => !read.has(d));

if (missing.length) {
  console.error(`${missing.length} undefined custom propert${missing.length === 1 ? 'y' : 'ies'} read by component styles:`);
  const seen = new Set();
  for (const m of missing) {
    if (seen.has(m.name)) continue;
    seen.add(m.name);
    console.error(`  ${m.name}  first read at ${m.file}:${m.line}`);
  }
  console.error('\nDefine it in design-tokens/tokens.json and re-run build-tokens.mjs.');
  process.exit(1);
}

console.log(`${read.size} custom properties read, all defined.`);
console.log(`${defined.size} defined in the token layer; ${unused.length} not read by any component style.`);
if (unused.length) {
  // Not an error: the token layer is also a published contract, and a role can
  // exist for consumers outside this stylesheet.
  console.log(`  unused: ${unused.slice(0, 12).join(', ')}${unused.length > 12 ? ` (+${unused.length - 12})` : ''}`);
}
