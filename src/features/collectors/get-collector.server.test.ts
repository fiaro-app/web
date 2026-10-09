import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getCollector } from './get-collector.server';

const ENTRY = {
  id: 'm1',
  userId: 'u',
  lenderId: 'l',
  roles: ['LENDER', 'COLLECTOR'],
  status: 'INACTIVE',
  portfolioId: 'p1',
  createdAt: '2026-10-01T10:00:00.000Z',
  deactivatedAt: null,
  fullName: 'Luis Gómez',
  phone: '+573109998877',
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getCollector', () => {
  it('reads the collaborator detail by id and maps it', async () => {
    callEndpointAsUser.mockResolvedValue(ENTRY);

    expect(await getCollector('m1')).toEqual({
      status: 'ok',
      collector: {
        id: 'm1',
        fullName: 'Luis Gómez',
        phone: '+573109998877',
        roles: ['LENDER', 'COLLECTOR'],
        portfolioId: 'p1',
        active: false,
      },
    });
    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ params: { id: 'm1' } });
  });

  it('reports not-found when the API has no such collaborator or it is not a collector', async () => {
    callEndpointAsUser.mockRejectedValueOnce(new ApiRequestError({ statusCode: 404, code: 'NOT_FOUND', message: 'x' }));
    expect(await getCollector('other')).toEqual({ status: 'not-found' });

    callEndpointAsUser.mockResolvedValueOnce({ ...ENTRY, roles: ['OWNER'] });
    expect(await getCollector('m1')).toEqual({ status: 'not-found' });
  });

  it('reports forbidden on 403 and propagates other failures', async () => {
    callEndpointAsUser.mockRejectedValueOnce(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    expect(await getCollector('m1')).toEqual({ status: 'forbidden' });
    callEndpointAsUser.mockRejectedValueOnce(new ApiRequestError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'x' }));
    await expect(getCollector('m1')).rejects.toBeInstanceOf(ApiRequestError);
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getCollector('m1')).rejects.toThrow('boom');
  });
});
