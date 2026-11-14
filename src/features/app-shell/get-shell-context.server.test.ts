import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { FALLBACK_BUSINESS_NAME, getShellContext } from './get-shell-context.server';

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

const NO_UNREAD = { count: 0 };

function routeApi(responses: Record<string, unknown>) {
  callEndpointAsUser.mockImplementation(async (endpoint: { path: string }) => {
    const response = { '/notifications/unread-count': NO_UNREAD, ...responses }[endpoint.path];
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
      '/memberships/me': membership('u1', ['OWNER', 'LENDER', 'COLLECTOR']),
    });

    await expect(getShellContext()).resolves.toMatchObject({
      businessName: 'Financiera Buen Vecino',
      roleLabel: 'Administrador',
      brandColor: null,
      unreadNotifications: 0,
      roles: ['OWNER', 'LENDER', 'COLLECTOR'],
      membershipId: 'm-u1',
      canManage: true,
      canCollect: true,
    });
  });

  it('passes along the brand color of the business', async () => {
    routeApi({ '/lender': { ...LENDER, brandColor: '#0F766E' }, '/memberships/me': membership('u1', ['COLLECTOR']) });

    expect((await getShellContext()).brandColor).toBe('#0F766E');
  });

  it('reports the unread notifications for the sidebar badge', async () => {
    routeApi({ '/lender': LENDER, '/memberships/me': membership('u1', ['COLLECTOR']), '/notifications/unread-count': { count: 4 } });

    expect((await getShellContext()).unreadNotifications).toBe(4);
  });

  it('reads the role of a collector from their own membership', async () => {
    routeApi({ '/lender': LENDER, '/memberships/me': membership('u1', ['COLLECTOR']) });

    expect(await getShellContext()).toMatchObject({ roleLabel: 'Cobrador', roles: ['COLLECTOR'], canManage: false, canCollect: true, membershipId: 'm-u1' });
  });

  it('opens the panel with fallbacks when the API fails on these extras', async () => {
    routeApi({ '/lender': api(503, 'MAINTENANCE'), '/memberships/me': api(500, 'INTERNAL_ERROR') });

    await expect(getShellContext()).resolves.toMatchObject({
      businessName: FALLBACK_BUSINESS_NAME,
      roleLabel: null,
      brandColor: null,
      unreadNotifications: 0,
      roles: null,
      canManage: true,
      canCollect: false,
    });
  });

  it('does not hide an unexpected (non-API) failure', async () => {
    const bug = new TypeError('bug');
    routeApi({ '/lender': bug, '/memberships/me': membership('u1', ['OWNER']) });

    await expect(getShellContext()).rejects.toBe(bug);
  });
});
