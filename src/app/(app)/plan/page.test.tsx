import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlanPage from './page';

const { getAccess } = vi.hoisted(() => ({ getAccess: vi.fn() }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
const { getSubscription } = vi.hoisted(() => ({ getSubscription: vi.fn() }));
vi.mock('@/features/subscription/get-subscription.server', () => ({ getSubscription }));
const { getPayments } = vi.hoisted(() => ({ getPayments: vi.fn() }));
vi.mock('@/features/subscription/get-payments.server', () => ({ getPayments }));
vi.mock('@/components/organisms/PaymentHistory', () => ({
  PaymentHistory: ({ payments }: { payments: readonly unknown[] }) => <p>pagos:{payments.length}</p>,
}));
vi.mock('@/components/organisms/PlanCheckout', () => ({
  PlanCheckout: ({ currentPlanName }: { currentPlanName: string | null }) => <p>planes:{currentPlanName ?? 'ninguno'}</p>,
}));

const SUBSCRIPTION = {
  planName: 'Pro',
  statusLabel: 'Activo',
  endsOn: '16/11/2026',
  daysRemaining: '3',
  usage: [],
  maxPortfolios: 4,
  notice: { tone: 'warning', message: 'Tu plan vence en 3 días.' },
};

beforeEach(() => {
  vi.clearAllMocks();
  getAccess.mockResolvedValue({ canManage: true, canCollect: false, membershipId: 'm1' });
  getSubscription.mockResolvedValue(SUBSCRIPTION);
  getPayments.mockResolvedValue([{ reference: 'a' }, { reference: 'b' }]);
});

describe('Plan page', () => {
  it('shows the current plan, its notice and the plans to pay', async () => {
    render(await PlanPage());

    expect(screen.getByRole('heading', { level: 1, name: 'Plan y pagos' })).toBeInTheDocument();
    expect(screen.getByText('Tu plan vence en 3 días.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Tu plan' })).toBeInTheDocument();
    expect(screen.getByText('planes:Pro')).toBeInTheDocument();
    expect(screen.getByText('pagos:2')).toBeInTheDocument();
  });

  it('opens without the history when it could not be read', async () => {
    getPayments.mockResolvedValue(null);

    render(await PlanPage());

    expect(screen.queryByText(/pagos:/)).not.toBeInTheDocument();
  });

  it('still offers the plans when the current plan could not be read', async () => {
    getSubscription.mockResolvedValue(null);

    render(await PlanPage());

    expect(screen.getByText('planes:ninguno')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'Tu plan' })).not.toBeInTheDocument();
  });

  it('a person who does not manage the business sees no plan', async () => {
    getAccess.mockResolvedValue({ canManage: false, canCollect: true, membershipId: 'm1' });

    render(await PlanPage());

    expect(screen.getByText('No tienes acceso a esta sección')).toBeInTheDocument();
    expect(getSubscription).not.toHaveBeenCalled();
  });
});
