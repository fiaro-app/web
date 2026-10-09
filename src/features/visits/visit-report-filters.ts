import { MAX_PAGE_SIZE, VisitOutcomeSchema, type VisitOutcome } from '@fiaro-app/contracts';
import type { VisitReport, VisitReportBody } from '@/features/visits/endpoints';
import { parseSearchParam } from '@/lib/pagination';
import { matchesSearch } from '@/lib/search-text';
import { dateRangeParams, idParam, singleParam, type SearchParams } from '@/lib/search-params';

/** Filtros de «Cobros del día», tal como viajan en la URL (`?desde=&hasta=&cobrador=&resultado=`). */
export interface VisitReportFilters {
  /** Primer día (`AAAA-MM-DD`), o `''` para solo hoy. */
  readonly from: string;
  readonly to: string;
  readonly collectorId: string;
  readonly outcome: VisitOutcome | '';
  /** Texto buscado en el nombre del cliente o del cobrador (`?q=`); `''` si no se busca. */
  readonly search: string;
}

export const EMPTY_VISIT_REPORT_FILTERS: VisitReportFilters = { from: '', to: '', collectorId: '', outcome: '', search: '' };

/** Resultados que se pueden pedir con `?resultado=`, en el orden de las píldoras. */
export const VISIT_OUTCOME_FILTERS: readonly VisitOutcome[] = ['PAID', 'RESCHEDULED', 'NOT_FOUND', 'REFUSED'];

/**
 * Filtros a partir de los parámetros de la URL. Todo valor inválido se descarta: si solo viene una
 * de las dos fechas se usa para ambas (un solo día), y el rango debe estar en orden. Así la URL
 * nunca produce una consulta que la API rechace.
 */
export function parseVisitReportFilters(params: SearchParams): VisitReportFilters {
  const outcome = VisitOutcomeSchema.safeParse(singleParam(params.resultado));
  return { ...dateRangeParams(params), collectorId: idParam(params.cobrador), outcome: outcome.success ? outcome.data : '', search: parseSearchParam(params.q) };
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

/** Cuántas visitas se revisan al buscar por nombre: la API no busca texto, así que se filtra la primera página más grande. */
export const SEARCH_SCAN_SIZE = MAX_PAGE_SIZE;

/**
 * Deja las visitas cuyo cliente o cobrador coincide con la búsqueda. `scanned` indica que el
 * reporte tiene más visitas de las revisadas (la búsqueda no las cubre todas).
 */
export function searchVisitReport(report: VisitReport, search: string): { readonly report: VisitReport; readonly truncated: boolean } {
  const data = report.data.filter((entry) => matchesSearch(search, entry.client.fullName, entry.collector.fullName));
  return {
    report: { ...report, data, meta: { page: 1, pageSize: Math.max(SEARCH_SCAN_SIZE, data.length), total: data.length } },
    truncated: report.meta.total > report.data.length,
  };
}
