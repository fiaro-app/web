import { describe, expect, it } from 'vitest';
import { hasAdvancedStats } from './plan-features';

describe('hasAdvancedStats', () => {
  it.each([
    ['INDIVIDUAL', false],
    ['PRO', true],
    ['TEAM', true],
    ['TRIAL', true],
    [null, true],
  ])('%s -> %s', (plan, expected) => {
    expect(hasAdvancedStats(plan)).toBe(expected);
  });
});
