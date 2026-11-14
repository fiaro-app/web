import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClientRisk } from '@/features/risk/use-client-risk';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', () => ({ callEndpoint }));

const RISK = { clientId: 'c1', score: 90, level: 'VERY_HIGH', loansCount: 1, factors: [] };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useClientRisk', () => {
  it('returns the view of the chosen client', async () => {
    callEndpoint.mockResolvedValue({ data: [RISK] });
    const { result } = renderHook(() => useClientRisk('c1'));

    await waitFor(() => expect(result.current?.level).toBe('VERY_HIGH'));
  });

  it('does not call the API without a client', () => {
    const { result } = renderHook(() => useClientRisk(''));

    expect(result.current).toBeNull();
    expect(callEndpoint).not.toHaveBeenCalled();
  });

  it('stays null when the request fails', async () => {
    callEndpoint.mockRejectedValue(new Error('x'));
    const { result } = renderHook(() => useClientRisk('c1'));

    await waitFor(() => expect(callEndpoint).toHaveBeenCalled());
    expect(result.current).toBeNull();
  });

  it('drops the previous client’s risk while the next one loads', async () => {
    callEndpoint.mockResolvedValueOnce({ data: [RISK] }).mockReturnValue(new Promise(() => undefined));
    const { result, rerender } = renderHook(({ id }) => useClientRisk(id), { initialProps: { id: 'c1' } });
    await waitFor(() => expect(result.current).not.toBeNull());

    rerender({ id: 'c2' });

    expect(result.current).toBeNull();
  });
});
