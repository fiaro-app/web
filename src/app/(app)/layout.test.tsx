import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireUser, getShellContext, getSubscription, redirect } = vi.hoisted(() => ({
  getSubscription: vi.fn(),
  requireUser: vi.fn(),
  getShellContext: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));
vi.mock('@/features/auth/session.server', () => ({ requireUser }));
vi.mock('@/features/app-shell/get-shell-context.server', () => ({ getShellContext }));
vi.mock('@/features/subscription/get-subscription.server', () => ({ getSubscription }));
vi.mock('next/navigation', () => ({ redirect, usePathname: () => '/resumen', useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

import AppLayout from './layout';

const USER = { id: 'u1', name: 'Ana Pérez', mustChangePassword: false };

beforeEach(() => {
  vi.clearAllMocks();
  getShellContext.mockResolvedValue({ businessName: 'Buen Vecino', roleLabel: 'Administrador' });
  getSubscription.mockResolvedValue(null);
});

describe('AppLayout', () => {
  it('renders the shell around the page for a person with a settled password', async () => {
    requireUser.mockResolvedValue(USER);
    render(await AppLayout({ children: <p>contenido</p> }));
    expect(screen.getByText('contenido')).toBeInTheDocument();
    expect(screen.getByText('Buen Vecino')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('tints the panel with the brand color of the business', async () => {
    requireUser.mockResolvedValue(USER);
    getShellContext.mockResolvedValue({ businessName: 'Buen Vecino', roleLabel: 'Administrador', brandColor: '#0F766E' });

    const { container } = render(await AppLayout({ children: <p>contenido</p> }));

    expect(container.firstElementChild).toHaveStyle({ '--primary': '#0F766E' });
  });

  it('shows the plan notice above the page when the trial needs attention', async () => {
    requireUser.mockResolvedValue(USER);
    getSubscription.mockResolvedValue({ notice: { tone: 'warning', message: 'Tu prueba gratis termina en 3 días.' } });

    render(await AppLayout({ children: <p>contenido</p> }));

    expect(screen.getByText('Tu prueba gratis termina en 3 días.')).toBeInTheDocument();
  });

  it('shows no notice when the plan is fine or could not be loaded', async () => {
    requireUser.mockResolvedValue(USER);
    getSubscription.mockResolvedValue({ notice: null });

    render(await AppLayout({ children: <p>contenido</p> }));

    expect(screen.queryByRole('link', { name: 'Contactar ventas' })).not.toBeInTheDocument();
  });

  it('sends a person who signed in with a temporary password to change it, before loading anything else', async () => {
    requireUser.mockResolvedValue({ ...USER, mustChangePassword: true });
    await expect(AppLayout({ children: <p>contenido</p> })).rejects.toThrow('NEXT_REDIRECT:/cambiar-contrasena');
    expect(getShellContext).not.toHaveBeenCalled();
  });
});
