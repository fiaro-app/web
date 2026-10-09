import 'server-only';
import { notificationEndpoints } from '@/features/notifications/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Cuántas notificaciones sin leer tiene la persona de la sesión. Pide una sola fila y lee el total
 * de la paginación. Es un adorno de la barra lateral: si la API falla devuelve 0 en vez de tumbar
 * el panel; un fallo que no sea de la API (un bug) sí se propaga.
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const { meta } = await callEndpointAsUser(notificationEndpoints.list, {
      body: { page: 1, pageSize: 1, unreadOnly: true },
    });
    return meta.total;
  } catch (error) {
    if (isApiRequestError(error)) return 0;
    throw error;
  }
}
