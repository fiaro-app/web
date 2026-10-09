import 'server-only';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { visitEndpoints } from '@/features/visits/endpoints';
import { toVisitRows, type VisitRow } from '@/features/visits/visits-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Historial de cobros de un préstamo con el nombre de cada cobrador. Es un dato de apoyo del
 * detalle: si la API falla, el préstamo se muestra sin historial en vez de romperse; un fallo que
 * no sea de la API sí se propaga.
 */
export async function getLoanVisits(loanId: string): Promise<readonly VisitRow[]> {
  try {
    const [visits, lookup] = await Promise.all([
      callEndpointAsUser(visitEndpoints.list, { params: { loanId } }),
      getSettlementLookup(),
    ]);
    return toVisitRows(visits, lookup.collectorNames);
  } catch (error) {
    if (isApiRequestError(error)) return [];
    throw error;
  }
}
