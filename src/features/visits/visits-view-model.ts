import type { VisitOutcome } from '@fiaro-app/contracts';
import { VISITS_TEXT } from '@/content/visits';
import type { CollectionVisit, VisitReport, VisitReportEntry } from '@/features/visits/endpoints';
import { formatCop } from '@/lib/amount';
import { formatBusinessDate, formatInstantDate, formatInstantTime } from '@/lib/dates';

/** Una visita lista para mostrar en la tabla del historial. */
export interface VisitRow {
  readonly id: string;
  readonly date: string;
  readonly collectorName: string;
  readonly outcome: string;
  readonly outcomeTone: 'success' | 'warning' | 'error' | 'muted';
  readonly expected: string;
  /** Lo cobrado en la visita; `—` si no hubo pago. */
  readonly collected: string;
  readonly method: string;
  /** Detalle bajo el resultado: la fecha prometida o el motivo de la reversión. */
  readonly note: string | null;
  /** Id del pago que se puede revertir; `null` si no hubo pago o ya está revertido. */
  readonly reversiblePaymentId: string | null;
  readonly reverted: boolean;
}

const OUTCOME_TONE: Record<VisitOutcome, VisitRow['outcomeTone']> = {
  PAID: 'success',
  RESCHEDULED: 'warning',
  NOT_FOUND: 'error',
  REFUSED: 'error',
};

/**
 * Convierte las visitas de la API en filas del historial, de la más reciente a la más antigua. Un
 * pago revertido se muestra tachado como «Revertido» y ya no se puede revertir otra vez.
 *
 * @param collectorNames - Nombre por id de membresía; sin él se muestra un guion.
 */
export function toVisitRows(visits: readonly CollectionVisit[], collectorNames: ReadonlyMap<string, string>): VisitRow[] {
  return [...visits]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .map((visit) => {
      const payment = visit.payment;
      const reverted = payment?.reversal != null;
      let note: string | null = null;
      if (payment?.reversal) note = VISITS_TEXT.reversal(payment.reversal.reason);
      else if (visit.promisedDate) note = VISITS_TEXT.promised(formatBusinessDate(visit.promisedDate));
      return {
        id: visit.id,
        date: formatInstantDate(visit.occurredAt),
        collectorName: collectorNames.get(visit.collectorMembershipId) ?? '—',
        outcome: VISITS_TEXT.outcome[visit.outcome],
        outcomeTone: OUTCOME_TONE[visit.outcome],
        expected: formatCop(visit.expectedAmount),
        collected: payment ? formatCop(payment.amount) : '—',
        method: payment ? VISITS_TEXT.method[payment.method] : '—',
        note,
        reversiblePaymentId: payment && !reverted ? payment.id : null,
        reverted,
      };
    });
}

/** Una visita lista para mostrar en la tabla de «Cobros del día». */
export interface VisitReportRow {
  readonly id: string;
  readonly time: string;
  readonly loanId: string;
  readonly clientName: string;
  readonly collectorName: string;
  readonly outcome: string;
  readonly outcomeTone: VisitRow['outcomeTone'];
  readonly expected: string;
  /** Lo cobrado en la visita; `—` si no hubo pago. */
  readonly collected: string;
  readonly method: string;
  /** El pago fue anulado con una reversión: ya no cuenta como cobrado. */
  readonly reverted: boolean;
  /** Fecha prometida si la visita se reprogramó. */
  readonly note: string | null;
}

/** Lo que muestra la pantalla «Cobros del día»: las filas, la paginación y el rango resuelto por la API. */
export interface VisitReportViewModel {
  readonly rows: readonly VisitReportRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** Primer y último día del rango, ya escritos como se leen en Colombia. */
  readonly rangeFrom: string;
  readonly rangeTo: string;
}

function toVisitReportRow(entry: VisitReportEntry): VisitReportRow {
  const payment = entry.payment;
  return {
    id: entry.visitId,
    time: formatInstantTime(entry.occurredAt),
    loanId: entry.loan.id,
    clientName: entry.client.fullName,
    collectorName: entry.collector.fullName,
    outcome: VISITS_TEXT.outcome[entry.outcome],
    outcomeTone: OUTCOME_TONE[entry.outcome],
    expected: formatCop(entry.expectedAmount),
    collected: payment ? formatCop(payment.amount) : '—',
    method: payment ? VISITS_TEXT.method[payment.method] : '—',
    reverted: payment?.reversed ?? false,
    note: entry.promisedDate ? VISITS_TEXT.promised(formatBusinessDate(entry.promisedDate)) : null,
  };
}

/** Convierte la respuesta del reporte en lo que pinta la pantalla; la API ya entrega las visitas de la más reciente a la más antigua. */
export function toVisitReportViewModel(report: VisitReport): VisitReportViewModel {
  return {
    rows: report.data.map(toVisitReportRow),
    total: report.meta.total,
    page: report.meta.page,
    pageSize: report.meta.pageSize,
    rangeFrom: formatBusinessDate(report.range.from),
    rangeTo: formatBusinessDate(report.range.to),
  };
}
