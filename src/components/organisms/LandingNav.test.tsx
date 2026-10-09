import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingNav } from './LandingNav';

describe('LandingNav', () => {
  it('links the brand, the sections, login and signup', () => {
    render(
      <LandingNav
        links={[{ label: 'Precios', href: '#precios' }]}
        loginHref="/login"
        signupHref="/registro"
      />,
    );

    expect(screen.getByRole('link', { name: 'Fiaro' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Precios' })).toHaveAttribute('href', '#precios');
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Comenzar gratis' })).toHaveAttribute('href', '/registro');
  });
});
