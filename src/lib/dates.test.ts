import { describe, expect, it } from 'vitest';
import { formatBusinessDate } from './dates';

describe('formatBusinessDate', () => {
  it('writes the day first, as in Colombia', () => {
    expect(formatBusinessDate('2026-09-22')).toBe('22/09/2026');
  });

  it('never shifts the day because of the time zone', () => {
    expect(formatBusinessDate('2026-01-01')).toBe('01/01/2026');
    expect(formatBusinessDate('2026-12-31')).toBe('31/12/2026');
  });

  it('returns anything that is not a calendar date untouched', () => {
    expect(formatBusinessDate('ayer')).toBe('ayer');
    expect(formatBusinessDate('2026-09-22T10:00:00Z')).toBe('2026-09-22T10:00:00Z');
  });
});
