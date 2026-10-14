import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signOut } from './auth-api';
import { useSignOut } from './use-sign-out';

const replace = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./auth-api', () => ({ signOut: vi.fn() }));

const signOutMock = vi.mocked(signOut);

beforeEach(() => vi.clearAllMocks());

describe('useSignOut', () => {
  it('closes the session and goes to login', async () => {
    signOutMock.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignOut());

    await act(() => result.current.signOut());

    expect(signOutMock).toHaveBeenCalledOnce();
    expect(replace).toHaveBeenCalledWith('/login');
    expect(refresh).toHaveBeenCalled();
    expect(result.current.isSigningOut).toBe(true);
  });

  it('goes to login even if the API call fails', async () => {
    signOutMock.mockRejectedValue(new Error('red caída'));
    const { result } = renderHook(() => useSignOut());

    await act(() => result.current.signOut());

    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('does nothing when already signing out', async () => {
    signOutMock.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSignOut());

    await act(() => result.current.signOut());
    await act(() => result.current.signOut());

    expect(signOutMock).toHaveBeenCalledOnce();
  });
});
