import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initialReviewValues } from '@/features/loan-requests/use-review-loan-request';
import { EXISTING_CLIENT_REQUEST, NEW_CLIENT_REQUEST } from '@/test/loan-request-fixture';
import { LoanRequestReviewForm } from './LoanRequestReviewForm';

const { useReviewLoanRequest } = vi.hoisted(() => ({ useReviewLoanRequest: vi.fn() }));
vi.mock('@/features/loan-requests/use-review-loan-request', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/loan-requests/use-review-loan-request')>()),
  useReviewLoanRequest,
}));

const approve = vi.fn();
const reject = vi.fn();
const state = (overrides = {}) => ({
  values: initialReviewValues(NEW_CLIENT_REQUEST),
  reason: '',
  setText: () => vi.fn(),
  setAmount: () => vi.fn(),
  setStartDate: vi.fn(),
  changeReason: vi.fn(),
  pending: null,
  error: null,
  notice: null,
  approve,
  reject,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
  useReviewLoanRequest.mockReturnValue(state());
});

describe('LoanRequestReviewForm', () => {
  it('shows the client and the loan fields prefilled for a new client', () => {
    render(<LoanRequestReviewForm request={NEW_CLIENT_REQUEST} />);

    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Rosa Pardo');
    expect(screen.getByLabelText('Número de cuotas')).toHaveValue('20');
    expect(screen.getAllByText('Diaria').length).toBeGreaterThan(0);
  });

  it('hides the client fields when the client already existed', () => {
    useReviewLoanRequest.mockReturnValue(state({ values: initialReviewValues(EXISTING_CLIENT_REQUEST) }));
    render(<LoanRequestReviewForm request={EXISTING_CLIENT_REQUEST} />);

    expect(screen.queryByLabelText('Nombre completo')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Número de cuotas')).toBeInTheDocument();
  });

  it('asks for confirmation before accepting or rejecting', async () => {
    render(<LoanRequestReviewForm request={NEW_CLIENT_REQUEST} />);

    await userEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(approve).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Sí, aceptar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, rechazar' }));

    expect(approve).toHaveBeenCalledTimes(1);
    expect(reject).toHaveBeenCalledTimes(1);
  });

  it('can cancel the confirmation', async () => {
    render(<LoanRequestReviewForm request={NEW_CLIENT_REQUEST} />);

    await userEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(approve).not.toHaveBeenCalled();
  });

  it('shows errors and notices', () => {
    useReviewLoanRequest.mockReturnValue(state({ error: 'Ya fue resuelta', notice: 'Solicitud aceptada' }));
    render(<LoanRequestReviewForm request={NEW_CLIENT_REQUEST} />);

    expect(screen.getByText('Ya fue resuelta')).toBeInTheDocument();
    expect(screen.getByText('Solicitud aceptada')).toBeInTheDocument();
  });

  it('locks the fields and the actions while a decision is in flight', () => {
    useReviewLoanRequest.mockReturnValue(state({ pending: 'approve' }));
    render(<LoanRequestReviewForm request={NEW_CLIENT_REQUEST} />);

    expect(screen.getByRole('button', { name: 'Rechazar' })).toBeDisabled();
    expect(screen.getByLabelText('Número de cuotas')).toBeDisabled();
    expect(screen.getByLabelText('Motivo del rechazo (opcional)')).toBeDisabled();
  });
});
