import { describe, expect, it } from 'vitest';
import { addDays, addMonths, dayLabel, formatDisplayDate, monthGrid, monthLabel, parseIsoDate, startOfMonth } from './calendar';

describe('parseIsoDate', () => {
  it('accepts real dates and rejects the rest', () => {
    expect(parseIsoDate('2026-10-09')).not.toBeNull();
    expect(parseIsoDate('2026-02-30')).toBeNull();
    expect(parseIsoDate('09/10/2026')).toBeNull();
    expect(parseIsoDate('')).toBeNull();
  });
});

describe('addDays / addMonths', () => {
  it('moves across month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('keeps the day, or the last day of a shorter month', () => {
    expect(addMonths('2026-10-09', 1)).toBe('2026-11-09');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-01-15', -1)).toBe('2025-12-15');
  });
});

describe('monthGrid', () => {
  it('has six weeks starting on Monday and holds the whole month', () => {
    const grid = monthGrid('2026-10-09');
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe('2026-09-28'); // el 1 de octubre de 2026 es jueves
    expect(grid[3]).toBe('2026-10-01');
    expect(grid).toContain('2026-10-31');
    expect(grid.at(-1)).toBe('2026-11-08');
  });
});

describe('labels', () => {
  it('writes the month, a day and the displayed date in Spanish', () => {
    expect(monthLabel('2026-10-09')).toBe('octubre de 2026');
    expect(dayLabel('2026-10-09')).toBe('9 de octubre de 2026');
    expect(formatDisplayDate('2026-10-09')).toBe('09/10/2026');
    expect(formatDisplayDate('x')).toBe('');
    expect(startOfMonth('2026-10-09')).toBe('2026-10-01');
  });
});
