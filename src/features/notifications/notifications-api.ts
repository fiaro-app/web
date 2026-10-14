import { notificationEndpoints } from '@/features/notifications/endpoints';
import { callEndpoint } from '@/lib/api';

/** Marca una notificación como leída. */
export function markNotificationRead(id: string) {
  return callEndpoint(notificationEndpoints.markRead, { params: { id } });
}

/** Marca como leídas todas las notificaciones sin leer de la persona; devuelve cuántas marcó. */
export function markAllNotificationsRead() {
  return callEndpoint(notificationEndpoints.markAllRead, { body: {} });
}
