import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));

import { getAccountSessions } from './get-sessions.server';

const SESSION = {
  id: '0190f7a0-0000-7000-8000-000000000001',
  isCurrent: true,
  device: { client: 'Chrome', os: 'Windows', label: 'Chrome en Windows' },
  ipAddress: null,
  createdAt: '2026-10-01T10:00:00.000Z',
  lastUsedAt: '2026-10-05T15:00:00.000Z',
  expiresAt: '2026-11-04T15:00:00.000Z',
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe('getAccountSessions', () => {
  it('returns the rows of the open sessions', async () => {
    callEndpointAsUser.mockResolvedValue([SESSION]);

    await expect(getAccountSessions()).resolves.toMatchObject([{ id: SESSION.id, device: 'Chrome en Windows', isCurrent: true }]);
    expect(callEndpointAsUser.mock.calls[0]?.[0]).toMatchObject({ method: 'GET', path: '/account/sessions' });
  });

  it('shows the page without the list when the API fails', async () => {
    callEndpointAsUser.mockRejectedValue(new ApiRequestError({ statusCode: 503, code: 'MAINTENANCE', message: 'x' }));

    await expect(getAccountSessions()).resolves.toEqual([]);
  });

  it('does not hide an unexpected failure', async () => {
    const bug = new TypeError('bug');
    callEndpointAsUser.mockRejectedValue(bug);

    await expect(getAccountSessions()).rejects.toBe(bug);
  });
});
