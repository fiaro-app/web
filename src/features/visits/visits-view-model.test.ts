import { describe, expect, it } from 'vitest';
import type { CollectionVisit, VisitReportEntry } from './endpoints';
import { toVisitReportViewModel, toVisitRows } from './visits-view-model';

const ID = (n: number) => `0190f7a0-0000-7000-8000-${String(n).padStart(12, '0')}`;
const visit = (n: number, extra: Partial<CollectionVisit> = {}): CollectionVisit => ({
  id: ID(n),
  loanId: ID(100),
  collectorMembershipId: ID(200),
  outcome: 'PAID',
  expectedAmount: 30_000,
  promisedDate: null,
  occurredAt: `2026-10-0${n}T15:00:00.000Z`,
  createdAt: `2026-10-0${n}T15:00:05.000Z`,
  payment: {
    id: ID(300 + n),
    loanId: ID(100),
    visitId: ID(n),
    amount: 30_000,
    method: 'NEQUI',
    occurredAt: `2026-10-0${n}T15:00:00.000Z`,
    createdAt: `2026-10-0${n}T15:00:05.000Z`,
    reversal: null,
  },
  ...extra,
});
const NAMES = new Map([[ID(200), 'Alejo Zuleta']]);

describe('toVisitRows', () => {
  it('shows a paid visit with its amount, method and collector, and lets the payment be reversed', () => {
    const [row] = toVisitRows([visit(1)], NAMES);

    expect(row).toMatchObject({
      date: '01/10/2026',
      collectorName: 'Alejo Zuleta',
      outcome: 'Pagó',
      outcomeTone: 'success',
      expected: '$30.000',
      collected: '$30.000',
      method: 'Nequi',
      reversiblePaymentId: ID(301),
      reverted: false,
    });
  });

  it('orders the visits from newest to oldest', () => {
    expect(toVisitRows([visit(1), visit(3), visit(2)], NAMES).map((row) => row.date)).toEqual(['03/10/2026', '02/10/2026', '01/10/2026']);
  });

  it('shows no payment for a visit without one and the promised date for a rescheduled one', () => {
    const [row] = toVisitRows([visit(1, { outcome: 'RESCHEDULED', promisedDate: '2026-10-05', payment: null })], NAMES);

    expect(row).toMatchObject({ outcome: 'Reprogramado', outcomeTone: 'warning', collected: '—', method: '—', reversiblePaymentId: null });
    expect(row?.note).toBe('Prometió pagar el 05/10/2026');
  });

  it('marks a reversed payment, shows its reason and does not offer to reverse it again', () => {
    const base = visit(1);
    const reversed = visit(1, {
      payment: {
        ...base.payment!,
        reversal: {
          id: ID(900),
          paymentId: ID(301),
          reason: 'Monto equivocado',
          reversedByMembershipId: ID(201),
          createdAt: '2026-10-02T10:00:00.000Z',
        },
      },
    });
    const [row] = toVisitRows([reversed], NAMES);

    expect(row).toMatchObject({ reverted: true, reversiblePaymentId: null, note: 'Motivo: Monto equivocado' });
  });

  it('uses a dash when the collector is unknown', () => {
    expect(toVisitRows([visit(1)], new Map())[0]?.collectorName).toBe('—');
  });
});

describe('toVisitReportViewModel', () => {
  const REPORT_ID = '0190f7a0-0000-7000-8000-000000000001';
  const entry = (overrides: Partial<VisitReportEntry>): VisitReportEntry => ({
    visitId: REPORT_ID,
    occurredAt: '2026-10-01T20:05:00.000Z',
    outcome: 'PAID',
    expectedAmount: 30_000,
    promisedDate: null,
    loan: { id: REPORT_ID },
    client: { id: REPORT_ID, fullName: 'Ana Gómez' },
    collector: { membershipId: REPORT_ID, fullName: 'Luis Pérez' },
    payment: { id: REPORT_ID, amount: 30_000, method: 'CASH', reversed: false },
    ...overrides,
  });

  it('formats the visits and the range as read in Colombia', () => {
    const view = toVisitReportViewModel({
      data: [
        entry({}),
        entry({ outcome: 'RESCHEDULED', promisedDate: '2026-10-05', payment: null }),
        entry({ payment: { id: REPORT_ID, amount: 10_000, method: 'NEQUI', reversed: true } }),
      ],
      meta: { page: 1, pageSize: 20, total: 3 },
      range: { from: '2026-10-01', to: '2026-10-01' },
    });

    expect(view).toMatchObject({ total: 3, page: 1, pageSize: 20, rangeFrom: '01/10/2026', rangeTo: '01/10/2026' });
    expect(view.rows[0]).toMatchObject({
      clientName: 'Ana Gómez',
      collectorName: 'Luis Pérez',
      outcome: 'Pagó',
      collected: '$30.000',
      method: 'Efectivo',
      reverted: false,
    });
    expect(view.rows[1]).toMatchObject({ outcome: 'Reprogramado', collected: '—', method: '—', note: 'Prometió pagar el 05/10/2026' });
    expect(view.rows[2]).toMatchObject({ method: 'Nequi', reverted: true });
  });
});
