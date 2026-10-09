import type { NotificationSeverity } from '@fiaro-app/contracts';
import type { NotificationResponse } from '@/features/notifications/endpoints';
import { notificationHref } from '@/features/notifications/notification-link';
import { businessDateOf, formatBusinessDate } from '@/lib/dates';
import type { Tone } from '@/lib/tone';

/** Color de cada nivel de importancia, con las intenciones del sistema de diseño. */
const SEVERITY_TONE: Record<NotificationSeverity, Tone> = {
  ALERT: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
  INFO: 'info',
};

/** Una notificación lista para pintar. */
export interface NotificationItem {
  readonly id: string;
  readonly tone: Tone;
  readonly title: string;
  readonly body: string;
  /** Día en que llegó, en hora de Colombia (`09/10/2026`). */
  readonly date: string;
  readonly read: boolean;
  /** Pantalla a la que lleva, o `null` si no lleva a ninguna. */
  readonly href: string | null;
}

export interface NotificationsViewModel {
  readonly items: readonly NotificationItem[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** `true` cuando solo se muestran las no leídas. */
  readonly unreadOnly: boolean;
}

/** Convierte una página de notificaciones de la API en elementos para la lista. */
export function toNotificationsViewModel(
  notifications: readonly NotificationResponse[],
  pageInfo: { readonly total: number; readonly page: number; readonly pageSize: number },
  unreadOnly: boolean,
): NotificationsViewModel {
  const items = notifications.map<NotificationItem>((notification) => ({
    id: notification.id,
    tone: SEVERITY_TONE[notification.severity],
    title: notification.title,
    body: notification.body,
    date: formatBusinessDate(businessDateOf(new Date(notification.createdAt))),
    read: notification.readAt !== null,
    href: notificationHref(notification.relatedEntityType, notification.relatedEntityId),
  }));
  return { items, ...pageInfo, unreadOnly };
}
