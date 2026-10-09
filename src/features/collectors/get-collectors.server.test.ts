import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getCollectors } from './get-collectors.server';

const PORTFOLIO_ID = '0192f0a4-7c3e-7000-8000-0000000000aa';
const LIST = {
  data: [
    {
      id: '0192f0a4-7c3e-7000-8000-000000000001',
      userId: 'u',
      lenderId: 'l',
      roles: ['COLLECTOR'],
      status: 'ACTIVE',
      portfolioId: PORTFOLIO_ID,
      createdAt: '2026-10-01T10:00:00.000Z',
      deactivatedAt: null,
      fullName: 'Luis Gómez',
      phone: '+573109998877',
    },
  ],
  meta: { page: 1, pageSize: 20, total: 1 },
};

function routeApi(routes: Record<string, unknown>) {
  callEndpointAsUser.mockImplementation((endpoint: { path: string }) => {
    const value = routes[endpoint.path];
    return value instanceof Error ? Promise.reject(value) : Promise.resolve(value);
  });
}

describe('getCollectors', () => {
  beforeEach(() => {
    callEndpointAsUser.mockReset();
  });

  it('returns the rows with the portfolio name', async () => {
    routeApi({ '/memberships': LIST, '/portfolios': [{ id: PORTFOLIO_ID, name: 'Zona Norte' }] });
    const result = await getCollectors(1);
    expect(result).toMatchObject({ status: 'ok', collectors: { total: 1 } });
    expect(result.status === 'ok' && result.collectors.rows[0]?.portfolioName).toBe('Zona Norte');
  });

  it('asks the API for collectors only, on the requested page', async () => {
    routeApi({ '/memberships': LIST, '/portfolios': [] });
    await getCollectors(3);
    expect(callEndpointAsUser).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/memberships' }),
      { body: { page: 3, pageSize: 20, role: 'COLLECTOR' } },
    );
  });

  it('reports forbidden when the person cannot list collaborators', async () => {
    routeApi({
      '/memberships': new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }),
      '/portfolios': [],
    });
    expect(await getCollectors(1)).toEqual({ status: 'forbidden' });
  });

  it('propagates any other failure', async () => {
    routeApi({
      '/memberships': new ApiRequestError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'x' }),
      '/portfolios': [],
    });
    await expect(getCollectors(1)).rejects.toBeInstanceOf(ApiRequestError);
  });
});
