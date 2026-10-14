import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthNav } from './AuthNav';

describe('AuthNav', () => {
  it('links the brand home and the sibling screen', () => {
    render(<AuthNav prompt="¿No tienes cuenta?" linkLabel="Regístrate gratis" linkHref="/registro" />);

    expect(screen.getByRole('link', { name: 'Fiaro' })).toHaveAttribute('href', '/');
    expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate gratis' })).toHaveAttribute('href', '/registro');
  });
});

describe('AuthNav (custom end)', () => {
  it('shows the given content instead of the prompt and link', () => {
    render(<AuthNav prompt="¿No tienes cuenta?" linkLabel="Regístrate" linkHref="/registro" end={<button type="button">Cerrar sesión</button>} />);
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Regístrate' })).not.toBeInTheDocument();
  });

  it('works with only the brand', () => {
    render(<AuthNav />);
    expect(screen.getByRole('link', { name: 'Fiaro' })).toHaveAttribute('href', '/');
  });
});
