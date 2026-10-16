import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminCreateScreen } from './AdminCreateScreen';

const { useAdminForm } = vi.hoisted(() => ({ useAdminForm: vi.fn() }));
vi.mock('@/features/admins/use-admin-form', () => ({ useAdminForm }));

const base = { values: { fullName: '', nationalId: '', phone: '', contactEmail: '' }, fieldErrors: {}, formError: null, isSubmitting: false, setField: () => vi.fn(), submit: vi.fn() };

beforeEach(() => vi.clearAllMocks());

describe('AdminCreateScreen', () => {
  it('shows the form until the administrator is invited', () => {
    useAdminForm.mockReturnValue({ ...base, invited: null });
    render(<AdminCreateScreen />);

    expect(screen.getByRole('form', { name: 'Invitar a un administrador' })).toBeInTheDocument();
  });

  it('shows the one-time temporary password once the API answers', () => {
    useAdminForm.mockReturnValue({ ...base, invited: { fullName: 'Lucía', tempPassword: 'pw-1' } });
    render(<AdminCreateScreen />);

    expect(screen.getByText('pw-1')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a administradores' })).toHaveAttribute('href', '/administradores');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('says so when the person already had an account', () => {
    useAdminForm.mockReturnValue({ ...base, invited: { fullName: 'Lucía', tempPassword: null } });
    render(<AdminCreateScreen />);

    expect(screen.getByText(/ya tenía una cuenta/)).toBeInTheDocument();
    expect(screen.queryByText('Contraseña temporal')).not.toBeInTheDocument();
  });
});
