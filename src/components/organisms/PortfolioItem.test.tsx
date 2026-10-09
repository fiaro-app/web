import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PortfolioItem } from './PortfolioItem';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
const { renamePortfolio, deletePortfolio } = vi.hoisted(() => ({ renamePortfolio: vi.fn(), deletePortfolio: vi.fn() }));
vi.mock('@/features/lender/lender-api', () => ({ renamePortfolio, deletePortfolio }));

const NORTH = { id: 'p2', name: 'Zona Norte', isDefault: false };
const DEFAULT = { id: 'p1', name: 'General', isDefault: true };

beforeEach(() => {
  vi.clearAllMocks();
  // jsdom no implementa `showModal`/`close`: se simulan con el atributo `open`.
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
  renamePortfolio.mockResolvedValue({});
  deletePortfolio.mockResolvedValue(undefined);
});

describe('PortfolioItem', () => {
  it('lets an administrator rename and delete a regular portfolio', () => {
    render(
      <ul>
        <PortfolioItem portfolio={NORTH} canEdit />
      </ul>,
    );

    expect(screen.getByRole('button', { name: 'Renombrar la cartera Zona Norte' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Borrar la cartera Zona Norte' })).toBeInTheDocument();
  });

  it('does not offer to delete the default portfolio, which can still be renamed', () => {
    render(
      <ul>
        <PortfolioItem portfolio={DEFAULT} canEdit />
      </ul>,
    );

    expect(screen.getByText('Por defecto')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Renombrar la cartera General' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Borrar/ })).not.toBeInTheDocument();
  });

  it('only shows the name without permission', () => {
    render(
      <ul>
        <PortfolioItem portfolio={NORTH} canEdit={false} />
      </ul>,
    );

    expect(screen.getByText('Zona Norte')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renames in place', async () => {
    render(
      <ul>
        <PortfolioItem portfolio={NORTH} canEdit />
      </ul>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Renombrar la cartera Zona Norte' }));
    const input = screen.getByLabelText('Nuevo nombre');
    await userEvent.clear(input);
    await userEvent.type(input, 'Zona Sur');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(renamePortfolio).toHaveBeenCalledWith('p2', 'Zona Sur');
  });

  it('asks to confirm before deleting', async () => {
    render(
      <ul>
        <PortfolioItem portfolio={NORTH} canEdit />
      </ul>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Borrar la cartera Zona Norte' }));
    expect(await screen.findByText('¿Borrar la cartera?')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Borrar' }));

    expect(deletePortfolio).toHaveBeenCalledWith('p2');
  });
});
