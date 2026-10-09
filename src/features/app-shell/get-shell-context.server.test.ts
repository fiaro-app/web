import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { FALLBACK_BUSINESS_NAME, getShellContext } from './get-shell-context.server';

const USER = { id: 'u1', name: 'Daniel Rojas', phoneNumber: '+573001234567', contactEmail: null, mustChangePassword: false };
const LENDER = { id: 'l1', tenantId: 't1', name: 'Financiera Buen Vecino', logoUrl: null, nonWorkingWeekdays: ['SUNDAY'], skipNationalHolidays: true, createdAt: '2026-10-01T10:00:00.000Z' };

const membership = (userId: string, roles: string[]) => ({
  id: `m-${userId}`,
  userId,
  lenderId: 'l1',
  roles,
  status: 'ACTIVE',
  portfolioId: null,
  createdAt: '2026-10-01T10:00:00.000Z',
  deactivatedAt: null,
  fullName: 'X',
  phone: '+573001234567',
});

const NO_UNREAD = { data: [], meta: { page: 1, pageSize: 1, total: 0 } };

function routeApi(responses: Record<string, unknown>) {
  callEndpointAsUser.mockImplementation(async (endpoint: { path: string }) => {
    const response = { '/notifications': NO_UNREAD, ...responses }[endpoint.path];
    if (response instanceof Error) throw response;
    return response;
  });
}

const api = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' });

beforeEach(() => vi.clearAllMocks());

describe('getShellContext', () => {
  it('gives the business name and the role of the signed-in person', async () => {
    routeApi({
      '/lender': LENDER,
      '/memberships': { data: [membership('otro', ['COLLECTOR']), membership('u1', ['OWNER', 'LENDER', 'COLLECTOR'])], meta: { page: 1, pageSize: 100, total: 2 } },
    });

    await expect(getShellContext(USER)).resolves.toEqual({ businessName: 'Financiera Buen Vecino', roleLabel: 'Administrador', unreadNotifications: 0 });
  });

  it('reports the unread notifications for the sidebar badge', async () => {
    routeApi({ '/lender': LENDER, '/memberships': api(403, 'FORBIDDEN'), '/notifications': { data: [], meta: { page: 1, pageSize: 1, total: 4 } } });

    expect((await getShellContext(USER)).unreadNotifications).toBe(4);
  });

  it('has no role when the person is not in the list', async () => {
    routeApi({ '/lender': LENDER, '/memberships': { data: [], meta: { page: 1, pageSize: 100, total: 0 } } });

    expect((await getShellContext(USER)).roleLabel).toBeNull();
  });

  it('treats a 403 on the list as a collector, who cannot list collaborators', async () => {
    routeApi({ '/lender': LENDER, '/memberships': api(403, 'FORBIDDEN') });

    expect((await getShellContext(USER)).roleLabel).toBe('Cobrador');
  });

  it('opens the panel with fallbacks when the API fails on these extras', async () => {
    routeApi({ '/lender': api(503, 'MAINTENANCE'), '/memberships': api(500, 'INTERNAL_ERROR') });

    await expect(getShellContext(USER)).resolves.toEqual({ businessName: FALLBACK_BUSINESS_NAME, roleLabel: null, unreadNotifications: 0 });
  });

  it('does not hide an unexpected (non-API) failure', async () => {
    const bug = new TypeError('bug');
    routeApi({ '/lender': bug, '/memberships': { data: [], meta: { page: 1, pageSize: 100, total: 0 } } });

    await expect(getShellContext(USER)).rejects.toBe(bug);
  });
});
