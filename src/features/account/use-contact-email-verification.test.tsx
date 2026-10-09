import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { requestContactEmailVerification, verifyContactEmail } from './account-api';
import { useContactEmailVerification } from './use-contact-email-verification';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./account-api', () => ({ requestContactEmailVerification: vi.fn(), verifyContactEmail: vi.fn() }));

const verify = vi.mocked(verifyContactEmail);
const resendApi = vi.mocked(requestContactEmailVerification);
const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;
const api = (code: string) => new ApiRequestError({ statusCode: 400, code, message: 'x' });

beforeEach(() => {
  vi.clearAllMocks();
  verify.mockResolvedValue({} as never);
  resendApi.mockResolvedValue({} as never);
});

describe('useContactEmailVerification', () => {
  it('validates the code before calling the API', async () => {
    const { result } = renderHook(() => useContactEmailVerification());
    act(() => result.current.changeCode(change('12')));

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.codeError).toBe('El código tiene 6 dígitos.');
    expect(verify).not.toHaveBeenCalled();
  });

  it('verifies and refreshes', async () => {
    const { result } = renderHook(() => useContactEmailVerification());
    act(() => result.current.changeCode(change('123 456')));

    await act(() => result.current.submit(submitEvent()));

    expect(verify).toHaveBeenCalledWith('123456');
    expect(refresh).toHaveBeenCalled();
  });

  it('marks a wrong or expired code on the field and other errors on the form', async () => {
    const { result } = renderHook(() => useContactEmailVerification());
    act(() => result.current.changeCode(change('123456')));
    verify.mockRejectedValueOnce(api('CONTACT_EMAIL_VERIFICATION_CODE_INVALID'));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.codeError).toMatch(/no es correcto/);

    verify.mockRejectedValueOnce(api('CONTACT_EMAIL_ALREADY_VERIFIED'));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.formError).toBe('Tu correo ya está verificado.');
  });

  it('asks for a new code and reports a failure', async () => {
    const { result } = renderHook(() => useContactEmailVerification());

    await act(() => result.current.resend());
    expect(result.current.notice).toMatch(/código nuevo/);

    resendApi.mockRejectedValueOnce(api('CONTACT_EMAIL_NOT_SET'));
    await act(() => result.current.resend());
    expect(result.current.formError).toBe('Primero agrega un correo de contacto.');
  });
});
