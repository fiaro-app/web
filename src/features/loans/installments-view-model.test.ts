import { describe, expect, it } from 'vitest';
import type { LoanInstallment } from './endpoints';
import { summarizeInstallments, toInstallmentRows } from './installments-view-model';

const INSTALLMENTS: LoanInstallment[] = [
  { number: 2, dueDate: '2026-10-08', expectedAmount: 30_000, paidAmount: 10_000, status: 'PARTIAL' },
  { number: 1, dueDate: '2026-10-01', expectedAmount: 30_000, paidAmount: 30_000, status: 'PAID' },
  { number: 3, dueDate: '2026-10-15', expectedAmount: 30_000, paidAmount: 0, status: 'OVERDUE' },
  { number: 4, dueDate: '2026-10-22', expectedAmount: 30_000, paidAmount: 0, status: 'PENDING' },
];

describe('toInstallmentRows', () => {
  it('orders the installments and formats dates, amounts and status', () => {
    const rows = toInstallmentRows(INSTALLMENTS);

    expect(rows.map((row) => row.number)).toEqual([1, 2, 3, 4]);
    expect(rows[0]).toMatchObject({ expected: '$30.000', paid: '$30.000', status: 'Pagada', statusTone: 'success' });
    expect(rows[1]).toMatchObject({ paid: '$10.000', status: 'Parcial', statusTone: 'warning' });
    expect(rows[2]).toMatchObject({ paid: '—', status: 'Vencida', statusTone: 'error' });
    expect(rows[3]).toMatchObject({ status: 'Pendiente', statusTone: 'muted' });
  });
});

describe('summarizeInstallments', () => {
  it('counts the paid and overdue installments', () => {
    expect(summarizeInstallments(INSTALLMENTS)).toEqual({ total: 4, paid: 1, overdue: 1 });
  });
});
