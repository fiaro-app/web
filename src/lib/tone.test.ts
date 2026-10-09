import { describe, expect, it } from 'vitest';
import { FIGURE_TEXT_CLASSES, TONE_SURFACE_CLASSES, TONE_TEXT_CLASSES } from './tone';

describe('tone classes', () => {
  it('has a text color for every intention and figure tone', () => {
    expect(TONE_TEXT_CLASSES.error).toBe('text-destructive');
    expect(TONE_SURFACE_CLASSES.warning).toBe('bg-warning/12 text-warning');
    expect(FIGURE_TEXT_CLASSES).toEqual({
      neutral: 'text-foreground',
      good: 'text-success',
      warning: 'text-warning',
      bad: 'text-destructive',
    });
  });
});
