import 'server-only';
import { settlementEndpoints } from '@/features/settlements/endpoints';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { toSettlementDetailView, type SettlementDetailView } from '@/features/settlements/settlements-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type SettlementResult =
  | { readonly status: 'ok'; readonly settlement: SettlementDetailView }
  | { readonly status: 'not-found' }
  | { readonly status: 'forbidden' };

/** Trae un cuadre por id. 404 y 403 son estados de la pantalla; cualquier otra falla se propaga. */
export async function getSettlement(id: string): Promise<SettlementResult> {
  try {
    const [settlement, lookup] = await Promise.all([
      callEndpointAsUser(settlementEndpoints.get, { params: { id } }),
      getSettlementLookup(),
    ]);
    return { status: 'ok', settlement: toSettlementDetailView(settlement, lookup) };
  } catch (error) {
    if (isApiRequestError(error)) {
      if (error.hasCode('NOT_FOUND')) return { status: 'not-found' };
      if (error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    }
    throw error;
  }
}
