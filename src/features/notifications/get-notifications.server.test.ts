import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getNotifications } from './get-notifications.server';

const RESPONSE = {
  data: [
    {
      id: 'n1',
      lenderId: 'l',
      severity: 'INFO',
      title: 'Hola',
      body: 'Texto',
      relatedEntityType: null,
      relatedEntityId: null,
      readAt: null,
      createdAt: '2026-10-09T15:00:00.000Z',
    },
  ],
  meta: { page: 2, pageSize: 10, total: 21 },
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
  callEndpointAsUser.mockResolvedValue(RESPONSE);
});

describe('getNotifications', () => {
  it('returns the items with the page info', async () => {
    const view = await getNotifications(2, false);
    expect(view).toMatchObject({ total: 21, page: 2, unreadOnly: false });
    expect(view.items[0]?.title).toBe('Hola');
  });

  it('sends unreadOnly only when asked', async () => {
    await getNotifications(1, true);
    expect(callEndpointAsUser).toHaveBeenLastCalledWith(expect.anything(), { body: { page: 1, pageSize: 10, unreadOnly: true } });
    await getNotifications(1, false);
    expect(callEndpointAsUser).toHaveBeenLastCalledWith(expect.anything(), { body: { page: 1, pageSize: 10 } });
  });

  it('propagates API failures to the error boundary', async () => {
    callEndpointAsUser.mockRejectedValue(new Error('boom'));
    await expect(getNotifications(1, false)).rejects.toThrow('boom');
  });
});
