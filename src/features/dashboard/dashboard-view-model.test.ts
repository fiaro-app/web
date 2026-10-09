import { describe, expect, it } from 'vitest';
import {
  EMPTY_LOOKUP,
  NO_PORTFOLIO,
  UNKNOWN_COLLECTOR,
  effectivenessLevel,
  toDashboardViewModel,
  type SettlementLookup,
} from './dashboard-view-model';
import type { LenderDashboard } from './endpoints';

const COLLECTOR_ID = '0192f0a4-7c3e-7000-8000-000000000011';

const SETTLEMENT = {
  id: '0192f0a4-7c3e-7000-8000-000000000010',
  collectorMembershipId: COLLECTOR_ID,
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
  activeCollectors: 7,
  totalCollectors: 9,
  effectivenessToday: 0.84,
  clientsInArrears: 23,
  period: { from: '2026-10-09', to: '2026-10-09' },
  collectedInPeriod: 3200000,
  expectedInPeriod: 3800000,
  effectivenessInPeriod: 0.84,
  alerts: ['3 cobradores aún no han iniciado su ruta hoy.'],
  pendingSettlements: [SETTLEMENT],
};

const LOOKUP: SettlementLookup = {
  collectorNames: new Map([[COLLECTOR_ID, 'Alejo Zuleta']]),
  collectorPortfolioNames: new Map([[COLLECTOR_ID, 'Zona Norte']]),
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
  it('builds the five indicators of the design with their tone', () => {
    const view = toDashboardViewModel(DASHBOARD);

    expect(view.kpis).toEqual([
      { id: 'portfolio', label: 'Cartera total', value: '$18.4M', tone: 'neutral' },
      { id: 'collectedToday', label: 'Cobrado hoy', value: '$3.2M', tone: 'good' },
      { id: 'collectors', label: 'Cobradores activos', value: '7 / 9', tone: 'neutral' },
      { id: 'effectiveness', label: 'Efectividad de hoy', value: '84 %', tone: 'warning' },
      { id: 'clientsInArrears', label: 'Clientes en mora', value: '23', tone: 'bad' },
    ]);
    expect(view.alerts).toEqual(['3 cobradores aún no han iniciado su ruta hoy.']);
    expect(view.isEmpty).toBe(false);
  });

  it.each([
    [0.95, 'good'],
    [0.5, 'bad'],
    [null, 'neutral'],
  ] as const)('colors an effectiveness of %s as %s', (ratio, tone) => {
    const view = toDashboardViewModel({ ...DASHBOARD, effectivenessToday: ratio });

    expect(view.kpis.find((kpi) => kpi.id === 'effectiveness')).toMatchObject({ tone });
  });

  it('shows a dash instead of a misleading 0 % when nothing was expected today', () => {
    const view = toDashboardViewModel({ ...DASHBOARD, effectivenessToday: null });

    expect(view.kpis.find((kpi) => kpi.id === 'effectiveness')?.value).toBe('—');
  });

  it('does not color the arrears when there are none', () => {
    const view = toDashboardViewModel({ ...DASHBOARD, clientsInArrears: 0 });

    expect(view.kpis.find((kpi) => kpi.id === 'clientsInArrears')).toMatchObject({ value: '0', tone: 'neutral' });
  });

  it('completes the pending settlements with names, a Colombian date and the difference', () => {
    expect(toDashboardViewModel(DASHBOARD, LOOKUP).pendingSettlements).toEqual([
      {
        id: SETTLEMENT.id,
        collectorName: 'Alejo Zuleta',
        portfolioName: 'Zona Norte',
        date: '08/10/2026',
        expected: '$350.000',
        collected: '$330.000',
        difference: '-$20.000',
        differenceTone: 'bad',
        note: 'Un cliente no estaba.',
      },
    ]);
  });

  it('falls back to neutral labels when the names are not known', () => {
    const [row] = toDashboardViewModel(DASHBOARD, EMPTY_LOOKUP).pendingSettlements;

    expect(row).toMatchObject({ collectorName: UNKNOWN_COLLECTOR, portfolioName: NO_PORTFOLIO });
  });

  it('has no difference when the settlement matches and flags a surplus as a warning', () => {
    const view = toDashboardViewModel({
      ...DASHBOARD,
      pendingSettlements: [
        { ...SETTLEMENT, collectedAmount: SETTLEMENT.expectedAmount, collectorNote: null },
        { ...SETTLEMENT, id: 'otro', collectedAmount: SETTLEMENT.expectedAmount + 5000 },
      ],
    });

    expect(view.pendingSettlements[0]).toMatchObject({ difference: null, differenceTone: 'neutral', note: null });
    expect(view.pendingSettlements[1]).toMatchObject({ difference: '$5.000', differenceTone: 'warning' });
  });

  it('is empty only for a business with no portfolio and no collectors', () => {
    const empty = { ...DASHBOARD, totalPortfolio: 0, totalCollectors: 0, activeCollectors: 0 };

    expect(toDashboardViewModel(empty).isEmpty).toBe(true);
    expect(toDashboardViewModel({ ...empty, totalCollectors: 1 }).isEmpty).toBe(false);
  });
});

describe('period of the collection figures', () => {
  const PERIOD_DASHBOARD: LenderDashboard = {
    ...DASHBOARD,
    period: { from: '2026-10-01', to: '2026-10-09' },
    collectedInPeriod: 9_000_000,
    expectedInPeriod: 10_000_000,
    effectivenessInPeriod: 0.9,
  };

  it('shows today by default, with the "hoy" labels', () => {
    const view = toDashboardViewModel(DASHBOARD, LOOKUP);

    expect(view.periodLabel).toBe('Hoy · 09/10/2026');
    expect(view.kpis.find((kpi) => kpi.id === 'collectedToday')).toMatchObject({ label: 'Cobrado hoy', value: '$3.2M' });
    expect(view.kpis.find((kpi) => kpi.id === 'effectiveness')).toMatchObject({ label: 'Efectividad de hoy', value: '84 %' });
  });

  it('uses the figures of the period and relabels them when a period is asked for', () => {
    const view = toDashboardViewModel(PERIOD_DASHBOARD, LOOKUP, true);

    expect(view.periodLabel).toBe('Del 01/10/2026 al 09/10/2026');
    expect(view.kpis.find((kpi) => kpi.id === 'collectedToday')).toMatchObject({ label: 'Cobrado en el período', value: '$9M' });
    expect(view.kpis.find((kpi) => kpi.id === 'effectiveness')).toMatchObject({ label: 'Efectividad del período', value: '90 %', tone: 'good' });
  });

  it('names a single day', () => {
    const view = toDashboardViewModel({ ...PERIOD_DASHBOARD, period: { from: '2026-10-05', to: '2026-10-05' } }, LOOKUP, true);

    expect(view.periodLabel).toBe('El 05/10/2026');
  });
});
