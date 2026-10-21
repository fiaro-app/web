import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { SubscriptionView } from '@/features/subscription/subscription-view-model';
import { PlanPanel } from './PlanPanel';

const SUBSCRIPTION: SubscriptionView = {
  planName: 'Prueba gratis',
  advancedStats: true,
  statusLabel: 'Activo',
  endsOn: '08/11/2026',
  daysRemaining: '30',
  usage: [
    { key: 'collectors', label: 'Cobradores activos', value: '2 de 5', percent: 40 },
    { key: 'admins', label: 'Administradores', value: '1 de 3', percent: 33 },
    { key: 'loans', label: 'Préstamos activos', value: '7 (sin tope)', percent: null },
    { key: 'portfolios', label: 'Carteras', value: 'Hasta 4', percent: null },
  ],
  maxPortfolios: 4,
  notice: null,
};

describe('PlanPanel', () => {
  it('shows the plan, the end date and the use of every limit, with a bar where there is a cap', () => {
    render(<PlanPanel subscription={SUBSCRIPTION} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Tu plan' })).toBeInTheDocument();
    for (const text of ['Prueba gratis', 'Activo', '08/11/2026', '30', '2 de 5', '1 de 3', '7 (sin tope)', 'Hasta 4']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    const bar = screen.getByRole('progressbar', { name: 'Cobradores activos' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar.firstElementChild).toHaveStyle({ width: '40%' });
    expect(screen.getByRole('progressbar', { name: 'Administradores' })).toHaveAttribute('aria-valuenow', '33');
    expect(screen.getAllByRole('progressbar')).toHaveLength(2);
  });

  it('offers to renew or change the plan', () => {
    render(<PlanPanel subscription={SUBSCRIPTION} />);

    expect(screen.getByRole('link', { name: 'Renovar o cambiar de plan' })).toHaveAttribute('href', '/plan');
  });
});
