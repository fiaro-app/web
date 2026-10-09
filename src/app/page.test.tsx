import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('Landing (Home)', () => {
  it('has a single h1 and every section of the design', () => {
    render(<Home />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('region', { name: /Todo lo que tu cuaderno/ })).toHaveAttribute('id', 'producto');
    expect(screen.getByRole('region', { name: /3 pasos/ })).toHaveAttribute('id', 'como-funciona');
    expect(screen.getByRole('region', { name: /Un plan para cada tamaño/ })).toHaveAttribute('id', 'precios');
    expect(screen.getAllByRole('article')).not.toHaveLength(0);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('offers the three plans, with the middle one as the recommended', () => {
    render(<Home />);

    for (const plan of ['Básico', 'Profesional', 'Empresarial']) {
      expect(screen.getByRole('heading', { level: 3, name: plan })).toBeInTheDocument();
    }
  });

  it('points every "Comenzar gratis" at the signup route', () => {
    render(<Home />);

    for (const link of screen.getAllByRole('link', { name: 'Comenzar gratis' })) {
      expect(link).toHaveAttribute('href', '/registro');
    }
  });
});
