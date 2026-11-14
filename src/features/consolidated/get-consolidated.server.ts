import 'server-only';
import { CONSOLIDATED_TEXT } from '@/content/consolidated';
import { consolidatedEndpoints } from '@/features/consolidated/endpoints';
import { toConsolidatedView, type ConsolidatedView } from '@/features/consolidated/consolidated-view-model';
import type { StatsFilters } from '@/features/stats/stats-filters';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Las cifras de todos los negocios para el período de los filtros. Es un complemento de Estadísticas: si
 * falla (API caída, o plan sin la función) devuelve `null` y el resto de la pantalla se pinta igual.
 */
export async function getConsolidated(filters: StatsFilters): Promise<ConsolidatedView | null> {
  try {
    const body = filters.from === '' ? {} : { dateRange: { from: filters.from, to: filters.to } };
    return toConsolidatedView(await callEndpointAsUser(consolidatedEndpoints.get, { body }), CONSOLIDATED_TEXT.total);
  } catch {
    return null;
  }
}
