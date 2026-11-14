import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminsPage from './page';

const { getAdmins } = vi.hoisted(() => ({ getAdmins: vi.fn() }));
vi.mock('@/features/admins/get-admins.server', () => ({ getAdmins }));
vi.mock('@/components/organisms/AdminsView', () => ({ AdminsView: () => <h1>Administradores</h1> }));

beforeEach(() => vi.clearAllMocks());

describe('Admins page', () => {
  it('shows the administrators', async () => {
    getAdmins.mockResolvedValue({ status: 'ok', admins: { admins: [], promotable: [] } });

    render(await AdminsPage());

    expect(screen.getByRole('heading', { level: 1, name: 'Administradores' })).toBeInTheDocument();
  });

  it('explains it when the person cannot see them', async () => {
    getAdmins.mockResolvedValue({ status: 'forbidden' });

    render(await AdminsPage());

    expect(screen.getByRole('heading', { name: /No tienes acceso/ })).toBeInTheDocument();
  });
});
