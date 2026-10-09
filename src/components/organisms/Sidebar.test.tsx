import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar, type SidebarItem } from './Sidebar';

const ITEMS: SidebarItem[] = [
  { label: 'Resumen', href: '/resumen', active: true, disabled: false },
  { label: 'Clientes', href: '/clientes', active: false, disabled: true },
];

function setup(props: Partial<Parameters<typeof Sidebar>[0]> = {}) {
  render(<Sidebar businessName="Financiera Buen Vecino" items={ITEMS} userName="Daniel Rojas" roleLabel="Administrador" {...props} />);
}

describe('Sidebar', () => {
  it('shows the brand and the business name', () => {
    setup();

    expect(screen.getByText('Fiaro')).toBeInTheDocument();
    expect(screen.getByText('Financiera Buen Vecino')).toBeInTheDocument();
  });

  it('has a main navigation with the current section marked and the unavailable ones dimmed', () => {
    setup();

    const nav = screen.getByRole('navigation', { name: 'Principal' });
    expect(within(nav).getByRole('link', { name: 'Resumen' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).queryByRole('link', { name: 'Clientes' })).not.toBeInTheDocument();
    expect(within(nav).getByText('Clientes')).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows the person with their initials, name and role, plus the actions', () => {
    setup({ actions: <button>Salir</button> });

    expect(screen.getByRole('img', { name: 'Daniel Rojas' })).toHaveTextContent('DR');
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument();
  });

  it('omits the role when it is unknown', () => {
    setup({ roleLabel: null });

    expect(screen.queryByText('Administrador')).not.toBeInTheDocument();
  });

  it('links the profile to «Mi cuenta» when given an account route', () => {
    render(<Sidebar businessName="Buen Vecino" items={[]} userName="Ana Pérez" accountHref="/cuenta" />);

    expect(screen.getByRole('link', { name: 'Mi cuenta, Ana Pérez' })).toHaveAttribute('href', '/cuenta');
  });
});
