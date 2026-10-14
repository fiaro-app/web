import { describe, expect, it } from 'vitest';
import { toCollectorStatsView } from './collector-stats-view-model';
import type { CollectorPeriodStats } from './endpoints';

const STATS: CollectorPeriodStats = {
  from: '2026-10-01',
  to: '2026-10-09',
  expectedAmount: 1_000_000,
  collectedAmount: 950_000,
  effectiveness: 0.95,
  visitsCount: 42,
  overdueAmount: 0,
};

describe('toCollectorStatsView', () => {
  it('formats the figures and the period as read in Colombia', () => {
    expect(toCollectorStatsView(STATS)).toEqual({
      period: '01/10/2026 – 09/10/2026',
      expected: '$1.000.000',
      collected: '$950.000',
      effectiveness: '95 %',
      effectivenessTone: 'good',
      visits: '42',
      overdue: '$0',
      overdueTone: 'good',
    });
  });

  it('colors the effectiveness by how well the collector did and flags any arrears', () => {
    expect(toCollectorStatsView({ ...STATS, effectiveness: 0.75, overdueAmount: 90_000 })).toMatchObject({
      effectivenessTone: 'warning',
      overdueTone: 'bad',
    });
    expect(toCollectorStatsView({ ...STATS, effectiveness: 0.3 }).effectivenessTone).toBe('bad');
  });

  it('does not invent an effectiveness when nothing was due', () => {
    expect(toCollectorStatsView({ ...STATS, expectedAmount: 0, collectedAmount: 0, effectiveness: null })).toMatchObject({
      effectiveness: '—',
      effectivenessTone: 'neutral',
    });
  });
});
