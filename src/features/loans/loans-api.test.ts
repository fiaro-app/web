import { beforeEach, describe, expect, it, vi } from 'vitest';
import { describeLoanError } from './error-messages';
import { loanEndpoints } from './endpoints';
import { ApiRequestError } from '@/lib/api';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { cancelLoan, createLoan } from './loans-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({});
});

describe('loans api', () => {
  it('creates with the form values as the body', async () => {
    const values = {
      clientId: 'c',
      principalAmount: 1,
      installmentCount: 1,
      installmentValue: 1,
      totalPayable: 1,
      frequency: 'DAILY' as const,
      startDate: '2026-10-01',
    };
    await createLoan(values);
    expect(callEndpoint).toHaveBeenCalledWith(loanEndpoints.create, { body: values });
  });

  it('cancels by id', async () => {
    await cancelLoan('l1');
    expect(callEndpoint).toHaveBeenCalledWith(loanEndpoints.cancel, { params: { id: 'l1' } });
  });
});

describe('describeLoanError', () => {
  const apiError = (code: string) => new ApiRequestError({ statusCode: 400, code, message: 'x' } as never);

  it.each([
    ['LOAN_NOT_CANCELABLE', /ya no se puede anular/],
    ['FORBIDDEN', /permiso/],
    ['SUBSCRIPTION_READ_ONLY', /solo lectura/],
    ['NOT_FOUND', /ya no existe/],
  ])('maps %s', (code, message) => {
    expect(describeLoanError(apiError(code)).message).toMatch(message);
  });

  it('falls back to the generic mapping', () => {
    expect(describeLoanError(new Error('boom')).field).toBeNull();
  });
});
