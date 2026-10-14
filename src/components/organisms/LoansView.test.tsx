import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { LoansViewModel } from '@/features/loans/loans-view-model';
import { LoansView } from './LoansView';

const ROW = {
  id: 'l1',
  clientName: 'Carlos Gómez',
  collectorName: 'Luis Pérez',
  overdue: 'Al día',
  overdueAmount: null,
  isOverdue: false,
  nextDue: '10/10/2026',
  principal: '$500.000',
  installments: '20 × $30.000',
  balance: '$380.000',
  paid: '7/20',
  frequency: 'Diaria',
  startDate: '01/10/2026',
  status: 'Activo',
  statusTone: 'info' as const,
};
const view = (overrides: Partial<LoansViewModel> = {}): LoansViewModel => ({
  rows: [ROW],
  total: 1,
  page: 1,
  pageSize: 20,
  status: null,
  search: '',
  ...overrides,
});

describe('LoansView', () => {
  it('shows the title, the register link and the status filters', () => {
    render(<LoansView loans={view()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Préstamos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+ Nuevo préstamo' })).toHaveAttribute('href', '/prestamos/nuevo');
    expect(screen.getByRole('link', { name: 'Todos' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Activo' })).toHaveAttribute('href', '/prestamos?estado=ACTIVE');
  });

  it('marks the active filter', () => {
    render(<LoansView loans={view({ status: 'PAID_OFF' })} />);
    expect(screen.getByRole('link', { name: 'Pagado' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Todos' })).not.toHaveAttribute('aria-current');
  });

  it('shows the empty state, with a different message when filtered', () => {
    const { rerender } = render(<LoansView loans={view({ rows: [], total: 0 })} />);
    expect(screen.getByText('Aún no tienes préstamos')).toBeInTheDocument();
    rerender(<LoansView loans={view({ rows: [], total: 0, status: 'CANCELED' })} />);
    expect(screen.getByText('Sin préstamos en este estado')).toBeInTheDocument();
  });

  it('keeps the status filter in the pagination links', () => {
    render(<LoansView loans={view({ total: 45, status: 'ACTIVE' })} />);
    expect(screen.getByText('Página 1 de 3 · 45 préstamos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', '/prestamos?pagina=2&estado=ACTIVE');
  });

  it('offers a search by client that keeps the status filter', () => {
    render(<LoansView loans={view({ status: 'ACTIVE', search: 'carlos' })} />);
    expect(screen.getByRole('searchbox')).toHaveValue('carlos');
    expect(screen.getByRole('link', { name: 'Limpiar búsqueda' })).toHaveAttribute('href', '/prestamos?estado=ACTIVE');
  });

  it('says nothing matched the search', () => {
    render(<LoansView loans={view({ rows: [], total: 0, search: 'zzz' })} />);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });
});
