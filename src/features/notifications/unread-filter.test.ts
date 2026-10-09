import { describe, expect, it } from 'vitest';
import { UNREAD_FILTER, parseUnreadFilter } from './unread-filter';

describe('parseUnreadFilter', () => {
  it('is true only for the unread filter', () => {
    expect(parseUnreadFilter(UNREAD_FILTER)).toBe(true);
  });

  it.each([undefined, '', 'todas', 'NO-LEIDAS', [UNREAD_FILTER, UNREAD_FILTER]])('is false for %j', (value) => {
    expect(parseUnreadFilter(value)).toBe(false);
  });
});
