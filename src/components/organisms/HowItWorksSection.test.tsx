import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HowItWorksSection } from './HowItWorksSection';

describe('HowItWorksSection', () => {
  it('numbers the steps in order', () => {
    render(
      <HowItWorksSection
        id="como-funciona"
        title="Empieza en 3 pasos"
        steps={[
          { title: 'Registra', description: 'a' },
          { title: 'Da de alta', description: 'b' },
        ]}
      />,
    );

    const steps = screen.getAllByRole('heading', { level: 3 });
    expect(steps[0]).toHaveTextContent('Paso 1: Registra');
    expect(steps[1]).toHaveTextContent('Paso 2: Da de alta');
    expect(screen.getByRole('region', { name: 'Empieza en 3 pasos' })).toHaveAttribute('id', 'como-funciona');
  });
});
