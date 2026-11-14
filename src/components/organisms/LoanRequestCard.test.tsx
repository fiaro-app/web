import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { toLoanRequestsViewModel } from '@/features/loan-requests/loan-requests-view-model';
import { NEW_CLIENT_REQUEST } from '@/test/loan-request-fixture';
import { LoanRequestCard } from './LoanRequestCard';

vi.mock('./LoanRequestReviewForm', () => ({ LoanRequestReviewForm: () => <p>formulario de revisión</p> }));

const rowOf = (overrides = {}) => ({
  ...toLoanRequestsViewModel([NEW_CLIENT_REQUEST], { total: 1, page: 1, pageSize: 10 }, null).rows[0]!,
  ...overrides,
});

describe('LoanRequestCard', () => {
  it('shows who suggested it, for which client and with what conditions', () => {
    render(<LoanRequestCard row={rowOf()} />);

    expect(screen.getByRole('article', { name: 'Rosa Pardo · 51234567' })).toBeInTheDocument();
    expect(screen.getByText(/Cliente nuevo/)).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText(/20 cuotas/)).toBeInTheDocument();
  });

  it('opens and closes the review form of a pending request', async () => {
    render(<LoanRequestCard row={rowOf()} />);

    expect(screen.queryByText('formulario de revisión')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Revisar' }));
    expect(screen.getByText('formulario de revisión')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByText('formulario de revisión')).not.toBeInTheDocument();
  });

  it('has no review for a resolved request, and links to the loan it created', () => {
    render(<LoanRequestCard row={rowOf({ reviewable: false, status: 'Aceptada', statusTone: 'good', loanHref: '/prestamos/l1', isNewClient: false })} />);

    expect(screen.queryByRole('button', { name: 'Revisar' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver el préstamo' })).toHaveAttribute('href', '/prestamos/l1');
    expect(screen.getByText(/Cliente del negocio/)).toBeInTheDocument();
  });

  it('shows the rejection reason', () => {
    render(<LoanRequestCard row={rowOf({ reviewable: false, status: 'Rechazada', statusTone: 'bad', rejectionReason: 'Está en mora' })} />);

    expect(screen.getByText(/Está en mora/)).toBeInTheDocument();
  });
});
