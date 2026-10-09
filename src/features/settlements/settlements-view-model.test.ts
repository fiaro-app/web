import { describe, expect, it } from 'vitest';
import type { SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import type { SettlementResponse } from './endpoints';
import { toSettlementDetailView, toSettlementsViewModel } from './settlements-view-model';

const SETTLEMENT: SettlementResponse = {
  id: 's1',
  collectorMembershipId: 'm1',
  date: '2026-10-08',
  expectedAmount: 100_000,
  collectedAmount: 90_000,
  collectedByMethod: { CASH: 60_000, NEQUI: 30_000, TRANSFER: 0 },
  status: 'PENDING',
  collectorNote: 'Un cliente no pagó',
  reviewNote: null,
  reviewedByMembershipId: null,
  reviewedAt: null,
  submittedAt: '2026-10-09T02:30:00.000Z',
  createdAt: '2026-10-08T22:00:00.000Z',
};
const LOOKUP: SettlementLookup = {
  collectorNames: new Map([['m1', 'Luis Gómez']]),
  collectorPortfolioNames: new Map([['m1', 'Zona Norte']]),
};
const PAGE = { total: 1, page: 1, pageSize: 20 };

describe('toSettlementsViewModel', () => {
  it('formats the row, resolves names and flags what can be reviewed', () => {
    const view = toSettlementsViewModel([SETTLEMENT], LOOKUP, PAGE, null);
    expect(view.rows[0]).toEqual({
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
    });
    expect(view).toMatchObject({ ...PAGE, status: null });
  });

  it('maps every status to its tone and only pending is reviewable', () => {
    const view = toSettlementsViewModel(
      [SETTLEMENT, { ...SETTLEMENT, status: 'APPROVED' }, { ...SETTLEMENT, status: 'REJECTED' }],
      LOOKUP,
      PAGE,
      'APPROVED',
    );
    expect(view.rows.map((row) => row.statusTone)).toEqual(['warning', 'good', 'bad']);
    expect(view.rows.map((row) => row.reviewable)).toEqual([true, false, false]);
    expect(view.status).toBe('APPROVED');
  });

  it('falls back to placeholder names without a lookup', () => {
    const view = toSettlementsViewModel([SETTLEMENT], undefined, PAGE, null);
    expect(view.rows[0]).toMatchObject({ collectorName: 'Cobrador sin nombre', portfolioName: '—' });
  });
});

describe('toSettlementDetailView', () => {
  it('adds the payment methods, notes and Colombian dates', () => {
    const view = toSettlementDetailView(SETTLEMENT, LOOKUP);
    expect(view).toMatchObject({
      cash: '$60.000',
      nequi: '$30.000',
      transfer: '$0',
      collectorNote: 'Un cliente no pagó',
      // 02:30 UTC del 9 es todavía el 8 en Colombia.
      submittedAt: '08/10/2026',
      reviewedAt: null,
    });
  });

  it('formats the review date and note once reviewed', () => {
    const view = toSettlementDetailView(
      { ...SETTLEMENT, status: 'REJECTED', reviewNote: 'Falta recibo', reviewedAt: '2026-10-09T15:00:00.000Z' },
      LOOKUP,
    );
    expect(view).toMatchObject({ reviewNote: 'Falta recibo', reviewedAt: '09/10/2026', reviewable: false });
  });
});
