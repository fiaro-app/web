import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

const { createCheckout } = vi.hoisted(() => ({ createCheckout: vi.fn() }));
vi.mock('./checkout-api', () => ({ createCheckout }));

import { useCheckout } from './use-checkout';

const CHECKOUT = {
  reference: 'fiaro-abc',
  planCode: 'PRO',
  months: 1,
  checkout: {
    url: 'https://checkout.wompi.co/p/',
    publicKey: 'pub_test_abc',
    currency: 'COP',
    amountInCents: 6_900_000,
    reference: 'fiaro-abc',
    signatureIntegrity: 'firma',
    redirectUrl: 'https://app.fiaro.co/plan',
  },
};

const assign = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'location', { configurable: true, value: { origin: 'https://app.fiaro.co', assign } });
});

describe('useCheckout', () => {
  it('creates the order and sends the person to Wompi', async () => {
    createCheckout.mockResolvedValue(CHECKOUT);
    const { result } = renderHook(() => useCheckout());

    await act(() => result.current.pay('PRO'));

    expect(createCheckout).toHaveBeenCalledExactlyOnceWith('PRO');
    expect(assign).toHaveBeenCalledOnce();
    expect(String(assign.mock.calls[0]?.[0])).toContain('https://checkout.wompi.co/p/?');
    expect(result.current.payingPlan).toBe('PRO');
  });

  it('shows why it failed and frees the buttons', async () => {
    createCheckout.mockRejectedValue(new ApiRequestError({ statusCode: 503, code: 'BILLING_UNAVAILABLE', message: 'x' } as never));
    const { result } = renderHook(() => useCheckout());

    await act(() => result.current.pay('INDIVIDUAL'));

    expect(result.current.error).toMatch(/no está disponible/);
    expect(result.current.payingPlan).toBeNull();
    expect(assign).not.toHaveBeenCalled();
  });

  it('ignores a second click while an order is being created', async () => {
    let resolve: (value: unknown) => void = () => undefined;
    createCheckout.mockReturnValue(new Promise((done) => (resolve = done)));
    const { result } = renderHook(() => useCheckout());

    await act(async () => {
      void result.current.pay('PRO');
      await Promise.resolve();
    });
    await act(() => result.current.pay('TEAM'));
    await act(async () => resolve(CHECKOUT));

    expect(createCheckout).toHaveBeenCalledTimes(1);
  });
});
