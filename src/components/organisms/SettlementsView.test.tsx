import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
    expect(screen.getByText('Sin cuadres en este estado')).toBeInTheDocument();
  });

  it('keeps the status filter in the pagination links', () => {
    render(<SettlementsView settlements={view({ total: 45, status: 'PENDING' })} />);
    expect(screen.getByText('Página 1 de 3 · 45 cuadres')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', '/cuadres?pagina=2&estado=PENDING');
  });
});
