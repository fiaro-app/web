import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('renders the pitch, both calls to action and the visual', () => {
    render(
      <HeroSection
        eyebrow="Software para prestamistas"
        title="El control de tu cartera"
        description="Mora en tiempo real."
        primaryCta={{ label: 'Comenzar gratis', href: '/registro' }}
        secondaryCta={{ label: 'Ver cómo funciona →', href: '#como-funciona' }}
        footnote="Sin tarjeta de crédito"
        visual={<div data-testid="visual" />}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'El control de tu cartera' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Comenzar gratis' })).toHaveAttribute('href', '/registro');
    expect(screen.getByRole('link', { name: 'Ver cómo funciona →' })).toHaveAttribute('href', '#como-funciona');
    expect(screen.getByText('Sin tarjeta de crédito')).toBeInTheDocument();
    expect(screen.getByTestId('visual')).toBeInTheDocument();
  });
});
