import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { registerOwner, signIn } from './auth-api';
import type { RegisterField } from './register-schemas';
import { useRegisterForm } from './use-register-form';

vi.mock('@/components/molecules/TurnstileWidget', () => ({ turnstileEnabled: true }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));
vi.mock('./auth-api', () => ({ registerOwner: vi.fn(), signIn: vi.fn() }));
const registerMock = vi.mocked(registerOwner);

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

async function reachCompanyStep() {
  const { result } = renderHook(() => useRegisterForm({ redirectTo: '/resumen' }));
  const values: Partial<Record<RegisterField, string>> = {
    fullName: 'Ana Pérez',
    phone: '300 123 4567',
    nationalId: '1020304050',
    password: 'una-contraseña',
  };
  for (const [field, value] of Object.entries(values)) act(() => result.current.setField(field as RegisterField)(change(value)));
  await act(() => result.current.submit(submitEvent()));
  act(() => result.current.setField('businessName')(change('Préstamos Ana')));
  return result;
}

beforeEach(() => {
  vi.clearAllMocks();
  registerMock.mockResolvedValue({} as never);
  vi.mocked(signIn).mockResolvedValue({} as never);
});

describe('useRegisterForm with Turnstile on', () => {
  it('asks to finish the bot check before registering', async () => {
    const result = await reachCompanyStep();

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toBe('Completa la verificación de seguridad para continuar.');
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('sends the token and, if the API rejects it, asks for a new challenge', async () => {
    const result = await reachCompanyStep();
    registerMock.mockRejectedValueOnce(new ApiRequestError({ statusCode: 400, code: 'TURNSTILE_FAILED', message: 'x', issues: [], retryAfterSeconds: null }));
    act(() => result.current.setTurnstileToken('tok'));
    const before = result.current.turnstileResetKey;

    await act(() => result.current.submit(submitEvent()));

    expect(registerMock).toHaveBeenCalledWith(expect.anything(), { businessName: 'Préstamos Ana' }, 'tok');
    expect(result.current.turnstileResetKey).toBe(before + 1);
    expect(result.current.formError).toMatch(/verificar que eres una persona/);
  });

  it('explains when the widget fails to load', async () => {
    const result = await reachCompanyStep();

    act(() => result.current.turnstileError());

    expect(result.current.formError).toMatch(/verificación de seguridad/);
  });
});
