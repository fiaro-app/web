import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckoutResult } from './CheckoutResult';

const { useCheckoutStatus } = vi.hoisted(() => ({ useCheckoutStatus: vi.fn() }));
vi.mock('@/features/subscription/use-checkout-status', () => ({ useCheckoutStatus }));

const resolved = (over: Record<string, unknown>) => ({
  kind: 'resolved',
  status: {
    reference: 'fiaro-abc',
    planCode: 'PRO',
    status: 'APPROVED',
    amountInCents: 6_900_000,
    currency: 'COP',
    createdAt: '2026-10-16T12:00:00.000Z',
    resolvedAt: '2026-10-16T12:01:00.000Z',
    periodEndsAt: '2026-11-16T17:00:00.000Z',
    ...over,
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CheckoutResult', () => {
  it('asks the person to wait while the payment is confirmed', () => {
    useCheckoutStatus.mockReturnValue({ kind: 'checking' });
    render(<CheckoutResult reference="fiaro-abc" />);

    expect(screen.getByText('Estamos confirmando tu pago')).toBeInTheDocument();
    expect(useCheckoutStatus).toHaveBeenCalledWith('fiaro-abc');
  });

  it('celebrates an approved payment with the plan and its end date', () => {
    useCheckoutStatus.mockReturnValue(resolved({}));
    render(<CheckoutResult reference="fiaro-abc" />);

    expect(screen.getByText('¡Pago recibido!')).toBeInTheDocument();
    expect(screen.getByText(/Tu plan Pro está activo hasta el 16\/11\/2026/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir al panel' })).toHaveAttribute('href', '/resumen');
  });

  it.each(['DECLINED', 'VOIDED', 'ERROR'])('says a %s payment did not go through and offers to try again', (status) => {
    useCheckoutStatus.mockReturnValue(resolved({ status, periodEndsAt: null }));
    render(<CheckoutResult reference="fiaro-abc" />);

    expect(screen.getByText('El pago no se completó')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Intentar de nuevo' })).toHaveAttribute('href', '/plan');
  });

  it('tells the person a slow payment is still in process', () => {
    useCheckoutStatus.mockReturnValue({ kind: 'slow' });
    render(<CheckoutResult reference="fiaro-abc" />);

    expect(screen.getByText('Tu pago sigue en proceso')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a Plan y pagos' })).toHaveAttribute('href', '/plan');
  });

  it('says the order does not exist', () => {
    useCheckoutStatus.mockReturnValue({ kind: 'not-found' });
    render(<CheckoutResult reference="fiaro-nope" />);

    expect(screen.getByText('No encontramos ese pago')).toBeInTheDocument();
  });
});
