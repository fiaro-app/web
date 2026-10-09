import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { reversePayment } from './visits-api';
import { useReversePayment } from './use-reverse-payment';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./visits-api', () => ({ reversePayment: vi.fn() }));

const reverse = vi.mocked(reversePayment);
const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLTextAreaElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;
const api = (code: string) => new ApiRequestError({ statusCode: 409, code, message: 'x' });

beforeEach(() => {
  vi.clearAllMocks();
  reverse.mockResolvedValue({} as never);
});

describe('useReversePayment', () => {
  it('asks for a reason before calling the API', async () => {
    const { result } = renderHook(() => useReversePayment('p1'));

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.reasonError).toBe('Escribe el motivo de la reversión.');
    expect(reverse).not.toHaveBeenCalled();
  });

  it('reverses with the trimmed reason and refreshes', async () => {
    const { result } = renderHook(() => useReversePayment('p1'));
    act(() => result.current.changeReason(change('  Monto equivocado  ')));

    await act(() => result.current.submit(submitEvent()));

    expect(reverse).toHaveBeenCalledWith('p1', 'Monto equivocado');
    expect(refresh).toHaveBeenCalled();
  });

  it.each([
    ['FORBIDDEN', /Solo quien administra/],
    ['CONFLICT', /ya estaba revertido/],
    ['NOT_FOUND', /No encontramos el pago/],
    ['RATE_LIMITED', /Demasiadas solicitudes/],
  ])('explains a %s error', async (code, message) => {
    reverse.mockRejectedValueOnce(api(code));
    const { result } = renderHook(() => useReversePayment('p1'));
    act(() => result.current.changeReason(change('x')));

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.error).toMatch(message);
    expect(result.current.isSubmitting).toBe(false);
  });
});
