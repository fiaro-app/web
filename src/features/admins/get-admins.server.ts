import 'server-only';
import { MAX_PAGE_SIZE } from '@fiaro-app/contracts';
import { toAdminsViewModel, type AdminsViewModel } from '@/features/admins/admins-view-model';
import { getAccess } from '@/features/app-shell/get-access.server';
import { membershipEndpoints } from '@/features/memberships/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

export type AdminsResult =
  | { readonly status: 'ok'; readonly admins: AdminsViewModel }
  /** Quien consulta no puede ver colaboradores (por ejemplo, un cobrador): la API responde 403. */
  | { readonly status: 'forbidden' };

/**
 * Trae los administradores activos y los colaboradores activos (cobradores) a quienes se les puede subir de rango. Un 403 es
 * un estado de la pantalla; cualquier otra falla se propaga al `error.tsx`.
 *
 * shortcut: solo la primera página (hasta 50) de cobradores para subir de rango; pasar a un buscador si un negocio tiene más.
 */
export async function getAdmins(): Promise<AdminsResult> {
  try {
    const [admins, collectors, access] = await Promise.all([
      callEndpointAsUser(membershipEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE, role: 'LENDER', status: 'ACTIVE' } }),
      callEndpointAsUser(membershipEndpoints.list, { body: { page: 1, pageSize: MAX_PAGE_SIZE, role: 'COLLECTOR', status: 'ACTIVE' } }),
      getAccess(),
    ]);
    return { status: 'ok', admins: toAdminsViewModel(admins.data, collectors.data, access.membershipId) };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
