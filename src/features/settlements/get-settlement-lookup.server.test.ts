import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getSettlementLookup } from './get-settlement-lookup.server';

const COLLECTOR = {
  id: 'm1',
  userId: 'u',
  lenderId: 'l',
  roles: ['COLLECTOR'],
  status: 'ACTIVE',
  portfolioId: 'p1',
  createdAt: '2026-10-01T10:00:00.000Z',
  deactivatedAt: null,
  fullName: 'Luis Gómez',
  phone: '+573109998877',
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getSettlementLookup', () => {
  it('maps collector ids to their name and portfolio', async () => {
    callEndpointAsUser.mockImplementation(async (endpoint: { path: string }) =>
      endpoint.path === '/memberships' ? { data: [COLLECTOR] } : [{ id: 'p1', name: 'Zona Norte' }],
    );
    const lookup = await getSettlementLookup();
    expect(lookup.collectorNames.get('m1')).toBe('Luis Gómez');
    expect(lookup.collectorPortfolioNames.get('m1')).toBe('Zona Norte');
  });

  it('falls back to an empty lookup on an API error but propagates unknown failures', async () => {
    callEndpointAsUser.mockRejectedValueOnce(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    expect((await getSettlementLookup()).collectorNames.size).toBe(0);
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getSettlementLookup()).rejects.toThrow('boom');
  });
});
