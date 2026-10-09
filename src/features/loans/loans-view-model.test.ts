import { describe, expect, it } from 'vitest';
import type { LoanResponse } from './endpoints';
import type { CollectionAssignment, LoanBalance } from './endpoints';
import { describeInstallments, toLoanDetailView, toLoansViewModel } from './loans-view-model';

const LOAN: LoanResponse = {
  id: 'l1',
  clientId: 'c1',
  principalAmount: 500_000,
  installmentCount: 20,
  installmentValue: 30_000,
  totalPayable: 600_000,
  frequency: 'DAILY',
  startDate: '2026-10-01',
  status: 'ACTIVE',
  createdByMembershipId: 'm1',
  createdAt: '2026-10-01T10:00:00.000Z',
  closedAt: null,
};
const NAMES = new Map([['c1', 'Carlos Gómez']]);
const PAGE = { total: 1, page: 1, pageSize: 20 };

describe('describeInstallments', () => {
  it('shows count × value', () => {
    expect(describeInstallments(20, 30_000)).toBe('20 × $30.000');
  });
});

describe('toLoansViewModel', () => {
  it('formats the row and resolves the client name', () => {
    const view = toLoansViewModel([LOAN], NAMES, PAGE, null);
    expect(view.rows[0]).toEqual({
      id: 'l1',
      clientName: 'Carlos Gómez',
      principal: '$500.000',
      installments: '20 × $30.000',
      balance: '—',
      paid: '—',
      frequency: 'Diaria',
      startDate: '01/10/2026',
      status: 'Activo',
      statusTone: 'info',
    });
    expect(view).toMatchObject({ ...PAGE, status: null });
  });

  it('falls back when the client is unknown and maps every status tone', () => {
    const view = toLoansViewModel(
      [
        { ...LOAN, clientId: 'x' },
        { ...LOAN, status: 'PAID_OFF' },
        { ...LOAN, status: 'CANCELED' },
      ],
      NAMES,
      PAGE,
      'ACTIVE',
    );
    expect(view.rows[0]?.clientName).toBe('Cliente no disponible');
    expect(view.rows.map((row) => row.statusTone)).toEqual(['info', 'success', 'muted']);
    expect(view.status).toBe('ACTIVE');
  });
});

describe('toLoanDetailView', () => {
  it('is cancelable only while active', () => {
    expect(toLoanDetailView(LOAN, { clientName: 'Carlos' }).cancelable).toBe(true);
    expect(toLoanDetailView({ ...LOAN, status: 'PAID_OFF', closedAt: '2026-11-01T10:00:00.000Z' }, { clientName: 'Carlos' }).cancelable).toBe(false);
  });

  it('reads the closing day in Colombian time', () => {
    const view = toLoanDetailView({ ...LOAN, status: 'CANCELED', closedAt: '2026-10-03T02:00:00.000Z' }, { clientName: 'Carlos' });
    expect(view.closedAt).toBe('02/10/2026');
  });

  it('formats totals and the closing date', () => {
    const view = toLoanDetailView({ ...LOAN, status: 'CANCELED', closedAt: '2026-10-02T15:00:00.000Z' });
    expect(view).toMatchObject({ totalPayable: '$600.000', closedAt: '02/10/2026', clientName: 'Cliente no disponible' });
  });
});

const BALANCE: LoanBalance = {
  loanId: 'l1',
  asOf: '2026-10-09',
  balance: 380_000,
  totalExpectedToDate: 270_000,
  overdueAmount: 60_000,
  overdueDays: 2,
  nextDueDate: '2026-10-07',
  firstOverdueDate: '2026-10-07',
};
const ASSIGNMENT: CollectionAssignment = {
  id: 'a1',
  loanId: 'l1',
  collectorMembershipId: 'm1',
  effectiveFrom: '2026-10-01',
  effectiveTo: null,
  createdAt: '2026-10-01T10:00:00.000Z',
};

describe('balance in the list', () => {
  it('shows the balance and the paid installments from the API balance', () => {
    const view = toLoansViewModel([LOAN], NAMES, PAGE, null, new Map([['l1', BALANCE]]));
    // Pactado 600.000, saldo 380.000 → pagó 220.000 → 7 cuotas completas de 30.000.
    expect(view.rows[0]).toMatchObject({ balance: '$380.000', paid: '7/20' });
  });

  it('shows a paid-off loan as fully paid without asking the API', () => {
    const view = toLoansViewModel([{ ...LOAN, status: 'PAID_OFF' }], NAMES, PAGE, null);
    expect(view.rows[0]).toMatchObject({ balance: '$0', paid: '20/20' });
  });

  it('shows dashes when the balance is unknown', () => {
    expect(toLoansViewModel([LOAN], NAMES, PAGE, null).rows[0]).toMatchObject({ balance: '—', paid: '—' });
    expect(toLoansViewModel([{ ...LOAN, status: 'CANCELED' }], NAMES, PAGE, null).rows[0]).toMatchObject({ balance: '—' });
  });
});

describe('balance and collector in the detail', () => {
  it('describes balance, paid installments, arrears and next due date', () => {
    const view = toLoanDetailView(LOAN, { clientName: 'Carlos', balance: BALANCE });
    expect(view).toMatchObject({
      balance: '$380.000',
      paidInstallments: '7 de 20',
      overdue: { amount: '$60.000', days: '2 días de mora' },
      nextDueDate: '07/10/2026',
    });
  });

  it('has no arrears when the loan is up to date and singularizes one day', () => {
    expect(toLoanDetailView(LOAN, { balance: { ...BALANCE, overdueAmount: 0, overdueDays: 0 } }).overdue).toBeNull();
    expect(toLoanDetailView(LOAN, { balance: { ...BALANCE, overdueDays: 1 } }).overdue?.days).toBe('1 día de mora');
  });

  it('has no balance data when it could not be fetched, except a paid-off loan', () => {
    expect(toLoanDetailView(LOAN)).toMatchObject({ balance: null, paidInstallments: null, overdue: null, nextDueDate: null });
    expect(toLoanDetailView({ ...LOAN, status: 'PAID_OFF' })).toMatchObject({ balance: '$0', paidInstallments: '20 de 20' });
  });

  it('describes who collects the loan', () => {
    const view = toLoanDetailView(LOAN, { assignment: ASSIGNMENT, collectorName: 'Luis Gómez' });
    expect(view.collector).toEqual({ name: 'Luis Gómez', since: '01/10/2026', until: null });
    const temporary = toLoanDetailView(LOAN, { assignment: { ...ASSIGNMENT, effectiveTo: '2026-10-09' }, collectorName: 'Luis Gómez' });
    expect(temporary.collector?.until).toBe('09/10/2026');
  });

  it('has no collector without an assignment or without a known name', () => {
    expect(toLoanDetailView(LOAN).collector).toBeNull();
    expect(toLoanDetailView(LOAN, { assignment: ASSIGNMENT, collectorName: null }).collector).toBeNull();
  });

  it('only an active loan can be assigned', () => {
    expect(toLoanDetailView(LOAN).assignable).toBe(true);
    expect(toLoanDetailView({ ...LOAN, status: 'CANCELED' }).assignable).toBe(false);
  });
});
