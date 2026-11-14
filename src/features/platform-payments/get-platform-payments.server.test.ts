import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getPlatformPayments } from './get-platform-payments.server';

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getPlatformPayments', () => {
  it('returns the payments of every business', async () => {
    callEndpointAsUser.mockResolvedValue({ items: [{ reference: 'a' }] });

    await expect(getPlatformPayments()).resolves.toEqual({ status: 'ok', payments: [{ reference: 'a' }] });
    expect(callEndpointAsUser.mock.calls[0]?.[0]).toMatchObject({ method: 'GET', path: '/admin/subscription-payments' });
  });

  it('turns a 403 into a screen state', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));

    await expect(getPlatformPayments()).resolves.toEqual({ status: 'forbidden' });
  });

  it('does not hide any other failure', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'x' }));

    await expect(getPlatformPayments()).rejects.toBeInstanceOf(ApiRequestError);
  });
});
