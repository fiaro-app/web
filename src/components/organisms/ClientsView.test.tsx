import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ClientsViewModel } from '@/features/clients/clients-view-model';
import { ClientsView } from './ClientsView';

const ROW = { id: 'c1', fullName: 'Carlos Gómez', nationalId: '1020304050', phone: '+573001234567', occupation: 'Vendedor' };
const view = (overrides: Partial<ClientsViewModel> = {}): ClientsViewModel => ({
  rows: [ROW],
  total: 1,
  page: 1,
  pageSize: 20,
  search: '',
  ...overrides,
});

describe('ClientsView', () => {
  it('shows the title, the register link and a GET search form', () => {
    render(<ClientsView clients={view()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+ Nuevo cliente' })).toHaveAttribute('href', '/clientes/nuevo');
    expect(screen.getByRole('search')).toHaveAttribute('action', '/clientes');
    expect(screen.getByRole('searchbox')).toHaveAttribute('name', 'q');
  });

  it('shows the empty state without a search', () => {
    render(<ClientsView clients={view({ rows: [], total: 0 })} />);
    expect(screen.getByText('Aún no tienes clientes')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument();
  });

  it('explains a search without results and offers to clear it', () => {
    render(<ClientsView clients={view({ rows: [], total: 0, search: 'Zuluaga' })} />);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    expect(screen.getByText(/«Zuluaga»/)).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('Zuluaga');
    expect(screen.getAllByRole('link', { name: 'Limpiar búsqueda' })[0]).toHaveAttribute('href', '/clientes');
  });

  it('keeps the search in the pagination links', () => {
    render(<ClientsView clients={view({ total: 45, search: 'Gómez' })} />);
    expect(screen.getByText('Página 1 de 3 · 45 clientes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', '/clientes?pagina=2&q=G%C3%B3mez');
  });
});
