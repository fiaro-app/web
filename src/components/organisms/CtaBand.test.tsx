import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CtaBand } from './CtaBand';

describe('CtaBand', () => {
  it('shows the closing pitch and a link to sign up', () => {
    render(<CtaBand title="¿Listo?" description="Configura hoy." ctaLabel="Comenzar gratis" ctaHref="/registro" />);

    expect(screen.getByRole('heading', { level: 2, name: '¿Listo?' })).toBeInTheDocument();
    expect(screen.getByText('Configura hoy.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Comenzar gratis' })).toHaveAttribute('href', '/registro');
  });
});
