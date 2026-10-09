import { notificationEndpoints } from '@/features/notifications/endpoints';
import { callEndpoint } from '@/lib/api';

/** Marca una notificación como leída. */
export function markNotificationRead(id: string) {
  return callEndpoint(notificationEndpoints.markRead, { params: { id } });
}
