import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { changePassword } from './auth-api';
import { useChangePasswordForm, type ChangePasswordField } from './use-change-password-form';

const replace = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./auth-api', () => ({ changePassword: vi.fn() }));

const changeMock = vi.mocked(changePassword);

type Hook = ReturnType<typeof renderHook<ReturnType<typeof useChangePasswordForm>, unknown>>['result'];

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

function type(result: Hook, values: Partial<Record<ChangePasswordField, string>>) {
  for (const [field, value] of Object.entries(values)) {
    act(() => result.current.setField(field as ChangePasswordField)(change(value)));
  }
}

const VALID = { currentPassword: 'temporal-1', newPassword: 'nueva-clave-1', confirmPassword: 'nueva-clave-1' };

beforeEach(() => {
  vi.clearAllMocks();
  changeMock.mockResolvedValue({} as never);
});

const setup = () => renderHook(() => useChangePasswordForm({ redirectTo: '/resumen' })).result;

describe('useChangePasswordForm', () => {
  it('validates before calling the API', async () => {
    const result = setup();

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.currentPassword).toBe('Escribe tu contraseña actual.');
    expect(changeMock).not.toHaveBeenCalled();
  });

  it('changes the password and goes to the redirect route', async () => {
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(changeMock).toHaveBeenCalledWith({ currentPassword: 'temporal-1', newPassword: 'nueva-clave-1' });
    expect(replace).toHaveBeenCalledWith('/resumen');
    expect(refresh).toHaveBeenCalled();
  });

  it('puts a wrong current password on its field', async () => {
    changeMock.mockRejectedValue(new ApiRequestError({ statusCode: 400, code: 'INVALID_PASSWORD', message: 'x' }));
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.currentPassword).toBe('La contraseña actual no es correcta.');
    expect(result.current.isSubmitting).toBe(false);
    expect(replace).not.toHaveBeenCalled();
  });

  it('puts a weak new password on the new password field', async () => {
    changeMock.mockRejectedValue(new ApiRequestError({ statusCode: 400, code: 'PASSWORD_TOO_WEAK', message: 'x' }));
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.newPassword).toContain('fácil de adivinar');
  });

  it('shows failures that belong to no field in the form', async () => {
    changeMock.mockRejectedValue(new ApiRequestError({ statusCode: 0, code: 'NETWORK_ERROR', message: 'x' }));
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toContain('No pudimos conectarnos');
  });

  it('maps API validation issues onto the fields', async () => {
    changeMock.mockRejectedValue(
      new ApiRequestError({ statusCode: 400, code: 'VALIDATION_FAILED', message: 'x', issues: [{ path: ['newPassword'], message: 'Muy corta.' }] }),
    );
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.newPassword).toBe('Muy corta.');
  });

  it('ignores a second submit while the first is in flight', async () => {
    let resolve!: () => void;
    changeMock.mockReturnValue(new Promise((r) => (resolve = () => r({} as never))));
    const result = setup();
    type(result, VALID);

    let first!: Promise<void>;
    act(() => {
      first = result.current.submit(submitEvent());
    });
    await act(() => result.current.submit(submitEvent()));
    await act(async () => {
      resolve();
      await first;
    });

    expect(changeMock).toHaveBeenCalledTimes(1);
  });

  it('stays on the page, clears the form and calls onSuccess when it is given', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useChangePasswordForm({ onSuccess }));
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(onSuccess).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(result.current.values.newPassword).toBe('');
  });
});
