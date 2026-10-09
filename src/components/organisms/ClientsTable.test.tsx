import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClientsTable } from './ClientsTable';

const ROWS = [
  { id: 'c1', fullName: 'Carlos Gómez', nationalId: '1020304050', phone: '+573001234567', occupation: 'Vendedor' },
  { id: 'c2', fullName: 'Ana Ruiz', nationalId: '52111222', phone: '+576012345678', occupation: 'Tendera' },
];

describe('ClientsTable', () => {
  it('renders a row per client with the name as row header', () => {
    render(<ClientsTable rows={ROWS} />);
    const row = screen.getByRole('row', { name: /Carlos Gómez/ });
    expect(within(row).getByRole('rowheader', { name: 'Carlos Gómez' })).toBeInTheDocument();
    expect(within(row).getByText('1020304050')).toBeInTheDocument();
    expect(within(row).getByText('Vendedor')).toBeInTheDocument();
  });

  it('links each row to its edit page', () => {
    render(<ClientsTable rows={ROWS} />);
    expect(screen.getByRole('link', { name: 'Editar Ana Ruiz' })).toHaveAttribute('href', '/clientes/c2');
  });

  it('has a caption and labelled columns', () => {
    render(<ClientsTable rows={ROWS} />);
    expect(screen.getByRole('table', { name: 'Clientes del negocio' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
  });
});
