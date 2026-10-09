import { describe, expect, it } from 'vitest';
import type { NotificationResponse } from './endpoints';
import { toNotificationsViewModel } from './notifications-view-model';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';
const NOTIFICATION: NotificationResponse = {
  id: 'n1',
  lenderId: '0192f0a4-7c3e-7000-8000-000000000009',
  severity: 'WARNING',
  title: 'Cuadre pendiente',
  body: 'Luis envió su cuadre',
  relatedEntityType: 'DAILY_SETTLEMENT',
  relatedEntityId: ID,
  readAt: null,
  createdAt: '2026-10-10T02:00:00.000Z',
};
const PAGE = { total: 1, page: 1, pageSize: 20 };

describe('toNotificationsViewModel', () => {
  it('formats an item with its tone, Colombian date, read state and link', () => {
    const view = toNotificationsViewModel([NOTIFICATION], PAGE, false);
    expect(view.items[0]).toEqual({
      id: 'n1',
      tone: 'warning',
      title: 'Cuadre pendiente',
      body: 'Luis envió su cuadre',
      // 02:00 UTC del 10 es todavía el 9 en Colombia.
      date: '09/10/2026',
      read: false,
      href: `/cuadres/${ID}`,
    });
    expect(view).toMatchObject({ ...PAGE, unreadOnly: false });
  });

  it('maps every severity to a tone', () => {
    const view = toNotificationsViewModel(
      (['ALERT', 'WARNING', 'SUCCESS', 'INFO'] as const).map((severity) => ({ ...NOTIFICATION, severity })),
      PAGE,
      true,
    );
    expect(view.items.map((item) => item.tone)).toEqual(['error', 'warning', 'success', 'info']);
    expect(view.unreadOnly).toBe(true);
  });

  it('marks a read notification and drops the link when it has no entity', () => {
    const view = toNotificationsViewModel(
      [{ ...NOTIFICATION, readAt: '2026-10-10T03:00:00.000Z', relatedEntityType: null, relatedEntityId: null }],
      PAGE,
      false,
    );
    expect(view.items[0]).toMatchObject({ read: true, href: null });
  });
});
