import type { LoanStatus } from "@fiaro-app/contracts";
import { LOANS_TEXT } from "@/content/loans";
import type {
  CollectionAssignment,
  LoanBalance,
  LoanResponse,
} from "@/features/loans/endpoints";
import { paidInstallments } from "@/features/loans/loan-calculations";
import { formatBusinessDate, formatInstantDate } from "@/lib/dates";
import { formatCop } from "@/lib/amount";
import type { Tone } from "@/lib/tone";

/** Nombres de cliente por id, para completar las filas del listado. */
export type ClientNames = ReadonlyMap<string, string>;

/** Color del estado de un préstamo: activo en tinta, pagado en verde y anulado atenuado. */
export type LoanStatusTone = Extract<Tone, "success" | "info"> | "muted";

const STATUS_TONE: Record<LoanStatus, LoanStatusTone> = {
  ACTIVE: "info",
  PAID_OFF: "success",
  CANCELED: "muted",
};

/** Una fila de la tabla de préstamos, lista para pintar. */
export interface LoanRow {
  readonly id: string;
  readonly clientName: string;
  readonly principal: string;
  /** "20 × $30.000". */
  readonly installments: string;
  /** Saldo pendiente; "—" si no se pudo calcular. */
  readonly balance: string;
  /** Cuotas pagadas sobre el total ("7/20"); "—" si no se pudo calcular. */
  readonly paid: string;
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

/** Saldo de cada préstamo por id; falta el de los que no se pudo consultar. */
export type LoanBalances = ReadonlyMap<string, LoanBalance>;

/**
 * Saldo de un préstamo: el de la API si se consultó; $0 si ya está pagado; `null` si no se sabe
 * (anulado, o la consulta falló). Un préstamo pagado no necesita preguntar a la API.
 */
function balanceOf(loan: LoanResponse, balances: LoanBalances): number | null {
  const known = balances.get(loan.id);
  if (known) return known.balance;
  return loan.status === "PAID_OFF" ? 0 : null;
}

/** Convierte una página de préstamos de la API en filas de la tabla. */
export function toLoansViewModel(
  loans: readonly LoanResponse[],
  clientNames: ClientNames,
  pageInfo: {
    readonly total: number;
    readonly page: number;
    readonly pageSize: number;
  },
  status: LoanStatus | null,
  balances: LoanBalances = new Map(),
): LoansViewModel {
  const rows = loans.map<LoanRow>((loan) => {
    const balance = balanceOf(loan, balances);
    return {
      id: loan.id,
      clientName: clientNames.get(loan.clientId) ?? LOANS_TEXT.unknownClient,
      principal: formatCop(loan.principalAmount),
      installments: describeInstallments(
        loan.installmentCount,
        loan.installmentValue,
      ),
      balance: balance === null ? "—" : formatCop(balance),
      paid:
        balance === null
          ? "—"
          : `${String(paidInstallments(loan.totalPayable, balance, loan.installmentValue, loan.installmentCount))}/${String(loan.installmentCount)}`,
      frequency: LOANS_TEXT.frequency[loan.frequency],
      startDate: formatBusinessDate(loan.startDate),
      status: LOANS_TEXT.status[loan.status],
      statusTone: STATUS_TONE[loan.status],
    };
  });
  return { rows, ...pageInfo, status };
}

/** Quién cobra el préstamo hoy y desde cuándo. */
export interface LoanCollectorView {
  readonly name: string;
  /** Desde cuándo rige la asignación (`01/10/2026`). */
  readonly since: string;
  /** Hasta cuándo, si es temporal (reemplazo); `null` si no tiene fin. */
  readonly until: string | null;
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
  /** Saldo pendiente, o `null` si no se pudo calcular. */
  readonly balance: string | null;
  /** "7 de 20", o `null` si no se pudo calcular. */
  readonly paidInstallments: string | null;
  /** Lo vencido y sin pagar, con los días de mora; `null` si está al día o no se sabe. */
  readonly overdue: { readonly amount: string; readonly days: string } | null;
  /** Próxima fecha de cobro (`10/10/2026`), o `null` si ya cerró o no se sabe. */
  readonly nextDueDate: string | null;
  /** El cobrador asignado hoy, o `null` si nadie cobra este préstamo. */
  readonly collector: LoanCollectorView | null;
  /** Solo un préstamo activo admite asignar un cobrador. */
  readonly assignable: boolean;
}

/** Lo que completa el detalle además del préstamo mismo; todo es opcional porque cada pieza puede fallar sola. */
export interface LoanDetailExtras {
  readonly clientName?: string;
  readonly balance?: LoanBalance | null;
  readonly assignment?: CollectionAssignment | null;
  readonly collectorName?: string | null;
}

function daysText(days: number): string {
  return `${String(days)} ${days === 1 ? "día" : "días"} de mora`;
}

export function toLoanDetailView(
  loan: LoanResponse,
  extras: LoanDetailExtras = {},
): LoanDetailView {
  const { balance = null, assignment = null } = extras;
  const balanceValue =
    balance?.balance ?? (loan.status === "PAID_OFF" ? 0 : null);
  return {
    id: loan.id,
    clientName: extras.clientName ?? LOANS_TEXT.unknownClient,
    principal: formatCop(loan.principalAmount),
    installments: describeInstallments(
      loan.installmentCount,
      loan.installmentValue,
    ),
    totalPayable: formatCop(loan.totalPayable),
    frequency: LOANS_TEXT.frequency[loan.frequency],
    startDate: formatBusinessDate(loan.startDate),
    status: LOANS_TEXT.status[loan.status],
    statusTone: STATUS_TONE[loan.status],
    // El día se lee en hora de Colombia: con UTC, un cierre a las 9 pm saldría con la fecha del día siguiente.
    closedAt: loan.closedAt === null ? null : formatInstantDate(loan.closedAt),
    cancelable: loan.status === "ACTIVE",
    balance: balanceValue === null ? null : formatCop(balanceValue),
    paidInstallments:
      balanceValue === null
        ? null
        : `${String(paidInstallments(loan.totalPayable, balanceValue, loan.installmentValue, loan.installmentCount))} de ${String(loan.installmentCount)}`,
    overdue:
      balance && balance.overdueAmount > 0
        ? {
            amount: formatCop(balance.overdueAmount),
            days: daysText(balance.overdueDays),
          }
        : null,
    nextDueDate: balance?.nextDueDate
      ? formatBusinessDate(balance.nextDueDate)
      : null,
    collector:
      assignment && extras.collectorName
        ? {
            name: extras.collectorName,
            since: formatBusinessDate(assignment.effectiveFrom),
            until:
              assignment.effectiveTo === null
                ? null
                : formatBusinessDate(assignment.effectiveTo),
          }
        : null,
    assignable: loan.status === "ACTIVE",
  };
}
