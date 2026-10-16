import 'server-only';
import { routeEndpoints } from '@/features/routes/endpoints';
import { toRoutesBody, type RouteFilters } from '@/features/routes/route-filters';
import { toRoutesViewModel, type RoutesViewModel } from '@/features/routes/routes-view-model';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';
import { LIST_PAGE_SIZE } from '@/lib/pagination';

/** Cobradores entre los que se puede filtrar. */
export interface RouteCollectorOption {
  readonly id: string;
  readonly name: string;
}

export type RoutesResult =
  | { readonly status: 'ok'; readonly routes: RoutesViewModel; readonly collectors: readonly RouteCollectorOption[] }
  /** La persona no puede ver el registro de rutas (un cobrador recibe 403). */
  | { readonly status: 'forbidden' };

/**
 * Trae una página del registro de rutas con los filtros pedidos y los cobradores para el selector. Un 403 es un estado de
 * la pantalla; cualquier otra falla se propaga al `error.tsx`.
 */
export async function getRoutes(filters: RouteFilters, page: number): Promise<RoutesResult> {
  try {
    const [routes, lookup] = await Promise.all([
      callEndpointAsUser(routeEndpoints.list, { body: toRoutesBody(filters, page, LIST_PAGE_SIZE) }),
      getSettlementLookup(),
    ]);
    return {
      status: 'ok',
      routes: toRoutesViewModel(routes),
      collectors: [...lookup.collectorNames].map(([id, name]) => ({ id, name })),
    };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
