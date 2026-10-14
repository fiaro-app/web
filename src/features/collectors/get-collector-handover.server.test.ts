import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getCollectorHandover } from './get-collector-handover.server';

const loan = (id: string, clientFullName = 'Carlos') => ({ id, clientFullName });
const member = (id: string, fullName: string) => ({ id, fullName });

function routeApi(routes: Record<string, unknown>) {
  callEndpointAsUser.mockImplementation(async (endpoint: { path: string }, options?: { body?: { page?: number } }) => {
    const value = routes[endpoint.path];
    if (typeof value === 'function') return (value as (page: number) => unknown)(options?.body?.page ?? 1);
    if (value instanceof Error) throw value;
    return value;
  });
}

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getCollectorHandover', () => {
  it('gives the active loans the collector has today and the other active collectors', async () => {
    routeApi({
      '/loans': { data: [loan('l1'), loan('l4', '')], meta: { page: 1, pageSize: 50, total: 2 } },
      '/memberships': { data: [member('m1', 'Luis'), member('m2', 'Ana')], meta: { page: 1, pageSize: 50, total: 2 } },
    });

    expect(await getCollectorHandover('m1')).toEqual({
      loans: [
        { id: 'l1', clientName: 'Carlos' },
        { id: 'l4', clientName: '—' },
      ],
      destinations: [{ id: 'm2', name: 'Ana' }],
    });
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/memberships' }), {
      body: { page: 1, pageSize: 50, role: 'COLLECTOR', status: 'ACTIVE' },
    });
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loans' }), {
      body: { page: 1, pageSize: 50, status: 'ACTIVE', collectorMembershipId: 'm1' },
    });
    expect(callEndpointAsUser.mock.calls.map((call) => call[0].path)).not.toContain('/clients');
  });

  it('walks every page of active loans', async () => {
    routeApi({
      '/loans': (page: number) => ({ data: [loan(`l${String(page)}`)], meta: { page, pageSize: 50, total: 150 } }),
      '/memberships': { data: [], meta: { page: 1, pageSize: 50, total: 0 } },
    });

    const result = await getCollectorHandover('m1');
    expect(result?.loans.map((entry) => entry.id)).toEqual(['l1', 'l2', 'l3']);
  });

  it('is null when the API fails and propagates unknown failures', async () => {
    routeApi({ '/loans': new ApiRequestError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'x' } as never), '/memberships': { data: [] } });
    expect(await getCollectorHandover('m1')).toBeNull();

    callEndpointAsUser.mockRejectedValue(new Error('boom'));
    await expect(getCollectorHandover('m1')).rejects.toThrow('boom');
  });
});
