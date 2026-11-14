import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { registerOwner, signIn } from '@/features/auth/auth-api';
import { RegisterScreen } from './RegisterScreen';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh: vi.fn() }) }));
vi.mock('@/features/auth/auth-api', () => ({ registerOwner: vi.fn(), signIn: vi.fn() }));

const registerMock = vi.mocked(registerOwner);
const signInMock = vi.mocked(signIn);

beforeEach(() => {
  vi.clearAllMocks();
  registerMock.mockResolvedValue({} as never);
  signInMock.mockResolvedValue({} as never);
});

async function fillAccount() {
  await userEvent.type(screen.getByLabelText(/Nombre completo/), 'Ana Pérez');
  await userEvent.type(screen.getByLabelText(/^Celular/), '300 123 4567');
  await userEvent.type(screen.getByLabelText(/Cédula/), '1020304050');
  await userEvent.type(screen.getByLabelText(/^Correo electrónico/), 'ana@correo.com');
  await userEvent.type(screen.getByLabelText(/^Contraseña/), 'una-contraseña-segura');
}

async function acceptRequired() {
  await userEvent.click(screen.getByLabelText(/Leí y acepto los/));
  await userEvent.click(screen.getByLabelText(/Autorizo el tratamiento/));
  await userEvent.click(screen.getByLabelText(/Acepto la/));
  await userEvent.click(screen.getByLabelText(/Declaro que tengo la autorización/));
}

describe('RegisterScreen', () => {
  it('starts on step 1: personal data, the progress and the matching brand message', () => {
    render(<RegisterScreen redirectTo="/resumen" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Tus datos personales' })).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 2')).toBeInTheDocument();
    expect(screen.getByText('Crea tu cuenta en Fiaro')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Correo electrónico/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Atrás' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toHaveAttribute('href', '/login');
  });

  it('shows the errors of the required fields instead of moving on', async () => {
    render(<RegisterScreen redirectTo="/resumen" />);

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByText('Escribe tu nombre completo.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu celular.')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu correo.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Tus datos personales' })).toBeInTheDocument();
  });

  it('goes to step 2, can go back keeping the data, and creates the account at the end', async () => {
    render(<RegisterScreen redirectTo="/resumen" />);
    await fillAccount();
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Datos de tu financiera' })).toBeInTheDocument();
    expect(screen.getByText('Paso 2 de 2')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Atrás' }));
    expect(screen.getByLabelText(/Nombre completo/)).toHaveValue('Ana Pérez');
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    await userEvent.type(screen.getByLabelText(/Nombre de la financiera/), 'Préstamos Ana');
    await acceptRequired();
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/resumen'));
    expect(registerMock).toHaveBeenCalledOnce();
    expect(signInMock).toHaveBeenCalledWith({ identifier: '+573001234567', password: 'una-contraseña-segura' });
  });

  it('brings the person back to step 1 when the phone is already registered', async () => {
    registerMock.mockRejectedValue(new ApiRequestError({ statusCode: 409, code: 'PHONE_ALREADY_REGISTERED', message: 'x' }));
    render(<RegisterScreen redirectTo="/resumen" />);
    await fillAccount();
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    await userEvent.type(screen.getByLabelText(/Nombre de la financiera/), 'Préstamos Ana');
    await acceptRequired();
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText(/Ya existe una cuenta con ese celular/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Celular/)).toHaveAttribute('aria-invalid', 'true');
  });

  it('keeps «Crear cuenta» disabled, and says why, until the four required authorizations are checked', async () => {
    render(<RegisterScreen redirectTo="/resumen" />);
    await fillAccount();
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    await userEvent.type(screen.getByLabelText(/Nombre de la financiera/), 'Préstamos Ana');

    const submit = screen.getByRole('button', { name: 'Crear cuenta' });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAccessibleDescription(/cuatro autorizaciones obligatorias/);
    expect(screen.getByRole('link', { name: 'Términos y Condiciones' })).toHaveAttribute('href', '/terminos');
    expect(screen.getByRole('link', { name: 'Política de Privacidad' })).toHaveAttribute('href', '/privacidad');

    await userEvent.click(screen.getByLabelText(/Leí y acepto los/));
    await userEvent.click(screen.getByLabelText(/Autorizo el tratamiento/));
    await userEvent.click(screen.getByLabelText(/Declaro que tengo la autorización/));
    expect(submit).toBeDisabled();
    expect(registerMock).not.toHaveBeenCalled();

    await userEvent.click(screen.getByLabelText(/cookies/i));
    expect(submit).toBeEnabled();
    expect(screen.queryByText(/cuatro autorizaciones obligatorias/)).not.toBeInTheDocument();
  });
});
