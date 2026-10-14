import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getLoanInstallments } from './get-installments.server';

const INSTALLMENT = { number: 1, dueDate: '2026-10-01', expectedAmount: 30_000, paidAmount: 0, status: 'PENDING' };

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getLoanInstallments', () => {
  it('returns the installments of the loan', async () => {
    callEndpointAsUser.mockResolvedValue({ loanId: 'l1', asOf: '2026-10-09', installments: [INSTALLMENT] });

    await expect(getLoanInstallments('l1')).resolves.toEqual([INSTALLMENT]);
    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ params: { loanId: 'l1' } });
  });

  it('shows the loan without a calendar when the API fails', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' }));

    await expect(getLoanInstallments('l1')).resolves.toEqual([]);
  });

  it('does not hide an unexpected failure', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockRejectedValue(bug);

    await expect(getLoanInstallments('l1')).rejects.toBe(bug);
  });
});
