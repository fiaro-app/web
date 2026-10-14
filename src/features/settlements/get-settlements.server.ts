import 'server-only';
import type { SettlementStatus } from '@fiaro-app/contracts';
import { getPortfolioOptions, type PortfolioOption } from '@/features/collectors/get-portfolio-options.server';
import { settlementEndpoints } from '@/features/settlements/endpoints';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { EMPTY_SETTLEMENT_FILTERS, toSettlementsBody, type SettlementFilters } from '@/features/settlements/settlement-filters';
import { toSettlementsViewModel, type SettlementsViewModel } from '@/features/settlements/settlements-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Lo que se puede elegir en los filtros de la pantalla. */
export interface SettlementFilterOptions {
  readonly collectors: readonly { readonly id: string; readonly name: string }[];
  readonly portfolios: readonly PortfolioOption[];
}

export type SettlementsResult =
  | { readonly status: 'ok'; readonly settlements: SettlementsViewModel; readonly options: SettlementFilterOptions }
  /** La persona no tiene un negocio activo con el que ver cuadres (403). */
  | { readonly status: 'forbidden' };

/**
 * Trae una página de cuadres con los filtros pedidos (estado, fechas, cobrador y cartera), los
 * nombres de sus cobradores y las opciones de los filtros. Un 403 es un estado de la pantalla;
 * cualquier otra falla se propaga al `error.tsx`.
 */
export async function getSettlements(
  page: number,
  status: SettlementStatus | null,
  filters: SettlementFilters = EMPTY_SETTLEMENT_FILTERS,
): Promise<SettlementsResult> {
  try {
    const [result, lookup, portfolios] = await Promise.all([
      callEndpointAsUser(settlementEndpoints.list, { body: toSettlementsBody(page, 20, status, filters) }),
      getSettlementLookup(),
      getPortfolioOptions(),
    ]);
    return {
      status: 'ok',
      settlements: toSettlementsViewModel(result.data, lookup, result.meta, status, filters),
      options: { collectors: [...lookup.collectorNames].map(([id, name]) => ({ id, name })), portfolios },
    };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
