import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettlementReviewForm } from './SettlementReviewForm';

const { useReviewSettlement } = vi.hoisted(() => ({ useReviewSettlement: vi.fn() }));
vi.mock('@/features/settlements/use-review-settlement', () => ({ useReviewSettlement }));

const approve = vi.fn();
const reject = vi.fn();
const state = (overrides = {}) => ({ note: '', changeNote: vi.fn(), pending: null, error: null, notice: null, approve, reject, ...overrides });

beforeEach(() => {
  vi.clearAllMocks();
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
  useReviewSettlement.mockReturnValue(state());
});

describe('SettlementReviewForm', () => {
  it('approves and rejects through the hook', async () => {
    render(<SettlementReviewForm settlementId="s1" />);
    expect(useReviewSettlement).toHaveBeenCalledWith('s1');
    await userEvent.click(screen.getByRole('button', { name: 'Aprobar cuadre' }));
    expect(approve).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Aprobar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Rechazar cuadre' }));
    await userEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    expect(approve).toHaveBeenCalledTimes(1);
    expect(reject).toHaveBeenCalledTimes(1);
  });

  it('has an optional comment field', () => {
    render(<SettlementReviewForm settlementId="s1" />);
    expect(screen.getByLabelText('Comentario (opcional)')).toBeInTheDocument();
  });

  it('shows errors and notices', () => {
    useReviewSettlement.mockReturnValue(state({ error: 'Ya fue revisado', notice: 'Cuadre aprobado.' }));
    render(<SettlementReviewForm settlementId="s1" />);
    expect(screen.getByText('Ya fue revisado')).toBeInTheDocument();
    expect(screen.getByText('Cuadre aprobado.')).toBeInTheDocument();
  });

  it('locks the actions while a decision is in flight', () => {
    useReviewSettlement.mockReturnValue(state({ pending: 'approve' }));
    render(<SettlementReviewForm settlementId="s1" />);
    expect(screen.getByRole('button', { name: 'Rechazar cuadre' })).toBeDisabled();
    expect(screen.getByLabelText('Comentario (opcional)')).toBeDisabled();
  });
});
