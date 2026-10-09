import { describe, expect, it } from 'vitest';
import { EMPTY_SETTLEMENT_FILTERS, parseSettlementFilters, toSettlementsBody } from './settlement-filters';

const ID = '0190f7a0-0000-7000-8000-000000000001';

describe('parseSettlementFilters', () => {
  it('is empty without parameters', () => {
    expect(parseSettlementFilters({})).toEqual(EMPTY_SETTLEMENT_FILTERS);
  });

  it('reads the range, the collector and the portfolio', () => {
    expect(parseSettlementFilters({ desde: '2026-10-01', hasta: '2026-10-09', cobrador: ID, cartera: ID })).toEqual({
      from: '2026-10-01',
      to: '2026-10-09',
      collectorId: ID,
      portfolioId: ID,
    });
  });

  it('filters a single day when only one date is given and drops invalid values', () => {
    expect(parseSettlementFilters({ desde: '2026-10-01' })).toMatchObject({ from: '2026-10-01', to: '2026-10-01' });
    expect(parseSettlementFilters({ desde: '2026-10-09', hasta: '2026-10-01', cobrador: 'x', cartera: 'y' })).toEqual(
      EMPTY_SETTLEMENT_FILTERS,
    );
  });
});

describe('toSettlementsBody', () => {
  it('sends only the page without filters', () => {
    expect(toSettlementsBody(2, 20, null, EMPTY_SETTLEMENT_FILTERS)).toEqual({ page: 2, pageSize: 20 });
  });

  it('sends every filter that is set', () => {
    const body = toSettlementsBody(1, 20, 'PENDING', { from: '2026-10-01', to: '2026-10-09', collectorId: ID, portfolioId: ID });

    expect(body).toEqual({
      page: 1,
      pageSize: 20,
      status: 'PENDING',
      dateRange: { from: '2026-10-01', to: '2026-10-09' },
      collectorMembershipId: ID,
      portfolioId: ID,
    });
  });
});
