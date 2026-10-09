import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrandColorForm } from './BrandColorForm';

const { useBrandColorForm } = vi.hoisted(() => ({ useBrandColorForm: vi.fn() }));
vi.mock('@/features/lender/use-settings-forms', () => ({ useBrandColorForm }));

const reset = vi.fn();
const state = (overrides = {}) => ({
  color: '#0F766E',
  fieldError: undefined,
  isSubmitting: false,
  error: null,
  notice: null,
  isCustom: true,
  changeColor: vi.fn(),
  submit: vi.fn((event: { preventDefault: () => void }) => event.preventDefault()),
  reset,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useBrandColorForm.mockReturnValue(state());
});

describe('BrandColorForm', () => {
  it('shows the color picker, a preview and the actions to an administrator', async () => {
    render(<BrandColorForm brandColor="#0F766E" canEdit />);

    expect(screen.getByLabelText('Color')).toHaveValue('#0f766e');
    expect(screen.getByText('Así se verá un botón')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar color' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Volver al color de Fiaro' }));
    expect(reset).toHaveBeenCalled();
  });

  it('offers no way back to the default when the color is already the default', () => {
    useBrandColorForm.mockReturnValue(state({ isCustom: false }));
    render(<BrandColorForm brandColor={null} canEdit />);

    expect(screen.queryByRole('button', { name: 'Volver al color de Fiaro' })).not.toBeInTheDocument();
  });

  it('only shows the color without permission', () => {
    render(<BrandColorForm brandColor="#0F766E" canEdit={false} />);

    expect(screen.getByLabelText('Color')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Guardar color' })).not.toBeInTheDocument();
  });

  it('shows the field error and the API feedback', () => {
    useBrandColorForm.mockReturnValue(state({ fieldError: 'Elige un color más oscuro', error: 'Falló', notice: 'Color actualizado.' }));
    render(<BrandColorForm brandColor={null} canEdit />);

    for (const text of ['Elige un color más oscuro', 'Falló', 'Color actualizado.']) expect(screen.getByText(text)).toBeInTheDocument();
  });
});
