import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import type { ClientField } from './client-schemas';
import { createClient, updateClient } from './clients-api';
import { useClientForm } from './use-client-form';

const replace = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./clients-api', () => ({ createClient: vi.fn(), updateClient: vi.fn() }));

const create = vi.mocked(createClient);
const update = vi.mocked(updateClient);

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;

const VALID = {
  fullName: 'Carlos Gómez',
  nationalId: '1020304050',
  phone: '300 123 4567',
  occupation: 'Vendedor',
  address: 'Calle 45 # 12-30',
};
const CLIENT = {
  id: 'c1',
  fullName: 'Carlos Gómez',
  nationalId: '1020304050',
  phone: '+573001234567',
  occupation: 'Vendedor',
  address: 'Calle 45 # 12-30',
  createdAt: '2026-10-01T10:00:00.000Z',
};

type Hook = ReturnType<typeof renderHook<ReturnType<typeof useClientForm>, unknown>>['result'];
function type(result: Hook, values: Partial<Record<ClientField, string>>) {
  for (const [field, value] of Object.entries(values)) {
    act(() => result.current.setField(field as ClientField)(change(value)));
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  create.mockResolvedValue({} as never);
  update.mockResolvedValue({} as never);
});

describe('useClientForm (create)', () => {
  const setup = () => renderHook(() => useClientForm()).result;

  it('validates before calling the API', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldErrors.fullName).toBe('Escribe el nombre completo.');
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the client and goes back to the list', async () => {
    const result = setup();
    type(result, VALID);
    await act(() => result.current.submit(submitEvent()));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ phone: '+573001234567', nationalId: '1020304050' }));
    expect(replace).toHaveBeenCalledWith('/clientes');
    expect(refresh).toHaveBeenCalled();
  });

  it('marks the national id when it is already taken', async () => {
    create.mockRejectedValue(new ApiRequestError({ statusCode: 409, code: 'CLIENT_NATIONAL_ID_TAKEN', message: 'x' }));
    const result = setup();
    type(result, VALID);
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldErrors.nationalId).toBe('Ya tienes un cliente con esa cédula.');
    expect(replace).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('shows a form-level error for failures with no field', async () => {
    create.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const result = setup();
    type(result, VALID);
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.formError).toBe('No tienes permiso para administrar clientes.');
  });

  it('places server validation issues on their field', async () => {
    create.mockRejectedValue(
      new ApiRequestError({ statusCode: 400, code: 'VALIDATION_FAILED', message: 'x', issues: [{ path: ['address'], message: 'Muy corta' }] }),
    );
    const result = setup();
    type(result, VALID);
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldErrors.address).toBe('Muy corta');
  });
});

describe('useClientForm (edit)', () => {
  const setup = () => renderHook(() => useClientForm({ client: CLIENT })).result;

  it('starts with the saved values', () => {
    const result = setup();
    expect(result.current.isEditing).toBe(true);
    expect(result.current.values.fullName).toBe('Carlos Gómez');
  });

  it('sends only the changed fields', async () => {
    const result = setup();
    type(result, { address: 'Carrera 7 # 1-1' });
    await act(() => result.current.submit(submitEvent()));
    expect(update).toHaveBeenCalledWith('c1', { address: 'Carrera 7 # 1-1' });
    expect(replace).toHaveBeenCalledWith('/clientes');
  });

  it('skips the API call when nothing changed', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    expect(update).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith('/clientes');
  });
});
