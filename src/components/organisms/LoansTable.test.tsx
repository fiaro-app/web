import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoansTable } from './LoansTable';

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
  status: 'Pagado',
  statusTone: 'success' as const,
};

describe('LoansTable', () => {
  it('renders every column of a loan', () => {
    render(<LoansTable rows={[ROW]} />);
    const row = screen.getByRole('row', { name: /Carlos Gómez/ });
    expect(within(row).getByRole('rowheader', { name: 'Carlos Gómez' })).toBeInTheDocument();
    for (const text of ['$500.000', '20 × $30.000', '7/20', '$380.000', 'Luis Pérez', 'Al día', '10/10/2026', 'Pagado']) {
      expect(within(row).getByText(text)).toBeInTheDocument();
    }
  });

  it('colors the status by tone without relying on color alone', () => {
    render(<LoansTable rows={[ROW, { ...ROW, id: 'l2', status: 'Anulado', statusTone: 'muted' }]} />);
    expect(screen.getByText('Pagado')).toHaveClass('text-primary');
    expect(screen.getByText('Anulado')).toHaveClass('text-foreground/70');
  });

  it('highlights the arrears with the overdue amount', () => {
    render(<LoansTable rows={[{ ...ROW, overdue: '3 días', overdueAmount: '$90.000', isOverdue: true }]} />);

    expect(screen.getByText('3 días')).toHaveClass('text-destructive');
    expect(screen.getByText('$90.000')).toBeInTheDocument();
  });

  it('links each row to its detail with a descriptive name', () => {
    render(<LoansTable rows={[ROW]} />);
    expect(screen.getByRole('link', { name: 'Ver préstamo de Carlos Gómez' })).toHaveAttribute('href', '/prestamos/l1');
  });

  it('labels every cell with its header so the row reads as a card on narrow screens', () => {
    render(<LoansTable rows={[ROW]} />);

    const row = screen.getByRole('row', { name: /Carlos Gómez/ });
    expect(within(row).getByText('$380.000')).toHaveAttribute('data-label', 'Saldo');
    expect(within(row).getByText('10/10/2026')).toHaveAttribute('data-label', 'Próxima cuota');
  });
});
