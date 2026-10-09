import 'server-only';
import { EMPTY_LOOKUP, toDashboardViewModel, type DashboardViewModel } from '@/features/dashboard/dashboard-view-model';
import { dashboardEndpoints, type LenderDashboard } from '@/features/dashboard/endpoints';
import { getSettlementLookup } from '@/features/settlements/get-settlement-lookup.server';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type DashboardResult =
  | { readonly status: 'ok'; readonly dashboard: DashboardViewModel }
  /** La persona no tiene un negocio activo (membresía) con el que ver el resumen. */
  | { readonly status: 'no-business' };

async function toResult(summary: LenderDashboard): Promise<DashboardResult> {
  const lookup = summary.pendingSettlements.length > 0 ? await getSettlementLookup() : EMPTY_LOOKUP;
  return { status: 'ok', dashboard: toDashboardViewModel(summary, lookup) };
}

/**
 * Trae el resumen del negocio de quien hace la petición, ya convertido a lo que pinta la pantalla.
 * Sin membresía activa la API responde 403 `FORBIDDEN`: eso es un estado de la pantalla, no un
 * error. Cualquier otra falla (API caída, respuesta fuera de contrato) se propaga al `error.tsx`.
 */
export async function getLenderDashboard(): Promise<DashboardResult> {
  try {
    return await toResult(await callEndpointAsUser(dashboardEndpoints.summary, {}));
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) {
      return { status: 'no-business' };
    }
    throw error;
  }
}
