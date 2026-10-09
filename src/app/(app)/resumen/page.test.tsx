import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toDashboardViewModel } from '@/features/dashboard/dashboard-view-model';
import SummaryPage from './page';

const { getLenderDashboard } = vi.hoisted(() => ({ getLenderDashboard: vi.fn() }));
vi.mock('@/features/dashboard/get-dashboard.server', () => ({ getLenderDashboard }));

const SUMMARY = {
  totalPortfolio: 1000,
  collectedToday: 100,
  activeCollectors: 1,
  totalCollectors: 1,
  effectivenessToday: 0.5,
  clientsInArrears: 0,
  alerts: [],
  pendingSettlements: [],
};

beforeEach(() => vi.clearAllMocks());

describe('Summary page', () => {
  it('paints the dashboard it loads on the server', async () => {
    getLenderDashboard.mockResolvedValue({ status: 'ok', dashboard: toDashboardViewModel(SUMMARY) });

    render(await SummaryPage());

    expect(screen.getByRole('heading', { level: 1, name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByText('$1.000')).toBeInTheDocument();
  });

  it('explains it when the account has no active business', async () => {
    getLenderDashboard.mockResolvedValue({ status: 'no-business' });

    render(await SummaryPage());

    expect(screen.getByRole('heading', { name: 'Tu cuenta no tiene un negocio activo' })).toBeInTheDocument();
  });
});
