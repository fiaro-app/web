import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoanForm } from './LoanForm';

const { useLoanForm } = vi.hoisted(() => ({ useLoanForm: vi.fn() }));
vi.mock('@/features/loans/use-loan-form', () => ({ useLoanForm }));

const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
const state = (overrides = {}) => ({
  values: { clientId: '', principalAmount: null, installmentCount: '', installmentValue: null, totalPayable: null, frequency: '', startDate: '2026-10-09', collectorId: '' },
  createdLoanId: null,
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
const COLLECTORS = [{ id: 'm1', name: 'Luis Gómez' }];

beforeEach(() => {
  vi.clearAllMocks();
  useLoanForm.mockReturnValue(state());
});

describe('LoanForm', () => {
  it('renders every field with the client and frequency options', () => {
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
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
    render(<LoanForm clients={[]} collectors={COLLECTORS} />);
    expect(screen.getByText('Primero registra un cliente')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Registrar cliente' })).toHaveAttribute('href', '/clientes/nuevo');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('shows field and form errors', () => {
    useLoanForm.mockReturnValue(state({ fieldErrors: { clientId: 'Elige el cliente.' }, formError: 'Revisa los campos' }));
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
    expect(screen.getByText('Elige el cliente.')).toBeInTheDocument();
    expect(screen.getByText('Revisa los campos')).toBeInTheDocument();
  });

  it('submits through the hook and can be cancelled', async () => {
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Registrar préstamo' }));
    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/prestamos');
  });

  it('offers the optional collector select when there are collectors, and hides it otherwise', () => {
    const { rerender } = render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
    expect(screen.getByLabelText(/Cobrador asignado/)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Luis Gómez' })).toBeInTheDocument();
    rerender(<LoanForm clients={CLIENTS} collectors={[]} />);
    expect(screen.queryByLabelText(/Cobrador asignado/)).not.toBeInTheDocument();
  });

  it('replaces the submit button with a link to the created loan when the collector could not be assigned', () => {
    useLoanForm.mockReturnValue(state({ createdLoanId: 'l9', formError: 'El préstamo se creó, pero…' }));
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
    expect(screen.getByRole('link', { name: 'Ver el préstamo creado' })).toHaveAttribute('href', '/prestamos/l9');
    expect(screen.queryByRole('button', { name: 'Registrar préstamo' })).not.toBeInTheDocument();
  });

  it('passes the preselected client to the hook', () => {
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} initialClientId="c1" />);
    expect(useLoanForm).toHaveBeenCalledWith({ initialClientId: 'c1' });
  });
});
