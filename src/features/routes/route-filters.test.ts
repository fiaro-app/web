import { describe, expect, it } from 'vitest';
import { EMPTY_ROUTE_FILTERS, parseRouteFilters, toRoutesBody } from './route-filters';

const ID = '0196f3a0-0000-7000-8000-0000000000aa';

describe('parseRouteFilters', () => {
  it('without parameters asks for today only', () => {
    expect(parseRouteFilters({})).toEqual(EMPTY_ROUTE_FILTERS);
  });

  it('reads the dates and the collector from the URL, and drops anything invalid', () => {
    expect(parseRouteFilters({ desde: '2026-10-10', hasta: '2026-10-12', cobrador: ID })).toEqual({ from: '2026-10-10', to: '2026-10-12', collectorId: ID });
    expect(parseRouteFilters({ cobrador: 'no-es-un-id' }).collectorId).toBe('');
  });
});

describe('toRoutesBody', () => {
  it('sends only what is filled in', () => {
    expect(toRoutesBody(EMPTY_ROUTE_FILTERS, 2, 10)).toEqual({ page: 2, pageSize: 10 });
    expect(toRoutesBody({ from: '2026-10-10', to: '2026-10-12', collectorId: ID }, 1, 10)).toEqual({
      page: 1,
      pageSize: 10,
      dateRange: { from: '2026-10-10', to: '2026-10-12' },
      collectorMembershipId: ID,
    });
  });
});
