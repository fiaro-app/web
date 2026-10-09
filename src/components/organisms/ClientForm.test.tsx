import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientForm } from './ClientForm';

const { useClientForm } = vi.hoisted(() => ({ useClientForm: vi.fn() }));
vi.mock('@/features/clients/use-client-form', () => ({ useClientForm }));

const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
const state = (overrides = {}) => ({
  values: { fullName: 'Carlos', nationalId: '1020304050', phone: '', occupation: '', address: '' },
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  isEditing: false,
  setField: () => vi.fn(),
  submit,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useClientForm.mockReturnValue(state());
});

describe('ClientForm', () => {
  it('renders the create form with every field', () => {
    render(<ClientForm />);
    expect(screen.getByRole('form', { name: 'Registrar cliente' })).toBeInTheDocument();
    for (const label of [/Nombre completo/, /Cédula/, /Teléfono/, /Oficio/, /Dirección/]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Registrar cliente' })).toBeInTheDocument();
  });

  it('renders the edit wording when editing', () => {
    useClientForm.mockReturnValue(state({ isEditing: true }));
    render(<ClientForm />);
    expect(screen.getByRole('form', { name: 'Editar cliente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument();
  });

  it('shows field and form errors', () => {
    useClientForm.mockReturnValue(state({ fieldErrors: { nationalId: 'Cédula repetida' }, formError: 'Revisa los campos' }));
    render(<ClientForm />);
    expect(screen.getByText('Cédula repetida')).toBeInTheDocument();
    expect(screen.getByText('Revisa los campos')).toBeInTheDocument();
  });

  it('submits through the hook and can be cancelled', async () => {
    render(<ClientForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Registrar cliente' }));
    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/clientes');
  });
});
