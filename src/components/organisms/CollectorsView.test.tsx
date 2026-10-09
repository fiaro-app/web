import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CollectorsViewModel } from '@/features/collectors/collectors-view-model';
import { CollectorsView } from './CollectorsView';

const ROW = { id: '1', fullName: 'Luis Gómez', phone: '+573109998877', portfolioName: 'Zona Norte', active: true };
const view = (overrides: Partial<CollectorsViewModel>): CollectorsViewModel => ({
  rows: [ROW],
  total: 1,
  page: 1,
  pageSize: 20,
  ...overrides,
});

describe('CollectorsView', () => {
  it('shows the title and a link to register a collector', () => {
    render(<CollectorsView collectors={view({})} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cobradores' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+ Nuevo cobrador' })).toHaveAttribute('href', '/cobradores/nuevo');
  });

  it('shows an empty state when there are no collectors', () => {
    render(<CollectorsView collectors={view({ rows: [], total: 0 })} />);
    expect(screen.getByText('Aún no tienes cobradores')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('offers only the next page on the first of several', () => {
    render(<CollectorsView collectors={view({ total: 45 })} />);
    expect(screen.getByText('Página 1 de 3 · 45 cobradores')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', '/cobradores?pagina=2');
    expect(screen.queryByRole('link', { name: 'Anterior' })).not.toBeInTheDocument();
  });

  it('offers both directions in the middle and only previous on the last page', () => {
    const { rerender } = render(<CollectorsView collectors={view({ total: 45, page: 2 })} />);
    expect(screen.getByRole('link', { name: 'Anterior' })).toHaveAttribute('href', '/cobradores?pagina=1');
    expect(screen.getByRole('link', { name: 'Siguiente' })).toBeInTheDocument();
    rerender(<CollectorsView collectors={view({ total: 45, page: 3 })} />);
    expect(screen.queryByRole('link', { name: 'Siguiente' })).not.toBeInTheDocument();
  });
});
