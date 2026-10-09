import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepCard } from './StepCard';

describe('StepCard', () => {
  it('announces the step number with its title and describes it', () => {
    render(
      <ul>
        <StepCard step={2} title="Da de alta a tus cobradores" description="Cada cobrador recibe su acceso." />
      </ul>,
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Paso 2: Da de alta a tus cobradores');
    expect(screen.getByText('Cada cobrador recibe su acceso.')).toBeInTheDocument();
  });

  it('shows the number in the circle', () => {
    render(
      <ul>
        <StepCard step={3} title="T" description="D" />
      </ul>,
    );

    expect(screen.getByText('3')).toHaveAttribute('aria-hidden', 'true');
  });
});
