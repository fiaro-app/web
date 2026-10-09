import { describe, expect, it } from 'vitest';
import type { LoanResponse } from './endpoints';
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
    expect(toLoanDetailView(LOAN, 'Carlos').cancelable).toBe(true);
    expect(toLoanDetailView({ ...LOAN, status: 'PAID_OFF', closedAt: '2026-11-01T10:00:00.000Z' }, 'Carlos').cancelable).toBe(false);
  });

  it('reads the closing day in Colombian time', () => {
    const view = toLoanDetailView({ ...LOAN, status: 'CANCELED', closedAt: '2026-10-03T02:00:00.000Z' }, 'Carlos');
    expect(view.closedAt).toBe('02/10/2026');
  });

  it('formats totals and the closing date', () => {
    const view = toLoanDetailView({ ...LOAN, status: 'CANCELED', closedAt: '2026-10-02T15:00:00.000Z' }, undefined);
    expect(view).toMatchObject({ totalPayable: '$600.000', closedAt: '02/10/2026', clientName: 'Cliente no disponible' });
  });
});
