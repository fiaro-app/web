import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeatureCard } from './FeatureCard';

describe('FeatureCard', () => {
  it('shows a titled description and hides the decorative icon from assistive tech', () => {
    render(<FeatureCard icon="⏱" title="Mora en tiempo real" description="Sabe qué clientes están atrasados." />);

    expect(screen.getByRole('heading', { level: 3, name: 'Mora en tiempo real' })).toBeInTheDocument();
    expect(screen.getByText('Sabe qué clientes están atrasados.')).toBeInTheDocument();
    expect(screen.getByText('⏱')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes its color from the class it receives', () => {
    render(<FeatureCard icon="✓" title="T" description="D" className="bg-[#ffe9a8]" />);

    expect(screen.getByRole('article')).toHaveClass('bg-[#ffe9a8]');
  });
});
