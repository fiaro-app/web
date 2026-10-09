import 'server-only';
import { getPortfolioOptions, type PortfolioOption } from '@/features/collectors/get-portfolio-options.server';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { statsEndpoints } from '@/features/stats/endpoints';
import { toStatsBody, type StatsFilters } from '@/features/stats/stats-filters';
import { toStatsViewModel, type StatsViewModel } from '@/features/stats/stats-view-model';
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

/**
 * Trae las estadísticas del período y filtros pedidos, con los nombres de cartera de cada cobrador.
 * Un 403 es un estado de la pantalla; cualquier otra falla se propaga al `error.tsx`.
 */
export async function getStats(filters: StatsFilters): Promise<StatsResult> {
  try {
    const [stats, lookup, portfolios] = await Promise.all([
      callEndpointAsUser(statsEndpoints.get, { body: { ...toStatsBody(filters), includePrevious: true } }),
      getSettlementLookup(),
      getPortfolioOptions(),
    ]);
    const collectors = [...lookup.collectorNames].map(([id, name]) => ({ id, name }));
    return { status: 'ok', stats: toStatsViewModel(stats, lookup), options: { collectors, portfolios } };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
