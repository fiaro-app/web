import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { useCollectorForm } from '@/features/collectors/use-collector-form';
import { CollectorForm } from './CollectorForm';

type State = ReturnType<typeof useCollectorForm>;

function buildForm(overrides: Partial<State> = {}): State {
  return {
    values: { fullName: '', nationalId: '', phone: '', contactEmail: '', portfolioId: '' },
    fieldErrors: {},
    formError: null,
    isSubmitting: false,
    invited: null,
    setField: () => vi.fn(),
    submit: vi.fn((event) => event.preventDefault()),
    ...overrides,
  } as State;
}

const PORTFOLIOS = [{ id: 'p1', name: 'Zona Norte' }];

describe('CollectorForm', () => {
  it('renders every field and the portfolio options', async () => {
    render(<CollectorForm form={buildForm()} portfolios={PORTFOLIOS} />);
    expect(screen.getByLabelText(/Nombre completo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cédula/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Celular/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Zona Norte' })).toBeInTheDocument();
  });

  it('shows field and form errors', () => {
    render(
      <CollectorForm
        form={buildForm({ fieldErrors: { phone: 'Celular inválido' }, formError: 'Revisa los campos' })}
        portfolios={PORTFOLIOS}
      />,
    );
    expect(screen.getByText('Celular inválido')).toBeInTheDocument();
    expect(screen.getByText('Revisa los campos')).toBeInTheDocument();
  });

  it('submits through the hook and offers to cancel', async () => {
    const form = buildForm();
    render(<CollectorForm form={form} portfolios={PORTFOLIOS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Registrar cobrador' }));
    await userEvent.click(screen.getByRole('button', { name: 'Registrar' }));
    expect(form.submit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/cobradores');
  });
});
