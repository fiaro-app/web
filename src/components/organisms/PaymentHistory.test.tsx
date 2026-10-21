import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PaymentHistoryItem } from '@/features/subscription/checkout-endpoints';
import { PaymentHistory } from './PaymentHistory';

const ORDER: PaymentHistoryItem = {
  reference: 'fiaro-1',
  planCode: 'PRO',
  status: 'APPROVED',
  amountInCents: 6_900_000,
  currency: 'COP',
  createdAt: '2026-10-09T17:00:00.000Z',
  resolvedAt: '2026-10-09T17:01:00.000Z',
  periodEndsAt: '2026-11-09T17:00:00.000Z',
  months: 1,
  paymentMethodType: 'PSE',
};

describe('PaymentHistory', () => {
  it('says there is nothing yet when no order exists', () => {
    render(<PaymentHistory payments={[]} />);

    expect(screen.getByText('Todavía no has pagado ningún plan.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('lists each order with its plan, amount, method and status', () => {
    render(
      <PaymentHistory
        payments={[ORDER, { ...ORDER, reference: 'fiaro-2', status: 'PENDING', paymentMethodType: null }, { ...ORDER, reference: 'fiaro-3', paymentMethodType: 'DAVIPLATA' }]}
      />,
    );

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(3);
    const first = within(rows[0]!);
    expect(first.getByText('Pro')).toBeInTheDocument();
    expect(first.getByText('PSE')).toBeInTheDocument();
    expect(first.getByText('Pagado')).toBeInTheDocument();
    expect(first.getByText(/69\.000/)).toBeInTheDocument();
    expect(within(rows[1]!).getByText('En proceso')).toBeInTheDocument();
    expect(within(rows[1]!).getByText('—')).toBeInTheDocument();
    expect(within(rows[2]!).getByText('DAVIPLATA')).toBeInTheDocument();
  });
});
