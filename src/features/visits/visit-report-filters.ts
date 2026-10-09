import { IdSchema, VisitOutcomeSchema, type VisitOutcome } from '@fiaro-app/contracts';
import type { VisitReportBody } from '@/features/visits/endpoints';

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

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** ¿Es una fecha de calendario real (`2026-02-30` no lo es)? */
function isCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function single(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Filtros a partir de los parámetros de la URL. Todo valor inválido se descarta: si solo viene una
 * de las dos fechas se usa para ambas (un solo día), y el rango debe estar en orden. Así la URL
 * nunca produce una consulta que la API rechace.
 */
export function parseVisitReportFilters(params: Readonly<Record<string, string | string[] | undefined>>): VisitReportFilters {
  const rawFrom = single(params.desde);
  const rawTo = single(params.hasta);
  const from = isCalendarDate(rawFrom) ? rawFrom : isCalendarDate(rawTo) ? rawTo : '';
  const to = isCalendarDate(rawTo) ? rawTo : from;
  const validRange = from !== '' && from <= to;
  const collectorId = single(params.cobrador);
  const outcome = VisitOutcomeSchema.safeParse(single(params.resultado));
  return {
    from: validRange ? from : '',
    to: validRange ? to : '',
    collectorId: IdSchema.safeParse(collectorId).success ? collectorId : '',
    outcome: outcome.success ? outcome.data : '',
  };
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
