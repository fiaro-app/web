import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RoutesPage from './page';

const { getRoutes } = vi.hoisted(() => ({ getRoutes: vi.fn() }));
vi.mock('@/features/routes/get-routes.server', () => ({ getRoutes }));
vi.mock('@/components/organisms/RoutesView', () => ({ RoutesView: () => <h1>Registro de rutas</h1> }));

const props = (params: Record<string, string> = {}) => ({ searchParams: Promise.resolve(params) }) as Parameters<typeof RoutesPage>[0];

beforeEach(() => vi.clearAllMocks());

describe('Routes page', () => {
  it('reads the page and the filters from the URL', async () => {
    getRoutes.mockResolvedValue({ status: 'ok', routes: {}, collectors: [] });

    render(await RoutesPage(props({ pagina: '2', desde: '2026-10-10', hasta: '2026-10-12' })));

    expect(getRoutes).toHaveBeenCalledWith(expect.objectContaining({ from: '2026-10-10', to: '2026-10-12' }), 2);
    expect(screen.getByRole('heading', { name: 'Registro de rutas' })).toBeInTheDocument();
  });

  it('explains it when the person cannot see the routes', async () => {
    getRoutes.mockResolvedValue({ status: 'forbidden' });

    render(await RoutesPage(props()));

    expect(screen.getByRole('heading', { name: /No tienes acceso/ })).toBeInTheDocument();
  });
});
