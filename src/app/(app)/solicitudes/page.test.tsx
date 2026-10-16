import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoanRequestsPage from './page';

const { getLoanRequests } = vi.hoisted(() => ({ getLoanRequests: vi.fn() }));
vi.mock('@/features/loan-requests/get-loan-requests.server', () => ({ getLoanRequests }));

const props = (params: Record<string, string> = {}) => ({ searchParams: Promise.resolve(params) }) as Parameters<typeof LoanRequestsPage>[0];

beforeEach(() => vi.clearAllMocks());

describe('Loan requests page', () => {
  it('reads the page and the status from the URL', async () => {
    getLoanRequests.mockResolvedValue({ status: 'ok', requests: { rows: [], total: 0, page: 2, pageSize: 10, status: 'APPROVED' } });

    render(await LoanRequestsPage(props({ pagina: '2', estado: 'APPROVED' })));

    expect(getLoanRequests).toHaveBeenCalledWith(2, 'APPROVED');
    expect(screen.getByRole('heading', { level: 1, name: 'Solicitudes' })).toBeInTheDocument();
  });

  it('explains it when the person cannot see the requests', async () => {
    getLoanRequests.mockResolvedValue({ status: 'forbidden' });

    render(await LoanRequestsPage(props()));

    expect(screen.getByRole('heading', { name: /No tienes acceso/ })).toBeInTheDocument();
  });
});
