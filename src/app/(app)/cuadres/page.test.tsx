import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SettlementsPage from './page';

const { getSettlements } = vi.hoisted(() => ({ getSettlements: vi.fn() }));
vi.mock('@/features/settlements/get-settlements.server', () => ({ getSettlements }));

const props = (params: Record<string, string> = {}) => ({ searchParams: Promise.resolve(params) }) as Parameters<typeof SettlementsPage>[0];

beforeEach(() => vi.clearAllMocks());

describe('Settlements page', () => {
  it('reads the page, the status and the filters from the URL', async () => {
    getSettlements.mockResolvedValue({
      status: 'ok',
      settlements: {
        rows: [],
        total: 0,
        page: 2,
        pageSize: 20,
        status: 'PENDING',
        filters: { from: '2026-10-01', to: '2026-10-01', collectorId: '', portfolioId: '' },
      },
      options: { collectors: [], portfolios: [] },
    });

    render(await SettlementsPage(props({ pagina: '2', estado: 'PENDING', desde: '2026-10-01' })));

    expect(getSettlements).toHaveBeenCalledWith(2, 'PENDING', expect.objectContaining({ from: '2026-10-01', to: '2026-10-01' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Cuadres' })).toBeInTheDocument();
  });

  it('explains it when the person cannot see the settlements', async () => {
    getSettlements.mockResolvedValue({ status: 'forbidden' });

    render(await SettlementsPage(props()));

    expect(screen.getByRole('heading', { name: /No tienes acceso/ })).toBeInTheDocument();
  });
});
