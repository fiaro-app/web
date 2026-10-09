import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppSidebar } from './AppSidebar';

const { pathname } = vi.hoisted(() => ({ pathname: vi.fn<() => string>() }));
vi.mock('next/navigation', () => ({
  usePathname: pathname,
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

describe('AppSidebar', () => {
  it('marks the section of the current route and offers to sign out', () => {
    pathname.mockReturnValue('/resumen');
    render(<AppSidebar businessName="Buen Vecino" userName="Ana Pérez" roleLabel="Administrador" />);

    expect(screen.getByRole('link', { name: 'Resumen' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  });

  it('marks no section on an unknown route', () => {
    pathname.mockReturnValue('/otra-ruta');
    render(<AppSidebar businessName="Buen Vecino" userName="Ana Pérez" roleLabel={null} />);

    expect(screen.getByRole('link', { name: 'Resumen' })).not.toHaveAttribute('aria-current');
  });

  it('shows the unread count only on Notificaciones', () => {
    pathname.mockReturnValue('/resumen');
    render(<AppSidebar businessName="Buen Vecino" userName="Ana Pérez" roleLabel={null} unreadNotifications={3} />);

    expect(screen.getByRole('link', { name: /Notificaciones.*3 sin leer/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resumen' })).toBeInTheDocument();
  });

  it('hides the administration modules from a collector', () => {
    pathname.mockReturnValue('/resumen');
    render(<AppSidebar businessName="Buen Vecino" userName="Luis Gómez" roleLabel="Cobrador" />);

    for (const name of ['Cobradores', 'Cuadres', 'Estadísticas', 'Configuración']) {
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'Cobros' })).toBeInTheDocument();
  });

  it('shows every module to an administrator', () => {
    pathname.mockReturnValue('/resumen');
    render(<AppSidebar businessName="Buen Vecino" userName="Ana Pérez" roleLabel="Administrador" />);

    expect(screen.getByRole('link', { name: 'Configuración' })).toBeInTheDocument();
  });
});
