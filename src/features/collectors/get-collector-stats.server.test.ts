import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getCollectorStats } from './get-collector-stats.server';

const STATS = {
  from: '2026-10-01',
  to: '2026-10-31',
  expectedAmount: 100_000,
  collectedAmount: 50_000,
  effectiveness: 0.5,
  visitsCount: 3,
  overdueAmount: 0,
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getCollectorStats', () => {
  it('asks for the stats of the collector and formats them', async () => {
    callEndpointAsUser.mockResolvedValue(STATS);

    await expect(getCollectorStats('m1')).resolves.toMatchObject({ effectiveness: '50 %', collected: '$50.000' });
    expect(callEndpointAsUser.mock.calls[0]?.[0]).toMatchObject({ method: 'GET', path: '/collectors/:id/stats' });
    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ params: { id: 'm1' } });
  });

  it('shows the profile without the figures when the API fails', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' }));

    await expect(getCollectorStats('m1')).resolves.toBeNull();
  });

  it('does not hide an unexpected failure', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockRejectedValue(bug);

    await expect(getCollectorStats('m1')).rejects.toBe(bug);
  });
});
