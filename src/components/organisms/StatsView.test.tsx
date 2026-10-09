import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_STATS_FILTERS } from '@/features/stats/stats-filters';
import type { StatsViewModel } from '@/features/stats/stats-view-model';
import { StatsView } from './StatsView';

vi.mock('@/features/stats/use-stats-export', () => ({ useStatsExport: () => ({ isExporting: false, error: null, exportPdf: vi.fn() }) }));

const OPTIONS = { collectors: [], portfolios: [] };
const STATS: StatsViewModel = {
  period: '01/10/2026 – 09/10/2026',
  kpis: [
    { id: 'portfolio', label: 'Cartera total', value: '$18.4M', tone: 'neutral' },
    { id: 'atRisk', label: 'Cartera en riesgo', value: '$7.1M', tone: 'bad' },
    { id: 'arrearsRate', label: '% en mora', value: '18 %', tone: 'warning' },
  ],
  arrearsByAge: [
    { label: '0–7 días', amount: '$3.200.000', clients: '8 clientes', barPercent: 100 },
    { label: '8–15 días', amount: '$1.600.000', clients: '1 cliente', barPercent: 50 },
    { label: '16–30 días', amount: '$0', clients: '0 clientes', barPercent: 0 },
    { label: 'Más de 30 días', amount: '$900.000', clients: '2 clientes', barPercent: 28 },
  ],
  topArrears: [{ clientId: 'c1', name: 'María Gómez', days: '32 días en mora', amount: '$900.000' }],
  collectors: [
    { collectorId: 'm1', name: 'Alejo Zuleta', portfolioName: 'Zona Norte', effectiveness: '92 %', effectivenessTone: 'good', overdue: '$300.000' },
  ],
  isEmpty: false,
};

describe('StatsView', () => {
  it('shows the title, the period, the export button and the filters', () => {
    render(<StatsView stats={STATS} filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Estadísticas' })).toBeInTheDocument();
    expect(screen.getByText('Período: 01/10/2026 – 09/10/2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Exportar reporte (PDF)' })).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Filtros de estadísticas' })).toBeInTheDocument();
  });

  it('shows the three indicators', () => {
    render(<StatsView stats={STATS} filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    const kpis = within(screen.getByRole('region', { name: 'Indicadores' }));
    expect(kpis.getByText('$7.1M')).toHaveClass('text-destructive');
    expect(kpis.getByText('18 %')).toHaveClass('text-warning');
  });

  it('shows the four arrears tranches, the top debtors and the collectors', () => {
    render(<StatsView stats={STATS} filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    const arrears = within(screen.getByRole('region', { name: 'Mora por antigüedad' }));
    expect(arrears.getByText('Más de 30 días')).toBeInTheDocument();
    expect(arrears.getByText('$3.200.000 · 8 clientes')).toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'Clientes con mayor mora' })).getByText('32 días en mora')).toBeInTheDocument();
    const collectors = within(screen.getByRole('region', { name: 'Desempeño por cobrador' }));
    expect(collectors.getByText('Zona Norte · 92 % efectividad')).toHaveClass('text-success');
    expect(collectors.getByText('$300.000 en mora')).toBeInTheDocument();
  });

  it('says so when no client is in arrears or there are no collectors', () => {
    render(<StatsView stats={{ ...STATS, topArrears: [], collectors: [] }} filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    expect(screen.getByText('Ningún cliente en mora en este período.')).toBeInTheDocument();
    expect(screen.getByText('No hay cobradores para los filtros elegidos.')).toBeInTheDocument();
  });

  it('shows an empty state instead of the sections when there is no data', () => {
    render(<StatsView stats={{ ...STATS, isEmpty: true }} filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    expect(screen.getByText('Todavía no hay datos')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Indicadores' })).not.toBeInTheDocument();
  });
});
