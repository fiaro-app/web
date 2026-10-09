import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

import { AccountView } from './AccountView';

const BASE = { fullName: 'Ana Pérez', phoneNumber: '+573001234567' };

describe('AccountView', () => {
  it('shows the data, password, sessions and deactivation sections', () => {
    render(<AccountView {...BASE} contactEmail={null} contactEmailVerified={false} />);

    expect(screen.getByRole('heading', { name: 'Mi cuenta', level: 1 })).toBeInTheDocument();
    for (const name of ['Mis datos', 'Contraseña', 'Sesiones', 'Desactivar mi cuenta']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    }
    expect(screen.getByLabelText('Celular')).toBeDisabled();
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Ana Pérez');
  });

  it('asks to verify an unverified email', () => {
    render(<AccountView {...BASE} contactEmail="ana@correo.com" contactEmailVerified={false} />);

    expect(screen.getByText(/Correo sin verificar: ana@correo.com/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verificar correo' })).toBeInTheDocument();
  });

  it('says the email is verified and hides the verification form', () => {
    render(<AccountView {...BASE} contactEmail="ana@correo.com" contactEmailVerified />);

    expect(screen.getByText('Correo verificado')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Verificar correo' })).not.toBeInTheDocument();
  });
});
