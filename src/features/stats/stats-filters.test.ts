import { describe, expect, it } from 'vitest';
import { EMPTY_STATS_FILTERS, parseStatsFilters, toStatsBody } from './stats-filters';
import { LenderStatsBodySchema, statsEndpoints } from './endpoints';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';

describe('parseStatsFilters', () => {
  it('reads a full set of filters', () => {
    expect(parseStatsFilters({ desde: '2026-10-01', hasta: '2026-10-09', cobrador: ID, cartera: ID })).toEqual({
      from: '2026-10-01',
      to: '2026-10-09',
      collectorId: ID,
      portfolioId: ID,
    });
  });

  it('is empty without parameters', () => {
    expect(parseStatsFilters({})).toEqual(EMPTY_STATS_FILTERS);
  });

  it.each([
    [{ desde: '2026-10-01' }],
    [{ hasta: '2026-10-09' }],
    [{ desde: '2026-10-09', hasta: '2026-10-01' }],
    [{ desde: '2026-02-30', hasta: '2026-03-01' }],
    [{ desde: 'ayer', hasta: 'hoy' }],
    [{ desde: ['2026-10-01', '2026-10-02'], hasta: '2026-10-09' }],
  ])('drops an invalid period %j', (params) => {
    const filters = parseStatsFilters(params);
    expect(filters.from).toBe('');
    expect(filters.to).toBe('');
  });

  it('drops ids that are not UUIDs', () => {
    expect(parseStatsFilters({ cobrador: 'abc', cartera: '../x' })).toMatchObject({ collectorId: '', portfolioId: '' });
  });

  it('accepts a single-day period', () => {
    expect(parseStatsFilters({ desde: '2026-10-09', hasta: '2026-10-09' })).toMatchObject({ from: '2026-10-09', to: '2026-10-09' });
  });
});

describe('toStatsBody', () => {
  it('sends nothing for empty filters', () => {
    expect(toStatsBody(EMPTY_STATS_FILTERS)).toEqual({});
  });

  it('sends only what is filled in, in the shape the API validates', () => {
    const body = toStatsBody({ from: '2026-10-01', to: '2026-10-09', collectorId: '', portfolioId: ID });
    expect(body).toEqual({ dateRange: { from: '2026-10-01', to: '2026-10-09' }, portfolioId: ID });
    expect(LenderStatsBodySchema.safeParse(body).success).toBe(true);
  });
});

describe('stats endpoint', () => {
  it('is declared as a QUERY on the lender stats path', () => {
    expect(statsEndpoints.get).toMatchObject({ method: 'QUERY', path: '/lenders/me/stats' });
  });

  it('accepts the four fixed buckets and rejects other lengths', () => {
    const base = {
      from: '2026-10-01',
      to: '2026-10-09',
      totalPortfolio: 100,
      portfolioAtRisk: 10,
      arrearsRate: 0.1,
      topArrears: [],
      collectorPerformance: [],
      expectedAmount: 0,
      collectedAmount: 0,
      effectiveness: null,
    };
    const buckets = ['0-7', '8-15', '16-30', '30+'].map((label) => ({ label, amount: 0, clientsCount: 0 }));
    expect(statsEndpoints.get.response.safeParse({ ...base, arrearsByAge: buckets }).success).toBe(true);
    expect(statsEndpoints.get.response.safeParse({ ...base, arrearsByAge: buckets.slice(0, 3) }).success).toBe(false);
  });
});
