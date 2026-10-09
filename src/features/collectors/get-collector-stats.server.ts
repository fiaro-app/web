import 'server-only';
import { collectorEndpoints } from '@/features/collectors/endpoints';
import { toCollectorStatsView, type CollectorStatsView } from '@/features/collectors/collector-stats-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Desempeño del mes de un cobrador. Es un dato de apoyo de su ficha: si la API falla, la ficha se
 * muestra sin él en vez de romperse; un fallo que no sea de la API sí se propaga.
 */
export async function getCollectorStats(collectorId: string): Promise<CollectorStatsView | null> {
  try {
    const stats = await callEndpointAsUser(collectorEndpoints.stats, { params: { id: collectorId } });
    return toCollectorStatsView(stats);
  } catch (error) {
    if (isApiRequestError(error)) return null;
    throw error;
  }
}
