import { LOANS_TEXT } from '@/content/loans';
import type { InstallmentStatus, LoanInstallment } from '@/features/loans/endpoints';
import { formatCop } from '@/lib/amount';
import { formatBusinessDate } from '@/lib/dates';

/** Una cuota lista para mostrar en el calendario. */
export interface InstallmentRow {
  readonly number: number;
  readonly dueDate: string;
  readonly expected: string;
  /** Lo imputado a la cuota; `—` mientras no tenga nada pagado. */
  readonly paid: string;
  readonly status: string;
  readonly statusTone: 'success' | 'warning' | 'error' | 'muted';
}

/** Resumen del calendario: cuántas cuotas hay en cada estado. */
export interface InstallmentsSummary {
  readonly total: number;
  readonly paid: number;
  readonly overdue: number;
}

const STATUS_TONE: Record<InstallmentStatus, InstallmentRow['statusTone']> = {
  PAID: 'success',
  PARTIAL: 'warning',
  OVERDUE: 'error',
  PENDING: 'muted',
};

/** Convierte las cuotas de la API en filas, en el orden en que vencen. */
export function toInstallmentRows(installments: readonly LoanInstallment[]): InstallmentRow[] {
  return [...installments]
    .sort((a, b) => a.number - b.number)
    .map((installment) => ({
      number: installment.number,
      dueDate: formatBusinessDate(installment.dueDate),
      expected: formatCop(installment.expectedAmount),
      paid: installment.paidAmount > 0 ? formatCop(installment.paidAmount) : '—',
      status: LOANS_TEXT.installments.status[installment.status],
      statusTone: STATUS_TONE[installment.status],
    }));
}

/** Cuenta las cuotas pagadas y vencidas para el resumen sobre la tabla. */
export function summarizeInstallments(installments: readonly LoanInstallment[]): InstallmentsSummary {
  return {
    total: installments.length,
    paid: installments.filter((installment) => installment.status === 'PAID').length,
    overdue: installments.filter((installment) => installment.status === 'OVERDUE').length,
  };
}
