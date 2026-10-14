import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarNavItem } from './SidebarNavItem';

describe('SidebarNavItem', () => {
  it('is a link to its section', () => {
    render(<SidebarNavItem label="Clientes" href="/clientes" />);

    expect(screen.getByRole('link', { name: 'Clientes' })).toHaveAttribute('href', '/clientes');
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });

  it('marks the current section for assistive tech and highlights it', () => {
    render(<SidebarNavItem label="Resumen" href="/resumen" active />);

    const link = screen.getByRole('link', { name: 'Resumen' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('bg-surface-2', 'text-primary');
  });

  it('is dimmed and not a link when the module is not available yet', () => {
    render(<SidebarNavItem label="Cuadres" href="/cuadres" disabled />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    const item = screen.getByText('Cuadres');
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveAttribute('title', 'Próximamente');
  });

  it('shows a badge with the pending count, capped at 99+', () => {
    const { rerender } = render(<SidebarNavItem label="Notificaciones" href="/notificaciones" badge={5} />);
    expect(screen.getByRole('link', { name: /Notificaciones.*5 sin leer/ })).toBeInTheDocument();

    rerender(<SidebarNavItem label="Notificaciones" href="/notificaciones" badge={240} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('shows no badge with zero pending', () => {
    render(<SidebarNavItem label="Notificaciones" href="/notificaciones" badge={0} />);

    expect(screen.getByRole('link')).toHaveTextContent(/^Notificaciones$/);
  });
});
