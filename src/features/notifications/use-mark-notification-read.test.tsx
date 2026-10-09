import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { markAllNotificationsRead, markNotificationRead } from './notifications-api';
import { useMarkNotificationRead } from './use-mark-notification-read';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./notifications-api', () => ({ markNotificationRead: vi.fn(), markAllNotificationsRead: vi.fn() }));
const markMock = vi.mocked(markNotificationRead);
const markAllMock = vi.mocked(markAllNotificationsRead);

beforeEach(() => {
  vi.clearAllMocks();
  markMock.mockResolvedValue({} as never);
  markAllMock.mockResolvedValue({ marked: 2 });
});

describe('useMarkNotificationRead', () => {
  it('marks the notification and refreshes the page', async () => {
    const { result } = renderHook(() => useMarkNotificationRead());
    await act(() => result.current.markRead('n1'));
    expect(markMock).toHaveBeenCalledWith('n1');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.pendingId).toBeNull();
  });

  it('explains that a missing notification no longer exists', async () => {
    markMock.mockRejectedValue(new ApiRequestError({ statusCode: 404, code: 'NOT_FOUND', message: 'x' }));
    const { result } = renderHook(() => useMarkNotificationRead());
    await act(() => result.current.markRead('n1'));
    expect(result.current.error).toMatch(/ya no existe/);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('falls back to the generic message for other failures', async () => {
    markMock.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useMarkNotificationRead());
    await act(() => result.current.markRead('n1'));
    expect(result.current.error).toMatch(/No pudimos completar la solicitud/);
    expect(result.current.pendingId).toBeNull();
  });

  it('marks every notification with a single call and refreshes once', async () => {
    const { result } = renderHook(() => useMarkNotificationRead());

    await act(() => result.current.markAllRead());

    expect(markAllMock).toHaveBeenCalledTimes(1);
    expect(markMock).not.toHaveBeenCalled();
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.isMarkingAll).toBe(false);
  });

  it('shows the error and does not refresh when marking all fails', async () => {
    markAllMock.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useMarkNotificationRead());

    await act(() => result.current.markAllRead());

    expect(result.current.error).toMatch(/No pudimos completar la solicitud/);
    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.isMarkingAll).toBe(false);
  });
});
