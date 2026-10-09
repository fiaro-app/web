import 'server-only';
import type { SettlementStatus } from '@fiaro-app/contracts';
import { settlementEndpoints } from '@/features/settlements/endpoints';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { toSettlementsViewModel, type SettlementsViewModel } from '@/features/settlements/settlements-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type SettlementsResult =
  | { readonly status: 'ok'; readonly settlements: SettlementsViewModel }
  /** La persona no tiene un negocio activo con el que ver cuadres (403). */
  | { readonly status: 'forbidden' };

/** Trae una página de cuadres, con filtro opcional por estado, y los nombres de sus cobradores. */
export async function getSettlements(page: number, status: SettlementStatus | null): Promise<SettlementsResult> {
  try {
    const [result, lookup] = await Promise.all([
      callEndpointAsUser(settlementEndpoints.list, { body: { page, pageSize: 20, ...(status && { status }) } }),
      getSettlementLookup(),
    ]);
    return { status: 'ok', settlements: toSettlementsViewModel(result.data, lookup, result.meta, status) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
