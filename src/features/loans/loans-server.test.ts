import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getClientNames, getClientOptions } from './get-client-names.server';
import { getLoan } from './get-loan.server';
import { getLoans } from './get-loans.server';

const CLIENT = { id: 'c1', fullName: 'Carlos Gómez', nationalId: '1020304050' };
const LOAN = {
  id: 'l1',
  clientId: 'c1',
  principalAmount: 500_000,
  installmentCount: 20,
  installmentValue: 30_000,
  totalPayable: 600_000,
  frequency: 'DAILY',
  startDate: '2026-10-01',
  status: 'ACTIVE',
  createdByMembershipId: 'm1',
  createdAt: '2026-10-01T10:00:00.000Z',
  closedAt: null,
};
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

describe('getClientNames / getClientOptions', () => {
  it('maps clients to names and to labeled options', async () => {
    routeApi({ '/clients': { data: [CLIENT] } });
    expect(await getClientNames()).toEqual(new Map([['c1', 'Carlos Gómez']]));
    expect(await getClientOptions()).toEqual([{ id: 'c1', label: 'Carlos Gómez · 1020304050' }]);
  });

  it('falls back to no names on an API error but propagates unknown failures', async () => {
    routeApi({ '/clients': apiError(500, 'INTERNAL_ERROR') });
    expect((await getClientNames()).size).toBe(0);
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getClientNames()).rejects.toThrow('boom');
  });
});

describe('getLoans', () => {
  it('returns rows with client names and sends the status filter only when set', async () => {
    routeApi({ '/loans': { data: [LOAN], meta: { page: 1, pageSize: 20, total: 1 } }, '/clients': { data: [CLIENT] } });
    const result = await getLoans(1, 'ACTIVE');
    expect(result.status === 'ok' && result.loans.rows[0]?.clientName).toBe('Carlos Gómez');
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loans' }), {
      body: { page: 1, pageSize: 20, status: 'ACTIVE' },
    });
    await getLoans(2, null);
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loans' }), { body: { page: 2, pageSize: 20 } });
  });

  it('reports forbidden on 403', async () => {
    routeApi({ '/loans': apiError(403, 'FORBIDDEN'), '/clients': { data: [] } });
    expect(await getLoans(1, null)).toEqual({ status: 'forbidden' });
  });
});

describe('getLoan', () => {
  it('returns the detail view', async () => {
    routeApi({ '/loans/:id': LOAN, '/clients': { data: [CLIENT] } });
    const result = await getLoan('l1');
    expect(result.status === 'ok' && result.loan).toMatchObject({ clientName: 'Carlos Gómez', cancelable: true });
  });

  it('maps 404 and 403 to screen states and propagates the rest', async () => {
    routeApi({ '/loans/:id': apiError(404, 'NOT_FOUND'), '/clients': { data: [] } });
    expect(await getLoan('l1')).toEqual({ status: 'not-found' });
    routeApi({ '/loans/:id': apiError(403, 'FORBIDDEN'), '/clients': { data: [] } });
    expect(await getLoan('l1')).toEqual({ status: 'forbidden' });
    routeApi({ '/loans/:id': apiError(500, 'INTERNAL_ERROR'), '/clients': { data: [] } });
    await expect(getLoan('l1')).rejects.toBeInstanceOf(ApiRequestError);
  });
});
