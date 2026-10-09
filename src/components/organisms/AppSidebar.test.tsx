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

  it('leaves the unbuilt modules disabled and marks no section on an unknown route', () => {
    pathname.mockReturnValue('/otra-ruta');
    render(<AppSidebar businessName="Buen Vecino" userName="Ana Pérez" roleLabel={null} />);

    expect(screen.getByRole('link', { name: 'Resumen' })).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Cuadres')).toHaveAttribute('aria-disabled', 'true');
  });
});
