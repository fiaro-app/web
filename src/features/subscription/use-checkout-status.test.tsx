import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

const { fetchCheckoutStatus } = vi.hoisted(() => ({ fetchCheckoutStatus: vi.fn() }));
vi.mock('./checkout-api', () => ({ fetchCheckoutStatus }));

import { MAX_POLLS, POLL_INTERVAL_MS, useCheckoutStatus } from './use-checkout-status';

const status = (value: string) => ({
  reference: 'fiaro-abc',
  planCode: 'PRO',
  status: value,
  amountInCents: 6_900_000,
  currency: 'COP',
  createdAt: '2026-10-16T12:00:00.000Z',
  resolvedAt: null,
  periodEndsAt: null,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('useCheckoutStatus', () => {
  it('keeps asking while the order is pending and stops when it resolves', async () => {
    fetchCheckoutStatus.mockResolvedValueOnce(status('PENDING')).mockResolvedValueOnce(status('APPROVED'));
    const { result } = renderHook(() => useCheckoutStatus('fiaro-abc'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current).toEqual({ kind: 'checking' });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);
    });

    expect(result.current).toMatchObject({ kind: 'resolved', status: { status: 'APPROVED' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 3);
    });
    expect(fetchCheckoutStatus).toHaveBeenCalledTimes(2);
  });

  it('a temporary failure does not cut the wait', async () => {
    fetchCheckoutStatus.mockRejectedValueOnce(new Error('red')).mockResolvedValueOnce(status('DECLINED'));
    const { result } = renderHook(() => useCheckoutStatus('fiaro-abc'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS);
    });

    expect(result.current).toMatchObject({ kind: 'resolved', status: { status: 'DECLINED' } });
  });

  it('says the order does not exist', async () => {
    fetchCheckoutStatus.mockRejectedValue(new ApiRequestError({ statusCode: 404, code: 'NOT_FOUND', message: 'x' } as never));
    const { result } = renderHook(() => useCheckoutStatus('fiaro-nope'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current).toEqual({ kind: 'not-found' });
  });

  it('gives up after about two minutes with a pending order', async () => {
    fetchCheckoutStatus.mockResolvedValue(status('PENDING'));
    const { result } = renderHook(() => useCheckoutStatus('fiaro-abc'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * MAX_POLLS);
    });

    expect(result.current).toEqual({ kind: 'slow' });
    expect(fetchCheckoutStatus).toHaveBeenCalledTimes(MAX_POLLS);
  });

  it('stops asking when the page is left', async () => {
    fetchCheckoutStatus.mockResolvedValue(status('PENDING'));
    const { unmount } = renderHook(() => useCheckoutStatus('fiaro-abc'));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    unmount();
    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 5);

    expect(fetchCheckoutStatus).toHaveBeenCalledTimes(1);
  });
});
