import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import type { CollectorField } from './collector-schemas';
import { inviteCollector } from './collectors-api';
import { useCollectorForm } from './use-collector-form';

vi.mock('./collectors-api', () => ({ inviteCollector: vi.fn() }));
const inviteMock = vi.mocked(inviteCollector);

type Hook = ReturnType<typeof renderHook<ReturnType<typeof useCollectorForm>, unknown>>['result'];

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

function type(result: Hook, values: Partial<Record<CollectorField, string>>) {
  for (const [field, value] of Object.entries(values)) {
    act(() => result.current.setField(field as CollectorField)(change(value)));
  }
}

const VALID = {
  fullName: 'Luis Gómez',
  nationalId: '1030405060',
  phone: '310 999 8877',
  portfolioId: '0192f0a4-7c3e-7000-8000-0000000000aa',
};
const INVITED = { id: 'm', fullName: 'Luis Gómez', phone: '+573109998877', tempPassword: 'abc-123' };

beforeEach(() => {
  vi.clearAllMocks();
  inviteMock.mockResolvedValue(INVITED as never);
});

const setup = () => renderHook(() => useCollectorForm()).result;

describe('useCollectorForm', () => {
  it('validates before calling the API', async () => {
    const result = setup();

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.fullName).toBe('Escribe el nombre completo.');
    expect(result.current.formError).toBe('Revisa los campos marcados en rojo antes de continuar.');
    expect(inviteMock).not.toHaveBeenCalled();
  });

  it('invites the collector and keeps the one-time temporary password', async () => {
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(inviteMock).toHaveBeenCalledWith(expect.objectContaining({ phone: '+573109998877' }));
    expect(result.current.invited?.tempPassword).toBe('abc-123');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('marks the phone when it is already registered', async () => {
    inviteMock.mockRejectedValue(
      new ApiRequestError({ statusCode: 409, code: 'PHONE_ALREADY_REGISTERED', message: 'x' }),
    );
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.phone).toMatch(/Ya existe una cuenta/);
    expect(result.current.invited).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('shows a form-level error for failures that belong to no field', async () => {
    inviteMock.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toBe('No tienes permiso para administrar cobradores.');
  });

  it('places server validation issues on their field', async () => {
    inviteMock.mockRejectedValue(
      new ApiRequestError({
        statusCode: 422,
        code: 'VALIDATION_FAILED',
        message: 'x',
        issues: [{ path: ['nationalId'], message: 'Cédula inválida' }],
      }),
    );
    const result = setup();
    type(result, VALID);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.nationalId).toBe('Cédula inválida');
  });

  it('clears a field error when the person edits it', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    type(result, { fullName: 'Luis' });
    expect(result.current.fieldErrors.fullName).toBeUndefined();
  });
});
