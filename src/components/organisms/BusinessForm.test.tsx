import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BusinessForm } from './BusinessForm';

const { useBusinessForm } = vi.hoisted(() => ({ useBusinessForm: vi.fn() }));
vi.mock('@/features/lender/use-settings-forms', () => ({ useBusinessForm }));

const state = (overrides = {}) => ({
  name: 'Buen Vecino',
  fieldError: undefined,
  isSubmitting: false,
  error: null,
  notice: null,
  changeName: vi.fn(),
  submit: vi.fn((event: { preventDefault: () => void }) => event.preventDefault()),
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useBusinessForm.mockReturnValue(state());
});

describe('BusinessForm', () => {
  it('shows the current name and a save button for an administrator', () => {
    render(<BusinessForm name="Buen Vecino" canEdit />);
    expect(useBusinessForm).toHaveBeenCalledWith({ name: 'Buen Vecino' });
    expect(screen.getByLabelText(/Nombre de la financiera/)).toHaveValue('Buen Vecino');
    expect(screen.getByRole('button', { name: 'Guardar nombre' })).toBeInTheDocument();
  });

  it('is read-only without permission: disabled field and no save button', () => {
    render(<BusinessForm name="Buen Vecino" canEdit={false} />);
    expect(screen.getByLabelText(/Nombre de la financiera/)).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Guardar nombre' })).not.toBeInTheDocument();
  });

  it('shows field errors, API errors and notices', () => {
    useBusinessForm.mockReturnValue(state({ fieldError: 'Escribe el nombre', error: 'Sin permiso', notice: 'Nombre actualizado.' }));
    render(<BusinessForm name="x" canEdit />);
    expect(screen.getByText('Escribe el nombre')).toBeInTheDocument();
    expect(screen.getByText('Sin permiso')).toBeInTheDocument();
    expect(screen.getByText('Nombre actualizado.')).toBeInTheDocument();
  });
});
