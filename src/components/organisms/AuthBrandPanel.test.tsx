import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthBrandPanel } from './AuthBrandPanel';

describe('AuthBrandPanel', () => {
  it('shows the message and its illustration, without adding a heading', () => {
    render(
      <AuthBrandPanel eyebrow="Bienvenido de nuevo" title="Tu cartera, siempre bajo control" description="Inicia sesión.">
        <div data-testid="art" />
      </AuthBrandPanel>,
    );

    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
    expect(screen.getByText('Tu cartera, siempre bajo control')).toBeInTheDocument();
    expect(screen.getByText('Inicia sesión.')).toBeInTheDocument();
    expect(screen.getByTestId('art')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
