import 'server-only';
import { getClientName } from '@/features/loans/get-client-names.server';
import { loanRequestEndpoints, type LoanRequestStatus } from '@/features/loan-requests/endpoints';
import { toLoanRequestsViewModel, type LoanRequestsViewModel } from '@/features/loan-requests/loan-requests-view-model';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';
import { LIST_PAGE_SIZE } from '@/lib/pagination';

export type LoanRequestsResult =
  | { readonly status: 'ok'; readonly requests: LoanRequestsViewModel }
  /** La persona no tiene un negocio activo con el que ver solicitudes (403). */
    | { readonly status: 'forbidden' };

/**
 * Trae una página de solicitudes con el filtro de estado pedido, los nombres de sus cobradores y
 * los de los clientes del negocio. Un 403 es un estado de la pantalla; cualquier otra falla se
 * propaga al `error.tsx`.
 */
export async function getLoanRequests(page: number, status: LoanRequestStatus | null): Promise<LoanRequestsResult> {
  try {
    const [result, lookup] = await Promise.all([
      callEndpointAsUser(loanRequestEndpoints.list, { body: { page, pageSize: LIST_PAGE_SIZE, ...(status && { status }) } }),
      getSettlementLookup(),
    ]);
    const clientIds = [...new Set(result.data.flatMap((request) => (request.clientId === null ? [] : [request.clientId])))];
    const names = await Promise.all(clientIds.map(async (id) => [id, await getClientName(id)] as const));
    const clientNames = new Map(names.flatMap(([id, name]) => (name === undefined ? [] : [[id, name] as const])));
    return { status: 'ok', requests: toLoanRequestsViewModel(result.data, result.meta, status, lookup, clientNames) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
