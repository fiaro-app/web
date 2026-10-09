import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { SettlementRow } from '@/features/settlements/settlements-view-model';
import { SettlementsTable } from './SettlementsTable';

const ROW: SettlementRow = {
  id: 's1',
  collectorName: 'Luis Gómez',
  portfolioName: 'Zona Norte',
  date: '08/10/2026',
  expected: '$100.000',
  collected: '$90.000',
  difference: '-$10.000',
  differenceTone: 'bad',
  status: 'Pendiente',
  statusTone: 'warning',
  reviewable: true,
};

describe('SettlementsTable', () => {
  it('renders every column with the collector as row header', () => {
    render(<SettlementsTable rows={[ROW]} />);
    const row = screen.getByRole('row', { name: /Luis Gómez/ });
    expect(within(row).getByRole('rowheader', { name: 'Luis Gómez' })).toBeInTheDocument();
    for (const text of ['Zona Norte', '08/10/2026', '$100.000', '$90.000', 'Pendiente']) {
      expect(within(row).getByText(text)).toBeInTheDocument();
    }
  });

  it('highlights a difference in its tone and shows a dash when it balances', () => {
    render(<SettlementsTable rows={[ROW, { ...ROW, id: 's2', collectorName: 'Ana Ruiz', difference: null, differenceTone: 'neutral' }]} />);
    expect(screen.getByText('-$10.000')).toHaveClass('text-destructive', 'font-semibold');
    expect(within(screen.getByRole('row', { name: /Ana Ruiz/ })).getByText('—')).not.toHaveClass('font-semibold');
  });

  it('offers to review a pending settlement and only to view a reviewed one', () => {
    render(
      <SettlementsTable
        rows={[ROW, { ...ROW, id: 's2', collectorName: 'Ana Ruiz', status: 'Aprobado', statusTone: 'good', reviewable: false }]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Revisar cuadre de Luis Gómez' })).toHaveAttribute('href', '/cuadres/s1');
    expect(screen.getByRole('link', { name: 'Ver cuadre de Ana Ruiz' })).toHaveAttribute('href', '/cuadres/s2');
    expect(screen.getByText('Aprobado')).toHaveClass('text-success');
  });
});
