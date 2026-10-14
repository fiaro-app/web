import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SettingsPage from './page';

vi.mock('@/features/lender/get-settings.server', () => ({ getSettings: vi.fn().mockResolvedValue({ status: 'forbidden' }) }));

describe('Settings page', () => {
  it('explains it with a large empty state when the person cannot configure the business', async () => {
    render(await SettingsPage());

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
