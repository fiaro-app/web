import type { LoanStatus } from '@fiaro-app/contracts';
import { LOANS_TEXT } from '@/content/loans';
import type { LoanResponse } from '@/features/loans/endpoints';
import { formatBusinessDate, formatInstantDate } from '@/lib/dates';
import { formatCop } from '@/lib/amount';
import type { Tone } from '@/lib/tone';

/** Nombres de cliente por id, para completar las filas del listado. */
export type ClientNames = ReadonlyMap<string, string>;

/** Color del estado de un préstamo: activo en tinta, pagado en verde y anulado atenuado. */
export type LoanStatusTone = Extract<Tone, 'success' | 'info'> | 'muted';

const STATUS_TONE: Record<LoanStatus, LoanStatusTone> = {
  ACTIVE: 'info',
  PAID_OFF: 'success',
  CANCELED: 'muted',
};

/** Una fila de la tabla de préstamos, lista para pintar. */
export interface LoanRow {
  readonly id: string;
  readonly clientName: string;
  readonly principal: string;
  /** "20 × $30.000". */
  readonly installments: string;
  readonly frequency: string;
  readonly startDate: string;
  readonly status: string;
  readonly statusTone: LoanStatusTone;
}

export interface LoansViewModel {
  readonly rows: readonly LoanRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** Estado por el que se filtra, o `null` para ver todos. */
  readonly status: LoanStatus | null;
}

/** "20 × $30.000". */
export function describeInstallments(count: number, value: number): string {
  return `${String(count)} × ${formatCop(value)}`;
}

/** Convierte una página de préstamos de la API en filas de la tabla. */
export function toLoansViewModel(
  loans: readonly LoanResponse[],
  clientNames: ClientNames,
  pageInfo: { readonly total: number; readonly page: number; readonly pageSize: number },
  status: LoanStatus | null,
): LoansViewModel {
  const rows = loans.map<LoanRow>((loan) => ({
    id: loan.id,
    clientName: clientNames.get(loan.clientId) ?? LOANS_TEXT.unknownClient,
    principal: formatCop(loan.principalAmount),
    installments: describeInstallments(loan.installmentCount, loan.installmentValue),
    frequency: LOANS_TEXT.frequency[loan.frequency],
    startDate: formatBusinessDate(loan.startDate),
    status: LOANS_TEXT.status[loan.status],
    statusTone: STATUS_TONE[loan.status],
  }));
  return { rows, ...pageInfo, status };
}

/** Datos del detalle de un préstamo, listos para pintar. */
export interface LoanDetailView {
  readonly id: string;
  readonly clientName: string;
  readonly principal: string;
  readonly installments: string;
  readonly totalPayable: string;
  readonly frequency: string;
  readonly startDate: string;
  readonly status: string;
  readonly statusTone: LoanStatusTone;
  /** Fecha de cierre (pagado o anulado), o `null` mientras siga activo. */
  readonly closedAt: string | null;
  /** Solo un préstamo activo se puede anular. */
  readonly cancelable: boolean;
}

export function toLoanDetailView(loan: LoanResponse, clientName: string | undefined): LoanDetailView {
  return {
    id: loan.id,
    clientName: clientName ?? LOANS_TEXT.unknownClient,
    principal: formatCop(loan.principalAmount),
    installments: describeInstallments(loan.installmentCount, loan.installmentValue),
    totalPayable: formatCop(loan.totalPayable),
    frequency: LOANS_TEXT.frequency[loan.frequency],
    startDate: formatBusinessDate(loan.startDate),
    status: LOANS_TEXT.status[loan.status],
    statusTone: STATUS_TONE[loan.status],
    // El día se lee en hora de Colombia: con UTC, un cierre a las 9 pm saldría con la fecha del día siguiente.
    closedAt: loan.closedAt === null ? null : formatInstantDate(loan.closedAt),
    cancelable: loan.status === 'ACTIVE',
  };
}
