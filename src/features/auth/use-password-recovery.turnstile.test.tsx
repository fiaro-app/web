import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestPasswordReset, resetPassword } from './auth-api';
import { usePasswordRecovery } from './use-password-recovery';

vi.mock('@/components/molecules/TurnstileWidget', () => ({ turnstileEnabled: true }));
vi.mock('./auth-api', () => ({ requestPasswordReset: vi.fn(), resetPassword: vi.fn() }));
const requestMock = vi.mocked(requestPasswordReset);

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

function setup() {
  const { result } = renderHook(() => usePasswordRecovery());
  act(() => result.current.setField('phone')(change('300 123 4567')));
  return result;
}

beforeEach(() => {
  vi.clearAllMocks();
  requestMock.mockResolvedValue(undefined);
  vi.mocked(resetPassword).mockResolvedValue(undefined);
});

describe('usePasswordRecovery with Turnstile on', () => {
  it('asks to finish the bot check before sending the code', async () => {
    const result = setup();

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toBe('Completa la verificación de seguridad para continuar.');
    expect(requestMock).not.toHaveBeenCalled();
    expect(result.current.step).toBe('request');
  });

  it('sends the token, then needs a new challenge to resend the code', async () => {
    const result = setup();
    act(() => result.current.setTurnstileToken('tok'));
    const before = result.current.turnstileResetKey;

    await act(() => result.current.submit(submitEvent()));
    expect(requestMock).toHaveBeenCalledWith('+573001234567', 'tok');
    expect(result.current.turnstileResetKey).toBe(before + 1);

    await act(() => result.current.resendCode());
    expect(requestMock).toHaveBeenCalledOnce();
    expect(result.current.formError).toBe('Completa la verificación de seguridad para continuar.');
  });

  it('explains when the widget fails to load', () => {
    const result = setup();

    act(() => result.current.turnstileError());

    expect(result.current.formError).toMatch(/verificación de seguridad/);
  });
});
