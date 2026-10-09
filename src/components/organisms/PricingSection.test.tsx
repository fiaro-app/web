import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PricingSection } from './PricingSection';

const PLAN = {
  price: '$1',
  description: 'd',
  features: ['f'],
  ctaLabel: 'Comenzar',
  ctaHref: '/registro',
};

describe('PricingSection', () => {
  it('shows the heading, the note and one card per plan', () => {
    render(
      <PricingSection
        id="precios"
        eyebrow="Precios"
        title="Un plan para cada negocio"
        note="Precios de referencia."
        plans={[
          { ...PLAN, name: 'Básico' },
          { ...PLAN, name: 'Profesional', highlighted: true },
        ]}
      />,
    );

    expect(screen.getByRole('region', { name: 'Un plan para cada negocio' })).toHaveAttribute('id', 'precios');
    expect(screen.getByText('Precios de referencia.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Básico' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Profesional' })).toBeInTheDocument();
  });
});
