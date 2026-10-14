import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardPreview } from './DashboardPreview';

describe('DashboardPreview', () => {
  it('is exposed as a single described image, not as its decorative contents', () => {
    render(
      <DashboardPreview
        kpis={[{ label: 'Cartera total', value: '$18.4M' }]}
        chartTitle="Mora por antigüedad"
        bars={[{ label: '1 a 5 días', widthClassName: 'w-full', colorClassName: 'bg-warning' }]}
      />,
    );

    expect(screen.getByRole('img', { name: /Vista previa del panel/ })).toBeInTheDocument();
  });

  it('renders each KPI and bar with the classes it is given', () => {
    const { container } = render(
      <DashboardPreview
        kpis={[{ label: 'En mora', value: '18%', valueClassName: 'text-destructive' }]}
        chartTitle="Mora por antigüedad"
        bars={[{ label: 'x', widthClassName: 'w-3/5', colorClassName: 'bg-warning' }]}
      />,
    );

    expect(screen.getByText('18%', { ignore: '' })).toHaveClass('text-destructive');
    expect(container.querySelector('.w-3\\/5')).toHaveClass('bg-warning');
  });
});
