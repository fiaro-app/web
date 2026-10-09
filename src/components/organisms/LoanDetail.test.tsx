import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoanDetailView } from '@/features/loans/loans-view-model';
import { LoanDetail } from './LoanDetail';

const { useCancelLoan } = vi.hoisted(() => ({ useCancelLoan: vi.fn() }));
vi.mock('@/features/loans/use-cancel-loan', () => ({ useCancelLoan }));

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
};

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
    render(<LoanDetail loan={LOAN} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Carlos Gómez' })).toBeInTheDocument();
    for (const text of ['$500.000', '20 × $30.000', '$600.000', 'Diaria', '01/10/2026', 'Activo']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.queryByText('Cerrado el')).not.toBeInTheDocument();
  });

  it('asks for confirmation before cancelling', async () => {
    render(<LoanDetail loan={LOAN} />);
    await userEvent.click(screen.getByRole('button', { name: 'Anular préstamo' }));
    expect(cancel).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Anular' }));
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('offers no cancel action once the loan is closed and shows when it closed', () => {
    render(<LoanDetail loan={{ ...LOAN, cancelable: false, status: 'Anulado', statusTone: 'muted', closedAt: '02/10/2026' }} />);
    expect(screen.queryByRole('button', { name: 'Anular préstamo' })).not.toBeInTheDocument();
    expect(screen.getByText('02/10/2026')).toBeInTheDocument();
  });

  it('shows why the API refused to cancel', () => {
    useCancelLoan.mockReturnValue({ isCanceling: false, error: 'Ya no se puede anular', cancel });
    render(<LoanDetail loan={LOAN} />);
    expect(screen.getByText('Ya no se puede anular')).toBeInTheDocument();
  });
});
