import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NotificationsViewModel } from '@/features/notifications/notifications-view-model';
import { NotificationsView } from './NotificationsView';

vi.mock('@/features/notifications/use-mark-notification-read', () => ({
  useMarkNotificationRead: () => ({ pendingId: null, error: null, markRead: vi.fn() }),
}));
vi.mock('@/features/notifications/use-delete-notifications', () => ({
  useDeleteNotifications: () => ({ pendingId: null, isClearing: false, error: null, remove: vi.fn(), clear: vi.fn() }),
}));

const ITEM = { id: 'n1', tone: 'info' as const, title: 'Hola', body: 'texto', date: '09/10/2026', read: false, href: null };
const view = (overrides: Partial<NotificationsViewModel> = {}): NotificationsViewModel => ({
  items: [ITEM],
  total: 1,
  page: 1,
  pageSize: 20,
  unreadOnly: false,
  ...overrides,
});

describe('NotificationsView', () => {
  it('shows the title and the all / unread filters', () => {
    render(<NotificationsView notifications={view()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Notificaciones' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Todas' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'No leídas' })).toHaveAttribute('href', '/notificaciones?filtro=no-leidas');
  });

  it('marks the unread filter when active', () => {
    render(<NotificationsView notifications={view({ unreadOnly: true })} />);
    expect(screen.getByRole('link', { name: 'No leídas' })).toHaveAttribute('aria-current', 'true');
  });

  it('shows the right empty state for each filter', () => {
    const { rerender } = render(<NotificationsView notifications={view({ items: [], total: 0 })} />);
    expect(screen.getByText('No tienes notificaciones')).toBeInTheDocument();
    rerender(<NotificationsView notifications={view({ items: [], total: 0, unreadOnly: true })} />);
    expect(screen.getByText('Estás al día')).toBeInTheDocument();
  });

  it('keeps the unread filter in the pagination links', () => {
    render(<NotificationsView notifications={view({ total: 45, unreadOnly: true })} />);
    expect(screen.getByText('Página 1 de 3 · 45 notificaciones')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', '/notificaciones?pagina=2&filtro=no-leidas');
  });
});
