import 'server-only';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { toCollectorsViewModel, type CollectorsViewModel } from '@/features/collectors/collectors-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type CollectorsResult =
  | { readonly status: 'ok'; readonly collectors: CollectorsViewModel }
  /** Quien consulta no puede ver colaboradores (por ejemplo, un cobrador): la API responde 403. */
  | { readonly status: 'forbidden' };

/**
 * Trae una página de cobradores con el nombre de su cartera. Un 403 es un estado de la pantalla;
 * cualquier otra falla se propaga al `error.tsx`.
 */
export async function getCollectors(page: number): Promise<CollectorsResult> {
  try {
    const [list, portfolios] = await Promise.all([
      callEndpointAsUser(membershipEndpoints.list, { body: { page, pageSize: 20, role: 'COLLECTOR' } }),
      callEndpointAsUser(lenderEndpoints.portfolios, {}),
    ]);
    return { status: 'ok', collectors: toCollectorsViewModel(list.data, portfolios, list.meta) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
