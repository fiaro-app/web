import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { approveSettlement, rejectSettlement } from './settlements-api';
import { useReviewSettlement } from './use-review-settlement';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./settlements-api', () => ({ approveSettlement: vi.fn(), rejectSettlement: vi.fn() }));
const approve = vi.mocked(approveSettlement);
const reject = vi.mocked(rejectSettlement);

const typed = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLTextAreaElement>;

beforeEach(() => {
  vi.clearAllMocks();
  approve.mockResolvedValue({} as never);
  reject.mockResolvedValue({} as never);
});

describe('useReviewSettlement', () => {
  it('approves with the typed note and refreshes', async () => {
    const { result } = renderHook(() => useReviewSettlement('s1'));
    act(() => result.current.changeNote(typed('Todo en orden')));
    await act(() => result.current.approve());
    expect(approve).toHaveBeenCalledWith('s1', 'Todo en orden');
    expect(result.current.notice).toBe('Cuadre aprobado.');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toBeNull();
  });

  it('rejects and says so', async () => {
    const { result } = renderHook(() => useReviewSettlement('s1'));
    await act(() => result.current.reject());
    expect(reject).toHaveBeenCalledWith('s1', '');
    expect(result.current.notice).toBe('Cuadre rechazado.');
  });

  it('explains a conflict without refreshing', async () => {
    approve.mockRejectedValue(new ApiRequestError({ statusCode: 409, code: 'CONFLICT', message: 'x' }));
    const { result } = renderHook(() => useReviewSettlement('s1'));
    await act(() => result.current.approve());
    expect(result.current.error).toMatch(/ya fue revisado/);
    expect(result.current.notice).toBeNull();
    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.pending).toBeNull();
  });
});
