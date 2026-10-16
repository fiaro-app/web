import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loanRequestEndpoints } from './endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { approveLoanRequest, rejectLoanRequest } from './loan-requests-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({});
});

describe('loan requests api', () => {
  it('approves with the adjustments', async () => {
    await approveLoanRequest('r1', { loan: { principalAmount: 400_000 } });
    expect(callEndpoint).toHaveBeenCalledWith(loanRequestEndpoints.approve, { params: { id: 'r1' }, body: { loan: { principalAmount: 400_000 } } });
  });

  it('rejects with the trimmed reason', async () => {
    await rejectLoanRequest('r1', '  Está en mora ');
    expect(callEndpoint).toHaveBeenCalledWith(loanRequestEndpoints.reject, { params: { id: 'r1' }, body: { reason: 'Está en mora' } });
  });

  it('omits an empty reason instead of sending an empty string', async () => {
    await rejectLoanRequest('r1', '   ');
    expect(callEndpoint).toHaveBeenCalledWith(loanRequestEndpoints.reject, { params: { id: 'r1' }, body: {} });
  });
});
