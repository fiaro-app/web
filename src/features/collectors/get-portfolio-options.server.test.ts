import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getPortfolioOptions } from './get-portfolio-options.server';

describe('getPortfolioOptions', () => {
  it('keeps only id and name of each portfolio', async () => {
    callEndpointAsUser.mockResolvedValue([{ id: 'p1', name: 'Zona Norte', lenderId: 'l', createdAt: 'x' }]);
    expect(await getPortfolioOptions()).toEqual([{ id: 'p1', name: 'Zona Norte' }]);
  });
});
