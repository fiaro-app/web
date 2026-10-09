import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChangePasswordForm } from './ChangePasswordForm';

const { useChangePasswordForm } = vi.hoisted(() => ({ useChangePasswordForm: vi.fn() }));
vi.mock('@/features/auth/use-change-password-form', () => ({ useChangePasswordForm }));

const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
const state = (overrides = {}) => ({
  values: { currentPassword: '', newPassword: '', confirmPassword: '' },
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  setField: () => vi.fn(),
  submit,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useChangePasswordForm.mockReturnValue(state());
});

describe('ChangePasswordForm', () => {
  it('asks for the temporary password and the new one twice, and continues to the given route', async () => {
    render(<ChangePasswordForm redirectTo="/resumen" />);
    expect(useChangePasswordForm).toHaveBeenCalledWith({ redirectTo: '/resumen' });
    expect(screen.getByRole('form', { name: 'Cambia tu contraseña' })).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña temporal')).toHaveAttribute('autocomplete', 'current-password');
    expect(screen.getByLabelText('Contraseña nueva')).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByLabelText('Repite la contraseña nueva')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar y continuar' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('shows field and form errors', () => {
    useChangePasswordForm.mockReturnValue(state({ fieldErrors: { currentPassword: 'La contraseña actual no es correcta.' }, formError: 'Sin conexión' }));
    render(<ChangePasswordForm redirectTo="/resumen" />);
    expect(screen.getByText('La contraseña actual no es correcta.')).toBeInTheDocument();
    expect(screen.getByText('Sin conexión')).toBeInTheDocument();
  });
});
