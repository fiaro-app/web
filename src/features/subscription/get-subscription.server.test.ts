import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
vi.mock('react', async (importOriginal) => ({ ...(await importOriginal<typeof import('react')>()), cache: <T>(fn: T) => fn }));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getSubscription } from './get-subscription.server';

const SUBSCRIPTION = {
  planCode: 'TRIAL',
  status: 'ACTIVE',
  currentPeriodEndsAt: '2026-11-08T17:00:00.000Z',
  graceEndsAt: '2026-11-15T17:00:00.000Z',
  daysRemaining: 30,
  graceDaysRemaining: 0,
  isReadOnly: false,
  limits: { maxActiveLenders: 1, maxCollectors: 5 },
  usage: { activeLenders: 1, activeCollectors: 2 },
  createdAt: '2026-10-09T17:00:00.000Z',
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getSubscription', () => {
  it('returns the plan ready to paint', async () => {
    callEndpointAsUser.mockResolvedValue(SUBSCRIPTION);

    await expect(getSubscription()).resolves.toMatchObject({ planName: 'Prueba gratis', collectors: '2 de 5' });
    expect(callEndpointAsUser.mock.calls[0]?.[0]).toMatchObject({ method: 'GET', path: '/subscription' });
  });

  it('opens the panel without a plan notice when the API fails or has no subscription', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 404, code: 'NOT_FOUND', message: 'x' }));

    await expect(getSubscription()).resolves.toBeNull();
  });

  it('does not hide an unexpected failure', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockRejectedValue(bug);

    await expect(getSubscription()).rejects.toBe(bug);
  });
});
