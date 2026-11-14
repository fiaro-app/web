import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));
const { getAccess } = vi.hoisted(() => ({ getAccess: vi.fn() }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));

import { getClientLoans } from './get-client-loans.server';
import { getLoanBalance } from './get-balances.server';
import { getClientName, getClientOptions } from './get-client-names.server';
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
const LIST_ITEM = {
  ...LOAN,
  balance: 380_000,
  overdueAmount: 60_000,
  overdueDays: 2,
  nextDueDate: '2026-10-07',
  clientFullName: 'Carlos Gómez',
  collector: { membershipId: 'm1', fullName: 'Luis Gómez' },
};
const BALANCE = {
  loanId: 'l1',
  asOf: '2026-10-09',
  balance: 380_000,
  totalExpectedToDate: 0,
  overdueAmount: 0,
  overdueDays: 0,
  nextDueDate: null,
  firstOverdueDate: null,
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
  getAccess.mockResolvedValue({ canManage: true, canCollect: false, membershipId: null });
});

describe('getClientName / getClientOptions', () => {
  it('reads one client name and maps the first page to labeled options', async () => {
    routeApi({ '/clients': { data: [CLIENT] }, '/clients/:id': CLIENT });
    expect(await getClientName('c1')).toBe('Carlos Gómez');
    expect(await getClientOptions()).toEqual([{ id: 'c1', label: 'Carlos Gómez · 1020304050' }]);
  });

  it('adds the client the form starts with when it is not on the first page', async () => {
    routeApi({ '/clients': { data: [] }, '/clients/:id': CLIENT });
    expect(await getClientOptions('c1')).toEqual([{ id: 'c1', label: 'Carlos Gómez · 1020304050' }]);
    routeApi({ '/clients': { data: [CLIENT] }, '/clients/:id': apiError(500, 'INTERNAL_ERROR') });
    expect(await getClientOptions('c1')).toHaveLength(1);
    routeApi({ '/clients': { data: [] }, '/clients/:id': apiError(404, 'NOT_FOUND') });
    expect(await getClientOptions('c9')).toEqual([]);
  });

  it('falls back to no name on an API error but propagates unknown failures', async () => {
    routeApi({ '/clients/:id': apiError(500, 'INTERNAL_ERROR') });
    expect(await getClientName('c1')).toBeUndefined();
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getClientName('c1')).rejects.toThrow('boom');
    routeApi({ '/clients': { data: [] } });
    callEndpointAsUser.mockImplementationOnce(() => Promise.resolve({ data: [] })).mockRejectedValueOnce(new Error('boom'));
    await expect(getClientOptions('c9')).rejects.toThrow('boom');
  });
});

describe('getLoans', () => {
  it('returns rows with client names and sends the status filter only when set', async () => {
    routeApi({ '/loans': { data: [LIST_ITEM], meta: { page: 1, pageSize: 20, total: 1 } }, '/clients': { data: [CLIENT] } });
    const result = await getLoans(1, 'ACTIVE');
    expect(result.status === 'ok' && result.loans.rows[0]?.clientName).toBe('Carlos Gómez');
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loans' }), {
      body: { page: 1, pageSize: 10, status: 'ACTIVE' },
    });
    await getLoans(2, null);
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loans' }), { body: { page: 2, pageSize: 10 } });
  });

  it('searches by client: finds the matching clients first, then their loans', async () => {
    routeApi({ '/loans': { data: [LIST_ITEM], meta: { page: 1, pageSize: 50, total: 1 } }, '/clients': { data: [CLIENT] } });
    const result = await getLoans(3, 'ACTIVE', 'carlos');
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/clients' }), { body: { page: 1, pageSize: 10, search: 'carlos' } });
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loans' }), {
      body: { page: 1, pageSize: 50, clientId: 'c1', status: 'ACTIVE' },
    });
    expect(result.status === 'ok' && result.loans).toMatchObject({ total: 1, page: 1, search: 'carlos' });
  });

  it('returns no rows when no client matches the search', async () => {
    routeApi({ '/clients': { data: [] } });
    const result = await getLoans(1, null, 'zzz');
    expect(result.status === 'ok' && result.loans.rows).toEqual([]);
  });

  it('reports forbidden on 403', async () => {
    routeApi({ '/loans': apiError(403, 'FORBIDDEN'), '/clients': { data: [] } });
    expect(await getLoans(1, null)).toEqual({ status: 'forbidden' });
  });

  it('shows the balance, arrears and collector that come with each row, without asking per loan', async () => {
    routeApi({ '/loans': { data: [LIST_ITEM], meta: { page: 1, pageSize: 20, total: 1 } }, '/clients': { data: [CLIENT] } });
    const result = await getLoans(1, null);
    expect(result.status === 'ok' && result.loans.rows[0]).toMatchObject({
      balance: '$380.000',
      paid: '7/20',
      overdue: '2 días',
      collectorName: 'Luis Gómez',
    });
    expect(callEndpointAsUser.mock.calls.map((call) => call[0].path)).not.toContain('/loans/:loanId/balance');
  });
});

describe('getLoan', () => {
  const base = {
    '/loans/:id': LOAN,
    '/clients/:id': CLIENT,
    '/loans/:loanId/balance': BALANCE,
    '/loans/:loanId/collection-assignments': [
      {
        id: 'a1',
        loanId: 'l1',
        collectorMembershipId: 'm1',
        effectiveFrom: '2000-01-01',
        effectiveTo: null,
        createdAt: '2026-10-01T10:00:00.000Z',
      },
    ],
    '/memberships': { data: [COLLECTOR] },
    '/portfolios': [],
  };

  it('returns the detail with balance, collector of today and the collectors to assign', async () => {
    routeApi(base);
    const result = await getLoan('l1');
    expect(result.status === 'ok' && result.loan).toMatchObject({
      clientName: 'Carlos Gómez',
      cancelable: true,
      balance: '$380.000',
      collector: { name: 'Luis Gómez' },
    });
    expect(result.status === 'ok' && result.collectorOptions).toEqual([{ id: 'm1', name: 'Luis Gómez' }]);
  });

  it('offers to collect only when the person collects in the field and the loan is assigned to them', async () => {
    routeApi(base);
    getAccess.mockResolvedValue({ canManage: true, canCollect: true, membershipId: 'm1' });
    expect((await getLoan('l1')).status === 'ok' && (await getLoan('l1'))).toMatchObject({ collect: 'available' });

    getAccess.mockResolvedValue({ canManage: true, canCollect: true, membershipId: 'otra' });
    expect(await getLoan('l1')).toMatchObject({ collect: 'unassigned' });

    getAccess.mockResolvedValue({ canManage: true, canCollect: false, membershipId: 'm1' });
    expect(await getLoan('l1')).toMatchObject({ collect: 'unavailable' });

    getAccess.mockResolvedValue({ canManage: true, canCollect: true, membershipId: 'm1' });
    routeApi({ ...base, '/loans/:id': { ...LOAN, status: 'PAID_OFF' } });
    expect(await getLoan('l1')).toMatchObject({ collect: 'unavailable' });
  });

  it('still shows the loan when the balance and the assignments fail', async () => {
    routeApi({
      ...base,
      '/loans/:loanId/balance': apiError(500, 'INTERNAL_ERROR'),
      '/loans/:loanId/collection-assignments': apiError(500, 'INTERNAL_ERROR'),
    });
    const result = await getLoan('l1');
    expect(result.status === 'ok' && result.loan).toMatchObject({ balance: null, collector: null });
  });

  it('maps 404 and 403 to screen states and propagates the rest', async () => {
    routeApi({ ...base, '/loans/:id': apiError(404, 'NOT_FOUND') });
    expect(await getLoan('l1')).toEqual({ status: 'not-found' });
    routeApi({ ...base, '/loans/:id': apiError(403, 'FORBIDDEN') });
    expect(await getLoan('l1')).toEqual({ status: 'forbidden' });
    routeApi({ ...base, '/loans/:id': apiError(500, 'INTERNAL_ERROR') });
    await expect(getLoan('l1')).rejects.toBeInstanceOf(ApiRequestError);
  });
});

describe('getLoanBalance', () => {
  it('returns null when the API refuses and propagates unknown failures', async () => {
    routeApi({ '/loans/:loanId/balance': apiError(404, 'NOT_FOUND') });
    expect(await getLoanBalance('l1')).toBeNull();
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getLoanBalance('l1')).rejects.toThrow('boom');
  });
});

describe('getClientLoans', () => {
  it('returns the rows of one client, filtered in the API, with their balance', async () => {
    routeApi({ '/loans': { data: [LIST_ITEM], meta: { page: 1, pageSize: 20, total: 1 } } });
    const rows = await getClientLoans('c1');
    expect(rows[0]).toMatchObject({ clientName: 'Carlos Gómez', balance: '$380.000' });
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loans' }), {
      body: { page: 1, pageSize: 20, clientId: 'c1' },
    });
  });

  it('is empty when the API fails, and propagates unknown failures', async () => {
    routeApi({ '/loans': apiError(500, 'INTERNAL_ERROR') });
    expect(await getClientLoans('c1')).toEqual([]);
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getClientLoans('c1')).rejects.toThrow('boom');
  });
});
