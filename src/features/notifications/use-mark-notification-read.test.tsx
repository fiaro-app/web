import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { markNotificationRead } from './notifications-api';
import { useMarkNotificationRead } from './use-mark-notification-read';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./notifications-api', () => ({ markNotificationRead: vi.fn() }));
const markMock = vi.mocked(markNotificationRead);

beforeEach(() => {
  vi.clearAllMocks();
  markMock.mockResolvedValue({} as never);
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

  it('marks every unread notification of the page and refreshes once', async () => {
    const { result } = renderHook(() => useMarkNotificationRead());

    await act(() => result.current.markAllRead(['n1', 'n2', 'n3']));

    expect(markMock.mock.calls.map((call) => call[0])).toEqual(['n1', 'n2', 'n3']);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.isMarkingAll).toBe(false);
  });

  it('keeps going when one fails and says how many could not be marked', async () => {
    markMock.mockResolvedValueOnce({} as never).mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce({} as never);
    const { result } = renderHook(() => useMarkNotificationRead());

    await act(() => result.current.markAllRead(['n1', 'n2', 'n3']));

    expect(markMock).toHaveBeenCalledTimes(3);
    expect(result.current.error).toBe('No pudimos marcar 1 de 3 notificaciones. Inténtalo de nuevo.');
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('says so when none could be marked and does nothing with an empty list', async () => {
    markMock.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useMarkNotificationRead());

    await act(() => result.current.markAllRead(['n1']));
    expect(result.current.error).toBe('No pudimos marcar las notificaciones. Inténtalo de nuevo.');

    markMock.mockClear();
    await act(() => result.current.markAllRead([]));
    expect(markMock).not.toHaveBeenCalled();
  });
});
