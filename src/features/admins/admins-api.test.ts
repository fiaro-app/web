import { beforeEach, describe, expect, it, vi } from 'vitest';
import { membershipEndpoints } from '@/features/memberships/endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { demoteAdmin, inviteAdmin, promoteToAdmin, removeAdminAccess } from './admins-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({});
});

describe('admins api', () => {
  it('invites someone who only administers', async () => {
    await inviteAdmin({ fullName: 'Lucía Pardo', nationalId: '1030405060', phone: '+573109998877', contactEmail: 'lucia@correo.com' });
    expect(callEndpoint).toHaveBeenCalledWith(membershipEndpoints.invite, {
      body: { phone: '+573109998877', fullName: 'Lucía Pardo', nationalId: '1030405060', contactEmail: 'lucia@correo.com', roles: ['LENDER'] },
    });
  });

  it('adds the admin role keeping the ones the person already had, once', async () => {
    await promoteToAdmin('m1', ['COLLECTOR']);
    await promoteToAdmin('m1', ['COLLECTOR', 'LENDER']);
    expect(callEndpoint).toHaveBeenNthCalledWith(1, membershipEndpoints.changeRoles, { params: { id: 'm1' }, body: { roles: ['COLLECTOR', 'LENDER'] } });
    expect(callEndpoint).toHaveBeenNthCalledWith(2, membershipEndpoints.changeRoles, { params: { id: 'm1' }, body: { roles: ['COLLECTOR', 'LENDER'] } });
  });

  it('removes only the admin role', async () => {
    await demoteAdmin('m1', ['COLLECTOR', 'LENDER']);
    expect(callEndpoint).toHaveBeenCalledWith(membershipEndpoints.changeRoles, { params: { id: 'm1' }, body: { roles: ['COLLECTOR'] } });
  });

  it('removes the access', async () => {
    await removeAdminAccess('m1');
    expect(callEndpoint).toHaveBeenCalledWith(membershipEndpoints.deactivate, { params: { id: 'm1' } });
  });
});
