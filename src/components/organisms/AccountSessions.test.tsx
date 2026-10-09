import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SessionRow } from '@/features/account/sessions-view-model';
import { AccountSessions } from './AccountSessions';

const closeOne = vi.fn();
vi.mock('@/features/account/use-session-actions', () => ({
  useSessionActions: () => ({ isBusy: false, error: null, notice: null, closeOne, closeOthers: vi.fn(), closeAll: vi.fn() }),
}));

const SESSIONS: SessionRow[] = [
  { id: 's1', device: 'Chrome en Windows', isCurrent: true, detail: 'IP 190.1.2.3 · Último uso 09/10/2026' },
  { id: 's2', device: 'App móvil en Android', isCurrent: false, detail: 'Último uso 05/10/2026' },
];

beforeEach(() => vi.clearAllMocks());

describe('AccountSessions', () => {
  it('lists the devices, marks the current one and lets close only the others', async () => {
    render(<AccountSessions sessions={SESSIONS} />);

    const items = within(screen.getByRole('list', { name: 'Sesiones abiertas' })).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByText('Esta sesión')).toBeInTheDocument();
    expect(within(items[0]!).queryByRole('button')).not.toBeInTheDocument();

    await userEvent.click(within(items[1]!).getByRole('button', { name: 'Cerrar la sesión de App móvil en Android' }));
    expect(closeOne).toHaveBeenCalledWith('s2');
  });

  it('keeps the close buttons when the list could not be loaded', () => {
    render(<AccountSessions />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar las demás sesiones' })).toBeInTheDocument();
  });
});
