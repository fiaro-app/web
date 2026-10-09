import { describe, expect, it } from 'vitest';
import { EMPTY_VISIT_REPORT_FILTERS, parseVisitReportFilters, toVisitReportBody } from './visit-report-filters';

const ID = '0190f7a0-0000-7000-8000-000000000001';

describe('parseVisitReportFilters', () => {
  it('is empty without parameters', () => {
    expect(parseVisitReportFilters({})).toEqual(EMPTY_VISIT_REPORT_FILTERS);
  });

  it('reads a valid range, collector and outcome', () => {
    expect(parseVisitReportFilters({ desde: '2026-10-01', hasta: '2026-10-09', cobrador: ID, resultado: 'PAID' })).toEqual({
      from: '2026-10-01',
      to: '2026-10-09',
      collectorId: ID,
      outcome: 'PAID',
    });
  });

  it('uses a single date for both ends', () => {
    expect(parseVisitReportFilters({ desde: '2026-10-01' })).toMatchObject({ from: '2026-10-01', to: '2026-10-01' });
    expect(parseVisitReportFilters({ hasta: '2026-10-02' })).toMatchObject({ from: '2026-10-02', to: '2026-10-02' });
  });

  it('discards invalid values instead of sending a query the API would reject', () => {
    expect(parseVisitReportFilters({ desde: '2026-02-30', hasta: 'x', cobrador: 'nope', resultado: 'LOST' })).toEqual(
      EMPTY_VISIT_REPORT_FILTERS,
    );
    expect(parseVisitReportFilters({ desde: '2026-10-09', hasta: '2026-10-01' })).toMatchObject({ from: '', to: '' });
    expect(parseVisitReportFilters({ desde: ['2026-10-01'] })).toEqual(EMPTY_VISIT_REPORT_FILTERS);
  });
});

describe('toVisitReportBody', () => {
  it('sends only the page when there are no filters', () => {
    expect(toVisitReportBody(EMPTY_VISIT_REPORT_FILTERS, 2, 20)).toEqual({ page: 2, pageSize: 20 });
  });

  it('sends the filters that are set', () => {
    const body = toVisitReportBody({ from: '2026-10-01', to: '2026-10-09', collectorId: ID, outcome: 'REFUSED' }, 1, 20);

    expect(body).toEqual({
      page: 1,
      pageSize: 20,
      dateRange: { from: '2026-10-01', to: '2026-10-09' },
      collectorMembershipId: ID,
      outcome: 'REFUSED',
    });
  });
});
