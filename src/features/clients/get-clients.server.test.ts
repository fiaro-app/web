import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getClient } from './get-client.server';
import { getClients } from './get-clients.server';

const CLIENT = {
  id: 'c1',
  nationalId: '1020304050',
  fullName: 'Carlos Gómez',
  occupation: 'Vendedor',
  phone: '+573001234567',
  address: 'Calle 1',
  createdAt: '2026-10-01T10:00:00.000Z',
};
const apiError = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' } as never);

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getClients', () => {
  it('returns the rows and sends the search only when there is one', async () => {
    callEndpointAsUser.mockResolvedValue({ data: [CLIENT], meta: { page: 2, pageSize: 10, total: 21 } });
    const result = await getClients(2, 'Gómez');
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.anything(), { body: { page: 2, pageSize: 10, search: 'Gómez' } });
    expect(result).toMatchObject({ status: 'ok', clients: { total: 21, page: 2, search: 'Gómez' } });

    await getClients(1, '');
    expect(callEndpointAsUser).toHaveBeenLastCalledWith(expect.anything(), { body: { page: 1, pageSize: 10 } });
  });

  it('reports forbidden on 403 and propagates other failures', async () => {
    callEndpointAsUser.mockRejectedValueOnce(apiError(403, 'FORBIDDEN'));
    expect(await getClients(1, '')).toEqual({ status: 'forbidden' });
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getClients(1, '')).rejects.toThrow('boom');
  });
});

describe('getClient', () => {
  it('returns the client', async () => {
    callEndpointAsUser.mockResolvedValue(CLIENT);
    expect(await getClient('c1')).toEqual({ status: 'ok', client: CLIENT });
  });

  it('maps 404 and 403 to screen states and propagates the rest', async () => {
    callEndpointAsUser.mockRejectedValueOnce(apiError(404, 'NOT_FOUND'));
    expect(await getClient('c1')).toEqual({ status: 'not-found' });
    callEndpointAsUser.mockRejectedValueOnce(apiError(403, 'FORBIDDEN'));
    expect(await getClient('c1')).toEqual({ status: 'forbidden' });
    callEndpointAsUser.mockRejectedValueOnce(apiError(500, 'INTERNAL_ERROR'));
    await expect(getClient('c1')).rejects.toBeInstanceOf(ApiRequestError);
  });
});
