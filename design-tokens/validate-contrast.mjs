#!/usr/bin/env node
// Measures every foreground/background pair the components actually use, in
// both themes, against Granny's internal targets (accessibility.md A11Y-02).
//
// Newly generated states (hover, pressed, selected, disabled, surfaces,
// borders) are measured here directly. No value inherits a contrast result
// from the brand document.
//
//   node design-tokens/validate-contrast.mjs            # human report, exit 1 on failure
//   node design-tokens/validate-contrast.mjs --json     # machine record

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTokens, resolveTheme, themes } from './lib/resolve.mjs';
import { contrast, composite, round2 } from './lib/contrast.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const tokens = loadTokens(join(here, 'tokens.json'));
const T = tokens.contrastTargets;

// kind -> target. "essential" covers every action label and status word.
const TARGET = {
  essential: T.essentialText,
  supporting: T.supportingText,
  boundary: T.essentialBoundaryOrFocus,
};

/**
 * Pairs are declared as [foregroundRole, backgroundRole, kind, where].
 * "where" names the actual component surface the pair occurs on, so a failure
 * points at something real rather than an abstract combination.
 */
const PAIRS = [
  // --- essential text: body, headings, action labels, status words ---
  ['text.primary', 'surface.canvas', 'essential', 'body text on the screen background'],
  ['text.primary', 'surface.panel', 'essential', 'body text on a content panel'],
  ['text.primary', 'surface.selected', 'essential', 'ChoiceRow label when selected'],
  ['text.primary', 'surface.pressed', 'essential', 'SecondaryButton label while pressed'],
  ['text.on-primary', 'action.primary', 'essential', 'PrimaryButton and Stop label'],
  ['text.on-primary', 'action.primary.hover', 'essential', 'PrimaryButton label, hovered'],
  ['text.on-primary', 'action.primary.pressed', 'essential', 'PrimaryButton label, pressed'],
  ['text.on-danger', 'status.danger', 'essential', 'Delete action label'],
  ['text.on-accent', 'accent.decorative', 'essential', 'any text placed on the decorative accent'],
  ['action.secondary', 'surface.panel', 'essential', 'SecondaryButton label on a panel'],
  ['action.secondary', 'surface.canvas', 'essential', 'SecondaryButton label on the canvas'],
  // Pressed secondary inverts rather than tinting: the tinted alternative
  // measured 5.93:1 (open-day) and did not clear the essential target.
  ['text.on-primary', 'action.secondary', 'essential', 'SecondaryButton label while pressed (inverted fill)'],
  ['status.success', 'surface.panel', 'essential', 'success status word beside its rule'],
  ['status.warning', 'surface.panel', 'essential', 'warning / unknown status word beside its rule'],
  ['status.danger', 'surface.panel', 'essential', 'deletion status word beside its rule'],
  ['text.primary', 'surface.disabled', 'essential', 'heading adjacent to a disabled control'],

  // --- supporting text: metadata, secondary detail, disabled explanations ---
  ['text.secondary', 'surface.panel', 'supporting', 'preview metadata on a panel'],
  ['text.secondary', 'surface.canvas', 'supporting', 'supporting text on the canvas'],
  ['text.secondary', 'surface.selected', 'supporting', 'differentiator text on a selected row'],
  // The reason a control is disabled is NOT rendered in text.disabled. It sits
  // in the same region at full supporting contrast. This pair is the one that
  // matters for A11Y-02's "disabled essential explanation retains contrast".
  ['text.secondary', 'surface.disabled', 'supporting', 'disabled reason text beside the control'],
  ['text.disabled', 'surface.disabled', 'supporting', 'label of the disabled control itself'],
  // A disabled switch keeps its On/Off word on the panel, not on a fill.
  ['text.disabled', 'surface.panel', 'supporting', 'On/Off word of a disabled switch'],
  ['text.disabled', 'surface.canvas', 'supporting', 'On/Off word of a disabled switch on the canvas'],

  // --- essential boundaries and focus ---
  ['border.control', 'surface.panel', 'boundary', 'TextField / SecondaryButton outline on a panel'],
  ['border.control', 'surface.canvas', 'boundary', 'control outline on the canvas'],
  ['focus.ring', 'surface.panel', 'boundary', 'focus ring against a panel'],
  ['focus.ring', 'surface.canvas', 'boundary', 'focus ring against the canvas'],
  ['focus.ring', 'focus.separation', 'boundary', 'focus ring against its own separation gap'],
  ['focus.separation', 'action.primary', 'boundary', 'separation gap against a dark primary button'],
  ['action.primary', 'surface.panel', 'boundary', 'filled primary button edge against a panel'],
  ['action.primary', 'surface.canvas', 'boundary', 'filled primary button edge against the canvas'],
  ['status.danger', 'surface.panel', 'boundary', 'filled delete button edge against a panel'],
  // A disabled control and a selected row are located by their outline, not by
  // their fill — "state never depends on colour alone" means the fill is never
  // load-bearing, so the outline is what has to clear 3:1.
  ['border.disabled', 'surface.panel', 'boundary', 'disabled control outline against a panel'],
  ['border.disabled', 'surface.disabled', 'boundary', 'disabled control outline against its own fill'],
  ['border.selected', 'surface.panel', 'boundary', 'selected row outline against an unselected row'],
  ['border.selected', 'surface.selected', 'boundary', 'selected row outline against its own fill'],
  ['status.success', 'surface.panel', 'boundary', 'Outcome status rule against the panel'],
  ['status.warning', 'surface.panel', 'boundary', 'Outcome unknown rule against the panel'],
];

/**
 * Deltas recorded for information only. These surfaces are never the sole
 * carrier of a state, so they are not held to the boundary target — but the
 * numbers are reported so a reviewer can see exactly how faint they are.
 */
const ADVISORY_PAIRS = [
  ['surface.disabled', 'surface.panel', 'boundary', 'disabled fill against a panel (fill is not the state signal)'],
  ['surface.selected', 'surface.panel', 'boundary', 'selected fill against an unselected row (fill is not the state signal)'],
  ['surface.pressed', 'surface.panel', 'boundary', 'pressed row fill against a panel (transient feedback)'],
  ['surface.canvas', 'surface.panel', 'boundary', 'canvas against a panel (grouping is by spacing and rules)'],
  // The accent is decorative punctuation. It is exempt from the boundary
  // target because it is never a control edge, a status colour or a fill —
  // the accent policy check below enforces that structurally.
  ['accent.decorative', 'surface.canvas', 'boundary', 'decorative accent edge against the canvas (decorative-only, exempt)'],
];

/**
 * Composites. The system uses no alpha for state, deliberately — these
 * measurements are the evidence for that choice rather than a claim inherited
 * from the opaque values.
 */
const COMPOSITES = [
  {
    label: 'disabled label at 38% opacity (the common Material pattern we do NOT use)',
    fg: 'text.primary',
    over: 'surface.panel',
    alpha: 0.38,
    against: 'surface.panel',
    kind: 'supporting',
    note: 'Measured to show why disabled state uses explicit text.disabled / surface.disabled tokens instead of opacity.',
    advisory: true,
  },
  {
    label: 'secondary label at 60% opacity over a panel',
    fg: 'action.secondary',
    over: 'surface.panel',
    alpha: 0.6,
    against: 'surface.panel',
    kind: 'essential',
    note: 'Same reason. Opacity is never applied to an action label in this system.',
    advisory: true,
  },
  {
    label: 'focus ring over the selected-row fill',
    fg: 'focus.ring',
    over: 'surface.selected',
    alpha: 1,
    against: 'surface.selected',
    kind: 'boundary',
    note: 'A focused row that is also selected — a real composite surface in CMP-005.',
    advisory: false,
  },
  {
    label: 'selected-row label over the selected fill, over the panel',
    fg: 'surface.selected',
    over: 'surface.panel',
    alpha: 1,
    against: 'text.primary',
    kind: 'essential',
    note: 'CMP-005 stacks a tinted row on a panel; the label is measured against the flattened result, not against the panel.',
    advisory: false,
  },
  {
    label: 'disabled label over the disabled fill, over the panel',
    fg: 'surface.disabled',
    over: 'surface.panel',
    alpha: 1,
    against: 'text.disabled',
    kind: 'supporting',
    note: 'CMP-007 disabled control composited onto a panel.',
    advisory: false,
  },
];

const results = [];
let failures = 0;

for (const theme of themes(tokens)) {
  const r = resolveTheme(tokens, theme);
  const v = (name) => {
    const t = r.semantic[name];
    if (!t) throw new Error(`no semantic token "${name}"`);
    return t.resolved;
  };
  const status = (name) => r.semantic[name].status;

  for (const [fg, bg, kind, where] of PAIRS) {
    const ratio = contrast(v(fg), v(bg));
    const target = TARGET[kind];
    const pass = ratio >= target;
    // A pair is "newly generated" if either side is a value this build
    // proposed rather than one the brand document already carried.
    const generated = status(fg) === 'proposed-new' || status(bg) === 'proposed-new';
    if (!pass) failures++;
    results.push({
      theme, fg, bg, kind, where, target,
      fgValue: v(fg), bgValue: v(bg),
      ratio: round2(ratio), pass, generated, advisory: false,
    });
  }

  for (const [fg, bg, kind, where] of ADVISORY_PAIRS) {
    const ratio = contrast(v(fg), v(bg));
    results.push({
      theme, fg, bg, kind, where, target: TARGET[kind],
      fgValue: v(fg), bgValue: v(bg),
      ratio: round2(ratio), pass: ratio >= TARGET[kind], generated: true, advisory: true,
      note: 'Informational. This surface never carries a state on its own.',
    });
  }

  for (const c of COMPOSITES) {
    const flat = composite(v(c.fg), v(c.over), c.alpha);
    const ratio = contrast(flat, v(c.against));
    const target = TARGET[c.kind];
    const pass = ratio >= target;
    if (!pass && !c.advisory) failures++;
    results.push({
      theme, fg: `${c.fg} @ ${c.alpha} over ${c.over}`, bg: c.against,
      kind: c.kind, where: c.label, target,
      fgValue: flat, bgValue: v(c.against),
      ratio: round2(ratio), pass, generated: true, advisory: c.advisory, note: c.note,
    });
  }
}

// --- accent policy check -----------------------------------------------
// "Yellow is an accent, not a generic warning background or default action
// fill." Enforced structurally, not just in prose.
const policyErrors = [];
for (const theme of themes(tokens)) {
  const r = resolveTheme(tokens, theme);
  const accent = r.semantic['accent.decorative'].resolved;
  for (const [name, def] of Object.entries(r.component)) {
    const isFill = /background|surface|track\.on/.test(name);
    if (isFill && def.resolved === accent) {
      policyErrors.push(`${theme}: component token "${name}" fills with accent.decorative (${accent})`);
    }
  }
  for (const [name, def] of Object.entries(r.semantic)) {
    if (name === 'accent.decorative') continue;
    if (/^surface\.|^status\./.test(name) && def.resolved === accent) {
      policyErrors.push(`${theme}: semantic role "${name}" resolves to the decorative accent (${accent})`);
    }
  }
}

const json = {
  generated: new Date().toISOString().slice(0, 10),
  method:
    'sRGB relative luminance; linearize at 0.04045; weights 0.2126/0.7152/0.0722; (Llighter+0.05)/(Ldarker+0.05). Arithmetic on opaque pairs and explicitly flattened composites. NOT a device or user accessibility test.',
  targets: T,
  tokenVersion: tokens.meta.version,
  results,
  policyErrors,
  summary: {
    pairs: results.length,
    failures,
    generatedPairsMeasured: results.filter((x) => x.generated && !x.advisory).length,
  },
};

if (process.argv.includes('--json')) {
  const out = join(here, 'build');
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'contrast-report.json'), JSON.stringify(json, null, 2) + '\n');
  console.log(`wrote ${join(out, 'contrast-report.json')}`);

  // The colour foundation sheet renders these measured numbers directly, so
  // the specimen can never show a ratio that was not actually computed.
  const ts = join(here, '..', 'design-system', 'src', 'generated', 'contrast.ts');
  mkdirSync(dirname(ts), { recursive: true });
  writeFileSync(
    ts,
    `// GENERATED by design-tokens/validate-contrast.mjs — do not edit.\n` +
      `export const CONTRAST_REPORT = ${JSON.stringify(json, null, 2)} as const;\n`,
  );
  console.log(`wrote ${ts}`);
} else {
  for (const theme of themes(tokens)) {
    console.log(`\n=== ${theme} ===`);
    for (const x of results.filter((r) => r.theme === theme)) {
      const mark = x.pass ? 'PASS' : x.advisory ? 'note' : 'FAIL';
      const tag = x.advisory ? ' [advisory]' : x.generated ? ' [generated]' : '';
      console.log(
        `${mark.padEnd(4)} ${String(x.ratio).padStart(6)}:1  >=${x.target}  ${x.fg} on ${x.bg}${tag}\n       ${x.where}`,
      );
    }
  }
}

if (policyErrors.length) {
  console.error('\nAccent policy violations:');
  for (const e of policyErrors) console.error('  - ' + e);
}

console.log(
  `\n${json.summary.pairs} pairs measured, ${json.summary.generatedPairsMeasured} of them newly generated states; ${failures} failure(s).`,
);

if (failures || policyErrors.length) process.exit(1);
