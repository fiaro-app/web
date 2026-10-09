import type { SettlementStatus } from '@fiaro-app/contracts';
import type { ListSettlementsBody } from '@/features/settlements/endpoints';
import { dateRangeParams, idParam, type SearchParams } from '@/lib/search-params';

/** Filtros de «Cuadres» además del estado, tal como viajan en la URL (`?desde=&hasta=&cobrador=&cartera=`). */
export interface SettlementFilters {
  /** Primer día (`AAAA-MM-DD`) de la fecha del cuadre, o `''` para todas. */
  readonly from: string;
  readonly to: string;
  readonly collectorId: string;
  readonly portfolioId: string;
}

export const EMPTY_SETTLEMENT_FILTERS: SettlementFilters = { from: '', to: '', collectorId: '', portfolioId: '' };

/**
 * Filtros a partir de los parámetros de la URL. Todo valor inválido se descarta: con una sola fecha
 * se filtra ese día, el rango debe estar en orden y los ids deben ser UUID. Así la URL nunca produce
 * una consulta que la API rechace.
 */
export function parseSettlementFilters(params: SearchParams): SettlementFilters {
  return { ...dateRangeParams(params), collectorId: idParam(params.cobrador), portfolioId: idParam(params.cartera) };
}

/** Cuerpo de la consulta de cuadres para una página, un estado y unos filtros; lo vacío no se envía. */
export function toSettlementsBody(
  page: number,
  pageSize: number,
  status: SettlementStatus | null,
  filters: SettlementFilters,
): ListSettlementsBody {
  return {
    page,
    pageSize,
    ...(status && { status }),
    ...(filters.from !== '' && { dateRange: { from: filters.from, to: filters.to } }),
    ...(filters.collectorId !== '' && { collectorMembershipId: filters.collectorId }),
    ...(filters.portfolioId !== '' && { portfolioId: filters.portfolioId }),
  };
}
