import { IdSchema } from '@fiaro-app/contracts';
import type { LenderStatsBody } from '@/features/stats/endpoints';

/** Filtros de la pantalla de Estadísticas, tal como viajan en la URL (`?desde=&hasta=&cobrador=&cartera=`). */
export interface StatsFilters {
  /** Primer día del período (`AAAA-MM-DD`), o `''` para el mes actual. */
  readonly from: string;
  readonly to: string;
  readonly collectorId: string;
  readonly portfolioId: string;
}

export const EMPTY_STATS_FILTERS: StatsFilters = { from: '', to: '', collectorId: '', portfolioId: '' };

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

function validId(value: string): string {
  return IdSchema.safeParse(value).success ? value : '';
}

/**
 * Filtros a partir de los parámetros de la URL. Todo valor inválido se descarta: un período solo
 * vale si trae las dos fechas, ambas reales y en orden; los ids deben ser UUID. Así la URL nunca
 * produce una consulta que la API rechace.
 */
export function parseStatsFilters(params: Readonly<Record<string, string | string[] | undefined>>): StatsFilters {
  const from = single(params.desde);
  const to = single(params.hasta);
  const validRange = isCalendarDate(from) && isCalendarDate(to) && from <= to;
  return {
    from: validRange ? from : '',
    to: validRange ? to : '',
    collectorId: validId(single(params.cobrador)),
    portfolioId: validId(single(params.cartera)),
  };
}

/** Cuerpo de la consulta de estadísticas para unos filtros; lo vacío no se envía. */
export function toStatsBody(filters: StatsFilters): LenderStatsBody {
  return {
    ...(filters.from !== '' && { dateRange: { from: filters.from, to: filters.to } }),
    ...(filters.collectorId !== '' && { collectorMembershipId: filters.collectorId }),
    ...(filters.portfolioId !== '' && { portfolioId: filters.portfolioId }),
  };
}
