import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { signIn } from '@/features/auth/auth-api';
import { LoginForm } from './LoginForm';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh: vi.fn() }) }));
vi.mock('@/features/auth/auth-api', () => ({ signIn: vi.fn() }));

const signInMock = vi.mocked(signIn);

function setup() {
  render(<LoginForm redirectTo="/resumen" forgotPasswordHref="/recuperar-contrasena" />);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoginForm', () => {
  it('is a named form with the page heading, both fields and the forgot-password link', () => {
    setup();

    expect(screen.getByRole('form', { name: 'Inicio de sesión' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Inicia sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Celular')).toHaveAttribute('autocomplete', 'username');
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('link', { name: '¿Olvidaste tu contraseña?' })).toHaveAttribute('href', '/recuperar-contrasena');
  });

  it('flags the empty fields on submit and tells assistive tech', async () => {
    setup();

    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(screen.getByLabelText('Celular')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Escribe tu celular.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu contraseña.')).toBeInTheDocument();
  });

  it('signs in and redirects', async () => {
    signInMock.mockResolvedValue({} as never);
    setup();

    await userEvent.type(screen.getByLabelText('Celular'), '300 123 4567');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secreta-123');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/resumen'));
    expect(signInMock).toHaveBeenCalledWith({ phone: '+573001234567', password: 'secreta-123' });
  });

  it('announces a failed sign-in as an alert', async () => {
    signInMock.mockRejectedValue(
      new ApiRequestError({ statusCode: 429, code: 'SIGN_IN_LOCKED', message: 'x', retryAfterSeconds: 900 }),
    );
    setup();

    await userEvent.type(screen.getByLabelText('Celular'), '3001234567');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('15 minutos');
  });
});
