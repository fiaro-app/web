import 'server-only';
import { accountEndpoints } from '@/features/account/endpoints';
import { toSessionRows, type SessionRow } from '@/features/account/sessions-view-model';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Sesiones abiertas de la persona. Es un dato de apoyo de «Mi cuenta»: si la API falla, la pantalla
 * sigue con los botones de cerrar sesiones y sin la lista; un fallo que no sea de la API sí se propaga.
 */
export async function getAccountSessions(): Promise<readonly SessionRow[]> {
  try {
    return toSessionRows(await callEndpointAsUser(accountEndpoints.sessions, {}));
  } catch (error) {
    if (isApiRequestError(error)) return [];
    throw error;
  }
}
