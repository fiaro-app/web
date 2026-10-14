import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PlanCard, type PlanCardProps } from './PlanCard';

const BASE: PlanCardProps = {
  name: 'Básico',
  price: '$79.000',
  period: '/mes',
  description: 'Para prestamistas con 1 financiera.',
  features: ['1 financiera', 'Cuadre diario'],
  ctaLabel: 'Comenzar gratis',
  ctaHref: '/registro',
};

describe('PlanCard', () => {
  it('shows name, price with period, description and every feature', () => {
    render(<PlanCard {...BASE} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Básico' })).toBeInTheDocument();
    expect(screen.getByText('$79.000')).toBeInTheDocument();
    expect(screen.getByText('/mes')).toBeInTheDocument();
    expect(screen.getByText('Para prestamistas con 1 financiera.')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('links its call to action', () => {
    render(<PlanCard {...BASE} />);

    expect(screen.getByRole('link', { name: 'Comenzar gratis' })).toHaveAttribute('href', '/registro');
  });

  it('omits the period when the plan has no fixed price', () => {
    render(<PlanCard {...BASE} price="Hablemos" period={undefined} />);

    expect(screen.queryByText('/mes')).not.toBeInTheDocument();
  });

  it('uses a brand background and an inverse button when highlighted', () => {
    const { container } = render(<PlanCard {...BASE} highlighted />);

    expect(container.firstElementChild).toHaveClass('bg-primary');
    expect(screen.getByRole('link')).toHaveClass('bg-surface');
  });

  it('is a plain card with a primary button by default', () => {
    const { container } = render(<PlanCard {...BASE} />);

    expect(container.firstElementChild).toHaveClass('bg-background');
    expect(screen.getByRole('link')).toHaveClass('bg-primary');
  });
});
