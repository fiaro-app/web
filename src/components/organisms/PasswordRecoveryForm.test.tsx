import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordRecoveryForm } from './PasswordRecoveryForm';

const { usePasswordRecovery } = vi.hoisted(() => ({ usePasswordRecovery: vi.fn() }));
vi.mock('@/features/auth/use-password-recovery', () => ({ usePasswordRecovery }));

const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
const resendCode = vi.fn();
const changePhone = vi.fn();
const state = (overrides = {}) => ({
  step: 'request',
  values: { phone: '', code: '', newPassword: '', confirmPassword: '' },
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  codeResent: false,
  setField: () => vi.fn(),
  submit,
  resendCode,
  changePhone,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  usePasswordRecovery.mockReturnValue(state());
});

describe('PasswordRecoveryForm', () => {
  it('first asks for the phone and explains where the code goes without revealing accounts', async () => {
    render(<PasswordRecoveryForm />);
    expect(screen.getByRole('form', { name: 'Recupera tu contraseña' })).toBeInTheDocument();
    expect(screen.getByLabelText('Celular')).toBeInTheDocument();
    expect(screen.getByText(/Si tu cuenta tiene un correo de contacto/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Enviar código' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('then asks for the code and the new password twice', () => {
    usePasswordRecovery.mockReturnValue(state({ step: 'reset' }));
    render(<PasswordRecoveryForm />);
    expect(screen.getByRole('form', { name: 'Elige una contraseña nueva' })).toBeInTheDocument();
    expect(screen.getByLabelText('Código')).toHaveAttribute('autocomplete', 'one-time-code');
    expect(screen.getByLabelText('Contraseña nueva')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Repite la contraseña nueva')).toBeInTheDocument();
    expect(screen.queryByLabelText('Celular')).not.toBeInTheDocument();
  });

  it('can resend the code or go back to change the phone', async () => {
    usePasswordRecovery.mockReturnValue(state({ step: 'reset' }));
    render(<PasswordRecoveryForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Reenviar código' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cambiar celular' }));
    expect(resendCode).toHaveBeenCalledTimes(1);
    expect(changePhone).toHaveBeenCalledTimes(1);
  });

  it('confirms a resent code and shows errors', () => {
    usePasswordRecovery.mockReturnValue(state({ step: 'reset', codeResent: true, formError: 'No pudimos conectarnos', fieldErrors: { code: 'El código venció' } }));
    render(<PasswordRecoveryForm />);
    expect(screen.getByText('Te enviamos un código nuevo; el anterior ya no sirve.')).toBeInTheDocument();
    expect(screen.getByText('No pudimos conectarnos')).toBeInTheDocument();
    expect(screen.getByText('El código venció')).toBeInTheDocument();
  });

  it('ends with a link to sign in', () => {
    usePasswordRecovery.mockReturnValue(state({ step: 'done' }));
    render(<PasswordRecoveryForm />);
    expect(screen.getByRole('heading', { level: 1, name: 'Contraseña cambiada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
});
