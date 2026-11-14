import { act, renderHook } from '@testing-library/react';
import type { SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { refundPayment } from './refund-api';
import { useRefund } from './use-refund';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./refund-api', () => ({ refundPayment: vi.fn() }));

const refund = vi.mocked(refundPayment);
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;
const failure = (code: string) => new ApiRequestError({ statusCode: 422, code, message: 'x' });

beforeEach(() => {
  vi.clearAllMocks();
  refund.mockResolvedValue({} as never);
});

describe('useRefund', () => {
  it('asks for the reason first', async () => {
    const { result } = renderHook(() => useRefund('fiaro-1'));

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.error).toBe('Escribe el motivo.');
    expect(refund).not.toHaveBeenCalled();
  });

  it('refunds with the chosen mode and reference, then refreshes the list', async () => {
    const { result } = renderHook(() => useRefund('fiaro-1'));
    act(() => {
      result.current.setMode('WOMPI_VOID');
      result.current.setRefundReference('wompi-9');
      result.current.setReason('Doble cobro');
    });

    await act(() => result.current.submit(submitEvent()));

    expect(refund).toHaveBeenCalledWith('fiaro-1', { mode: 'WOMPI_VOID', reference: 'wompi-9', reason: 'Doble cobro' });
    expect(refresh).toHaveBeenCalled();
  });

  it('leaves the reference out when it is blank', async () => {
    const { result } = renderHook(() => useRefund('fiaro-1'));
    act(() => result.current.setReason('Doble cobro'));

    await act(() => result.current.submit(submitEvent()));

    expect(refund).toHaveBeenCalledWith('fiaro-1', { mode: 'MANUAL', reason: 'Doble cobro' });
  });

  it.each([
    ['PAYMENT_NOT_REFUNDABLE', 'ya no se puede reembolsar'],
    ['REFUND_METHOD_UNSUPPORTED', 'no se puede anular en Wompi'],
    ['REFUND_GATEWAY_FAILED', 'Wompi no aceptó'],
    ['FORBIDDEN', 'No tienes permiso'],
  ])('explains %s', async (code, text) => {
    refund.mockRejectedValue(failure(code));
    const { result } = renderHook(() => useRefund('fiaro-1'));
    act(() => result.current.setReason('x'));

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.error).toContain(text);
    expect(result.current.isSubmitting).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('falls back to the network message', async () => {
    refund.mockRejectedValue(new TypeError('fetch'));
    const { result } = renderHook(() => useRefund('fiaro-1'));
    act(() => result.current.setReason('x'));

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.error).toContain('No pudimos hablar con el servidor');
  });
});
