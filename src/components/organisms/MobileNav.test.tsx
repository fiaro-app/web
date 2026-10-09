import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/resumen' }));

import { MobileNav } from './MobileNav';

describe('MobileNav', () => {
  it('shows only the header until the menu is opened', async () => {
    render(
      <MobileNav>
        <nav aria-label="Principal">Barra</nav>
      </MobileNav>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));

    expect(screen.getByRole('dialog', { name: 'Menú principal' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes from the close button and from the backdrop', async () => {
    render(
      <MobileNav>
        <p>Barra</p>
      </MobileNav>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    const [closeButton, backdrop] = screen.getAllByRole('button', { name: 'Cerrar menú' });

    await userEvent.click(closeButton as HTMLElement);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Cerrar menú' })[1] ?? (backdrop as HTMLElement));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
