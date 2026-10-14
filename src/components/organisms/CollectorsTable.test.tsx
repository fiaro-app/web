import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CollectorsTable } from './CollectorsTable';

const ROWS = [
  { id: '1', fullName: 'Luis Gómez', phone: '+573109998877', portfolioName: 'Zona Norte', active: true },
  { id: '2', fullName: 'Ana Ruiz', phone: '+573001112233', portfolioName: 'Sin cartera', active: false },
];

describe('CollectorsTable', () => {
  it('links each row to its management page', () => {
    render(<CollectorsTable rows={ROWS} />);
    expect(screen.getByRole('link', { name: 'Gestionar Luis Gómez' })).toHaveAttribute('href', '/cobradores/1');
  });

  it('renders one row per collector with name as the row header', () => {
    render(<CollectorsTable rows={ROWS} />);
    const row = screen.getByRole('row', { name: /Luis Gómez/ });
    expect(within(row).getByRole('rowheader', { name: 'Luis Gómez' })).toBeInTheDocument();
    expect(within(row).getByText('Zona Norte')).toBeInTheDocument();
    expect(within(row).getByText('Activo')).toBeInTheDocument();
  });

  it('labels inactive collectors with text, not only color', () => {
    render(<CollectorsTable rows={ROWS} />);
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('has an accessible caption and column headers', () => {
    render(<CollectorsTable rows={ROWS} />);
    expect(screen.getByRole('table', { name: 'Cobradores del negocio' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
  });
});
