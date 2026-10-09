import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EMPTY_STATS_FILTERS } from '@/features/stats/stats-filters';
import { StatsFilters } from './StatsFilters';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';
const OPTIONS = { collectors: [{ id: ID, name: 'Luis Gómez' }], portfolios: [{ id: 'p1', name: 'Zona Norte' }] };

describe('StatsFilters', () => {
  it('is a GET form to the statistics page with the four URL parameters', () => {
    render(<StatsFilters filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    const form = screen.getByRole('form', { name: 'Filtros de estadísticas' });
    expect(form).toHaveAttribute('action', '/estadisticas');
    expect(screen.getByLabelText('Desde')).toHaveAttribute('name', 'desde');
    expect(screen.getByLabelText('Hasta')).toHaveAttribute('name', 'hasta');
    expect(screen.getByLabelText('Cobrador')).toHaveAttribute('name', 'cobrador');
    expect(screen.getByLabelText('Cartera')).toHaveAttribute('name', 'cartera');
  });

  it('offers every collector and portfolio plus an "all" option', () => {
    render(<StatsFilters filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'Todos los cobradores' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Luis Gómez' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Todas las carteras' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Zona Norte' })).toBeInTheDocument();
  });

  it('shows the active filters and offers to clear them', () => {
    render(<StatsFilters filters={{ from: '2026-10-01', to: '2026-10-09', collectorId: ID, portfolioId: 'p1' }} options={OPTIONS} />);
    expect(screen.getByLabelText('Desde')).toHaveValue('2026-10-01');
    expect(screen.getByLabelText('Hasta')).toHaveValue('2026-10-09');
    expect(screen.getByLabelText('Cobrador')).toHaveValue(ID);
    expect(screen.getByLabelText('Cartera')).toHaveValue('p1');
    expect(screen.getByRole('link', { name: 'Limpiar filtros' })).toHaveAttribute('href', '/estadisticas');
  });

  it('has nothing to clear without filters', () => {
    render(<StatsFilters filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    expect(screen.queryByRole('link', { name: 'Limpiar filtros' })).not.toBeInTheDocument();
  });
});
