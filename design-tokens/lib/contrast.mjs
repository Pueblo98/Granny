// sRGB relative-luminance contrast, matching the method already recorded in
// docs/02-design/brand-and-visual-identity.md#contrast-method-and-limitations:
// normalize each channel to 0-1, linearize at 0.04045, weight
// 0.2126/0.7152/0.0722, then (Llighter + 0.05) / (Ldarker + 0.05).
//
// This is arithmetic on opaque colour pairs. It is NOT a device or user
// accessibility test and must never be reported as one.

export function parseHex(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6); // drop alpha; composites are handled by composite()
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`not an opaque hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function luminance(hex) {
  const [r, g, b] = parseHex(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Flatten a translucent foreground over an opaque backdrop so a composite can
 * be measured as an actual pair rather than assumed from the solid colour.
 * alpha is 0-1.
 */
export function composite(fg, bg, alpha) {
  const f = parseHex(fg);
  const b = parseHex(bg);
  const out = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return '#' + out.map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export const round2 = (n) => Math.round(n * 100) / 100;
