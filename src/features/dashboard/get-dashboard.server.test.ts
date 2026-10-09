import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getLenderDashboard } from './get-dashboard.server';

const COLLECTOR_ID = '0192f0a4-7c3e-7000-8000-000000000011';

const SETTLEMENT = {
  id: '0192f0a4-7c3e-7000-8000-000000000010',
  collectorMembershipId: COLLECTOR_ID,
  date: '2026-10-08',
  expectedAmount: 1000,
  collectedAmount: 900,
  collectedByMethod: { CASH: 900, NEQUI: 0, TRANSFER: 0 },
  status: 'PENDING',
  collectorNote: null,
};

const SUMMARY = {
  totalPortfolio: 1000,
  collectedToday: 100,
  activeCollectors: 1,
  totalCollectors: 1,
  effectivenessToday: 0.5,
  clientsInArrears: 0,
  alerts: [],
  pendingSettlements: [] as unknown[],
};

const COLLECTORS = {
  data: [
    {
      id: COLLECTOR_ID,
      userId: 'u',
      lenderId: 'l',
      roles: ['COLLECTOR'],
      status: 'ACTIVE',
      portfolioId: 'p1',
      createdAt: '2026-10-01T10:00:00.000Z',
      deactivatedAt: null,
      fullName: 'Alejo Zuleta',
      phone: '+573001234567',
    },
  ],
  meta: { page: 1, pageSize: 100, total: 1 },
};

const PORTFOLIOS = [{ id: 'p1', name: 'Zona Norte', isDefault: true, createdAt: '2026-10-01T10:00:00.000Z' }];

/** Responde según la ruta que se pida. */
function routeApi(responses: Record<string, unknown>) {
  callEndpointAsUser.mockImplementation(async (endpoint: { path: string }) => {
    const response = responses[endpoint.path];
    if (response instanceof Error) throw response;
    return response;
  });
}

beforeEach(() => vi.clearAllMocks());

describe('getLenderDashboard', () => {
  it('returns the summary ready to paint, without extra calls when there is nothing to complete', async () => {
    routeApi({ '/lenders/me/dashboard': SUMMARY });

    const result = await getLenderDashboard();

    expect(result.status).toBe('ok');
    expect(result.status === 'ok' && result.dashboard.kpis[0]).toMatchObject({ value: '$1.000' });
    expect(callEndpointAsUser).toHaveBeenCalledTimes(1);
  });

  it('completes the pending settlements with collector and portfolio names', async () => {
    routeApi({
      '/lenders/me/dashboard': { ...SUMMARY, pendingSettlements: [SETTLEMENT] },
      '/memberships': COLLECTORS,
      '/portfolios': PORTFOLIOS,
    });

    const result = await getLenderDashboard();

    expect(result.status === 'ok' && result.dashboard.pendingSettlements[0]).toMatchObject({
      collectorName: 'Alejo Zuleta',
      portfolioName: 'Zona Norte',
    });
  });

  it('still shows the settlements, with fallback names, when the collectors cannot be listed', async () => {
    routeApi({
      '/lenders/me/dashboard': { ...SUMMARY, pendingSettlements: [SETTLEMENT] },
      '/memberships': new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }),
      '/portfolios': PORTFOLIOS,
    });

    const result = await getLenderDashboard();

    expect(result.status === 'ok' && result.dashboard.pendingSettlements[0]).toMatchObject({
      collectorName: 'Cobrador sin nombre',
    });
  });

  it('treats a missing active membership (403 FORBIDDEN) as a screen state, not as an error', async () => {
    routeApi({ '/lenders/me/dashboard': new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }) });

    await expect(getLenderDashboard()).resolves.toEqual({ status: 'no-business' });
  });

  it('lets any other failure through to the error boundary', async () => {
    const outage = new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' });
    routeApi({ '/lenders/me/dashboard': outage });

    await expect(getLenderDashboard()).rejects.toBe(outage);
  });

  it('does not hide an unexpected (non-API) failure while loading the names', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockImplementation(async (endpoint: { path: string }) => {
      if (endpoint.path === '/lenders/me/dashboard') return { ...SUMMARY, pendingSettlements: [SETTLEMENT] };
      throw bug;
    });

    await expect(getLenderDashboard()).rejects.toBe(bug);
  });
});
