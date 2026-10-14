import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { deactivateAccount } from './account-api';
import { useDeactivateAccount } from './use-deactivate-account';

const replace = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./account-api', () => ({ deactivateAccount: vi.fn() }));

const deactivate = vi.mocked(deactivateAccount);
const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

beforeEach(() => {
  vi.clearAllMocks();
  deactivate.mockResolvedValue({} as never);
});

describe('useDeactivateAccount', () => {
  it('asks for the password first', async () => {
    const { result } = renderHook(() => useDeactivateAccount());

    act(() => result.current.submit(submitEvent()));

    expect(result.current.passwordError).toBe('Escribe tu contraseña para confirmar.');
    expect(deactivate).not.toHaveBeenCalled();
  });

  it('lets the person cancel the confirmation', () => {
    const { result } = renderHook(() => useDeactivateAccount());
    act(() => result.current.changePassword(change('mi-clave')));
    act(() => result.current.submit(submitEvent()));
    act(() => result.current.cancel());

    expect(result.current.isConfirming).toBe(false);
    expect(deactivate).not.toHaveBeenCalled();
  });

  it('deactivates and goes to the login', async () => {
    const { result } = renderHook(() => useDeactivateAccount());
    act(() => result.current.changePassword(change('mi-clave')));

    act(() => result.current.submit(submitEvent()));
    expect(result.current.isConfirming).toBe(true);
    expect(deactivate).not.toHaveBeenCalled();
    await act(() => result.current.confirm());

    expect(deactivate).toHaveBeenCalledWith('mi-clave');
    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('marks a wrong password on the field and other errors on the form', async () => {
    const { result } = renderHook(() => useDeactivateAccount());
    act(() => result.current.changePassword(change('mala')));
    deactivate.mockRejectedValueOnce(new ApiRequestError({ statusCode: 400, code: 'INVALID_PASSWORD', message: 'x' }));
    act(() => result.current.submit(submitEvent()));
    await act(() => result.current.confirm());
    expect(result.current.passwordError).toBe('La contraseña actual no es correcta.');

    deactivate.mockRejectedValueOnce(new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' }));
    act(() => result.current.submit(submitEvent()));
    await act(() => result.current.confirm());
    expect(result.current.formError).not.toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });
});
