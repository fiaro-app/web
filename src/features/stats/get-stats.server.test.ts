import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getStats } from './get-stats.server';
import { EMPTY_STATS_FILTERS } from './stats-filters';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';
const STATS = {
  from: '2026-10-01',
  to: '2026-10-09',
  totalPortfolio: 1_000_000,
  portfolioAtRisk: 100_000,
  arrearsRate: 0.1,
  arrearsByAge: ['0-7', '8-15', '16-30', '30+'].map((label) => ({ label, amount: 0, clientsCount: 0 })),
  topArrears: [],
  collectorPerformance: [{ collectorMembershipId: ID, fullName: 'Luis Gómez', effectiveness: 0.9, overdueAmount: 0 }],
  expectedAmount: 500_000,
  collectedAmount: 450_000,
  effectiveness: 0.9,
  previous: null,
};
const COLLECTOR = { id: ID, fullName: 'Luis Gómez', portfolioId: 'p1' };

function routeApi(routes: Record<string, unknown>) {
  callEndpointAsUser.mockImplementation(async (endpoint: { path: string }) => {
    const value = routes[endpoint.path];
    if (value instanceof Error) throw value;
    return value;
  });
}

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getStats', () => {
  it('returns the view with the collector portfolio and sends only the active filters', async () => {
    routeApi({ '/lenders/me/stats': STATS, '/memberships': { data: [COLLECTOR] }, '/portfolios': [{ id: 'p1', name: 'Zona Norte' }] });
    const result = await getStats({ ...EMPTY_STATS_FILTERS, portfolioId: ID });
    expect(result.status === 'ok' && result.stats.collectors[0]?.portfolioName).toBe('Zona Norte');
    expect(result.status === 'ok' && result.options).toEqual({
      collectors: [{ id: ID, name: 'Luis Gómez' }],
      portfolios: [{ id: 'p1', name: 'Zona Norte' }],
    });
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/lenders/me/stats' }), { body: { portfolioId: ID, includePrevious: true } });
  });

  it('sends an empty body without filters', async () => {
    routeApi({ '/lenders/me/stats': STATS, '/memberships': { data: [] }, '/portfolios': [] });
    await getStats(EMPTY_STATS_FILTERS);
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/lenders/me/stats' }), { body: { includePrevious: true } });
  });

  it('reports forbidden on 403 and propagates other failures', async () => {
    const base = { '/memberships': { data: [] }, '/portfolios': [] };
    routeApi({ ...base, '/lenders/me/stats': new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }) });
    expect(await getStats(EMPTY_STATS_FILTERS)).toEqual({ status: 'forbidden' });
    routeApi({ ...base, '/lenders/me/stats': new ApiRequestError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'x' }) });
    await expect(getStats(EMPTY_STATS_FILTERS)).rejects.toBeInstanceOf(ApiRequestError);
  });
});
