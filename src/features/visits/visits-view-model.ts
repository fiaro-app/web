import type { VisitOutcome } from '@fiaro-app/contracts';
import { VISITS_TEXT } from '@/content/visits';
import type { CollectionVisit } from '@/features/visits/endpoints';
import { formatCop } from '@/lib/amount';
import { formatBusinessDate, formatInstantDate } from '@/lib/dates';

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
