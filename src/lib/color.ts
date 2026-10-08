/**
 * Darkens a `#rrggbb` hex color by a *relative* fraction of its own lightness (HSL space) — not
 * a fixed amount, so it stays a subtle hover shade whether the brand color a Lender picks is
 * already dark or light. Used to derive that hover shade from a single configured color, with no
 * second color to ask for.
 *
 * @example
 * darken('#0f766e', 0.1) // '#0d6a63' — 10% darker than its own lightness
 */
export function darken(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, l * (1 - amount)));
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / delta + 2) / 6;
      break;
    default:
      h = ((r - g) / delta + 4) / 6;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  if (s === 0) {
    const gray = toHexByte(l);
    return `#${gray}${gray}${gray}`;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hueToChannel(p, q, h + 1 / 3);
  const g = hueToChannel(p, q, h);
  const b = hueToChannel(p, q, h - 1 / 3);
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

function hueToChannel(p: number, q: number, tInput: number): number {
  let t = tInput;
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function toHexByte(channel: number): string {
  return Math.round(channel * 255)
    .toString(16)
    .padStart(2, '0');
}
