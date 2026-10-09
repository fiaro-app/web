import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { revokeAllSessions, revokeOtherSessions, revokeSession } from './account-api';
import { useSessionActions } from './use-session-actions';

const replace = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./account-api', () => ({ revokeOtherSessions: vi.fn(), revokeAllSessions: vi.fn(), revokeSession: vi.fn() }));

const others = vi.mocked(revokeOtherSessions);
const all = vi.mocked(revokeAllSessions);
const one = vi.mocked(revokeSession);

beforeEach(() => {
  vi.clearAllMocks();
  others.mockResolvedValue({} as never);
  all.mockResolvedValue({} as never);
  one.mockResolvedValue(undefined);
});

describe('useSessionActions', () => {
  it('closes the other sessions and stays on the page', async () => {
    const { result } = renderHook(() => useSessionActions());

    await act(() => result.current.closeOthers());

    expect(result.current.notice).toBe('Cerramos tus otras sesiones.');
    expect(replace).not.toHaveBeenCalled();
  });

  it('closes one session and refreshes the list', async () => {
    const { result } = renderHook(() => useSessionActions());

    await act(() => result.current.closeOne('s2'));

    expect(one).toHaveBeenCalledWith('s2');
    expect(result.current.notice).toBe('Cerramos esa sesión.');
    expect(refresh).toHaveBeenCalled();
  });

  it('closes every session and goes to the login', async () => {
    const { result } = renderHook(() => useSessionActions());

    await act(() => result.current.closeAll());

    expect(replace).toHaveBeenCalledWith('/login');
    expect(refresh).toHaveBeenCalled();
  });

  it('shows the error when the API fails', async () => {
    others.mockRejectedValueOnce(new ApiRequestError({ statusCode: 429, code: 'RATE_LIMITED', message: 'x' }));
    const { result } = renderHook(() => useSessionActions());

    await act(() => result.current.closeOthers());

    expect(result.current.error).toMatch(/Demasiadas solicitudes/);
    expect(result.current.isBusy).toBe(false);
  });
});
