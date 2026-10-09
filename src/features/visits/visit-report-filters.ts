import { VisitOutcomeSchema, type VisitOutcome } from '@fiaro-app/contracts';
import type { VisitReportBody } from '@/features/visits/endpoints';
import { dateRangeParams, idParam, singleParam, type SearchParams } from '@/lib/search-params';

/** Filtros de «Cobros del día», tal como viajan en la URL (`?desde=&hasta=&cobrador=&resultado=`). */
export interface VisitReportFilters {
  /** Primer día (`AAAA-MM-DD`), o `''` para solo hoy. */
  readonly from: string;
  readonly to: string;
  readonly collectorId: string;
  readonly outcome: VisitOutcome | '';
}

export const EMPTY_VISIT_REPORT_FILTERS: VisitReportFilters = { from: '', to: '', collectorId: '', outcome: '' };

/** Resultados que se pueden pedir con `?resultado=`, en el orden de las píldoras. */
export const VISIT_OUTCOME_FILTERS: readonly VisitOutcome[] = ['PAID', 'RESCHEDULED', 'NOT_FOUND', 'REFUSED'];

/**
 * Filtros a partir de los parámetros de la URL. Todo valor inválido se descarta: si solo viene una
 * de las dos fechas se usa para ambas (un solo día), y el rango debe estar en orden. Así la URL
 * nunca produce una consulta que la API rechace.
 */
export function parseVisitReportFilters(params: SearchParams): VisitReportFilters {
  const outcome = VisitOutcomeSchema.safeParse(singleParam(params.resultado));
  return { ...dateRangeParams(params), collectorId: idParam(params.cobrador), outcome: outcome.success ? outcome.data : '' };
}

/** Cuerpo de la consulta del reporte para unos filtros y una página; lo vacío no se envía. */
export function toVisitReportBody(filters: VisitReportFilters, page: number, pageSize: number): VisitReportBody {
  return {
    page,
    pageSize,
    ...(filters.from !== '' && { dateRange: { from: filters.from, to: filters.to } }),
    ...(filters.collectorId !== '' && { collectorMembershipId: filters.collectorId }),
    ...(filters.outcome !== '' && { outcome: filters.outcome }),
  };
}
