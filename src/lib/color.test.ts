import { describe, expect, it } from 'vitest';
import { contrastWithWhite, darken, MIN_BRAND_CONTRAST } from './color';

describe('darken', () => {
  it('reduces lightness by 10% of its own lightness', () => {
    expect(darken('#0f766e', 0.1)).toBe('#0d6a63');
  });

  it('clamps at black instead of going negative', () => {
    expect(darken('#000000', 0.5)).toBe('#000000');
  });

  it('keeps a gray color gray (zero saturation)', () => {
    expect(darken('#808080', 0.1)).toBe('#737373');
  });

  it('handles a blue-dominant color', () => {
    expect(darken('#1e3a8a', 0.1)).toBe('#1b347c');
  });
});

describe('contrastWithWhite', () => {
  it('is 21 for black, 1 for white and passes AA for the Fiaro indigo', () => {
    expect(contrastWithWhite('#000000')).toBeCloseTo(21, 0);
    expect(contrastWithWhite('#ffffff')).toBeCloseTo(1, 1);
    expect(contrastWithWhite('#3b3382')).toBeGreaterThanOrEqual(MIN_BRAND_CONTRAST);
  });

  it('fails AA for a light color, where white text would not read', () => {
    expect(contrastWithWhite('#ffe08a')).toBeLessThan(MIN_BRAND_CONTRAST);
  });
});
