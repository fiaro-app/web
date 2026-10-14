import { describe, expect, it } from 'vitest';
import { ALL_SETTLEMENTS_PARAM, SETTLEMENT_STATUS_FILTERS, parseSettlementStatusParam, settlementStatusParam } from './status-filter';

describe('parseSettlementStatusParam', () => {
  it.each(SETTLEMENT_STATUS_FILTERS)('accepts %s', (status) => {
    expect(parseSettlementStatusParam(status)).toBe(status);
  });

  it.each([undefined, '', 'pendiente', 'pending', ['PENDING', 'APPROVED']])('opens on the pending ones for %j', (value) => {
    expect(parseSettlementStatusParam(value)).toBe('PENDING');
  });

  it('asks for every status with TODOS', () => {
    expect(parseSettlementStatusParam(ALL_SETTLEMENTS_PARAM)).toBeNull();
  });
});

describe('settlementStatusParam', () => {
  it('writes the status, or TODOS for every status', () => {
    expect(settlementStatusParam('APPROVED')).toBe('APPROVED');
    expect(settlementStatusParam(null)).toBe(ALL_SETTLEMENTS_PARAM);
  });
});
