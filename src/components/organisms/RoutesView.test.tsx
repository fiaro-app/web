import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toRoutesViewModel, type RoutesViewModel } from '@/features/routes/routes-view-model';
import { ROUTES_PAGE } from '@/test/route-fixture';
import { RoutesView } from './RoutesView';

const COLLECTORS = [{ id: '0196f3a0-0000-7000-8000-0000000000aa', name: 'Ana Soto' }];
const EMPTY = { from: '', to: '', collectorId: '' };
const view = (overrides: Partial<RoutesViewModel> = {}): RoutesViewModel => ({ ...toRoutesViewModel(ROUTES_PAGE), ...overrides });

describe('RoutesView', () => {
  it('shows the title, the range, the filters and a row per collector and day', () => {
    render(<RoutesView routes={view()} filters={EMPTY} collectors={COLLECTORS} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Registro de rutas' })).toBeInTheDocument();
    expect(screen.getByText('Hoy · 14/10/2026')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Filtrar rutas' })).toBeInTheDocument();
    const row = screen.getByRole('row', { name: /Ana Soto/ });
    expect(within(row).getByText('$270.000 de $360.000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver las visitas de Ana Soto del 14/10/2026' })).toHaveAttribute(
      'href',
      '/cobros?desde=2026-10-14&hasta=2026-10-14&cobrador=0196f3a0-0000-7000-8000-0000000000aa',
    );
  });

  it('explains it when there are no routes, and offers to clear the filters when some are applied', () => {
    const { rerender } = render(<RoutesView routes={view({ rows: [], total: 0 })} filters={EMPTY} collectors={COLLECTORS} />);
    expect(screen.getByRole('heading', { name: 'Todavía no hay rutas hoy' })).toBeInTheDocument();

    rerender(<RoutesView routes={view({ rows: [], total: 0 })} filters={{ ...EMPTY, from: '2026-10-01', to: '2026-10-01' }} collectors={COLLECTORS} />);
    expect(screen.getByRole('heading', { name: 'Sin rutas con estos filtros' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Limpiar filtros' }).length).toBeGreaterThan(0);
  });

  it('paginates keeping the filters', () => {
    render(<RoutesView routes={view({ total: 25, page: 2, pageSize: 10 })} filters={{ ...EMPTY, collectorId: COLLECTORS[0]!.id }} collectors={COLLECTORS} />);

    expect(screen.getByText('Página 2 de 3 · 25 rutas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Siguiente/ })).toHaveAttribute('href', `/rutas?pagina=3&cobrador=${COLLECTORS[0]!.id}`);
  });
});
