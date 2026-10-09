import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getLenderDashboard } from './get-dashboard.server';

const SUMMARY = {
  totalPortfolio: 1000,
  collectedToday: 100,
  activeCollectors: 1,
  totalCollectors: 1,
  effectivenessToday: 0.5,
  clientsInArrears: 0,
  alerts: [],
  pendingSettlements: [],
};

beforeEach(() => vi.clearAllMocks());

describe('getLenderDashboard', () => {
  it('returns the summary ready to paint', async () => {
    callEndpointAsUser.mockResolvedValue(SUMMARY);

    const result = await getLenderDashboard();

    expect(result.status).toBe('ok');
    expect(result.status === 'ok' && result.dashboard.kpis[0]).toMatchObject({ value: '$1.000' });
  });

  it('treats a missing active membership (403 FORBIDDEN) as a screen state, not as an error', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));

    await expect(getLenderDashboard()).resolves.toEqual({ status: 'no-business' });
  });

  it('lets any other failure through to the error boundary', async () => {
    const outage = new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' });
    callEndpointAsUser.mockRejectedValue(outage);

    await expect(getLenderDashboard()).rejects.toBe(outage);
  });
});
