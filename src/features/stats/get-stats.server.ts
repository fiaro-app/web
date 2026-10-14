import 'server-only';
import { getPortfolioOptions, type PortfolioOption } from '@/features/collectors/get-portfolio-options.server';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { statsEndpoints } from '@/features/stats/endpoints';
import { toStatsBody, type StatsFilters, type StatsListPages } from '@/features/stats/stats-filters';
import {
  toCollectorPerformanceView,
  toStatsViewModel,
  toTopArrearsView,
  type StatsViewModel,
} from '@/features/stats/stats-view-model';
import type { SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import { LIST_PAGE_SIZE } from '@/lib/pagination';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Lo que se puede elegir en los filtros de la pantalla. */
export interface StatsFilterOptions {
  readonly collectors: readonly { readonly id: string; readonly name: string }[];
  readonly portfolios: readonly PortfolioOption[];
}

export type StatsResult =
  | { readonly status: 'ok'; readonly stats: StatsViewModel; readonly options: StatsFilterOptions }
  /** La persona no puede ver las estadísticas del negocio (403). */
  | { readonly status: 'forbidden' };

const NO_LIST_PAGES: StatsListPages = { arrears: null, collectors: null };

const pageInfo = (meta: { readonly page: number; readonly pageSize: number; readonly total: number }) => ({
  page: meta.page,
  pages: Math.max(1, Math.ceil(meta.total / meta.pageSize)),
  total: meta.total,
});

/** Una página del ranking completo de mayor mora (`?mora=`), con los mismos filtros. */
async function topArrearsPage(filters: StatsFilters, page: number) {
  const body = toStatsBody(filters);
  const result = await callEndpointAsUser(statsEndpoints.topArrears, {
    body: { page, pageSize: LIST_PAGE_SIZE, collectorMembershipId: body.collectorMembershipId, portfolioId: body.portfolioId },
  });
  return { topArrears: result.data.map(toTopArrearsView), topArrearsPage: pageInfo(result.meta) };
}

/** Una página del desempeño de todos los cobradores (`?desempeno=`), con el período y la cartera. */
async function collectorsPage(filters: StatsFilters, page: number, lookup: SettlementLookup) {
  const body = toStatsBody(filters);
  const result = await callEndpointAsUser(statsEndpoints.collectorPerformance, {
    body: { page, pageSize: LIST_PAGE_SIZE, dateRange: body.dateRange, portfolioId: body.portfolioId },
  });
  return { collectors: result.data.map((entry) => toCollectorPerformanceView(entry, lookup)), collectorsPage: pageInfo(result.meta) };
}

/**
 * Trae las estadísticas del período y filtros pedidos, con los nombres de cartera de cada cobrador.
 * El ranking de mora y el desempeño traen sus 5 primeras filas; con `lists` una de ellas (o las dos)
 * se cambia por la página pedida de su lista completa. Un 403 es un estado de la pantalla; cualquier
 * otra falla se propaga al `error.tsx`.
 */
export async function getStats(filters: StatsFilters, lists: StatsListPages = NO_LIST_PAGES): Promise<StatsResult> {
  try {
    const [stats, lookup, portfolios] = await Promise.all([
      callEndpointAsUser(statsEndpoints.get, { body: { ...toStatsBody(filters), includePrevious: true } }),
      getSettlementLookup(),
      getPortfolioOptions(),
    ]);
    const [arrears, performance] = await Promise.all([
      lists.arrears === null ? {} : topArrearsPage(filters, lists.arrears),
      lists.collectors === null ? {} : collectorsPage(filters, lists.collectors, lookup),
    ]);
    const collectors = [...lookup.collectorNames].map(([id, name]) => ({ id, name }));
    return { status: 'ok', stats: { ...toStatsViewModel(stats, lookup), ...arrears, ...performance }, options: { collectors, portfolios } };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
