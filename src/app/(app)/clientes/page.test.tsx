import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClientsPage from './page';

const { getClients, getAccess, getClientsRisk } = vi.hoisted(() => ({ getClients: vi.fn(), getAccess: vi.fn(), getClientsRisk: vi.fn() }));
vi.mock('@/features/clients/get-clients.server', () => ({ getClients }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
vi.mock('@/features/risk/get-clients-risk.server', () => ({ getClientsRisk }));
vi.mock('@/components/organisms/ClientsView', () => ({
  ClientsView: ({ clients }: { clients: { rows: { id: string; risk?: { levelLabel: string } }[] } }) => <p>{clients.rows.map((row) => `${row.id}:${row.risk?.levelLabel ?? '-'}`).join(',')}</p>,
}));

const props = { searchParams: Promise.resolve({}) } as Parameters<typeof ClientsPage>[0];
const CLIENTS = { rows: [{ id: 'c1' }, { id: 'c2' }], total: 2, page: 1, pageSize: 10, search: '' };

beforeEach(() => {
  vi.clearAllMocks();
  getClients.mockResolvedValue({ status: 'ok', clients: CLIENTS });
  getAccess.mockResolvedValue({ canManage: true });
  getClientsRisk.mockResolvedValue(new Map([['c1', { levelLabel: 'alto' }]]));
});

describe('Clients page', () => {
  it('adds the risk of each client to its row', async () => {
    render(await ClientsPage(props));

    expect(screen.getByText('c1:alto,c2:-')).toBeInTheDocument();
    expect(getClientsRisk).toHaveBeenCalledWith(['c1', 'c2']);
  });

  it('does not ask for risk from someone who cannot manage the business', async () => {
    getAccess.mockResolvedValue({ canManage: false });

    render(await ClientsPage(props));

    expect(getClientsRisk).not.toHaveBeenCalled();
    expect(screen.getByText('c1:-,c2:-')).toBeInTheDocument();
  });
});
