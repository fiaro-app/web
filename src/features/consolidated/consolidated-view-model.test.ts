import { describe, expect, it } from 'vitest';
import type { Consolidated } from './endpoints';
import { toConsolidatedView } from './consolidated-view-model';

const FIGURES = { totalPortfolio: 1_000_000, portfolioAtRisk: 100_000, arrearsRate: 0.1, expectedAmount: 200_000, collectedAmount: 150_000, effectiveness: 0.75 };
const CONSOLIDATED: Consolidated = {
  from: '2026-11-01',
  to: '2026-11-14',
  lenders: [
    { lenderId: 'a', name: 'Negocio A', ...FIGURES },
    { lenderId: 'b', name: 'Negocio B', ...FIGURES, arrearsRate: null, effectiveness: null },
  ],
  totals: { ...FIGURES, totalPortfolio: 2_000_000 },
};

describe('toConsolidatedView', () => {
  it('formats each business and the total', () => {
    const view = toConsolidatedView(CONSOLIDATED, 'Total');

    expect(view?.rows[0]).toEqual({ id: 'a', name: 'Negocio A', portfolio: '$1.000.000', atRisk: '$100.000', arrears: '10 %', collected: '$150.000', effectiveness: '75 %' });
    expect(view?.rows[1]).toMatchObject({ arrears: '—', effectiveness: '—' });
    expect(view?.total).toMatchObject({ name: 'Total', portfolio: '$2.000.000' });
  });

  it('returns nothing with a single business: it would repeat Estadísticas', () => {
    expect(toConsolidatedView({ ...CONSOLIDATED, lenders: [CONSOLIDATED.lenders[0]!] }, 'Total')).toBeNull();
  });
});
