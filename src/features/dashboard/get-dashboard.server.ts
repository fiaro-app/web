import 'server-only';
import { MAX_PAGE_SIZE } from '@fiaro-app/contracts';
import { buildSettlementLookup } from '@/features/dashboard/build-lookup';
import {
  EMPTY_LOOKUP,
  toDashboardViewModel,
  type DashboardViewModel,
  type SettlementLookup,
} from '@/features/dashboard/dashboard-view-model';
import { dashboardEndpoints, type LenderDashboard } from '@/features/dashboard/endpoints';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type DashboardResult =
  | { readonly status: 'ok'; readonly dashboard: DashboardViewModel }
  /** La persona no tiene un negocio activo (membresía) con el que ver el resumen. */
  | { readonly status: 'no-business' };

/**
 * Los nombres de cobradores y carteras completan la tabla de cuadres: si no se pueden traer (la
 * persona no puede listar colaboradores, o falló la consulta) la tabla sigue con sus valores de
 * respaldo en vez de romper todo el resumen.
 */
async function loadLookup(): Promise<SettlementLookup> {
  try {
    const [collectors, portfolios] = await Promise.all([
      callEndpointAsUser(membershipEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE, role: 'COLLECTOR' } }),
      callEndpointAsUser(lenderEndpoints.portfolios, {}),
    ]);
    return buildSettlementLookup(collectors.data, portfolios);
  } catch (error) {
    if (isApiRequestError(error)) return EMPTY_LOOKUP;
    throw error;
  }
}

async function toResult(summary: LenderDashboard): Promise<DashboardResult> {
  const lookup = summary.pendingSettlements.length > 0 ? await loadLookup() : EMPTY_LOOKUP;
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
