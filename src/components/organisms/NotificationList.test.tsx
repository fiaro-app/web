import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NotificationItem } from '@/features/notifications/notifications-view-model';
import { NotificationList } from './NotificationList';

const { useMarkNotificationRead } = vi.hoisted(() => ({ useMarkNotificationRead: vi.fn() }));
vi.mock('@/features/notifications/use-mark-notification-read', () => ({ useMarkNotificationRead }));

const markRead = vi.fn();
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
  useMarkNotificationRead.mockReturnValue({ pendingId: null, error: null, markRead });
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
});
