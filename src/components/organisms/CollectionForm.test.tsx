import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectionForm } from './CollectionForm';

const { useCollectionForm } = vi.hoisted(() => ({ useCollectionForm: vi.fn() }));
vi.mock('@/features/visits/use-collection-form', () => ({ useCollectionForm }));

const submit = vi.fn();
const chooseOutcome = vi.fn();
const state = (overrides = {}) => ({
  outcome: 'PAID',
  amount: 30_000,
  method: 'CASH',
  promisedDate: '',
  fieldErrors: {},
  formError: null,
  notice: null,
  isSubmitting: false,
  confirmation: { title: '¿Registrar este pago?', description: 'Se registra un pago de $30.000.', confirmLabel: 'Registrar pago' },
  chooseOutcome,
  setAmount: vi.fn(),
  setMethod: vi.fn(),
  setPromisedDate: vi.fn(),
  submit,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useCollectionForm.mockReturnValue(state());
});

describe('CollectionForm', () => {
  it('offers the four outcomes and, for a payment, the amount and the method', () => {
    render(<CollectionForm loanId="l1" installmentValue={30_000} />);

    expect(useCollectionForm).toHaveBeenCalledWith({ loanId: 'l1', installmentValue: 30_000 });
    for (const name of ['Pagó', 'Reprogramado', 'No encontrado', 'Se negó a pagar']) expect(screen.getByRole('radio', { name })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Pagó' })).toBeChecked();
    expect(screen.getByLabelText('Monto recibido')).toBeInTheDocument();
    expect(screen.getByLabelText('Medio de pago')).toBeInTheDocument();
    expect(screen.queryByLabelText('Fecha prometida')).not.toBeInTheDocument();
  });

  it('asks for the promised date on a reschedule instead of the amount', () => {
    useCollectionForm.mockReturnValue(state({ outcome: 'RESCHEDULED' }));
    render(<CollectionForm loanId="l1" installmentValue={30_000} />);

    expect(screen.getByLabelText('Fecha prometida')).toBeInTheDocument();
    expect(screen.queryByLabelText('Monto recibido')).not.toBeInTheDocument();
  });

  it('changes the outcome through the hook', async () => {
    render(<CollectionForm loanId="l1" installmentValue={30_000} />);
    await userEvent.click(screen.getByRole('radio', { name: 'No encontrado' }));
    expect(chooseOutcome).toHaveBeenCalledWith('NOT_FOUND');
  });

  it('asks for confirmation before registering', async () => {
    render(<CollectionForm loanId="l1" installmentValue={30_000} />);

    await userEvent.click(screen.getByRole('button', { name: 'Registrar cobro' }));
    expect(screen.getByRole('heading', { name: '¿Registrar este pago?' })).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Registrar pago' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('shows field errors, the API error and the success notice', () => {
    useCollectionForm.mockReturnValue(state({ fieldErrors: { amount: 'Escribe el monto recibido.' }, formError: 'Falló', notice: 'Cobro registrado.' }));
    render(<CollectionForm loanId="l1" installmentValue={30_000} />);

    for (const text of ['Escribe el monto recibido.', 'Falló', 'Cobro registrado.']) expect(screen.getByText(text)).toBeInTheDocument();
  });
});
