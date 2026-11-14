import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PlatformPayment } from '@/features/platform-payments/endpoints';
import { PlatformPayments } from './PlatformPayments';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/features/platform-payments/refund-api', () => ({ refundPayment: vi.fn() }));

const payment = (over: Partial<PlatformPayment> = {}): PlatformPayment => ({
  reference: 'fiaro-1',
  tenantName: 'El Águila',
  planCode: 'PRO',
  months: 1,
  amountInCents: 6_900_000,
  currency: 'COP',
  status: 'APPROVED',
  paymentMethodType: 'CARD',
  createdAt: '2026-11-13T15:00:00.000Z',
  resolvedAt: null,
  periodEndsAt: null,
  refundedAt: null,
  refundMode: null,
  ...over,
});

describe('PlatformPayments', () => {
  it('shows an empty message with no payments', () => {
    render(<PlatformPayments payments={[]} />);

    expect(screen.getByText('Todavía no hay pagos.')).toBeInTheDocument();
  });

  it('lists the payments with their business and lets only the approved ones be refunded', () => {
    render(<PlatformPayments payments={[payment(), payment({ reference: 'fiaro-2', status: 'REFUNDED', tenantName: 'La Perla' })]} />);

    expect(screen.getByText('El Águila')).toBeInTheDocument();
    expect(screen.getByText('Reembolsado')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Reembolsar' })).toHaveLength(1);
  });

  it('opens the refund form under the row and closes it again', async () => {
    const user = userEvent.setup();
    render(<PlatformPayments payments={[payment()]} />);

    await user.click(screen.getByRole('button', { name: 'Reembolsar' }));
    expect(screen.getByRole('form', { name: 'Reembolsar el pago de El Águila' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
