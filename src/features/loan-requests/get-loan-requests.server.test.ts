import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { EXISTING_CLIENT_REQUEST, NEW_CLIENT_REQUEST } from '@/test/loan-request-fixture';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser, getClientName, getSettlementLookup } = vi.hoisted(() => ({
  callEndpointAsUser: vi.fn(),
  getClientName: vi.fn(),
  getSettlementLookup: vi.fn(),
}));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));
vi.mock('@/features/loans/get-client-names.server', () => ({ getClientName }));
vi.mock('@/features/settlements/get-settlement-lookup.server', () => ({ getSettlementLookup }));

import { getLoanRequests } from './get-loan-requests.server';

const apiError = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' } as never);

beforeEach(() => {
  vi.clearAllMocks();
  getSettlementLookup.mockResolvedValue({ collectorNames: new Map(), collectorPortfolioNames: new Map() });
  getClientName.mockResolvedValue('Marta Ríos');
});

describe('getLoanRequests', () => {
  it('returns the rows with the client names and sends the status only when set', async () => {
    callEndpointAsUser.mockResolvedValue({ data: [NEW_CLIENT_REQUEST, EXISTING_CLIENT_REQUEST], meta: { page: 1, pageSize: 10, total: 2 } });

    const result = await getLoanRequests(1, 'PENDING');

    expect(result.status === 'ok' && result.requests.rows[1]?.clientLabel).toBe('Marta Ríos · 51234567');
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/loan-requests' }), { body: { page: 1, pageSize: 10, status: 'PENDING' } });
    expect(getClientName).toHaveBeenCalledTimes(1);

    await getLoanRequests(2, null);
    expect(callEndpointAsUser).toHaveBeenLastCalledWith(expect.objectContaining({ path: '/loan-requests' }), { body: { page: 2, pageSize: 10 } });
  });

  it('keeps going without the name of a client that could not be fetched', async () => {
    callEndpointAsUser.mockResolvedValue({ data: [EXISTING_CLIENT_REQUEST], meta: { page: 1, pageSize: 10, total: 1 } });
    getClientName.mockResolvedValue(undefined);

    const result = await getLoanRequests(1, null);

    expect(result.status === 'ok' && result.requests.rows[0]?.clientLabel).toBe('Cliente · 51234567');
  });

  it('reports a 403 as forbidden', async () => {
    callEndpointAsUser.mockRejectedValue(apiError(403, 'FORBIDDEN'));

    expect(await getLoanRequests(1, null)).toEqual({ status: 'forbidden' });
  });

  it('propagates any other failure', async () => {
    callEndpointAsUser.mockRejectedValue(apiError(500, 'INTERNAL_ERROR'));
    await expect(getLoanRequests(1, null)).rejects.toBeInstanceOf(ApiRequestError);

    callEndpointAsUser.mockRejectedValue(new Error('boom'));
    await expect(getLoanRequests(1, null)).rejects.toThrow('boom');
  });
});
