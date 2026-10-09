import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { SubscriptionView } from '@/features/subscription/subscription-view-model';
import { PlanPanel } from './PlanPanel';

const SUBSCRIPTION: SubscriptionView = {
  planName: 'Prueba gratis',
  statusLabel: 'Activo',
  endsOn: '08/11/2026',
  daysRemaining: '30',
  collectors: '2 de 5',
  collectorsPercent: 40,
  notice: null,
};

describe('PlanPanel', () => {
  it('shows the plan, the end date and the use of collectors with a progress bar', () => {
    render(<PlanPanel subscription={SUBSCRIPTION} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Tu plan' })).toBeInTheDocument();
    for (const text of ['Prueba gratis', 'Activo', '08/11/2026', '30', '2 de 5']) expect(screen.getByText(text)).toBeInTheDocument();
    const bar = screen.getByRole('progressbar', { name: 'Cobradores activos' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar.firstElementChild).toHaveStyle({ width: '40%' });
  });

  it('offers to talk to sales', () => {
    render(<PlanPanel subscription={SUBSCRIPTION} />);

    expect(screen.getByRole('link', { name: 'Hablar con ventas' })).toHaveAttribute('href', '/contacto');
  });
});
