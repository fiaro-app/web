import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { updateProfile } from './account-api';
import { useProfileForm } from './use-profile-form';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./account-api', () => ({ updateProfile: vi.fn() }));

const update = vi.mocked(updateProfile);
const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;
const CURRENT = { fullName: 'Ana Pérez', contactEmail: null };

beforeEach(() => {
  vi.clearAllMocks();
  update.mockResolvedValue({} as never);
});

describe('useProfileForm', () => {
  it('starts with the current data and says there is nothing to save when nothing changed', async () => {
    const { result } = renderHook(() => useProfileForm(CURRENT));
    expect(result.current.values).toEqual({ fullName: 'Ana Pérez', contactEmail: '' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.notice).toBe('No hay cambios para guardar.');
    expect(update).not.toHaveBeenCalled();
  });

  it('validates before calling the API', async () => {
    const { result } = renderHook(() => useProfileForm(CURRENT));
    act(() => result.current.setField('contactEmail')(change('no-es-correo')));

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.contactEmail).toBe('Escribe un correo válido.');
    expect(update).not.toHaveBeenCalled();
  });

  it('sends only the changes, refreshes and warns that a code was sent when an email was set', async () => {
    const { result } = renderHook(() => useProfileForm(CURRENT));
    act(() => result.current.setField('contactEmail')(change('ana@correo.com')));

    await act(() => result.current.submit(submitEvent()));

    expect(update).toHaveBeenCalledWith({ contactEmail: 'ana@correo.com' });
    expect(result.current.notice).toBe('Guardado. Te enviamos un código para verificar el correo.');
    expect(refresh).toHaveBeenCalled();
  });

  it('shows an API error on the email field or on the form', async () => {
    const { result } = renderHook(() => useProfileForm(CURRENT));
    act(() => result.current.setField('fullName')(change('Ana P.')));
    update.mockRejectedValueOnce(new ApiRequestError({ statusCode: 429, code: 'RATE_LIMITED', message: 'x' }));

    await act(() => result.current.submit(submitEvent()));
    expect(result.current.formError).toMatch(/Demasiadas solicitudes/);

    update.mockRejectedValueOnce(new ApiRequestError({ statusCode: 400, code: 'CONTACT_EMAIL_NOT_SET', message: 'x' }));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldErrors.contactEmail).toBe('Primero agrega un correo de contacto.');
  });
});
