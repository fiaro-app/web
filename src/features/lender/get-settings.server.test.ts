import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';

vi.mock('server-only', () => ({}));
const { callEndpointAsUser, getShellContext, requireUser } = vi.hoisted(() => ({
  callEndpointAsUser: vi.fn(),
  getShellContext: vi.fn(),
  requireUser: vi.fn(),
}));
vi.mock('@/lib/api/server-call', () => ({ callEndpointAsUser }));
vi.mock('@/features/app-shell/get-shell-context.server', () => ({ getShellContext }));
vi.mock('@/features/auth/session.server', () => ({ requireUser }));

import { getSettings } from './get-settings.server';

const LENDER = {
  id: 'l1',
  tenantId: 't1',
  name: 'Buen Vecino',
  logoUrl: null,
  nonWorkingWeekdays: ['SUNDAY'],
  skipNationalHolidays: true,
  createdAt: '2026-10-01T10:00:00.000Z',
};
const PORTFOLIOS = [{ id: 'p1', name: 'General', isDefault: true, createdAt: '2026-10-01T10:00:00.000Z' }];

beforeEach(() => {
  vi.resetAllMocks();
  requireUser.mockResolvedValue({ id: 'u1' });
  getShellContext.mockResolvedValue({ businessName: 'Buen Vecino', roleLabel: 'Administrador' });
  callEndpointAsUser.mockImplementation(async (endpoint: { path: string }) => (endpoint.path === '/lender' ? LENDER : PORTFOLIOS));
});

describe('getSettings', () => {
  it('returns the business data, the portfolios and that an administrator can edit', async () => {
    const result = await getSettings();
    expect(result).toEqual({
      status: 'ok',
      settings: {
        name: 'Buen Vecino',
        logoUrl: null,
        nonWorkingWeekdays: ['SUNDAY'],
        skipNationalHolidays: true,
        portfolios: [{ id: 'p1', name: 'General', isDefault: true }],
        canEdit: true,
        logoUploadAvailable: false,
      },
    });
  });

  it('does not allow a collector to edit', async () => {
    getShellContext.mockResolvedValue({ businessName: 'Buen Vecino', roleLabel: 'Cobrador' });
    const result = await getSettings();
    expect(result.status === 'ok' && result.settings.canEdit).toBe(false);
  });

  it('reports forbidden on 403 and propagates other failures', async () => {
    callEndpointAsUser.mockRejectedValueOnce(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    expect(await getSettings()).toEqual({ status: 'forbidden' });
    callEndpointAsUser.mockRejectedValueOnce(new Error('boom'));
    await expect(getSettings()).rejects.toThrow('boom');
  });
});
