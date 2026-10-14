import { describe, expect, it } from 'vitest';
import { contrastWithWhite, MIN_BRAND_CONTRAST } from '@/lib/color';
import { BRAND_PALETTE, DEFAULT_BRAND_COLOR, isPaletteColor, swatchesFor } from './brand-palette';

describe('BRAND_PALETTE', () => {
  it('has six colors that keep the white button text readable', () => {
    expect(BRAND_PALETTE).toHaveLength(6);
    for (const swatch of BRAND_PALETTE) expect(contrastWithWhite(swatch.value)).toBeGreaterThanOrEqual(MIN_BRAND_CONTRAST);
  });

  it('starts with the Fiaro color', () => {
    expect(BRAND_PALETTE[0]?.value).toBe(DEFAULT_BRAND_COLOR);
  });
});

describe('swatchesFor', () => {
  it('shows only the palette when the color is a default or part of it', () => {
    expect(swatchesFor(null, 'Color actual')).toBe(BRAND_PALETTE);
    expect(swatchesFor('#0d665f', 'Color actual')).toBe(BRAND_PALETTE);
    expect(isPaletteColor('#1d4ed8')).toBe(true);
  });

  it('keeps a previously saved color that is no longer in the palette', () => {
    const swatches = swatchesFor('#123456', 'Color actual');
    expect(swatches).toHaveLength(7);
    expect(swatches.at(-1)).toEqual({ value: '#123456', label: 'Color actual' });
  });
});
