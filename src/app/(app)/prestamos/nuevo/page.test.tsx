import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewLoanPage from './page';

const { getClientOptions } = vi.hoisted(() => ({ getClientOptions: vi.fn() }));
const { getAccess } = vi.hoisted(() => ({ getAccess: vi.fn() }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
vi.mock('@/features/loans/get-client-names.server', () => ({ getClientOptions }));
vi.mock('@/features/loans/get-collector-options.server', () => ({ getCollectorOptions: vi.fn().mockResolvedValue([]) }));
vi.mock('@/components/organisms/LoanForm', () => ({ LoanForm: () => <form aria-label="Registrar préstamo" /> }));

const props = { searchParams: Promise.resolve({}) } as Parameters<typeof NewLoanPage>[0];

beforeEach(() => {
  vi.clearAllMocks();
  getAccess.mockResolvedValue({ canManage: true, canCollect: false, membershipId: null });
});

describe('New loan page', () => {
  it('adds the informative aside when there are clients to lend to', async () => {
    getClientOptions.mockResolvedValue([{ id: 'c1', label: 'Ana' }]);

    render(await NewLoanPage(props));

    expect(screen.getByRole('form', { name: 'Registrar préstamo' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { hidden: true })).toBeInTheDocument();
  });

  it('leaves the full-page empty state alone when there are no clients', async () => {
    getClientOptions.mockResolvedValue([]);

    render(await NewLoanPage(props));

    expect(screen.queryByRole('complementary', { hidden: true })).not.toBeInTheDocument();
  });

  it('does not offer the form to someone who cannot register loans', async () => {
    getAccess.mockResolvedValue({ canManage: false, canCollect: true, membershipId: null });
    render(await NewLoanPage(props));

    expect(screen.queryByRole('form', { name: 'Registrar préstamo' })).not.toBeInTheDocument();
    expect(getClientOptions).not.toHaveBeenCalled();
  });
});
