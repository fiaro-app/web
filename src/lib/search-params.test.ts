import { describe, expect, it } from 'vitest';
import { DATE_RANGE_LIMITS, dateRangeParams, idParam, isCalendarDate, singleParam } from './search-params';

const ID = '0190f7a0-0000-7000-8000-000000000001';

describe('singleParam', () => {
  it('reads a text value and ignores missing or repeated ones', () => {
    expect(singleParam('a')).toBe('a');
    expect(singleParam(undefined)).toBe('');
    expect(singleParam(['a', 'b'])).toBe('');
  });
});

describe('isCalendarDate', () => {
  it('accepts real dates and rejects impossible or malformed ones', () => {
    expect(isCalendarDate('2026-10-09')).toBe(true);
    expect(isCalendarDate('2026-02-30')).toBe(false);
    expect(isCalendarDate('09/10/2026')).toBe(false);
  });
});

describe('idParam', () => {
  it('keeps a UUID and drops anything else', () => {
    expect(idParam(ID)).toBe(ID);
    expect(idParam('nope')).toBe('');
    expect(idParam(undefined)).toBe('');
  });
});

describe('dateRangeParams', () => {
  it('reads a valid range', () => {
    expect(dateRangeParams({ desde: '2026-10-01', hasta: '2026-10-09' })).toEqual({ from: '2026-10-01', to: '2026-10-09' });
  });

  it('uses a single date for both ends', () => {
    expect(dateRangeParams({ desde: '2026-10-01' })).toEqual({ from: '2026-10-01', to: '2026-10-01' });
    expect(dateRangeParams({ hasta: '2026-10-02' })).toEqual({ from: '2026-10-02', to: '2026-10-02' });
  });

  it('is empty when the dates are invalid or out of order', () => {
    expect(dateRangeParams({ desde: '2026-10-09', hasta: '2026-10-01' })).toEqual({ from: '', to: '' });
    expect(dateRangeParams({ desde: 'x', hasta: '2026-02-30' })).toEqual({ from: '', to: '' });
    expect(dateRangeParams({})).toEqual({ from: '', to: '' });
  });

  it('is empty when the range ends after today or is longer than the screen allows', () => {
    expect(dateRangeParams({ desde: '2026-10-01', hasta: '2999-01-01' })).toEqual({ from: '', to: '' });
    expect(dateRangeParams({ desde: '2024-01-01', hasta: '2025-12-31' })).toEqual({ from: '', to: '' });
    expect(dateRangeParams({ desde: '2026-01-01', hasta: '2026-06-30' }, DATE_RANGE_LIMITS.visits)).toEqual({ from: '', to: '' });
    expect(dateRangeParams({ desde: '2026-06-01', hasta: '2026-06-30' }, DATE_RANGE_LIMITS.visits)).toEqual({ from: '2026-06-01', to: '2026-06-30' });
  });
});
