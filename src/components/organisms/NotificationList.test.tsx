import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NotificationItem } from '@/features/notifications/notifications-view-model';
import { NotificationList } from './NotificationList';

const { useMarkNotificationRead } = vi.hoisted(() => ({ useMarkNotificationRead: vi.fn() }));
vi.mock('@/features/notifications/use-mark-notification-read', () => ({ useMarkNotificationRead }));
const { useDeleteNotifications } = vi.hoisted(() => ({ useDeleteNotifications: vi.fn() }));
vi.mock('@/features/notifications/use-delete-notifications', () => ({ useDeleteNotifications }));

const markRead = vi.fn();
const markAllRead = vi.fn();
const remove = vi.fn();
const clear = vi.fn();
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
  useDeleteNotifications.mockReturnValue({ pendingId: null, isClearing: false, error: null, remove, clear });
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
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
    useMarkNotificationRead.mockReturnValue({ pendingId: 'n1', error: 'No se pudo', isMarkingAll: false, markRead, markAllRead });
    render(<NotificationList items={[item('n1', 'Primera')]} />);
    expect(screen.getByText('No se pudo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marcar como leída' })).toBeDisabled();
  });

  it('marks every unread notification of the page with one button', async () => {
    const read = { ...item('n3', 'Leída'), read: true };
    render(<NotificationList items={[item('n1', 'Primera'), read, item('n2', 'Segunda')]} />);

    await userEvent.click(screen.getByRole('button', { name: 'Marcar todas como leídas' }));

    expect(markAllRead).toHaveBeenCalledTimes(1);
  });

  it('offers no bulk action when everything is already read', () => {
    render(<NotificationList items={[{ ...item('n1', 'Leída'), read: true }]} />);

    expect(screen.queryByRole('button', { name: 'Marcar todas como leídas' })).not.toBeInTheDocument();
  });

  it('deletes one notification through the hook', async () => {
    render(<NotificationList items={[item('n1', 'Primera'), item('n2', 'Segunda')]} />);

    await userEvent.click(screen.getByRole('button', { name: 'Borrar la notificación: Segunda' }));

    expect(remove).toHaveBeenCalledWith('n2');
  });

  it('asks for confirmation before deleting every notification', async () => {
    render(<NotificationList items={[item('n1', 'Primera')]} />);

    await userEvent.click(screen.getByRole('button', { name: 'Borrar todas' }));
    expect(clear).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Sí, borrar todas' }));

    expect(clear).toHaveBeenCalledWith(false);
  });

  it('deletes only the read ones, and only offers it when there are read ones', async () => {
    const read = { ...item('n3', 'Leída'), read: true };
    const { rerender } = render(<NotificationList items={[item('n1', 'Primera')]} />);
    expect(screen.queryByRole('button', { name: 'Borrar las leídas' })).not.toBeInTheDocument();

    rerender(<NotificationList items={[item('n1', 'Primera'), read]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Borrar las leídas' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, borrar las leídas' }));

    expect(clear).toHaveBeenCalledWith(true);
  });

  it('can cancel the confirmation, and shows the delete error', async () => {
    useDeleteNotifications.mockReturnValue({ pendingId: null, isClearing: false, error: 'No se pudo borrar', remove, clear });
    render(<NotificationList items={[item('n1', 'Primera')]} />);

    await userEvent.click(screen.getByRole('button', { name: 'Borrar todas' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(clear).not.toHaveBeenCalled();
    expect(screen.getByText('No se pudo borrar')).toBeInTheDocument();
  });

  it('tells that old notifications are deleted by themselves', () => {
    render(<NotificationList items={[item('n1', 'Primera')]} />);

    expect(screen.getByText(/más de 90 días se borran solas/)).toBeInTheDocument();
  });
});
