import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import StatsPage from './page';

const { getStats } = vi.hoisted(() => ({ getStats: vi.fn() }));
vi.mock('@/features/stats/get-stats.server', () => ({ getStats }));
const { getInsights } = vi.hoisted(() => ({ getInsights: vi.fn() }));
vi.mock('@/features/insights/get-insights.server', () => ({ getInsights }));
const { getSubscription } = vi.hoisted(() => ({ getSubscription: vi.fn() }));
vi.mock('@/features/subscription/get-subscription.server', () => ({ getSubscription }));
const { getConsolidated } = vi.hoisted(() => ({ getConsolidated: vi.fn() }));
vi.mock('@/features/consolidated/get-consolidated.server', () => ({ getConsolidated }));
vi.mock('@/components/organisms/StatsView', () => ({
  StatsView: ({ advanced, consolidated }: { advanced: boolean; consolidated: unknown }) => (
    <p>
      estadísticas:{advanced ? 'completas' : 'basicas'}:{consolidated ? 'consolidado' : 'solo'}
    </p>
  ),
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

    expect(screen.getByText('estadísticas:completas:solo')).toBeInTheDocument();
    expect(getInsights).toHaveBeenCalledOnce();
    expect(getStats.mock.calls[0]?.[1]).toMatchObject({ arrears: 2 });
  });

  it('with the Individual plan it asks only for the indicators: the API would deny the rest', async () => {
    getSubscription.mockResolvedValue({ advancedStats: false });

    render(await StatsPage(props({ mora: '2' })));

    expect(screen.getByText('estadísticas:basicas:solo')).toBeInTheDocument();
    expect(getInsights).not.toHaveBeenCalled();
    expect(getStats.mock.calls[0]).toHaveLength(1);
  });

  it('when the plan cannot be read it assumes the full plan: the API decides', async () => {
    getSubscription.mockResolvedValue(null);

    render(await StatsPage(props()));

    expect(screen.getByText('estadísticas:completas:solo')).toBeInTheDocument();
  });

  it('shows the access state when the person cannot see statistics', async () => {
    getStats.mockResolvedValue({ status: 'forbidden' });

    render(await StatsPage(props()));

    expect(screen.getByText('No tienes acceso a esta sección')).toBeInTheDocument();
  });

  it('asks for the consolidated view only when the plan brings it', async () => {
    getConsolidated.mockResolvedValue({ rows: [] });
    getSubscription.mockResolvedValue({ advancedStats: true, consolidatedStats: true });

    render(await StatsPage(props()));

    expect(screen.getByText('estadísticas:completas:consolidado')).toBeInTheDocument();

    getConsolidated.mockClear();
    getSubscription.mockResolvedValue({ advancedStats: true, consolidatedStats: false });
    await StatsPage(props());
    expect(getConsolidated).not.toHaveBeenCalled();
  });
});
