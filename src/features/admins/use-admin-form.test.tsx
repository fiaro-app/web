import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import type { AdminField } from './admin-schemas';
import { inviteAdmin } from './admins-api';
import { useAdminForm } from './use-admin-form';

vi.mock('./admins-api', () => ({ inviteAdmin: vi.fn() }));
const inviteMock = vi.mocked(inviteAdmin);

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;
const VALID = { fullName: 'Lucía Pardo', nationalId: '1030405060', phone: '310 999 8877', contactEmail: 'lucia@correo.com' };

function fill(result: { current: ReturnType<typeof useAdminForm> }, values: Partial<Record<AdminField, string>> = VALID) {
  for (const [field, value] of Object.entries(values)) act(() => result.current.setField(field as AdminField)(change(value)));
}

beforeEach(() => {
  vi.clearAllMocks();
  inviteMock.mockResolvedValue({ membership: { id: 'm' }, tempPassword: 'abc-123' } as never);
});

describe('useAdminForm', () => {
  it('validates before calling the API', async () => {
    const { result } = renderHook(() => useAdminForm());

    await act(() => result.current.submit(submitEvent()));

    expect(inviteMock).not.toHaveBeenCalled();
    expect(result.current.fieldErrors.fullName).toBeDefined();
    expect(result.current.formError).toMatch(/Revisa los campos/);
  });

  it('formats the phone while typing and clears the error of the field', async () => {
    const { result } = renderHook(() => useAdminForm());
    await act(() => result.current.submit(submitEvent()));

    fill(result, { phone: '3109998877' });

    expect(result.current.values.phone).toBe('310 999 8877');
    expect(result.current.fieldErrors.phone).toBeUndefined();
  });

  it('invites and keeps the temporary password to show it once', async () => {
    const { result } = renderHook(() => useAdminForm());
    fill(result);

    await act(() => result.current.submit(submitEvent()));

    expect(inviteMock).toHaveBeenCalledTimes(1);
    expect(result.current.invited).toEqual({ fullName: 'Lucía Pardo', tempPassword: 'abc-123' });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('points a taken phone out on the phone field', async () => {
    inviteMock.mockRejectedValue(new ApiRequestError({ statusCode: 409, code: 'CONFLICT', message: 'x' } as never));
    const { result } = renderHook(() => useAdminForm());
    fill(result);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.phone).toMatch(/ya trabaja/);
    expect(result.current.formError).toBeNull();
    expect(result.current.invited).toBeNull();
  });

  it('shows a general failure on the form', async () => {
    inviteMock.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' } as never));
    const { result } = renderHook(() => useAdminForm());
    fill(result);

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toMatch(/No tienes permiso/);
  });

  it('ignores a second submit while one is in flight', async () => {
    let finish: (value: never) => void = () => undefined;
    inviteMock.mockReturnValue(new Promise((resolve) => { finish = resolve as never; }));
    const { result } = renderHook(() => useAdminForm());
    fill(result);

    act(() => { void result.current.submit(submitEvent()); });
    await act(() => result.current.submit(submitEvent()));

    expect(inviteMock).toHaveBeenCalledTimes(1);
    await act(async () => { finish({ tempPassword: null } as never); });
  });
});
