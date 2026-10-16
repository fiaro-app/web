import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { clearNotifications, deleteNotification } from './notifications-api';
import { useDeleteNotifications } from './use-delete-notifications';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./notifications-api', () => ({ deleteNotification: vi.fn(), clearNotifications: vi.fn() }));
const deleteMock = vi.mocked(deleteNotification);
const clearMock = vi.mocked(clearNotifications);

beforeEach(() => {
  vi.clearAllMocks();
  deleteMock.mockResolvedValue(undefined as never);
  clearMock.mockResolvedValue({ deleted: 3 } as never);
});

describe('useDeleteNotifications', () => {
  it('deletes one notification and refreshes', async () => {
    const { result } = renderHook(() => useDeleteNotifications());

    await act(() => result.current.remove('n1'));

    expect(deleteMock).toHaveBeenCalledWith('n1');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.pendingId).toBeNull();
  });

  it('clears only the read ones, or all of them', async () => {
    const { result } = renderHook(() => useDeleteNotifications());

    await act(() => result.current.clear(true));
    await act(() => result.current.clear(false));

    expect(clearMock).toHaveBeenNthCalledWith(1, true);
    expect(clearMock).toHaveBeenNthCalledWith(2, false);
    expect(refresh).toHaveBeenCalledTimes(2);
    expect(result.current.isClearing).toBe(false);
  });

  it('explains that the notification no longer exists', async () => {
    deleteMock.mockRejectedValue(new ApiRequestError({ statusCode: 404, code: 'NOT_FOUND', message: 'x' } as never));
    const { result } = renderHook(() => useDeleteNotifications());

    await act(() => result.current.remove('n1'));

    expect(result.current.error).toBe('Esa notificación ya no existe. Actualiza la página.');
    expect(refresh).not.toHaveBeenCalled();
  });

  it('uses the general message for any other failure', async () => {
    clearMock.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useDeleteNotifications());

    await act(() => result.current.clear(false));

    expect(result.current.error).toEqual(expect.any(String));
    expect(result.current.isClearing).toBe(false);
  });

  it('ignores a second action while one is in flight', async () => {
    let finish: (value: never) => void = () => undefined;
    deleteMock.mockReturnValue(new Promise((resolve) => { finish = resolve as never; }));
    const { result } = renderHook(() => useDeleteNotifications());

    act(() => { void result.current.remove('n1'); });
    await act(() => result.current.clear(true));
    await act(() => result.current.remove('n2'));

    expect(clearMock).not.toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledTimes(1);
    await act(async () => { finish(undefined as never); });
  });
});
