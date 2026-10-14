import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ManageCollectorPage from './page';

const { getCollector, getCollectorStats, getCollectorHandover } = vi.hoisted(() => ({
  getCollector: vi.fn(),
  getCollectorStats: vi.fn(),
  getCollectorHandover: vi.fn(),
}));
vi.mock('@/features/collectors/get-collector-handover.server', () => ({ getCollectorHandover }));
vi.mock('@/features/collectors/get-collector.server', () => ({ getCollector }));
vi.mock('@/features/collectors/get-collector-stats.server', () => ({ getCollectorStats }));
vi.mock('@/features/collectors/get-portfolio-options.server', () => ({ getPortfolioOptions: vi.fn().mockResolvedValue([]) }));
vi.mock('@/components/organisms/CollectorManage', () => ({ CollectorManage: () => <section aria-label="Gestión" /> }));

const props = { params: Promise.resolve({ id: 'm1' }) } as Parameters<typeof ManageCollectorPage>[0];
const COLLECTOR = { id: 'm1', fullName: 'Luis Gómez', phone: '+573109998877', roles: ['COLLECTOR'], portfolioId: null, active: true };
const STATS = {
  period: '01/10/2026 – 31/10/2026',
  expected: '$1',
  collected: '$1',
  effectiveness: '100 %',
  effectivenessTone: 'good',
  visits: '1',
  overdue: '$0',
  overdueTone: 'good',
};

beforeEach(() => {
  vi.clearAllMocks();
  getCollectorHandover.mockResolvedValue({ loans: [], destinations: [] });
});

describe('Manage collector page', () => {
  it('shows the management and the month performance', async () => {
    getCollector.mockResolvedValue({ status: 'ok', collector: COLLECTOR });
    getCollectorStats.mockResolvedValue(STATS);

    render(await ManageCollectorPage(props));

    expect(screen.getByRole('region', { name: 'Gestión' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Desempeño del mes' })).toBeInTheDocument();
  });

  it('omits the performance when the figures are not available', async () => {
    getCollector.mockResolvedValue({ status: 'ok', collector: COLLECTOR });
    getCollectorStats.mockResolvedValue(null);

    render(await ManageCollectorPage(props));

    expect(screen.queryByRole('heading', { name: 'Desempeño del mes' })).not.toBeInTheDocument();
  });

  it('explains it when the collector does not exist or the person cannot manage', async () => {
    getCollector.mockResolvedValue({ status: 'not-found' });
    const { unmount } = render(await ManageCollectorPage(props));
    expect(screen.getByRole('heading', { name: 'No encontramos al cobrador' })).toBeInTheDocument();
    unmount();

    getCollector.mockResolvedValue({ status: 'forbidden' });
    render(await ManageCollectorPage(props));
    expect(screen.getByRole('heading', { name: 'No tienes acceso a esta sección' })).toBeInTheDocument();
  });

  it('checks the active loans to hand over only while the collector is still active', async () => {
    getCollector.mockResolvedValue({ status: 'ok', collector: COLLECTOR });
    getCollectorStats.mockResolvedValue(null);
    render(await ManageCollectorPage(props));
    expect(getCollectorHandover).toHaveBeenCalledWith('m1');

    getCollectorHandover.mockClear();
    getCollector.mockResolvedValue({ status: 'ok', collector: { ...COLLECTOR, active: false } });
    render(await ManageCollectorPage(props));
    expect(getCollectorHandover).not.toHaveBeenCalled();
  });
});
