import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubscriptionBanner } from './SubscriptionBanner';

describe('SubscriptionBanner', () => {
  it('shows the notice with a way to renew', () => {
    render(<SubscriptionBanner notice={{ tone: 'warning', message: 'Tu prueba gratis termina en 3 días.' }} />);

    expect(screen.getByRole('status')).toHaveTextContent('Tu prueba gratis termina en 3 días.');
    expect(screen.getByRole('link', { name: 'Renovar plan' })).toHaveAttribute('href', '/plan');
  });

  it('announces a read-only business immediately', () => {
    render(<SubscriptionBanner notice={{ tone: 'error', message: 'Tu negocio está en modo de solo lectura.' }} />);

    expect(screen.getByRole('alert')).toHaveTextContent('solo lectura');
  });
});
