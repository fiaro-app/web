import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthPreviewCard } from './AuthPreviewCard';

describe('AuthPreviewCard', () => {
  it('renders every KPI and the activity, hidden from assistive tech as a whole', () => {
    const { container } = render(
      <AuthPreviewCard
        kpis={[
          { label: 'Cartera', value: '$18.4M' },
          { label: 'Mora', value: '18%', valueClassName: 'text-destructive' },
        ]}
        activity="Alejo Zuleta cerró su ruta"
      />,
    );

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('$18.4M', { ignore: '' })).toBeInTheDocument();
    expect(screen.getByText('18%')).toHaveClass('text-destructive');
    expect(screen.getByText('Alejo Zuleta cerró su ruta')).toBeInTheDocument();
  });
});
