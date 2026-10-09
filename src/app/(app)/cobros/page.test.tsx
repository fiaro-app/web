import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VisitReportPage from './page';

const { getVisitReport } = vi.hoisted(() => ({ getVisitReport: vi.fn() }));
vi.mock('@/features/visits/get-visit-report.server', () => ({ getVisitReport }));

const props = (params: Record<string, string> = {}) => ({ searchParams: Promise.resolve(params) }) as Parameters<typeof VisitReportPage>[0];

beforeEach(() => vi.clearAllMocks());

describe('Visit report page', () => {
  it('reads the filters and the page from the URL and paints the report', async () => {
    getVisitReport.mockResolvedValue({
      status: 'ok',
      report: { rows: [], total: 0, page: 3, pageSize: 20, rangeFrom: '01/10/2026', rangeTo: '09/10/2026' },
      collectors: [],
    });

    render(await VisitReportPage(props({ desde: '2026-10-01', hasta: '2026-10-09', pagina: '3' })));

    expect(getVisitReport).toHaveBeenCalledWith(expect.objectContaining({ from: '2026-10-01', to: '2026-10-09' }), 3);
    expect(screen.getByRole('heading', { level: 1, name: 'Cobros del día' })).toBeInTheDocument();
  });

  it('explains it when the person cannot see the business collections', async () => {
    getVisitReport.mockResolvedValue({ status: 'forbidden' });

    render(await VisitReportPage(props()));

    expect(screen.getByRole('heading', { name: 'No tienes acceso a esta sección' })).toBeInTheDocument();
  });
});
