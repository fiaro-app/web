import 'server-only';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { visitEndpoints } from '@/features/visits/endpoints';
import { toVisitReportBody, type VisitReportFilters } from '@/features/visits/visit-report-filters';
import { toVisitReportViewModel, type VisitReportViewModel } from '@/features/visits/visits-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Cobradores entre los que se puede filtrar. */
export interface VisitReportCollectorOption {
  readonly id: string;
  readonly name: string;
}

export type VisitReportResult =
  | { readonly status: 'ok'; readonly report: VisitReportViewModel; readonly collectors: readonly VisitReportCollectorOption[] }
  /** La persona no puede ver los cobros del negocio (un cobrador recibe 403). */
  | { readonly status: 'forbidden' };

const PAGE_SIZE = 20;

/**
 * Trae una página de «Cobros del día» con los filtros pedidos y los cobradores para el selector.
 * Un 403 es un estado de la pantalla; cualquier otra falla se propaga al `error.tsx`.
 */
export async function getVisitReport(filters: VisitReportFilters, page: number): Promise<VisitReportResult> {
  try {
    const [report, lookup] = await Promise.all([
      callEndpointAsUser(visitEndpoints.report, { body: toVisitReportBody(filters, page, PAGE_SIZE) }),
      getSettlementLookup(),
    ]);
    return {
      status: 'ok',
      report: toVisitReportViewModel(report),
      collectors: [...lookup.collectorNames].map(([id, name]) => ({ id, name })),
    };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
