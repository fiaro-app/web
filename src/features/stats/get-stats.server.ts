import 'server-only';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { statsEndpoints } from '@/features/stats/endpoints';
import { toStatsBody, type StatsFilters } from '@/features/stats/stats-filters';
import { toStatsViewModel, type StatsViewModel } from '@/features/stats/stats-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type StatsResult =
  | { readonly status: 'ok'; readonly stats: StatsViewModel }
  /** La persona no puede ver las estadísticas del negocio (403). */
  | { readonly status: 'forbidden' };

/**
 * Trae las estadísticas del período y filtros pedidos, con los nombres de cartera de cada cobrador.
 * Un 403 es un estado de la pantalla; cualquier otra falla se propaga al `error.tsx`.
 */
export async function getStats(filters: StatsFilters): Promise<StatsResult> {
  try {
    const [stats, lookup] = await Promise.all([
      callEndpointAsUser(statsEndpoints.get, { body: toStatsBody(filters) }),
      getSettlementLookup(),
    ]);
    return { status: 'ok', stats: toStatsViewModel(stats, lookup) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
