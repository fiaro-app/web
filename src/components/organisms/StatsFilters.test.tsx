import userEvent from '@testing-library/user-event';
import { fieldValue } from '@/test/field-value';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EMPTY_STATS_FILTERS } from '@/features/stats/stats-filters';
import { StatsFilters } from './StatsFilters';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';
const OPTIONS = { collectors: [{ id: ID, name: 'Luis Gómez' }], portfolios: [{ id: 'p1', name: 'Zona Norte' }] };

describe('StatsFilters', () => {
  it('is a GET form to the statistics page with the four URL parameters', () => {
    const { container } = render(<StatsFilters filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    const form = screen.getByRole('form', { name: 'Filtros de estadísticas' });
    expect(form).toHaveAttribute('action', '/estadisticas');
    for (const name of ['desde', 'hasta', 'cobrador', 'cartera']) expect(container.querySelector(`[name="${name}"]`)).not.toBeNull();
  });

  it('offers every collector and portfolio plus an "all" option', async () => {
    render(<StatsFilters filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    await userEvent.click(screen.getByLabelText('Cobrador'));
    expect(screen.getByRole('option', { name: 'Todos los cobradores' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Luis Gómez' })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Cartera'));
    expect(screen.getByRole('option', { name: 'Todas las carteras' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Zona Norte' })).toBeInTheDocument();
  });

  it('shows the active filters and offers to clear them', () => {
    const { container } = render(<StatsFilters filters={{ from: '2026-10-01', to: '2026-10-09', collectorId: ID, portfolioId: 'p1' }} options={OPTIONS} />);
    expect(fieldValue(container, 'desde')).toBe('2026-10-01');
    expect(fieldValue(container, 'hasta')).toBe('2026-10-09');
    expect(fieldValue(container, 'cobrador')).toBe(ID);
    expect(fieldValue(container, 'cartera')).toBe('p1');
    expect(screen.getByRole('link', { name: 'Limpiar filtros' })).toHaveAttribute('href', '/estadisticas');
  });

  it('has nothing to clear without filters', () => {
    render(<StatsFilters filters={EMPTY_STATS_FILTERS} options={OPTIONS} />);
    expect(screen.queryByRole('link', { name: 'Limpiar filtros' })).not.toBeInTheDocument();
  });
});
