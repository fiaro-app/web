import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AdminRow, AdminsViewModel } from '@/features/admins/admins-view-model';
import { AdminsView } from './AdminsView';

const { useAdminActions } = vi.hoisted(() => ({ useAdminActions: vi.fn() }));
vi.mock('@/features/admins/use-admin-actions', () => ({ useAdminActions }));

const demote = vi.fn();
const remove = vi.fn();
const promote = vi.fn();
const state = (overrides = {}) => ({ selected: '', select: vi.fn(), pending: false, error: null, notice: null, promote, demote, remove, ...overrides });

const row = (overrides: Partial<AdminRow> = {}): AdminRow => ({
  id: 'a1',
  fullName: 'Pedro Gil',
  phone: '+573001112233',
  roleLabel: 'Administrador y cobrador',
  roles: ['LENDER', 'COLLECTOR'],
  isSelf: false,
  canDemote: true,
  canRemove: false,
  ...overrides,
});
const view = (overrides: Partial<AdminsViewModel> = {}): AdminsViewModel => ({
  admins: [row()],
  promotable: [{ id: 'c1', label: 'Luis Gómez · +573109998877', roles: ['COLLECTOR'] }],
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
  useAdminActions.mockReturnValue(state());
});

describe('AdminsView', () => {
  it('lists the administrators with their role and a link to invite one', () => {
    render(<AdminsView admins={view({ admins: [row({ isSelf: true, canDemote: false })] })} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Administradores' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: /Pedro Gil/ })).toHaveTextContent('(Tú)');
    expect(screen.getByText('Administrador y cobrador')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Invitar a un administrador nuevo' })).toHaveAttribute('href', '/administradores/nuevo');
    expect(screen.queryByRole('button', { name: /Quitar/ })).not.toBeInTheDocument();
  });

  it('asks for confirmation before removing the admin role', async () => {
    render(<AdminsView admins={view()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Quitar rol de administrador: Pedro Gil' }));
    expect(demote).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Sí, quitar el rol' }));

    expect(demote).toHaveBeenCalledWith(expect.objectContaining({ id: 'a1' }));
  });

  it('asks for confirmation before removing the access of someone who only administers', async () => {
    render(<AdminsView admins={view({ admins: [row({ canDemote: false, canRemove: true })] })} />);

    await userEvent.click(screen.getByRole('button', { name: 'Quitar acceso: Pedro Gil' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, quitar el acceso' }));

    expect(remove).toHaveBeenCalledWith(expect.objectContaining({ id: 'a1' }));
  });

  it('can cancel the confirmation', async () => {
    render(<AdminsView admins={view()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Quitar rol de administrador: Pedro Gil' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(demote).not.toHaveBeenCalled();
  });

  it('promotes the chosen collaborator', async () => {
    render(<AdminsView admins={view()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Hacer administrador' }));

    expect(promote).toHaveBeenCalledTimes(1);
  });

  it('says so when there is nobody to promote', () => {
    render(<AdminsView admins={view({ promotable: [] })} />);

    expect(screen.getByText('Todos tus colaboradores activos ya son administradores.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Hacer administrador' })).not.toBeInTheDocument();
  });

  it('shows errors and notices, and locks the actions while one is in flight', () => {
    useAdminActions.mockReturnValue(state({ error: 'Falló', notice: 'Listo', pending: true }));
    render(<AdminsView admins={view()} />);

    expect(screen.getByText('Falló')).toBeInTheDocument();
    expect(screen.getByText('Listo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar rol de administrador: Pedro Gil' })).toBeDisabled();
  });
});
