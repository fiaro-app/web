import 'server-only';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { toCollectorsViewModel, type CollectorsViewModel } from '@/features/collectors/collectors-view-model';
import { isApiRequestError } from '@/lib/api';
import { LIST_PAGE_SIZE } from '@/lib/pagination';
import { toMembershipStatus, type CollectorStatusFilter } from '@/features/collectors/status-filter';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type CollectorsResult =
  | { readonly status: 'ok'; readonly collectors: CollectorsViewModel }
  /** Quien consulta no puede ver colaboradores (por ejemplo, un cobrador): la API responde 403. */
  | { readonly status: 'forbidden' };

/** El filtro de estado como cuerpo de la consulta (nada si son todos). */
function statusOf(filter: CollectorStatusFilter) {
  const status = toMembershipStatus(filter);
  return status === undefined ? {} : { status };
}

/**
 * Trae una página de cobradores (por defecto, los activos) con el nombre de su cartera. Un 403 es un estado de la pantalla;
 * cualquier otra falla se propaga al `error.tsx`.
 */
export async function getCollectors(page: number, filter: CollectorStatusFilter = 'activos'): Promise<CollectorsResult> {
  try {
    const [list, portfolios] = await Promise.all([
      callEndpointAsUser(membershipEndpoints.list, { body: { page, pageSize: LIST_PAGE_SIZE, role: 'COLLECTOR', ...statusOf(filter) } }),
      callEndpointAsUser(lenderEndpoints.portfolios, {}),
    ]);
    return { status: 'ok', collectors: { ...toCollectorsViewModel(list.data, portfolios, list.meta), filter } };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
