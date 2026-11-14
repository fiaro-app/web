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

import VerifyEmailPage from './page';

const USER = { id: 'u1', name: 'Ana Pérez', phoneNumber: '+573001234567', contactEmail: null, contactEmailVerified: false };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('VerifyEmailPage', () => {
  it('asks a person without an email to add one', async () => {
    requireUser.mockResolvedValue(USER);
    render(await VerifyEmailPage());
    expect(screen.getByRole('heading', { level: 1, name: 'Verifica tu correo' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Correo electrónico/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Verificar correo' })).not.toBeInTheDocument();
  });

  it('asks for the code when the email is set but unverified', async () => {
    requireUser.mockResolvedValue({ ...USER, contactEmail: 'ana@correo.com' });
    render(await VerifyEmailPage());
    expect(screen.getByRole('button', { name: 'Verificar correo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  });

  it('has nothing to do once the email is verified', async () => {
    requireUser.mockResolvedValue({ ...USER, contactEmail: 'ana@correo.com', contactEmailVerified: true });
    await expect(VerifyEmailPage()).rejects.toThrow('NEXT_REDIRECT:/resumen');
  });
});
