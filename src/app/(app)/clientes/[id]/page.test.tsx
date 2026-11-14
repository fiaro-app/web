import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EditClientPage from './page';

const { getClient, getAccess, getClientLoans, getClientsRisk } = vi.hoisted(() => ({ getClient: vi.fn(), getAccess: vi.fn(), getClientLoans: vi.fn(), getClientsRisk: vi.fn() }));
vi.mock('@/features/clients/get-client.server', () => ({ getClient }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
vi.mock('@/features/loans/get-client-loans.server', () => ({ getClientLoans }));
vi.mock('@/features/risk/get-clients-risk.server', () => ({ getClientsRisk }));
vi.mock('@/components/organisms/ClientForm', () => ({ ClientForm: () => <form aria-label="Editar cliente" /> }));
vi.mock('@/components/organisms/ClientLoans', () => ({ ClientLoans: () => <p>Préstamos</p> }));
vi.mock('@/components/organisms/ClientRiskCard', () => ({ ClientRiskCard: ({ risk }: { risk: { levelLabel: string } }) => <p>riesgo {risk.levelLabel}</p> }));

const props = { params: Promise.resolve({ id: 'c1' }) } as Parameters<typeof EditClientPage>[0];

beforeEach(() => {
  vi.clearAllMocks();
  getClient.mockResolvedValue({ status: 'ok', client: { id: 'c1' } });
  getAccess.mockResolvedValue({ canManage: true });
  getClientLoans.mockResolvedValue([]);
});

describe('Edit client page', () => {
  it('shows the risk card when the risk could be read', async () => {
    getClientsRisk.mockResolvedValue(new Map([['c1', { levelLabel: 'alto' }]]));

    render(await EditClientPage(props));

    expect(screen.getByText('riesgo alto')).toBeInTheDocument();
  });

  it('leaves the card out when the risk could not be read', async () => {
    getClientsRisk.mockResolvedValue(new Map());

    render(await EditClientPage(props));

    expect(screen.queryByText(/riesgo/)).not.toBeInTheDocument();
    expect(screen.getByText('Préstamos')).toBeInTheDocument();
  });
});
