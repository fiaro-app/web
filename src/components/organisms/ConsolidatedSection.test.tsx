import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ConsolidatedView } from '@/features/consolidated/consolidated-view-model';
import { ConsolidatedSection } from './ConsolidatedSection';

const ROW = { portfolio: '$1.000.000', atRisk: '$100.000', arrears: '10 %', collected: '$150.000', effectiveness: '75 %' };
const VIEW: ConsolidatedView = {
  rows: [
    { id: 'a', name: 'Negocio A', ...ROW },
    { id: 'b', name: 'Negocio B', ...ROW },
  ],
  total: { id: 'total', name: 'Total', ...ROW, portfolio: '$2.000.000' },
};

describe('ConsolidatedSection', () => {
  it('lists each business and the total in a table', () => {
    render(<ConsolidatedSection view={VIEW} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Todos tus negocios' })).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
    expect(within(rows[1]!).getByRole('rowheader', { name: 'Negocio A' })).toBeInTheDocument();
    expect(within(rows[3]!).getByText('$2.000.000')).toBeInTheDocument();
  });
});
