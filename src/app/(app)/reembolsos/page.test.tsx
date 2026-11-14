import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlatformPaymentsPage from './page';

const { getPlatformPayments } = vi.hoisted(() => ({ getPlatformPayments: vi.fn() }));
vi.mock('@/features/platform-payments/get-platform-payments.server', () => ({ getPlatformPayments }));
vi.mock('@/components/organisms/PlatformPayments', () => ({ PlatformPayments: ({ payments }: { payments: unknown[] }) => <p>pagos:{payments.length}</p> }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Platform payments page', () => {
  it('shows the payments', async () => {
    getPlatformPayments.mockResolvedValue({ status: 'ok', payments: [{}, {}] });

    render(await PlatformPaymentsPage());

    expect(screen.getByText('pagos:2')).toBeInTheDocument();
  });

  it('shows the access state to whoever does not operate the platform', async () => {
    getPlatformPayments.mockResolvedValue({ status: 'forbidden' });

    render(await PlatformPaymentsPage());

    expect(screen.getByText('No tienes acceso a esta sección')).toBeInTheDocument();
  });
});
