import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoanForm } from './LoanForm';

const { useLoanForm, useClientRisk } = vi.hoisted(() => ({ useLoanForm: vi.fn(), useClientRisk: vi.fn() }));
vi.mock('@/features/loans/use-loan-form', () => ({ useLoanForm }));
vi.mock('@/features/risk/use-client-risk', () => ({ useClientRisk }));

const submit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
const state = (overrides = {}) => ({
  values: { clientId: '', principalAmount: null, installmentCount: '', installmentValue: null, totalPayable: null, frequency: '', startDate: '2026-10-09', collectorId: '' },
  createdLoanId: null,
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  setText: () => vi.fn(),
  setAmount: () => vi.fn(),
  submit,
  ...overrides,
});
const CLIENTS = [{ id: 'c1', label: 'Carlos Gómez · 1020304050' }];
const COLLECTORS = [{ id: 'm1', name: 'Luis Gómez' }];

beforeEach(() => {
  vi.clearAllMocks();
  useLoanForm.mockReturnValue(state());
  useClientRisk.mockReturnValue(null);
});

describe('LoanForm', () => {
  it('renders every field with the client and frequency options', async () => {
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
    expect(screen.getByRole('form', { name: 'Registrar préstamo' })).toBeInTheDocument();
    for (const label of [/^Cliente/, /Monto prestado/, /Número de cuotas/, /Valor de cada cuota/, /Total a pagar/, /Frecuencia de cobro/, /Fecha de inicio/]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    await userEvent.click(screen.getByLabelText(/^Cliente/));
    expect(screen.getByRole('option', { name: 'Carlos Gómez · 1020304050' })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/Frecuencia de cobro/));
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
    await userEvent.click(screen.getByRole('button', { name: 'Sí, registrar' }));
    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/prestamos');
  });

  it('offers the optional collector select when there are collectors, and hides it otherwise', async () => {
    const { rerender } = render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
    expect(screen.getByLabelText(/Cobrador asignado/)).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/Cobrador asignado/));
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

  it('shows the total to pay as read-only information', () => {
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);
    expect(screen.getByLabelText('Total a pagar')).toHaveAttribute('readonly');
  });
});

const RISK = { score: 80, level: 'VERY_HIGH', levelLabel: 'muy alto', tone: 'error', ariaLabel: 'Riesgo muy alto: 80 de 100', factors: ['Tiene un préstamo con 40 días de atraso.'], hasHistory: true };

describe('LoanForm risk', () => {
  it('shows the risk card with its factors once a client is chosen', () => {
    useClientRisk.mockReturnValue({ ...RISK, level: 'HIGH', levelLabel: 'alto' });
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);

    expect(screen.getByRole('region', { name: 'Riesgo del cliente' })).toBeInTheDocument();
    expect(screen.getByText('Tiene un préstamo con 40 días de atraso.')).toBeInTheDocument();
    expect(screen.queryByText(/riesgo muy alto con tu negocio/i)).not.toBeInTheDocument();
  });

  it('also warns, without blocking, when the chosen client has very high risk', () => {
    useClientRisk.mockReturnValue(RISK);
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);

    expect(screen.getByText(/riesgo muy alto con tu negocio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeEnabled();
  });

  it('puts the card in the right column, under the informative aside', () => {
    useClientRisk.mockReturnValue(RISK);
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);

    const aside = screen.getByRole('complementary', { hidden: true });
    const card = screen.getByRole('region', { name: 'Riesgo del cliente' });
    expect(aside.parentElement).toBe(card.parentElement);
    expect(aside.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('shows no card while there is no risk to show', () => {
    render(<LoanForm clients={CLIENTS} collectors={COLLECTORS} />);

    expect(screen.queryByRole('region', { name: 'Riesgo del cliente' })).not.toBeInTheDocument();
  });
});
