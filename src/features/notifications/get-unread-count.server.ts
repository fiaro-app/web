import 'server-only';
import { notificationEndpoints } from '@/features/notifications/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Cuántas notificaciones sin leer tiene la persona de la sesión (`GET /notifications/unread-count`,
 * un `COUNT` sin traer filas). Es un adorno de la barra lateral: si la API falla devuelve 0 en vez de tumbar
 * el panel; un fallo que no sea de la API (un bug) sí se propaga.
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const { count } = await callEndpointAsUser(notificationEndpoints.unreadCount, {});
    return count;
  } catch (error) {
    if (isApiRequestError(error)) return 0;
    throw error;
  }
}
