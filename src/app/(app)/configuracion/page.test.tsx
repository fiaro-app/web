import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsPage from './page';

const { getAccess } = vi.hoisted(() => ({ getAccess: vi.fn() }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
const { getSettings } = vi.hoisted(() => ({ getSettings: vi.fn() }));
vi.mock('@/features/lender/get-settings.server', () => ({ getSettings }));

beforeEach(() => {
  vi.clearAllMocks();
  getAccess.mockResolvedValue({ canManage: true, canCollect: true, membershipId: 'm1' });
  getSettings.mockResolvedValue({ status: 'forbidden' });
});

describe('Settings page', () => {
  it('explains it with a large empty state when the person cannot configure the business', async () => {
    render(await SettingsPage());

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('a collector sees no business settings and is pointed to their account', async () => {
    getAccess.mockResolvedValue({ canManage: false, canCollect: true, membershipId: 'm1' });

    render(await SettingsPage());

    expect(screen.getByText(/están en «Cuenta»/)).toBeInTheDocument();
    expect(getSettings).not.toHaveBeenCalled();
  });
});
