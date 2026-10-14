import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopBar } from './TopBar';

const NAV = [
  { label: 'Cartera', href: '/cartera', active: true },
  { label: 'Cuadre', href: '/cuadre' },
];

describe('TopBar', () => {
  it('shows the brand, the user and a navigation with the active section marked', () => {
    render(<TopBar navItems={NAV} userName="Alejo Zuleta" />);

    expect(screen.getByRole('link', { name: 'Fiaro' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cartera' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Cuadre' })).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Alejo Zuleta')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alejo Zuleta' })).toHaveTextContent('AZ');
  });

  it('accepts a custom brand name', () => {
    render(<TopBar navItems={[]} userName="A B" brandName="Prestamos Ya" />);

    expect(screen.getByRole('link', { name: 'Prestamos Ya' })).toBeInTheDocument();
  });

  it('renders the actions next to the user', () => {
    render(<TopBar navItems={[]} userName="A B" actions={<button>Salir</button>} />);

    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument();
  });
});
