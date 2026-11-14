import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
vi.mock('react', async (importOriginal) => ({ ...(await importOriginal<typeof import('react')>()), cache: <T>(fn: T) => fn }));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getPayments } from './get-payments.server';

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getPayments', () => {
  it('returns the orders, newest first', async () => {
    callEndpointAsUser.mockResolvedValue({ items: [{ reference: 'a' }] });

    await expect(getPayments()).resolves.toEqual([{ reference: 'a' }]);
    expect(callEndpointAsUser.mock.calls[0]?.[0]).toMatchObject({ method: 'GET', path: '/subscription/payments' });
  });

  it('returns null when the API fails', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));

    await expect(getPayments()).resolves.toBeNull();
  });

  it('does not hide an unexpected failure', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockRejectedValue(bug);

    await expect(getPayments()).rejects.toBe(bug);
  });
});
