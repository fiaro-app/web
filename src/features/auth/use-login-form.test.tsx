import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { signIn } from './auth-api';
import { useLoginForm } from './use-login-form';

const replace = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./auth-api', () => ({ signIn: vi.fn() }));

const signInMock = vi.mocked(signIn);

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

function fill(result: ReturnType<typeof renderHook<ReturnType<typeof useLoginForm>, unknown>>['result'], phone: string, password: string) {
  act(() => result.current.setField('phone')(change(phone)));
  act(() => result.current.setField('password')(change(password)));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useLoginForm', () => {
  it('starts empty and idle', () => {
    const { result } = renderHook(() => useLoginForm({ redirectTo: '/resumen' }));

    expect(result.current.values).toEqual({ phone: '', password: '' });
    expect(result.current.fieldErrors).toEqual({});
    expect(result.current.formError).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('shows field errors, without calling the API, when the data is invalid', async () => {
    const { result } = renderHook(() => useLoginForm({ redirectTo: '/resumen' }));

    const event = submitEvent();
    await act(() => result.current.submit(event));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.fieldErrors).toEqual({
      phone: 'Escribe tu celular.',
      password: 'Escribe tu contraseña.',
    });
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('clears the error of a field as soon as it is edited', async () => {
    const { result } = renderHook(() => useLoginForm({ redirectTo: '/resumen' }));
    await act(() => result.current.submit(submitEvent()));

    act(() => result.current.setField('phone')(change('3')));

    expect(result.current.fieldErrors.phone).toBeUndefined();
    expect(result.current.fieldErrors.password).toBeDefined();
  });

  it('signs in with the E.164 phone and goes to the redirect route', async () => {
    signInMock.mockResolvedValue({} as Awaited<ReturnType<typeof signIn>>);
    const { result } = renderHook(() => useLoginForm({ redirectTo: '/clientes' }));
    fill(result, '300 123 4567', 'una-contraseña');

    await act(() => result.current.submit(submitEvent()));

    expect(signInMock).toHaveBeenCalledWith({ phone: '+573001234567', password: 'una-contraseña' });
    expect(replace).toHaveBeenCalledWith('/clientes');
    expect(refresh).toHaveBeenCalled();
    // Sigue "enviando" mientras navega: así no se puede enviar dos veces.
    expect(result.current.isSubmitting).toBe(true);
  });

  it('shows a form-level error for wrong credentials and lets the person retry', async () => {
    signInMock.mockRejectedValue(
      new ApiRequestError({ statusCode: 401, code: 'INVALID_PHONE_NUMBER_OR_PASSWORD', message: 'x' }),
    );
    const { result } = renderHook(() => useLoginForm({ redirectTo: '/resumen' }));
    fill(result, '3001234567', 'mala');

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toBe('El celular o la contraseña no son correctos.');
    expect(result.current.isSubmitting).toBe(false);
    expect(replace).not.toHaveBeenCalled();
  });

  it('puts an error that belongs to a field on that field', async () => {
    signInMock.mockRejectedValue(new ApiRequestError({ statusCode: 400, code: 'INVALID_PHONE', message: 'x' }));
    const { result } = renderHook(() => useLoginForm({ redirectTo: '/resumen' }));
    fill(result, '3001234567', 'x');

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.phone).toContain('celular colombiano');
    expect(result.current.formError).toBeNull();
  });

  it('ignores a second submit while the first is in flight', async () => {
    let resolve!: () => void;
    signInMock.mockReturnValue(new Promise((r) => (resolve = () => r({} as never))));
    const { result } = renderHook(() => useLoginForm({ redirectTo: '/resumen' }));
    fill(result, '3001234567', 'x');

    let first!: Promise<void>;
    act(() => {
      first = result.current.submit(submitEvent());
    });
    await act(() => result.current.submit(submitEvent()));
    await act(async () => {
      resolve();
      await first;
    });

    expect(signInMock).toHaveBeenCalledTimes(1);
  });
});
