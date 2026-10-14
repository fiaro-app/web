import { describe, expect, it } from 'vitest';
import { SETTLEMENT_STATUS_FILTERS, parseSettlementStatusParam } from './status-filter';

describe('parseSettlementStatusParam', () => {
  it.each(SETTLEMENT_STATUS_FILTERS)('accepts %s', (status) => {
    expect(parseSettlementStatusParam(status)).toBe(status);
  });

  it.each([undefined, '', 'pendiente', 'pending', ['PENDING', 'APPROVED']])('is null for %j', (value) => {
    expect(parseSettlementStatusParam(value)).toBeNull();
  });
});
