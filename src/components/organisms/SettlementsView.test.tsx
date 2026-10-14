import { fieldValue } from '@/test/field-value';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EMPTY_SETTLEMENT_FILTERS } from '@/features/settlements/settlement-filters';
import type { SettlementsViewModel } from '@/features/settlements/settlements-view-model';
import { SettlementsView } from './SettlementsView';

const ROW = {
  id: 's1',
  collectorName: 'Luis Gómez',
  portfolioName: 'Zona Norte',
  date: '08/10/2026',
  expected: '$100.000',
  collected: '$100.000',
  difference: null,
  differenceTone: 'neutral' as const,
  status: 'Pendiente',
  statusTone: 'warning' as const,
  reviewable: true,
};
const view = (overrides: Partial<SettlementsViewModel> = {}): SettlementsViewModel => ({
  rows: [ROW],
  total: 1,
  page: 1,
  pageSize: 20,
  status: null,
  filters: EMPTY_SETTLEMENT_FILTERS,
  ...overrides,
});

describe('SettlementsView', () => {
  it('shows the title and the status filters', () => {
    render(<SettlementsView settlements={view()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cuadres' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Todos' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Pendiente' })).toHaveAttribute('href', '/cuadres?estado=PENDING');
  });

  it('marks the active filter', () => {
    render(<SettlementsView settlements={view({ status: 'REJECTED' })} />);
    expect(screen.getByRole('link', { name: 'Rechazado' })).toHaveAttribute('aria-current', 'true');
  });

  it('shows the empty state, with a different message when filtered', () => {
    const { rerender } = render(<SettlementsView settlements={view({ rows: [], total: 0 })} />);
    expect(screen.getByText('Aún no hay cuadres')).toBeInTheDocument();
    rerender(<SettlementsView settlements={view({ rows: [], total: 0, status: 'APPROVED' })} />);
    expect(screen.getByText('Sin cuadres con estos filtros')).toBeInTheDocument();
  });

  it('keeps the status filter in the pagination links', () => {
    render(<SettlementsView settlements={view({ total: 45, status: 'PENDING' })} />);
    expect(screen.getByText('Página 1 de 3 · 45 cuadres')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', '/cuadres?pagina=2&estado=PENDING');
  });

  it('offers date, collector and portfolio filters that keep the active status', () => {
    const options = { collectors: [{ id: 'c1', name: 'Luis Gómez' }], portfolios: [{ id: 'p1', name: 'Zona Norte' }] };
    const filters = { from: '2026-10-01', to: '2026-10-09', collectorId: 'c1', portfolioId: '' };
    const { container } = render(<SettlementsView settlements={view({ status: 'PENDING', filters })} options={options} />);

    expect(fieldValue(container, 'desde')).toBe('2026-10-01');
    expect(fieldValue(container, 'cobrador')).toBe('c1');
    expect(fieldValue(container, 'cartera')).toBe('');
    expect(container.querySelector('input[type="hidden"][name="estado"]')).toHaveValue('PENDING');
    expect(screen.getByRole('link', { name: 'Limpiar filtros' })).toHaveAttribute('href', '/cuadres?estado=PENDING');
  });

  it('keeps the date and collector filters in the status pills and the pagination links', () => {
    const filters = { from: '2026-10-01', to: '2026-10-09', collectorId: 'c1', portfolioId: '' };
    render(<SettlementsView settlements={view({ total: 45, filters })} />);

    const query = 'desde=2026-10-01&hasta=2026-10-09&cobrador=c1';
    expect(screen.getByRole('link', { name: 'Pendiente' })).toHaveAttribute('href', `/cuadres?${query}&estado=PENDING`);
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', `/cuadres?pagina=2&${query}`);
  });
});
