import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { cancelLoan } from './loans-api';
import { useCancelLoan } from './use-cancel-loan';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./loans-api', () => ({ cancelLoan: vi.fn() }));
const cancelMock = vi.mocked(cancelLoan);

beforeEach(() => {
  vi.clearAllMocks();
  cancelMock.mockResolvedValue({} as never);
});

describe('useCancelLoan', () => {
  it('cancels the loan and refreshes the page', async () => {
    const { result } = renderHook(() => useCancelLoan('l1'));
    await act(() => result.current.cancel());
    expect(cancelMock).toHaveBeenCalledWith('l1');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.isCanceling).toBe(false);
  });

  it('reports why the API refused, without refreshing', async () => {
    cancelMock.mockRejectedValue(new ApiRequestError({ statusCode: 422, code: 'LOAN_NOT_CANCELABLE', message: 'x' }));
    const { result } = renderHook(() => useCancelLoan('l1'));
    await act(() => result.current.cancel());
    expect(result.current.error).toMatch(/ya no se puede anular/);
    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.isCanceling).toBe(false);
  });
});
