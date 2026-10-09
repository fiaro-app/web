import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser, getSettlementLookup } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn(), getSettlementLookup: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));
vi.mock('@/features/settlements/get-settlement-lookup.server', () => ({ getSettlementLookup }));

import { getLoanVisits } from './get-visits.server';

const ID = '0190f7a0-0000-7000-8000-000000000001';
const VISIT = {
  id: ID,
  loanId: ID,
  collectorMembershipId: ID,
  outcome: 'NOT_FOUND',
  expectedAmount: 30_000,
  promisedDate: null,
  occurredAt: '2026-10-01T15:00:00.000Z',
  createdAt: '2026-10-01T15:00:05.000Z',
  payment: null,
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
  getSettlementLookup.mockReset();
  getSettlementLookup.mockResolvedValue({ collectorNames: new Map([[ID, 'Alejo Zuleta']]) });
});

describe('getLoanVisits', () => {
  it('returns the rows with the collector names', async () => {
    callEndpointAsUser.mockResolvedValue([VISIT]);

    const rows = await getLoanVisits(ID);

    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ params: { loanId: ID } });
    expect(rows[0]).toMatchObject({ collectorName: 'Alejo Zuleta', outcome: 'No encontrado' });
  });

  it('returns no history when the API fails, so the loan still opens', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'x' }));

    await expect(getLoanVisits(ID)).resolves.toEqual([]);
  });

  it('does not hide an unexpected failure', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockRejectedValue(bug);

    await expect(getLoanVisits(ID)).rejects.toBe(bug);
  });
});
