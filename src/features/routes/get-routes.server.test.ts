import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { ROUTES_PAGE } from '@/test/route-fixture';
import { EMPTY_ROUTE_FILTERS } from './route-filters';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser, getSettlementLookup } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn(), getSettlementLookup: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));
vi.mock('@/features/settlements/get-settlement-lookup.server', () => ({ getSettlementLookup }));

import { getRoutes } from './get-routes.server';

const apiError = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' } as never);

beforeEach(() => {
  vi.clearAllMocks();
  callEndpointAsUser.mockResolvedValue(ROUTES_PAGE);
  getSettlementLookup.mockResolvedValue({ collectorNames: new Map([['m1', 'Ana Soto']]), collectorPortfolioNames: new Map() });
});

describe('getRoutes', () => {
  it('asks for the page with the filters and offers the collectors', async () => {
    const result = await getRoutes({ from: '2026-10-14', to: '2026-10-14', collectorId: '' }, 2);

    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/collection-visits/routes' }), {
      body: { page: 2, pageSize: 10, dateRange: { from: '2026-10-14', to: '2026-10-14' } },
    });
    expect(result.status === 'ok' && result.collectors).toEqual([{ id: 'm1', name: 'Ana Soto' }]);
    expect(result.status === 'ok' && result.routes.rows).toHaveLength(1);
  });

  it('reports a 403 as forbidden', async () => {
    callEndpointAsUser.mockRejectedValue(apiError(403, 'FORBIDDEN'));
    expect(await getRoutes(EMPTY_ROUTE_FILTERS, 1)).toEqual({ status: 'forbidden' });
  });

  it('propagates any other failure', async () => {
    callEndpointAsUser.mockRejectedValue(apiError(500, 'INTERNAL_ERROR'));
    await expect(getRoutes(EMPTY_ROUTE_FILTERS, 1)).rejects.toBeInstanceOf(ApiRequestError);
    callEndpointAsUser.mockRejectedValue(new Error('boom'));
    await expect(getRoutes(EMPTY_ROUTE_FILTERS, 1)).rejects.toThrow('boom');
  });
});
