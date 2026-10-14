import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClientsTable } from './ClientsTable';

const ROWS = [
  {
    id: 'c1',
    fullName: 'Carlos Gómez',
    nationalId: '1020304050',
    phone: '+573001234567',
    occupation: 'Vendedor',
    activeLoans: '1',
    balance: '$380.000',
    overdue: 'Al día',
    overdueAmount: null,
    isOverdue: false,
  },
  {
    id: 'c2',
    fullName: 'Ana Ruiz',
    nationalId: '52111222',
    phone: '+576012345678',
    occupation: 'Tendera',
    activeLoans: '2',
    balance: '$90.000',
    overdue: '3 días',
    overdueAmount: '$30.000',
    isOverdue: true,
  },
];

describe('ClientsTable', () => {
  it('renders a row per client with the name as row header', () => {
    render(<ClientsTable rows={ROWS} />);
    const row = screen.getByRole('row', { name: /Carlos Gómez/ });
    expect(within(row).getByRole('rowheader', { name: /Carlos Gómez/ })).toBeInTheDocument();
    expect(within(row).getByText('1020304050')).toBeInTheDocument();
    expect(within(row).getByText('Vendedor')).toBeInTheDocument();
  });

  it('shows the balance and highlights the arrears with their amount', () => {
    render(<ClientsTable rows={ROWS} />);
    const row = screen.getByRole('row', { name: /Ana Ruiz/ });
    expect(within(row).getByText('$90.000')).toHaveAttribute('data-label', 'Saldo');
    expect(within(row).getByText('3 días')).toHaveClass('text-destructive');
    expect(within(row).getByText('$30.000')).toBeInTheDocument();
    expect(within(screen.getByRole('row', { name: /Carlos Gómez/ })).getByText('Al día')).not.toHaveClass('text-destructive');
  });

  it('links each row to its edit page', () => {
    render(<ClientsTable rows={ROWS} />);
    expect(screen.getByRole('link', { name: 'Editar Ana Ruiz' })).toHaveAttribute('href', '/clientes/c2');
  });

  it('has a caption and labelled columns', () => {
    render(<ClientsTable rows={ROWS} />);
    expect(screen.getByRole('table', { name: 'Clientes del negocio' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
  });
});
