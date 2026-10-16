import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { demoteAdmin, promoteToAdmin, removeAdminAccess } from './admins-api';
import type { AdminRow } from './admins-view-model';
import { useAdminActions } from './use-admin-actions';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./admins-api', () => ({ promoteToAdmin: vi.fn(), demoteAdmin: vi.fn(), removeAdminAccess: vi.fn() }));
const promoteMock = vi.mocked(promoteToAdmin);
const demoteMock = vi.mocked(demoteAdmin);
const removeMock = vi.mocked(removeAdminAccess);

const OPTIONS = [{ id: 'col', label: 'Luis Gómez · +573109998877', roles: ['COLLECTOR'] as const }];
const ROW: AdminRow = { id: 'adm', fullName: 'Pedro Gil', phone: '+573001112233', roleLabel: 'Administrador y cobrador', roles: ['LENDER', 'COLLECTOR'], isSelf: false, canDemote: true, canRemove: false };
const picked = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLSelectElement>;

beforeEach(() => {
  vi.clearAllMocks();
  promoteMock.mockResolvedValue({} as never);
  demoteMock.mockResolvedValue({} as never);
  removeMock.mockResolvedValue(undefined as never);
});

describe('useAdminActions', () => {
  it('promotes the chosen collaborator and refreshes', async () => {
    const { result } = renderHook(() => useAdminActions(OPTIONS));
    act(() => result.current.select(picked('col')));

    await act(() => result.current.promote());

    expect(promoteMock).toHaveBeenCalledWith('col', ['COLLECTOR']);
    expect(result.current.notice).toBe('Luis Gómez ahora es administrador.');
    expect(result.current.selected).toBe('');
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('asks to choose somebody first', async () => {
    const { result } = renderHook(() => useAdminActions(OPTIONS));

    await act(() => result.current.promote());

    expect(promoteMock).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Elige un colaborador');
  });

  it('removes the admin role and the access', async () => {
    const { result } = renderHook(() => useAdminActions(OPTIONS));

    await act(() => result.current.demote(ROW));
    expect(demoteMock).toHaveBeenCalledWith('adm', ['LENDER', 'COLLECTOR']);
    expect(result.current.notice).toBe('Pedro Gil ya no es administrador.');

    await act(() => result.current.remove(ROW));
    expect(removeMock).toHaveBeenCalledWith('adm');
    expect(result.current.notice).toBe('Pedro Gil ya no tiene acceso al negocio.');
  });

  it('explains a failure without refreshing', async () => {
    demoteMock.mockRejectedValue(new ApiRequestError({ statusCode: 400, code: 'VALIDATION_FAILED', message: 'x' } as never));
    const { result } = renderHook(() => useAdminActions(OPTIONS));

    await act(() => result.current.demote(ROW));

    expect(result.current.error).toMatch(/del dueño/);
    expect(result.current.notice).toBeNull();
    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.pending).toBe(false);
  });

  it('ignores a second action while one is in flight', async () => {
    let finish: (value: never) => void = () => undefined;
    demoteMock.mockReturnValue(new Promise((resolve) => { finish = resolve as never; }));
    const { result } = renderHook(() => useAdminActions(OPTIONS));

    act(() => { void result.current.demote(ROW); });
    await act(() => result.current.remove(ROW));

    expect(removeMock).not.toHaveBeenCalled();
    await act(async () => { finish({} as never); });
  });
});
