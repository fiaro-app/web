import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoanForm } from './LoanForm';

const { useLoanForm } = vi.hoisted(() => ({ useLoanForm: vi.fn() }));
vi.mock('@/features/loans/use-loan-form', () => ({ useLoanForm }));

const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
const state = (overrides = {}) => ({
  values: { clientId: '', principalAmount: null, installmentCount: '', installmentValue: null, totalPayable: null, frequency: '', startDate: '2026-10-09' },
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  setText: () => vi.fn(),
  setAmount: () => vi.fn(),
  setTotalPayable: vi.fn(),
  submit,
  ...overrides,
});
const CLIENTS = [{ id: 'c1', label: 'Carlos Gómez · 1020304050' }];

beforeEach(() => {
  vi.clearAllMocks();
  useLoanForm.mockReturnValue(state());
});

describe('LoanForm', () => {
  it('renders every field with the client and frequency options', () => {
    render(<LoanForm clients={CLIENTS} />);
    expect(screen.getByRole('form', { name: 'Registrar préstamo' })).toBeInTheDocument();
    for (const label of [/^Cliente/, /Monto prestado/, /Número de cuotas/, /Valor de cada cuota/, /Total a pagar/, /Frecuencia de cobro/, /Fecha de inicio/]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByRole('option', { name: 'Carlos Gómez · 1020304050' })).toBeInTheDocument();
    for (const frequency of ['Diaria', 'Semanal', 'Quincenal', 'Mensual']) {
      expect(screen.getByRole('option', { name: frequency })).toBeInTheDocument();
    }
  });

  it('asks to register a client first when there are none', () => {
    render(<LoanForm clients={[]} />);
    expect(screen.getByText('Primero registra un cliente')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Registrar cliente' })).toHaveAttribute('href', '/clientes/nuevo');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('shows field and form errors', () => {
    useLoanForm.mockReturnValue(state({ fieldErrors: { clientId: 'Elige el cliente.' }, formError: 'Revisa los campos' }));
    render(<LoanForm clients={CLIENTS} />);
    expect(screen.getByText('Elige el cliente.')).toBeInTheDocument();
    expect(screen.getByText('Revisa los campos')).toBeInTheDocument();
  });

  it('submits through the hook and can be cancelled', async () => {
    render(<LoanForm clients={CLIENTS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Registrar préstamo' }));
    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/prestamos');
  });
});
