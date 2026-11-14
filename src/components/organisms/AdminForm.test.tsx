import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdminForm } from './AdminForm';

const form = (overrides = {}) =>
  ({
    values: { fullName: '', nationalId: '', phone: '', contactEmail: '' },
    fieldErrors: {},
    formError: null,
    isSubmitting: false,
    invited: null,
    setField: () => vi.fn(),
    submit: vi.fn(),
    ...overrides,
  }) as never;

describe('AdminForm', () => {
  it('has the four fields and no portfolio', () => {
    render(<AdminForm form={form()} />);

    expect(screen.getByRole('form', { name: 'Invitar a un administrador' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Cédula')).toBeInTheDocument();
    expect(screen.getByLabelText('Celular')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Cartera/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/administradores');
  });

  it('shows the field errors and the form error', () => {
    render(<AdminForm form={form({ fieldErrors: { fullName: 'Escribe el nombre completo.' }, formError: 'Revisa los campos' })} />);

    expect(screen.getByText('Escribe el nombre completo.')).toBeInTheDocument();
    expect(screen.getByText('Revisa los campos')).toBeInTheDocument();
  });
});
