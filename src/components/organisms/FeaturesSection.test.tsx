import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeaturesSection } from './FeaturesSection';

describe('FeaturesSection', () => {
  it('is a labelled region with one card per feature', () => {
    render(
      <FeaturesSection
        id="producto"
        title="Todo lo que tu cuaderno no puede mostrar"
        subtitle="Visibilidad."
        features={[
          { icon: '⏱', tone: 'error', title: 'Mora', description: 'a' },
          { icon: '✓', tone: 'success', title: 'Efectividad', description: 'b' },
        ]}
      />,
    );

    const region = screen.getByRole('region', { name: 'Todo lo que tu cuaderno no puede mostrar' });
    expect(region).toHaveAttribute('id', 'producto');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });
});
