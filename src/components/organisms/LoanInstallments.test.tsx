import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { InstallmentRow } from '@/features/loans/installments-view-model';
import { LoanInstallments } from './LoanInstallments';

const ROWS: InstallmentRow[] = [
  { number: 1, dueDate: '01/10/2026', expected: '$30.000', paid: '$30.000', status: 'Pagada', statusTone: 'success' },
  { number: 2, dueDate: '08/10/2026', expected: '$30.000', paid: '—', status: 'Vencida', statusTone: 'error' },
];

describe('LoanInstallments', () => {
  it('lists every installment with its status and a summary', () => {
    render(<LoanInstallments rows={ROWS} summary={{ total: 2, paid: 1, overdue: 1 }} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Calendario de cuotas' })).toBeInTheDocument();
    expect(screen.getByText('1 de 2 cuotas pagadas · 1 vencidas')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Vencida')).toBeInTheDocument();
    expect(screen.queryByText('Acciones')).not.toBeInTheDocument();
  });

  it('omits the overdue count when nothing is overdue', () => {
    render(<LoanInstallments rows={ROWS.slice(0, 1)} summary={{ total: 1, paid: 1, overdue: 0 }} />);

    expect(screen.getByText('1 de 1 cuotas pagadas')).toBeInTheDocument();
  });

  it('says so when there are no installments', () => {
    render(<LoanInstallments rows={[]} summary={{ total: 0, paid: 0, overdue: 0 }} />);

    expect(screen.getByText('Este préstamo no tiene cuotas por mostrar.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
