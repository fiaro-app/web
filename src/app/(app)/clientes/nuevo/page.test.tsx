import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewClientPage from './page';

const { getAccess } = vi.hoisted(() => ({ getAccess: vi.fn() }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
vi.mock('@/components/organisms/ClientForm', () => ({ ClientForm: () => <form aria-label="Registrar cliente" /> }));

beforeEach(() => getAccess.mockResolvedValue({ canManage: true, canCollect: false, membershipId: null }));

describe('New client page', () => {
  it('shows the form next to the informative aside', async () => {
    render(await NewClientPage());

    expect(screen.getByRole('form', { name: 'Registrar cliente' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { hidden: true })).toBeInTheDocument();
  });

  it('does not offer the form to someone who cannot manage clients', async () => {
    getAccess.mockResolvedValue({ canManage: false, canCollect: true, membershipId: null });
    render(await NewClientPage());

    expect(screen.queryByRole('form', { name: 'Registrar cliente' })).not.toBeInTheDocument();
    expect(screen.getByText('No tienes acceso a esta sección')).toBeInTheDocument();
  });
});
