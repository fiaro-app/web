import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toDashboardViewModel } from '@/features/dashboard/dashboard-view-model';
import SummaryPage from './page';

const { getLenderDashboard, getAccess, redirect } = vi.hoisted(() => ({ getLenderDashboard: vi.fn(), getAccess: vi.fn(), redirect: vi.fn() }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
vi.mock('next/navigation', () => ({ redirect }));
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
  period: { from: '2026-10-09', to: '2026-10-09' },
  collectedInPeriod: 100,
  expectedInPeriod: 200,
  effectivenessInPeriod: 0.5,
};

const props = (params: Record<string, string> = {}) =>
  ({ searchParams: Promise.resolve(params) }) as unknown as Parameters<typeof SummaryPage>[0];

beforeEach(() => {
  vi.clearAllMocks();
  getAccess.mockResolvedValue({ canManage: true, canCollect: false, membershipId: null });
});

describe('Summary page', () => {
  it('paints the dashboard it loads on the server', async () => {
    getLenderDashboard.mockResolvedValue({ status: 'ok', dashboard: toDashboardViewModel(SUMMARY) });

    render(await SummaryPage(props()));

    expect(screen.getByRole('heading', { level: 1, name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByText('$1.000')).toBeInTheDocument();
  });

  it('asks for the period in the URL and paints it', async () => {
    getLenderDashboard.mockResolvedValue({ status: 'ok', dashboard: toDashboardViewModel(SUMMARY, undefined, true) });

    render(await SummaryPage(props({ desde: '2026-10-01', hasta: '2026-10-09' })));

    expect(getLenderDashboard).toHaveBeenCalledWith({ from: '2026-10-01', to: '2026-10-09' });
    expect(screen.getByLabelText('Desde')).toHaveTextContent('01/10/2026');
  });

  it('explains it when the account has no active business', async () => {
    getLenderDashboard.mockResolvedValue({ status: 'no-business' });

    render(await SummaryPage(props()));

    expect(screen.getByRole('heading', { name: 'Tu cuenta no tiene un negocio activo' })).toBeInTheDocument();
  });

  it('sends a collector to the loans instead of the business summary', async () => {
    getAccess.mockResolvedValue({ canManage: false, canCollect: true, membershipId: null });
    getLenderDashboard.mockResolvedValue({ status: 'ok', dashboard: toDashboardViewModel(SUMMARY) });
    redirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(SummaryPage(props())).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/prestamos');
  });
});
