// Token resolution shared by the CSS generator and the contrast validator.
// Fails closed: an unresolved alias, a cycle, or a raw hex in the component
// layer is an error, never a warning.

import { readFileSync } from 'node:fs';

const ALIAS = /^\{([^}]+)\}$/;
const RAW_HEX = /^#[0-9a-fA-F]{3,8}$/;

export function loadTokens(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/**
 * Resolve one alias chain against primitives and (optionally) already-resolved
 * semantic values. Throws on an unresolved reference or a cycle.
 */
function follow(ref, tokens, theme, seen) {
  if (seen.includes(ref)) {
    throw new Error(`token cycle: ${[...seen, ref].join(' -> ')}`);
  }
  const prim = tokens.primitive[ref];
  if (prim) return prim.value;

  const sem = tokens.semantic[ref];
  if (sem) {
    const raw = sem.themes ? sem.themes[theme] : sem.value;
    if (raw === undefined) {
      throw new Error(`semantic token "${ref}" has no value for theme "${theme}"`);
    }
    const m = typeof raw === 'string' && raw.match(ALIAS);
    return m ? follow(m[1], tokens, theme, [...seen, ref]) : raw;
  }

  throw new Error(`unresolved token reference "{${ref}}" (theme ${theme})`);
}

export function resolveValue(raw, tokens, theme, origin) {
  if (typeof raw !== 'string') return raw;
  const m = raw.match(ALIAS);
  if (!m) {
    // A literal that is not an alias. Allowed in primitives and in semantic
    // literals (font stacks, easing curves, plain numbers) but never in the
    // component layer.
    if (origin === 'component' && RAW_HEX.test(raw)) {
      throw new Error(`raw hex "${raw}" in component layer — component tokens must reference a semantic role`);
    }
    return raw;
  }
  return follow(m[1], tokens, theme, [origin]);
}

/** Resolve every semantic + component token for one theme. */
export function resolveTheme(tokens, theme) {
  const semantic = {};
  for (const [name, def] of Object.entries(tokens.semantic)) {
    if (name.startsWith('$')) continue;
    const raw = def.themes ? def.themes[theme] : def.value;
    if (raw === undefined) {
      throw new Error(`semantic token "${name}" has no value for theme "${theme}"`);
    }
    semantic[name] = { ...def, resolved: resolveValue(raw, tokens, theme, name) };
  }

  const component = {};
  for (const [name, raw] of Object.entries(tokens.component)) {
    if (name.startsWith('$')) continue;
    component[name] = { resolved: resolveValue(raw, tokens, theme, 'component'), ref: raw };
  }

  return { theme, semantic, component };
}

export function themes(tokens) {
  return [tokens.meta.workingTheme, tokens.meta.challengerTheme];
}
