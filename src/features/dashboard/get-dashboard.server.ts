import 'server-only';
import { dashboardEndpoints } from '@/features/dashboard/endpoints';
import { toDashboardViewModel, type DashboardViewModel } from '@/features/dashboard/dashboard-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type DashboardResult =
  | { readonly status: 'ok'; readonly dashboard: DashboardViewModel }
  /** La persona no tiene un negocio activo (membresía) con el que ver el resumen. */
  | { readonly status: 'no-business' };

/**
 * Trae el resumen del negocio de quien hace la petición, ya convertido a lo que pinta la pantalla.
 * Sin membresía activa la API responde 403 `FORBIDDEN`: eso es un estado de la pantalla, no un
 * error. Cualquier otra falla (API caída, respuesta fuera de contrato) se propaga al `error.tsx`.
 */
export async function getLenderDashboard(): Promise<DashboardResult> {
  try {
    const summary = await callEndpointAsUser(dashboardEndpoints.summary, {});
    return { status: 'ok', dashboard: toDashboardViewModel(summary) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) {
      return { status: 'no-business' };
    }
    throw error;
  }
}
