import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import StatsPage from './page';

const { getStats } = vi.hoisted(() => ({ getStats: vi.fn() }));
vi.mock('@/features/stats/get-stats.server', () => ({ getStats }));
const { getInsights } = vi.hoisted(() => ({ getInsights: vi.fn() }));
vi.mock('@/features/insights/get-insights.server', () => ({ getInsights }));
const { getSubscription } = vi.hoisted(() => ({ getSubscription: vi.fn() }));
vi.mock('@/features/subscription/get-subscription.server', () => ({ getSubscription }));
vi.mock('@/components/organisms/StatsView', () => ({
  StatsView: ({ advanced }: { advanced: boolean }) => <p>estadísticas:{advanced ? 'completas' : 'basicas'}</p>,
}));

const RESULT = { status: 'ok', stats: {}, options: { collectors: [], portfolios: [] } };
const props = (params: Record<string, string> = {}) => ({ searchParams: Promise.resolve(params) }) as never;

beforeEach(() => {
  vi.clearAllMocks();
  getStats.mockResolvedValue(RESULT);
  getInsights.mockResolvedValue({ insights: true });
  getSubscription.mockResolvedValue({ advancedStats: true });
});

describe('Stats page', () => {
  it('with advanced stats it loads the long lists and the business insights', async () => {
    render(await StatsPage(props({ mora: '2' })));

    expect(screen.getByText('estadísticas:completas')).toBeInTheDocument();
    expect(getInsights).toHaveBeenCalledOnce();
    expect(getStats.mock.calls[0]?.[1]).toMatchObject({ arrears: 2 });
  });

  it('with the Individual plan it asks only for the indicators: the API would deny the rest', async () => {
    getSubscription.mockResolvedValue({ advancedStats: false });

    render(await StatsPage(props({ mora: '2' })));

    expect(screen.getByText('estadísticas:basicas')).toBeInTheDocument();
    expect(getInsights).not.toHaveBeenCalled();
    expect(getStats.mock.calls[0]).toHaveLength(1);
  });

  it('when the plan cannot be read it assumes the full plan: the API decides', async () => {
    getSubscription.mockResolvedValue(null);

    render(await StatsPage(props()));

    expect(screen.getByText('estadísticas:completas')).toBeInTheDocument();
  });

  it('shows the access state when the person cannot see statistics', async () => {
    getStats.mockResolvedValue({ status: 'forbidden' });

    render(await StatsPage(props()));

    expect(screen.getByText('No tienes acceso a esta sección')).toBeInTheDocument();
  });
});
