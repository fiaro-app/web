import { describe, expect, it } from 'vitest';
import { brandThemeStyle } from './brand-theme';

describe('brandThemeStyle', () => {
  it('tints primary, its hover and the focus ring with the brand color', () => {
    expect(brandThemeStyle('#0F766E')).toMatchObject({ '--primary': '#0F766E', '--ring': '#0F766E' });
    expect(brandThemeStyle('#0F766E')).toHaveProperty('--primary-hover');
  });

  it('keeps the Fiaro color when there is none', () => {
    expect(brandThemeStyle(null)).toBeUndefined();
  });

  it('ignores a color that is not #RRGGBB, so nothing odd reaches the CSS', () => {
    expect(brandThemeStyle('red')).toBeUndefined();
    expect(brandThemeStyle('#0F766E; background: url(x)')).toBeUndefined();
  });

  it('ignores a color too light for the white text of the buttons', () => {
    expect(brandThemeStyle('#FFE08A')).toBeUndefined();
  });
});
