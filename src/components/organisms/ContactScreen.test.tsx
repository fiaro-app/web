import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactScreen } from './ContactScreen';

const { sendLead } = vi.hoisted(() => ({ sendLead: vi.fn() }));
vi.mock('@/features/leads/leads-api', () => ({ sendLead }));

beforeEach(() => {
  vi.clearAllMocks();
  sendLead.mockResolvedValue({ received: true });
});

describe('ContactScreen', () => {
  it('shows the form with a hidden decoy field for robots', () => {
    const { container } = render(<ContactScreen signupHref="/registro" homeHref="/" />);

    expect(screen.getByRole('form', { name: 'Contactar ventas' })).toBeInTheDocument();
    const decoy = container.querySelector('input[name="website"]');
    expect(decoy).toHaveAttribute('tabindex', '-1');
    expect(decoy?.closest('[aria-hidden="true"]')).toHaveClass('hidden');
  });

  it('shows validation errors without calling the API', async () => {
    render(<ContactScreen signupHref="/registro" homeHref="/" />);

    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(screen.getByText('Escribe tu nombre.')).toBeInTheDocument();
    expect(sendLead).not.toHaveBeenCalled();
  });

  it('thanks the person and offers to sign up once the message is sent', async () => {
    render(<ContactScreen signupHref="/registro" homeHref="/" />);

    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana Pérez');
    await userEvent.type(screen.getByLabelText('Correo'), 'ana@ejemplo.co');
    await userEvent.type(screen.getByLabelText('Cuéntanos'), 'Quiero probar Fiaro con mis cobradores.');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    expect(await screen.findByRole('heading', { name: '¡Recibimos tu mensaje!' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crear mi cuenta gratis' })).toHaveAttribute('href', '/registro');
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  });
});
