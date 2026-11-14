import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { EXISTING_CLIENT_REQUEST, NEW_CLIENT_REQUEST } from '@/test/loan-request-fixture';
import { approveLoanRequest, rejectLoanRequest } from './loan-requests-api';
import { buildApproveBody, initialReviewValues, useReviewLoanRequest } from './use-review-loan-request';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./loan-requests-api', () => ({ approveLoanRequest: vi.fn(), rejectLoanRequest: vi.fn() }));
const approve = vi.mocked(approveLoanRequest);
const reject = vi.mocked(rejectLoanRequest);

const typed = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const typedArea = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLTextAreaElement>;

beforeEach(() => {
  vi.clearAllMocks();
  approve.mockResolvedValue({} as never);
  reject.mockResolvedValue({} as never);
});

describe('initialReviewValues', () => {
  it('starts with what the collector asked for', () => {
    expect(initialReviewValues(NEW_CLIENT_REQUEST)).toMatchObject({ fullName: 'Rosa Pardo', principalAmount: 500_000, installmentCount: '20', frequency: 'DAILY', startDate: '2026-12-01' });
  });

  it('leaves the client fields empty when the client already existed', () => {
    expect(initialReviewValues(EXISTING_CLIENT_REQUEST)).toMatchObject({ fullName: '', phone: '' });
  });
});

describe('buildApproveBody', () => {
  it('sends nothing when nothing changed', () => {
    expect(buildApproveBody(initialReviewValues(NEW_CLIENT_REQUEST), NEW_CLIENT_REQUEST)).toEqual({});
  });

  it('sends only the fields that changed', () => {
    const values = {
      ...initialReviewValues(NEW_CLIENT_REQUEST),
      fullName: 'Rosa Elena Pardo',
      occupation: 'Comerciante',
      phone: '+573009998877',
      address: 'Calle 1',
      principalAmount: 400_000,
      installmentCount: '10',
      installmentValue: 45_000,
      totalPayable: 450_000,
      frequency: 'WEEKLY',
      startDate: '2026-12-10',
    };

    expect(buildApproveBody(values, NEW_CLIENT_REQUEST)).toEqual({
      client: { fullName: 'Rosa Elena Pardo', occupation: 'Comerciante', phone: '+573009998877', address: 'Calle 1' },
      loan: { principalAmount: 400_000, installmentCount: 10, installmentValue: 45_000, totalPayable: 450_000, frequency: 'WEEKLY', startDate: '2026-12-10' },
    });
  });

  it('ignores empty amounts and an unreadable count, and never sends client data for an existing client', () => {
    const values = { ...initialReviewValues(EXISTING_CLIENT_REQUEST), fullName: 'Otro', principalAmount: null, installmentValue: null, totalPayable: null, installmentCount: 'abc' };

    expect(buildApproveBody(values, EXISTING_CLIENT_REQUEST)).toEqual({});
  });
});

describe('useReviewLoanRequest', () => {
  it('approves with the adjustments and refreshes', async () => {
    const { result } = renderHook(() => useReviewLoanRequest(NEW_CLIENT_REQUEST));
    act(() => result.current.setAmount('principalAmount')(450_000));
    act(() => result.current.setText('fullName')(typed('Rosa E. Pardo')));
    act(() => result.current.setStartDate('2026-12-02'));

    await act(() => result.current.approve());

    expect(approve).toHaveBeenCalledWith(NEW_CLIENT_REQUEST.id, {
      client: { fullName: 'Rosa E. Pardo' },
      loan: { principalAmount: 450_000, startDate: '2026-12-02' },
    });
    expect(result.current.notice).toMatch(/aceptada/);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toBeNull();
  });

  it('rejects with the typed reason', async () => {
    const { result } = renderHook(() => useReviewLoanRequest(NEW_CLIENT_REQUEST));
    act(() => result.current.changeReason(typedArea('Está en mora')));

    await act(() => result.current.reject());

    expect(reject).toHaveBeenCalledWith(NEW_CLIENT_REQUEST.id, 'Está en mora');
    expect(result.current.notice).toMatch(/rechazada/);
  });

  it('explains a conflict without refreshing', async () => {
    approve.mockRejectedValue(new ApiRequestError({ statusCode: 409, code: 'CONFLICT', message: 'x' } as never));
    const { result } = renderHook(() => useReviewLoanRequest(NEW_CLIENT_REQUEST));

    await act(() => result.current.approve());

    expect(result.current.error).toMatch(/ya fue resuelta/);
    expect(result.current.notice).toBeNull();
    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.pending).toBeNull();
  });

  it('ignores a second decision while one is in flight', async () => {
    let finish: (value: never) => void = () => undefined;
    approve.mockReturnValue(new Promise((resolve) => { finish = resolve as never; }));
    const { result } = renderHook(() => useReviewLoanRequest(NEW_CLIENT_REQUEST));

    act(() => { void result.current.approve(); });
    await act(() => result.current.reject());

    expect(reject).not.toHaveBeenCalled();
    await act(async () => { finish({} as never); });
  });
});
