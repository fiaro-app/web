import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { requireUser, getShellContext } = vi.hoisted(() => ({ requireUser: vi.fn(), getShellContext: vi.fn() }));
vi.mock('@/features/auth/session.server', () => ({ requireUser }));
vi.mock('@/features/app-shell/get-shell-context.server', () => ({ getShellContext }));

import { getAccess } from './get-access.server';

describe('getAccess', () => {
  it('exige sesión y devuelve solo los permisos del contexto', async () => {
    getShellContext.mockResolvedValue({ canManage: false, canCollect: true, membershipId: 'm1', businessName: 'X', unreadNotifications: 2 });

    await expect(getAccess()).resolves.toEqual({ canManage: false, canCollect: true, membershipId: 'm1' });
    expect(requireUser).toHaveBeenCalled();
  });
});
