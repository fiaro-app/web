import { describe, expect, it } from 'vitest';
import { LOAN_STATUS_FILTERS, parseStatusParam } from './status-filter';

describe('parseStatusParam', () => {
  it.each(LOAN_STATUS_FILTERS)('accepts %s', (status) => {
    expect(parseStatusParam(status)).toBe(status);
  });

  it.each([undefined, '', 'activo', 'active', ['ACTIVE', 'PAID_OFF']])('is null for %j', (value) => {
    expect(parseStatusParam(value)).toBeNull();
  });
});
