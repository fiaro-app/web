import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoanDetailView } from '@/features/loans/loans-view-model';
import { LoanDetail } from './LoanDetail';

const { useCancelLoan } = vi.hoisted(() => ({ useCancelLoan: vi.fn() }));
vi.mock('@/features/loans/use-cancel-loan', () => ({ useCancelLoan }));
vi.mock('@/features/loans/use-assign-collector', () => ({
  useAssignCollector: () => ({ collectorId: '', isSubmitting: false, error: null, notice: null, changeCollector: vi.fn(), submit: vi.fn() }),
}));

const cancel = vi.fn();
const LOAN: LoanDetailView = {
  id: 'l1',
  clientName: 'Carlos Gómez',
  principal: '$500.000',
  installments: '20 × $30.000',
  totalPayable: '$600.000',
  frequency: 'Diaria',
  startDate: '01/10/2026',
  status: 'Activo',
  statusTone: 'info',
  closedAt: null,
  cancelable: true,
  balance: '$380.000',
  paidInstallments: '7 de 20',
  overdue: null,
  nextDueDate: '10/10/2026',
  collector: { name: 'Luis Gómez', since: '01/10/2026', until: null },
  assignable: true,
};
const COLLECTORS = [{ id: 'm1', name: 'Luis Gómez' }];

beforeEach(() => {
  vi.clearAllMocks();
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
  useCancelLoan.mockReturnValue({ isCanceling: false, error: null, cancel });
});

describe('LoanDetail', () => {
  it('shows the loan data', () => {
    render(<LoanDetail loan={LOAN} collectors={COLLECTORS} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Carlos Gómez' })).toBeInTheDocument();
    for (const text of ['$500.000', '20 × $30.000', '$600.000', 'Diaria', '01/10/2026', 'Activo']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.queryByText('Cerrado el')).not.toBeInTheDocument();
  });

  it('asks for confirmation before cancelling', async () => {
    render(<LoanDetail loan={LOAN} collectors={COLLECTORS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Anular préstamo' }));
    expect(cancel).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Anular' }));
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('offers no cancel action once the loan is closed and shows when it closed', () => {
    render(<LoanDetail loan={{ ...LOAN, cancelable: false, assignable: false, status: 'Anulado', statusTone: 'muted', closedAt: '02/10/2026' }} collectors={COLLECTORS} />);
    expect(screen.queryByRole('button', { name: 'Anular préstamo' })).not.toBeInTheDocument();
    expect(screen.getByText('02/10/2026')).toBeInTheDocument();
  });

  it('shows why the API refused to cancel', () => {
    useCancelLoan.mockReturnValue({ isCanceling: false, error: 'Ya no se puede anular', cancel });
    render(<LoanDetail loan={LOAN} collectors={COLLECTORS} />);
    expect(screen.getByText('Ya no se puede anular')).toBeInTheDocument();
  });

  it('shows the balance, paid installments, next due date and the collector with the start of the assignment', () => {
    render(<LoanDetail loan={LOAN} collectors={COLLECTORS} />);
    expect(screen.getByText('$380.000')).toBeInTheDocument();
    expect(screen.getByText('7 de 20')).toBeInTheDocument();
    expect(screen.getByText('10/10/2026')).toBeInTheDocument();
    // El nombre aparece también como opción del selector de asignación.
    expect(screen.getAllByText('Luis Gómez').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('desde 01/10/2026')).toBeInTheDocument();
  });

  it('warns about the overdue amount', () => {
    render(<LoanDetail loan={{ ...LOAN, overdue: { amount: '$60.000', days: '2 días de mora' } }} collectors={COLLECTORS} />);
    expect(screen.getByText('Vencido: $60.000 · 2 días de mora')).toBeInTheDocument();
  });

  it('says when nobody collects the loan and omits balance rows that are unknown', () => {
    render(<LoanDetail loan={{ ...LOAN, collector: null, balance: null, paidInstallments: null, nextDueDate: null }} collectors={COLLECTORS} />);
    expect(screen.getByText('Sin cobrador asignado')).toBeInTheDocument();
    expect(screen.queryByText('Saldo')).not.toBeInTheDocument();
  });

  it('shows the temporary assignment range', () => {
    render(<LoanDetail loan={{ ...LOAN, collector: { name: 'Luis Gómez', since: '09/10/2026', until: '09/10/2026' } }} collectors={COLLECTORS} />);
    expect(screen.getByText('desde 09/10/2026 hasta 09/10/2026')).toBeInTheDocument();
  });

  it('offers to assign a collector only while the loan is active', () => {
    const { rerender } = render(<LoanDetail loan={LOAN} collectors={COLLECTORS} />);
    expect(screen.getByRole('form', { name: 'Asignar cobrador' })).toBeInTheDocument();
    rerender(<LoanDetail loan={{ ...LOAN, assignable: false }} collectors={COLLECTORS} />);
    expect(screen.queryByRole('form', { name: 'Asignar cobrador' })).not.toBeInTheDocument();
  });
});
