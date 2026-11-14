import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { requestPasswordReset, resetPassword } from './auth-api';
import { usePasswordRecovery, type RecoveryField } from './use-password-recovery';

vi.mock('./auth-api', () => ({ requestPasswordReset: vi.fn(), resetPassword: vi.fn() }));

const requestMock = vi.mocked(requestPasswordReset);
const resetMock = vi.mocked(resetPassword);

type Hook = ReturnType<typeof renderHook<ReturnType<typeof usePasswordRecovery>, unknown>>['result'];

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

function type(result: Hook, values: Partial<Record<RecoveryField, string>>) {
  for (const [field, value] of Object.entries(values)) {
    act(() => result.current.setField(field as RecoveryField)(change(value)));
  }
}

async function reachResetStep(result: Hook) {
  type(result, { phone: '300 123 4567' });
  await act(() => result.current.submit(submitEvent()));
}

const RESET = { code: '048 213', newPassword: 'nueva-clave-segura-1', confirmPassword: 'nueva-clave-segura-1' };

beforeEach(() => {
  vi.clearAllMocks();
  requestMock.mockResolvedValue(undefined);
  resetMock.mockResolvedValue(undefined);
});

const setup = () => renderHook(() => usePasswordRecovery()).result;

describe('usePasswordRecovery — request step', () => {
  it('starts asking for the phone', () => {
    expect(setup().current.step).toBe('request');
  });

  it('asks for a valid phone before calling the API', async () => {
    const result = setup();

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.phone).toBe('Escribe tu celular.');
    expect(requestMock).not.toHaveBeenCalled();
  });

  it('requests the code with the E.164 phone and moves to the reset step', async () => {
    const result = setup();

    await reachResetStep(result);

    expect(requestMock).toHaveBeenCalledWith('+573001234567', undefined);
    expect(result.current.step).toBe('reset');
  });

  it('shows a rate-limit error in the form', async () => {
    requestMock.mockRejectedValue(new ApiRequestError({ statusCode: 429, code: 'RATE_LIMITED', message: 'x', retryAfterSeconds: 120 }));
    const result = setup();

    await reachResetStep(result);

    expect(result.current.step).toBe('request');
    expect(result.current.formError).toContain('2 minutos');
    expect(result.current.isSubmitting).toBe(false);
  });
});

describe('usePasswordRecovery — reset step', () => {
  it('validates the code and the confirmation before calling the API', async () => {
    const result = setup();
    await reachResetStep(result);
    type(result, { code: '12', newPassword: 'nueva-clave-segura-1', confirmPassword: 'otra' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors).toMatchObject({ code: 'El código tiene 6 dígitos.', confirmPassword: 'Las contraseñas no coinciden.' });
    expect(resetMock).not.toHaveBeenCalled();
  });

  it('redeems the code with the normalised data and finishes', async () => {
    const result = setup();
    await reachResetStep(result);
    type(result, RESET);

    await act(() => result.current.submit(submitEvent()));

    expect(resetMock).toHaveBeenCalledWith({ phone: '+573001234567', code: '048213', newPassword: 'nueva-clave-segura-1' });
    expect(result.current.step).toBe('done');
  });

  it.each([
    ['PASSWORD_RESET_CODE_INVALID', 'code', 'no es correcto'],
    ['PASSWORD_RESET_CODE_EXPIRED', 'code', 'venció'],
    ['PASSWORD_TOO_WEAK', 'newPassword', 'fácil de adivinar'],
  ] as const)('puts %s on the %s field', async (code, field, text) => {
    resetMock.mockRejectedValue(new ApiRequestError({ statusCode: 400, code, message: 'x' }));
    const result = setup();
    await reachResetStep(result);
    type(result, RESET);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors[field]).toContain(text);
    expect(result.current.step).toBe('reset');
  });

  it('resends a code and confirms it', async () => {
    const result = setup();
    await reachResetStep(result);

    await act(() => result.current.resendCode());

    expect(requestMock).toHaveBeenCalledTimes(2);
    expect(result.current.codeResent).toBe(true);
  });

  it('does not resend without a valid phone', async () => {
    const result = setup();

    await act(() => result.current.resendCode());

    expect(requestMock).not.toHaveBeenCalled();
  });

  it('goes back to change the phone', async () => {
    const result = setup();
    await reachResetStep(result);

    act(() => result.current.changePhone());

    expect(result.current.step).toBe('request');
    expect(result.current.values.phone).toBe('300 123 4567');
  });

  it('ignores a submit once it is done', async () => {
    const result = setup();
    await reachResetStep(result);
    type(result, RESET);
    await act(() => result.current.submit(submitEvent()));

    await act(() => result.current.submit(submitEvent()));

    expect(resetMock).toHaveBeenCalledTimes(1);
  });
});
