import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CollectorInvited } from './CollectorInvited';

describe('CollectorInvited', () => {
  it('shows the one-time temporary password for a new account', () => {
    render(<CollectorInvited invited={{ fullName: 'Luis Gómez', tempPassword: 'abc-123-xyz' }} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cobrador registrado' })).toBeInTheDocument();
    expect(screen.getByText('abc-123-xyz')).toBeInTheDocument();
    expect(screen.getByText(/solo se muestra una vez/)).toBeInTheDocument();
  });

  it('shows no password when the person already had an account', () => {
    render(<CollectorInvited invited={{ fullName: 'Luis Gómez', tempPassword: null }} />);
    expect(screen.queryByText('Contraseña temporal')).not.toBeInTheDocument();
    expect(screen.getByText(/ya tenía una cuenta/)).toBeInTheDocument();
  });

  it('links back to the collectors list', () => {
    render(<CollectorInvited invited={{ fullName: 'Luis', tempPassword: null }} />);
    expect(screen.getByRole('link', { name: 'Volver a cobradores' })).toHaveAttribute('href', '/cobradores');
  });
});
