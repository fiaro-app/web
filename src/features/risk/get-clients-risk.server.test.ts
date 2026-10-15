import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getClientsRisk } from '@/features/risk/get-clients-risk.server';

const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getClientsRisk', () => {
  it('maps the risk by client id', async () => {
    callEndpointAsUser.mockResolvedValue({ data: [{ clientId: 'c1', score: 10, level: 'LOW', loansCount: 1, factors: [] }] });

    const risks = await getClientsRisk(['c1']);

    expect(risks.get('c1')?.levelLabel).toBe('bajo');
  });

  it('skips the call without clients and returns an empty map when it fails', async () => {
    expect((await getClientsRisk([])).size).toBe(0);
    expect(callEndpointAsUser).not.toHaveBeenCalled();
    callEndpointAsUser.mockRejectedValue(new Error('x'));

    expect((await getClientsRisk(['c1'])).size).toBe(0);
  });
});
