import { describe, expect, it } from 'vitest';
import { effectivenessLevel, toDashboardViewModel } from './dashboard-view-model';
import type { LenderDashboard } from './endpoints';

const SETTLEMENT = {
  id: '0192f0a4-7c3e-7000-8000-000000000010',
  collectorMembershipId: '0192f0a4-7c3e-7000-8000-000000000011',
  date: '2026-10-08',
  expectedAmount: 350000,
  collectedAmount: 330000,
  collectedByMethod: { CASH: 300000, NEQUI: 30000, TRANSFER: 0 },
  status: 'PENDING' as const,
  collectorNote: 'Un cliente no estaba.',
};

const DASHBOARD: LenderDashboard = {
  totalPortfolio: 18400000,
  collectedToday: 3200000,
  activeCollectors: 4,
  totalCollectors: 5,
  effectivenessToday: 0.854,
  clientsInArrears: 12,
  alerts: ['3 clientes llevan más de 15 días en mora.'],
  pendingSettlements: [SETTLEMENT],
};

describe('effectivenessLevel', () => {
  it.each([
    [1.1, 'good'],
    [0.9, 'good'],
    [0.89, 'acceptable'],
    [0.7, 'acceptable'],
    [0.69, 'low'],
    [0, 'low'],
    [null, 'none'],
  ] as const)('classifies %s as %s', (ratio, level) => {
    expect(effectivenessLevel(ratio)).toBe(level);
  });
});

describe('toDashboardViewModel', () => {
  it('formats the figures so the view does not have to', () => {
    const view = toDashboardViewModel(DASHBOARD);

    expect(view.kpis).toEqual([
      { id: 'portfolio', label: 'Cartera total', value: '$18.400.000' },
      { id: 'collectedToday', label: 'Cobrado hoy', value: '$3.200.000' },
      { id: 'collectors', label: 'Cobradores activos', value: '4', detail: 'de 5' },
      { id: 'clientsInArrears', label: 'Clientes en mora', value: '12' },
    ]);
    expect(view.effectiveness).toEqual({ value: '85 %', level: 'acceptable' });
    expect(view.alerts).toEqual(['3 clientes llevan más de 15 días en mora.']);
    expect(view.isEmpty).toBe(false);
  });

  it('shows the pending settlements with their difference and note', () => {
    expect(toDashboardViewModel(DASHBOARD).pendingSettlements).toEqual([
      {
        id: SETTLEMENT.id,
        date: '2026-10-08',
        expected: '$350.000',
        collected: '$330.000',
        difference: '-$20.000',
        note: 'Un cliente no estaba.',
      },
    ]);
  });

  it('has no difference when the settlement matches', () => {
    const view = toDashboardViewModel({
      ...DASHBOARD,
      pendingSettlements: [{ ...SETTLEMENT, collectedAmount: SETTLEMENT.expectedAmount, collectorNote: null }],
    });

    expect(view.pendingSettlements[0]).toMatchObject({ difference: null, note: null });
  });

  it('shows a dash instead of a misleading 0 % when nothing was expected today', () => {
    const view = toDashboardViewModel({ ...DASHBOARD, effectivenessToday: null });

    expect(view.effectiveness).toEqual({ value: '—', level: 'none' });
  });

  it('is empty only for a business with no portfolio and no collectors', () => {
    const empty = { ...DASHBOARD, totalPortfolio: 0, totalCollectors: 0, activeCollectors: 0 };

    expect(toDashboardViewModel(empty).isEmpty).toBe(true);
    expect(toDashboardViewModel({ ...empty, totalCollectors: 1 }).isEmpty).toBe(false);
  });
});
