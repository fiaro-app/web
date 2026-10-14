import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getUnreadCount } from './get-unread-count.server';

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getUnreadCount', () => {
  it('reads the count from the dedicated endpoint', async () => {
    callEndpointAsUser.mockResolvedValue({ count: 7 });

    await expect(getUnreadCount()).resolves.toBe(7);
    expect(callEndpointAsUser.mock.calls[0]?.[0]).toMatchObject({ method: 'GET', path: '/notifications/unread-count' });
  });

  it('shows no badge when the API fails', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' }));

    await expect(getUnreadCount()).resolves.toBe(0);
  });

  it('does not hide an unexpected failure', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockRejectedValue(bug);

    await expect(getUnreadCount()).rejects.toBe(bug);
  });
});
