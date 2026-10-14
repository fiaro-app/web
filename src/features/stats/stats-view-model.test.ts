import { describe, expect, it } from 'vitest';
import type { SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import type { LenderStats } from './endpoints';
import { toStatsViewModel } from './stats-view-model';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';
const STATS: LenderStats = {
  from: '2026-10-01',
  to: '2026-10-09',
  totalPortfolio: 18_400_000,
  portfolioAtRisk: 7_050_000,
  arrearsRate: 0.18,
  arrearsByAge: [
    { label: '0-7', amount: 3_200_000, clientsCount: 8 },
    { label: '8-15', amount: 1_600_000, clientsCount: 1 },
    { label: '16-30', amount: 0, clientsCount: 0 },
    { label: '30+', amount: 900_000, clientsCount: 2 },
  ],
  topArrears: [{ clientId: ID, clientFullName: 'María Gómez', overdueDays: 32, overdueAmount: 900_000 }],
  collectorPerformance: [{ collectorMembershipId: ID, fullName: 'Alejo Zuleta', effectiveness: 0.92, overdueAmount: 300_000 }],
  expectedAmount: 5_000_000,
  collectedAmount: 4_000_000,
  effectiveness: 0.8,
  previous: null,
};
const PREVIOUS = {
  from: '2026-09-22',
  to: '2026-09-30',
  totalPortfolio: 17_000_000,
  portfolioAtRisk: 5_000_000,
  arrearsRate: 0.29,
  expectedAmount: 4_500_000,
  collectedAmount: 3_000_000,
  effectiveness: 0.67,
};
const LOOKUP: SettlementLookup = { collectorNames: new Map(), collectorPortfolioNames: new Map([[ID, 'Zona Norte']]) };

describe('toStatsViewModel', () => {
  it('formats the period and the KPIs with their tones, without trends when there is no previous period', () => {
    const view = toStatsViewModel(STATS, LOOKUP);
    expect(view.period).toBe('01/10/2026 – 09/10/2026');
    expect(view.kpis).toEqual([
      { id: 'portfolio', label: 'Cartera total', value: '$18.4M', tone: 'neutral', trend: null },
      { id: 'atRisk', label: 'Cartera en riesgo', value: '$7.1M', tone: 'bad', trend: null },
      { id: 'arrearsRate', label: '% en mora', value: '18 %', tone: 'warning', trend: null },
      { id: 'collected', label: 'Cobrado en el período', value: '$4M', tone: 'good', trend: null },
      { id: 'effectiveness', label: 'Efectividad', value: '80 %', tone: 'warning', trend: null },
    ]);
  });

  it('adds the trend against the previous period, judged by what is good for each indicator', () => {
    const kpis = toStatsViewModel({ ...STATS, previous: PREVIOUS }).kpis;

    expect(kpis.map((kpi) => [kpi.id, kpi.trend?.label, kpi.trend?.tone])).toEqual([
      ['portfolio', '↑ 8 %', 'neutral'],
      ['atRisk', '↑ 41 %', 'bad'],
      ['arrearsRate', '↓ 11 pts', 'good'],
      ['collected', '↑ 33 %', 'good'],
      ['effectiveness', '↑ 13 pts', 'good'],
    ]);
  });

  it.each([
    [0.05, 'good'],
    [0.1, 'warning'],
    [0.19, 'warning'],
    [0.2, 'bad'],
    [null, 'neutral'],
  ])('tones an arrears rate of %s as %s', (rate, tone) => {
    expect(toStatsViewModel({ ...STATS, arrearsRate: rate }).kpis[2]?.tone).toBe(tone);
  });

  it('scales the buckets against the largest and pluralizes the clients', () => {
    const view = toStatsViewModel(STATS);
    expect(view.arrearsByAge.map((bucket) => bucket.label)).toEqual(['0–7 días', '8–15 días', '16–30 días', 'Más de 30 días']);
    expect(view.arrearsByAge.map((bucket) => bucket.barPercent)).toEqual([100, 50, 0, 28]);
    expect(view.arrearsByAge.map((bucket) => bucket.clients)).toEqual(['8 clientes', '1 cliente', '0 clientes', '2 clientes']);
    expect(view.arrearsByAge[0]?.amount).toBe('$3.200.000');
  });

  it('has empty bars when nothing is overdue', () => {
    const empty = STATS.arrearsByAge.map((bucket) => ({ ...bucket, amount: 0, clientsCount: 0 }));
    expect(toStatsViewModel({ ...STATS, arrearsByAge: empty as LenderStats['arrearsByAge'] }).arrearsByAge.every((bucket) => bucket.barPercent === 0)).toBe(true);
  });

  it('describes the clients with the most arrears', () => {
    expect(toStatsViewModel(STATS).topArrears).toEqual([
      { clientId: ID, name: 'María Gómez', days: '32 días en mora', amount: '$900.000' },
    ]);
    const single = toStatsViewModel({ ...STATS, topArrears: [{ clientId: ID, clientFullName: 'Ana Ruiz', overdueDays: 1, overdueAmount: 5 }] });
    expect(single.topArrears[0]?.days).toBe('1 día en mora');
  });

  it('describes the collectors with portfolio and effectiveness tone', () => {
    const view = toStatsViewModel(STATS, LOOKUP);
    expect(view.collectors[0]).toEqual({
      collectorId: ID,
      name: 'Alejo Zuleta',
      portfolioName: 'Zona Norte',
      effectiveness: '92 %',
      effectivenessTone: 'good',
      overdue: '$300.000',
    });
    expect(toStatsViewModel(STATS).collectors[0]?.portfolioName).toBe('—');
    expect(toStatsViewModel({ ...STATS, collectorPerformance: [{ collectorMembershipId: ID, fullName: 'X', effectiveness: null, overdueAmount: 0 }] }).collectors[0]).toMatchObject({
      effectiveness: '—',
      effectivenessTone: 'neutral',
    });
  });

  it('is empty without portfolio or collectors', () => {
    expect(toStatsViewModel({ ...STATS, totalPortfolio: 0, collectorPerformance: [] }).isEmpty).toBe(true);
    expect(toStatsViewModel(STATS).isEmpty).toBe(false);
  });
});
