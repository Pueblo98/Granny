#!/usr/bin/env node
// Reads the downloaded font binaries directly and reports the weight axis and
// glyph coverage. Provenance metadata is a claim; this is the file itself.
//
//   node design-system/scripts/inspect-fonts.mjs

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const fontDir = join(here, '..', 'fonts');

function tables(buf) {
  const num = buf.readUInt16BE(4);
  const out = {};
  for (let i = 0; i < num; i++) {
    const o = 12 + i * 16;
    out[buf.toString('ascii', o, o + 4)] = { off: buf.readUInt32BE(o + 8), len: buf.readUInt32BE(o + 12) };
  }
  return out;
}

function fvarAxes(buf, t) {
  if (!t.fvar) return null;
  const b = t.fvar.off;
  const axesOff = buf.readUInt16BE(b + 4);
  const axisCount = buf.readUInt16BE(b + 8);
  const axisSize = buf.readUInt16BE(b + 10);
  const axes = [];
  for (let i = 0; i < axisCount; i++) {
    const o = b + axesOff + i * axisSize;
    axes.push({
      tag: buf.toString('ascii', o, o + 4),
      min: buf.readInt32BE(o + 4) / 65536,
      def: buf.readInt32BE(o + 8) / 65536,
      max: buf.readInt32BE(o + 12) / 65536,
    });
  }
  return axes;
}

/** Collect codepoints from cmap format 4 and 12 subtables. */
function codepoints(buf, t) {
  if (!t.cmap) return new Set();
  const b = t.cmap.off;
  const n = buf.readUInt16BE(b + 2);
  const cps = new Set();
  for (let i = 0; i < n; i++) {
    const rec = b + 4 + i * 8;
    const sub = b + buf.readUInt32BE(rec + 4);
    const fmt = buf.readUInt16BE(sub);
    if (fmt === 4) {
      const segX2 = buf.readUInt16BE(sub + 6);
      const seg = segX2 / 2;
      const endO = sub + 14;
      const startO = endO + segX2 + 2;
      for (let s = 0; s < seg; s++) {
        const end = buf.readUInt16BE(endO + s * 2);
        const start = buf.readUInt16BE(startO + s * 2);
        if (start === 0xffff) continue;
        for (let c = start; c <= end && c !== 0xffff; c++) cps.add(c);
      }
    } else if (fmt === 12) {
      const groups = buf.readUInt32BE(sub + 12);
      for (let g = 0; g < groups; g++) {
        const o = sub + 16 + g * 12;
        const start = buf.readUInt32BE(o);
        const end = buf.readUInt32BE(o + 4);
        for (let c = start; c <= end; c++) cps.add(c);
      }
    }
  }
  return cps;
}

const RANGES = {
  'Basic Latin': [0x0020, 0x007e],
  'Latin-1 Supplement': [0x00a0, 0x00ff],
  'Latin Extended-A': [0x0100, 0x017f],
  'Latin Extended-B': [0x0180, 0x024f],
  Greek: [0x0370, 0x03ff],
  Cyrillic: [0x0400, 0x04ff],
  Arabic: [0x0600, 0x06ff],
  Devanagari: [0x0900, 0x097f],
  CJK: [0x4e00, 0x9fff],
};

const report = [];
for (const f of readdirSync(fontDir).filter((f) => f.endsWith('.ttf')).sort()) {
  const buf = readFileSync(join(fontDir, f));
  const t = tables(buf);
  const axes = fvarAxes(buf, t);
  const cps = codepoints(buf, t);
  const coverage = {};
  for (const [name, [lo, hi]] of Object.entries(RANGES)) {
    let have = 0;
    let total = 0;
    for (let c = lo; c <= hi; c++) {
      total++;
      if (cps.has(c)) have++;
    }
    coverage[name] = `${have}/${total}`;
  }
  report.push({
    file: f,
    bytes: buf.length,
    sha256: createHash('sha256').update(buf).digest('hex'),
    variable: Boolean(axes),
    axes: axes ?? 'static',
    glyphCount: cps.size,
    coverage,
  });
}

writeFileSync(join(fontDir, 'font-inspection.json'), JSON.stringify(report, null, 2) + '\n');
for (const r of report) {
  console.log(`\n${r.file}  (${r.bytes} bytes)`);
  console.log(`  sha256 ${r.sha256}`);
  console.log(`  axes   ${r.variable ? r.axes.map((a) => `${a.tag} ${a.min}-${a.max} (default ${a.def})`).join(', ') : 'static'}`);
  console.log(`  mapped codepoints: ${r.glyphCount}`);
  for (const [k, v] of Object.entries(r.coverage)) {
    const [have] = v.split('/').map(Number);
    if (have > 0) console.log(`    ${k.padEnd(22)} ${v}`);
  }
  const missing = Object.entries(r.coverage).filter(([, v]) => v.split('/')[0] === '0').map(([k]) => k);
  if (missing.length) console.log(`    NOT COVERED: ${missing.join(', ')}`);
}
console.log(`\nwrote ${join(fontDir, 'font-inspection.json')}`);
