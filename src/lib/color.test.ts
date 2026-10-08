import { describe, expect, it } from 'vitest';
import { darken } from './color';

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
});
