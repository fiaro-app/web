import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { registerOwner, signIn } from './auth-api';
import type { RegisterField } from './register-schemas';
import { useRegisterForm } from './use-register-form';

const replace = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./auth-api', () => ({ registerOwner: vi.fn(), signIn: vi.fn() }));

const registerMock = vi.mocked(registerOwner);
const signInMock = vi.mocked(signIn);

type Hook = ReturnType<typeof renderHook<ReturnType<typeof useRegisterForm>, unknown>>['result'];

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

function type(result: Hook, values: Partial<Record<RegisterField, string>>) {
  for (const [field, value] of Object.entries(values)) {
    act(() => result.current.setField(field as RegisterField)(change(value)));
  }
}

const ACCOUNT = {
  fullName: 'Ana Pérez',
  phone: '300 123 4567',
  nationalId: '1.020.304.050',
  password: 'una-contraseña',
};

async function reachCompanyStep(result: Hook) {
  type(result, ACCOUNT);
  await act(() => result.current.submit(submitEvent()));
}

beforeEach(() => {
  vi.clearAllMocks();
  registerMock.mockResolvedValue({} as never);
  signInMock.mockResolvedValue({} as never);
});

const setup = () => renderHook(() => useRegisterForm({ redirectTo: '/resumen' })).result;

describe('useRegisterForm — step 1 (account)', () => {
  it('starts on the account step with empty values', () => {
    const result = setup();

    expect(result.current.step).toBe('account');
    expect(result.current.values.fullName).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('stays on the step and shows the errors when the data is incomplete', async () => {
    const result = setup();

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.step).toBe('account');
    expect(Object.keys(result.current.fieldErrors)).toEqual(
      expect.arrayContaining(['fullName', 'phone', 'nationalId', 'password']),
    );
  });

  it('moves to the company step when the account data is valid, without calling the API yet', async () => {
    const result = setup();

    await reachCompanyStep(result);

    expect(result.current.step).toBe('company');
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('clears the error of a field when it is edited', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));

    type(result, { fullName: 'Ana' });

    expect(result.current.fieldErrors.fullName).toBeUndefined();
    expect(result.current.fieldErrors.phone).toBeDefined();
  });
});

describe('useRegisterForm — step 2 (company)', () => {
  it('goes back to the account step keeping what was typed', async () => {
    const result = setup();
    await reachCompanyStep(result);

    act(() => result.current.goBack());

    expect(result.current.step).toBe('account');
    expect(result.current.values.fullName).toBe('Ana Pérez');
  });

  it('asks for the business name', async () => {
    const result = setup();
    await reachCompanyStep(result);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.businessName).toBe('Escribe el nombre de tu financiera.');
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('registers, signs in with the same credentials and goes to the panel', async () => {
    const result = setup();
    await reachCompanyStep(result);
    type(result, { businessName: 'Préstamos Ana' });

    await act(() => result.current.submit(submitEvent()));

    expect(registerMock).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '+573001234567', nationalId: '1020304050', fullName: 'Ana Pérez' }),
      { businessName: 'Préstamos Ana' },
    );
    expect(signInMock).toHaveBeenCalledWith({ phone: '+573001234567', password: 'una-contraseña' });
    expect(replace).toHaveBeenCalledWith('/resumen');
    expect(refresh).toHaveBeenCalled();
  });

  it('sends the person to login when the account was created but the automatic sign-in failed', async () => {
    signInMock.mockRejectedValue(new Error('red'));
    const result = setup();
    await reachCompanyStep(result);
    type(result, { businessName: 'Préstamos Ana' });

    await act(() => result.current.submit(submitEvent()));

    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('returns to the account step with the error on the phone when it is already registered', async () => {
    registerMock.mockRejectedValue(new ApiRequestError({ statusCode: 409, code: 'PHONE_ALREADY_REGISTERED', message: 'x' }));
    const result = setup();
    await reachCompanyStep(result);
    type(result, { businessName: 'Préstamos Ana' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.step).toBe('account');
    expect(result.current.fieldErrors.phone).toContain('Ya existe una cuenta');
    expect(result.current.isSubmitting).toBe(false);
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('puts a weak password on the password field', async () => {
    registerMock.mockRejectedValue(new ApiRequestError({ statusCode: 400, code: 'PASSWORD_TOO_WEAK', message: 'x' }));
    const result = setup();
    await reachCompanyStep(result);
    type(result, { businessName: 'Préstamos Ana' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.step).toBe('account');
    expect(result.current.fieldErrors.password).toContain('fácil de adivinar');
  });

  it('shows the API validation issues on their fields', async () => {
    registerMock.mockRejectedValue(
      new ApiRequestError({
        statusCode: 400,
        code: 'VALIDATION_FAILED',
        message: 'x',
        issues: [{ path: ['businessName'], message: 'Nombre no permitido.' }],
      }),
    );
    const result = setup();
    await reachCompanyStep(result);
    type(result, { businessName: 'Préstamos Ana' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.step).toBe('company');
    expect(result.current.fieldErrors.businessName).toBe('Nombre no permitido.');
  });

  it('shows a form-level error for failures that belong to no field', async () => {
    registerMock.mockRejectedValue(new ApiRequestError({ statusCode: 0, code: 'NETWORK_ERROR', message: 'x' }));
    const result = setup();
    await reachCompanyStep(result);
    type(result, { businessName: 'Préstamos Ana' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.step).toBe('company');
    expect(result.current.formError).toContain('No pudimos conectarnos');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('ignores a second submit while the first is in flight', async () => {
    let resolve!: () => void;
    registerMock.mockReturnValue(new Promise((r) => (resolve = () => r({} as never))));
    const result = setup();
    await reachCompanyStep(result);
    type(result, { businessName: 'Préstamos Ana' });

    let first!: Promise<void>;
    act(() => {
      first = result.current.submit(submitEvent());
    });
    await act(() => result.current.submit(submitEvent()));
    await act(async () => {
      resolve();
      await first;
    });

    expect(registerMock).toHaveBeenCalledTimes(1);
  });
});
