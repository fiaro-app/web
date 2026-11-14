import 'server-only';
import { notificationEndpoints } from '@/features/notifications/endpoints';
import { toNotificationsViewModel, type NotificationsViewModel } from '@/features/notifications/notifications-view-model';
import { LIST_PAGE_SIZE } from '@/lib/pagination';
import { callEndpointAsUser } from '@/lib/api/server-call';

/**
 * Trae una página de notificaciones de la persona de la sesión (las de todos sus negocios), con
 * filtro opcional de no leídas. Sin 403 que atender: pertenecen a la persona, no a un negocio.
 */
export async function getNotifications(page: number, unreadOnly: boolean): Promise<NotificationsViewModel> {
  const result = await callEndpointAsUser(notificationEndpoints.list, {
    body: { page, pageSize: LIST_PAGE_SIZE, ...(unreadOnly && { unreadOnly }) },
  });
  return toNotificationsViewModel(result.data, result.meta, unreadOnly);
}
