import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/organisms/PrivateImage', () => ({ PrivateImage: ({ id }: { id: string }) => <div>proof of {id}</div> }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import type { VisitRow } from '@/features/visits/visits-view-model';
import { LoanVisits } from './LoanVisits';

const ROW: VisitRow = {
  id: 'v1',
  date: '01/10/2026',
  collectorName: 'Alejo Zuleta',
  outcome: 'Pagó',
  outcomeTone: 'success',
  expected: '$30.000',
  collected: '$30.000',
  method: 'Efectivo',
  note: null,
  paymentId: 'pay-1',
  reversiblePaymentId: 'p1',
  reverted: false,
};

describe('LoanVisits', () => {
  it('says there are no visits yet', () => {
    render(<LoanVisits visits={[]} />);

    expect(screen.getByText('Este préstamo todavía no tiene visitas de cobro.')).toBeInTheDocument();
  });

  it('shows each visit and opens the reversal form from its row', async () => {
    render(<LoanVisits visits={[ROW]} />);
    const row = screen.getByRole('row', { name: /01\/10\/2026/ });
    expect(within(row).getByText('Alejo Zuleta')).toBeInTheDocument();

    await userEvent.click(within(row).getByRole('button', { name: 'Revertir pago del 01/10/2026' }));
    expect(screen.getByRole('form', { name: 'Revertir el pago' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('form', { name: 'Revertir el pago' })).not.toBeInTheDocument();
  });

  it('marks a reverted payment and offers no second reversal', () => {
    render(<LoanVisits visits={[{ ...ROW, reverted: true, reversiblePaymentId: null, note: 'Motivo: Monto equivocado' }]} />);

    expect(screen.getByText('Revertido')).toBeInTheDocument();
    expect(screen.getByText('Motivo: Monto equivocado')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Revertir pago/ })).not.toBeInTheDocument();
  });

  it('opens the payment proof of a visit and closes it', async () => {
    render(<LoanVisits visits={[ROW]} />);

    await userEvent.click(screen.getByRole('button', { name: /Comprobante del/ }));
    expect(screen.getByText('proof of pay-1')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByText('proof of pay-1')).not.toBeInTheDocument();
  });
});
