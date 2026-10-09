import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PendingSettlementView } from '@/features/dashboard/dashboard-view-model';
import { PendingSettlementsTable } from './PendingSettlementsTable';

const ROW: PendingSettlementView = {
  id: '1',
  collectorName: 'Alejo Zuleta',
  portfolioName: 'Zona Norte',
  date: '22/09/2026',
  expected: '$450.000',
  collected: '$420.000',
  difference: '-$30.000',
  differenceTone: 'bad',
  note: null,
};

describe('PendingSettlementsTable', () => {
  it('is a table with a caption and column headers', () => {
    render(<PendingSettlementsTable settlements={[ROW]} />);

    expect(screen.getByRole('table', { name: 'Cuadres pendientes de aprobar' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Cobrador',
      'Cartera',
      'Fecha',
      'Esperado',
      'Cobrado',
      'Diferencia',
    ]);
  });

  it('shows each settlement in a row, naming the collector as the row header', () => {
    render(<PendingSettlementsTable settlements={[ROW]} />);

    const row = screen.getByRole('row', { name: /Alejo Zuleta/ });
    expect(within(row).getByRole('rowheader', { name: 'Alejo Zuleta' })).toBeInTheDocument();
    expect(within(row).getByText('Zona Norte')).toBeInTheDocument();
    expect(within(row).getByText('22/09/2026')).toBeInTheDocument();
    expect(within(row).getByText('$450.000')).toBeInTheDocument();
    expect(within(row).getByText('$420.000')).toBeInTheDocument();
  });

  it('highlights a difference in its tone and shows a dash when it matches', () => {
    render(<PendingSettlementsTable settlements={[ROW, { ...ROW, id: '2', collectorName: 'María Torres', difference: null, differenceTone: 'neutral' }]} />);

    expect(screen.getByText('-$30.000')).toHaveClass('text-destructive', 'font-semibold');
    expect(within(screen.getByRole('row', { name: /María Torres/ })).getByText('—')).not.toHaveClass('font-semibold');
  });
});
