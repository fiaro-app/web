import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getSettlement } from './get-settlement.server';
import { getSettlements } from './get-settlements.server';

const SETTLEMENT = {
  id: 's1',
  collectorMembershipId: 'm1',
  date: '2026-10-08',
  expectedAmount: 100_000,
  collectedAmount: 100_000,
  collectedByMethod: { CASH: 100_000, NEQUI: 0, TRANSFER: 0 },
  status: 'PENDING',
  collectorNote: null,
  reviewNote: null,
  reviewedByMembershipId: null,
  reviewedAt: null,
  submittedAt: '2026-10-08T22:00:00.000Z',
  createdAt: '2026-10-08T22:00:00.000Z',
};
const COLLECTOR = { id: 'm1', fullName: 'Luis Gómez', portfolioId: null };
const apiError = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' } as never);

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

describe('getSettlements', () => {
  it('returns rows with collector names and sends the status filter only when set', async () => {
    routeApi({
      '/daily-settlements': { data: [SETTLEMENT], meta: { page: 1, pageSize: 20, total: 1 } },
      '/memberships': { data: [COLLECTOR] },
      '/portfolios': [],
    });
    const result = await getSettlements(1, 'PENDING');
    expect(result.status === 'ok' && result.settlements.rows[0]?.collectorName).toBe('Luis Gómez');
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/daily-settlements' }), {
      body: { page: 1, pageSize: 20, status: 'PENDING' },
    });
    await getSettlements(2, null);
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/daily-settlements' }), {
      body: { page: 2, pageSize: 20 },
    });
  });

  it('sends the date range, collector and portfolio filters and offers them as options', async () => {
    routeApi({
      '/daily-settlements': { data: [SETTLEMENT], meta: { page: 1, pageSize: 20, total: 1 } },
      '/memberships': { data: [COLLECTOR] },
      '/portfolios': [{ id: 'p1', name: 'Zona Norte' }],
    });
    const filters = { from: '2026-10-01', to: '2026-10-09', collectorId: 'm1', portfolioId: 'p1' };

    const result = await getSettlements(1, 'APPROVED', filters);

    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/daily-settlements' }), {
      body: {
        page: 1,
        pageSize: 20,
        status: 'APPROVED',
        dateRange: { from: '2026-10-01', to: '2026-10-09' },
        collectorMembershipId: 'm1',
        portfolioId: 'p1',
      },
    });
    expect(result).toMatchObject({
      status: 'ok',
      settlements: { filters },
      options: { collectors: [{ id: 'm1', name: 'Luis Gómez' }], portfolios: [{ id: 'p1', name: 'Zona Norte' }] },
    });
  });

  it('reports forbidden on 403', async () => {
    routeApi({ '/daily-settlements': apiError(403, 'FORBIDDEN'), '/memberships': { data: [] }, '/portfolios': [] });
    expect(await getSettlements(1, null)).toEqual({ status: 'forbidden' });
  });
});

describe('getSettlement', () => {
  it('returns the detail view', async () => {
    routeApi({ '/daily-settlements/:id': SETTLEMENT, '/memberships': { data: [COLLECTOR] }, '/portfolios': [] });
    const result = await getSettlement('s1');
    expect(result.status === 'ok' && result.settlement).toMatchObject({ collectorName: 'Luis Gómez', reviewable: true });
  });

  it('maps 404 and 403 to screen states and propagates the rest', async () => {
    const base = { '/memberships': { data: [] }, '/portfolios': [] };
    routeApi({ ...base, '/daily-settlements/:id': apiError(404, 'NOT_FOUND') });
    expect(await getSettlement('s1')).toEqual({ status: 'not-found' });
    routeApi({ ...base, '/daily-settlements/:id': apiError(403, 'FORBIDDEN') });
    expect(await getSettlement('s1')).toEqual({ status: 'forbidden' });
    routeApi({ ...base, '/daily-settlements/:id': apiError(500, 'INTERNAL_ERROR') });
    await expect(getSettlement('s1')).rejects.toBeInstanceOf(ApiRequestError);
  });
});
