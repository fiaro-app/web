import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectorManage } from './CollectorManage';

const { useCollectorActions } = vi.hoisted(() => ({ useCollectorActions: vi.fn() }));
vi.mock('@/features/collectors/use-collector-actions', () => ({ useCollectorActions }));

const COLLECTOR = {
  id: 'm1',
  fullName: 'Luis Gómez',
  phone: '+573109998877',
  roles: ['COLLECTOR' as const],
  portfolioId: 'p1',
  active: true,
};
const PORTFOLIOS = [{ id: 'p1', name: 'Zona Norte' }];

const actions = {
  pending: null,
  error: null,
  notice: null,
  tempPassword: null,
  portfolioId: 'p1',
  setPortfolioId: vi.fn(),
  savePortfolio: vi.fn(),
  resetPassword: vi.fn(),
  deactivate: vi.fn(),
  reactivate: vi.fn(),
  remove: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
  useCollectorActions.mockReturnValue(actions);
});

describe('CollectorManage', () => {
  it('shows the collector data and the available actions', () => {
    render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Luis Gómez' })).toBeInTheDocument();
    expect(screen.getByText('+573109998877')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar cartera' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restablecer contraseña' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desactivar cobrador' })).toBeInTheDocument();
  });

  it('saves the portfolio through the hook', async () => {
    render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cartera' }));
    expect(actions.savePortfolio).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(actions.savePortfolio).toHaveBeenCalledTimes(1);
  });

  it('asks for confirmation before deactivating', async () => {
    render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar cobrador' }));
    expect(actions.deactivate).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    expect(actions.deactivate).toHaveBeenCalledTimes(1);
  });

  it('asks to whom the active loans go and hands them to the chosen collector', async () => {
    const handover = { loans: [{ id: 'l1', clientName: 'Carlos' }], destinations: [{ id: 'm2', name: 'Ana Pérez' }, { id: 'm3', name: 'Mario Ruiz' }] };
    render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} handover={handover} />);

    await userEvent.click(screen.getByRole('button', { name: 'Desactivar cobrador' }));
    expect(screen.getByText(/Tiene 1 préstamo activo/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox', { name: 'Pasar sus préstamos a' }));
    await userEvent.click(screen.getByRole('option', { name: 'Mario Ruiz' }));
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar' }));

    expect(actions.deactivate).toHaveBeenCalledWith('m3');
  });

  it('does not let it deactivate when there is nobody to receive the loans or the loans could not be checked', async () => {
    const noOne = { loans: [{ id: 'l1', clientName: 'Carlos' }], destinations: [] };
    const { unmount } = render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} handover={noOne} />);
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar cobrador' }));
    expect(screen.getByText(/No hay otro cobrador activo/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desactivar' })).toBeDisabled();
    unmount();

    render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} handover={null} />);
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar cobrador' }));
    expect(screen.getByText(/No pudimos revisar los préstamos/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desactivar' })).toBeDisabled();
  });

  it('asks for confirmation before resetting the password', async () => {
    render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Restablecer contraseña' }));
    await userEvent.click(screen.getByRole('button', { name: 'Restablecer' }));
    expect(actions.resetPassword).toHaveBeenCalledTimes(1);
  });

  it('shows the new temporary password, errors and notices', () => {
    useCollectorActions.mockReturnValue({ ...actions, tempPassword: 'nuevo-pw', error: 'Algo falló', notice: 'Listo' });
    render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} />);
    expect(screen.getByText('nuevo-pw')).toBeInTheDocument();
    expect(screen.getByText('Algo falló')).toBeInTheDocument();
    expect(screen.getByText('Listo')).toBeInTheDocument();
  });

  it('offers to reactivate an inactive collector, after confirming', async () => {
    render(<CollectorManage collector={{ ...COLLECTOR, active: false }} portfolios={PORTFOLIOS} />);
    expect(screen.getByText(/está desactivado/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Desactivar cobrador' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reactivar cobrador' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reactivar' }));
    expect(actions.reactivate).toHaveBeenCalledTimes(1);
  });

  it('asks for confirmation before deleting, and never offers it for the owner', async () => {
    const { unmount } = render(<CollectorManage collector={COLLECTOR} portfolios={PORTFOLIOS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Borrar cobrador' }));
    await userEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    expect(actions.remove).toHaveBeenCalledTimes(1);
    unmount();
    render(<CollectorManage collector={{ ...COLLECTOR, roles: ['OWNER', 'LENDER', 'COLLECTOR'] as never }} portfolios={PORTFOLIOS} />);
    expect(screen.queryByRole('button', { name: 'Borrar cobrador' })).not.toBeInTheDocument();
  });
});
