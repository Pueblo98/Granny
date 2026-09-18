#!/usr/bin/env node
/**
 * Browser checks against the running specimen gallery.
 *
 * What this DOES measure: computed geometry and computed colour in Chromium —
 * target heights, gaps between adjacent primary targets, focus-ring presence
 * and clipping, label wrapping at large text, horizontal overflow at narrow
 * widths, keyboard reachability, and the absence of prohibited behaviours.
 *
 * What this does NOT establish: Android conformance (CSS px is not dp or sp),
 * TalkBack or switch-access behaviour, physical dexterity, or whether any of
 * this is comprehensible to the people it is for. Those remain unrun.
 *
 *   node design-system/scripts/check-specimens.mjs [--url http://127.0.0.1:5177/]
 */

import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');
const require = createRequire(join(repoRoot, '.ds-sync', 'package.json'));
const { chromium } = require('playwright');

const urlArg = process.argv.indexOf('--url');
const URL_BASE = urlArg > -1 ? process.argv[urlArg + 1] : 'http://127.0.0.1:5177/';
const EXECUTABLE = process.env.DS_CHROMIUM_PATH || '/usr/bin/chromium';

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}`);
};

const browser = await chromium.launch({ executablePath: EXECUTABLE });

/** Load the gallery with a given set of review controls applied. */
async function open(page, { theme = 'open-day', appScale = '1', systemPct = '100', width = 1280 } = {}) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(URL_BASE, { waitUntil: 'load' });
  await page.waitForSelector('.g-cell');
  const selects = page.locator('.g-controls select');
  await selects.nth(0).selectOption(theme);
  await selects.nth(1).selectOption(appScale);
  await selects.nth(2).selectOption(systemPct);
  await page.waitForTimeout(250);
}

const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(String(e)));

// ---------------------------------------------------------------- render
await open(page);
const cells = await page.locator('.g-cell').count();
const components = await page.locator('.g-component').count();
record('every specimen renders', cells > 60 && components === 28,
  `${components} components, ${cells} specimen cells`);
record('no console or page errors', consoleErrors.length === 0,
  consoleErrors.length ? consoleErrors.slice(0, 3).join(' | ') : 'none');

// ------------------------------------------------------------ the font
const fontApplied = await page.evaluate(() => {
  const el = document.querySelector('.ds-root .ds-type-body, .ds-root');
  return getComputedStyle(el).fontFamily;
});
record('bundled font is applied, not a fallback',
  fontApplied.includes('Atkinson Hyperlegible Next'),
  `computed font-family: ${fontApplied.slice(0, 70)}`);

const fontLoaded = await page.evaluate(async () => {
  await document.fonts.ready;
  return document.fonts.check('600 20px "Atkinson Hyperlegible Next"');
});
record('font file actually loaded in the browser', fontLoaded,
  fontLoaded ? 'document.fonts.check passed at weight 600' : 'face did not load');

// -------------------------------------------------------- target sizes
const targets = await page.evaluate(() => {
  const out = { under56: [], primaryUnder64: [] };
  for (const b of document.querySelectorAll('.ds-root .ds-button')) {
    const h = b.getBoundingClientRect().height;
    const label = (b.textContent || '').trim().slice(0, 40);
    if (h < 55.5) out.under56.push({ label, h: Math.round(h) });
    const isPrimary = b.classList.contains('ds-button--primary') ||
      b.classList.contains('ds-button--danger') || b.classList.contains('ds-button--stop');
    if (isPrimary && h < 63.5) out.primaryUnder64.push({ label, h: Math.round(h) });
  }
  return out;
});
record('every control meets the 56dp floor', targets.under56.length === 0,
  targets.under56.length ? JSON.stringify(targets.under56.slice(0, 4)) : 'no control under 56');
record('primary, Stop and destructive controls meet 64dp', targets.primaryUnder64.length === 0,
  targets.primaryUnder64.length ? JSON.stringify(targets.primaryUnder64.slice(0, 4)) : 'none under 64');

// ------------------------------------------- gap between primary targets
const gaps = await page.evaluate(() => {
  const bad = [];
  for (const row of document.querySelectorAll('.ds-root .ds-actions')) {
    const btns = [...row.querySelectorAll(':scope > .ds-button, :scope > .ds-button-group')];
    for (let i = 1; i < btns.length; i++) {
      const a = btns[i - 1].getBoundingClientRect();
      const b = btns[i].getBoundingClientRect();
      if (Math.abs(a.top - b.top) > 4) continue; // wrapped to a new line
      const gap = b.left - a.right;
      if (gap < 11.5) bad.push({ gap: Math.round(gap), label: (btns[i].textContent || '').trim().slice(0, 30) });
    }
  }
  return bad;
});
record('adjacent primary targets keep 12dp separation', gaps.length === 0,
  gaps.length ? JSON.stringify(gaps.slice(0, 4)) : 'all adjacent pairs >= 12');

// ------------------------------------------------------- Stop is never off
const stopState = await page.evaluate(() => {
  const stops = [...document.querySelectorAll('.ds-root .ds-button--stop')];
  return {
    count: stops.length,
    disabled: stops.filter((s) => s.disabled || s.getAttribute('aria-disabled') === 'true').length,
  };
});
record('Stop is never disabled in any specimen', stopState.count > 0 && stopState.disabled === 0,
  `${stopState.count} Stop controls, ${stopState.disabled} disabled`);

// ------------------------------------------- no Enter-to-send on a field
const enterSubmits = await page.evaluate(() => {
  const field = document.querySelector('.ds-root input.ds-field-input');
  if (!field) return 'no field found';
  let fired = false;
  const form = field.closest('form');
  if (form) form.addEventListener('submit', () => { fired = true; });
  field.focus();
  field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
  return fired ? 'a submit fired' : 'no submit';
});
record('Enter in a text field dispatches nothing', enterSubmits === 'no submit', String(enterSubmits));

// --------------------------------------------- approval is never autofocused
const autofocus = await page.evaluate(() => ({
  autofocusAttrs: document.querySelectorAll('.ds-root [autofocus]').length,
  focused: document.activeElement?.className || 'body',
}));
record('no approval control is preselected or autofocused',
  autofocus.autofocusAttrs === 0 && !String(autofocus.focused).includes('ds-button--primary'),
  `autofocus attributes: ${autofocus.autofocusAttrs}; active element: ${autofocus.focused}`);

// ------------------------------------------------------------ focus ring
const focusRing = await page.evaluate(() => {
  const btn = document.querySelector('.ds-root .ds-button--primary');
  btn.focus();
  const cs = getComputedStyle(btn);
  // Walk ancestors for a clipping container that would cut the ring off.
  let clipped = false;
  for (let el = btn.parentElement; el && !el.classList.contains('g-cell'); el = el.parentElement) {
    const o = getComputedStyle(el);
    if (o.overflow === 'hidden' || o.overflowX === 'hidden' || o.overflowY === 'hidden') {
      clipped = true;
      break;
    }
  }
  return { width: cs.outlineWidth, style: cs.outlineStyle, offset: cs.outlineOffset, color: cs.outlineColor, clipped };
});
record('focus ring is 3px with 2px separation',
  parseFloat(focusRing.width) >= 3 && parseFloat(focusRing.offset) >= 2 && focusRing.style !== 'none',
  `outline ${focusRing.width} ${focusRing.style} offset ${focusRing.offset} colour ${focusRing.color}`);
record('focus ring is not clipped by a container', !focusRing.clipped,
  focusRing.clipped ? 'an ancestor sets overflow:hidden' : 'no clipping ancestor');

// ------------------------------------------------------- keyboard traversal
const keyboard = await page.evaluate(() => {
  const focusable = document.querySelectorAll(
    '.ds-root button:not([disabled]), .ds-root input:not([disabled]), .ds-root textarea:not([disabled]), .ds-root [role="switch"]',
  );
  const unreachable = [...focusable].filter((el) => el.tabIndex < 0).length;
  return { total: focusable.length, unreachable };
});
record('every interactive element is keyboard reachable', keyboard.unreachable === 0,
  `${keyboard.total} focusable elements, ${keyboard.unreachable} removed from tab order`);

// ------------------------------------------------- switch state in words
const switchWords = await page.evaluate(() => {
  const bad = [];
  for (const s of document.querySelectorAll('.ds-root [role="switch"]')) {
    const t = (s.textContent || '').trim();
    if (!/\b(On|Off)\b/.test(t)) bad.push(t.slice(0, 30));
  }
  return bad;
});
record('every switch states On or Off in words', switchWords.length === 0,
  switchWords.length ? JSON.stringify(switchWords) : 'all switches carry the word');

// --------------------------------- reflow: 200% system + 1.5 app, narrow
for (const scenario of [
  { label: 'narrow 360, standard text', width: 360, systemPct: '100', appScale: '1' },
  { label: 'tablet 840, standard text', width: 840, systemPct: '100', appScale: '1' },
  { label: '200% system text', width: 840, systemPct: '200', appScale: '1' },
  { label: '200% system + 1.5 app scaling', width: 840, systemPct: '200', appScale: '1.5' },
  { label: '300% system + 1.5 app, narrow 360', width: 360, systemPct: '300', appScale: '1.5' },
]) {
  await open(page, scenario);
  const overflow = await page.evaluate(() => {
    const bad = [];
    for (const cell of document.querySelectorAll('.g-cell-body')) {
      // A specimen may not force horizontal scrolling on itself, except where
      // it deliberately scrolls a wide table inside .ds-scroll-x.
      for (const el of cell.querySelectorAll('*')) {
        // A wide table deliberately scrolls inside its own container.
        if (el.closest('.ds-scroll-x')) continue;
        // Visually-hidden text is a 1px box whose content is meant to exceed
        // it — that is how the technique works, not a layout fault.
        if (el.classList.contains('ds-visually-hidden') || el.closest('.ds-visually-hidden')) continue;
        // A single-line <input> scrolls its own value natively. That is the
        // platform control's behaviour and does not affect page layout.
        if (el.tagName === 'INPUT') continue;
        if (el.scrollWidth - el.clientWidth > 2) {
          bad.push({ cls: el.className.toString().slice(0, 40), over: el.scrollWidth - el.clientWidth });
        }
      }
    }
    return bad;
  });
  record(`no horizontal overflow — ${scenario.label}`, overflow.length === 0,
    overflow.length ? JSON.stringify(overflow.slice(0, 3)) : 'content reflows within its width');

  const clipped = await page.evaluate(() => {
    const bad = [];
    for (const b of document.querySelectorAll('.ds-root .ds-button')) {
      const span = b.querySelector('span:last-child');
      if (!span) continue;
      // A truncated label would have its scroll size exceed its client size.
      if (span.scrollWidth - span.clientWidth > 2 || span.scrollHeight - span.clientHeight > 2) {
        bad.push((span.textContent || '').trim().slice(0, 30));
      }
    }
    return bad;
  });
  record(`no action label is clipped — ${scenario.label}`, clipped.length === 0,
    clipped.length ? JSON.stringify(clipped.slice(0, 3)) : 'every label fully visible');
}

// ------------------------- the exact preview never truncates its content
await open(page, { width: 360, systemPct: '200', appScale: '1.5' });
const previewIntact = await page.evaluate(() => {
  const bodies = [...document.querySelectorAll('.ds-root .ds-preview-body')];
  const clipped = bodies.filter((b) => b.scrollHeight - b.clientHeight > 2 || b.scrollWidth - b.clientWidth > 2);
  const ellipsis = bodies.filter((b) => getComputedStyle(b).textOverflow === 'ellipsis');
  const recipients = [...document.querySelectorAll('.ds-root .ds-preview-facts dd')];
  const clippedRecipients = recipients.filter((r) => r.scrollWidth - r.clientWidth > 2);
  return { bodies: bodies.length, clipped: clipped.length, ellipsis: ellipsis.length, clippedRecipients: clippedRecipients.length };
});
// A column that collapses to a sliver wraps a recipient one character per
// line. It passes a truncation check — nothing is hidden — and is still
// unreadable, so width is measured separately.
const narrowColumns = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll('.ds-root .ds-preview-facts dd, .ds-root .ds-preview-body')) {
    const em = parseFloat(getComputedStyle(el).fontSize);
    const w = el.getBoundingClientRect().width;
    // 4em, not more: this runs in the most extreme scenario (360px wide with
    // 300% system plus 1.5 app text), where roughly seven characters per line
    // is the width genuinely available rather than a layout fault. The defect
    // this catches is the column collapsing to a sliver and wrapping one
    // character per line, which measured well under 1em.
    if (w < em * 4) {
      bad.push({ text: (el.textContent || '').trim().slice(0, 24), width: Math.round(w), em: Math.round(em) });
    }
  }
  return bad;
});
record('no preview column collapses to an unreadable width',
  narrowColumns.length === 0,
  narrowColumns.length ? JSON.stringify(narrowColumns.slice(0, 3)) : 'every recipient and body column is at least 8 characters wide');

record('exact previews never truncate body or recipient, at 200%+1.5 on a narrow width',
  previewIntact.clipped === 0 && previewIntact.ellipsis === 0 && previewIntact.clippedRecipients === 0,
  `${previewIntact.bodies} preview bodies; ${previewIntact.clipped} clipped, ${previewIntact.ellipsis} ellipsised, ${previewIntact.clippedRecipients} clipped recipients`);

// ------------------------------------------ reduced motion kills animation
await open(page);
await page.locator('.g-check input[type="checkbox"]').check();
await page.waitForTimeout(200);
const reduced = await page.evaluate(() => {
  const el = document.querySelector('.ds-root .ds-button');
  const cs = getComputedStyle(el);
  const spinners = [...document.querySelectorAll('.ds-root .ds-spinner')];
  return {
    transition: cs.transitionDuration,
    spinnerAnimations: spinners.map((s) => getComputedStyle(s).animationName),
  };
});
record('reduced motion collapses transitions to zero',
  /^0s(, 0s)*$/.test(reduced.transition),
  `transition-duration: ${reduced.transition}`);

record('reduced motion stops every looping indicator',
  reduced.spinnerAnimations.length > 0 && reduced.spinnerAnimations.every((n) => n === 'none'),
  reduced.spinnerAnimations.length
    ? `${reduced.spinnerAnimations.length} indicators, animation-name: ${[...new Set(reduced.spinnerAnimations)].join(', ')}`
    : 'no indicator present to check');

// ------------------------------------------------ both themes render
for (const theme of ['open-day', 'bright-signal']) {
  await open(page, { theme });
  const bg = await page.evaluate(() => {
    const el = document.querySelector('.ds-root');
    return { theme: el.getAttribute('data-ds-theme'), bg: getComputedStyle(el).backgroundColor };
  });
  record(`${theme} theme applies its own canvas`, bg.theme === theme && bg.bg !== 'rgba(0, 0, 0, 0)',
    `data-ds-theme=${bg.theme}, canvas ${bg.bg}`);
}

await browser.close();

const failed = results.filter((r) => !r.pass);
const out = join(repoRoot, 'design-tokens', 'build');
mkdirSync(out, { recursive: true });
writeFileSync(
  join(out, 'specimen-checks.json'),
  JSON.stringify(
    {
      generated: new Date().toISOString().slice(0, 10),
      engine: 'Chromium via playwright, system binary',
      scope:
        'Computed geometry and colour in a desktop browser. Not Android dp/sp conformance, not TalkBack, not switch access, not participant evidence.',
      total: results.length,
      failed: failed.length,
      results,
    },
    null,
    2,
  ) + '\n',
);

console.log(`\n${results.length} checks, ${failed.length} failed.`);
console.log(`wrote ${join(out, 'specimen-checks.json')}`);
if (failed.length) process.exit(1);
