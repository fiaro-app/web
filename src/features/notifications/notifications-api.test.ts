import { beforeEach, describe, expect, it, vi } from 'vitest';
import { notificationEndpoints } from './endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { markAllNotificationsRead, markNotificationRead } from './notifications-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({});
});

describe('notifications api', () => {
  it('marks a notification as read by id', async () => {
    await markNotificationRead('n1');
    expect(callEndpoint).toHaveBeenCalledWith(notificationEndpoints.markRead, { params: { id: 'n1' } });
  });

  it('marks every notification as read with an empty body', async () => {
    await markAllNotificationsRead();
    expect(callEndpoint).toHaveBeenCalledWith(notificationEndpoints.markAllRead, { body: {} });
  });

  it('declares the list as a QUERY and the read action as a POST', () => {
    expect(notificationEndpoints.list).toMatchObject({ method: 'QUERY', path: '/notifications' });
    expect(notificationEndpoints.markRead).toMatchObject({ method: 'POST', path: '/notifications/:id/read' });
    expect(notificationEndpoints.markAllRead).toMatchObject({ method: 'POST', path: '/notifications/read-all' });
  });
});
