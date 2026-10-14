import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoanPage from './page';

const { getLoan, getAccess } = vi.hoisted(() => ({ getLoan: vi.fn(), getAccess: vi.fn() }));
vi.mock('@/features/loans/get-loan.server', () => ({ getLoan }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
vi.mock('@/features/loans/get-installments.server', () => ({ getLoanInstallments: vi.fn().mockResolvedValue([]) }));
vi.mock('@/features/visits/get-visits.server', () => ({ getLoanVisits: vi.fn().mockResolvedValue([]) }));
vi.mock('@/components/organisms/LoanDetail', () => ({ LoanDetail: ({ canManage }: { canManage: boolean }) => <p>detalle {String(canManage)}</p> }));
vi.mock('@/components/organisms/LoanInstallments', () => ({ LoanInstallments: () => <p>cuotas</p> }));
vi.mock('@/components/organisms/LoanVisits', () => ({ LoanVisits: () => <p>visitas</p> }));
vi.mock('@/components/organisms/CollectionForm', () => ({ CollectionForm: () => <form aria-label="Registrar cobro" /> }));

const props = { params: Promise.resolve({ id: 'l1' }) } as Parameters<typeof LoanPage>[0];
const ok = (collect: string) => ({ status: 'ok', loan: { id: 'l1', installmentValue: 30_000 }, collectorOptions: [], collect });

beforeEach(() => {
  vi.clearAllMocks();
  getAccess.mockResolvedValue({ canManage: true, canCollect: true, membershipId: 'm1' });
});

describe('Loan page', () => {
  it('offers to register a collection when the loan is assigned to the person', async () => {
    getLoan.mockResolvedValue(ok('available'));
    render(await LoanPage(props));

    expect(screen.getByRole('form', { name: 'Registrar cobro' })).toBeInTheDocument();
    expect(screen.getByText('detalle true')).toBeInTheDocument();
  });

  it('explains why it cannot collect when the loan belongs to someone else', async () => {
    getLoan.mockResolvedValue(ok('unassigned'));
    render(await LoanPage(props));

    expect(screen.queryByRole('form', { name: 'Registrar cobro' })).not.toBeInTheDocument();
    expect(screen.getByText(/no está asignado a ti hoy/)).toBeInTheDocument();
  });

  it('shows neither the form nor the notice when collecting does not apply, and hides management from a collector', async () => {
    getLoan.mockResolvedValue(ok('unavailable'));
    getAccess.mockResolvedValue({ canManage: false, canCollect: true, membershipId: 'm1' });
    render(await LoanPage(props));

    expect(screen.queryByRole('form', { name: 'Registrar cobro' })).not.toBeInTheDocument();
    expect(screen.getByText('detalle false')).toBeInTheDocument();
  });

  it('shows the states of a missing or forbidden loan', async () => {
    getLoan.mockResolvedValue({ status: 'not-found' });
    const { unmount } = render(await LoanPage(props));
    expect(screen.queryByText('detalle true')).not.toBeInTheDocument();
    unmount();

    getLoan.mockResolvedValue({ status: 'forbidden' });
    render(await LoanPage(props));
    expect(screen.queryByText('detalle true')).not.toBeInTheDocument();
  });
});
