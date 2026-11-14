import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { toLoanRequestsViewModel, type LoanRequestsViewModel } from '@/features/loan-requests/loan-requests-view-model';
import { NEW_CLIENT_REQUEST } from '@/test/loan-request-fixture';
import { LoanRequestsView } from './LoanRequestsView';

vi.mock('./LoanRequestCard', () => ({ LoanRequestCard: ({ row }: { row: { clientLabel: string } }) => <p>{row.clientLabel}</p> }));

const view = (overrides: Partial<LoanRequestsViewModel> = {}): LoanRequestsViewModel => ({
  ...toLoanRequestsViewModel([NEW_CLIENT_REQUEST], { total: 1, page: 1, pageSize: 10 }, 'PENDING'),
  ...overrides,
});

describe('LoanRequestsView', () => {
  it('shows the title, the status filters and a card per request', () => {
    render(<LoanRequestsView requests={view()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Solicitudes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pendiente' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Aceptada' })).toHaveAttribute('href', '/solicitudes?estado=APPROVED');
    expect(screen.getByRole('link', { name: 'Todas' })).toHaveAttribute('href', '/solicitudes?estado=TODOS');
    expect(screen.getByText('Rosa Pardo · 51234567')).toBeInTheDocument();
  });

  it('marks "Todas" when every status is shown', () => {
    render(<LoanRequestsView requests={view({ status: null })} />);

    expect(screen.getByRole('link', { name: 'Todas' })).toHaveAttribute('aria-current', 'true');
  });

  it('explains it when there is nothing to review', () => {
    render(<LoanRequestsView requests={view({ rows: [], total: 0 })} />);

    expect(screen.getByRole('heading', { name: 'No hay solicitudes por revisar' })).toBeInTheDocument();
  });

  it('paginates keeping the status', () => {
    render(<LoanRequestsView requests={view({ total: 25, page: 2, pageSize: 10 })} />);

    expect(screen.getByText('Página 2 de 3 · 25 solicitudes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Siguiente/ })).toHaveAttribute('href', '/solicitudes?pagina=3&estado=PENDING');
  });
});
