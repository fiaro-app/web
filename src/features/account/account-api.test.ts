import { beforeEach, describe, expect, it, vi } from 'vitest';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', () => ({ callEndpoint }));

import { accountEndpoints } from './endpoints';
import { deactivateAccount, requestContactEmailVerification, revokeAllSessions, revokeOtherSessions, updateProfile, verifyContactEmail } from './account-api';

beforeEach(() => {
  callEndpoint.mockReset();
  callEndpoint.mockResolvedValue({});
});

describe('account api', () => {
  it('calls each endpoint with its body', async () => {
    await updateProfile({ fullName: 'Ana' });
    await requestContactEmailVerification();
    await verifyContactEmail('123456');
    await deactivateAccount('clave');
    await revokeOtherSessions();
    await revokeAllSessions();

    expect(callEndpoint.mock.calls.map((call) => [call[0], call[1]])).toEqual([
      [accountEndpoints.updateProfile, { body: { fullName: 'Ana' } }],
      [accountEndpoints.requestContactEmailVerification, {}],
      [accountEndpoints.verifyContactEmail, { body: { code: '123456' } }],
      [accountEndpoints.deactivate, { body: { password: 'clave' } }],
      [accountEndpoints.revokeOtherSessions, {}],
      [accountEndpoints.revokeSessions, {}],
    ]);
  });

  it('declares an update body that needs at least one field', () => {
    expect(accountEndpoints.updateProfile.body?.safeParse({}).success).toBe(false);
    expect(accountEndpoints.updateProfile.body?.safeParse({ contactEmail: null }).success).toBe(true);
  });
});
