import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavLink } from './NavLink';

describe('NavLink', () => {
  it('marks the active section for assistive tech', () => {
    render(
      <NavLink href="/cartera" active>
        Cartera
      </NavLink>,
    );

    const link = screen.getByRole('link', { name: 'Cartera' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('text-primary');
  });

  it('is muted when not active', () => {
    render(<NavLink href="/cuadre">Cuadre</NavLink>);

    const link = screen.getByRole('link', { name: 'Cuadre' });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).toHaveClass('text-foreground/65');
  });

  it('can be full ink instead of muted', () => {
    render(
      <NavLink href="/precios" muted={false}>
        Precios
      </NavLink>,
    );

    expect(screen.getByRole('link', { name: 'Precios' })).toHaveClass('text-foreground');
  });
});
