import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImportPage from './page';

const { getAccess } = vi.hoisted(() => ({ getAccess: vi.fn() }));
vi.mock('@/features/app-shell/get-access.server', () => ({ getAccess }));
const { getSubscription } = vi.hoisted(() => ({ getSubscription: vi.fn() }));
vi.mock('@/features/subscription/get-subscription.server', () => ({ getSubscription }));
vi.mock('@/components/organisms/ImportView', () => ({ ImportView: () => <p>importar</p> }));

beforeEach(() => {
  vi.clearAllMocks();
  getAccess.mockResolvedValue({ canManage: true });
  getSubscription.mockResolvedValue({ excelImport: true });
});

describe('Import page', () => {
  it('shows the import screen when the plan has it', async () => {
    render(await ImportPage());

    expect(screen.getByRole('heading', { level: 1, name: 'Importar desde Excel' })).toBeInTheDocument();
    expect(screen.getByText('importar')).toBeInTheDocument();
  });

  it('still shows it when the plan could not be read (the API is who denies)', async () => {
    getSubscription.mockResolvedValue(null);

    render(await ImportPage());

    expect(screen.getByText('importar')).toBeInTheDocument();
  });

  it('offers the Pro plan with Individual', async () => {
    getSubscription.mockResolvedValue({ excelImport: false });

    render(await ImportPage());

    expect(screen.getByText('Importar desde Excel está en el plan Pro')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver planes' })).toHaveAttribute('href', '/plan');
    expect(screen.queryByText('importar')).not.toBeInTheDocument();
  });

  it('a person who does not manage the business sees no import', async () => {
    getAccess.mockResolvedValue({ canManage: false });

    render(await ImportPage());

    expect(screen.getByText('No tienes acceso a esta sección')).toBeInTheDocument();
    expect(getSubscription).not.toHaveBeenCalled();
  });
});
