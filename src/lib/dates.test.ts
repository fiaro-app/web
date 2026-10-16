import { describe, expect, it } from 'vitest';
import { formatBusinessDate, formatInstantDate, formatInstantTime, formatWeekdayDay } from './dates';

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

describe('formatInstantDate', () => {
  it('writes the Colombian day of an instant, not the UTC one', () => {
    // 02:00 UTC del 10 es todavía el 9 en Colombia (UTC-5).
    expect(formatInstantDate('2026-10-10T02:00:00.000Z')).toBe('09/10/2026');
    expect(formatInstantDate('2026-10-10T06:00:00.000Z')).toBe('10/10/2026');
  });
});

describe('formatInstantTime', () => {
  it('reads the hour in Bogotá, not in UTC', () => {
    expect(formatInstantTime('2026-10-01T20:05:00.000Z')).toMatch(/^0?3:05\s?p\.\s?m\.$/i);
  });
});

describe('formatWeekdayDay', () => {
  it('writes the weekday and the day number', () => {
    expect(formatWeekdayDay('2026-10-12')).toBe('lun 12');
    expect(formatWeekdayDay('2026-10-04')).toBe('dom 4');
    expect(formatWeekdayDay('2026-10-14')).toBe('mié 14');
  });

  it('never shifts the day because of the time zone', () => {
    expect(formatWeekdayDay('2026-01-01')).toBe('jue 1');
    expect(formatWeekdayDay('2026-12-31')).toBe('jue 31');
  });

  it('returns anything that is not a calendar date untouched', () => {
    expect(formatWeekdayDay('ayer')).toBe('ayer');
  });
});
