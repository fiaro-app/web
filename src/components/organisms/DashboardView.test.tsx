import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toDashboardViewModel } from '@/features/dashboard/dashboard-view-model';
import type { LenderDashboard } from '@/features/dashboard/endpoints';
import { DashboardView } from './DashboardView';

const DASHBOARD: LenderDashboard = {
  totalPortfolio: 18400000,
  collectedToday: 3200000,
  activeCollectors: 7,
  totalCollectors: 9,
  effectivenessToday: 0.84,
  clientsInArrears: 23,
  alerts: ['3 cobradores aún no han iniciado su ruta hoy.', '2 cuadres tienen diferencias pendientes de revisar.'],
  pendingSettlements: [
    {
      id: '0192f0a4-7c3e-7000-8000-000000000010',
      collectorMembershipId: '0192f0a4-7c3e-7000-8000-000000000011',
      date: '2026-09-22',
      expectedAmount: 450000,
      collectedAmount: 420000,
      collectedByMethod: { CASH: 420000, NEQUI: 0, TRANSFER: 0 },
      status: 'PENDING',
      collectorNote: null,
    },
  ],
};

const render_ = (dashboard: LenderDashboard) => render(<DashboardView dashboard={toDashboardViewModel(dashboard)} />);

describe('DashboardView', () => {
  it('has the page heading and the five indicators', () => {
    render_(DASHBOARD);

    expect(screen.getByRole('heading', { level: 1, name: 'Resumen' })).toBeInTheDocument();
    const indicators = screen.getByRole('region', { name: 'Indicadores' });
    expect(indicators).toHaveTextContent('$18.4M');
    expect(indicators).toHaveTextContent('7 / 9');
    expect(indicators).toHaveTextContent('84 %');
    expect(indicators).toHaveTextContent('23');
  });

  it('lists the alerts as warnings', () => {
    render_(DASHBOARD);

    expect(screen.getByRole('heading', { level: 2, name: 'Alertas' })).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByText('2 cuadres tienen diferencias pendientes de revisar.')).toBeInTheDocument();
  });

  it('hides the alerts section when there are none', () => {
    render_({ ...DASHBOARD, alerts: [] });

    expect(screen.queryByRole('heading', { name: 'Alertas' })).not.toBeInTheDocument();
  });

  it('shows the pending settlements table', () => {
    render_(DASHBOARD);

    expect(screen.getByRole('heading', { level: 2, name: 'Cuadres pendientes de aprobar' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('22/09/2026')).toBeInTheDocument();
  });

  it('says so, without a table, when there are no pending settlements', () => {
    render_({ ...DASHBOARD, pendingSettlements: [] });

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('No hay cuadres pendientes por ahora.')).toBeInTheDocument();
  });

  it('shows an empty state instead of zeros for a brand-new business', () => {
    render_({ ...DASHBOARD, totalPortfolio: 0, totalCollectors: 0, activeCollectors: 0, alerts: [], pendingSettlements: [] });

    expect(screen.getByRole('heading', { name: 'Todavía no hay movimiento' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Indicadores' })).not.toBeInTheDocument();
  });
});
