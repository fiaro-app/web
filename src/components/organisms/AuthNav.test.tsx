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
