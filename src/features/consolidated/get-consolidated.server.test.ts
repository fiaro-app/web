import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getConsolidated } from './get-consolidated.server';

const FIGURES = { totalPortfolio: 1, portfolioAtRisk: 0, arrearsRate: 0, expectedAmount: 0, collectedAmount: 0, effectiveness: null };
const RESPONSE = {
  from: '2026-11-01',
  to: '2026-11-14',
  lenders: [
    { lenderId: 'a', name: 'A', ...FIGURES },
    { lenderId: 'b', name: 'B', ...FIGURES },
  ],
  totals: FIGURES,
};
const FILTERS = { from: '', to: '', collectorId: '', portfolioId: '' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getConsolidated', () => {
  it('asks for the current month without dates and returns the view', async () => {
    callEndpointAsUser.mockResolvedValue(RESPONSE);

    const view = await getConsolidated(FILTERS);

    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ body: {} });
    expect(view?.rows).toHaveLength(2);
  });

  it('sends the period when the filters have one', async () => {
    callEndpointAsUser.mockResolvedValue(RESPONSE);

    await getConsolidated({ ...FILTERS, from: '2026-10-01', to: '2026-10-31' });

    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ body: { dateRange: { from: '2026-10-01', to: '2026-10-31' } } });
  });

  it('returns null when the API fails: the rest of Estadísticas still shows', async () => {
    callEndpointAsUser.mockRejectedValue(new Error('caída'));

    expect(await getConsolidated(FILTERS)).toBeNull();
  });
});
