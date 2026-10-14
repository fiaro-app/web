import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireUser, redirect } = vi.hoisted(() => ({
  requireUser: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));
vi.mock('@/features/auth/session.server', () => ({ requireUser }));
vi.mock('next/navigation', () => ({ redirect, useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));
vi.mock('@/features/auth/use-sign-out', () => ({ useSignOut: () => ({ isSigningOut: false, signOut: vi.fn() }) }));

import ChangePasswordPage from './page';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ChangePasswordPage', () => {
  it('shows the form with a way to sign out to a person with a temporary password', async () => {
    requireUser.mockResolvedValue({ id: 'u1', mustChangePassword: true });
    render(await ChangePasswordPage());
    expect(screen.getByRole('form', { name: 'Cambia tu contraseña' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  });

  it('has nothing to do for a person who already changed it', async () => {
    requireUser.mockResolvedValue({ id: 'u1', mustChangePassword: false });
    await expect(ChangePasswordPage()).rejects.toThrow('NEXT_REDIRECT:/resumen');
  });
});
