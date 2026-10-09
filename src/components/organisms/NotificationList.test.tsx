import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NotificationItem } from '@/features/notifications/notifications-view-model';
import { NotificationList } from './NotificationList';

const { useMarkNotificationRead } = vi.hoisted(() => ({ useMarkNotificationRead: vi.fn() }));
vi.mock('@/features/notifications/use-mark-notification-read', () => ({ useMarkNotificationRead }));

const markRead = vi.fn();
const markAllRead = vi.fn();
const item = (id: string, title: string): NotificationItem => ({
  id,
  tone: 'info',
  title,
  body: 'texto',
  date: '09/10/2026',
  read: false,
  href: null,
});

beforeEach(() => {
  vi.clearAllMocks();
  useMarkNotificationRead.mockReturnValue({ pendingId: null, error: null, isMarkingAll: false, markRead, markAllRead });
});

describe('NotificationList', () => {
  it('renders one card per notification inside a labelled list', () => {
    render(<NotificationList items={[item('n1', 'Primera'), item('n2', 'Segunda')]} />);
    expect(screen.getByRole('list', { name: 'Lista de notificaciones' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('marks the chosen notification as read through the hook', async () => {
    render(<NotificationList items={[item('n1', 'Primera'), item('n2', 'Segunda')]} />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Marcar como leída' })[1]!);
    expect(markRead).toHaveBeenCalledWith('n2');
  });

  it('shows the error and locks the actions while one is pending', () => {
    useMarkNotificationRead.mockReturnValue({ pendingId: 'n1', error: 'No se pudo', markRead });
    render(<NotificationList items={[item('n1', 'Primera')]} />);
    expect(screen.getByText('No se pudo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marcar como leída' })).toBeDisabled();
  });

  it('marks every unread notification of the page with one button', async () => {
    const read = { ...item('n3', 'Leída'), read: true };
    render(<NotificationList items={[item('n1', 'Primera'), read, item('n2', 'Segunda')]} />);

    await userEvent.click(screen.getByRole('button', { name: 'Marcar todas como leídas' }));

    expect(markAllRead).toHaveBeenCalledWith(['n1', 'n2']);
  });

  it('offers no bulk action when everything is already read', () => {
    render(<NotificationList items={[{ ...item('n1', 'Leída'), read: true }]} />);

    expect(screen.queryByRole('button', { name: 'Marcar todas como leídas' })).not.toBeInTheDocument();
  });
});
