import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { NotificationItem } from '@/features/notifications/notifications-view-model';
import { NotificationCard } from './NotificationCard';

const ITEM: NotificationItem = {
  id: 'n1',
  tone: 'warning',
  title: 'Cuadre pendiente',
  body: 'Luis envió su cuadre',
  date: '09/10/2026',
  read: false,
  href: '/cuadres/abc',
};

describe('NotificationCard', () => {
  it('shows the title, body, date and the unread badge', () => {
    render(<NotificationCard notification={ITEM} onMarkRead={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Cuadre pendiente' })).toBeInTheDocument();
    expect(screen.getByText('Luis envió su cuadre')).toBeInTheDocument();
    expect(screen.getByText('09/10/2026')).toBeInTheDocument();
    expect(screen.getByText('Sin leer')).toBeInTheDocument();
  });

  it('links to the related screen and marks as read through the callback', async () => {
    const onMarkRead = vi.fn();
    render(<NotificationCard notification={ITEM} onMarkRead={onMarkRead} />);
    expect(screen.getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/cuadres/abc');
    await userEvent.click(screen.getByRole('button', { name: 'Marcar como leída' }));
    expect(onMarkRead).toHaveBeenCalledWith('n1');
  });

  it('offers no actions for a read notification without a link', () => {
    render(<NotificationCard notification={{ ...ITEM, read: true, href: null }} onMarkRead={vi.fn()} />);
    expect(screen.queryByText('Sin leer')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('disables the action while another one is being marked', () => {
    render(<NotificationCard notification={ITEM} onMarkRead={vi.fn()} busy />);
    expect(screen.getByRole('button', { name: 'Marcar como leída' })).toBeDisabled();
  });

  it('uses the fill of its tone for the stripe', () => {
    const { container } = render(<NotificationCard notification={{ ...ITEM, tone: 'error' }} onMarkRead={vi.fn()} />);
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveClass('bg-destructive');
  });
});
