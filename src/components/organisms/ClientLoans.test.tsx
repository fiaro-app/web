import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { LoanRow } from '@/features/loans/loans-view-model';
import { ClientLoans } from './ClientLoans';

const LOAN: LoanRow = {
  id: 'l1',
  clientName: 'Carlos Gómez',
  principal: '$500.000',
  installments: '20 × $30.000',
  balance: '$380.000',
  paid: '7/20',
  frequency: 'Diaria',
  startDate: '01/10/2026',
  status: 'Activo',
  statusTone: 'info',
};

describe('ClientLoans', () => {
  it('lists the loans with installments, balance and status', () => {
    render(<ClientLoans clientId="c1" loans={[LOAN, { ...LOAN, id: 'l2', principal: '$200.000', status: 'Pagado', statusTone: 'success' }]} />);
    const items = within(screen.getByRole('list', { name: 'Préstamos del cliente' })).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByText('20 × $30.000 · saldo $380.000')).toBeInTheDocument();
    expect(within(items[1]!).getByText('Pagado')).toHaveClass('text-success');
  });

  it('links each loan to its detail', () => {
    render(<ClientLoans clientId="c1" loans={[LOAN]} />);
    expect(screen.getByRole('link', { name: 'Ver préstamo de $500.000' })).toHaveAttribute('href', '/prestamos/l1');
  });

  it('offers a new loan for this client, even when it has none', () => {
    render(<ClientLoans clientId="c1" loans={[]} />);
    expect(screen.getByRole('link', { name: '+ Nuevo préstamo' })).toHaveAttribute('href', '/prestamos/nuevo?cliente=c1');
    expect(screen.getByText('Este cliente todavía no tiene préstamos.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
