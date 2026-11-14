import type { LenderStatsBody } from '@/features/stats/endpoints';
import { pageHref, parsePageParam } from '@/lib/pagination';
import { dateRangeParams, idParam, isCalendarDate, singleParam, type SearchParams } from '@/lib/search-params';

/** Filtros de la pantalla de Estadísticas, tal como viajan en la URL (`?desde=&hasta=&cobrador=&cartera=`). */
export interface StatsFilters {
  /** Primer día del período (`AAAA-MM-DD`), o `''` para el mes actual. */
  readonly from: string;
  readonly to: string;
  readonly collectorId: string;
  readonly portfolioId: string;
}

export const EMPTY_STATS_FILTERS: StatsFilters = { from: '', to: '', collectorId: '', portfolioId: '' };

/**
 * Filtros a partir de los parámetros de la URL. Todo valor inválido se descarta: un período solo
 * vale si trae las dos fechas, ambas reales y en orden; los ids deben ser UUID. Así la URL nunca
 * produce una consulta que la API rechace.
 */
export function parseStatsFilters(params: SearchParams): StatsFilters {
  // A diferencia de otras pantallas, un período de estadísticas solo vale con las dos fechas reales.
  const both = isCalendarDate(singleParam(params.desde)) && isCalendarDate(singleParam(params.hasta));
  const range = both ? dateRangeParams(params) : { from: '', to: '' };
  return { ...range, collectorId: idParam(params.cobrador), portfolioId: idParam(params.cartera) };
}

/** Cuerpo de la consulta de estadísticas para unos filtros; lo vacío no se envía. */
export function toStatsBody(filters: StatsFilters): LenderStatsBody {
  return {
    ...(filters.from !== '' && { dateRange: { from: filters.from, to: filters.to } }),
    ...(filters.collectorId !== '' && { collectorMembershipId: filters.collectorId }),
    ...(filters.portfolioId !== '' && { portfolioId: filters.portfolioId }),
  };
}

/** Qué lista larga se ve completa (paginada) en lugar de sus 5 primeras filas, y en qué página. */
export interface StatsListPages {
  /** `?mora=`: página del ranking de mayor mora. */
  readonly arrears: number | null;
  /** `?desempeno=`: página del desempeño por cobrador. */
  readonly collectors: number | null;
}

/** Páginas de las listas largas a partir de la URL; sin el parámetro, la lista muestra sus 5 primeras filas. */
export function parseStatsListPages(params: SearchParams): StatsListPages {
  return {
    arrears: params.mora === undefined ? null : parsePageParam(params.mora),
    collectors: params.desempeno === undefined ? null : parsePageParam(params.desempeno),
  };
}

/** Dirección de Estadísticas con los filtros activos y, opcionalmente, una lista larga en una página. */
export function statsHref(filters: StatsFilters, list?: { readonly name: 'mora' | 'desempeno'; readonly page: number }): string {
  return pageHref('/estadisticas', 1, {
    desde: filters.from,
    hasta: filters.from === '' ? '' : filters.to,
    cobrador: filters.collectorId,
    cartera: filters.portfolioId,
    ...(list && { [list.name]: String(list.page) }),
  });
}
