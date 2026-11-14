import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { membership } from '@/test/membership-fixture';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser, getAccess } = vi.hoisted(() => ({ callEndpointAsUser: vi.fn(), getAccess: vi.fn() }));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));

import { getAdmins } from './get-admins.server';

const apiError = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' } as never);

beforeEach(() => {
  vi.clearAllMocks();
  getAccess.mockResolvedValue({ canManage: true, canCollect: false, membershipId: 'me' });
});

describe('getAdmins', () => {
  it('asks for the active administrators and the active collectors', async () => {
    callEndpointAsUser.mockImplementation(async (_endpoint: unknown, { body }: { body: { role: string } }) => ({
      data: body.role === 'LENDER' ? [membership({ id: 'me', roles: ['LENDER'] })] : [membership({ id: 'col' })],
    }));

    const result = await getAdmins();

    expect(result.status === 'ok' && result.admins.admins[0]).toMatchObject({ id: 'me', isSelf: true });
    expect(result.status === 'ok' && result.admins.promotable[0]?.id).toBe('col');
    expect(callEndpointAsUser).toHaveBeenCalledWith(expect.objectContaining({ path: '/memberships' }), { body: expect.objectContaining({ role: 'LENDER', status: 'ACTIVE' }) });
  });

  it('reports a 403 as forbidden', async () => {
    callEndpointAsUser.mockRejectedValue(apiError(403, 'FORBIDDEN'));
    expect(await getAdmins()).toEqual({ status: 'forbidden' });
  });

  it('propagates any other failure', async () => {
    callEndpointAsUser.mockRejectedValue(apiError(500, 'INTERNAL_ERROR'));
    await expect(getAdmins()).rejects.toBeInstanceOf(ApiRequestError);
    callEndpointAsUser.mockRejectedValue(new Error('boom'));
    await expect(getAdmins()).rejects.toThrow('boom');
  });
});
