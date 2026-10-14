import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingFooter } from './LandingFooter';

describe('LandingFooter', () => {
  it('shows the brand, the links and the copyright', () => {
    render(
      <LandingFooter
        links={[{ label: 'Contacto', href: '/contacto' }]}
        copyright="© 2026 Fiaro. Todos los derechos reservados."
      />,
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Fiaro')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/contacto');
    expect(screen.getByText('© 2026 Fiaro. Todos los derechos reservados.')).toBeInTheDocument();
  });
});
