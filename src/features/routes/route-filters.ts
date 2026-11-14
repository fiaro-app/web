import type { RoutesBody } from '@/features/routes/endpoints';
import { DATE_RANGE_LIMITS, dateRangeParams, idParam, type SearchParams } from '@/lib/search-params';

/** Filtros del registro de rutas, tal como viajan en la URL (`?desde=&hasta=&cobrador=`). */
export interface RouteFilters {
  /** Primer día (`AAAA-MM-DD`), o `''` para solo hoy. */
  readonly from: string;
  readonly to: string;
  readonly collectorId: string;
}

export const EMPTY_ROUTE_FILTERS: RouteFilters = { from: '', to: '', collectorId: '' };

/** Filtros a partir de la URL; todo valor inválido se descarta, como en «Cobros del día». */
export function parseRouteFilters(params: SearchParams): RouteFilters {
  return { ...dateRangeParams(params, DATE_RANGE_LIMITS.visits), collectorId: idParam(params.cobrador) };
}

/** Cuerpo de la consulta para unos filtros y una página; lo vacío no se envía. */
export function toRoutesBody(filters: RouteFilters, page: number, pageSize: number): RoutesBody {
  return {
    page,
    pageSize,
    ...(filters.from !== '' && { dateRange: { from: filters.from, to: filters.to } }),
    ...(filters.collectorId !== '' && { collectorMembershipId: filters.collectorId }),
  };
}
