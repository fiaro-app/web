import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeatureCard } from './FeatureCard';

describe('FeatureCard', () => {
  it('shows a titled description and hides the decorative icon from assistive tech', () => {
    render(<FeatureCard icon="⏱" tone="error" title="Mora en tiempo real" description="Sabe qué clientes están atrasados." />);

    expect(screen.getByRole('heading', { level: 3, name: 'Mora en tiempo real' })).toBeInTheDocument();
    expect(screen.getByText('Sabe qué clientes están atrasados.')).toBeInTheDocument();
    expect(screen.getByText('⏱')).toHaveAttribute('aria-hidden', 'true');
  });

  it('tints the icon with the tone', () => {
    render(<FeatureCard icon="✓" tone="success" title="T" description="D" />);

    expect(screen.getByText('✓')).toHaveClass('bg-success/12', 'text-success');
  });
});
