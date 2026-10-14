import { beforeEach, describe, expect, it, vi } from 'vitest';
import { collectorEndpoints } from '@/features/collectors/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', () => ({ callEndpoint }));

import { changeCollectorPortfolio, deactivateCollector, inviteCollector, resetCollectorPassword } from './collectors-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({});
});

describe('collectors api', () => {
  it('invites with the COLLECTOR role body', async () => {
    await inviteCollector({
      fullName: 'Luis Gómez',
      nationalId: '1030405060',
      phone: '+573109998877',
      contactEmail: undefined,
      portfolioId: '0192f0a4-7c3e-7000-8000-0000000000aa',
    });
    expect(callEndpoint).toHaveBeenCalledWith(
      membershipEndpoints.invite,
      expect.objectContaining({ body: expect.objectContaining({ roles: ['COLLECTOR'] }) }),
    );
  });

  it('deactivates through the collectors route handing over every loan, and resets the password by membership id', async () => {
    await deactivateCollector('m1', [{ loanId: 'l1', collectorMembershipId: 'm2' }]);
    await resetCollectorPassword('m1');
    expect(callEndpoint).toHaveBeenNthCalledWith(1, collectorEndpoints.deactivate, {
      params: { id: 'm1' },
      body: { reassignments: [{ loanId: 'l1', collectorMembershipId: 'm2' }] },
    });
    expect(callEndpoint).toHaveBeenNthCalledWith(2, membershipEndpoints.resetPassword, { params: { id: 'm1' } });
  });

  it('changes the portfolio keeping every role the person already had', async () => {
    await changeCollectorPortfolio('m1', ['LENDER', 'COLLECTOR'], 'p2');
    expect(callEndpoint).toHaveBeenCalledWith(membershipEndpoints.changeRoles, {
      params: { id: 'm1' },
      body: { roles: ['LENDER', 'COLLECTOR'], portfolioId: 'p2' },
    });
  });
});
